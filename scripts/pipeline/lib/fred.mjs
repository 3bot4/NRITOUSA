/**
 * FRED (Federal Reserve Bank of St. Louis) open-data CSV reader. No API key, and
 * — unlike Stooq/Yahoo — it serves datacenter IPs (e.g. GitHub Actions) reliably.
 *
 * fredgraph.csv?id=SERIES returns:
 *   observation_date,SERIES
 *   2026-06-10,7266.99
 *   2026-06-11,7394.30
 * Missing observations (holidays) appear as ".". We return the latest valid
 * value plus the prior valid value, so day-over-day % change is computed from
 * FRED's own series rather than our snapshot cadence.
 */
import { fetchText } from "./http.mjs";

export async function fetchFred(seriesId, source) {
  const csv = await fetchText(
    `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(seriesId)}`,
    { timeoutMs: 15_000 }
  );
  const rows = csv.trim().split(/\r?\n/);
  if (rows.length < 2) throw new Error(`FRED ${seriesId}: no rows`);
  // Collect numeric values in date order, skipping "." placeholders.
  const vals = [];
  for (let i = 1; i < rows.length; i++) {
    const v = Number(rows[i].split(",")[1]);
    if (Number.isFinite(v) && v > 0) vals.push(v);
  }
  if (!vals.length) throw new Error(`FRED ${seriesId}: no numeric values`);
  return {
    value: vals.at(-1),
    previous: vals.length > 1 ? vals.at(-2) : undefined,
    source,
  };
}
