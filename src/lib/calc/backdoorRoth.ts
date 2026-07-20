/**
 * Roth IRA eligibility + backdoor-Roth pro-rata screening.
 *
 * Pure logic, extracted from BackdoorRothCalculator so it can be unit tested
 * at and around every phase-out boundary.
 */

import { currentIraLimits, type IraLimits, type RothPhaseOut } from "./irsLimits";
import {
  AGE,
  USD_AMOUNT,
  validateAll,
  type FieldErrors,
  type FieldSpec,
} from "./validation";

export type FilingStatus = "single" | "mfj" | "mfsLivedWithSpouse" | "mfsLivedApart";

export type RothInputKey = "magi" | "age" | "tradBal";

export const rothFieldSpecs: Record<RothInputKey, FieldSpec> = {
  magi: { label: "Modified adjusted gross income", ...USD_AMOUNT, required: true },
  age: { label: "Your age", ...AGE, required: true },
  tradBal: { label: "Existing pre-tax IRA balance", ...USD_AMOUNT },
};

export interface RothRawInputs {
  magi: string;
  age: string;
  tradBal: string;
  status: FilingStatus;
}

export type RothVerdict = "full" | "partial" | "backdoor";

export interface RothResult {
  ok: boolean;
  errors: FieldErrors<RothInputKey>;
  limits: IraLimits;
  /** Validated MAGI, echoed back for display. */
  magi: number;
  /** The phase-out range actually applied, after the MFS special rule. */
  range: RothPhaseOut;
  /** True when MFS-lived-apart was resolved to the single range. */
  usedSingleRangeForMfs: boolean;
  contributionLimit: number;
  /** Whether the age-50 catch-up was included. */
  catchUpApplied: boolean;
  directAllowed: number;
  verdict: RothVerdict;
  /** Percent of a conversion that would be taxable under the pro-rata rule. */
  proRataTaxablePct: number;
  proRataTaxableAmount: number;
  /** Amount assumed converted (the full nondeductible contribution). */
  assumedConversion: number;
}

/**
 * Resolve the phase-out range for a filing status.
 *
 * An MFS taxpayer who lived apart from their spouse for the entire year is
 * treated as single; only one who lived with their spouse at any point during
 * the year gets the $0–$10,000 range.
 */
export function resolveRange(
  status: FilingStatus,
  limits: IraLimits,
): { range: RothPhaseOut; usedSingleRangeForMfs: boolean } {
  if (status === "mfsLivedApart" && limits.mfsLivedApartIsSingle) {
    return { range: limits.phaseOut.single, usedSingleRangeForMfs: true };
  }
  if (status === "mfsLivedApart") {
    return { range: limits.phaseOut.mfsLivedWithSpouse, usedSingleRangeForMfs: false };
  }
  if (status === "mfsLivedWithSpouse") {
    return { range: limits.phaseOut.mfsLivedWithSpouse, usedSingleRangeForMfs: false };
  }
  return { range: limits.phaseOut[status], usedSingleRangeForMfs: false };
}

/**
 * Reduced contribution within the phase-out band.
 *
 * IRS Publication 590-A rounding: round the result UP to the nearest $10, and
 * if the result is more than $0 but less than $200, $200 may still be
 * contributed.
 */
export function reducedContribution(
  magi: number,
  limit: number,
  range: RothPhaseOut,
): number {
  const span = range.end - range.start;
  if (span <= 0) return magi >= range.end ? 0 : limit;

  const reduction = limit * ((magi - range.start) / span);
  const raw = limit - reduction;
  if (raw <= 0) return 0;

  const rounded = Math.ceil(raw / 10) * 10;
  if (rounded < 200) return 200;
  return Math.min(limit, rounded);
}

export function calculateRoth(
  input: RothRawInputs,
  limits: IraLimits = currentIraLimits(),
): RothResult {
  const { values, errors, ok } = validateAll(
    { magi: input.magi, age: input.age, tradBal: input.tradBal },
    rothFieldSpecs,
  );

  const { range, usedSingleRangeForMfs } = resolveRange(input.status, limits);
  const catchUpApplied = values.age >= 50;
  const contributionLimit = catchUpApplied ? limits.age50Plus : limits.under50;

  const empty: RothResult = {
    ok,
    errors,
    limits,
    magi: values.magi,
    range,
    usedSingleRangeForMfs,
    contributionLimit,
    catchUpApplied,
    directAllowed: 0,
    verdict: "backdoor",
    proRataTaxablePct: 0,
    proRataTaxableAmount: 0,
    assumedConversion: contributionLimit,
  };

  // Do not produce a result from invalid input.
  if (!ok) return empty;

  const magi = values.magi;
  let directAllowed: number;
  let verdict: RothVerdict;

  if (magi <= range.start) {
    directAllowed = contributionLimit;
    verdict = "full";
  } else if (magi >= range.end) {
    directAllowed = 0;
    verdict = "backdoor";
  } else {
    directAllowed = reducedContribution(magi, contributionLimit, range);
    verdict = directAllowed >= contributionLimit ? "full" : "partial";
  }

  // Pro-rata rule: a conversion is taxed in proportion to pre-tax IRA money
  // across ALL Traditional/SEP/SIMPLE IRAs, measured using the December 31
  // balance of the conversion year.
  const preTax = values.tradBal;
  const conversion = contributionLimit;
  const denominator = preTax + conversion;
  const proRataTaxablePct = denominator > 0 ? (preTax / denominator) * 100 : 0;

  return {
    ...empty,
    directAllowed,
    verdict,
    proRataTaxablePct,
    proRataTaxableAmount: conversion * (proRataTaxablePct / 100),
    assumedConversion: conversion,
  };
}
