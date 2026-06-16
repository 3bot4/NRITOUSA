/**
 * Gold — USD per troy ounce.
 * Primary: Yahoo Finance GC=F (COMEX front-month gold futures) — the number
 * users see on finance.yahoo.com/quote/GC=F; returns both latest price and
 * chartPreviousClose for accurate day-over-day change.
 * Fallbacks: gold-api.com live spot → FRED LBMA fixing. The three sources
 * track within a few dollars of each other; `source` records which was used.
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
    { name: "Yahoo/Stooq", run: () => fetchEod({ stooq: "xauusd", yahoo: "GC=F" }) },
    { name: "gold-api", run: fromGoldApi },
    {
      name: "FRED",
      run: () => fetchFred("GOLDPMGBD228NLBM", "FRED (LBMA gold fixing)"),
    },
  ]);
}
