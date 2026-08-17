/**
 * Pure duty math for the gold customs calculator on /gold-limit-usa-to-india.
 * Every constant comes from goldDutyConfig (src/data/goldCustomsData.ts) —
 * nothing is hardcoded here — so a CBIC rule change is a one-place edit.
 * Unit-tested in goldDuty.test.ts (acceptance cases: under limit, over-limit
 * jewellery, bars, child traveler, family of three, over-cap, invalid input).
 *
 * The estimate uses the USER'S OWN value estimate. Customs actually assesses
 * duty on CBIC-notified tariff values and notified exchange rates — the UI
 * says so next to every result.
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
  /** Grams covered by the duty-free jewellery allowance (Rule 6). */
  freeGrams: number;
  dutiableGrams: number;
  freeValueUsd: number;
  dutiableValueUsd: number;
  /** Total duty rate applied to the dutiable portion (percent). */
  ratePct: number;
  /** Rate components for display: [label, percent] pairs. */
  rateComponents: { label: string; pct: number }[];
  /** True when the concessional 6% passenger-gold route applies. */
  eligibleConcession: boolean;
  /** True when the standard heading-9803 baggage assessment was used. */
  usedStandardBaggageRate: boolean;
  /** True when the total exceeds the per-passenger cap (1 kg). */
  overCap: boolean;
  dutyUsd: number;
  dutyInr: number;
  warnings: string[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calcGoldDuty(input: GoldDutyInput): GoldDutyResult {
  const grams = Number.isFinite(input.grams) ? Math.max(0, input.grams) : 0;
  const valueUsd = Number.isFinite(input.valueUsd) ? Math.max(0, input.valueUsd) : 0;
  const warnings: string[] = [];

  // Rule 6 allowance: jewellery only, >1 year abroad, weight by passenger
  // category. Eligibility is passenger-specific (resident/tourist of Indian
  // origin) — the UI asks the residency question directly.
  const isFemale = input.category === "woman" || input.category === "girl-child";
  const isChild = input.category === "girl-child" || input.category === "boy-child";
  let freeGrams = 0;
  if (
    input.form === "jewellery" &&
    input.monthsAbroad >= cfg.minMonthsAbroadForFreeAllowance
  ) {
    freeGrams = Math.min(
      grams,
      isFemale ? cfg.freeJewelleryGramsFemale : cfg.freeJewelleryGramsOther,
    );
    if (isChild) {
      warnings.push(
        "Rule 6 speaks of passengers without a separate child provision. This estimate assumes the same weights apply to an eligible child — verify with CBIC before relying on it.",
      );
    }
  } else if (input.form === "jewellery") {
    warnings.push(
      "The Rule 6 jewellery allowance requires more than 1 year of residence abroad — this traveler's stay is shorter, so the full weight is treated as dutiable.",
    );
  } else {
    warnings.push(
      "Gold coins, bars, and biscuits get no duty-free jewellery allowance — the full weight is dutiable and must be declared at the Red Channel.",
    );
  }

  const dutiableGrams = round2(grams - freeGrams);
  const valuePerGram = grams > 0 ? valueUsd / grams : 0;
  const freeValueUsd = round2(freeGrams * valuePerGram);
  const dutiableValueUsd = round2(dutiableGrams * valuePerGram);

  // Concessional passenger-gold route (Notification 45/2025-Customs) vs the
  // standard baggage assessment under tariff heading 9803.
  const overCap = grams > cfg.maxGramsPerPassenger;
  const eligibleConcession =
    input.monthsAbroad >= cfg.minMonthsAbroadForConcession && !overCap;
  const ratePct = eligibleConcession
    ? cfg.concessionalRatePct
    : cfg.standardBaggageRatePct;
  const rateComponents = eligibleConcession
    ? [
        { label: "Customs duty (Notification 45/2025-Customs)", pct: cfg.concessionalBcdPct },
        { label: "AIDC", pct: cfg.concessionalAidcPct },
      ]
    : [
        { label: "Basic customs duty — baggage (Notification 26/2016-Customs)", pct: cfg.standardBaggageBcdPct },
        {
          label: `Social Welfare Surcharge (${cfg.standardBaggageSwsRateOnBcdPct}% of the duty)`,
          pct: round2(cfg.standardBaggageRatePct - cfg.standardBaggageBcdPct),
        },
      ];

  if (overCap) {
    warnings.push(
      `The eligible-passenger route is capped at ${cfg.maxGramsPerPassenger} g (1 kg) per person. Amounts above that are not permitted as passenger baggage — expect the excess to be refused or detained. The figure shown is only an illustration.`,
    );
  } else if (!eligibleConcession) {
    warnings.push(
      `The concessional ${cfg.concessionalRatePct}% route generally requires at least ${cfg.minMonthsAbroadForConcession} months abroad. This estimate uses the standard baggage assessment of ${cfg.standardBaggageRatePct}% — ${cfg.standardBaggageBcdPct}% basic customs duty under tariff heading 9803 plus ${cfg.standardBaggageSwsRateOnBcdPct}% Social Welfare Surcharge on that duty. Customs assesses on CBIC-notified tariff values; confirm your classification on arrival.`,
    );
  }
  if (eligibleConcession && dutiableGrams > 0) {
    warnings.push(
      "Duty on the concessional route must be paid in convertible foreign currency, and customs values the gold at CBIC-notified tariff values — not your purchase receipt. Your estimate below uses your own value.",
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
    rateComponents,
    eligibleConcession,
    usedStandardBaggageRate: !eligibleConcession,
    overCap,
    dutyUsd,
    dutyInr,
    warnings,
  };
}
