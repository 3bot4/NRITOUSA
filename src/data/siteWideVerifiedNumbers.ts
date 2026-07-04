/**
 * CENTRAL, EDITABLE source of truth for the verified fees, timelines,
 * thresholds, and deadlines shown in the "Fast Answer" snapshots across the
 * site. This is the file you update MONTHLY (see monthlyVerificationChecklist.ts
 * for the checklist + `npm run audit:monthly-numbers`).
 *
 * PHILOSOPHY (site-wide rule): when a real, verified number is available, show
 * it FIRST with a "last verified" date + official source + change disclaimer,
 * THEN the calculator, THEN the explanation. Do NOT hide behind
 * "check official source" when a planning number can be shown.
 *
 * Every number carries `lastVerified` (ISO) + `source`. When you confirm a
 * figure against its official source, bump `lastVerified` to today. The audit
 * scripts flag anything older than 45 days.
 *
 * This is general planning information only — NOT legal or tax advice. Fees,
 * timelines, forms, thresholds, and agency rules change. Always verify with the
 * official government source before filing or making decisions.
 */

export const siteWideUpdatePolicy = {
  updateFrequency: "Monthly",
  rule: "Show current verified fees/timelines when available, plus official source and last verified date.",
  disclaimer:
    "Fees, timelines, forms, and agency rules can change. Always verify with official government sources before filing or making decisions.",
} as const;

/** Standard staleness window used by the monthly audit. */
export const VERIFICATION_STALE_DAYS = 45;

export interface VerifiedNumber {
  /** Human label for the data item (used in audits + snapshots). */
  label: string;
  /** The value to display, e.g. "$415", "8–14 months", "$10,000". */
  value: string;
  /** ISO date this value was last verified against the official source. */
  lastVerified: string;
  /** Official source name (shown on the "verify" button). */
  sourceName: string;
  /** Official source URL (opens in a new tab). */
  sourceUrl: string;
  /** Optional short note / caveat shown under the value. */
  note?: string;
}

export type NumberGroup = Record<string, VerifiedNumber>;

/* ─────────────────────── Official source URLs (shared) ─────────────────── */

export const officialSources = {
  uscisFeeSchedule: "https://www.uscis.gov/g-1055",
  uscisFeeCalculator: "https://www.uscis.gov/feecalculator",
  uscisProcessingTimes: "https://egov.uscis.gov/processing-times/",
  uscisCaseStatus: "https://egov.uscis.gov/",
  uscisFormI90: "https://www.uscis.gov/i-90",
  uscisFormI907: "https://www.uscis.gov/i-907",
  uscisFormI485: "https://www.uscis.gov/i-485",
  uscisFormI765: "https://www.uscis.gov/i-765",
  uscisFormI131: "https://www.uscis.gov/i-131",
  uscisFormI140: "https://www.uscis.gov/i-140",
  uscisFormI129: "https://www.uscis.gov/i-129",
  uscisFormI539: "https://www.uscis.gov/i-539",
  uscisFormN400: "https://www.uscis.gov/n-400",
  dolFlagProcessing: "https://flag.dol.gov/processingtimes",
  visaBulletin:
    "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
  stateVisaFees:
    "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees.html",
  nvcTimeframes:
    "https://travel.state.gov/content/travel/en/us-visas/immigrate/nvc-timeframes.html",
  ceac: "https://ceac.state.gov/",
  passportSeva: "https://www.passportindia.gov.in/",
  vfsIndiaUsa: "https://visa.vfsglobal.com/usa/en/ind/",
  irsFbar: "https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar",
  fincenBsa: "https://bsaefiling.fincen.treas.gov/",
  irsForm8938:
    "https://www.irs.gov/businesses/corporations/basic-questions-and-answers-on-form-8938",
  incomeTaxIndia: "https://www.incometax.gov.in/",
  rbiRemittance: "https://www.rbi.org.in/",
  collegeBoardSat: "https://satsuite.collegeboard.org/sat/registration/fees",
  fafsa: "https://studentaid.gov/",
} as const;

/* ──────────────────────────── Green Card Renewal (I-90) ─────────────────── */

