/**
 * Emit the empty 110-row backfill file for a new bulletin month, so that on
 * release day the job is reading cells off the DOS table and typing values —
 * not hand-assembling JSON under time pressure.
 *
 *   node scripts/scaffold-visa-bulletin-month.mjs 2026-10
 *   node scripts/scaffold-visa-bulletin-month.mjs 2026-10 --carry
 *
 * Writes data/visa-bulletin/_verified-backfill/visa-bulletin-backfill-YYYY-MM.json
 * with every value `null` and confidence `"unverified"`. Nothing is guessed:
 * `scripts/build-visa-bulletin-data.mjs` omits null cells rather than inventing
 * them, so a half-filled scaffold degrades to "—" in the UI instead of a wrong
 * date. Fill each `value` in from the bulletin, flip `confidence` to "high",
 * then run the build script.
 *
 * --carry additionally records the PRIOR month's verified value on each row as
 * `previous_value`. That field is ignored by the build script; it exists so the
 * person filling the file can see at a glance which cells actually moved, which
 * is the whole point of the monthly read. Delete it or leave it — it is inert.
 *
 * The source_url is derived, never typed: DOS files each bulletin under its
 * FISCAL year, so October 2026 lives under /2027/. Getting that wrong by hand
 * is how a source link silently 404s every October.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const backfillDir = join(root, "data", "visa-bulletin", "_verified-backfill");

const CATEGORIES = ["EB1", "EB2", "EB3", "EB3_OTHER", "EB4", "EB5_UNRESERVED", "F1", "F2A", "F2B", "F3", "F4"];
const COUNTRIES = ["IN", "CN", "MX", "PH", "ROW"];
const CHARTS = ["final_action", "dates_for_filing"];

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/** FY2027 runs Oct 1 2026 → Sep 30 2027, so October rolls into the next year. */
function fiscalYear(ym) {
  const [y, m] = ym.split("-").map(Number);
  return m >= 10 ? y + 1 : y;
}

function dosBulletinUrl(ym) {
  const [y, m] = ym.split("-").map(Number);
  return (
    "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/" +
    `${fiscalYear(ym)}/visa-bulletin-for-${MONTHS[m - 1]}-${y}.html`
  );
}

function prevMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}

const ym = process.argv[2];
const carry = process.argv.includes("--carry");
if (!/^\d{4}-\d{2}$/.test(ym ?? "")) {
  console.error("Usage: node scripts/scaffold-visa-bulletin-month.mjs YYYY-MM [--carry]");
  process.exit(1);
}

const out = join(backfillDir, `visa-bulletin-backfill-${ym}.json`);
if (existsSync(out)) {
  console.error(`Refusing to overwrite ${out} — delete it first if you mean to restart.`);
  process.exit(1);
}

/** Index every verified cell of the prior month, for --carry. */
let prior = new Map();
if (carry) {
  const pm = prevMonth(ym);
  for (const f of readdirSync(backfillDir).filter((f) => f.endsWith(".json"))) {
    for (const r of JSON.parse(readFileSync(join(backfillDir, f), "utf8"))) {
      if (r.bulletin_month === pm) {
        prior.set(`${r.category}|${r.country}|${r.chart_type}`, r.value);
      }
    }
  }
  if (prior.size === 0) console.warn(`! No verified rows found for ${pm} — --carry has nothing to show.`);
}

const source_url = dosBulletinUrl(ym);
const rows = [];
for (const category of CATEGORIES) {
  for (const country of COUNTRIES) {
    for (const chart_type of CHARTS) {
      const row = {
        bulletin_month: ym,
        category,
        country,
        chart_type,
        value: null,
        confidence: "unverified",
        source_url,
        note: "",
      };
      if (carry) row.previous_value = prior.get(`${category}|${country}|${chart_type}`) ?? null;
      rows.push(row);
    }
  }
}

writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`Wrote ${rows.length} rows → ${out}`);
console.log(`source_url: ${source_url}`);
console.log(`\nNext: fill each "value" ("C" = Current, "U" = Unavailable, "YYYY-MM-DD", null = could not verify),`);
console.log(`set "confidence" to "high", then: node scripts/build-visa-bulletin-data.mjs`);
