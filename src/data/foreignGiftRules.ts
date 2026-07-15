/**
 * Single source of truth for the changeable rules behind the "Foreign Gifts,
 * Inheritance & Form 3520" cluster.
 *
 * EVERY page and tool in the cluster must read its thresholds, due-date wording,
 * and official-source links from here — never hardcode the figures in a page
 * component. The pillar, cash-gift page, Form 3520 checklist, and the
 * /tools/form-3520-india-gift-checker checker all import these values so a
 * single edit here updates the whole cluster.
 *
 * ─────────────────────────── HOW TO UPDATE ────────────────────────────
 *  1. Form 3520 entity threshold (foreign corporation / partnership) is indexed
 *     to inflation and CHANGES EVERY TAX YEAR. When the IRS publishes the new
 *     figure (see the "Purpose of Form → gifts from foreign corporations or
 *     partnerships" line in the current Instructions for Form 3520), add a new
 *     entry to `entityThresholdByTaxYear` keyed by the tax year. Do NOT delete
 *     old years — prior-year filers still need them.
 *  2. If a tax year is NOT in the map, the checker must show a
 *     "verify current-year threshold" message rather than guessing (see
 *     `entityThresholdForYear` — it returns `null`, never a fallback number).
 *  3. Bump `lastVerified` to the date you re-checked the figures against the
 *     official sources listed in `officialSourceUrls`.
 *  4. Never scrape government sites at runtime — verify manually and hardcode.
 *
 * Nothing here is tax or legal advice. Verify the current figures with a
 * cross-border CPA (US side) and a Chartered Accountant (India side).
 */

import { officialSources } from "@/data/siteWideVerifiedNumbers";

/* ------------------------------------------------------------------ *
 * US — Form 3520 reporting rules
 * ------------------------------------------------------------------ */
export const form3520Rules = {
  /**
   * Aggregate reporting trigger for gifts/bequests from a nonresident alien
   * INDIVIDUAL or a FOREIGN ESTATE (Part IV). More than this in a US tax year
   * is reportable. This figure is a fixed statutory amount (not inflation
   * indexed). Gifts from your parents in India are this case.
   */
  individualOrForeignEstateThresholdUsd: 100_000,

  /**
   * Once the individual/estate trigger above is crossed, each separate gift
   * above this amount must be identified individually on Form 3520.
   */
  itemizationThresholdUsd: 5_000,

  /**
   * Purported gifts from a foreign CORPORATION or PARTNERSHIP (Part IV) use a
   * separate, much lower threshold the IRS INDEXES ANNUALLY FOR INFLATION.
   * Keyed by US tax year. ⚠️ Add the new year's figure each year (see HOW TO
   * UPDATE above). A missing year is handled safely by `entityThresholdForYear`.
   */
  entityThresholdByTaxYear: {
    2025: 20_116,
    2026: 20_573,
  } as Record<number, number>,

  /** Plain-language due-date descriptions (verify current instructions). */
  ordinaryCalendarYearDueDateDescription:
    "Form 3520 is filed separately from Form 1040. For most calendar-year individuals it is generally due April 15, subject to applicable overseas and extension rules.",
  qualifyingAbroadDueDateDescription:
    "A US citizen or resident who is living and working outside the United States generally has a June 15 due date.",
  extendedDueDateDescription:
    "A valid income-tax-return extension generally extends the Form 3520 due date no later than October 15. Verify the current filing instructions and address before submitting.",

  /**
   * Mailing address for a paper Form 3520. ⚠️ Confirm against the current
   * Instructions for Form 3520 before relying on it — the IRS changes filing
   * addresses periodically.
   */
  mailingAddress:
    "Internal Revenue Service Center, P.O. Box 409101, Ogden, UT 84409 (verify against the current Instructions for Form 3520 before mailing).",

  /** Date the figures above were last checked against the official sources. */
  lastVerified: "2026-07-15",

  officialSourceUrls: {
    largeGiftsOrBequests: officialSources.irsForm3520,
    form3520Instructions: "https://www.irs.gov/forms-pubs/about-form-3520",
    internationalPenalties:
      "https://www.irs.gov/businesses/small-businesses-self-employed/international-information-reporting-penalties",
  },
} as const;

/**
 * The entity (foreign corporation/partnership) threshold for a given US tax
 * year, or `null` when the year is not configured. Callers MUST treat `null`
 * as "verify the current-year threshold" — never substitute a guessed number.
 */
export function entityThresholdForYear(taxYear: number): number | null {
  return form3520Rules.entityThresholdByTaxYear[taxYear] ?? null;
}

/** Tax years we have a configured entity threshold for, newest first. */
export const form3520TaxYears: number[] = Object.keys(
  form3520Rules.entityThresholdByTaxYear
)
  .map(Number)
  .sort((a, b) => b - a);

/** The latest configured tax year (checker default). */
export const latestForm3520TaxYear: number = form3520TaxYears[0];

/* ------------------------------------------------------------------ *
 * India — LRS / TCS on the resident sender's outward remittance
 * ------------------------------------------------------------------ */
export const indiaGiftRemittanceRules = {
  /**
   * No TCS generally applies if the resident sender's AGGREGATE LRS remittances
   * during the Indian financial year do not exceed this amount. TCS applies
   * only to the portion above it. Raised from ₹7 lakh to ₹10 lakh effective
   * FY 2025-26. This is an India-side cost on the SENDER, collected as an
   * advance-tax credit — it is not a US tax on the recipient.
   */
  lrsTcsThresholdInr: 1_000_000,

  /**
   * TCS rate on the portion above the threshold for gifts and most other
   * non-education / non-medical purposes. Education and medical remittances
   * follow different (lower) treatment — out of scope for this cluster.
   */
  otherPurposeTcsRate: 0.2,

  /** RBI purpose code for personal gifts / donations (confirm with the bank). */
  giftPurposeCode: "S1302",

  /** India's financial year starts in April (month 4) and ends in March. */
  indianFinancialYearStartMonth: 4,

  lastVerified: "2026-07-15",

  officialSourceUrls: {
    rbiLrs: officialSources.rbiRemittance,
    incomeTaxTcs: officialSources.incomeTaxIndia,
    form15CaCb: officialSources.incomeTaxIndia,
  },
} as const;

/* ------------------------------------------------------------------ *
 * Formatting helpers so pages render the centralized figures consistently
 * ------------------------------------------------------------------ */

/** "$100,000" from 100000. */
export const fmtUsd = (n: number): string => `$${n.toLocaleString("en-US")}`;

/** "₹10 lakh" from 1000000 (Indian lakh convention). */
export const fmtInrLakh = (n: number): string => `₹${n / 100_000} lakh`;

/** Human "Last verified: July 15, 2026" style date (ISO in → long out). */
export const LRS_TCS_THRESHOLD_LABEL = fmtInrLakh(
  indiaGiftRemittanceRules.lrsTcsThresholdInr
);
export const INDIVIDUAL_ESTATE_THRESHOLD_LABEL = fmtUsd(
  form3520Rules.individualOrForeignEstateThresholdUsd
);
export const ITEMIZATION_THRESHOLD_LABEL = fmtUsd(
  form3520Rules.itemizationThresholdUsd
);
