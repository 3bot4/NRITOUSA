/**
 * Money-safe arithmetic for the visitor-insurance engine.
 *
 * Every other calculator in src/lib/calc/ uses plain floating-point numbers
 * with display-time rounding, which is fine for a single-formula calculation.
 * This engine chains 15+ sequential steps per claim (copay -> deductible ->
 * coinsurance -> sublimit -> policy-max -> running-remaining updates ->
 * multi-claim -> multi-traveler aggregation), so float drift compounds in a
 * way it does not elsewhere in the repo. All money is represented internally
 * as integer cents; conversion happens only at the input and display
 * boundaries. See docs/visitor-insurance/architecture.md §3.
 */

import { formatUsd } from "@/lib/format";

/** Parse a dollar amount (string or number) into non-negative integer cents. Never throws. */
export function dollarsToCents(input: number | string | undefined | null): number {
  if (input === undefined || input === null || input === "") return 0;
  const n = typeof input === "string" ? Number(input) : input;
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n * 100));
}

/** Format integer cents as a USD string via the site's canonical formatter. */
export function centsToUsd(cents: number, digits = 0): string {
  if (!Number.isFinite(cents)) return "—";
  return formatUsd(cents / 100, digits);
}

/** Clamp to a non-negative integer number of cents. */
export function clampCents(cents: number | undefined | null): number {
  if (cents === undefined || cents === null || !Number.isFinite(cents)) return 0;
  return Math.max(0, Math.round(cents));
}

/** Clamp a percentage into [0, 100]. */
export function clampPercent(pct: number | undefined | null): number {
  if (pct === undefined || pct === null || !Number.isFinite(pct)) return 0;
  return Math.min(100, Math.max(0, pct));
}

/** Sum a list of cent amounts, treating invalid entries as 0. */
export function sumCents(values: (number | undefined | null)[]): number {
  return values.reduce((sum: number, v) => sum + clampCents(v ?? 0), 0);
}

/** cents * pct% rounded to the nearest cent. */
export function pctOfCents(cents: number, pct: number): number {
  return Math.round(clampCents(cents) * (clampPercent(pct) / 100));
}

/** min() that treats undefined as "no limit" (+Infinity). */
export function minWithUnlimited(a: number, limit: number | undefined): number {
  return limit === undefined ? a : Math.min(a, limit);
}

/**
 * True when a coverage start/end date pair is in order (or incomplete —
 * incompleteness is a separate "required field" validation, not this check's
 * job). Used to validate Quick Estimate mode's coverage dates.
 */
export function isValidDateRange(startIso: string | undefined, endIso: string | undefined): boolean {
  if (!startIso || !endIso) return true;
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return true;
  return start <= end;
}