export const greenCardRenewalNumbers: NumberGroup = {
  onlineFee: {
    label: "Form I-90 online filing fee",
    value: "$415",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Fee Schedule (G-1055)",
    sourceUrl: officialSources.uscisFeeSchedule,
    note: "Online filing is $50 cheaper than paper.",
  },
  paperFee: {
    label: "Form I-90 paper filing fee",
    value: "$465",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Fee Schedule (G-1055)",
    sourceUrl: officialSources.uscisFeeSchedule,
    note: "Paper filing costs $50 more than online.",
  },
  biometricsFee: {
    label: "Biometrics fee",
    value: "No separate fee",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Fee Schedule (G-1055)",
    sourceUrl: officialSources.uscisFeeSchedule,
    note: "Biometrics, if required, is included — confirm on the current schedule.",
  },
  processingRange: {
    label: "I-90 renewal processing time (planning range)",
    value: "8–14 months",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Processing Times",
    sourceUrl: officialSources.uscisProcessingTimes,
    note: "Planning range only; RFEs and workload can extend it.",
  },
} as const;

/* ─────────────────────────────── PERM / PWD ─────────────────────────────── */

export const permNumbers: NumberGroup = {
  pwd: {
    label: "Prevailing Wage Determination (PWD)",
    value: "5–7 months",
    lastVerified: "2026-07-04",
    sourceName: "DOL FLAG Processing Times",
    sourceUrl: officialSources.dolFlagProcessing,
  },
  recruitment: {
    label: "Recruitment + quiet period",
    value: "2–3 months",
    lastVerified: "2026-07-04",
    sourceName: "DOL PERM regulations",
    sourceUrl: officialSources.dolFlagProcessing,
  },
  analystReview: {
    label: "PERM analyst review",
    value: "12–16 months",
    lastVerified: "2026-07-04",
    sourceName: "DOL FLAG Processing Times",
    sourceUrl: officialSources.dolFlagProcessing,
    note: "Depends on the DOL queue; audits add 6–12+ months.",
  },
  totalNoAudit: {
    label: "Total to PERM approval (no audit)",
    value: "20–26 months",
    lastVerified: "2026-07-04",
    sourceName: "DOL FLAG Processing Times",
    sourceUrl: officialSources.dolFlagProcessing,
  },
  totalWithAudit: {
    label: "Total to PERM approval (with audit)",
    value: "26–36+ months",
    lastVerified: "2026-07-04",
    sourceName: "DOL FLAG Processing Times",
    sourceUrl: officialSources.dolFlagProcessing,
  },
} as const;

/* ─────────────────────────────── I-485 (AOS) ────────────────────────────── */

export const i485Numbers: NumberGroup = {
  biometrics: {
    label: "Biometrics appointment",
    value: "1–3 months",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Processing Times",
    sourceUrl: officialSources.uscisProcessingTimes,
  },
  employmentBased: {
    label: "Employment-based I-485 (planning range)",
    value: "Months to 2+ years",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Processing Times",
    sourceUrl: officialSources.uscisProcessingTimes,
    note: "Varies by office, category, and visa availability. For Indian EB-2/EB-3 the Visa Bulletin is often the main delay.",
  },
} as const;

/* ─────────────────────────────── NVC fees ───────────────────────────────── */

export const nvcNumbers: NumberGroup = {
  affidavitFee: {
    label: "Affidavit of Support review fee",
    value: "$120",
    lastVerified: "2026-07-04",
    sourceName: "Department of State — Visa Fees",
    sourceUrl: officialSources.stateVisaFees,
  },
  familyIvFee: {
    label: "Family-based IV application fee (per applicant)",
    value: "$325",
    lastVerified: "2026-07-04",
    sourceName: "Department of State — Visa Fees",
    sourceUrl: officialSources.stateVisaFees,
  },
  employmentIvFee: {
    label: "Employment-based IV application fee (per applicant)",
    value: "$345",
    lastVerified: "2026-07-04",
    sourceName: "Department of State — Visa Fees",
    sourceUrl: officialSources.stateVisaFees,
  },
  otherIvFee: {
    label: "Other immigrant visa application fee",
    value: "$205",
    lastVerified: "2026-07-04",
    sourceName: "Department of State — Visa Fees",
    sourceUrl: officialSources.stateVisaFees,
    note: "Where applicable (e.g. DV, certain special categories).",
  },
  feePaymentProcessing: {
    label: "Fee payment processing wait",
    value: "Allow 10 calendar days",
    lastVerified: "2026-07-04",
    sourceName: "NVC Timeframes",
    sourceUrl: officialSources.nvcTimeframes,
    note: "Allow ~10 days after online payment before continuing.",
  },
} as const;

/* ───────────────────────── USCIS forms — premium processing ─────────────── */

