/**
 * 401(k) decision support for someone leaving the US.
 *
 * The previous version applied a single "tax / withholding" rate and subtracted
 * it as a permanent cost, which conflates two different things:
 *
 *   - WITHHOLDING is money the payer sends to the IRS up front. It is a
 *     PREPAYMENT against your tax bill, not an extra tax. It reduces the cash
 *     you receive on day one; it does not reduce your eventual after-tax value.
 *   - TAX LIABILITY is what you actually owe, settled when you file. Any
 *     over-withholding comes back as a refund.
 *
 * Treating withholding as an additional permanent cost overstates the cost of a
 * distribution. Here the two are modelled separately and reconciled.
 */

import {
  AGE,
  GROWTH_RATE,
  PERCENT,
  TERM_YEARS,
  USD_AMOUNT,
  validateAll,
  type FieldErrors,
  type FieldSpec,
} from "./validation";

/** Age at which the 10% additional tax on early distributions stops applying. */
export const EARLY_DISTRIBUTION_AGE = 59.5;

/** The additional tax on an early distribution, where no exception applies. */
export const EARLY_DISTRIBUTION_RATE = 0.1;

/**
 * Default withholding on a distribution to a foreign payee.
 * Distributions to foreign persons are generally subject to 30% withholding
 * unless valid documentation establishes eligibility for a lower treaty rate.
 * Source: IRS, "Plan distributions to foreign persons require withholding".
 */
export const FOREIGN_PAYEE_WITHHOLDING_RATE = 0.3;

export const IRS_FOREIGN_WITHHOLDING_SOURCE =
  "https://www.irs.gov/retirement-plans/plan-distributions-to-foreign-persons-require-withholding";

export const retire401kFieldSpecs = {
  balance: { label: "401(k) balance", ...USD_AMOUNT, required: true },
  age: { label: "Your age today", ...AGE, required: true },
  effectiveTaxRate: {
    label: "Estimated effective US tax rate on the distribution",
    ...PERCENT,
    required: true,
  },
  withholdingRate: { label: "Withholding rate applied by the plan", ...PERCENT, required: true },
  years: { label: "Years until you withdraw", ...TERM_YEARS, required: true },
  expectedReturn: { label: "Expected annual return", ...GROWTH_RATE, required: true },
  futureTaxRate: { label: "Estimated tax rate at future withdrawal", ...PERCENT, required: true },
} satisfies Record<string, FieldSpec>;

type SpecKey = keyof typeof retire401kFieldSpecs;

export interface Retire401kRawInputs extends Record<SpecKey, string> {
  /** A recognised exception to the 10% additional tax applies. */
  hasEarlyDistributionException: boolean;
}

export interface Retire401kResult {
  ok: boolean;
  errors: FieldErrors<SpecKey>;
  assumptions: string[];

  /* Option A — take a taxable cash distribution now */
  grossDistribution: number;
  /** Ordinary income tax owed on the distribution. */
  estimatedIncomeTax: number;
  /** The 10% additional tax, where applicable. Zero is a real answer here. */
  earlyDistributionTax: number;
  earlyDistributionApplies: boolean;
  /** Total actually owed: income tax + any additional tax. */
  totalTaxLiability: number;
  /** Prepayment sent to the IRS by the payer. NOT an additional cost. */
  upfrontWithholding: number;
  /** Cash in hand on day one, after withholding only. */
  cashReceivedInitially: number;
  /** Positive = refund due; negative = further tax payable at filing. */
  withholdingReconciliation: number;
  /** What the distribution is really worth after tax is settled. */
  netAfterTaxValue: number;

  /* Option B — leave it invested and withdraw later */
  projectedFutureBalance: number;
  futureAfterTaxValue: number;
  /** Option A's net proceeds reinvested at the same return, for comparison. */
  distributionReinvestedValue: number;
  advantageOfKeeping: number;
}

