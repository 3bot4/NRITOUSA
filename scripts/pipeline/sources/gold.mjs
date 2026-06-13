/**
 * Gold — reference spot price, USD per troy ounce.
 * gold-api.com (free, key-less, works from datacenter IPs) → FRED LBMA fixing →
 * Stooq/Yahoo. The sources differ slightly (live spot vs London fix vs COMEX
 * future) but track within a few dollars; the stamped `source` records which
 * one supplied the value.
 *
 * Note: the old FRED series GOLDAMGBD228NLBM was discontinued (404s), so the
 * live gold-api.com spot price is now the primary source.
 */
import { firstOk, fetchJson } from "../lib/http.mjs";
import { fetchFred } from "../lib/fred.mjs";
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "gold", label: "Gold", unit: "$", decimals: 0 };

/** gold-api.com: { price, symbol, currency, updatedAt }. USD/oz spot. */
async function fromGoldApi() {
  const j = await fetchJson("https://api.gold-api.com/price/XAU");
  const v = Number(j?.price);
  if (!Number.isFinite(v) || v <= 0) throw new Error(`gold-api: bad price "${j?.price}"`);
  return { value: v, source: "gold-api.com spot price" };
}

export function fetchValue() {
  return firstOk([
    { name: "gold-api", run: fromGoldApi },
    {
      name: "FRED",
      run: () => fetchFred("GOLDPMGBD228NLBM", "FRED (LBMA gold fixing)"),
    },
    { name: "Stooq/Yahoo", run: () => fetchEod({ stooq: "xauusd", yahoo: "GC=F" }) },
  ]);
}
