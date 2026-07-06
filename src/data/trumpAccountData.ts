/**
 * Single source of truth for the Trump Account (immigrant-family) cluster:
 * verified facts, official source links, disclaimers, per-page FAQ sets, and
 * the table datasets used across all 8 pages.
 *
 * NEVER hardcode a Trump Account number in a page body — pull it from
 * `trumpAccountConfig`. All figures are subject to current IRS / Treasury
 * guidance and future adjustments; the disclaimers say so and every page links
 * to the official sources below. Use cautious language ("generally", "likely",
 * "based on current guidance", "verify before applying") for anything that
 * isn't a settled, sourced fact. Do NOT state employer-match dollar figures —
 * there is no official source for a specific match amount on these pages.
 */
import type { FaqItem } from "@/lib/seo";

/* ------------------------------------------------------------------ *
 * Verified facts (the factual base). Keep these in one place.
 * ------------------------------------------------------------------ */
export const trumpAccountConfig = {
  /** One-time federal "pilot" contribution for eligible children. */
  federalContribution: "$1,000",
  /** Non-exempt contribution annual limit (subject to current law + adjustments). */
  annualLimit: "$5,000",
  /** Contributions cannot be made before this date. */
  contributionsBegan: "July 4, 2026",
  /** Birth window for the $1,000 pilot contribution. */
  bornWindowStart: "January 1, 2025",
  bornWindowEnd: "December 31, 2028",
  bornWindowLabel: "January 1, 2025 – December 31, 2028",
  /** Precise legal phrasing of the pilot birth window. */
  bornWindowLegal: "born after December 31, 2024 and before January 1, 2029",
  /** Age rule for opening the account. */
  ageRule: "under 18",
  ageRuleLong:
    "not reached age 18 by the end of the calendar year in which the election is made",
  /** What the account is, structurally. */
  accountType: "a type of traditional IRA established for the exclusive benefit of the child",
  /** Who owns it. */
  owner: "the child (the account beneficiary)",
  /** The IRS form used to open the account + elect the pilot contribution. */
  form: "IRS Form 4547",
  formPurpose:
    "the election to establish an initial Trump Account for the exclusive benefit of an eligible child (and, if the child qualifies, to elect the $1,000 pilot program contribution)",
  /** Investment restriction during the growth period. */
  investmentRule:
    "during the growth period, eligible investments are restricted to qualifying index mutual funds / ETFs",
  /** Default investment at launch + additional low-cost ETF options. */
  defaultInvestment: "SPYM",
  defaultInvestmentLabel: "SPYM (a low-cost S&P 500 / large-cap ETF)",
  additionalEtfs: ["IVV", "VTI", "SPTM", "ITOT"],
  additionalEtfsLabel: "IVV, VTI, SPTM, and ITOT",
} as const;

export const trumpAccountSourceNote =
  "Trump Account rules, amounts, forms, and investment options are set by the IRS and U.S. Treasury and can change. Always confirm current guidance on the official IRS / Treasury / TrumpAccounts.gov pages before you open an account, contribute, or file.";

/* ------------------------------------------------------------------ *
 * Official sources ONLY (IRS, Treasury, TrumpAccounts.gov).
 * Stable official landing pages — deep-link to the exact document from these.
 * ------------------------------------------------------------------ */
export const trumpAccountSources = {
  trumpAccountsGov: "https://trumpaccounts.gov",
  irs: "https://www.irs.gov",
  irsForms: "https://www.irs.gov/forms-instructions",
  irsNewsroom: "https://www.irs.gov/newsroom",
  irsBulletin: "https://www.irs.gov/irb",
  treasury: "https://home.treasury.gov",
  treasuryPress: "https://home.treasury.gov/news/press-releases",
} as const;

export const trumpAccountSourceLinks: { label: string; href: string }[] = [
  { label: "TrumpAccounts.gov (official program site)", href: trumpAccountSources.trumpAccountsGov },
  { label: "IRS Form 4547 & instructions (forms index)", href: trumpAccountSources.irsForms },
  { label: "IRS Trump Accounts news & guidance (newsroom)", href: trumpAccountSources.irsNewsroom },
  { label: "IRS Internal Revenue Bulletin (Notice 2025-68)", href: trumpAccountSources.irsBulletin },
  { label: "U.S. Treasury press releases (investment lineup)", href: trumpAccountSources.treasuryPress },
];

export const OFFICIAL_SOURCES_REVIEWED = "IRS, U.S. Treasury, and TrumpAccounts.gov";

