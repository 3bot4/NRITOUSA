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
  /**
   * Whether a timely-filed renewal in this category gets the automatic extension
   * TODAY. A DHS interim final rule effective Oct 30, 2025 removed the automatic
   * extension for renewals filed on or after that date, so this is now `false`
   * for every standard category. Categories that qualified under the OLD rule are
   * flagged via `autoExtensionPreRule` for people who filed before the cutoff.
   */
  autoExtension: boolean;
  /** Qualified for the up-to-540-day extension on renewals filed BEFORE 2025-10-30. */
  autoExtensionPreRule: boolean;
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
   * Automatic EAD extension length that applied to eligible, timely-filed
   * renewals RECEIVED BEFORE `autoExtensionRemovedDate`. Retained because those
   * filings are still running; it does NOT apply to renewals filed today.
   */
  autoExtensionDays: number;

  /** ISO date the automatic extension was removed for new filings. */
  autoExtensionRemovedDate: string;

  /** Advance Parole (Form I-131) general planning range, months. */
  advanceParoleMonthsLow: number;
  advanceParoleMonthsHigh: number;

  categories: EadCategory[];
}

export const eadProcessingData: EadProcessingData = {
  lastUpdated: "2026-07-19",
  uscisProcessingTimesUrl: "https://egov.uscis.gov/processing-times/",
  autoExtensionInfoUrl:
    "https://www.uscis.gov/working-in-the-united-states/automatic-employment-authorization-document-ead-extension",
  premiumInfoUrl:
    "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
  advanceParoleInfoUrl:
    "https://www.uscis.gov/i-131",

  autoExtensionDays: 540,

  /**
   * DHS interim final rule removing the automatic EAD extension. Renewals
   * RECEIVED on or after this date get no automatic extension.
   * https://www.federalregister.gov/documents/2025/10/30/2025-19702/removal-of-the-automatic-extension-of-employment-authorization-documents
   */
  autoExtensionRemovedDate: "2025-10-30",

  advanceParoleMonthsLow: 4,
  advanceParoleMonthsHigh: 9,

  categories: [
    { key: "c09", code: "(c)(9)", label: "Pending I-485 / adjustment of status", monthsLow: 3, monthsHigh: 8, autoExtension: false, autoExtensionPreRule: true, premiumEligible: false },
    { key: "c26", code: "(c)(26)", label: "H-4 spouse of H-1B", monthsLow: 3, monthsHigh: 8, autoExtension: false, autoExtensionPreRule: true, premiumEligible: false },
    { key: "a18", code: "(a)(18)", label: "L-2 spouse of L-1", monthsLow: 3, monthsHigh: 8, autoExtension: false, autoExtensionPreRule: true, premiumEligible: false },
    { key: "c08", code: "(c)(8)", label: "Pending asylum applicant", monthsLow: 3, monthsHigh: 10, autoExtension: false, autoExtensionPreRule: true, premiumEligible: false },
    { key: "c03b", code: "(c)(3)(B)", label: "F-1 student — post-completion OPT", monthsLow: 2, monthsHigh: 5, autoExtension: false, autoExtensionPreRule: false, premiumEligible: true },
    { key: "c03c", code: "(c)(3)(C)", label: "F-1 student — STEM OPT extension", monthsLow: 2, monthsHigh: 5, autoExtension: false, autoExtensionPreRule: false, premiumEligible: true },
    { key: "other", code: "varies", label: "Other / not sure", monthsLow: 3, monthsHigh: 10, autoExtension: false, autoExtensionPreRule: false, premiumEligible: false },
  ],
};

/** Standard educational data-source note for the EAD cluster. */
export const EAD_DATA_NOTE =
  "Data source: USCIS I-765 / I-131 processing times and the official automatic EAD extension page. Times vary widely by category and office and are estimates — verify your exact category on USCIS before relying on a date.";

/* ─────────────── EAD / Advance Parole Fast Answer snapshot ──────────────── */

export const EAD_ESTIMATE_VERIFIED = "2026-07-04";

export const eadSnapshotRows: { label: string; value: string; note?: string; highlight?: boolean }[] = [
  { label: "EAD (most categories)", value: "3–8 months", note: "Pending I-485 / H-4 / L-2 / asylum; varies by office.", highlight: true },
  { label: "F-1 OPT / STEM OPT", value: "2–5 months", note: "Premium processing available for these I-765 categories." },
  { label: "Advance Parole (I-131)", value: "4–9 months", note: "No regular premium processing." },
  { label: "Auto-extension", value: "Ended for new filings", note: "A DHS interim final rule effective Oct 30, 2025 removed the automatic extension. Renewals filed on/after that date get none; renewals filed before it keep up to 540 days. Limited exceptions apply where provided by law or Federal Register notice (e.g. certain TPS documentation)." },
];

export const eadSnapshotSources: { label: string; href: string }[] = [
  { label: "USCIS Processing Times", href: "https://egov.uscis.gov/processing-times/" },
  { label: "USCIS Form I-765", href: "https://www.uscis.gov/i-765" },
  { label: "USCIS Form I-131", href: "https://www.uscis.gov/i-131" },
];

export const EAD_ESTIMATE_DISCLAIMER =
  "General planning ranges only — EAD/AP times vary widely by category and field office and change over time. Auto-extension length and eligibility depend on your category. Not legal advice; verify with USCIS before relying on any date.";
