/**
 * I-140 processing data — editable config for the I-140 cluster
 * (/i140-processing-time, /i140-premium-processing, /i140-approved-what-next).
 *
 * Fee amounts are NOT duplicated here — they live in the single source of truth
 * src/lib/premiumProcessing.ts (getPremiumFeeByForm("I-140")). This file holds
 * only the timing estimates, which are rule-based (premium SLAs) or general
 * planning ranges (standard adjudication).
 *
 * HOW TO UPDATE: premium-processing business-day SLAs rarely change; the
 * standard-processing ranges are general planning estimates — sanity-check them
 * against current USCIS I-140 processing times and bump `lastUpdated`.
 */

export interface I140ProcessingData {
  lastUpdated: string;
  /** Official USCIS I-140 processing-times dashboard. */
  uscisProcessingTimesUrl: string;
  /** Official USCIS premium processing (Form I-907) page. */
  premiumInfoUrl: string;

  /** Premium processing SLA for standard I-140 (EB-2/EB-3 non-NIW). */
  premiumBusinessDays: number;
  /** Premium processing SLA for I-140 NIW (EB-2) and EB-1C. */
  niwEb1cPremiumBusinessDays: number;

  /** Standard (non-premium) adjudication planning range, months. */
  standardMonthsLow: number;
  standardMonthsHigh: number;
}

export const i140ProcessingData: I140ProcessingData = {
  lastUpdated: "Sanity-check against current USCIS I-140 times",
  uscisProcessingTimesUrl: "https://egov.uscis.gov/processing-times/",
  premiumInfoUrl:
    "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",

  premiumBusinessDays: 15,
  niwEb1cPremiumBusinessDays: 45,

  standardMonthsLow: 4,
  standardMonthsHigh: 8,
};

/** Standard educational data-source note for the I-140 cluster. */
export const I140_DATA_NOTE =
  "Data source: USCIS I-140 processing times and Form I-907 premium processing. Times are estimates that change; verify current figures on USCIS before filing.";
