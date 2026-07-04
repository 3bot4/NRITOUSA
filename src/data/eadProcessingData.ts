/**
 * EAD / Advance Parole data — editable config for the EAD cluster
 * (/ead-processing-time, /advance-parole-processing-time, /ead-renewal-gap).
 *
 * EAD (Form I-765) processing times vary a LOT by category and service center,
 * so the per-category ranges below are GENERAL PLANNING ESTIMATES, clearly
 * labelled as such on-page — always check the official USCIS processing-times
 * dashboard for your exact form category and office. We never present these as
 * guaranteed times. Premium-processing fees are NOT duplicated here — they live
 * in src/lib/premiumProcessing.ts (getPremiumFeeByForm("I-765")).
 *
 * HOW TO UPDATE: sanity-check the ranges against egov.uscis.gov/processing-times
 * and re-confirm the auto-extension length on the official USCIS automatic
 * EAD extension page; then bump `lastUpdated`.
 */

export interface EadCategory {
  key: string;
  /** USCIS eligibility category code(s). */
  code: string;
  label: string;
  /** General planning range in months. */
  monthsLow: number;
  monthsHigh: number;
  /** Whether a timely-filed renewal in this category currently gets the automatic extension. */
  autoExtension: boolean;
  /** Whether I-765 premium processing is available for this category. */
  premiumEligible: boolean;
}

export interface EadProcessingData {
  lastUpdated: string;
  uscisProcessingTimesUrl: string;
  autoExtensionInfoUrl: string;
  premiumInfoUrl: string;
  advanceParoleInfoUrl: string;

  /**
   * Automatic EAD extension length for eligible, timely-filed renewals.
   * USCIS increased this to up to 540 days for certain categories — always
   * re-verify the current figure and eligible categories at the official page.
   */
  autoExtensionDays: number;

  /** Advance Parole (Form I-131) general planning range, months. */
  advanceParoleMonthsLow: number;
  advanceParoleMonthsHigh: number;

  categories: EadCategory[];
}

export const eadProcessingData: EadProcessingData = {
  lastUpdated: "Sanity-check against current USCIS processing times",
  uscisProcessingTimesUrl: "https://egov.uscis.gov/processing-times/",
  autoExtensionInfoUrl:
    "https://www.uscis.gov/working-in-the-united-states/automatic-employment-authorization-document-ead-extension",
  premiumInfoUrl:
    "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
  advanceParoleInfoUrl:
    "https://www.uscis.gov/i-131",

  autoExtensionDays: 540,

  advanceParoleMonthsLow: 4,
  advanceParoleMonthsHigh: 9,

  categories: [
    { key: "c09", code: "(c)(9)", label: "Pending I-485 / adjustment of status", monthsLow: 3, monthsHigh: 8, autoExtension: true, premiumEligible: false },
    { key: "c26", code: "(c)(26)", label: "H-4 spouse of H-1B", monthsLow: 3, monthsHigh: 8, autoExtension: true, premiumEligible: false },
    { key: "a18", code: "(a)(18)", label: "L-2 spouse of L-1", monthsLow: 3, monthsHigh: 8, autoExtension: true, premiumEligible: false },
    { key: "c08", code: "(c)(8)", label: "Pending asylum applicant", monthsLow: 3, monthsHigh: 10, autoExtension: true, premiumEligible: false },
    { key: "c03b", code: "(c)(3)(B)", label: "F-1 student — post-completion OPT", monthsLow: 2, monthsHigh: 5, autoExtension: false, premiumEligible: true },
    { key: "c03c", code: "(c)(3)(C)", label: "F-1 student — STEM OPT extension", monthsLow: 2, monthsHigh: 5, autoExtension: false, premiumEligible: true },
    { key: "other", code: "varies", label: "Other / not sure", monthsLow: 3, monthsHigh: 10, autoExtension: false, premiumEligible: false },
  ],
};

/** Standard educational data-source note for the EAD cluster. */
export const EAD_DATA_NOTE =
  "Data source: USCIS I-765 / I-131 processing times and the official automatic EAD extension page. Times vary widely by category and office and are estimates — verify your exact category on USCIS before relying on a date.";
