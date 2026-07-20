/**
 * India property sale — capital gains, Section 195 withholding, and
 * repatriation headroom for an NRI seller.
 *
 * The previous version of this calculator combined capital-gains tax and TDS
 * into a single "Estimated total tax / TDS" figure. Those are different
 * calculations on different bases (gain vs. gross consideration) and are kept
 * strictly separate here — a sale at a loss still attracts TDS, which is the
 * clearest demonstration that they are not the same number.
 */

import {
  CESS_RATE,
  LTCG_HOLDING_MONTHS,
  LTCG_RATE_POST_JUL_2024,
  REPATRIATION_LIMIT_USD,
  SEC_54EC_CAP,
  STCG_WITHHOLDING_CONVENTION_RATE,
  surchargeRate,
} from "./indiaPropertyRates";
import {
  FX_USD_INR,
  INR_AMOUNT,
  PERCENT,
  USD_AMOUNT,
  validateAll,
  type FieldErrors,
  type FieldSpec,
} from "./validation";

/** Field specs. Bounds exist to reject junk, not to block large legitimate sales. */
export const propertyFieldSpecs = {
  purchasePrice: { label: "Purchase price", ...INR_AMOUNT, required: true },
  salePrice: { label: "Sale price", ...INR_AMOUNT, required: true },
  sellingExpenses: { label: "Selling expenses", ...INR_AMOUNT },
  improvementCosts: { label: "Improvement costs", ...INR_AMOUNT },
  sec54Exemption: { label: "Section 54 exemption", ...INR_AMOUNT },
  sec54ec: { label: "Section 54EC investment", min: 0, max: SEC_54EC_CAP },
  stcgSlabRate: { label: "Applicable slab rate", ...PERCENT },
  approvedTdsRate: { label: "Approved TDS rate", ...PERCENT },
  fxRate: { label: "USD/INR exchange rate", ...FX_USD_INR, required: true },
  alreadyRepatriated: {
    label: "Already repatriated this financial year",
    min: 0,
    max: REPATRIATION_LIMIT_USD,
  },
} satisfies Record<string, FieldSpec>;

type SpecKey = keyof typeof propertyFieldSpecs;

export interface PropertyRawInputs extends Record<SpecKey, string> {
  /** "long" | "short", or "dates" to derive from acquisition/sale dates. */
  termMode: "long" | "short" | "dates";
  acquisitionDate: string;
  saleDate: string;
  /** Seller obtained a s.197 lower/nil deduction certificate. */
  hasLowerTdsCertificate: boolean;
  /** Property was inherited — cost basis follows the previous owner. */
  isInherited: boolean;
}

export interface PropertyResult {
  ok: boolean;
  errors: FieldErrors<SpecKey> & { dates?: string; stcgSlabRate?: string };
  /** Blocking notices that stop specific outputs from being computed. */
  needsMoreInfo: string[];
  /** Non-blocking cautions the UI must display. */
  warnings: string[];

  isLongTerm: boolean;
  holdingMonths: number | null;

  /* 1–4: the gain computation */
  grossSaleConsideration: number;
  adjustedCostBase: number;
  capitalGain: number;
  /** True when the sale produced a capital loss. */
  isCapitalLoss: boolean;
  exemptionUsed: number;
  taxableGain: number;

  /* 5–8: the final tax liability, charged on the GAIN */
  baseTax: number;
  surcharge: number;
  /** False when surcharge could not be determined from available inputs. */
  surchargeCalculated: boolean;
  cess: number;
  finalTaxLiability: number;
  /** Null when the slab rate is missing for a short-term sale. */
  taxCalculable: boolean;

  /* 9–10: withholding, charged on the GROSS CONSIDERATION */
  estimatedTds: number;
  tdsRateApplied: number;
  tdsBasis: "gross-consideration" | "certificate";
  /** Positive = refund due to seller; negative = further tax payable. */
  excessTdsRefundable: number;

  /* 11–14: cash and repatriation */
  netProceedsAfterFinalTax: number;
  immediateCashAfterTds: number;
  /** Immediate cash after TDS, in USD at the entered rate. */
  immediateCashUsd: number;
  /** Net proceeds after final tax, in USD at the same entered rate. */
  netProceedsUsd: number;
  estimatedRepatriableUsd: number;
  remainingHeadroomUsd: number;
  exceedsRepatriationLimit: boolean;
}