/* ------------------------------------------------------------------ *
 * Disclaimers — keep short on the page; the long disclaimer lives in the
 * sitewide collapsible BottomDisclaimer (ToolFirstLayout).
 * ------------------------------------------------------------------ */
export const TRUMP_ACCOUNT_DISCLAIMER =
  "Educational information only — not tax, legal, immigration, or financial advice. Trump Account rules are new and evolving. Verify current IRS and Treasury guidance, and consider a qualified cross-border tax advisor, before you apply or contribute.";

export const TRUMP_ACCOUNT_SHORT_DISCLAIMER =
  "Educational only — not tax, legal, or immigration advice. Verify current IRS/Treasury guidance before applying.";

export const TRUMP_ACCOUNT_DATA_NOTE =
  "Figures reflect the program as announced at launch (contributions cannot be made before July 4, 2026) and are subject to change by the IRS and Treasury. This page does not display made-up dollar amounts beyond the officially announced figures, and always defers to the official sources.";

export const TRUMP_ACCOUNT_REVIEWED_LINE =
  "Last reviewed against IRS / Treasury / TrumpAccounts.gov guidance: July 6, 2026.";

/* ------------------------------------------------------------------ *
 * E-E-A-T box text (shared across all 8 pages)
 * ------------------------------------------------------------------ */
export const EEAT_TITLE = "Why this guide is different for immigrant families";
export const EEAT_TEXT =
  "Most Trump Account articles are written for standard U.S.-citizen families. This guide focuses on H-1B, L-1, H-4, green card, Indian immigrant, and NRI families — where the parent's visa status, the child's citizenship, SSN vs ITIN, a future move back to India, and cross-border tax reporting can change the planning decision.";
export const EEAT_CREDENTIAL =
  "Focused on immigrant tax, accounting, and cross-border financial planning for Indian families in the U.S.";

/* ------------------------------------------------------------------ *
 * Comparison table: Trump Account vs 529 vs Roth IRA vs custodial brokerage
 * ------------------------------------------------------------------ */
export interface ComparisonColumn {
  key: string;
  label: string;
  highlight?: boolean;
}
export interface ComparisonRow {
  feature: string;
  values: Record<string, string>;
}

export const accountComparisonColumns: ComparisonColumn[] = [
  { key: "trump", label: "Trump Account", highlight: true },
  { key: "c529", label: "529 Plan" },
  { key: "roth", label: "Roth IRA (custodial)" },
  { key: "brokerage", label: "Custodial brokerage (UTMA/UGMA)" },
];

export const accountComparisonRows: ComparisonRow[] = [
  {
    feature: "Primary purpose",
    values: {
      trump: "Long-term, retirement-style wealth for a child (a traditional IRA for the child)",
      c529: "Education savings (tuition and qualified education costs)",
      roth: "Retirement savings — needs the child's earned income",
      brokerage: "Flexible savings/investing for any purpose",
    },
  },
  {
    feature: "Who owns it",
    values: {
      trump: "The child is the owner/beneficiary; a responsible party manages it while the child is a minor",
      c529: "The account owner (often a parent); the child is the beneficiary",
      roth: "The child, via a custodian until adulthood",
      brokerage: "The child; a custodian manages until adulthood",
    },
  },
  {
    feature: "Who it is for",
    values: {
      trump: "A child under 18 (by year-end of the election) with a valid SSN",
      c529: "Any beneficiary of any age",
      roth: "A child with earned income (a job)",
      brokerage: "A minor",
    },
  },
  {
    feature: "Federal $1,000 contribution",
    values: {
      trump: "Yes — for eligible U.S.-citizen children born 2025–2028 with a valid SSN",
      c529: "No",
      roth: "No",
      brokerage: "No",
    },
  },
  {
    feature: "Annual contribution limit",
    values: {
      trump: "Non-exempt contributions generally up to $5,000 per child (subject to current law)",
      c529: "Very high (gift-tax limits apply); state-specific caps",
      roth: "Limited to the child's earned income, up to the IRA cap",
      brokerage: "No limit (gift-tax rules apply)",
    },
  },
  {
    feature: "Requires child's earned income?",
    values: {
      trump: "No",
      c529: "No",
      roth: "Yes — the key blocker for most young kids",
      brokerage: "No",
    },
  },
  {
    feature: "Investment options",
    values: {
      trump: "Restricted to qualifying index funds/ETFs in the growth period (SPYM default; IVV, VTI, SPTM, ITOT)",
      c529: "Plan's investment menu (age-based/index options)",
      roth: "Broad — most stocks, funds, ETFs",
      brokerage: "Broad — most stocks, funds, ETFs",
    },
  },
  {
    feature: "Tax treatment of growth",
    values: {
      trump: "Tax-deferred growth (traditional-IRA style; confirm current rules)",
      c529: "Tax-free growth for qualified education use",
      roth: "Tax-free growth and qualified withdrawals",
      brokerage: "Taxable each year (kiddie-tax rules can apply)",
    },
  },
  {
    feature: "Works if child studies in India?",
    values: {
      trump: "Yes — not tied to a U.S. school",
      c529: "Only certain foreign schools qualify; many Indian schools do not",
      roth: "Yes — not education-specific",
      brokerage: "Yes — no restriction",
    },
  },
  {
    feature: "If the family moves back to India",
    values: {
      trump: "Account can generally remain; U.S. tax filing + foreign-address access issues",
      c529: "Can remain; unused non-education funds face tax + penalty",
      roth: "Can remain; contributions may stop without U.S. earned income",
      brokerage: "Can remain; ongoing U.S. + Indian tax reporting",
    },
  },
];

