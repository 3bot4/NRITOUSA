/**
 * Form I-864 sponsor income maths.
 *
 * Pure functions, no React, no DOM — so the rules can be unit-tested directly
 * and reused by any page. Every threshold comes from
 * src/data/affidavitOfSupportData.ts, which mirrors Form I-864P.
 *
 * Rounding rule: USCIS prints the 125% table already rounded, and the printed
 * figure is the one a sponsor is measured against. We therefore round the
 * derived requirement to the nearest whole dollar and pin it against the
 * printed table in the tests, rather than carrying cents.
 */

import {
  I864_TABLES,
  STANDARD_MULTIPLIER,
  MILITARY_MULTIPLIER,
  ASSET_RULES,
  type AssetCase,
  type I864Location,
} from "@/data/affidavitOfSupportData";

/** Largest household the tool will model. Beyond this the answer is "ask a lawyer". */
export const MAX_HOUSEHOLD = 20;

export interface HouseholdCounts {
  /** Sponsor's spouse, 0 or 1. */
  spouse: number;
  /** Sponsor's unmarried children under 21. */
  children: number;
  /** Other dependents claimed on the sponsor's most recent tax return. */
  dependents: number;
  /** Everyone being sponsored on this affidavit (principal + accompanying). */
  immigrants: number;
  /** People still covered by a previously signed I-864. */
  priorObligations: number;
}

export const EMPTY_HOUSEHOLD: HouseholdCounts = {
  spouse: 0,
  children: 0,
  dependents: 0,
  immigrants: 1,
  priorObligations: 0,
};

/**
 * Household size for I-864 purposes. The sponsor always counts as 1; every
 * other component is additive.
 *
 * Negative or non-finite inputs are floored at 0 rather than rejected — the
 * callers are number inputs whose only bad states are "blank" and "negative",
 * and a silently-zeroed component cannot overstate the requirement.
 */
export function householdSize(counts: HouseholdCounts): number {
  const part = (n: number) =>
    Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  const total =
    1 +
    Math.min(part(counts.spouse), 1) +
    part(counts.children) +
    part(counts.dependents) +
    part(counts.immigrants) +
    part(counts.priorObligations);
  return Math.min(total, MAX_HOUSEHOLD);
}

/**
 * 100% of the Federal Poverty Guidelines for a household of `size` in `location`.
 * Sizes beyond the published table extend by the per-person increment, which is
 * how Form I-864P itself instructs you to handle them.
 */
export function povertyGuideline(size: number, location: I864Location): number {
  const table = I864_TABLES[location];
  const n = Math.max(1, Math.floor(size));
  if (n <= table.base.length) return table.base[n - 1];
  const extra = n - table.base.length;
  return table.base[table.base.length - 1] + extra * table.basePerExtra;
}

/**
 * The income a sponsor must show.
 *
 * `military` applies the 100% rule, which is available ONLY to a sponsor on
 * active duty in the US armed forces who is petitioning their own spouse or
 * child. The caller is responsible for asking that question precisely; the
 * flag here is not "is in the military".
 */
export function requiredIncome(
  size: number,
  location: I864Location,
  military: boolean
): number {
  const base = povertyGuideline(size, location);
  const multiplier = military ? MILITARY_MULTIPLIER : STANDARD_MULTIPLIER;
  return Math.round(base * multiplier);
}

export interface SponsorInput {
  counts: HouseholdCounts;
  location: I864Location;
  /** Active duty AND petitioning own spouse or child. */
  military: boolean;
  /** Total income from the most recent federal tax return. */
  income: number;
  /** Which asset multiple applies to this case. */
  assetCase: AssetCase;
}

export interface SponsorResult {
  size: number;
  /** 100% of the guideline — shown so the military rule is legible. */
  guideline: number;
  required: number;
  income: number;
  /** required − income, floored at 0. */
  shortfall: number;
  meets: boolean;
  /** How far over the line, when they clear it. */
  surplus: number;
  /** Net asset value that would close the gap, or 0 when there is no gap. */
  assetsNeeded: number;
  assetMultiple: number;
  multiplierApplied: number;
}

/** Guards a money input without ever returning NaN or a negative. */
function money(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function evaluateSponsor(input: SponsorInput): SponsorResult {
  const size = householdSize(input.counts);
  const guideline = povertyGuideline(size, input.location);
  const required = requiredIncome(size, input.location, input.military);
  const income = money(input.income);
  const shortfall = Math.max(0, required - income);
  const rule = ASSET_RULES[input.assetCase] ?? ASSET_RULES.other;

  return {
    size,
    guideline,
    required,
    income,
    shortfall,
    meets: income >= required,
    surplus: Math.max(0, income - required),
    assetsNeeded: shortfall > 0 ? shortfall * rule.multiple : 0,
    assetMultiple: rule.multiple,
    multiplierApplied: input.military ? MILITARY_MULTIPLIER : STANDARD_MULTIPLIER,
  };
}

/**
 * The requirement across household sizes 2–8, for the threshold chart.
 * Size 1 is omitted deliberately: an I-864 always has at least one intending
 * immigrant, so a household of 1 cannot occur on a real affidavit.
 */
export function thresholdSeries(
  location: I864Location,
  military: boolean
): { size: number; required: number }[] {
  const out: { size: number; required: number }[] = [];
  for (let size = 2; size <= 8; size++) {
    out.push({ size, required: requiredIncome(size, location, military) });
  }
  return out;
}
