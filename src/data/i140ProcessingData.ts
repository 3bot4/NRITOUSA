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

/* ─────────────────── I-140 Fast Answer snapshot ─────────────────────────── */

export const I140_ESTIMATE_VERIFIED = "2026-07-04";

export const i140SnapshotRows: { label: string; value: string; note?: string; highlight?: boolean }[] = [
  { label: "Filing fee", value: "$715", note: "Employers also pay the $600 Asylum Program Fee ($300 small employer, $0 nonprofit)." },
  { label: "Premium processing", value: "15 business days", note: "Fee $2,965. NIW / EB-1C: 45 business days.", highlight: true },
  { label: "Regular processing", value: "~4–8 months", note: "Varies by service center." },
  { label: "After approval (India EB)", value: "Years — Visa Bulletin", note: "Approval sets your priority date; the green-card wait is the Visa Bulletin backlog." },
];

export const i140SnapshotSources: { label: string; href: string }[] = [
  { label: "USCIS Form I-140", href: "https://www.uscis.gov/i-140" },
  { label: "USCIS Form I-907 (premium)", href: "https://www.uscis.gov/i-907" },
  { label: "USCIS Processing Times", href: "https://egov.uscis.gov/processing-times/" },
  { label: "Visa Bulletin", href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" },
];

export const I140_ESTIMATE_DISCLAIMER =
  "Planning figures only — I-140 times vary by service center and premium fees change (premium rose to $2,965 on Mar 1, 2026). For India EB-2/EB-3 the dominant wait is the Visa Bulletin, not I-140 itself. Not legal advice; verify with USCIS.";
