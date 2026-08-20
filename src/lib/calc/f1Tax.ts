/**
 * F-1 student tax engine: substantial presence test with exempt-individual
 * logic, FICA over-withholding recovery, and a nonresident refund estimate
 * that applies the US-India treaty standard deduction.
 *
 * Pure functions only — no React, no I/O. Numbers come from
 * src/data/studentClusterData.ts so the audit scripts can track them.
 *
 * The piece most SPT implementations get wrong is the exempt-individual rule:
 * F-1 students are exempt for five CALENDAR years, not five 12-month periods.
 * A student who lands in August 2021 has already used a full exempt year on
 * five months of presence, so 2025 is their first counting year.
 */

import { taxConstants } from "@/data/studentClusterData";

export type StudentVisa = "f1" | "j1-student" | "j1-scholar";

export interface SptInput {
  visa: StudentVisa;
  /** Calendar year the student first arrived in the US on this status. */
  firstArrivalYear: number;
  /** The tax year being tested. */
  taxYear: number;
  /** Days physically present in the US in the tax year. */
  daysCurrentYear: number;
  /** Days present in the year before the tax year. */
  daysPriorYear: number;
  /** Days present two years before the tax year. */
  daysSecondPriorYear: number;
}

export interface SptResult {
  /** True when the student is a resident alien for tax purposes. */
  isResident: boolean;
  /** Calendar years still treated as exempt (days excluded from the test). */
  exemptYears: number[];
  /** The first calendar year in which days begin to count. */
  firstCountingYear: number;
  /** True when the tax year itself is still an exempt year. */
  taxYearIsExempt: boolean;
  /** Weighted day total under the SPT formula (0 when exempt). */
  weightedDays: number;
  /** Breakdown of the weighted calculation, for showing the work. */
  breakdown: {
    currentYear: number;
    priorYearWeighted: number;
    secondPriorYearWeighted: number;
  };
  /** Which return the student files. */
  form: "1040-NR" | "1040";
  /** True when this is the year the student flips from NR to resident. */
  isFlipYear: boolean;
  /** Plain-English verdict. */
  verdict: string;
  /** Whether Form 8843 is required (all exempt individuals must file it). */
  form8843Required: boolean;
}

/** Calendar years of exempt-individual status for a given status type. */
export function exemptYearCount(visa: StudentVisa): number {
  return visa === "j1-scholar"
    ? taxConstants.j1ScholarExemptCalendarYears
    : taxConstants.f1ExemptCalendarYears;
}

/**
 * Runs the substantial presence test, excluding exempt-individual years.
 *
 * Formula: days(current) + days(prior)/3 + days(second prior)/6 >= 183,
 * AND days(current) >= 31. Days in an exempt year are excluded entirely.
 */
export function runSubstantialPresenceTest(input: SptInput): SptResult {
  const {
    visa,
    firstArrivalYear,
    taxYear,
    daysCurrentYear,
    daysPriorYear,
    daysSecondPriorYear,
  } = input;

  const count = exemptYearCount(visa);
  const exemptYears = Array.from({ length: count }, (_, i) => firstArrivalYear + i);
  const firstCountingYear = firstArrivalYear + count;
  const taxYearIsExempt = taxYear < firstCountingYear;

  // Days from a year that was exempt do not count at all.
  const countable = (year: number, days: number) =>
    year < firstCountingYear ? 0 : days;

  const current = countable(taxYear, daysCurrentYear);
  const priorWeighted = countable(taxYear - 1, daysPriorYear) / 3;
  const secondPriorWeighted = countable(taxYear - 2, daysSecondPriorYear) / 6;
  const weightedDays = taxYearIsExempt
    ? 0
    : current + priorWeighted + secondPriorWeighted;

  const meets31Day = current >= taxConstants.sptCurrentYearMinimum;
  const meets183Day = weightedDays >= taxConstants.sptTotalDaysThreshold;
  const isResident = !taxYearIsExempt && meets31Day && meets183Day;

  // The flip year is the first year the test is met.
  const isFlipYear = isResident && taxYear === firstCountingYear;

  let verdict: string;
  if (taxYearIsExempt) {
    verdict = `You are an exempt individual for ${taxYear}. Your days in the US do not count toward the substantial presence test, so you are a nonresident alien and file Form 1040-NR. Your first counting year is ${firstCountingYear}.`;
  } else if (isResident) {
    verdict = `You meet the substantial presence test for ${taxYear} with ${Math.floor(weightedDays)} weighted days. You are a resident alien for tax purposes and file Form 1040 — the same form a US citizen files, reporting worldwide income.`;
  } else if (!meets31Day) {
    verdict = `Your days now count, but you were present only ${current} days in ${taxYear} — under the 31-day minimum. You remain a nonresident alien and file Form 1040-NR.`;
  } else {
    verdict = `Your days now count, but your weighted total is ${Math.floor(weightedDays)} — under the 183 needed. You remain a nonresident alien and file Form 1040-NR.`;
  }

  return {
    isResident,
    exemptYears,
    firstCountingYear,
    taxYearIsExempt,
    weightedDays,
    breakdown: {
      currentYear: current,
      priorYearWeighted: priorWeighted,
      secondPriorYearWeighted: secondPriorWeighted,
    },
    form: isResident ? "1040" : "1040-NR",
    isFlipYear,
    verdict,
    form8843Required: taxYearIsExempt,
  };
}

