/**
 * Pure duty math for the gold customs calculator on /gold-limit-usa-to-india.
 * Every constant comes from goldDutyConfig (src/data/goldCustomsData.ts) —
 * nothing is hardcoded here — so a CBIC rule change is a one-place edit.
 * Unit-tested in goldDuty.test.ts (acceptance cases: under limit, over-limit
 * jewellery, bars, child traveler, family of three).
 */
import { goldDutyConfig as cfg } from "@/data/goldCustomsData";

export type TravelerCategory = "woman" | "man" | "girl-child" | "boy-child";
export type GoldForm = "jewellery" | "coins" | "bars";

export interface GoldDutyInput {
  category: TravelerCategory;
  /** Months the traveler has continuously stayed outside India. */
  monthsAbroad: number;
  form: GoldForm;
  /** Total weight of the gold being carried, in grams. */
  grams: number;
  /** Traveler's estimate of the gold's value, in USD. */
  valueUsd: number;
}

export interface GoldDutyResult {
  /** Grams covered by the duty-free jewellery allowance. */
  freeGrams: number;
  dutiableGrams: number;
  freeValueUsd: number;
  dutiableValueUsd: number;
  /** Duty rate applied to the dutiable portion (percent). */
  ratePct: number;
  eligibleConcession: boolean;
  /** True when the total exceeds the per-passenger cap (1 kg). */
  overCap: boolean;
  dutyUsd: number;
  dutyInr: number;
  warnings: string[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calcGoldDuty(input: GoldDutyInput): GoldDutyResult {
  const grams = Math.max(0, input.grams);
  const valueUsd = Math.max(0, input.valueUsd);
  const warnings: string[] = [];

  // Duty-free allowance: jewellery only, >1 year abroad, weight by category.
  const isFemale = input.category === "woman" || input.category === "girl-child";
  const isChild = input.category === "girl-child" || input.category === "boy-child";
  let freeGrams = 0;
  if (
    input.form === "jewellery" &&
    input.monthsAbroad >= cfg.minMonthsAbroadForFreeAllowance
  ) {
    freeGrams = Math.min(
      grams,
      isFemale ? cfg.freeJewelleryGramsWoman : cfg.freeJewelleryGramsOther,
    );
    if (isChild) {
      warnings.push(
        "The Baggage Rules 2026 do not separately spell out a child's allowance. This estimate assumes the adult weight limits apply — verify with CBIC before relying on it.",
      );
    }
  } else if (input.form === "jewellery") {
    warnings.push(
      "The duty-free jewellery allowance generally requires more than 1 year of stay abroad — your stay is shorter, so the full weight is treated as dutiable.",
    );
  } else {
    warnings.push(
      "Gold coins, bars, and biscuits get no duty-free allowance — the full weight is dutiable.",
    );
  }

  const dutiableGrams = round2(grams - freeGrams);
  const valuePerGram = grams > 0 ? valueUsd / grams : 0;
  const freeValueUsd = round2(freeGrams * valuePerGram);
  const dutiableValueUsd = round2(dutiableGrams * valuePerGram);

  // Concessional 6% route vs standard baggage rate.
  const overCap = grams > cfg.maxGramsPerPassenger;
  const eligibleConcession =
    input.monthsAbroad >= cfg.minMonthsAbroadForConcession && !overCap;
  const ratePct = eligibleConcession ? cfg.concessionalRatePct : cfg.standardRatePct;

  if (overCap) {
    warnings.push(
      `The eligible-passenger route is capped at ${cfg.maxGramsPerPassenger} g (1 kg) per person. Amounts above that are not permitted as passenger baggage — this estimate applies the standard rate, but expect the excess to be refused or detained.`,
    );
  } else if (!eligibleConcession) {
    warnings.push(
      `The concessional ${cfg.concessionalRatePct}% rate generally requires at least ${cfg.minMonthsAbroadForConcession} months abroad — the standard baggage rate of about ${cfg.standardRatePct}% is used instead.`,
    );
  }

  const dutyUsd = round2((dutiableValueUsd * ratePct) / 100);
  const dutyInr = Math.round(dutyUsd * cfg.approxInrPerUsd);

  return {
    freeGrams,
    dutiableGrams,
    freeValueUsd,
    dutiableValueUsd,
    ratePct,
    eligibleConcession,
    overCap,
    dutyUsd,
    dutyInr,
    warnings,
  };
}