/** Whole months between two ISO dates, or null if either is unusable. */
export function monthsBetween(from: string, to: string): number | null {
  if (!from || !to) return null;
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
  if (b < a) return null;

  let months =
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) months -= 1;
  return Math.max(0, months);
}

export function calculateProperty(input: PropertyRawInputs): PropertyResult {
  const raw = {
    purchasePrice: input.purchasePrice,
    salePrice: input.salePrice,
    sellingExpenses: input.sellingExpenses,
    improvementCosts: input.improvementCosts,
    sec54Exemption: input.sec54Exemption,
    sec54ec: input.sec54ec,
    stcgSlabRate: input.stcgSlabRate,
    approvedTdsRate: input.approvedTdsRate,
    fxRate: input.fxRate,
    alreadyRepatriated: input.alreadyRepatriated,
  } as Record<SpecKey, string>;

  const { values, errors: baseErrors } = validateAll(raw, propertyFieldSpecs);
  const errors: PropertyResult["errors"] = { ...baseErrors };
  const needsMoreInfo: string[] = [];
  const warnings: string[] = [];

  /* ---------------- holding period ---------------- */
  let holdingMonths: number | null = null;
  let isLongTerm = input.termMode === "long";

  if (input.termMode === "dates") {
    holdingMonths = monthsBetween(input.acquisitionDate, input.saleDate);
    if (holdingMonths === null) {
      errors.dates =
        "Enter a valid acquisition date and a sale date on or after it.";
    } else {
      isLongTerm = holdingMonths > LTCG_HOLDING_MONTHS;
    }
  }

  /* ---------------- the gain (outputs 1–4) ---------------- */
  const grossSaleConsideration = values.salePrice;
  const adjustedCostBase =
    values.purchasePrice + values.improvementCosts + values.sellingExpenses;
  const capitalGain = grossSaleConsideration - adjustedCostBase;
  const isCapitalLoss = capitalGain < 0;
  const eligibleGain = Math.max(0, capitalGain);

  // Section 54 / 54EC apply to long-term gains only.
  const requestedExemption = isLongTerm
    ? values.sec54Exemption + values.sec54ec
    : 0;

  if (!isLongTerm && values.sec54ec > 0) {
    warnings.push(
      "Section 54EC applies to long-term gains only — the amount entered has been ignored for this short-term sale.",
    );
  }
  if (requestedExemption > eligibleGain && eligibleGain >= 0) {
    errors.sec54ec =
      "Total exemption claimed cannot exceed the capital gain otherwise eligible for it.";
  }

  const exemptionUsed = Math.min(requestedExemption, eligibleGain);
  const taxableGain = Math.max(0, eligibleGain - exemptionUsed);

  /* ---------------- final tax liability (outputs 5–8) ----------------
   * Charged on the GAIN. For a short-term sale there is no special rate:
   * the gain is taxed at the seller's slab rate, so without that rate we
   * refuse to invent a liability.
   */
  const slabRateSupplied = input.stcgSlabRate.trim() !== "";
  let taxCalculable = true;
  let taxRate = 0;

  if (isLongTerm) {
    taxRate = LTCG_RATE_POST_JUL_2024;
  } else if (slabRateSupplied && !errors.stcgSlabRate) {
    taxRate = values.stcgSlabRate / 100;
  } else {
    taxCalculable = false;
    needsMoreInfo.push(
      "Short-term gains on property are taxed at your applicable slab rate, which depends on your total Indian income. Enter your estimated marginal slab rate to see an estimated liability.",
    );
  }

  const baseTax = taxCalculable ? taxableGain * taxRate : 0;

  // Surcharge depends on total income, which this tool does not collect. It is
  // applied on the taxable gain as an approximation and flagged as such.
  const surchargeCalculated = taxCalculable && taxableGain > 0;
  const surcharge = surchargeCalculated
    ? baseTax * surchargeRate(taxableGain, isLongTerm)
    : 0;
  if (surchargeCalculated) {
    warnings.push(
      "Surcharge is estimated from the taxable gain alone. Your actual surcharge band depends on your total Indian income for the year.",
    );
  }

  const cess = (baseTax + surcharge) * CESS_RATE;
  const finalTaxLiability = baseTax + surcharge + cess;

  /* ---------------- Section 195 withholding (outputs 9–10) ----------------
   * Charged on GROSS CONSIDERATION, not on the gain, unless a s.197
   * certificate directs otherwise.
   */
  let tdsRateApplied: number;
  let estimatedTds: number;
  let tdsBasis: PropertyResult["tdsBasis"];

  if (input.hasLowerTdsCertificate) {
    tdsBasis = "certificate";
    tdsRateApplied = values.approvedTdsRate / 100;
    estimatedTds = grossSaleConsideration * tdsRateApplied;
  } else {
    tdsBasis = "gross-consideration";
    const statutoryRate = isLongTerm
      ? LTCG_RATE_POST_JUL_2024
      : STCG_WITHHOLDING_CONVENTION_RATE;
    const sc = surchargeRate(grossSaleConsideration, isLongTerm);
    // Surcharge and cess sit on top of the base withholding rate.
    tdsRateApplied = statutoryRate * (1 + sc) * (1 + CESS_RATE);
    estimatedTds = grossSaleConsideration * tdsRateApplied;

    if (!isLongTerm) {
      warnings.push(
        "For a short-term sale, buyers commonly withhold at the maximum marginal rate. This is a withholding convention, not your tax rate — your actual liability is computed at your own slab rate and reconciled when you file.",
      );
    }
  }

  const excessTdsRefundable = taxCalculable
    ? estimatedTds - finalTaxLiability
    : 0;

  /* ---------------- cash and repatriation (outputs 11–14) ---------------- */
  const netProceedsAfterFinalTax = taxCalculable
    ? grossSaleConsideration - finalTaxLiability
    : 0;
  const immediateCashAfterTds = grossSaleConsideration - estimatedTds;

  const fx = values.fxRate;
  const remainingHeadroomUsd = Math.max(
    0,
    REPATRIATION_LIMIT_USD - values.alreadyRepatriated,
  );

  // Every USD figure uses the SAME exchange-rate input.
  const immediateCashUsd = fx > 0 ? Math.max(0, immediateCashAfterTds) / fx : 0;
  const netProceedsUsd = fx > 0 ? Math.max(0, netProceedsAfterFinalTax) / fx : 0;

  // Repatriation follows the FINAL tax position, not the day-one cash after
  // TDS — the excess TDS is refunded (or a shortfall paid) when the return is
  // filed, and only then is the true net available. Capped by the remaining
  // RBI/FEMA headroom. Undefined when the final tax cannot be computed.
  const repatriationBasisUsd = taxCalculable ? netProceedsUsd : 0;
  const estimatedRepatriableUsd = Math.min(repatriationBasisUsd, remainingHeadroomUsd);
  const exceedsRepatriationLimit = repatriationBasisUsd > remainingHeadroomUsd;

  /* ---------------- contextual notices ---------------- */
  if (input.isInherited) {
    needsMoreInfo.push(
      "For inherited property the cost of acquisition is generally the previous owner's cost, not the value at the date of inheritance, and the previous owner's holding period is included when testing long-term status. Property acquired before 1 April 2001 may instead use fair market value as at that date. Have an Indian CA establish the correct basis before relying on this estimate.",
    );
  }
  if (isCapitalLoss) {
    warnings.push(
      "This sale produces a capital loss, so no capital-gains tax arises — but the buyer is still required to withhold TDS on the gross sale consideration. Recovering it means filing an Indian return, or obtaining a lower/nil deduction certificate before the sale.",
    );
  }

  const ok =
    Object.keys(errors).length === 0 &&
    (input.termMode !== "dates" || holdingMonths !== null);

  return {
    ok,
    errors,
    needsMoreInfo,
    warnings,
    isLongTerm,
    holdingMonths,
    grossSaleConsideration,
    adjustedCostBase,
    capitalGain,
    isCapitalLoss,
    exemptionUsed,
    taxableGain,
    baseTax,
    surcharge,
    surchargeCalculated,
    cess,
    finalTaxLiability,
    taxCalculable,
    estimatedTds,
    tdsRateApplied,
    tdsBasis,
    excessTdsRefundable,
    netProceedsAfterFinalTax,
    immediateCashAfterTds,
    immediateCashUsd,
    netProceedsUsd,
    estimatedRepatriableUsd,
    remainingHeadroomUsd,
    exceedsRepatriationLimit,
  };
}