/* ────────────────────────────── FICA refund ────────────────────────────── */

export interface FicaInput {
  /** Gross wages the FICA tax was withheld on. */
  wages: number;
  /** True when the student was a nonresident alien for that year. */
  wasNonresident: boolean;
  /** True when the employer actually withheld Social Security / Medicare. */
  employerWithheld: boolean;
  /** Optional: exact amount withheld, from box 4 + box 6 of the W-2. */
  actualWithheldAmount?: number;
}

export interface FicaResult {
  /** True when the withholding was an error the student can recover. */
  refundable: boolean;
  /** Dollar amount recoverable. */
  amount: number;
  socialSecurity: number;
  medicare: number;
  /** Whether the estimate is derived from the rate or read off the W-2. */
  basis: "w2" | "estimated";
  steps: string[];
  note: string;
}

/**
 * F-1 students who are nonresident aliens are exempt from Social Security and
 * Medicare tax on wages authorised by their status (on-campus work, CPT,
 * OPT). When an employer withholds it anyway, it is recoverable — but the
 * order matters: you must ask the employer first, and only file Form 843 with
 * Form 8316 if they will not or cannot refund it.
 */
export function estimateFicaRefund(input: FicaInput): FicaResult {
  const { wages, wasNonresident, employerWithheld, actualWithheldAmount } = input;

  if (!wasNonresident || !employerWithheld || wages <= 0) {
    return {
      refundable: false,
      amount: 0,
      socialSecurity: 0,
      medicare: 0,
      basis: "estimated",
      steps: [],
      note: !wasNonresident
        ? "As a resident alien for tax purposes you owe FICA on the same terms as a US citizen. There is nothing to reclaim."
        : "No Social Security or Medicare tax was withheld, so there is nothing to reclaim. Check boxes 4 and 6 of your W-2 to confirm — they should be zero or blank.",
    };
  }

  const useW2 =
    typeof actualWithheldAmount === "number" && actualWithheldAmount > 0;
  const socialSecurity = round2((wages * taxConstants.socialSecurityPct) / 100);
  const medicare = round2((wages * taxConstants.medicarePct) / 100);
  const amount = useW2 ? round2(actualWithheldAmount!) : round2(socialSecurity + medicare);

  return {
    refundable: true,
    amount,
    socialSecurity,
    medicare,
    basis: useW2 ? "w2" : "estimated",
    steps: [
      "Ask your employer for a refund and a corrected W-2 (Form W-2c) first. The IRS will not process your claim unless you have tried this — and the employer route is far faster when it works.",
      "If the employer refunds it, you are done. Keep the W-2c.",
      "If the employer refuses or cannot help, get a written statement saying so, or document that you asked.",
      "File Form 843 (Claim for Refund) together with Form 8316 (statement that the employer would not refund it).",
      "Attach your W-2, your visa and I-94 records, your I-20 with the relevant CPT/OPT authorisation, and the employer statement.",
      "Expect this to take months, not weeks. There is no e-file path for Form 843 — it goes on paper.",
    ],
    note: useW2
      ? "Calculated from the amount you entered off boxes 4 and 6 of your W-2."
      : `Estimated at the statutory ${taxConstants.ficaPct}% (${taxConstants.socialSecurityPct}% Social Security + ${taxConstants.medicarePct}% Medicare). Read boxes 4 and 6 of your W-2 for the exact figure.`,
  };
}

