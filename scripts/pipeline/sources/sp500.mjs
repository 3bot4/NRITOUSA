/** S&P 500 — previous-day close. FRED SP500 (open Fed data) → Stooq → Yahoo. */
import { firstOk } from "../lib/http.mjs";
import { fetchFred } from "../lib/fred.mjs";
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "sp500", label: "S&P 500", unit: "", decimals: 0 };

export function fetchValue() {
  return firstOk([
    { name: "FRED", run: () => fetchFred("SP500", "FRED (S&P 500 index)") },
    { name: "Stooq/Yahoo", run: () => fetchEod({ stooq: "^spx", yahoo: "^GSPC" }) },
  ]);
}
