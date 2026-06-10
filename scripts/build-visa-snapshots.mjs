/**
 * Expand data/visa-bulletin/history.json (sparse change-point series) into
 * monthly snapshot files data/visa-bulletin/snapshots/YYYY-MM.json plus
 * data/visa-bulletin/index.json.
 *
 * Run after editing history.json / current.json each month:
 *   node scripts/build-visa-snapshots.mjs
 *
 * See docs/DATA-UPDATE-PLAYBOOK.md for the monthly update procedure.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data", "visa-bulletin");
const history = JSON.parse(readFileSync(join(dir, "history.json"), "utf8"));
const current = JSON.parse(readFileSync(join(dir, "current.json"), "utf8"));

const monthIndex = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
const indexToMonth = (i) =>
  `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;

// Collect the overall month range across all series.
let min = Infinity;
let max = -Infinity;
for (const series of Object.values(history.series)) {
  for (const points of [series.fad, series.dff]) {
    for (const [ym] of points ?? []) {
      min = Math.min(min, monthIndex(ym));
      max = Math.max(max, monthIndex(ym));
    }
  }
}
max = Math.max(max, monthIndex(current.bulletinMonth));

/** Step-function lookup: latest change-point at or before the given month. */
const valueAt = (points, mi) => {
  let v = null;
  for (const [ym, cutoff] of points ?? []) {
    if (monthIndex(ym) > mi) break;
    v = cutoff;
  }
  return v;
};

mkdirSync(join(dir, "snapshots"), { recursive: true });

const months = [];
for (let mi = min; mi <= max; mi++) {
  const month = indexToMonth(mi);
  const categories = {};
  for (const [key, series] of Object.entries(history.series)) {
    const [category, country] = key.split("-");
    const fad = valueAt(series.fad, mi);
    const dff = valueAt(series.dff, mi);
    if (fad === null && dff === null) continue;
    categories[category] ??= {};
    categories[category][country] = { fad, dff };
    // Rest-of-world has stayed Current for the seeded window.
    categories[category].row = { fad: "C", dff: "C" };
  }
  const snapshot = {
    bulletinMonth: month,
    generated: true,
    source: history.source,
    sourceLabel: history.sourceLabel,
    categories,
  };
  writeFileSync(
    join(dir, "snapshots", `${month}.json`),
    JSON.stringify(snapshot, null, 2) + "\n"
  );
  months.push(month);
}

const index = {
  lastUpdated: current.lastUpdated,
  source: history.source,
  sourceLabel: history.sourceLabel,
  current: current.bulletinMonth,
  months,
};
writeFileSync(join(dir, "index.json"), JSON.stringify(index, null, 2) + "\n");

console.log(
  `Wrote ${months.length} snapshots (${months[0]} → ${months.at(-1)}) and index.json`
);
