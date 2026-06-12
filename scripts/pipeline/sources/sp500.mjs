/** S&P 500 — previous-day close. Stooq ^spx → Yahoo ^GSPC. */
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "sp500", label: "S&P 500", unit: "", decimals: 0 };

export function fetchValue() {
  return fetchEod({ stooq: "^spx", yahoo: "^GSPC" });
}
