/**
 * Rebuilds data/visa-bulletin/{snapshots,current.json,history.json,ingest-log.json}
 * from the verified backfill dataset under data/visa-bulletin/_verified-backfill/.
 *
 * That dataset (five JSON files, ~6,600 rows) is the output of a cell-by-cell
 * re-verification against the official DOS Visa Bulletin archive covering
 * 2021-08 through 2026-07 — see docs/DATA-UPDATE-PLAYBOOK.md for how it was
 * produced and how to extend it with a new month going forward. Each row
 * carries `confidence` ("high" | "medium" | "unverified") and
 * `source_url`/`note` for audit; a `value` of `null` means the cell could not
 * be verified and is omitted (not guessed) — the site renders that as "—".
 *
 * Shape is additive to the pre-existing schema: the original `categories.
 * {eb1,eb2,eb3,eb5}.{india,china,row}` fields (read by src/lib/visa-bulletin.ts)
 * keep their exact old {fad, dff} string shape — every one of those 720 cells
 * (4 categories x 3 countries x 60 months) came back high-confidence, so no
 * null ever lands there. New category keys (eb3Other, eb4), new country keys
 * (mexico, philippines) and the new top-level `family` block are free to use
 * `null` for an unverified cell since no existing code reads them yet.
 *
 * Run: node scripts/build-visa-bulletin-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data", "visa-bulletin");
const backfillDir = join(dataDir, "_verified-backfill");
const snapshotsDir = join(dataDir, "snapshots");

const CATEGORY_KEY = {
  EB1: "eb1",
  EB2: "eb2",
  EB3: "eb3",
  EB3_OTHER: "eb3Other",
  EB4: "eb4",
  EB5_UNRESERVED: "eb5",
  F1: "f1",
  F2A: "f2a",
  F2B: "f2b",
  F3: "f3",
  F4: "f4",
};
const EMPLOYMENT_CATEGORIES = ["EB1", "EB2", "EB3", "EB3_OTHER", "EB4", "EB5_UNRESERVED"];

const COUNTRY_KEY = { IN: "india", CN: "china", MX: "mexico", PH: "philippines", ROW: "row" };
const CHART_KEY = { final_action: "fad", dates_for_filing: "dff" };

const DOS_ARCHIVE_URL = "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html";

function loadBackfillRows() {
  const files = readdirSync(backfillDir).filter((f) => f.endsWith(".json"));
  let rows = [];
  for (const f of files) {
    const arr = JSON.parse(readFileSync(join(backfillDir, f), "utf8"));
    rows = rows.concat(arr);
  }
  return rows;
}

function cutoffValue(value) {
  // "C" | "U" | ISO date pass through as-is; unverified -> null (never guessed).
  return value === undefined ? null : value;
}

function buildSnapshots(rows) {
  const byMonth = new Map();
  for (const r of rows) {
    if (!byMonth.has(r.bulletin_month)) {
      byMonth.set(r.bulletin_month, {
        bulletinMonth: r.bulletin_month,
        source: DOS_ARCHIVE_URL,
        sourceLabel: "U.S. Department of State Visa Bulletin archive",
        categories: {},
        family: {},
      });
    }
    const snap = byMonth.get(r.bulletin_month);
    const isEmployment = EMPLOYMENT_CATEGORIES.includes(r.category);
    const bucket = isEmployment ? snap.categories : snap.family;
    const catKey = CATEGORY_KEY[r.category];
    const countryKey = COUNTRY_KEY[r.country];
    const chartKey = CHART_KEY[r.chart_type];
    if (!bucket[catKey]) bucket[catKey] = {};
    if (!bucket[catKey][countryKey]) bucket[catKey][countryKey] = { fad: null, dff: null };
    bucket[catKey][countryKey][chartKey] = cutoffValue(r.value);
  }
  return byMonth;
}

/** history.json's sparse change-point series, keyed exactly as getSeries() expects: `${category}-${country}` -> {fad:[...], dff:[...]}. */
function buildHistory(byMonth) {
  const months = [...byMonth.keys()].sort();
  const series = {};
  const last = {}; // `${seriesKey}|${chartKey}` -> last recorded cutoff
  for (const month of months) {
    const snap = byMonth.get(month);
    for (const bucket of [snap.categories, snap.family]) {
      for (const [catKey, countries] of Object.entries(bucket)) {
        for (const [countryKey, chart] of Object.entries(countries)) {
          const seriesKey = `${catKey}-${countryKey}`;
          for (const chartKey of ["fad", "dff"]) {
            const cutoff = chart[chartKey];
            if (cutoff === null) continue; // unverified — no point recorded, not guessed
            const lastKey = `${seriesKey}|${chartKey}`;
            if (last[lastKey] === cutoff) continue;
            if (!series[seriesKey]) series[seriesKey] = { fad: [], dff: [] };
            series[seriesKey][chartKey].push([month, cutoff]);
            last[lastKey] = cutoff;
          }
        }
      }
    }
  }
  return series;
}