export const uscisFormNumbers: NumberGroup = {
  premiumProcessingTime: {
    label: "Premium processing (I-907) turnaround",
    value: "15 business days",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Form I-907",
    sourceUrl: officialSources.uscisFormI907,
    note: "For many I-129/I-140 categories; some categories have longer statutory windows.",
  },
  n400EarlyFiling: {
    label: "N-400 early filing window",
    value: "90 days early",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Form N-400",
    sourceUrl: officialSources.uscisFormN400,
    note: "You may file up to 90 days before meeting the continuous-residence requirement.",
  },
} as const;

/* ─────────────────────────────── H-1B ───────────────────────────────────── */

export const h1bNumbers: NumberGroup = {
  premiumTime: {
    label: "H-1B premium processing turnaround",
    value: "15 business days",
    lastVerified: "2026-07-04",
    sourceName: "USCIS Form I-907",
    sourceUrl: officialSources.uscisFormI907,
    note: "For eligible I-129 H-1B filings.",
  },
} as const;

/* ─────────────────────── Indian passport renewal (USA) ──────────────────── */

export const passportNumbers: NumberGroup = {
  normalTimeline: {
    label: "Normal passport renewal",
    value: "6–12 weeks",
    lastVerified: "2026-07-04",
    sourceName: "VFS Global / Passport Seva",
    sourceUrl: officialSources.vfsIndiaUsa,
  },
  tatkalTimeline: {
    label: "Tatkal renewal",
    value: "3–5 weeks",
    lastVerified: "2026-07-04",
    sourceName: "VFS Global / Passport Seva",
    sourceUrl: officialSources.vfsIndiaUsa,
  },
  lostTimeline: {
    label: "Lost passport",
    value: "8–16 weeks",
    lastVerified: "2026-07-04",
    sourceName: "VFS Global / Passport Seva",
    sourceUrl: officialSources.vfsIndiaUsa,
  },
} as const;

/* ─────────────────────────── Tax / compliance ───────────────────────────── */

export const taxNumbers: NumberGroup = {
  fbarThreshold: {
    label: "FBAR filing threshold (aggregate foreign accounts)",
    value: "$10,000",
    lastVerified: "2026-07-04",
    sourceName: "IRS / FinCEN — FBAR",
    sourceUrl: officialSources.irsFbar,
    note: "Aggregate high balance across all foreign accounts at any time in the year.",
  },
  fbarDeadline: {
    label: "FBAR deadline",
    value: "Apr 15 (auto ext. to Oct 15)",
    lastVerified: "2026-07-04",
    sourceName: "FinCEN BSA E-Filing",
    sourceUrl: officialSources.fincenBsa,
  },
  fatca8938: {
    label: "FATCA Form 8938 threshold (varies)",
    value: "Varies by filing status",
    lastVerified: "2026-07-04",
    sourceName: "IRS — Form 8938",
    sourceUrl: officialSources.irsForm8938,
    note: "US-resident single: $50k end-of-year / $75k any time. Higher for MFJ and taxpayers abroad — verify current thresholds.",
  },
} as const;

/** Reusable Fast Answer rows for FBAR/FATCA compliance pages. */
export const taxComplianceSnapshotRows: { label: string; value: string; note?: string; highlight?: boolean }[] = [
  { label: "FBAR filing threshold", value: taxNumbers.fbarThreshold.value, note: "Aggregate high balance across ALL foreign accounts at any time in the year.", highlight: true },
  { label: "FBAR deadline", value: taxNumbers.fbarDeadline.value, note: "Filed via FinCEN BSA, separately from your tax return." },
  { label: "FATCA Form 8938", value: taxNumbers.fatca8938.value, note: "US single: $50k end-of-year / $75k any time; higher for MFJ & taxpayers abroad." },
  { label: "Filed with", value: "IRS return (8938) / FinCEN (FBAR)", note: "Two separate regimes — meeting one threshold says nothing about the other." },
];

export const taxComplianceSources: { label: string; href: string }[] = [
  { label: "IRS — FBAR", href: officialSources.irsFbar },
  { label: "FinCEN BSA E-Filing", href: officialSources.fincenBsa },
  { label: "IRS — Form 8938", href: officialSources.irsForm8938 },
];

export const TAX_COMPLIANCE_VERIFIED = "2026-07-04";
export const TAX_COMPLIANCE_DISCLAIMER =
  "Thresholds and deadlines reflect current IRS/FinCEN rules but can change, and your situation may differ. This is educational information, not tax or legal advice — confirm with the official IRS/FinCEN pages or a qualified cross-border CPA before filing.";

/* ───────────────────────── Wealth / return to India ─────────────────────── */

