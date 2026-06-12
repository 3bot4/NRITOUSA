/**
 * FRED (Federal Reserve Bank of St. Louis) open-data reader. No commercial terms
 * — FRED is U.S. government public-domain data.
 *
 * Two transports:
 *  1. With a free FRED API key (env FRED_API_KEY): the official JSON API at
 *     api.stlouisfed.org. This is built for automation and serves datacenter IPs
 *     (e.g. GitHub Actions) reliably — STRONGLY recommended. Get a key free at
 *     https://fredaccount.stlouisfed.org/apikeys (no cost, no display terms).
 *  2. Without a key: the public fredgraph.csv endpoint. Works from normal IPs but
 *     its bot protection often blocks datacenter IPs, so on Actions it may fail
 *     and the item falls back / goes stale.
 *
 * Returns the latest valid observation plus the prior valid one, so day-over-day
 * % change comes from FRED's own series.
 */
import { fetchText, fetchJson } from "./http.mjs";

export async function fetchFred(seriesId, source) {
  const key = process.env.FRED_API_KEY;
  const [value, previous] = key
    ? await viaApi(seriesId, key)
    : await viaCsv(seriesId);
  if (!Number.isFinite(value)) throw new Error(`FRED ${seriesId}: no value`);
  return { value, previous, source };
}

async function viaApi(seriesId, key) {
  const url =
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=${encodeURIComponent(seriesId)}` +
    `&api_key=${encodeURIComponent(key)}&file_type=json` +
    `&sort_order=desc&limit=8`;
  const j = await fetchJson(url, { timeoutMs: 15_000 });
  const vals = (j?.observations ?? [])
    .map((o) => Number(o.value))
    .filter((v) => Number.isFinite(v) && v > 0); // desc order
  return [vals[0], vals[1]];
}

async function viaCsv(seriesId) {
  const csv = await fetchText(
    `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(seriesId)}`,
    { timeoutMs: 15_000 }
  );
  const rows = csv.trim().split(/\r?\n/);
  const vals = [];
  for (let i = 1; i < rows.length; i++) {
    const v = Number(rows[i].split(",")[1]);
    if (Number.isFinite(v) && v > 0) vals.push(v);
  }
  return [vals.at(-1), vals.length > 1 ? vals.at(-2) : undefined];
}