/* ------------------------------------------------------------------ *
 * Generic table datasets (rendered via <DataTable> — one semantic table)
 * ------------------------------------------------------------------ */
export interface DataCol {
  key: string;
  label: string;
  highlight?: boolean;
}
export type DataRow = Record<string, string>;

/* --- Pillar: eligibility by family situation --- */
export const familyEligibilityCols: DataCol[] = [
  { key: "family", label: "Family situation" },
  { key: "account", label: "Trump Account possible?", highlight: true },
  { key: "pilot", label: "$1,000 pilot possible?", highlight: true },
  { key: "reason", label: "Reason" },
];
export const familyEligibilityRows: DataRow[] = [
  {
    family: "H-1B parent + U.S.-born child, born 2025–2028",
    account: "Likely yes",
    pilot: "Likely yes",
    reason: "Child is usually a U.S. citizen with a valid SSN",
  },
  {
    family: "H-1B parent + U.S.-born child, born before 2025",
    account: "Likely yes",
    pilot: "No",
    reason: "Outside the pilot birth window (2025–2028)",
  },
  {
    family: "H-1B parent + foreign-born H-4 child with only an ITIN",
    account: "Likely no",
    pilot: "No",
    reason: "An ITIN alone does not satisfy the valid-SSN rule",
  },
  {
    family: "Green card parent + U.S.-born child",
    account: "Likely yes, if the child meets the rules",
    pilot: "Only if born 2025–2028",
    reason: "Parent status is not the main test — the child's status is",
  },
  {
    family: "U.S.-citizen parent + foreign-born child",
    account: "Depends",
    pilot: "Depends",
    reason: "Child must have U.S. citizenship and a valid SSN",
  },
];

/* --- Pillar / Form 4547: how to apply (step / action / why) --- */
export const howToApplyCols: DataCol[] = [
  { key: "step", label: "Step" },
  { key: "action", label: "What to do" },
  { key: "why", label: "Why it matters" },
];
export const howToApplyRows: DataRow[] = [
  { step: "1. Confirm child eligibility", action: "Check the child is under 18 (by year-end) with a valid SSN; for the $1,000, confirm U.S. citizenship and a 2025–2028 birth", why: "Eligibility is decided by the child, not the parent's visa" },
  { step: "2. Sign in to the official portal", action: "Create/sign in to your IRS account or start from TrumpAccounts.gov", why: "Avoids scam/unofficial sites that mimic the program" },
  { step: "3. Complete Form 4547", action: "Enter responsible-party and child (account-beneficiary) information", why: "This is the election to establish the account" },
  { step: "4. Request the $1,000 only if eligible", action: "Elect the pilot contribution only when the child qualifies", why: "Requesting when ineligible can cause rejection/rework" },
  { step: "5. Activate / manage the account", action: "Follow provider instructions; choose an eligible index fund/ETF", why: "Growth-period investments are restricted to qualifying funds" },
  { step: "6. Keep immigration & tax records", action: "Save the SSN card, birth certificate/passport, and Form 4547 confirmation", why: "Needed for future taxes and any move back to India" },
];