export const wealthNumbers: NumberGroup = {
  earlyWithdrawalPenalty: {
    label: "401(k)/IRA early withdrawal penalty",
    value: "10%",
    lastVerified: "2026-07-04",
    sourceName: "IRS",
    sourceUrl: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-tax-on-early-distributions",
    note: "Plus ordinary income tax and possible US withholding; exceptions apply.",
  },
  ssCredits: {
    label: "Social Security credits for retirement eligibility",
    value: "40 credits (~10 years)",
    lastVerified: "2026-07-04",
    sourceName: "Social Security Administration",
    sourceUrl: "https://www.ssa.gov/benefits/retirement/planner/credits.html",
  },
} as const;

/** Reusable Fast Answer rows for wealth / return-to-India decision pages. */
export const wealthReturnSnapshotRows: { label: string; value: string; note?: string; highlight?: boolean }[] = [
  { label: "401(k)/IRA early withdrawal penalty", value: wealthNumbers.earlyWithdrawalPenalty.value, note: "Before 59½, plus ordinary income tax and possible US withholding. Exceptions apply.", highlight: true },
  { label: "US withholding on cash-out", value: "Often ~20–30%", note: "Plan-withheld amount is not the final tax — reconcile on your US return." },
  { label: "Social Security eligibility", value: wealthNumbers.ssCredits.value, note: "40 credits (~10 years of work) to qualify for retirement benefits." },
  { label: "RNOR window (India)", value: "Up to ~2–3 years", note: "Returning residents may get RNOR status; foreign income is often not taxed in India during it." },
];

export const wealthReturnSources: { label: string; href: string }[] = [
  { label: "IRS — early distributions", href: wealthNumbers.earlyWithdrawalPenalty.sourceUrl },
  { label: "SSA — retirement credits", href: wealthNumbers.ssCredits.sourceUrl },
  { label: "Income Tax India", href: officialSources.incomeTaxIndia },
];

export const WEALTH_RETURN_VERIFIED = "2026-07-04";
export const WEALTH_RETURN_DISCLAIMER =
  "General planning figures only — penalties, rates, credit rules, and RNOR conditions depend on your specific situation and change over time. Not tax, legal, or financial advice; confirm with the official IRS/SSA/Income Tax India sources or a qualified cross-border advisor.";

/* ─────────────────────────────── Education ──────────────────────────────── */

export const educationNumbers: NumberGroup = {
  satFee: {
    label: "SAT registration fee",
    value: "$68",
    lastVerified: "2026-07-04",
    sourceName: "College Board",
    sourceUrl: officialSources.collegeBoardSat,
    note: "Fee waivers available for eligible students; verify current amount.",
  },
  fafsaOpens: {
    label: "FAFSA opening date",
    value: "Oct 1 (aid year)",
    lastVerified: "2026-07-04",
    sourceName: "Federal Student Aid",
    sourceUrl: officialSources.fafsa,
  },
} as const;

/** Reusable Fast Answer rows for education fees & key dates. */
export const educationSnapshotRows: { label: string; value: string; note?: string; highlight?: boolean }[] = [
  { label: "SAT registration fee", value: educationNumbers.satFee.value, note: "Fee waivers for eligible low-income US students (via school counselor).", highlight: true },
  { label: "FAFSA opens", value: educationNumbers.fafsaOpens.value, note: "Federal financial aid application at studentaid.gov." },
  { label: "College application fee", value: "~$50–90 each", note: "Varies by school; many waive fees for eligible applicants." },
  { label: "ACT registration fee", value: "$68", note: "Alternative to the SAT; optional writing/science add-ons cost extra. Waivers available." },
];

export const educationSnapshotSources: { label: string; href: string }[] = [
  { label: "College Board (SAT)", href: officialSources.collegeBoardSat },
  { label: "Federal Student Aid (FAFSA)", href: officialSources.fafsa },
];

export const EDUCATION_VERIFIED = "2026-07-04";
export const EDUCATION_DISCLAIMER =
  "Fees and dates are current best-known figures and change each cycle — SAT/ACT and college application fees vary, and waivers exist for eligible students. Confirm on College Board / ACT / studentaid.gov and each college's site before relying on a number.";

/** Everything, keyed by cluster — consumed by the monthly audit. */
export const allVerifiedNumbers = {
  greenCardRenewal: greenCardRenewalNumbers,
  perm: permNumbers,
  i485: i485Numbers,
  nvc: nvcNumbers,
  uscisForms: uscisFormNumbers,
  h1b: h1bNumbers,
  passport: passportNumbers,
  tax: taxNumbers,
  wealth: wealthNumbers,
  education: educationNumbers,
} as const;