function main() {
  const rows = loadBackfillRows();
  console.log(`Loaded ${rows.length} verified rows from ${backfillDir}`);

  const nullRows = rows.filter((r) => r.value === null);
  const confidenceCounts = {};
  for (const r of rows) confidenceCounts[r.confidence] = (confidenceCounts[r.confidence] ?? 0) + 1;

  const byMonth = buildSnapshots(rows);
  const months = [...byMonth.keys()].sort();

  mkdirSync(snapshotsDir, { recursive: true });
  for (const month of months) {
    writeFileSync(
      join(snapshotsDir, `${month}.json`),
      JSON.stringify(byMonth.get(month), null, 2) + "\n"
    );
  }
  console.log(`Wrote ${months.length} snapshot files to ${snapshotsDir}`);

  // current.json preserves fields our backfill doesn't touch (eb5SetAsides,
  // the three adjustmentOfStatusChart* fields, notes) from whatever was there
  // before this run. NOTE: the chart fields describe the LATEST POSTED USCIS
  // determination, which lags the bulletin — carrying them forward blindly is
  // correct, but you must then re-check uscis.gov/visabulletininfo and set
  // adjustmentOfStatusChartStatus / adjustmentOfStatusChartMonth by hand.
  let prevCurrent = {};
  try {
    prevCurrent = JSON.parse(readFileSync(join(dataDir, "current.json"), "utf8"));
  } catch {
    // no prior file
  }

  const latestMonth = months[months.length - 1];
  const latestSnap = byMonth.get(latestMonth);
  const currentJson = {
    bulletinMonth: latestSnap.bulletinMonth,
    lastUpdated: new Date().toISOString().slice(0, 10),
    source: prevCurrent.source ?? DOS_ARCHIVE_URL,
    sourceLabel: prevCurrent.sourceLabel ?? "U.S. Department of State Visa Bulletin archive",
    adjustmentOfStatusChart: prevCurrent.adjustmentOfStatusChart ?? null,
    adjustmentOfStatusChartStatus: prevCurrent.adjustmentOfStatusChartStatus ?? "pending",
    adjustmentOfStatusChartMonth: prevCurrent.adjustmentOfStatusChartMonth ?? null,
    notes: prevCurrent.notes ?? "",
    categories: latestSnap.categories,
    family: latestSnap.family,
    ...(prevCurrent.eb5SetAsides ? { eb5SetAsides: prevCurrent.eb5SetAsides } : {}),
  };
  writeFileSync(join(dataDir, "current.json"), JSON.stringify(currentJson, null, 2) + "\n");
  console.log(`Wrote current.json for ${latestMonth}`);

  const series = buildHistory(byMonth);
  const historyJson = {
    lastUpdated: new Date().toISOString().slice(0, 10),
    source: DOS_ARCHIVE_URL,
    sourceLabel: "U.S. Department of State Visa Bulletin archive",
    notes:
      "Final Action Date (fad) and Dates for Filing (dff) cutoffs by bulletin month, machine-derived from data/visa-bulletin/snapshots/ (one fully-populated file per month) — never hand-edited directly. Each series is a sparse list of [bulletinMonth, cutoffDate] change-points; the cutoff carries forward (step function) until the next point. Re-verified cell-by-cell against the official DOS Visa Bulletin archive for 2021-08 through 2026-07 (see data/visa-bulletin/_verified-backfill/ for per-cell sources and confidence, and data/visa-bulletin/ingest-log.json for the verification run record). Months/cells with no confirmed value are simply absent from the series — render as unavailable, never estimated.",
    series,
  };
  writeFileSync(join(dataDir, "history.json"), JSON.stringify(historyJson, null, 2) + "\n");
  console.log(`Wrote history.json with ${Object.keys(series).length} series`);

  const indexJson = {
    lastUpdated: new Date().toISOString().slice(0, 10),
    source: DOS_ARCHIVE_URL,
    sourceLabel: "U.S. Department of State Visa Bulletin archive",
    current: latestMonth,
    months,
  };
  writeFileSync(join(dataDir, "index.json"), JSON.stringify(indexJson, null, 2) + "\n");
  console.log(`Wrote index.json (${months[0]} → ${months.at(-1)})`);

  const logPath = join(dataDir, "ingest-log.json");
  let log = [];
  try {
    log = JSON.parse(readFileSync(logPath, "utf8"));
  } catch {
    // first run
  }
  log.push({
    runAt: new Date().toISOString(),
    trigger: "manual-backfill-2021-08_2026-07",
    monthsProcessed: months.length,
    rowsWritten: rows.length - nullRows.length,
    rowsSkippedUnavailable: nullRows.length,
    confidenceCounts,
    errors: [],
  });
  writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");
  console.log(`Appended run to ingest-log.json`);
}

main();