/* --- Can-open: 8 scenarios --- */
export const scenarioTableCols: DataCol[] = [
  { key: "scenario", label: "Scenario" },
  { key: "account", label: "Account eligibility", highlight: true },
  { key: "pilot", label: "$1,000 eligibility", highlight: true },
  { key: "verify", label: "What to verify" },
  { key: "next", label: "Next step" },
];
export const scenarioTableRows: DataRow[] = [
  { scenario: "H-1B parent, U.S.-born child, SSN issued", account: "Likely yes", pilot: "Likely yes (if born 2025–2028)", verify: "SSN issued; U.S. birth certificate", next: "Apply via Form 4547" },
  { scenario: "H-1B parent, U.S.-born child, SSN not issued yet", account: "Wait", pilot: "Wait", verify: "SSN issuance status", next: "Apply once the SSN is issued" },
  { scenario: "H-1B parent, child born in India with ITIN only", account: "Likely no", pilot: "No", verify: "Whether child can get an SSN / is a U.S. citizen", next: "Read SSN vs ITIN guide" },
  { scenario: "H-4 child with ITIN only", account: "Usually blocked", pilot: "No", verify: "SSN eligibility under SSA rules", next: "Do not assume eligibility; verify" },
  { scenario: "H-4 child who later gets an SSN (status change)", account: "May need review", pilot: "Only if U.S. citizen + 2025–2028", verify: "Valid SSN + citizenship", next: "Re-check the account rules" },
  { scenario: "Green card parent, U.S.-born child", account: "Likely yes", pilot: "Likely yes (if born 2025–2028)", verify: "Child SSN + citizenship", next: "Apply via Form 4547" },
  { scenario: "U.S.-citizen parent, foreign-born child with CRBA/passport", account: "Depends", pilot: "Depends", verify: "Citizenship docs + SSN issued", next: "Get the SSN, then apply" },
  { scenario: "F-1/OPT parent, U.S.-born child", account: "Likely yes", pilot: "Likely yes (if born 2025–2028)", verify: "Child SSN + citizenship", next: "Apply via Form 4547" },
];

/* --- $1,000 page: denial reasons + examples --- */
export const pilotDenialReasons: string[] = [
  "Child born before 2025 (outside the pilot birth window)",
  "Child born after 2028 (outside the pilot birth window)",
  "Child has an ITIN, not a valid SSN",
  "Child is not a U.S. citizen",
  "The filer is not the correct authorized individual / qualifying-child taxpayer",
  "Form 4547 information does not match IRS/SSA records (name, DOB, SSN)",
  "A duplicate election was already made for the child",
  "The application was started from an unofficial or fake site",
];

export const pilotExampleCols: DataCol[] = [
  { key: "example", label: "Example" },
  { key: "pilot", label: "$1,000 pilot?", highlight: true },
  { key: "why", label: "Why" },
];
export const pilotExampleRows: DataRow[] = [
  { example: "Baby born in the U.S. in 2026 to H-1B parents", pilot: "Likely yes", why: "U.S. citizen, valid SSN, in the 2025–2028 window" },
  { example: "Baby born in the U.S. in 2024 to H-1B parents", pilot: "No", why: "U.S. citizen, but born before the window" },
  { example: "Child born in India with H-4 status / ITIN", pilot: "No", why: "Not a U.S. citizen; ITIN is not a valid SSN" },
  { example: "Foreign-born U.S.-citizen child with a valid SSN", pilot: "Likely yes (if born 2025–2028)", why: "Citizen + valid SSN can qualify once SSN is issued" },
  { example: "Green card family with a U.S.-born child (2027)", pilot: "Likely yes", why: "Child's U.S. citizenship + SSN drive eligibility, not the parents' status" },
];

/* --- Tax page: treatment table --- */
export const taxTableCols: DataCol[] = [
  { key: "item", label: "Item" },
  { key: "us", label: "General U.S. treatment" },
  { key: "immigrant", label: "Immigrant / NRI issue" },
];
export const taxTableRows: DataRow[] = [
  { item: "$1,000 pilot contribution", us: "Federal seed contribution for eligible children; not a parent deduction", immigrant: "Only for U.S.-citizen children with a valid SSN, born 2025–2028" },
  { item: "Parent contribution", us: "After-tax; no individual income-tax deduction in the growth period", immigrant: "Watch gift-tax reporting on large/unusual amounts" },
  { item: "Grandparent contribution", us: "Treated as a gift to the child; counts toward annual limits/rules", immigrant: "Cross-border gifts (e.g. from India) may have separate U.S. reporting" },
  { item: "Employer / section 128 contribution", us: "Follows its own rules where offered", immigrant: "Do not assume any specific match amount — verify with the employer and current guidance" },
  { item: "Qualified general contribution", us: "Non-exempt contributions generally capped at $5,000/child (current law)", immigrant: "Limit is subject to change; confirm before relying on it" },
  { item: "Growth inside the account", us: "Tax-deferred (traditional-IRA style) during the growth period", immigrant: "India may not mirror U.S. deferral once you are Indian tax residents" },
  { item: "Distributions after the growth period", us: "Taxed under the account's distribution rules (confirm current rules)", immigrant: "A U.S.-citizen child abroad still files under U.S. rules" },
  { item: "Moving back to India", us: "Account can generally remain a U.S. account", immigrant: "Provider access + Indian tax residency become the real issues" },
  { item: "U.S.-citizen child living abroad", us: "Lifelong U.S. tax filing obligations regardless of residence", immigrant: "Plan for dual U.S. + India reporting as the child grows" },
];

