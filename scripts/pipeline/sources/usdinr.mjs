/**
 * USD/INR exchange rate.
 *
 * Primary: Yahoo Finance (INR=X) via the same chart API used for NIFTY/S&P.
 * Returns regularMarketPrice + chartPreviousClose so the value and true
 * day-over-day change match what users see on Yahoo Finance.
 *
 * Fallbacks: ECB cross-rate via Frankfurter, then Fed H.10 via FRED.
 * Both are kept as safety nets in case Yahoo rate-limits GitHub Actions IPs.
 *
 * RBI/FBIL opt-in: set RBI_REFERENCE_URL and RBI_REFERENCE_PATH env vars to
 * override all of the above with an official reference rate endpoint.
 */
import { fetchJson, firstOk } from "../lib/http.mjs";
import { fetchFred } from "../lib/fred.mjs";
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "usdinr", label: "USD/INR", unit: "₹", decimals: 2 };

function dig(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

async function fromRbi() {
  const url = process.env.RBI_REFERENCE_URL;
  if (!url) throw new Error("RBI_REFERENCE_URL not configured (skipping to fallback)");
  const j = await fetchJson(url);
  const v = Number(dig(j, process.env.RBI_REFERENCE_PATH || "rate"));
  if (!Number.isFinite(v)) throw new Error("RBI endpoint: rate not found at path");
  return { value: v, source: "RBI reference rate" };
}

async function fromFrankfurter() {
  const start = new Date(Date.now() - 8 * 86_400_000).toISOString().slice(0, 10);
  const j = await fetchJson(
    `https://api.frankfurter.dev/v1/${start}..?base=USD&symbols=INR`
  );
  const dated = Object.entries(j?.rates ?? {})
    .map(([d, r]) => [d, Number(r?.INR)])
    .filter(([, r]) => Number.isFinite(r))
    .sort((a, b) => a[0].localeCompare(b[0]));
  if (!dated.length) throw new Error("Frankfurter: INR missing");
  return {
    value: dated.at(-1)[1],
    previous: dated.length > 1 ? dated.at(-2)[1] : undefined,
    source: "ECB reference rate via Frankfurter",
  };
}

export function fetchValue() {
  return firstOk([
    { name: "RBI/FBIL", run: fromRbi },
    // Yahoo Finance INR=X: matches what users see on finance.yahoo.com/quote/INR=X
    { name: "Yahoo", run: () => fetchEod({ stooq: "usdins", yahoo: "INR=X" }) },
    { name: "Frankfurter", run: fromFrankfurter },
    { name: "FRED", run: () => fetchFred("DEXINUS", "Fed H.10 rate via FRED") },
  ]);
}
