/**
 * India tax residency classifier — Income-tax Act 1961, section 6.
 *
 * Residency is determined by the INDIAN FINANCIAL YEAR (1 April – 31 March),
 * not the US calendar year. Every day count below is a financial-year count.
 *
 * Tests modelled here:
 *   s.6(1)(a)   182 days in the previous year
 *   s.6(1)(c)   60 days in the PY + 365 days across the 4 preceding PYs
 *   Expl.1(a)   Indian citizen leaving India for employment / as crew of an
 *               Indian ship: the 60-day limb is read as 182 days
 *   Expl.1(b)   Indian citizen or PIO visiting India: the 60-day limb is read
 *               as 182 days, or 120 days where income other than from foreign
 *               sources exceeds Rs 15 lakh
 *   s.6(1A)     Deemed resident: Indian citizen, income other than from
 *               foreign sources above Rs 15 lakh, not liable to tax in any
 *               other country by reason of domicile/residence
 *   s.6(6)(a)   Non-resident in 9 of the 10 preceding PYs -> RNOR
 *   s.6(6)(b)   729 days or fewer across the 7 preceding PYs -> RNOR
 *   s.6(6)(c)   The 120-day visitor category is always RNOR
 *   s.6(6)(d)   A deemed resident under s.6(1A) is always RNOR
 *
 * Explicitly NOT modelled — these return "review" rather than a confident
 * answer, because the inputs here cannot resolve them:
 *   - DTAA tie-breaker where the taxpayer is resident of both countries
 *   - Whether the taxpayer is "liable to tax" elsewhere, when unknown
 */

import {
  DAYS_IN_YEAR,
  validateAll,
  type FieldErrors,
  type FieldSpec,
} from "./validation";

export const INCOME_THRESHOLD_LABEL = "Rs 15 lakh";

/** Maximum days across N financial years, allowing for leap years. */
const maxDaysOver = (years: number) => years * 366;

export const rnorFieldSpecs = {
  daysCurrentFy: {
    label: "Days in India this financial year",
    ...DAYS_IN_YEAR,
    required: true,
  },
  daysPrior4Fy: {
    label: "Days in India over the previous 4 financial years",
    min: 0,
    max: maxDaysOver(4),
    integer: true,
    required: true,
  },
  daysPrior7Fy: {
    label: "Days in India over the previous 7 financial years",
    min: 0,
    max: maxDaysOver(7),
    integer: true,
    required: true,
  },
  nonResidentYears: {
    label: "Years you were a non-resident in the last 10",
    min: 0,
    max: 10,
    integer: true,
    required: true,
  },
} satisfies Record<string, FieldSpec>;

type SpecKey = keyof typeof rnorFieldSpecs;

export type Citizenship = "indianCitizen" | "pio" | "other";

/** Why the person is in (or out of) India this year. */
export type PresenceReason =
  /** Indian citizen leaving India for employment abroad or as Indian-ship crew. */
  | "leavingForEmployment"
  /** Indian citizen or PIO, resident abroad, visiting India. */
  | "visiting"
  /** Anything else — living in India, or not falling in the above. */
  | "other";

/** Whether the person is liable to tax in another country. */
export type LiableElsewhere = "yes" | "no" | "unsure";

export interface RnorRawInputs extends Record<SpecKey, string> {
  citizenship: Citizenship;
  presenceReason: PresenceReason;
  /** Income other than from foreign sources exceeds Rs 15 lakh. */
  incomeOver15Lakh: boolean;
  liableToTaxElsewhere: LiableElsewhere;
  /** The taxpayer may be treaty-resident in both countries. */
  possibleDualResidence: boolean;
}

export type RnorStatus = "NRI" | "RNOR" | "ROR" | "REVIEW";

export interface RnorResult {
  ok: boolean;
  errors: FieldErrors<SpecKey>;
  status: RnorStatus;
  /** Why this status was reached — shown to the user. */
  reasons: string[];
  /** Present when status is REVIEW. */
  reviewReasons: string[];
  /** The second-limb day threshold actually applied. */
  secondLimbThreshold: number;
  meets182DayTest: boolean;
  meetsSecondLimbTest: boolean;
  isDeemedResident: boolean;
  isResident: boolean;
  /** RNOR via s.6(6)(a) or (b). */
  rnorByHistory: boolean;
  /** RNOR via the s.6(6)(c) 120-day visitor category. */
  rnorBy120DayCategory: boolean;
}

