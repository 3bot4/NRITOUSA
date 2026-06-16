/**
 * Central source for USCIS premium processing fee data.
 *
 * ─────────────────────────────────────────────────────────────────
 * MONTHLY MAINTENANCE REQUIRED
 * Before updating, verify ALL of the following from the official
 * USCIS Form I-907 premium processing page:
 *   • Fee amounts per form type and category
 *   • Processing timelines (15 vs 30 business days)
 *   • Which form categories are currently eligible
 *   • Any newly eligible or newly ineligible categories
 * Then update `lastVerified` to the current month/year.
 * ─────────────────────────────────────────────────────────────────
 */

export interface PremiumFeeItem {
  form: string;
  category: string;
  feeDisplay: string;
  /** "not-eligible" | fee string */
  eligible: boolean;
  timelineDisplay: string;
  note: string;
}

export interface PremiumProcessingData {
  lastVerified: string;
  effectiveDate: string;
  officialSourceName: string;
  officialSourceUrl: string;
  warning: string;
  items: PremiumFeeItem[];
}

export const premiumProcessing: PremiumProcessingData = {
  lastVerified: "June 2026",
  effectiveDate: "March 1, 2026",
  officialSourceName: "USCIS Form I-907 Premium Processing",
  officialSourceUrl:
    "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
  warning:
    "Fees can change. NRItoUSA tries to keep this updated, but always verify the latest fee on the official USCIS Form I-907 page before filing. A small mismatch can happen if USCIS updates fees between our monthly reviews.",
  items: [
    {
      form: "I-129",
      category: "H-1B, L-1, O-1, P, E, TN and similar eligible worker petitions",
      feeDisplay: "$2,965",
      eligible: true,
      timelineDisplay: "15 business days for many eligible categories",
      note: "Premium processing speeds up USCIS action, not approval.",
    },
    {
      form: "I-140",
      category: "Employment-based immigrant petitions (EB-1, EB-2, EB-3)",
      feeDisplay: "$2,965",
      eligible: true,
      timelineDisplay: "15 business days for many eligible categories; some may differ",
      note: "Premium processing speeds up USCIS action — not visa bulletin movement or green card availability.",
    },
    {
      form: "I-129",
      category: "H-2B and R-1 categories",
      feeDisplay: "$1,780",
      eligible: true,
      timelineDisplay: "Varies by category",
      note: "Verify category eligibility before filing.",
    },
    {
      form: "I-765",
      category: "F-1 OPT and STEM OPT premium processing categories",
      feeDisplay: "$1,780",
      eligible: true,
      timelineDisplay: "30 business days for many OPT/STEM OPT requests",
      note: "Premium processing is not available for every EAD category.",
    },
    {
      form: "I-539",
      category: "F, J, M change/extension of status categories",
      feeDisplay: "$2,075",
      eligible: true,
      timelineDisplay: "30 business days for many eligible categories",
      note: "Premium processing availability depends on category.",
    },
    {
      form: "I-485",
      category: "Adjustment of Status",
      feeDisplay: "Not eligible",
      eligible: false,
      timelineDisplay: "Premium processing not available",
      note: "Do not suggest premium processing for I-485.",
    },
  ],
};

/** Convenience lookup by form prefix (e.g. "I-129", "I-140"). Returns all matching rows. */
export function getPremiumFeeByForm(form: string): PremiumFeeItem[] {
  return premiumProcessing.items.filter(
    (item) => item.form.toLowerCase() === form.toLowerCase()
  );
}

/** Returns the most common H-1B/I-129 fee item (first eligible I-129 row). */
export function getH1bPremiumFee(): PremiumFeeItem {
  return premiumProcessing.items.find(
    (item) => item.form === "I-129" && item.eligible
  )!;
}

/** Short inline note for embedding near H-1B/I-129 premium processing explanations. */
export function h1bPremiumFeeNote(): string {
  const item = getH1bPremiumFee();
  return `Current common H-1B/I-129 premium processing fee: ${item.feeDisplay} for many eligible categories. ${premiumProcessing.warning}`;
}
