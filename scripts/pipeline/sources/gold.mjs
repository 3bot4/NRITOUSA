/**
 * Gold — daily reference price, USD per troy ounce.
 * Stooq xauusd (spot) → Yahoo GC=F (COMEX front-month future). The two differ
 * slightly (spot vs near future) but track within a few dollars; the source name
 * stamped into market.json records which one supplied the day's value.
 */
import { fetchEod } from "../lib/eod.mjs";

export const meta = { key: "gold", label: "Gold", unit: "$", decimals: 0 };

export function fetchValue() {
  return fetchEod({ stooq: "xauusd", yahoo: "GC=F" });
}
