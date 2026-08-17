/**
 * Dual tax calendar for US-based NRIs — the India financial year (Apr–Mar) and
 * the US tax year (Jan–Dec) side by side.
 *
 * WHY THIS EXISTS: an NRI in the USA is inside two tax systems whose years do
 * not line up. India runs 1 April – 31 March; the US runs 1 January – 31
 * December. Income earned in India during Jan–Mar therefore falls in one Indian
 * financial year but a different US tax year, which is the single most common
 * source of foreign-tax-credit errors. The offset is the point of this file, not
 * an incidental detail.
 *
 * MAINTENANCE RULES
 *  - These are the STATUTORY dates. CBDT extends Indian filing deadlines most
 *    years, often more than once, and the IRS grants disaster-area extensions.
 *    Never present a date here as the final word — the UI must carry the
 *    "confirm before you file" note below.
 *  - Dates here are recurring calendar dates (e.g. "July 31"), NOT event dates
 *    tied to a specific year, so they are safe to leave in place across years.
 *    Do not convert them into absolute dated stamps.
 *  - Anything genuinely year-specific belongs in a page, not here.
 *
 * Compiled 2026-08-17 against the Income Tax Act 1961 / Income-tax Rules
 * (Rule 128 for Form 67) and IRS filing-deadline guidance. Educational
 * information only — not tax advice.
 */

export const NRI_TAX_CALENDAR_VERIFIED = "2026-08-17";
export const NRI_TAX_CALENDAR_VERIFIED_HUMAN = "August 17, 2026";

export type TaxSystem = "india" | "us";

export interface TaxCalendarEntry {
  /** Recurring calendar date, e.g. "July 31". Never a specific year. */
  date: string;
  system: TaxSystem;
  title: string;
  detail: string;
  /**
   * WHICH tax year this date belongs to, expressed relationally so it stays
   * correct in any calendar year. A bare "July 31 — ITR due" is ambiguous and
   * therefore untrustworthy: 31 July 2026 is the due date for FY 2025-26
   * (AY 2026-27), not for the FY that started that April. Every India row
   * must carry this.
   */
  appliesTo: string;
  /** True for the handful of dates most NRIs actually get wrong. */
  critical?: boolean;
}

/**
 * Worked FY→AY→due-date mapping. India labels a return by its ASSESSMENT year,
 * which is always the year AFTER the financial year it reports — the single
 * most common labelling error in NRI tax content.
 */
export interface FyAyRow {
  financialYear: string;
  period: string;
  assessmentYear: string;
  itrDueNonAudit: string;
  belatedRevisedBy: string;
}

export const fyAyMapping: FyAyRow[] = [
  {
    financialYear: "FY 2025-26",
    period: "1 Apr 2025 – 31 Mar 2026",
    assessmentYear: "AY 2026-27",
    itrDueNonAudit: "31 July 2026",
    belatedRevisedBy: "31 Dec 2026",
  },
  {
    financialYear: "FY 2026-27",
    period: "1 Apr 2026 – 31 Mar 2027",
    assessmentYear: "AY 2027-28",
    itrDueNonAudit: "31 July 2027",
    belatedRevisedBy: "31 Dec 2027",
  },
];

/* ───────────────────────── The offset, stated plainly ───────────────────── */

export const yearOffsetExplainer = {
  headline: "Your two tax years do not line up — and that is where mistakes start",
  body: "India's financial year runs 1 April to 31 March. The US tax year runs 1 January to 31 December. So Indian income earned between January and March sits in one Indian financial year but a different US tax year. When you claim a US foreign tax credit for Indian tax paid, or an Indian credit for US tax, you are matching income across two calendars that are three months out of step. Most cross-border credit errors trace back to this and nothing else.",
  example:
    "NRO interest credited in February falls in the Indian financial year that ends the following 31 March, but in the US tax year that ended the previous 31 December. The Indian tax on it may not even be finally determined by the time your US return is due — which is why the extension to 15 October exists and why experienced cross-border filers use it by default rather than as a fallback.",
} as const;

/* ─────────────────────────── The calendar itself ───────────────────────── */

