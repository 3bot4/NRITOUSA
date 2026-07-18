/**
 * Pure math for the educational NRI property TDS estimator on
 * /nri-selling-property-in-india-tds. Every rate comes from nriTdsConfig
 * (src/data/nriPropertySaleTdsData.ts). Unit-tested in nriPropertyTds.test.ts.
 *
 * Design rules (YMYL):
 *  - Surcharge on the FINAL tax uses the seller's aggregate income when
 *    given; when income is unknown, we return a RANGE (nil → capped
 *    surcharge) instead of false precision.
 *  - Surcharge on the ILLUSTRATIVE withholding uses the payment amount, and
 *    is labeled as a practice-based assumption, never as law.
 *  - Everything is per-seller: inputs take this seller's ownership share.
 *  - The estimator never claims to file anything or replace a CA.
 */
import { nriTdsConfig as cfg } from "@/data/nriPropertySaleTdsData";

export type SellerType = "individual" | "company" | "other";

export interface TdsEstimatorInput {
  /** Total sale consideration for the property (₹). */
  saleConsideration: number;
  /** This seller's ownership percentage (0–100). */
  ownershipPct: number;
  sellerType: SellerType;
  /** ISO dates: "2015-06-01". */
  purchaseDate: string;
  saleDate: string;
  /** Whole-property figures (₹) — the seller's share is applied uniformly. */
  purchaseCost: number;
  improvementCost: number;
  transferExpenses: number;
  /** Claimed exemption estimates for THIS seller (₹). */
  exemption54: number;
  exemption54EC: number;
  /** Lower/nil-deduction certificate, if issued. */
  hasCertificate: boolean;
  certificateRatePct: number;
  /** Seller's estimated other Indian taxable income (₹), or unknown. */
  otherIncomeKnown: boolean;
  otherIncomeInr: number;
  panAvailable: boolean;
}

export interface RangeInr {
  low: number;
  high: number;
}

export interface TdsEstimatorResult {
  valid: boolean;
  errors: string[];
  /** This seller's share of the consideration (₹). */
  shareConsideration: number;
  holdingMonths: number;
  isLongTerm: boolean;
  /** Whether the post-23-Jul-2024 12.5% regime applies to the sale date. */
  newRegime: boolean;
  /** This seller's estimated capital gain after costs and exemptions (₹). */
  estimatedGain: number;
  /** Estimated final Indian tax on the gain (range when income unknown). */
  finalTax: RangeInr;
  /** Illustrative withholding on the gross share without a certificate. */
  withholdingNoCert: number;
  /** Withholding at the certificate rate (null when no certificate). */
  withholdingWithCert: number | null;
  /** Potential excess withholding vs the final-tax estimate (range). */
  potentialExcess: RangeInr;
  assumptions: string[];
}

const monthsBetween = (fromIso: string, toIso: string): number => {
  const a = new Date(fromIso);
  const b = new Date(toIso);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return NaN;
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) months -= 1;
  return months;
};

/** Surcharge % for a given aggregate-income figure, capped for LTCG. */
function surchargePctForIncome(income: number, capPct: number): number {
  // The slabs array is ordered; take the first threshold >= income.
  let pct = 0;
  for (const slab of cfg.surchargeSlabs) {
    if (income <= slab.threshold) {
      pct = slab.pct;
      break;
    }
  }
  return Math.min(pct, capPct);
}

const clamp0 = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const round = (n: number) => Math.round(n);