export function calculateRnor(input: RnorRawInputs): RnorResult {
  const raw = {
    daysCurrentFy: input.daysCurrentFy,
    daysPrior4Fy: input.daysPrior4Fy,
    daysPrior7Fy: input.daysPrior7Fy,
    nonResidentYears: input.nonResidentYears,
  } as Record<SpecKey, string>;

  const { values, errors, ok } = validateAll(raw, rnorFieldSpecs);

  const days = values.daysCurrentFy;
  const days4 = values.daysPrior4Fy;
  const days7 = values.daysPrior7Fy;
  const nrYears = values.nonResidentYears;

  const isIndianCitizen = input.citizenship === "indianCitizen";
  const isCitizenOrPio = isIndianCitizen || input.citizenship === "pio";
  const over15L = input.incomeOver15Lakh;

  /* ---- second limb threshold: 60, relaxed to 182 or 120 ---- */
  let secondLimbThreshold = 60;
  if (isIndianCitizen && input.presenceReason === "leavingForEmployment") {
    // Explanation 1(a) — no 120-day variant for this category.
    secondLimbThreshold = 182;
  } else if (isCitizenOrPio && input.presenceReason === "visiting") {
    secondLimbThreshold = over15L ? 120 : 182;
  }

  const meets182DayTest = days >= 182;
  const meetsSecondLimbTest = days >= secondLimbThreshold && days4 >= 365;
  const residentUnder6_1 = meets182DayTest || meetsSecondLimbTest;

  /* ---- s.6(1A) deemed resident ---- */
  const reviewReasons: string[] = [];
  let isDeemedResident = false;

  const deemedResidentCandidate =
    isIndianCitizen && over15L && !residentUnder6_1;

  if (deemedResidentCandidate) {
    if (input.liableToTaxElsewhere === "no") {
      isDeemedResident = true;
    } else if (input.liableToTaxElsewhere === "unsure") {
      reviewReasons.push(
        `You are an Indian citizen with income other than from foreign sources above ${INCOME_THRESHOLD_LABEL}, and it is not clear whether you are liable to tax in another country. That single fact decides whether the deemed-residency rule in section 6(1A) makes you a resident of India this year. It needs to be established before your status can be determined.`,
      );
    }
  }

  const isResident = residentUnder6_1 || isDeemedResident;

  /* ---- s.6(6) not-ordinarily-resident tests ---- */
  const rnorByHistory = nrYears >= 9 || days7 <= 729;
  const rnorBy120DayCategory =
    isCitizenOrPio &&
    input.presenceReason === "visiting" &&
    over15L &&
    days >= 120 &&
    days < 182;

  /* ---- DTAA tie-breaker ---- */
  if (input.possibleDualResidence && isResident) {
    reviewReasons.push(
      "You indicated you may also be treaty-resident in another country. Where both countries treat you as resident, the DTAA tie-breaker decides which one may tax you as a resident — and that turns on your permanent home, centre of vital interests, habitual abode and nationality, not on day counts. This calculator cannot resolve it.",
    );
  }

  /* ---- resolve ---- */
  const reasons: string[] = [];
  let status: RnorStatus;

  if (!ok) {
    status = "REVIEW";
  } else if (reviewReasons.length > 0) {
    status = "REVIEW";
  } else if (!isResident) {
    status = "NRI";
    reasons.push(
      `You were in India for ${days} days this financial year, below the 182-day test.`,
    );
    if (days4 < 365) {
      reasons.push(
        `You were in India for ${days4} days across the previous 4 financial years, below the 365-day limb of the second test.`,
      );
    } else {
      reasons.push(
        `You did not meet the ${secondLimbThreshold}-day limb of the second residency test.`,
      );
    }
  } else {
    if (isDeemedResident) {
      reasons.push(
        `You are treated as a resident under the deemed-residency rule in section 6(1A): an Indian citizen with income other than from foreign sources above ${INCOME_THRESHOLD_LABEL} who is not liable to tax in any other country.`,
      );
    } else if (meets182DayTest) {
      reasons.push(`You were in India for ${days} days — at or above 182 days.`);
    } else {
      reasons.push(
        `You were in India for ${days} days (at or above the ${secondLimbThreshold}-day threshold that applies to you) and ${days4} days across the previous 4 financial years.`,
      );
    }

    // A deemed resident and the 120-day visitor category are RNOR by statute.
    if (isDeemedResident) {
      status = "RNOR";
      reasons.push("A deemed resident under section 6(1A) is always RNOR.");
    } else if (rnorBy120DayCategory) {
      status = "RNOR";
      reasons.push(
        "The 120-day visitor category in section 6(6)(c) is RNOR by statute.",
      );
    } else if (rnorByHistory) {
      status = "RNOR";
      if (nrYears >= 9) {
        reasons.push(
          `You were a non-resident in ${nrYears} of the last 10 financial years, which keeps you RNOR under section 6(6)(a).`,
        );
      }
      if (days7 <= 729) {
        reasons.push(
          `You spent ${days7} days in India across the previous 7 financial years — 729 or fewer keeps you RNOR under section 6(6)(b).`,
        );
      }
    } else {
      status = "ROR";
      reasons.push(
        `You do not meet either not-ordinarily-resident test: you were a non-resident in only ${nrYears} of the last 10 years, and you spent ${days7} days in India over the previous 7 years.`,
      );
    }
  }

  return {
    ok,
    errors,
    status,
    reasons,
    reviewReasons,
    secondLimbThreshold,
    meets182DayTest,
    meetsSecondLimbTest,
    isDeemedResident,
    isResident,
    rnorByHistory,
    rnorBy120DayCategory,
  };
}