/* ─────────────────────── Nonresident refund estimate ───────────────────── */

export interface RefundInput {
  taxYear: number;
  /** Wage income for the year. */
  wages: number;
  /** Federal income tax withheld — box 2 of the W-2. */
  federalWithheld: number;
  /** True for students who are residents of India for treaty purposes. */
  claimIndiaTreaty: boolean;
  /** Any treaty-exempt scholarship/fellowship amount already excluded. */
  otherDeductions?: number;
}

export interface RefundResult {
  standardDeduction: number;
  taxableIncome: number;
  estimatedTax: number;
  /** Positive = refund due; negative = balance owed. */
  net: number;
  isRefund: boolean;
  effectiveRatePct: number;
  bracketNote: string;
  treatyApplied: boolean;
  caveats: string[];
}

/**
 * 2025/2026 single-filer ordinary income brackets. Nonresident aliens filing
 * 1040-NR use the same rate schedule on effectively connected income.
 * Kept deliberately small: this estimator targets students with wage income,
 * not complex returns.
 */
const SINGLE_BRACKETS: Record<number, { upTo: number; rate: number }[]> = {
  2025: [
    { upTo: 11925, rate: 0.1 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: Infinity, rate: 0.32 },
  ],
  2026: [
    { upTo: 12400, rate: 0.1 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 105700, rate: 0.22 },
    { upTo: 201775, rate: 0.24 },
    { upTo: Infinity, rate: 0.32 },
  ],
};

function bracketsFor(taxYear: number) {
  return SINGLE_BRACKETS[taxYear] ?? SINGLE_BRACKETS[taxConstants.latestPublishedTaxYear];
}

export function progressiveTax(taxable: number, taxYear: number): number {
  if (taxable <= 0) return 0;
  const brackets = bracketsFor(taxYear);
  let remaining = taxable;
  let floor = 0;
  let tax = 0;
  for (const b of brackets) {
    const slice = Math.min(remaining, b.upTo - floor);
    if (slice <= 0) break;
    tax += slice * b.rate;
    remaining -= slice;
    floor = b.upTo;
    if (remaining <= 0) break;
  }
  return round2(tax);
}

/**
 * Estimates a nonresident student's federal refund. The treaty standard
 * deduction is the whole story for Indian students: without it a nonresident
 * gets no standard deduction at all, so the same W-2 produces a materially
 * different result depending on nationality.
 */
export function estimateNonresidentRefund(input: RefundInput): RefundResult {
  const { taxYear, wages, federalWithheld, claimIndiaTreaty } = input;
  const otherDeductions = input.otherDeductions ?? 0;

  const standardDeduction = claimIndiaTreaty
    ? taxConstants.standardDeductionSingle[taxYear] ??
      taxConstants.standardDeductionSingle[taxConstants.latestPublishedTaxYear]
    : 0;

  const taxableIncome = Math.max(0, wages - standardDeduction - otherDeductions);
  const estimatedTax = progressiveTax(taxableIncome, taxYear);
  const net = round2(federalWithheld - estimatedTax);
  const effectiveRatePct = wages > 0 ? round2((estimatedTax / wages) * 100) : 0;

  const caveats = [
    "Federal only. Most states tax this income too, and state rules do not follow the treaty — a federal refund can sit alongside a state balance due.",
    "Assumes wage income taxed at single-filer rates with no dependents. Nonresidents generally cannot file jointly.",
    "Scholarship or fellowship income, capital gains, and 1099 income are not modelled here.",
    "Form 8843 is filed regardless of whether you owe anything, for every year you are an exempt individual.",
  ];
  if (!claimIndiaTreaty) {
    caveats.unshift(
      "No standard deduction was applied. Nonresident aliens generally cannot claim one — the US-India treaty is the notable exception."
    );
  }

  return {
    standardDeduction,
    taxableIncome,
    estimatedTax,
    net,
    isRefund: net >= 0,
    effectiveRatePct,
    bracketNote: `Single-filer ordinary rates for tax year ${taxYear}.`,
    treatyApplied: claimIndiaTreaty && standardDeduction > 0,
    caveats,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
