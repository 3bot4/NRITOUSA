/**
 * Daily market pipeline — entry point.
 *
 *   node scripts/pipeline/fetch-market.mjs          # fetch + write files
 *   DRY_RUN=1 node scripts/pipeline/fetch-market.mjs # fetch + print, no writes
 *
 * Fetches each item in an ISOLATED try/catch (one bad source never blocks the
 * others or fails the job), writes /data/market.json, appends a snapshot to
 * /data/history/YYYY-MM-DD.json, and maintains the trailing-30-entry USD/INR
 * history the sidebar sparkline reads. On a failed fetch it keeps the last good
 * value and flags it { stale: true } with its older timestamp.
 *
 * To add a ticker item: create scripts/pipeline/sources/<key>.mjs exporting
 * `meta` + `fetchValue()`, import it, and add it to SOURCES below. See README.
 */
import { join } from "node:path";
import * as usdinr from "./sources/usdinr.mjs";
import * as nifty50 from "./sources/nifty50.mjs";
import * as sp500 from "./sources/sp500.mjs";
import * as gold from "./sources/gold.mjs";
import {
  DATA_DIR,
  HISTORY_DIR,
  MARKET_JSON,
  readJson,
  writeJson,
  round,
  nowEtIso,
  nowEtLabel,
  etDate,
} from "./lib/util.mjs";

const SOURCES = [usdinr, nifty50, sp500, gold];
const HISTORY_DAYS = 30;
const DRY_RUN = !!process.env.DRY_RUN;

// Largest believable single-snapshot % move per item. A bigger jump is almost
// always a seed/baseline discontinuity or a bad tick rather than a real daily
// move (indices have circuit breakers well under this), so we treat it as a new
// baseline (changePct 0) instead of displaying an alarming, wrong number.
const MAX_MOVE_PCT = { usdinr: 5, nifty50: 10, sp500: 10, gold: 12 };

const MARKET_COMMENT =
  "Generated daily by scripts/pipeline/fetch-market.mjs (GitHub Actions). " +
  "The frontend reads ONLY this static file — no client-side API calls. " +
  "Per item: value, previous, changePct (vs previous snapshot), source, " +
  "fetchedAt (ET), stale. Schema documented in README.md.";

async function run() {
  const prev = readJson(MARKET_JSON, {}) || {};
  const prevItems = new Map(
    (prev.items ?? []).map((it) => [it.key, it])
  );

  const now = new Date();
  const items = [];
  const summary = [];

  for (const src of SOURCES) {
    const { key, label, unit, decimals } = src.meta;
    const last = prevItems.get(key);
    try {
      const { value, previous: srcPrev, source } = await src.fetchValue();
      const v = round(value, decimals);
      // Prefer the source's own prior observation (true day-over-day); else fall
      // back to our last committed snapshot; else self (first ever run).
      let previous = Number.isFinite(srcPrev)
        ? round(srcPrev, decimals)
        : last && Number.isFinite(last.value)
        ? last.value
        : v;
      let changePct =
        previous !== 0 ? round(((v - previous) / previous) * 100, 2) : 0;
      let note = "";
      if (Math.abs(changePct) > (MAX_MOVE_PCT[key] ?? 10)) {
        // Implausible jump → treat today's value as a fresh baseline.
        note = ` [baseline reset: ${changePct >= 0 ? "+" : ""}${changePct}% vs prior treated as 0]`;
        previous = v;
        changePct = 0;
      }
      items.push({
        key,
        label,
        value: v,
        previous,
        changePct,
        unit,
        decimals,
        source,
        fetchedAt: nowEtIso(now),
        stale: false,
      });
      summary.push(`  ✓ ${label.padEnd(10)} ${unit}${v} (${changePct >= 0 ? "+" : ""}${changePct}%) — ${source}${note}`);
    } catch (err) {
      if (last) {
        items.push({ ...last, stale: true });
        summary.push(`  ⚠ ${label.padEnd(10)} FETCH FAILED → keeping last good ${unit}${last.value} (stale). ${err.message}`);
      } else {
        summary.push(`  ✗ ${label.padEnd(10)} FETCH FAILED and no prior value to keep. ${err.message}`);
      }
    }
  }

  // USD/INR trailing history for the sparkline (only update on a fresh value).
  const history = Array.isArray(prev.usdinrHistory)
    ? [...prev.usdinrHistory]
    : [];
  const usd = items.find((i) => i.key === "usdinr");
  if (usd && !usd.stale) {
    const today = etDate(now);
    const filtered = history.filter((p) => p.date !== today);
    filtered.push({ date: today, value: usd.value });
    filtered.sort((a, b) => a.date.localeCompare(b.date));
    history.length = 0;
    history.push(...filtered.slice(-HISTORY_DAYS));
  }

  // EB-2 India FAD — reuse the EXISTING visa-bulletin data (no second parser).
  const vb = readJson(join(DATA_DIR, "visa-bulletin", "current.json"), {});
  const eb2IndiaFad = vb?.categories?.eb2?.india?.fad ?? null;

  const market = {
    _comment: MARKET_COMMENT,
    asOf: nowEtIso(now),
    asOfLabel: nowEtLabel(now),
    items,
    usdinrHistory: history,
  };

  const snapshot = {
    date: etDate(now),
    asOf: market.asOf,
    items,
    eb2IndiaFad,
  };

  console.log(`\nMarket refresh — ${market.asOfLabel}`);
  console.log(summary.join("\n"));
  console.log(`  · EB-2 India FAD (from visa-bulletin): ${eb2IndiaFad}`);

  if (DRY_RUN) {
    console.log("\nDRY_RUN=1 — no files written.\n");
    return;
  }

  writeJson(MARKET_JSON, market);
  writeJson(join(HISTORY_DIR, `${snapshot.date}.json`), snapshot);
  console.log(`\nWrote ${MARKET_JSON}`);
  console.log(`Wrote ${join(HISTORY_DIR, `${snapshot.date}.json`)}\n`);
}

// Never throw out of the process — a pipeline crash must not fail the workflow
// in a way that blocks other automation. Log and exit 0.
run().catch((err) => {
  console.error("Pipeline error (non-fatal):", err);
  process.exit(0);
});
