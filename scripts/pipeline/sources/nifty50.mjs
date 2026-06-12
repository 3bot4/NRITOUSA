/** NIFTY 50 — previous-day close. Stooq ^nsei → Yahoo ^NSEI. */
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "nifty50", label: "NIFTY 50", unit: "", decimals: 0 };

export function fetchValue() {
  return fetchEod({ stooq: "^nsei", yahoo: "^NSEI" });
}
