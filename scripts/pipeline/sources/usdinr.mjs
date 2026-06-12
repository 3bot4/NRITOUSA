/**
 * USD/INR daily reference rate.
 *
 * Primary: the official RBI / FBIL daily reference rate. RBI/FBIL do not expose
 * a stable, key-less JSON feed, so this is wired as an OPT-IN env hook — set
 * RBI_REFERENCE_URL (a JSON endpoint you trust) and RBI_REFERENCE_PATH (a dot
 * path to the numeric rate, default "rate"). When unset, we skip straight to the
 * fallback so the pipeline still produces a value every day.
 *
 * Fallback: the ECB reference cross-rate via Frankfurter (api.frankfurter.dev,
 * open ECB data, no key). See README → Data sources for terms.
 */
import { fetchJson, firstOk } from "../lib/http.mjs";
import { fetchFred } from "../lib/fred.mjs";

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
  // Fetch a short window so we get the latest rate AND the prior business day's
  // rate (real day-over-day change rather than 0% until snapshots accrue).
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
    { name: "Frankfurter", run: fromFrankfurter },
    // Federal Reserve H.10 India/US rate (open data) — last-resort fallback.
    { name: "FRED", run: () => fetchFred("DEXINUS", "Fed H.10 rate via FRED") },
  ]);
}