/* --- Moving back: keep contributing? --- */
export const keepContributingCols: DataCol[] = [
  { key: "situation", label: "Your situation" },
  { key: "guidance", label: "General guidance", highlight: true },
];
export const keepContributingRows: DataRow[] = [
  { situation: "You plan to return to the U.S.", guidance: "Keeping the account and access usually makes sense" },
  { situation: "Your child may study in the U.S.", guidance: "Continuity can help; maintain records and access" },
  { situation: "Your child will likely live in India long-term", guidance: "Weigh U.S. + India tax complexity before adding more" },
  { situation: "You cannot maintain U.S. bank/app access", guidance: "Fix access first; contributions may be impractical without it" },
  { situation: "Cross-border tax complexity is high", guidance: "Get a cross-border advisor before contributing more" },
];

/* --- vs 529: decision table --- */
export const decision529Cols: DataCol[] = [
  { key: "situation", label: "Family situation" },
  { key: "choice", label: "Better first choice", highlight: true },
  { key: "why", label: "Why" },
];
export const decision529Rows: DataRow[] = [
  { situation: "U.S.-born newborn eligible for the $1,000", choice: "Trump Account (then 529)", why: "Claim the one-time federal contribution first" },
  { situation: "Certain the child will study in the U.S.", choice: "529", why: "Tax-free growth for qualified U.S. tuition" },
  { situation: "May move back to India", choice: "Trump Account", why: "Not locked to U.S. education; more exit flexibility" },
  { situation: "Child may study in India", choice: "Trump Account", why: "Many Indian schools don't qualify for 529 tax treatment" },
  { situation: "Want maximum education tax benefit", choice: "529", why: "Education-specific tax-free growth (+ possible state benefit)" },
  { situation: "Want flexibility for any goal", choice: "Trump Account", why: "Broad long-term, retirement-style use" },
  { situation: "Worried about unused education funds", choice: "Trump Account", why: "Avoids the 529 penalty on non-education earnings" },
  { situation: "Want simple long-term investing", choice: "Trump Account", why: "Restricted low-cost index funds keep it simple" },
];

/* --- SSN vs ITIN table --- */
export const ssnItinCols: DataCol[] = [
  { key: "situation", label: "Child situation" },
  { key: "ssn", label: "Has SSN?" },
  { key: "account", label: "Trump Account?", highlight: true },
  { key: "pilot", label: "$1,000?", highlight: true },
  { key: "next", label: "Next step" },
];
export const ssnItinRows: DataRow[] = [
  { situation: "U.S.-born child, SSN issued", ssn: "Yes", account: "Likely yes", pilot: "Likely yes (2025–2028)", next: "Apply via Form 4547" },
  { situation: "U.S.-born child, SSN pending", ssn: "Not yet", account: "Wait", pilot: "Wait", next: "Apply once SSN is issued" },
  { situation: "H-4 child with ITIN only", ssn: "No (ITIN)", account: "Usually no", pilot: "No", next: "Verify SSN eligibility; don't use ITIN" },
  { situation: "Foreign-born U.S. citizen, CRBA/passport, no SSN yet", ssn: "Not yet", account: "After SSN", pilot: "After SSN (2025–2028)", next: "Get the SSN, then apply" },
  { situation: "Foreign-born noncitizen child with ITIN", ssn: "No (ITIN)", account: "No", pilot: "No", next: "Not eligible without a valid SSN" },
  { situation: "Child later becomes eligible for an SSN", ssn: "Later", account: "Re-check", pilot: "Re-check citizenship + window", next: "Review the rules once SSN is issued" },
];

/* ------------------------------------------------------------------ *
 * "Which page should you read?" pointers (shared)
 * ------------------------------------------------------------------ */
