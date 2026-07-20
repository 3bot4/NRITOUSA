/**
 * India–US foreign tax credit — SCREENING estimate only.
 *
 * This models one thing: whether the Indian tax you paid on a slice of income
 * is likely to be fully absorbed by the US tax on that same income. It is NOT
 * a Form 1116 computation and its output must never be presented as the figure
 * that will appear on Form 1116 or Form 67.
 *
 * The real limitation is a ratio applied across your whole return
 * (foreign-source taxable income / worldwide taxable income x US tax before
 * credits), computed separately per income basket. This tool multiplies one
 * income figure by one marginal bracket, which is a far cruder proxy — and it
 * says so in `assumptions`.
 */

import {
  PERCENT,
  USD_AMOUNT,
  validateAll,
  type FieldErrors,
  type FieldSpec,
} from "./validation";

export type Basket = "general" | "passive";

export const dtaaFieldSpecs = {
  income: { label: "Foreign (India) income", ...USD_AMOUNT, required: true },
  indiaTax: { label: "Income tax paid in India", ...USD_AMOUNT, required: true },
  usRate: { label: "US marginal tax bracket", ...PERCENT, required: true },
} satisfies Record<string, FieldSpec>;

type SpecKey = keyof typeof dtaaFieldSpecs;

export interface DtaaRawInputs extends Record<SpecKey, string> {
  basket: Basket;
}

export interface DtaaResult {
  ok: boolean;
  errors: FieldErrors<SpecKey>;
  warnings: string[];
  assumptions: string[];

  income: number;
  indiaTaxPaid: number;
  /** Simplified proxy for the Form 1116 limitation. Not the real limitation. */
  simplifiedUsLimitation: number;
  /** Indian tax absorbed by that simplified limitation. */
  screeningCredit: number;
  /** Indian tax above the simplified limitation. */
  excessAboveLimitation: number;
  /** US tax on this income remaining after the screening credit. */
  residualUsTax: number;
  totalTaxWithoutCredit: number;
  totalTaxWithCredit: number;
  effectiveRateWithoutCredit: number;
  effectiveRateWithCredit: number;
  /** True when Indian tax exceeds the simplified limitation. */
  exceedsLimitation: boolean;
  basket: Basket;
}

/**
 * An effective Indian rate above this on a single income slice is unusual
 * enough to be worth querying before the user trusts the output.
 */
export const IMPLAUSIBLE_FOREIGN_RATE = 60;

export function calculateDtaa(input: DtaaRawInputs): DtaaResult {
  const raw = {
    income: input.income,
    indiaTax: input.indiaTax,
    usRate: input.usRate,
  } as Record<SpecKey, string>;

  const { values, errors, ok } = validateAll(raw, dtaaFieldSpecs);
  const warnings: string[] = [];

  const income = values.income;
  const indiaTaxPaid = values.indiaTax;
  const usRate = values.usRate;

  if (ok && income > 0 && indiaTaxPaid > income) {
    warnings.push(
      "The Indian tax entered is larger than the income it relates to. Check the figures — tax should be a portion of the income, and both should be in the same currency.",
    );
  } else if (ok && income > 0) {
    const effectiveForeignRate = (indiaTaxPaid / income) * 100;
    if (effectiveForeignRate > IMPLAUSIBLE_FOREIGN_RATE) {
      warnings.push(
        `The Indian tax entered is ${effectiveForeignRate.toFixed(0)}% of the income. That is unusually high — check that you have entered tax actually borne on this income, net of any Indian refund, and not a gross remittance or a multi-year total.`,
      );
    }
  }

  const simplifiedUsLimitation = income * (usRate / 100);
  const screeningCredit = Math.min(indiaTaxPaid, simplifiedUsLimitation);
  const excessAboveLimitation = Math.max(0, indiaTaxPaid - simplifiedUsLimitation);
  const residualUsTax = Math.max(0, simplifiedUsLimitation - indiaTaxPaid);

  const totalTaxWithoutCredit = indiaTaxPaid + simplifiedUsLimitation;
  const totalTaxWithCredit = indiaTaxPaid + residualUsTax;

  const assumptions = [
    "This screening estimate multiplies the single income figure you entered by the single marginal bracket you selected. The actual Form 1116 limitation is a ratio across your entire return — foreign-source taxable income divided by worldwide taxable income, applied to your US tax before credits — so your real credit will differ.",
    "Assumes all of the income falls in one Form 1116 basket. Credits cannot be mixed across baskets, and income you hold in other baskets is not considered here.",
    "Ignores source rules, timing differences between when each country taxes the income, currency conversion, treaty resourcing, and the interaction with deductions and the standard deduction.",
    "State taxes are not creditable under the treaty and are excluded.",
    "Excess foreign tax is generally carried back one year and forward up to ten within the same basket. This tool does not model your existing carryovers.",
  ];

  const empty: DtaaResult = {
    ok,
    errors,
    warnings,
    assumptions,
    income: 0,
    indiaTaxPaid: 0,
    simplifiedUsLimitation: 0,
    screeningCredit: 0,
    excessAboveLimitation: 0,
    residualUsTax: 0,
    totalTaxWithoutCredit: 0,
    totalTaxWithCredit: 0,
    effectiveRateWithoutCredit: 0,
    effectiveRateWithCredit: 0,
    exceedsLimitation: false,
    basket: input.basket,
  };

  if (!ok) return empty;

  return {
    ...empty,
    income,
    indiaTaxPaid,
    simplifiedUsLimitation,
    screeningCredit,
    excessAboveLimitation,
    residualUsTax,
    totalTaxWithoutCredit,
    totalTaxWithCredit,
    effectiveRateWithoutCredit:
      income > 0 ? (totalTaxWithoutCredit / income) * 100 : 0,
    effectiveRateWithCredit: income > 0 ? (totalTaxWithCredit / income) * 100 : 0,
    exceedsLimitation: excessAboveLimitation > 0,
  };
}