export const taxCalendar: TaxCalendarEntry[] = [
  {
    date: "January 15",
    system: "us",
    title: "Q4 estimated tax payment",
    detail:
      "Final estimated-tax instalment (Form 1040-ES) for the tax year that just ended. Relevant if you have India rental income, capital gains, or other income without US withholding.",
    appliesTo:
      "US tax year that ended the previous 31 December",
  },
  {
    date: "March 15",
    system: "india",
    title: "Final advance tax instalment",
    detail:
      "Fourth and final advance-tax instalment for the Indian financial year ending 31 March. Advance tax applies once your India tax liability crosses the statutory threshold after TDS.",
    appliesTo:
      "Indian FY ending 31 March of this same year",
  },
  {
    date: "March 31",
    system: "india",
    title: "Indian financial year ends",
    detail:
      "The Indian tax year closes. Everything after this date is reported in the next financial year. This is also the cut-off for several year-end tax-saving actions on the India side.",
    appliesTo:
      "Closes the FY that began the previous 1 April",
    critical: true,
  },
  {
    date: "April 15",
    system: "us",
    title: "Form 1040 due · FBAR due · Q1 estimated tax",
    detail:
      "US individual return due, along with Form 8938 if you meet the FATCA threshold. FBAR (FinCEN Form 114) is technically due today but carries an automatic extension to 15 October with no request needed. Q1 estimated tax for the current year is also due.",
    appliesTo:
      "US tax year that ended the previous 31 December (Q1 estimate is for the current year)",
    critical: true,
  },
  {
    date: "June 15",
    system: "us",
    title: "Automatic extension for filers abroad · Q2 estimated tax",
    detail:
      "If you live outside the US, you get an automatic two-month extension to file — but interest still runs on unpaid tax from 15 April. Q2 estimated tax is also due.",
    appliesTo: "US tax year that ended the previous 31 December",
  },
  {
    date: "June 15",
    system: "india",
    title: "First advance tax instalment",
    detail:
      "First advance-tax instalment for the Indian financial year that began on 1 April.",
    appliesTo:
      "Indian FY that began this 1 April",
  },
  {
    date: "July 31",
    system: "india",
    title: "ITR due date — non-audit cases",
    detail:
      "Statutory due date for individuals whose accounts do not require audit, which covers most NRIs with salary, interest, rental, or capital-gains income. Filing an ITR is how you reclaim excess TDS on NRO interest, rent, or a property sale — a refund you simply forfeit if you never file.",
    appliesTo:
      "Indian FY that ended the previous 31 March — i.e. AY = this calendar year",
    critical: true,
  },
  {
    date: "September 15",
    system: "india",
    title: "Second advance tax instalment",
    detail: "Second advance-tax instalment for the current Indian financial year.",
    appliesTo:
      "Indian FY that began this 1 April",
  },
  {
    date: "September 15",
    system: "us",
    title: "Q3 estimated tax payment",
    detail: "Third estimated-tax instalment for the current US tax year.",
    appliesTo:
      "Current US tax year",
  },
  {
    date: "October 15",
    system: "us",
    title: "Extended Form 1040 deadline · FBAR final deadline",
    detail:
      "Final date for a US return filed under a Form 4868 extension, and the end of the FBAR automatic extension. For NRIs this is often the practical filing date rather than April, because Indian tax figures for the overlapping period are usually settled by now.",
    appliesTo: "US tax year that ended the previous 31 December",
    critical: true,
  },
  {
    date: "October 31",
    system: "india",
    title: "ITR due date — audit cases",
    detail:
      "Due date where a tax audit applies, typically business or professional income above the audit thresholds. The audit report itself is due earlier. Most salaried and investment-income NRIs are not in this bucket.",
    appliesTo:
      "Indian FY that ended the previous 31 March — i.e. AY = this calendar year",
  },
  {
    date: "December 15",
    system: "india",
    title: "Third advance tax instalment",
    detail: "Third advance-tax instalment for the current Indian financial year.",
    appliesTo:
      "Indian FY that began this 1 April",
  },
  {
    date: "December 31",
    system: "india",
    title: "Belated and revised return deadline",
    detail:
      "Last date to file a belated return, or revise a return already filed, for the relevant assessment year. Missing 31 July is recoverable here — at the cost of a late fee and the loss of some carry-forward benefits.",
    appliesTo:
      "Indian FY that ended 15 months earlier — i.e. AY = this calendar year",
    critical: true,
  },
  {
    date: "December 31",
    system: "us",
    title: "US tax year ends",
    detail:
      "The US tax year closes. Actions that affect your US return — charitable gifts, loss harvesting, retirement contributions with a year-end deadline — must be completed by today.",
    appliesTo:
      "Closes the US tax year that began this 1 January",
  },
];

/* ──────────────────── Residential status: the day-count tests ──────────── */

/**
 * Section 6 residency, including the 2020 amendment most NRI content omits:
 * the 120-day trigger that applies only when India-sourced income exceeds
 * ₹15 lakh. Getting this wrong changes what India can tax.
 */