export interface PointerLink {
  text: string;
  href: string;
}
export const whichPagePointers: PointerLink[] = [
  { text: "Want the full overview? Read the main H-1B guide.", href: "/trump-account-h1b-immigrant-families" },
  { text: "Only checking the $1,000? Read the $1,000 eligibility guide.", href: "/trump-account-1000-eligibility" },
  { text: "Applying now? Read the Form 4547 guide.", href: "/how-to-apply-for-trump-account-form-4547" },
  { text: "Leaving the U.S.? Read the moving-back-to-India guide.", href: "/trump-account-moving-back-to-india" },
];

/* ------------------------------------------------------------------ *
 * Checklists (shared)
 * ------------------------------------------------------------------ */
export const beforeMovingChecklist: string[] = [
  "Save the child's Social Security card",
  "Save the U.S. birth certificate / passport / CRBA (if applicable)",
  "Save the Form 4547 confirmation",
  "Download account statements every year",
  "Confirm the provider's foreign-address policy",
  "Confirm 2-factor authentication works from abroad",
  "Keep U.S. bank access if legally/operationally possible",
  "Ask a CPA about the U.S.-citizen child's future tax duties",
  "Ask a cross-border advisor about Indian reporting/tax treatment",
];

export const form4547Checklist: string[] = [
  "Responsible party's full legal name",
  "Responsible party's taxpayer information",
  "Relationship to the child",
  "Child's full legal name",
  "Child's date of birth",
  "Child's valid SSN (never an ITIN in the SSN field)",
  "Child's address",
  "Citizenship / pilot-contribution details (if requesting the $1,000)",
  "Signature / authorization",
  "Confirmation records saved for your files",
];

/* ------------------------------------------------------------------ *
 * FAQ sets (one per page) — kept UNIQUE across pages, and must match the
 * visible FAQ text exactly (FAQPage schema compliance).
 * ------------------------------------------------------------------ */
export const pillarFaqs: FaqItem[] = [
  {
    question: "Can H-1B parents open a Trump Account for their U.S.-born child?",
    answer:
      "Generally yes, if the child qualifies. The parent's visa status is not the main test. A U.S.-born child is usually a U.S. citizen who can get a valid SSN, so the child can often be eligible. The account is a type of traditional IRA established for the exclusive benefit of the child.",
  },
  {
    question: "Can H-1B parents open a Trump Account for themselves?",
    answer:
      "No. Trump Accounts are for children, not adults. An H-1B worker can only act as the parent, guardian, or authorized responsible party for an eligible child — not open one for their own benefit.",
  },
  {
    question: "Who is the owner of the Trump Account?",
    answer:
      "The child is the owner and account beneficiary. A responsible party manages the account while the child is a minor, but the account is established for the exclusive benefit of the child.",
  },
  {
    question: "What does the $1,000 pilot contribution require?",
    answer:
      "It is narrower than the account itself. Based on current guidance, the child must be a U.S. citizen, have a valid SSN, meet qualifying-child rules, and be born after December 31, 2024 and before January 1, 2029. A child with only an ITIN does not qualify.",
  },
  {
    question: "What happens to the account if we move back to India?",
    answer:
      "The account belongs to the child and generally does not close automatically when you leave the U.S. The practical issues are provider access from a foreign address and cross-border tax. See the moving-back-to-India guide for a full checklist.",
  },
];

export const canOpenFaqs: FaqItem[] = [
  {
    question: "Can H-1B parents open a Trump Account?",
    answer:
      "Generally yes, for an eligible child. The parent can act as the responsible party regardless of H-1B, L-1, H-4, F-1/OPT, or green-card status. The child must be under 18 (by year-end of the election) with a valid SSN.",
  },
  {
    question: "Can H-1B parents open one for themselves?",
    answer: "No. Trump Accounts are for children. An adult cannot open one for their own benefit.",
  },
  {
    question: "Can an H-4 child qualify?",
    answer:
      "An H-4 child is usually blocked if the child only has an ITIN. If the child later has a valid SSN and meets the Trump Account rules, eligibility may need to be reviewed. The $1,000 pilot contribution still requires U.S. citizenship and the 2025–2028 birth window.",
  },
  {
    question: "Does the parent need to be a U.S. citizen?",
    answer:
      "No. Parent citizenship is not the main eligibility test. A non-citizen parent can open the account for a qualifying child. The child's age, valid SSN, and (for the $1,000) citizenship and birth window are what matter.",
  },
  {
    question: "What if my child was born in India?",
    answer:
      "A child born in India is usually not a U.S. citizen, so the $1,000 pilot contribution typically does not apply. Whether the account can be opened depends on the child having a valid SSN, which many foreign-born children do not have.",
  },
  {
    question: "What if my child has an ITIN only?",
    answer:
      "An ITIN does not satisfy the valid-SSN requirement. A child with only an ITIN generally cannot open the account until they obtain a valid SSN.",
  },
  {
    question: "What if my child gets an SSN later?",
    answer:
      "If the child later obtains a valid SSN and still meets the age rule, account eligibility can be reviewed at that time. The $1,000 pilot contribution also requires U.S. citizenship and a 2025–2028 birth.",
  },
];

