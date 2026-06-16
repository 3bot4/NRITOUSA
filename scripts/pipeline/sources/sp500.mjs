/**
 * S&P 500 — previous-day close.
 * Yahoo Finance (^GSPC) is primary: returns regularMarketPrice + chartPreviousClose
 * so both the value and the true day-over-day change are correct.
 * FRED SP500 is the last-resort fallback: it has a 1-business-day lag and would
 * display yesterday's close as "today's" value on morning runs.
 */
import { firstOk } from "../lib/http.mjs";
import { fetchFred } from "../lib/fred.mjs";
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "sp500", label: "S&P 500", unit: "", decimals: 0 };

export function fetchValue() {
  return firstOk([
    { name: "Yahoo/Stooq", run: () => fetchEod({ stooq: "^spx", yahoo: "^GSPC" }) },
    { name: "FRED", run: () => fetchFred("SP500", "FRED (S&P 500 index)") },
  ]);
}
