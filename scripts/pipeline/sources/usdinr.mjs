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
  const j = await fetchJson(
    "https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR"
  );
  const v = Number(j?.rates?.INR);
  if (!Number.isFinite(v)) throw new Error("Frankfurter: INR missing");
  return { value: v, source: "ECB reference rate via Frankfurter" };
}

export function fetchValue() {
  return firstOk([
    { name: "RBI/FBIL", run: fromRbi },
    { name: "Frankfurter", run: fromFrankfurter },
  ]);
}