export const eligibilityFaqs: FaqItem[] = [
  {
    question: "Does every child get the $1,000?",
    answer:
      "No. The $1,000 federal pilot contribution is narrower than the account itself. A child must be a U.S. citizen with a valid SSN, meet qualifying-child rules, and be born after December 31, 2024 and before January 1, 2029.",
  },
  {
    question: "Do H-1B parents qualify for the $1,000?",
    answer:
      "The parents don't receive it — the child does. H-1B parents with a U.S.-born child in the 2025–2028 window may often qualify because the child is usually a U.S. citizen with a valid SSN.",
  },
  {
    question: "Does the child need to be a U.S. citizen?",
    answer: "Yes. Based on current guidance, the $1,000 pilot contribution requires the child to be a U.S. citizen.",
  },
  {
    question: "Does a U.S.-born child of H-1B parents qualify?",
    answer:
      "Often yes, if born in the 2025–2028 window with a valid SSN. A U.S.-born child is usually a U.S. citizen, which is the key requirement the pilot adds on top of the account rules.",
  },
  {
    question: "Does an ITIN child qualify?",
    answer: "No. A child with only an ITIN does not meet the valid-SSN requirement for the account or the $1,000.",
  },
  {
    question: "What if my child was born in 2024?",
    answer:
      "The child is outside the pilot birth window and does not receive the $1,000, even if they are a U.S. citizen with a valid SSN. The account itself may still be available.",
  },
  {
    question: "What if my child was born in India?",
    answer:
      "A child born in India is usually not a U.S. citizen, so the $1,000 typically does not apply, and the valid-SSN requirement often isn't met either.",
  },
];

export const form4547Faqs: FaqItem[] = [
  {
    question: "What is IRS Form 4547 used for?",
    answer:
      "Form 4547 is used to make the election to establish an initial Trump Account for the exclusive benefit of an eligible child, and to elect the $1,000 pilot program contribution if the child qualifies.",
  },
  {
    question: "Who fills out Form 4547?",
    answer:
      "The responsible party — the parent, guardian, or authorized individual — completes it on the child's behalf. The child does not fill it out.",
  },
  {
    question: "Should an H-1B parent file now or wait?",
    answer:
      "Apply now if a U.S.-born child has a valid SSN and qualifies. Wait if the SSN has not been issued yet. Do not request the $1,000 if the child is outside the 2025–2028 window, and review carefully if the child has only an ITIN.",
  },
  {
    question: "How do I avoid Trump Account scams?",
    answer:
      "Start only from official sources — IRS.gov or TrumpAccounts.gov. Because the program is new, unofficial or fake application pages may appear. Never enter an SSN on an unverified site.",
  },
  {
    question: "What is the most common Form 4547 mistake for immigrant families?",
    answer:
      "Using an ITIN in the SSN field, or requesting the $1,000 for a child born outside the 2025–2028 window. Also make sure the child's name, date of birth, and SSN match IRS/SSA records exactly.",
  },
];

export const taxFaqs: FaqItem[] = [
  {
    question: "Does the parent get a tax deduction for contributions?",
    answer:
      "Generally no. There is typically no individual income-tax deduction for contributions during the growth period. The benefit is tax-deferred compounding inside the account.",
  },
  {
    question: "Does the child pay tax when money is contributed?",
    answer:
      "Contributions during the growth period are generally not included in the child's income when made, subject to current rules and the source and type of contribution. Confirm current IRS guidance.",
  },
  {
    question: "Are contributions automatically exempt from gift-tax reporting?",
    answer:
      "Not automatically. Current guidance provides a safe harbor for certain qualifying contributions, but large or unusual contributions should be reviewed with a tax advisor. Do not assume every contribution from every source is exempt from gift-tax reporting.",
  },
  {
    question: "Will India tax a Trump Account after we move back?",
    answer:
      "India may tax income or gains depending on the child's tax residency, the account structure, income recognition, and Indian law at that time. Do not assume U.S. tax deferral automatically applies in India — get cross-border advice.",
  },
  {
    question: "Does the Trump Account trigger FBAR or FATCA?",
    answer:
      "The Trump Account is a U.S. account, so FBAR is not about the Trump Account itself. But a U.S.-citizen child living in India may later have Indian bank or investment accounts, which can trigger U.S. reporting such as FBAR/FATCA.",
  },
];