export function estimateNriPropertyTds(input: TdsEstimatorInput): TdsEstimatorResult {
  const errors: string[] = [];
  const assumptions: string[] = [];

  const consideration = clamp0(input.saleConsideration);
  const pct = Math.min(100, clamp0(input.ownershipPct)) / 100;
  if (consideration <= 0) errors.push("Enter the total sale consideration.");
  if (pct <= 0) errors.push("Enter this seller's ownership percentage (1–100).");

  const holdingMonths = monthsBetween(input.purchaseDate, input.saleDate);
  if (!Number.isFinite(holdingMonths)) {
    errors.push("Enter valid purchase and sale dates.");
  } else if (holdingMonths < 0) {
    errors.push("The sale date is before the purchase date.");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      shareConsideration: 0,
      holdingMonths: Number.isFinite(holdingMonths) ? holdingMonths : 0,
      isLongTerm: false,
      newRegime: false,
      estimatedGain: 0,
      finalTax: { low: 0, high: 0 },
      withholdingNoCert: 0,
      withholdingWithCert: null,
      potentialExcess: { low: 0, high: 0 },
      assumptions,
    };
  }

  const shareConsideration = round(consideration * pct);
  const isLongTerm = holdingMonths > cfg.ltcgHoldingMonths;
  const newRegime = new Date(input.saleDate) >= new Date(cfg.ltcgRegimeDate);

  // This seller's share of the gain, after claimed exemption estimates.
  const wholeGain =
    consideration -
    clamp0(input.purchaseCost) -
    clamp0(input.improvementCost) -
    clamp0(input.transferExpenses);
  const exemptions = clamp0(input.exemption54) + clamp0(input.exemption54EC);
  const estimatedGain = round(Math.max(0, wholeGain * pct - exemptions));

  const cess = 1 + cfg.cessPct / 100;

  /* ── Final tax on the gain ─────────────────────────────────────────── */
  let finalTax: RangeInr;
  if (isLongTerm) {
    const base = (estimatedGain * cfg.ltcgBasePct) / 100;
    if (input.otherIncomeKnown) {
      const aggregate = estimatedGain + clamp0(input.otherIncomeInr);
      const s = surchargePctForIncome(aggregate, cfg.ltcgSurchargeCapPct);
      const tax = round(base * (1 + s / 100) * cess);
      finalTax = { low: tax, high: tax };
    } else {
      finalTax = {
        low: round(base * cess),
        high: round(base * (1 + cfg.ltcgSurchargeCapPct / 100) * cess),
      };
      assumptions.push(
        "Aggregate income unknown → the final-tax figure is a range from nil surcharge to the 15% LTCG surcharge cap.",
      );
    }
  } else {
    // Short-term: slab-taxed. Use a conservative planning band.
    const high = round(((estimatedGain * cfg.stcgPlanningPct) / 100) * (1 + cfg.ltcgSurchargeCapPct / 100) * cess);
    const low = round(((estimatedGain * 20) / 100) * cess);
    finalTax = { low, high };
    assumptions.push(
      "Short-term gains are taxed at slab rates — the estimate shows a planning band, not a slab computation.",
    );
  }

  /* ── Illustrative withholding without a certificate ────────────────── */
  const whBasePct = isLongTerm ? cfg.ltcgBasePct : cfg.stcgPlanningPct;
  // Practice-based: surcharge assumption keyed to the payment amount.
  const whSurcharge = surchargePctForIncome(shareConsideration, cfg.ltcgSurchargeCapPct);
  const withholdingNoCert = round(((shareConsideration * whBasePct) / 100) * (1 + whSurcharge / 100) * cess);
  assumptions.push(
    "Withholding without a certificate is an ILLUSTRATION of common buyer practice (gross payment × rate, surcharge assumed from the payment size). The law applies TDS to sums chargeable to tax; buyers withhold on gross because they cannot establish your gain.",
  );

  const withholdingWithCert = input.hasCertificate
    ? round((shareConsideration * clamp0(input.certificateRatePct)) / 100)
    : null;

  const effectiveWithholding = withholdingWithCert ?? withholdingNoCert;
  const potentialExcess = {
    low: Math.max(0, effectiveWithholding - finalTax.high),
    high: Math.max(0, effectiveWithholding - finalTax.low),
  };

  if (!input.panAvailable) {
    assumptions.push(
      "No PAN: higher withholding can apply and certificates/credits become impractical — obtain a PAN before the sale.",
    );
  }
  if (input.sellerType !== "individual") {
    assumptions.push(
      "Non-individual sellers (companies, firms, trusts) have different rate and surcharge structures — this estimate uses individual-seller math and needs professional review.",
    );
  }
  if (exemptions > 0) {
    assumptions.push(
      "Section 54/54EC exemption inputs are your estimates — both have strict conditions, deadlines, and caps that must be verified with a CA.",
    );
  }
  if (!newRegime && isLongTerm) {
    assumptions.push(
      "Sale dated before July 23, 2024: the older 20%-with-indexation regime applied to such transfers — this estimate's 12.5% math does not apply; review with a CA.",
    );
  }
  assumptions.push(
    "Per-seller estimate: joint ownership requires this calculation separately for each seller.",
    "Educational estimate only — it files nothing and does not replace a CA's computation.",
  );

  return {
    valid: true,
    errors,
    shareConsideration,
    holdingMonths,
    isLongTerm,
    newRegime,
    estimatedGain,
    finalTax,
    withholdingNoCert,
    withholdingWithCert,
    potentialExcess,
    assumptions,
  };
}