export function calculateRetire401k(
  input: Retire401kRawInputs,
): Retire401kResult {
  const raw = {
    balance: input.balance,
    age: input.age,
    effectiveTaxRate: input.effectiveTaxRate,
    withholdingRate: input.withholdingRate,
    years: input.years,
    expectedReturn: input.expectedReturn,
    futureTaxRate: input.futureTaxRate,
  } as Record<SpecKey, string>;

  const { values, errors, ok } = validateAll(raw, retire401kFieldSpecs);

  const gross = values.balance;
  const taxRate = values.effectiveTaxRate / 100;
  const whRate = values.withholdingRate / 100;
  const futureRate = values.futureTaxRate / 100;
  const r = values.expectedReturn / 100;
  const yrs = values.years;

  // The additional tax applies only below 59½ AND only where no exception
  // applies — it is not automatic for everyone under that age.
  const earlyDistributionApplies =
    values.age < EARLY_DISTRIBUTION_AGE && !input.hasEarlyDistributionException;

  const estimatedIncomeTax = gross * taxRate;
  const earlyDistributionTax = earlyDistributionApplies
    ? gross * EARLY_DISTRIBUTION_RATE
    : 0;
  const totalTaxLiability = estimatedIncomeTax + earlyDistributionTax;

  const upfrontWithholding = gross * whRate;
  const cashReceivedInitially = gross - upfrontWithholding;

  // Reconciliation, not a second charge. Withholding already paid part of the
  // liability; this is the settle-up at filing time.
  const withholdingReconciliation = upfrontWithholding - totalTaxLiability;

  // The true economic cost is the LIABILITY, not the liability plus the
  // withholding. Subtracting both would double-count the same dollars.
  const netAfterTaxValue = gross - totalTaxLiability;

  const projectedFutureBalance = gross * Math.pow(1 + r, yrs);
  const futureAfterTaxValue = projectedFutureBalance * (1 - futureRate);
  const distributionReinvestedValue = netAfterTaxValue * Math.pow(1 + r, yrs);
  const advantageOfKeeping = futureAfterTaxValue - distributionReinvestedValue;

  const assumptions = [
    `Distribution taxed at an estimated ${values.effectiveTaxRate}% effective US rate — a real bracket depends on your total income for the year, filing status and any treaty position.`,
    `Plan withholds ${values.withholdingRate}% up front. Withholding is a prepayment against the bill, not an extra tax; any excess is refunded when you file.`,
    earlyDistributionApplies
      ? "The 10% additional tax on early distributions is included because you are under 59½ and no exception was selected."
      : values.age < EARLY_DISTRIBUTION_AGE
        ? "The 10% additional tax is excluded because you indicated an exception applies."
        : "No additional tax on early distributions — you are 59½ or older.",
    `Future value assumes ${values.expectedReturn}% annual return for ${yrs} years and a ${values.futureTaxRate}% rate at withdrawal.`,
    "Ignores state tax, India taxation of the distribution, currency movement, and plan-specific fees.",
  ];

  const empty: Retire401kResult = {
    ok,
    errors,
    assumptions,
    grossDistribution: 0,
    estimatedIncomeTax: 0,
    earlyDistributionTax: 0,
    earlyDistributionApplies,
    totalTaxLiability: 0,
    upfrontWithholding: 0,
    cashReceivedInitially: 0,
    withholdingReconciliation: 0,
    netAfterTaxValue: 0,
    projectedFutureBalance: 0,
    futureAfterTaxValue: 0,
    distributionReinvestedValue: 0,
    advantageOfKeeping: 0,
  };

  if (!ok) return empty;

  return {
    ...empty,
    grossDistribution: gross,
    estimatedIncomeTax,
    earlyDistributionTax,
    totalTaxLiability,
    upfrontWithholding,
    cashReceivedInitially,
    withholdingReconciliation,
    netAfterTaxValue,
    projectedFutureBalance,
    futureAfterTaxValue,
    distributionReinvestedValue,
    advantageOfKeeping,
  };
}