export const moveBackFaqs: FaqItem[] = [
  {
    question: "Does the account close if we leave the U.S.?",
    answer:
      "Generally no. Leaving the U.S. does not automatically close or erase the account. Provider policy on foreign addresses and access is usually the real constraint, not ownership.",
  },
  {
    question: "Who owns the account after the family moves back?",
    answer:
      "The child owns the account as the beneficiary. The parent or responsible party manages it while the child is a minor, wherever the family lives.",
  },
  {
    question: "Can we still log in from India?",
    answer:
      "It depends on the provider. Foreign addresses, Indian phone numbers, 2-factor methods, U.S. mailing addresses, and U.S. bank links can all affect access. Set these up before you leave to avoid a frozen account.",
  },
  {
    question: "What if my child is a U.S. citizen living in India?",
    answer:
      "U.S. citizenship continues unless it is formally changed later, so the child may have future U.S. filing responsibilities. Keep the SSN, passport, and account records safe.",
  },
  {
    question: "Should we keep contributing after moving back?",
    answer:
      "It depends on your plans, U.S. access, and tax complexity. If the child may live in India long-term or you can't keep U.S. access, weigh the cross-border tax burden before adding more. Get advice first.",
  },
];

export const vs529Faqs: FaqItem[] = [
  {
    question: "Is a Trump Account a replacement for a 529 plan?",
    answer:
      "No. They are different tools. A 529 is education-specific with tax-free growth for qualified education; a Trump Account is a retirement-style, tax-deferred account for the child. Many families use both.",
  },
  {
    question: "Which is better if my child might study in India?",
    answer:
      "A Trump Account is usually more flexible, because many Indian institutions do not qualify for 529 tax treatment. A 529 used for non-qualifying education can trigger tax and a penalty on earnings.",
  },
  {
    question: "Which is better if we might move back to India?",
    answer:
      "A Trump Account is generally more flexible on exit since it isn't tied to U.S. education. A 529 still works, but unused non-education funds face tax and a penalty.",
  },
  {
    question: "Can we use both a Trump Account and a 529?",
    answer:
      "Yes. A common order is: open the Trump Account first if the child qualifies for the $1,000, use a 529 for education savings if you're confident about qualifying use, and consider taxable/custodial accounts only after understanding the taxes.",
  },
];

export const ssnItinFaqs: FaqItem[] = [
  {
    question: "Can I use an ITIN for a Trump Account?",
    answer:
      "No. An ITIN does not satisfy the valid-SSN requirement. Do not enter an ITIN in the SSN field on Form 4547.",
  },
  {
    question: "Does my U.S.-born child need an SSN?",
    answer:
      "Yes. A valid SSN is required. A U.S.-born child is usually eligible for an SSN — make sure it has actually been issued before you apply.",
  },
  {
    question: "Can I apply before the SSN card arrives?",
    answer:
      "It's best to wait until the SSN is issued and you have the number, because the account requires a valid SSN that matches IRS/SSA records.",
  },
  {
    question: "Can an H-4 child qualify?",
    answer:
      "H-4 children typically do not receive SSNs unless they have separate eligibility under Social Security rules, and an ITIN does not count. Do not assume an ITIN can be converted into an SSN — verify with SSA/official rules.",
  },
  {
    question: "Can a foreign-born child qualify?",
    answer:
      "Only if the child can obtain a valid SSN, such as through U.S. citizenship (for example, a foreign-born U.S. citizen with a CRBA or passport). Without a valid SSN, the account generally isn't available.",
  },
  {
    question: "Is an ITIN the same as an SSN?",
    answer:
      "No. An ITIN is a tax-processing number for people who can't get an SSN. It is not a Social Security number and does not meet the Trump Account requirement.",
  },
  {
    question: "What if my child gets an SSN later?",
    answer:
      "If the child later obtains a valid SSN and still meets the age rule, review account eligibility then. The $1,000 pilot also requires U.S. citizenship and a 2025–2028 birth.",
  },
];
