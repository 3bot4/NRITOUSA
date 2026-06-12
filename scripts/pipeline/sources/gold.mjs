/**
 * Gold — daily reference price, USD per troy ounce.
 * FRED LBMA London Gold Fixing (open Fed data) → Stooq xauusd → Yahoo GC=F.
 * The sources differ slightly (London fix vs spot vs COMEX future) but track
 * within a few dollars; the stamped `source` records which supplied the value.
 */
import { firstOk } from "../lib/http.mjs";
import { fetchFred } from "../lib/fred.mjs";
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "gold", label: "Gold", unit: "$", decimals: 0 };

export function fetchValue() {
  return firstOk([
    {
      name: "FRED",
      run: () => fetchFred("GOLDAMGBD228NLBM", "FRED (LBMA gold fixing)"),
    },
    { name: "Stooq/Yahoo", run: () => fetchEod({ stooq: "xauusd", yahoo: "GC=F" }) },
  ]);
}