export const residencyTests = {
  intro:
    "India decides your residential status by counting days in the April–March financial year. Three tests matter, and the third one — added in 2020 — is the one most often missed.",
  tests: [
    {
      label: "182-day test",
      rule: "Present in India for 182 days or more in the financial year → Resident.",
      note: "The headline rule, and the only one many NRIs know about.",
    },
    {
      label: "60 + 365 test",
      rule: "Present 60 days or more in the year AND 365 days or more across the preceding four years → Resident.",
      note: "For an Indian citizen leaving India for employment abroad, or visiting India, the 60 days is relaxed to 182 — which is why most NRIs on short visits stay non-resident.",
    },
    {
      label: "120-day test (₹15 lakh trigger)",
      rule: "An Indian citizen or person of Indian origin visiting India whose India-sourced income exceeds ₹15 lakh in the year becomes Resident at 120 days instead of 182.",
      note: "Applies only above the ₹15 lakh India-income threshold. Someone crossing it is treated as Resident but Not Ordinarily Resident (RNOR), so foreign income generally stays outside India's net.",
    },
  ],
  rnorNote:
    "RNOR is the useful middle status: you are Resident for day-count purposes but your foreign income is generally not taxable in India. Returning NRIs often qualify for RNOR for two to three years after moving back, which is the window in which to plan repatriation and asset sales.",
} as const;

/* ────────────────────────── NRE vs NRO taxability ──────────────────────── */

export interface NreNroRow {
  aspect: string;
  nre: string;
  nro: string;
}

export const nreVsNroRows: NreNroRow[] = [
  {
    aspect: "Interest — India tax",
    nre: "Exempt under Section 10(4)(ii) while you remain a non-resident",
    nro: "Fully taxable; TDS deducted at source",
  },
  {
    aspect: "Interest — US tax",
    nre: "Fully taxable on your US return — India's exemption does not travel",
    nro: "Fully taxable on your US return",
  },
  {
    aspect: "Foreign tax credit",
    nre: "None available — no Indian tax was paid, so there is nothing to credit",
    nro: "Indian TDS can generally support a Form 1116 credit",
  },
  {
    aspect: "Repatriation",
    nre: "Freely repatriable, principal and interest",
    nro: "Up to USD 1 million per financial year, subject to documentation",
  },
  {
    aspect: "FBAR / FATCA",
    nre: "Counts toward both thresholds",
    nro: "Counts toward both thresholds",
  },
];

export const NRE_NRO_TRAP =
  "The trap that costs the most: NRE interest is tax-free in India, so nothing is withheld and no Indian tax document is generated — but it is still fully taxable on your US return, and there is no foreign tax credit to offset it because no Indian tax was paid. Many NRIs under-report exactly this income because nothing arrived in the post to remind them.";

/* ───────────────── Foreign tax credit: the timing rule people miss ──────── */

export const foreignTaxCreditTiming = {
  intro:
    "Claiming credit for tax paid to the other country is what stops the same income being taxed twice under the India–US DTAA. Each side has its own form, and each has a filing rule that is easy to miss.",

  forms: [
    {
      form: "Form 67",
      system: "India" as const,
      purpose: "Claims credit in India for tax paid in the US.",
      rule: "Must be furnished on or before the end of the assessment year. Rule 128 was relaxed in 2022 — it no longer has to be filed by the ITR due date — but it does have to be filed, and it has to be filed before the ITR it supports is processed to be of any use. Where the foreign income is included via an updated return under section 139(8A), Form 67 is due by the date the updated return is filed.",
      trap: "Filing the ITR and forgetting Form 67 entirely. The credit is not automatic and will not be inferred from your return.",
    },
    {
      form: "Form 1116",
      system: "US" as const,
      purpose: "Claims credit on the US return for income tax paid to India.",
      rule: "Filed with your Form 1040. Credits are computed per income category, and unused credit can generally be carried back one year and forward ten.",
      trap: "Claiming credit for Indian TDS that was later refunded to you. The credit is for tax finally borne, not tax initially withheld — which is another reason to know your Indian refund position before filing in the US.",
    },
  ],

  practicalNote:
    "Because the two tax years are three months out of step, the Indian tax on income in your US tax year is often not final by 15 April. Filing a US extension to 15 October so the Indian position is settled first is standard practice for cross-border filers, not a sign of a problem.",
} as const;

/* ─────────────────────────── Standing caveat ───────────────────────────── */

export const TAX_CALENDAR_DISCLAIMER =
  "These are the statutory dates. CBDT extends Indian filing deadlines in most years — sometimes more than once — and the IRS grants disaster-area and other extensions, so confirm the operative date for your year with the Income Tax Department and the IRS before you rely on it. Advance-tax and audit obligations depend on your facts. Educational information only, not tax advice.";
