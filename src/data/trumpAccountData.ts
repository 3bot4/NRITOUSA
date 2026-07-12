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

/* --- Generational wealth: account-type comparison (wealth-building lens) --- */
export const wealthAccountCols: DataCol[] = [
  { key: "type", label: "Account type" },
  { key: "best", label: "Best for", highlight: true },
  { key: "advantage", label: "Main advantage" },
  { key: "limitation", label: "Main limitation" },
  { key: "immigrant", label: "Immigrant family note" },
];
export const wealthAccountRows: DataRow[] = [
  {
    type: "Trump Account",
    best: "Long-term, retirement-style wealth for a child",
    advantage: "Starts compounding early; a one-time $1,000 seed for eligible kids; simple low-cost index funds",
    limitation: "Tax-deferred (not tax-free); growth-period investments restricted; rules are new and evolving",
    immigrant: "Not tied to U.S. education; travels better if you move back — but a U.S.-citizen child keeps lifelong U.S. tax filing",
  },
  {
    type: "529 plan",
    best: "Qualified education / college savings",
    advantage: "Tax-free growth for qualified education; possible state tax benefit",
    limitation: "Non-education earnings face tax + penalty; many foreign schools don't qualify",
    immigrant: "Many Indian institutions don't qualify; weigh this if the child may study in India",
  },
  {
    type: "Custodial brokerage (UTMA/UGMA)",
    best: "Flexible investing for any goal",
    advantage: "No contribution cap and broad investment choice; use for anything",
    limitation: "Taxable each year (kiddie-tax rules can apply); becomes the child's outright at adulthood",
    immigrant: "Ongoing U.S. + India tax reporting; watch PFIC-style issues on U.S. ETFs after you become Indian tax residents",
  },
  {
    type: "Roth IRA for a child",
    best: "Tax-free retirement growth when the child has a job",
    advantage: "Tax-free qualified growth and withdrawals over decades",
    limitation: "Requires the child's earned income — the key blocker for young kids",
    immigrant: "Only realistic once the child has real earned income and a valid SSN",
  },
  {
    type: "High-yield savings / CD",
    best: "Emergency savings and short-term goals",
    advantage: "Principal is stable and liquid; no market risk",
    limitation: "Low long-term growth; interest is taxable and rarely beats inflation over decades",
    immigrant: "Simple to run from abroad, but a poor engine for multi-decade wealth building",
  },
];

/* --- Generational wealth: risks & mistakes to avoid (cards) --- */
export interface RiskCard {
  title: string;
  body: string;
}
export const generationalWealthRisks: RiskCard[] = [
  { title: "Assuming returns are guaranteed", body: "Markets go down as well as up. Projections use a fixed rate; real returns vary year to year and can be negative for long stretches." },
  { title: "Thinking tax-deferred means tax-free", body: "A Trump Account defers tax during growth (traditional-IRA style). Tax can still apply under the account's distribution rules — deferral is not never paying." },
  { title: "Ignoring 529 education needs", body: "A Trump Account is wealth/retirement-style, not education-first. If college is the goal, a 529's tax-free education growth may still fit better." },
  { title: "Using money you need for emergencies", body: "Fund an emergency cushion first. Money locked into a child's long-term account isn't a rainy-day fund." },
  { title: "Forgetting SSN / ITIN eligibility rules", body: "The account needs the child's valid SSN — an ITIN does not qualify. Confirm the SSN is actually issued before you apply." },
  { title: "Assuming the $1,000 applies to every child", body: "The federal seed is narrow: generally U.S.-citizen children with a valid SSN, born after Dec. 31, 2024 and before Jan. 1, 2029." },
  { title: "Ignoring move-back-to-India complications", body: "Plan provider access, U.S. bank links, and 2-factor from abroad — and expect cross-border U.S./India tax reporting as the child grows." },
  { title: "Not saving contribution records", body: "Keep the SSN card, Form 4547 confirmation, and yearly statements. You'll need them for future taxes and any move abroad." },
  { title: "Making unsupported employer-contribution assumptions", body: "Do not assume any specific employer match amount. There is no official figure — verify with the employer and current guidance." },
];

/* --- Generational wealth: FAQ set (unique) --- */
export const generationalWealthFaqs: FaqItem[] = [
  {
    question: "Can a Trump Account make my child a millionaire?",
    answer:
      "It might, but it is never guaranteed. With early, consistent contributions and decades of compounding, an account could potentially grow into six or seven figures by the child's 40s or 50s. The outcome depends entirely on actual returns, fees, taxes, contribution amounts, and how long the money stays invested. Treat any projection as an illustration, not a promise.",
  },
  {
    question: "How much can I contribute to a Trump Account each year?",
    answer:
      "Non-exempt contributions are generally limited to $5,000 per child per year, subject to current law and future adjustments. A separate one-time $1,000 federal pilot contribution may be available for eligible U.S.-citizen children born after December 31, 2024 and before January 1, 2029. Contributions cannot be made before July 4, 2026.",
  },
  {
    question: "Is the $1,000 Trump Account contribution enough to build wealth?",
    answer:
      "On its own, $1,000 is a helpful seed, not a wealth plan. Its value is that it starts compounding early. Real generational wealth typically comes from adding consistent yearly contributions on top of the seed and leaving the money invested for decades.",
  },
  {
    question: "Is a Trump Account better than a 529 plan?",
    answer:
      "Neither is universally better — they solve different problems. A 529 offers tax-free growth for qualified education; a Trump Account is a flexible, retirement-style, tax-deferred account. Many families use both, and a Trump Account should not automatically replace a 529 if college funding is the goal.",
  },
  {
    question: "Can H-1B parents use a Trump Account for a U.S.-born child?",
    answer:
      "Generally yes, if the child qualifies. The parent's visa status is not the main test. A U.S.-born child is usually a U.S. citizen who can get a valid SSN, so the child can often be eligible, with the H-1B parent acting as the responsible party.",
  },
  {
    question: "What happens if we move back to India?",
    answer:
      "The account belongs to the child and generally stays open. The practical issues are provider access from a foreign address and cross-border tax. A U.S.-citizen child keeps lifelong U.S. filing duties, and India may tax the account's income once you are Indian tax residents. Set up access and get cross-border advice before you leave.",
  },
  {
    question: "Are Trump Account returns guaranteed?",
    answer:
      "No. Investments in the account can lose value. Growth-period investments are restricted to qualifying low-cost index funds/ETFs, which spread risk but do not remove it. Any projected value is an estimate based on assumptions, not a guaranteed result.",
  },
  {
    question: "Is tax-deferred the same as tax-free?",
    answer:
      "No. Tax-deferred means earnings are not taxed year by year while they stay in the account, but tax can still apply later under the account's distribution rules. A 529 (for qualified education) and a Roth IRA offer tax-free growth; a Trump Account defers tax rather than eliminating it.",
  },
  {
    question: "Can grandparents contribute to a Trump Account?",
    answer:
      "Others may contribute up to the aggregate annual limit, subject to current rules. A grandparent's contribution is generally treated as a gift to the child. Cross-border gifts from India should be reviewed carefully for U.S. gift-tax reporting and Indian FEMA/LRS remittance rules — get advice before sending funds.",
  },
  {
    question: "Should I max out a Trump Account before saving for college?",
    answer:
      "Not necessarily. Fund emergency savings first, then match the account to your goal. If college is the priority, a 529's tax-free education growth may come first; if long-term flexibility matters more, the Trump Account may. For most families it's a mix, not an either/or.",
  },
];

/* --- Tax planning page: FAQ set (unique) --- */
export const taxPlanningFaqs: FaqItem[] = [
  {
    question: "Are Trump Account withdrawals tax-free?",
    answer:
      "No, not automatically. Because a Trump Account follows traditional-IRA rules, the taxable portion of a withdrawal is generally ordinary income, and a 10% penalty may apply before age 59½. The useful question isn't whether you can withdraw, but what the after-tax cost is.",
  },
  {
    question: "Can Trump Account money be used for college?",
    answer:
      "It can be used to help with college, but it is not designed as an education account the way a 529 plan is. Any education-related exception, if one applies, may not make the withdrawal completely tax-free. Many families use 529 funds first for qualified education costs and only look at Trump Account withdrawals after checking the tax impact.",
  },
  {
    question: "How does a Trump Account differ from a 529 plan?",
    answer:
      "A 529 gives tax-free growth for qualified education; a Trump Account is a flexible, retirement-style account with tax-deferred growth taxed on withdrawal. For a college bill a 529 is usually more tax-efficient. For non-education or long-term goals, the Trump Account is more flexible. Many families use both.",
  },
  {
    question: "What happens when the child turns 18?",
    answer:
      "Control generally shifts to the now-adult child, and the account is treated as a traditional IRA. Withdrawals become possible but are usually the costliest choice. Nothing forces a withdrawal at 18 — reviewing records and leaving the money invested is often the best move.",
  },
  {
    question: "Can a Trump Account be converted to a Roth IRA?",
    answer:
      "Initial guidance indicates yes, generally starting the year the child turns 18. The converted pre-tax amount is taxed as ordinary income that year, so families often convert during low-income years to keep the tax small. Confirm current rules and check aid and state tax first.",
  },
  {
    question: "Should immigrant families use Trump Accounts for college or retirement?",
    answer:
      "It depends on the family's goals, visa and residency plans, and whether college funding is the priority. A Trump Account leans toward long-term, retirement-style wealth, while a 529 leans toward education. There is no single right answer — many immigrant families use a mix and decide based on tax impact, flexibility, and whether they may move back to India.",
  },
  {
    question: "What happens to Trump Account tax planning if the family moves back to India?",
    answer:
      "The account belongs to the child and generally stays open, but cross-border reporting can matter. A U.S. account can still generate U.S. tax forms, and India may tax foreign income depending on residency status. Before moving, keep U.S. statements and tax documents, review whether to keep, convert, withdraw, or leave the account invested, and get cross-border advice rather than making a blanket decision.",
  },
  {
    question: "What records should parents keep for Trump Account tax planning?",
    answer:
      "Keep the child's contribution history, cost-basis and after-tax contribution records, yearly account statements, and any tax forms the account produces. Save immigration and identity documents too. Good records make age-18 decisions, education planning, Roth conversion analysis, and any move back to India far easier — and are essential if the family ever files across two countries.",
  },
  {
    question: "Can H-1B holders open a Trump Account?",
    answer:
      "An H-1B parent can open and manage the account for an eligible child, acting as the responsible party. The parent's own H-1B status is not the eligibility test — what matters is that the child is under 18 by year-end and has a valid SSN. An H-1B worker cannot open a Trump Account for themselves.",
  },
  {
    question: "Can Green Card holders contribute?",
    answer:
      "Yes. A green card holder can open and contribute to an eligible child's account like any other parent or responsible party. The child's SSN and, for the $1,000 seed, citizenship and birth window drive eligibility — not the parent's immigration status.",
  },
  {
    question: "What happens to the account if we move to India?",
    answer:
      "The account belongs to the child and generally stays open. The practical issues are keeping U.S. provider access from a foreign address and handling cross-border tax. A U.S.-citizen child keeps lifelong U.S. filing duties, and India may tax the account's income once you are Indian tax residents. Decide before you leave whether to keep, convert, withdraw, or leave it invested, and get cross-border advice.",
  },
  {
    question: "Can grandparents contribute to a Trump Account?",
    answer:
      "Others, including grandparents, may contribute up to the aggregate annual limit under current rules. A grandparent's contribution is generally treated as a gift to the child. If the money comes from India, review U.S. gift-tax reporting and Indian FEMA/LRS remittance rules before sending funds.",
  },
  {
    question: "Can employers contribute to a Trump Account?",
    answer:
      "Some employer contributions may be possible where offered, under their own rules. Do not assume any specific employer match amount — there is no official figure for a set match. Confirm with the employer and current IRS guidance before relying on it.",
  },
  {
    question: "Can my child inherit or pass on the account?",
    answer:
      "The account is the child's own asset, and beneficiary rules generally determine what happens on death, like other retirement-style accounts. Keep beneficiary designations current and coordinate with your estate plan, especially for larger balances or cross-border families.",
  },
  {
    question: "Can I transfer or roll over the account?",
    answer:
      "Because a Trump Account is built on traditional-IRA-style rules, some transfers or conversions (such as a Roth conversion) may be possible, subject to current guidance. Rollovers and transfers have their own tax consequences, so confirm the current rules before moving money.",
  },
  {
    question: "Can I combine a Trump Account with a 529?",
    answer:
      "Yes, and many families do. A common approach is to claim the $1,000 seed and fund the Trump Account for long-term flexibility, while using a 529 for tax-free qualified education growth. Match each account to its strength rather than choosing only one.",
  },
  {
    question: "Can a Trump Account affect FAFSA or financial aid?",
    answer:
      "A retirement-style account and any income from a withdrawal or Roth conversion can affect financial-aid calculations differently than a 529. Because a conversion or withdrawal adds to income in that year, review FAFSA/aid timing before acting during the college years.",
  },
  {
    question: "What happens after age 18?",
    answer:
      "Control of the account may shift to the child as an adult. Withdrawals become possible but are often the most expensive choice because of tax, a possible penalty, and lost compounding. Hold a short 'age-18 account meeting' to review records and options before taking any money out.",
  },
  {
    question: "Can my child delay withdrawals?",
    answer:
      "Yes. There is no requirement to withdraw at 18. Leaving the money invested is usually the most tax-efficient choice, and waiting until age 59½ generally avoids the early-withdrawal penalty entirely. Because the account is treated as a traditional IRA after 18, required minimum distributions generally begin at age 73 under current law — a Roth conversion, if permitted, avoids RMDs for the original owner. Confirm current rules.",
  },
  {
    question: "When exactly can my child first withdraw — is it their 18th birthday?",
    answer:
      "Not the birthday itself. Based on current IRS guidance, amounts generally cannot be withdrawn before January 1st of the calendar year in which the child turns 18. So a child with a December birthday can generally access the account from January 1 of that same year, not twelve months later. Confirm the exact timing against current IRS guidance.",
  },
  {
    question: "Can a Trump Account be rolled into a Roth IRA, and when?",
    answer:
      "Initial guidance indicates Trump Account funds can generally be converted to a Roth IRA starting in the year the child turns 18. The pre-tax amount converted is taxed as ordinary income that year, so a low-income year (covered largely by the standard deduction) can make the tax very small. Confirm that a conversion is permitted under current rules before relying on it, and weigh financial-aid and state-tax effects.",
  },
  {
    question: "What is the RMD age for a Trump Account?",
    answer:
      "Because the account is generally treated as a traditional IRA after age 18, the traditional-IRA required-minimum-distribution rules apply — under current law that generally means RMDs begin at age 73 (scheduled to rise to 75 in 2033). A Roth IRA has no RMDs for the original owner, which is one reason families consider converting. Verify the current age and applicability to this account type.",
  },
  {
    question: "Does state tax apply to withdrawals?",
    answer:
      "Often yes. Many states tax retirement-account withdrawals as ordinary income, and some add their own penalty on early distributions. No-income-tax states like Texas and Florida do not tax the withdrawal, though federal tax and penalty still apply. Check your state's specific rules.",
  },
  {
    question: "Is a withdrawal taxed as ordinary income or capital gains?",
    answer:
      "Under traditional-IRA-style rules, the taxable portion of a withdrawal is generally taxed as ordinary income at your marginal rate, not at lower long-term capital-gains rates. That is an important difference from a taxable brokerage account.",
  },
  {
    question: "How much is the early-withdrawal penalty?",
    answer:
      "Illustratively, an early withdrawal before age 59½ may carry a 10% federal penalty on the taxable portion, on top of ordinary income tax, unless an exception applies. Certain exceptions (such as disability or qualifying medical costs) can waive the penalty but usually not the income tax.",
  },
  {
    question: "What are common penalty exceptions?",
    answer:
      "Traditional-IRA-style exceptions often include disability, certain medical expenses, and a limited first-home amount, among others. An exception typically removes the penalty, not the income tax on the taxable portion. Verify which exceptions currently apply to a Trump Account before relying on one.",
  },
  {
    question: "Should I withdraw all at once or over several years?",
    answer:
      "Spreading withdrawals over several years usually costs less tax than a lump sum, because it keeps you in lower marginal brackets and leaves more money compounding. A large one-time withdrawal can push you into a higher bracket and maximize the penalty.",
  },
  {
    question: "When is the best year to make a taxable withdrawal or conversion?",
    answer:
      "Low-income years — a gap year, a college year, a year between jobs, or an early-career year — are generally the most tax-efficient times to withdraw or do a partial Roth conversion, because your marginal rate is lower. Peak-earning years are the worst.",
  },
  {
    question: "Is a Roth conversion always a good idea?",
    answer:
      "No. A conversion adds to taxable income in the year it happens and can affect financial aid, brackets, and state tax. It tends to make sense only in low-income years and after weighing those effects. Review it case by case with a professional.",
  },
  {
    question: "Can I use the account for a first home?",
    answer:
      "Possibly. A first-home exception may reduce or remove the early-withdrawal penalty on a limited amount, but the taxable portion is generally still subject to income tax. Model the full after-tax cost before using long-term money for a down payment.",
  },
  {
    question: "Can the account be used for a medical emergency?",
    answer:
      "A medical exception may waive the early-withdrawal penalty on qualifying expenses, though income tax on the taxable portion generally still applies. Keep thorough documentation, and confirm the current exception rules for a Trump Account.",
  },
  {
    question: "What if my child gets a full scholarship?",
    answer:
      "There is no reason to withdraw. Leave the balance invested so it keeps compounding, and consider whether a low-income college year is a good time for a small, optional Roth conversion rather than a withdrawal.",
  },
  {
    question: "What if my child has no income after graduation?",
    answer:
      "A no-income or low-income year means a low marginal tax rate, so any needed withdrawal is taxed lightly — but the early-withdrawal penalty may still apply. It can also be an efficient year for a small Roth conversion instead of spending the money.",
  },
  {
    question: "How does a large inheritance change the plan?",
    answer:
      "If the child receives a large inheritance, there is usually even less reason to tap the Trump Account. Leave it invested, and fold the account into a broader estate and beneficiary review with a professional.",
  },
  {
    question: "What if my child becomes an NRI?",
    answer:
      "A U.S.-citizen child who becomes an Indian resident may face tax in both countries on a withdrawal. The U.S.–India tax treaty may relieve double taxation, and timing draws to low-income U.S. years can help. Get cross-border advice before the first withdrawal abroad.",
  },
  {
    question: "What if we abandon a green card?",
    answer:
      "Abandoning long-term U.S. residence can trigger complex expatriation-tax rules that may affect retirement-style accounts. Do not withdraw or expatriate without professional advice — the outcome depends heavily on your specific facts.",
  },
  {
    question: "Does India tax the Trump Account?",
    answer:
      "India may tax income or gains depending on the child's Indian tax residency, how income is recognized, and Indian law at the time. Do not assume U.S. tax deferral carries over to India. A cross-border advisor should review your situation before you rely on any treatment.",
  },
  {
    question: "Does the Trump Account trigger FBAR or FATCA?",
    answer:
      "The Trump Account is a U.S. account, so it is not itself a foreign account for FBAR. But a U.S.-citizen child living in India may open Indian bank or investment accounts that trigger U.S. reporting like FBAR/FATCA. Plan for that as the child grows.",
  },
  {
    question: "How do exchange rates affect withdrawals if we live in India?",
    answer:
      "If you withdraw in dollars and spend in rupees, the exchange rate at the time affects how much you actually receive, and currency movement can add real gain or loss. Factor exchange-rate timing and any conversion costs into cross-border withdrawal decisions.",
  },
  {
    question: "Is tax-deferred the same as tax-free?",
    answer:
      "No. Tax-deferred means earnings are not taxed year by year while they stay in the account, but tax generally applies later when you withdraw. A 529 (for qualified education) and a Roth offer tax-free growth; a Trump Account defers tax rather than eliminating it.",
  },
  {
    question: "Do I get a tax deduction for contributing?",
    answer:
      "Generally no. There is typically no individual income-tax deduction for contributions during the growth period. The benefit is tax-deferred compounding inside the account, not an upfront write-off.",
  },
  {
    question: "How is a Trump Account different from a custodial brokerage (UTMA/UGMA)?",
    answer:
      "A custodial brokerage is taxed every year (kiddie-tax rules can apply) and offers broad investments and full flexibility, while a Trump Account grows tax-deferred but restricts investments to qualifying index funds and carries withdrawal rules. They serve different goals.",
  },
  {
    question: "Should I prioritize a Trump Account over a Roth IRA?",
    answer:
      "If the child has earned income, tax-free Roth space is usually valuable and worth prioritizing. A Trump Account is useful because it can start before the child has any earned income and adds tax-deferred room. Many families use both.",
  },
  {
    question: "Are the dollar figures on this page official?",
    answer:
      "No. Every tax and penalty figure in the planning examples is a simplified illustration using traditional-IRA-style assumptions, not official Trump Account program figures or personalized advice. Only the $1,000 seed, the general $5,000 annual limit, and the birth-window dates come from the announced program, and even those can change — verify with the IRS and Treasury.",
  },
  {
    question: "When should I hire a cross-border tax advisor?",
    answer:
      "Get professional advice before large contributions or withdrawals, before a Roth conversion, before moving to or from India, before abandoning a green card, and whenever two countries' tax systems could apply. The cost of advice is usually small next to the tax at stake.",
  },
  {
    question: "What is the best age to withdraw from a Trump Account?",
    answer:
      "There is no single best age, but the pattern is clear: withdrawing at 18–21 in a low-income year keeps the tax low but forfeits the most compounding, while waiting until age 59½ avoids the penalty and captures decades of growth. Peak-earning years (30s–40s) are usually the worst time. Match the timing to a low-income year and a real need.",
  },
  {
    question: "Is it better to withdraw all at once or spread it out?",
    answer:
      "Spreading withdrawals over several years is almost always more tax-efficient than a lump sum, because it keeps each year in a lower marginal bracket and leaves more money compounding. A large one-time withdrawal can push the taxable amount into a higher bracket and maximize both tax and penalty.",
  },
  {
    question: "Does a Trump Account withdrawal affect my other benefits or aid?",
    answer:
      "A withdrawal or Roth conversion adds to income that year, which can affect financial aid (FAFSA) and some income-tested benefits. Because a conversion or withdrawal is counted as income, review aid timing before acting during the college years, and consider spreading the income across years.",
  },
  {
    question: "Can grandparents in India contribute to the account?",
    answer:
      "Others may contribute up to the aggregate annual limit under current rules, and a grandparent's contribution is generally treated as a gift to the child. If funds come from India, review U.S. gift-tax reporting and Indian FEMA/LRS remittance rules before sending money — get advice for larger amounts.",
  },
  {
    question: "What happens to the account if I leave the U.S.?",
    answer:
      "The account belongs to the child and generally stays open. The practical constraints are keeping U.S. provider access from a foreign address and handling cross-border tax. Plan access before you leave, and decide deliberately whether to keep, convert, withdraw, or leave the account invested.",
  },
  {
    question: "Can I combine a Trump Account, a 529, and a Roth for one child?",
    answer:
      "Yes. Many families use a 529 for tax-free education growth, a Roth IRA once the child has earned income for tax-free retirement growth, and a Trump Account for early, flexible, tax-deferred compounding. Match each account to its strength rather than choosing only one.",
  },
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
    question: "How do I apply for a Trump Account?",
    answer:
      "You apply using IRS Form 4547. As the responsible party (a parent or guardian) you provide your details and the child's — including the child's valid Social Security number — elect to establish the account, and, if the child qualifies, request the $1,000 pilot contribution on the same form. Submit only through official IRS/Treasury channels and follow the current instructions.",
  },
  {
    question: "What is IRS Form 4547?",
    answer:
      "Form 4547 is the IRS form used to make the election to establish an initial Trump Account for the exclusive benefit of an eligible child, and to elect the $1,000 pilot program contribution if the child qualifies.",
  },
  {
    question: "Can I apply for a Trump Account online?",
    answer:
      "Only through official IRS or TrumpAccounts.gov channels once they are available. Because the program is new, the filing method and timing are set by the IRS and can change. Never enter your child's SSN on an unofficial or third-party site that claims to open the account for you.",
  },
  {
    question: "Who can file Form 4547 for a child?",
    answer:
      "The responsible party — a parent, legal guardian, or otherwise authorized individual — files it on the child's behalf. The child does not complete the form.",
  },
  {
    question: "Does my child need an SSN for a Trump Account?",
    answer:
      "Yes. The child needs a valid Social Security number, not an ITIN. A child with only an ITIN generally does not qualify for the account or the $1,000 pilot contribution.",
  },
  {
    question: "How do I request the $1,000 Trump Account contribution?",
    answer:
      "If the child qualifies, you request it on the same Form 4547 used to open the account. Based on current guidance the child must be a U.S. citizen with a valid SSN, meet qualifying-child rules, and be born after December 31, 2024 and before January 1, 2029.",
  },
  {
    question: "Can H-1B parents apply for a Trump Account for a U.S.-born child?",
    answer:
      "Generally yes, if the child qualifies. The parent's visa status is not the main test. A U.S.-born child is usually a U.S. citizen who can get a valid SSN, so the child can often be eligible, with the H-1B parent acting as the responsible party.",
  },
  {
    question: "Should I apply now or wait for official instructions?",
    answer:
      "Apply once your child has a valid SSN and the current IRS Form 4547 and instructions are available. Wait if the SSN has not been issued yet, and always confirm the latest IRS/Treasury guidance before filing — the program is new and details can change. Contributions cannot be made before July 4, 2026.",
  },
  {
    question: "Is NRItoUSA an official Trump Account application site?",
    answer:
      "No. NRItoUSA is an educational resource that explains the rules in plain English for immigrant families. We do not collect personal information, file Form 4547, or open accounts. Apply only through official IRS, Treasury, or TrumpAccounts.gov channels.",
  },
  {
    question: "Where should I check the official Trump Account rules?",
    answer:
      "Use only official sources: IRS.gov (Form 4547 and instructions), TrumpAccounts.gov, and the U.S. Treasury. Rules, amounts, and forms can change, so confirm the current guidance there before you apply or contribute.",
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

/* ================================================================== *
 * TAX-PLANNING GUIDE DATASETS
 * (used only by /trump-account-tax-planning-immigrant-families)
 *
 * IMPORTANT: every dollar figure below is an ILLUSTRATION built on
 * simple, traditional-IRA-style assumptions — ordinary income tax on
 * the taxable portion of a withdrawal, plus a possible 10% early-
 * withdrawal penalty before age 59½ unless an exception applies.
 * They are NOT the official Trump Account program figures, and they
 * are NOT personalized tax advice. Actual results depend on current
 * IRS/Treasury rules, the account's real basis, the family's other
 * income, state law, and cross-border facts.
 * ================================================================== */

export const TAX_ILLUSTRATION_NOTE =
  "All dollar amounts in this section are simplified illustrations, not personalized tax advice. They assume a traditional-IRA-style withdrawal is taxed as ordinary income, with a possible 10% early-withdrawal penalty before age 59½ unless an exception applies. Confirm current IRS/Treasury rules and run your own numbers with a qualified advisor.";

/* ------------------------------------------------------------------ *
 * Section 2 — Quick decision box (static Q&A guidance)
 * ------------------------------------------------------------------ */
export const decisionBoxCols: DataCol[] = [
  { key: "question", label: "Ask yourself" },
  { key: "yes", label: "If YES", highlight: true },
  { key: "no", label: "If NO" },
];
export const decisionBoxRows: DataRow[] = [
  {
    question: "Is your child a U.S. citizen with a valid SSN?",
    yes: "The account (and possibly the $1,000 seed) can be opened",
    no: "Fix eligibility first — an ITIN does not qualify",
  },
  {
    question: "Is the family likely to stay in the U.S. long-term?",
    yes: "A long-hold, retirement-style Trump Account fits well",
    no: "Weigh exit flexibility and cross-border tax before over-funding",
  },
  {
    question: "Is college the main goal?",
    yes: "Fund a 529 first for tax-free education growth; use Trump Account as a supplement",
    no: "A Trump Account's long-term, flexible use may fit better",
  },
  {
    question: "Is long-term / retirement wealth the main goal?",
    yes: "The Trump Account is well suited — leave it invested for decades",
    no: "Match the account to the real goal (education, home, emergency)",
  },
  {
    question: "Might you move back to India?",
    yes: "Prefer flexible accounts; plan U.S. access + cross-border reporting early",
    no: "Standard U.S. long-term planning applies",
  },
  {
    question: "Are you already using a 529?",
    yes: "Use the Trump Account for non-education, long-term goals — don't duplicate",
    no: "Decide 529 vs Trump Account by whether college is the priority",
  },
  {
    question: "Are you already funding a Roth (for you or an earning child)?",
    yes: "Keep tax-free Roth space as priority; Trump Account adds tax-deferred room",
    no: "A Trump Account can start compounding before the child has earned income",
  },
];

/* ------------------------------------------------------------------ *
 * Section 3 — Age timeline
 * ------------------------------------------------------------------ */
export const ageTimelineCols: DataCol[] = [
  { key: "age", label: "Age" },
  { key: "control", label: "Who controls it", highlight: true },
  { key: "contrib", label: "Contribution opportunity" },
  { key: "withdraw", label: "Withdrawal reality" },
  { key: "tax", label: "Tax & penalty" },
  { key: "plan", label: "Planning idea" },
  { key: "mistake", label: "Common mistake" },
];
export const ageTimelineRows: DataRow[] = [
  {
    age: "Birth",
    control: "Parent / responsible party",
    contrib: "Open the account; claim the $1,000 seed if eligible",
    withdraw: "Not the point yet — this is a decades-long hold",
    tax: "No tax event on opening or contributing",
    plan: "Automate small yearly contributions; save every record",
    mistake: "Delaying the open and losing early compounding years",
  },
  {
    age: "5",
    control: "Parent / responsible party",
    contrib: "Keep adding within the annual limit",
    withdraw: "Still untouched",
    tax: "Tax-deferred growth continues",
    plan: "Set contributions to auto-invest in the eligible index fund",
    mistake: "Leaving cash uninvested inside the account",
  },
  {
    age: "10",
    control: "Parent / responsible party",
    contrib: "Continue; consider gifts from relatives within limits",
    withdraw: "Not recommended",
    tax: "No event unless you withdraw",
    plan: "Start basic money lessons with the child",
    mistake: "Assuming grandparent gifts have no reporting angle",
  },
  {
    age: "15",
    control: "Parent / responsible party",
    contrib: "If the teen has a job, coordinate with a Roth IRA too",
    withdraw: "Avoid — long runway is the whole advantage",
    tax: "Deferred growth; watch kiddie-tax on OTHER child income",
    plan: "Map out the age-18 handoff before it arrives",
    mistake: "Waiting until 18 to explain taxes and investing",
  },
  {
    age: "18",
    control: "May shift to the child (adult)",
    contrib: "Adult child can keep contributing per rules",
    withdraw: "Now possible — and often the most expensive choice",
    tax: "Taxable portion is ordinary income; ~10% penalty may apply",
    plan: "Hold an 'age-18 account meeting' before touching a dollar",
    mistake: "Cashing out the whole balance on the 18th birthday",
  },
  {
    age: "21",
    control: "The child (adult)",
    contrib: "Continue if there's room and cash flow",
    withdraw: "Possible; penalty usually still applies pre-59½",
    tax: "Low-income college years can mean a low bracket",
    plan: "Consider a partial Roth conversion in a low-income year",
    mistake: "Converting too much and spiking that year's income",
  },
  {
    age: "25",
    control: "The child (adult)",
    contrib: "Early-career contributions compound powerfully",
    withdraw: "Early withdrawal still costs tax + likely penalty",
    tax: "First-job income raises the marginal rate",
    plan: "Leave invested; redirect raises into retirement accounts",
    mistake: "Raiding the account for a car or lifestyle upgrade",
  },
  {
    age: "30",
    control: "The child (adult)",
    contrib: "Coordinate with 401(k)/IRA space",
    withdraw: "A first-home exception may reduce (not erase) the cost",
    tax: "Any exception may remove penalty but not the income tax",
    plan: "If buying a home, model the true after-tax cost first",
    mistake: "Assuming a first-home withdrawal is fully tax-free",
  },
  {
    age: "40",
    control: "The child (adult)",
    contrib: "Peak-earning years — often a poor time to convert",
    withdraw: "Still pre-59½: penalty risk remains",
    tax: "High marginal bracket makes withdrawals costly",
    plan: "Keep compounding; avoid discretionary withdrawals",
    mistake: "Doing a big Roth conversion in a top-bracket year",
  },
  {
    age: "59½",
    control: "The child (adult)",
    contrib: "Contributions per then-current rules",
    withdraw: "Penalty-free withdrawals generally begin",
    tax: "Ordinary income tax still applies to the taxable portion",
    plan: "Draw strategically to stay in a lower bracket",
    mistake: "Forgetting that 'penalty-free' is not 'tax-free'",
  },
  {
    age: "70+",
    control: "The child (adult)",
    contrib: "Typically drawing down, not adding",
    withdraw: "As a traditional IRA, required minimum distributions generally begin at 73 (current law)",
    tax: "Distributions taxed as ordinary income; a Roth conversion earlier avoids RMDs",
    plan: "Coordinate with estate and beneficiary planning",
    mistake: "Ignoring beneficiary designations and estate impact",
  },
];

/* ------------------------------------------------------------------ *
 * Section 4 — 26 tax-planning scenarios (illustrative numbers)
 * ------------------------------------------------------------------ */
export const taxScenarioCols: DataCol[] = [
  { key: "scenario", label: "Scenario" },
  { key: "age", label: "Child age" },
  { key: "household", label: "Household income" },
  { key: "childIncome", label: "Child income" },
  { key: "withdrawal", label: "Withdrawal", highlight: true },
  { key: "fedTax", label: "Est. federal tax" },
  { key: "stateTax", label: "Possible state tax" },
  { key: "penalty", label: "10% penalty" },
  { key: "net", label: "Net in hand", highlight: true },
  { key: "strategy", label: "Recommended strategy" },
];
export const taxScenarioRows: DataRow[] = [
  { scenario: "College at 18, small draw", age: "18", household: "$120k", childIncome: "$0", withdrawal: "$10,000", fedTax: "~$1,000 (10–12%)", stateTax: "$0–$500", penalty: "~$1,000", net: "~$7,500–8,000", strategy: "Use 529 first; draw only the gap", },
  { scenario: "College at 22, larger draw", age: "22", household: "$150k", childIncome: "$8k", withdrawal: "$20,000", fedTax: "~$2,400 (12%)", stateTax: "$0–$1,000", penalty: "~$2,000", net: "~$14,600–15,600", strategy: "Spread across two tax years to stay low-bracket", },
  { scenario: "Community college, low cost", age: "19", household: "$90k", childIncome: "$5k", withdrawal: "$6,000", fedTax: "~$600 (10%)", stateTax: "$0–$300", penalty: "~$600", net: "~$4,500–4,800", strategy: "Small draws in low-income years are least costly", },
  { scenario: "Private college, high cost", age: "20", household: "$200k", childIncome: "$0", withdrawal: "$40,000", fedTax: "~$8,800 (22%)", stateTax: "$0–$3,000", penalty: "~$4,000", net: "~$24,200–27,200", strategy: "Exhaust 529 + aid first; this is an expensive last resort", },
  { scenario: "Graduate school", age: "24", household: "$60k", childIncome: "$12k", withdrawal: "$15,000", fedTax: "~$1,800 (12%)", stateTax: "$0–$750", penalty: "~$1,500", net: "~$11,000–11,700", strategy: "Grad-year low income can be a Roth-conversion window", },
  { scenario: "Scholarship covers tuition", age: "18", household: "$130k", childIncome: "$0", withdrawal: "$0", fedTax: "$0", stateTax: "$0", penalty: "$0", net: "Stays invested", strategy: "Don't withdraw — let the balance keep compounding", },
  { scenario: "Gap year, no income", age: "18", household: "$110k", childIncome: "$0", withdrawal: "$5,000", fedTax: "~$500 (10%)", stateTax: "$0–$250", penalty: "~$500", net: "~$3,750–4,000", strategy: "Low-income year, but penalty still bites — keep it small", },
  { scenario: "First job, modest salary", age: "23", household: "n/a", childIncome: "$55k", withdrawal: "$10,000", fedTax: "~$2,200 (22%)", stateTax: "$0–$700", penalty: "~$1,000", net: "~$6,100–6,800", strategy: "Leave invested; fund a 401(k) instead of withdrawing", },
  { scenario: "High-salary first job", age: "26", household: "n/a", childIncome: "$140k", withdrawal: "$25,000", fedTax: "~$6,000 (24%)", stateTax: "$0–$2,300", penalty: "~$2,500", net: "~$14,200–16,500", strategy: "Worst time to withdraw — high bracket + penalty", },
  { scenario: "No job after graduation", age: "23", household: "$0", childIncome: "$0", withdrawal: "$8,000", fedTax: "~$0–$400", stateTax: "$0–$200", penalty: "~$800", net: "~$6,600–7,200", strategy: "Very low bracket; penalty is the main cost", },
  { scenario: "Military service", age: "21", household: "n/a", childIncome: "$35k", withdrawal: "$10,000", fedTax: "~$1,200 (12%)", stateTax: "varies by state", penalty: "check exceptions", net: "~$7,800–8,800", strategy: "Some service/hardship exceptions may waive the penalty — verify", },
  { scenario: "Medical emergency", age: "27", household: "n/a", childIncome: "$50k", withdrawal: "$12,000", fedTax: "~$2,600 (22%)", stateTax: "$0–$800", penalty: "possible exception", net: "~$8,600–9,400", strategy: "A medical exception may waive the penalty — document it", },
  { scenario: "Disability", age: "30", household: "n/a", childIncome: "$20k", withdrawal: "$15,000", fedTax: "~$1,800 (12%)", stateTax: "varies", penalty: "likely exception", net: "~$12,000–13,200", strategy: "Disability is a common penalty exception — confirm eligibility", },
  { scenario: "Starting a business", age: "28", household: "n/a", childIncome: "$40k", withdrawal: "$30,000", fedTax: "~$5,400 (18% eff.)", stateTax: "$0–$2,400", penalty: "~$3,000", net: "~$19,200–21,600", strategy: "Compare to a business loan before draining tax-advantaged money", },
  { scenario: "First home purchase", age: "31", household: "n/a", childIncome: "$85k", withdrawal: "$20,000", fedTax: "~$4,400 (22%)", stateTax: "$0–$1,300", penalty: "first-home exception may apply", net: "~$14,300–15,600", strategy: "Exception may cut the penalty, not the income tax — model it", },
  { scenario: "Marriage / wedding costs", age: "27", household: "$180k joint", childIncome: "$70k", withdrawal: "$15,000", fedTax: "~$3,300 (22%)", stateTax: "$0–$1,100", penalty: "~$1,500", net: "~$9,100–10,200", strategy: "Discretionary — usually better to leave invested", },
  { scenario: "Parents retire, low family income", age: "20", household: "$45k", childIncome: "$6k", withdrawal: "$12,000", fedTax: "~$1,200 (10–12%)", stateTax: "$0–$500", penalty: "~$1,200", net: "~$9,100–9,600", strategy: "Low-bracket years are the cheapest time to draw or convert", },
  { scenario: "Child has low income", age: "22", household: "n/a", childIncome: "$15k", withdrawal: "$10,000", fedTax: "~$700 (10%)", stateTax: "$0–$400", penalty: "~$1,000", net: "~$7,600–8,300", strategy: "Consider partial Roth conversion instead of spending", },
  { scenario: "Child has high income", age: "29", household: "n/a", childIncome: "$160k", withdrawal: "$10,000", fedTax: "~$2,400 (24%)", stateTax: "$0–$900", penalty: "~$1,000", net: "~$5,700–6,600", strategy: "Avoid withdrawing in a peak-earning year", },
  { scenario: "Large inheritance received", age: "35", household: "n/a", childIncome: "$120k + inheritance", withdrawal: "$0", fedTax: "$0", stateTax: "$0", penalty: "$0", net: "Stays invested", strategy: "No need to touch it — let it compound, review estate plan", },
  { scenario: "Child moves overseas (non-India)", age: "30", household: "n/a", childIncome: "$70k abroad", withdrawal: "$0", fedTax: "n/a until withdrawal", stateTax: "no U.S. state if non-resident", penalty: "n/a", net: "Stays invested", strategy: "Keep U.S. access; plan foreign + U.S. reporting", },
  { scenario: "Returning to India", age: "19", household: "$100k → India", childIncome: "$0", withdrawal: "decide before/after move", fedTax: "depends on residency", stateTax: "no U.S. state after exit", penalty: "still applies pre-59½", net: "depends", strategy: "Model U.S. and Indian tax BEFORE leaving — get cross-border advice", },
  { scenario: "Child becomes NRI", age: "28", household: "n/a", childIncome: "India salary", withdrawal: "$10,000", fedTax: "U.S. tax on U.S.-source", stateTax: "treaty may apply", penalty: "~$1,000", net: "depends on treaty", strategy: "Check the U.S.–India treaty and India taxability of the draw", },
  { scenario: "Green Card abandoned", age: "26", household: "n/a", childIncome: "varies", withdrawal: "review before expatriation", fedTax: "expatriation rules may apply", stateTax: "varies", penalty: "varies", net: "depends", strategy: "Expatriation tax is complex — get professional advice first", },
  { scenario: "Large account, big draw", age: "40", household: "n/a", childIncome: "$130k", withdrawal: "$100,000", fedTax: "~$28,000 (pushes to 32%)", stateTax: "$0–$9,000", penalty: "~$10,000", net: "~$53,000–62,000", strategy: "Never a lump sum — spread over years to cap the bracket", },
  { scenario: "Small account, full cash-out", age: "18", household: "$115k", childIncome: "$0", withdrawal: "$4,000", fedTax: "~$400 (10%)", stateTax: "$0–$200", penalty: "~$400", net: "~$3,000–3,200", strategy: "Even small cash-outs lose decades of compounding — reconsider", },
  { scenario: "Mostly contributions, little gain", age: "25", household: "n/a", childIncome: "$50k", withdrawal: "$10,000 (mostly basis)", fedTax: "tax only on the earnings portion", stateTax: "on earnings only", penalty: "penalty on earnings only", net: "higher net than a pre-tax draw", strategy: "After-tax basis returns tax-free — track basis carefully", },
];

/* ------------------------------------------------------------------ *
 * Section 5 — Multi-year withdrawal strategy comparison
 * ------------------------------------------------------------------ */
export const multiYearCols: DataCol[] = [
  { key: "strategy", label: "Strategy" },
  { key: "income", label: "Taxable income added / year", highlight: true },
  { key: "tax", label: "Illustrative tax impact" },
  { key: "growth", label: "Growth left invested" },
  { key: "pros", label: "Pros" },
  { key: "cons", label: "Cons" },
];
export const multiYearRows: DataRow[] = [
  { strategy: "Withdraw all at once ($100k)", income: "+$100k in one year", tax: "Pushes into 32%+; ~$28k+ tax + penalty", growth: "None — money leaves the account", pros: "Simple; done in one year", cons: "Highest bracket, biggest penalty, kills compounding", },
  { strategy: "Withdraw over 3 years", income: "~+$33k/year", tax: "Mostly 22–24%; lower total than lump sum", growth: "Two-thirds keeps growing early on", pros: "Caps the bracket; keeps some compounding", cons: "Requires discipline and multi-year planning", },
  { strategy: "Withdraw over 5 years", income: "~+$20k/year", tax: "Often 12–22%; noticeably less tax", growth: "Most stays invested for years", pros: "Smoother brackets; strong compounding", cons: "Slower access to the full amount", },
  { strategy: "Withdraw over 10 years", income: "~+$10k/year", tax: "Can stay in low brackets", growth: "Large balance keeps compounding", pros: "Lowest bracket drag; big growth tail", cons: "Only works if you don't need the cash now", },
  { strategy: "Leave invested until 59½+", income: "$0 until retirement", tax: "No penalty after 59½; ordinary tax on draws", growth: "Maximum decades of compounding", pros: "No early penalty; largest long-term value", cons: "No access to the money in the meantime", },
];

/* ------------------------------------------------------------------ *
 * Section 6 — Tax bracket planning (illustrative federal, single filer)
 * ------------------------------------------------------------------ */
export const bracketCols: DataCol[] = [
  { key: "bracket", label: "Marginal bracket" },
  { key: "profile", label: "Typical income year" },
  { key: "tax10k", label: "Fed tax on a $10k taxable draw", highlight: true },
  { key: "penalty", label: "+ 10% penalty (if early)" },
  { key: "note", label: "Planning note" },
];
export const bracketRows: DataRow[] = [
  { bracket: "10%", profile: "Student / no-job year", tax10k: "~$1,000", penalty: "+ $1,000", note: "Cheapest year to draw or do a partial Roth conversion", },
  { bracket: "12%", profile: "Part-time / low first job", tax10k: "~$1,200", penalty: "+ $1,000", note: "Still a good conversion window — fill the low bracket", },
  { bracket: "22%", profile: "Solid early-career salary", tax10k: "~$2,200", penalty: "+ $1,000", note: "Withdrawals get expensive — prefer leaving invested", },
  { bracket: "24%", profile: "Established professional", tax10k: "~$2,400", penalty: "+ $1,000", note: "Avoid discretionary withdrawals this year", },
  { bracket: "32%", profile: "High earner", tax10k: "~$3,200", penalty: "+ $1,000", note: "Poor time to convert or withdraw", },
  { bracket: "35%", profile: "Top earner", tax10k: "~$3,500", penalty: "+ $1,000", note: "Nearly the worst-case cost — defer if you can", },
];

/* ------------------------------------------------------------------ *
 * Section 7 — State tax comparison
 * ------------------------------------------------------------------ */
export const stateTaxCols: DataCol[] = [
  { key: "state", label: "State" },
  { key: "incomeTax", label: "State income tax" },
  { key: "treatment", label: "Likely treatment of a withdrawal", highlight: true },
  { key: "note", label: "Planning consideration" },
];
export const stateTaxRows: DataRow[] = [
  { state: "California", incomeTax: "High (up to ~13.3%)", treatment: "Taxable as ordinary income; may add its own penalty on early retirement-account draws", note: "One of the costliest states to take an early withdrawal in", },
  { state: "New York", incomeTax: "High", treatment: "Taxable; some retirement-income exclusions apply at older ages", note: "Big-city residents may owe local tax too", },
  { state: "New Jersey", incomeTax: "High", treatment: "Taxable; NJ tracks basis differently than federal", note: "Keep NJ-specific basis records if you live there", },
  { state: "Illinois", incomeTax: "Flat (~4.95%)", treatment: "Often excludes qualified retirement income — verify treatment", note: "May be gentler than CA/NY on retirement-style draws", },
  { state: "Texas", incomeTax: "None", treatment: "No state income tax on the withdrawal", note: "Federal tax + penalty still apply", },
  { state: "Florida", incomeTax: "None", treatment: "No state income tax on the withdrawal", note: "A common low-tax base for timing large draws", },
  { state: "Washington", incomeTax: "None (wages)", treatment: "No wage income tax; watch its capital-gains tax on other assets", note: "Ordinary IRA-style draws generally avoid state tax", },
];

/* ------------------------------------------------------------------ *
 * Section 8 — Immigrant / status-based planning
 * ------------------------------------------------------------------ */
export const immigrantPlanningCols: DataCol[] = [
  { key: "status", label: "Status" },
  { key: "advantages", label: "Advantages", highlight: true },
  { key: "risks", label: "Risks" },
  { key: "crossBorder", label: "Cross-border / estate note" },
  { key: "advice", label: "When advice pays off" },
];
export const immigrantPlanningRows: DataRow[] = [
  { status: "H-1B parent", advantages: "Can open for a U.S.-citizen child and act as responsible party", risks: "Future status/return uncertainty; don't over-fund if exit is likely", crossBorder: "Plan U.S. account access if you may leave", advice: "Before large contributions or a planned move", },
  { status: "H-4 spouse", advantages: "Can be the managing parent for an eligible child", risks: "H-4 child often lacks an SSN — ITIN doesn't qualify", crossBorder: "Watch the child's SSN/citizenship path", advice: "When confirming the child's eligibility", },
  { status: "L-1 parent", advantages: "Same access as H-1B to open for an eligible child", risks: "Assignments can end and force a quick relocation", crossBorder: "Keep U.S. banking + address continuity", advice: "Before an assignment ends", },
  { status: "L-2 spouse", advantages: "Can manage the account; L-2 EAD gives work income for Roth too", risks: "Tied to primary's assignment timeline", crossBorder: "Same continuity issues as L-1", advice: "When coordinating Roth + Trump Account", },
  { status: "Green Card holder", advantages: "Long U.S. horizon suits long-hold, retirement-style growth", risks: "Abandoning the green card can trigger expatriation tax rules", crossBorder: "Estate/gift rules apply to worldwide assets", advice: "Before abandoning status or large gifts", },
  { status: "U.S. Citizen", advantages: "Fewest access constraints; cleanest long-term planning", risks: "Worldwide taxation and estate tax on large estates", crossBorder: "Coordinate beneficiary + estate documents", advice: "For estate planning on larger balances", },
  { status: "OCI (child)", advantages: "A U.S.-citizen child with OCI keeps U.S. account rights", risks: "OCI itself doesn't change U.S. tax duties", crossBorder: "India residency later drives Indian taxability", advice: "When the child becomes an Indian resident", },
  { status: "Returning to India", advantages: "Account can stay open and keep compounding", risks: "Foreign-address access limits; dual reporting", crossBorder: "India may tax income once you're a resident", advice: "Before you leave — this is the key moment", },
  { status: "Future NRI (child)", advantages: "U.S.-source growth continues regardless of residence", risks: "Withdrawals may be taxed in both countries", crossBorder: "U.S.–India treaty may relieve double tax", advice: "Before the child's first withdrawal abroad", },
  { status: "Children relocating overseas", advantages: "Not tied to a U.S. school or address to keep growing", risks: "Provider may restrict foreign logins", crossBorder: "Local country rules vary widely", advice: "Before the relocation is finalized", },
];

/* ------------------------------------------------------------------ *
 * Section 10 — Case studies
 * ------------------------------------------------------------------ */
export interface CaseStudy {
  title: string;
  visa: string;
  income: string;
  childAge: string;
  goal: string;
  balance: string;
  action: string;
  taxes: string;
  recommendation: string;
}
export const taxPlanningCaseStudies: CaseStudy[] = [
  { title: "Indian H-1B couple, new baby", visa: "H-1B + H-4", income: "$180k household", childAge: "0", goal: "Start long-term wealth", balance: "$1,000 seed + small monthly", action: "No withdrawal — automate contributions", taxes: "None yet; tax-deferred growth", recommendation: "Open early, claim the seed if eligible, invest in the index fund, and keep records.", },
  { title: "Green Card physician, high income", visa: "Green Card", income: "$400k household", childAge: "3", goal: "Diversify child's future", balance: "$1,000 seed + yearly max", action: "Fund a 529 for college AND the Trump Account for the long term", taxes: "No current deduction; deferred growth", recommendation: "Use both accounts; avoid any withdrawal in peak-earning years.", },
  { title: "Software engineer, one child", visa: "H-1B", income: "$160k", childAge: "8", goal: "College + flexibility", balance: "~$30k projected by 18", action: "529 first for tuition; Trump Account as backup", taxes: "529 tuition tax-free; Trump draws taxable", recommendation: "Draw from the Trump Account only for the gap after 529 and aid.", },
  { title: "Family returning to India in 2 years", visa: "H-1B → NRI", income: "$140k", childAge: "5", goal: "Keep options open", balance: "$1,000 seed + modest", action: "Set up U.S. access + records before leaving; don't over-fund", taxes: "U.S. deferral; India taxes later per residency", recommendation: "Get cross-border advice before the move; decide keep vs withdraw deliberately.", },
  { title: "U.S.-citizen child, parents naturalized", visa: "U.S. Citizen", income: "$220k", childAge: "12", goal: "Generational wealth", balance: "~$45k projected by 18", action: "Leave invested; plan age-18 handoff", taxes: "Deferred; ordinary tax on future draws", recommendation: "Teach the teen early; hold an age-18 meeting before any withdrawal.", },
  { title: "Child heading to an Ivy League school", visa: "H-1B", income: "$150k", childAge: "17", goal: "Fund a costly degree", balance: "$25k Trump + $60k 529", action: "Use 529 + aid first; small Trump draws if needed", taxes: "Trump draw taxable + ~10% penalty at 18", recommendation: "Preserve the Trump Account; it's the most expensive dollar to spend now.", },
  { title: "Child receives a full scholarship", visa: "Green Card", income: "$130k", childAge: "18", goal: "Avoid unneeded withdrawals", balance: "$28k", action: "Withdraw nothing — leave it compounding", taxes: "No tax event", recommendation: "Redirect the account toward retirement-style growth; consider a low-year Roth conversion.", },
  { title: "Family moving to Canada", visa: "H-1B → Canada", income: "$170k", childAge: "9", goal: "Cross-border continuity", balance: "$15k", action: "Confirm provider foreign-access + Canadian tax treatment", taxes: "U.S. rules continue; Canada taxes residents", recommendation: "Keep the account, fix access, and get Canada–U.S. cross-border advice.", },
  { title: "Family moving to UAE", visa: "H-1B → UAE", income: "$200k", childAge: "6", goal: "Tax-efficient growth abroad", balance: "$1,000 seed + yearly", action: "Keep invested; no UAE income tax on growth", taxes: "U.S. deferral continues", recommendation: "A U.S.-citizen child still files U.S. taxes — plan withdrawals around U.S. rules.", },
  { title: "Family staying in the U.S. long-term", visa: "Green Card → Citizen", income: "$190k", childAge: "4", goal: "Maximize compounding", balance: "$1,000 seed + max yearly", action: "Fund fully; never touch until adulthood", taxes: "Deferred for decades", recommendation: "This is the ideal long-hold case — automate and leave it alone.", },
  { title: "Single parent, modest income", visa: "H-1B", income: "$85k", childAge: "7", goal: "Start small, stay consistent", balance: "$1,000 seed + $50/mo", action: "Small automatic contributions", taxes: "None until withdrawal", recommendation: "Consistency beats size; build an emergency fund first.", },
  { title: "Grandparents want to contribute", visa: "Green Card", income: "$160k", childAge: "2", goal: "Family gifting", balance: "$1,000 seed + gifts", action: "Accept gifts within limits; document gift-tax angle", taxes: "Gifts to the child; cross-border gift reporting", recommendation: "Coordinate gifts within the annual limit; review LRS/FEMA if funds come from India.", },
  { title: "Teen with a summer job", visa: "H-1B", income: "$150k", childAge: "16", goal: "Add a Roth alongside", balance: "$20k Trump", action: "Open a custodial Roth with earned income too", taxes: "Roth is tax-free; Trump is tax-deferred", recommendation: "Use both — Roth for tax-free growth, Trump for extra tax-deferred room.", },
  { title: "Young adult wants a new car at 18", visa: "U.S. Citizen", income: "n/a (student)", childAge: "18", goal: "Discretionary spending", balance: "$18k", action: "Model the full cost before withdrawing", taxes: "Ordinary tax + ~10% penalty + lost growth", recommendation: "Strongly reconsider — a $10k car could cost far more in lifetime value.", },
  { title: "Medical emergency withdrawal", visa: "Green Card", income: "$70k", childAge: "27", goal: "Cover a health crisis", balance: "$40k", action: "Withdraw needed amount; document exception", taxes: "Income tax; medical exception may waive penalty", recommendation: "Use any qualifying exception and keep full documentation.", },
  { title: "First-home purchase at 31", visa: "U.S. Citizen", income: "$95k", childAge: "31", goal: "Down payment help", balance: "$60k", action: "Use first-home exception if it applies", taxes: "Income tax on taxable portion; penalty may be waived", recommendation: "Model after-tax cost; consider drawing only part to limit the tax hit.", },
  { title: "Starting a business at 28", visa: "H-1B → Citizen", income: "$60k", childAge: "28", goal: "Fund a startup", balance: "$50k", action: "Compare a loan vs draining the account", taxes: "Income tax + penalty on early draw", recommendation: "Preserve tax-advantaged money; explore financing before withdrawing.", },
  { title: "Child becomes an NRI in India", visa: "U.S. Citizen abroad", income: "India salary", childAge: "29", goal: "Manage dual taxation", balance: "$70k", action: "Check treaty before any withdrawal", taxes: "U.S. tax on U.S.-source; India per residency", recommendation: "Use the U.S.–India treaty and time draws to low-income U.S. years.", },
  { title: "Abandoning a green card", visa: "Green Card → NRI", income: "$180k", childAge: "26", goal: "Exit cleanly", balance: "$55k", action: "Review expatriation rules before withdrawing", taxes: "Possible expatriation tax exposure", recommendation: "This is complex — get professional expatriation-tax advice first.", },
  { title: "Large $500k account at retirement", visa: "U.S. Citizen", income: "$120k", childAge: "60", goal: "Tax-smart drawdown", balance: "$500k", action: "Spread withdrawals over many years", taxes: "No penalty after 59½; ordinary tax on draws", recommendation: "Never lump-sum; draw to fill lower brackets each year.", },
];

/* ------------------------------------------------------------------ *
 * Section 11 — Full account comparison matrix (6 accounts)
 * ------------------------------------------------------------------ */
export const fullAccountComparisonColumns: ComparisonColumn[] = [
  { key: "trump", label: "Trump Account", highlight: true },
  { key: "c529", label: "529 Plan" },
  { key: "brokerage", label: "Custodial brokerage" },
  { key: "custodial", label: "UTMA/UGMA" },
  { key: "tradIra", label: "Traditional IRA" },
  { key: "roth", label: "Roth IRA" },
];
export const fullAccountComparisonRows: ComparisonRow[] = [
  { feature: "Upfront tax deduction", values: { trump: "No", c529: "No (some state benefit)", brokerage: "No", custodial: "No", tradIra: "Often yes", roth: "No" } },
  { feature: "Tax-deferred growth", values: { trump: "Yes", c529: "Yes", brokerage: "No (taxed yearly)", custodial: "No", tradIra: "Yes", roth: "Yes" } },
  { feature: "Tax-free qualified withdrawals", values: { trump: "No", c529: "Yes (education)", brokerage: "No", custodial: "No", tradIra: "No", roth: "Yes" } },
  { feature: "Good for education", values: { trump: "Backup", c529: "Best fit", brokerage: "OK", custodial: "OK", tradIra: "Weak", roth: "Weak" } },
  { feature: "Good for retirement", values: { trump: "Yes", c529: "No", brokerage: "OK", custodial: "No", tradIra: "Yes", roth: "Best" } },
  { feature: "Flexibility of use", values: { trump: "High", c529: "Low (education)", brokerage: "Highest", custodial: "High", tradIra: "Medium", roth: "Medium" } },
  { feature: "Early-withdrawal penalty", values: { trump: "~10% pre-59½", c529: "10% on non-ed. earnings", brokerage: "None", custodial: "None", tradIra: "~10% pre-59½", roth: "On earnings only" } },
  { feature: "Investment choices", values: { trump: "Index funds/ETFs only", c529: "Plan menu", brokerage: "Broad", custodial: "Broad", tradIra: "Broad", roth: "Broad" } },
  { feature: "Owner control", values: { trump: "Child at adulthood", c529: "Stays with owner", brokerage: "Child at adulthood", custodial: "Child at adulthood", tradIra: "Owner", roth: "Owner" } },
  { feature: "Needs child's earned income", values: { trump: "No", c529: "No", brokerage: "No", custodial: "No", tradIra: "Yes (to contribute)", roth: "Yes" } },
  { feature: "Best use case", values: { trump: "Early, long-hold child wealth", c529: "College funding", brokerage: "Any-goal flexibility", custodial: "Gifting to a minor", tradIra: "Deductible retirement", roth: "Tax-free retirement" } },
];

/* ------------------------------------------------------------------ *
 * Section 12 — Goal-based decision table
 * ------------------------------------------------------------------ */
export const goalDecisionCols: DataCol[] = [
  { key: "goal", label: "If my goal is..." },
  { key: "account", label: "Best-fit account", highlight: true },
  { key: "why", label: "Why" },
];
export const goalDecisionRows: DataRow[] = [
  { goal: "College", account: "529 (Trump Account as backup)", why: "Tax-free growth for qualified education" },
  { goal: "Retirement for the child", account: "Roth IRA, then Trump Account", why: "Roth is tax-free; Trump adds tax-deferred room without earned income" },
  { goal: "First-home purchase", account: "Depends — model exceptions", why: "A first-home exception may cut the penalty, not the income tax" },
  { goal: "Emergency fund", account: "High-yield savings (not Trump)", why: "Long-term accounts aren't rainy-day money" },
  { goal: "Generational wealth", account: "Trump Account", why: "Early start + decades of compounding" },
  { goal: "Leaving the U.S.", account: "Flexible accounts; plan access", why: "Not tied to a U.S. school or address" },
  { goal: "Returning to India", account: "Review before deciding", why: "Cross-border tax and access drive the answer" },
  { goal: "Scholarship already covers school", account: "Leave Trump invested", why: "No need to withdraw — keep compounding" },
  { goal: "Business startup", account: "Financing before withdrawal", why: "Draining tax-advantaged money is costly" },
  { goal: "Medical costs", account: "Use exceptions if eligible", why: "A medical exception may waive the penalty" },
];

/* ------------------------------------------------------------------ *
 * Section 13 — Top 25 mistakes
 * ------------------------------------------------------------------ */
export const taxPlanningMistakes: string[] = [
  "Withdrawing the entire balance at 18 on impulse",
  "Assuming every withdrawal is tax-free",
  "Ignoring the ~10% early-withdrawal penalty before 59½",
  "Forgetting state income tax on withdrawals",
  "Not planning withdrawals around low-income years",
  "Using a Trump Account instead of a 529 for college without analysis",
  "Ignoring cross-border tax when moving back to India",
  "Waiting until age 18 to explain taxes and investing",
  "Leaving cash uninvested inside the account",
  "Not tracking cost basis and after-tax contributions",
  "Doing a large Roth conversion in a peak-earning year",
  "Assuming a first-home withdrawal is fully tax-free",
  "Treating the account like a checking account",
  "Over-funding when the family plans to leave the U.S. soon",
  "Confusing 'penalty-free' after 59½ with 'tax-free'",
  "Missing penalty exceptions (disability, medical, service)",
  "Taking a lump sum instead of spreading withdrawals over years",
  "Ignoring FAFSA / financial-aid impact of a conversion or withdrawal",
  "Forgetting U.S.-citizen children file U.S. taxes for life",
  "Not setting up provider access before moving abroad",
  "Overlooking gift-tax reporting on large or cross-border contributions",
  "Skipping an 'age-18 account meeting' before the child can access it",
  "Neglecting beneficiary designations and estate planning",
  "Assuming India mirrors U.S. tax deferral automatically",
  "Making decisions without a cross-border advisor when facts are complex",
];

/* ------------------------------------------------------------------ *
 * Section 15 — Planned tools (placeholders)
 * ------------------------------------------------------------------ */
export interface PlannedTool {
  name: string;
  desc: string;
}
export const plannedTools: PlannedTool[] = [
  { name: "Trump Account Tax Estimator", desc: "Estimate the illustrative federal tax and penalty on a withdrawal by age, income, and amount." },
  { name: "Withdrawal Planner", desc: "Compare taking money all at once vs spreading it over several years." },
  { name: "529 vs Trump Account Comparison", desc: "See which account fits your college-vs-flexibility goal side by side." },
  { name: "Retirement Growth Calculator", desc: "Project decades of tax-deferred compounding from today's balance." },
  { name: "First-Home Withdrawal Planner", desc: "Model the true after-tax cost of using the account for a down payment." },
  { name: "Returning-to-India Planning Tool", desc: "Walk through keep-vs-withdraw decisions and cross-border reporting before you move." },
];

/* ------------------------------------------------------------------ *
 * Spoke page: /trump-account-age-18-withdrawal-roth-conversion
 * Unique FAQ set (must match the visible FAQ text on that page).
 * ------------------------------------------------------------------ */
export const age18SpokeFaqs: FaqItem[] = [
  {
    question: "When can a child first take money out of a Trump Account?",
    answer:
      "Based on current IRS guidance, amounts generally cannot be withdrawn before January 1st of the calendar year in which the child turns 18. It is tied to the calendar year, not the exact birthday, so a December birthday generally unlocks access from January 1 of that year. Confirm the timing against current IRS guidance before relying on it.",
  },
  {
    question: "What happens to the account at age 18?",
    answer:
      "After that point the account is generally treated as a traditional IRA and follows the same rules as other traditional IRAs. Control generally shifts to the now-adult child, the growth-period investment restrictions ease, and the child handles their own tax reporting. Nothing forces a withdrawal at 18 — doing nothing and staying invested is a valid choice.",
  },
  {
    question: "Are withdrawals after 18 taxed?",
    answer:
      "Generally yes. As a traditional IRA, the taxable portion of a withdrawal is taxed as ordinary income at the child's marginal rate, and a 10% early-withdrawal penalty may apply before age 59½ unless an exception applies. After-tax basis, if any, generally comes back tax-free. Run the after-tax numbers before withdrawing.",
  },
  {
    question: "What early-withdrawal penalty exceptions apply?",
    answer:
      "Because it is treated as a traditional IRA, the usual IRA exceptions generally apply — for example disability, certain medical expenses, a limited first-home amount, and certain birth or adoption costs, among others. An exception typically waives the 10% penalty but not the income tax on the taxable portion. Verify which exceptions currently apply to a Trump Account.",
  },
  {
    question: "Can a Trump Account be converted to a Roth IRA at 18?",
    answer:
      "Initial guidance indicates a conversion is generally permitted starting in the year the child turns 18. The pre-tax amount converted is taxed as ordinary income that year, so converting during a low-income year — when the standard deduction absorbs much of it — can keep the tax very low. Confirm current rules and weigh financial-aid and state-tax effects first.",
  },
  {
    question: "Why is a low-income year the best time to convert or withdraw?",
    answer:
      "Tax follows your marginal bracket. A college year, gap year, or year between jobs often means a low rate, so converting or withdrawing then costs far less than doing it in a peak-earning year. Spreading a conversion across several low-income years can keep each year in a low bracket.",
  },
  {
    question: "Does this change for immigrant families?",
    answer:
      "The core rules are the same, but visa status, the child's SSN and citizenship, and a possible move back to India add layers. A U.S.-citizen child keeps lifelong U.S. filing duties, India may tax withdrawals once the child is an Indian resident, and the U.S.–India treaty may relieve double tax. Plan U.S. account access and cross-border reporting before any move.",
  },
  {
    question: "Should my 18-year-old just cash out the account?",
    answer:
      "Usually no. A full cash-out at 18 typically triggers ordinary income tax, a possible 10% penalty, and the loss of decades of compounding — often the single costliest move a family makes. Hold a short 'age-18 account meeting' to review records and options before touching a dollar.",
  },
];

/* ================================================================== *
 * ENHANCEMENT PASS 2 DATASETS
 * (best withdrawal age, extra scenarios, Roth deep-dive, checklists)
 * Every dollar figure is illustrative — see TAX_ILLUSTRATION_NOTE.
 * ================================================================== */

/* --- P2: "When is the best time to withdraw?" age comparison --- */
export const bestAgeCols: DataCol[] = [
  { key: "age", label: "Withdraw at…" },
  { key: "tax", label: "Tax efficiency", highlight: true },
  { key: "growth", label: "Growth given up" },
  { key: "penalty", label: "Penalty" },
  { key: "use", label: "Typical use case" },
  { key: "pro", label: "Advantage" },
  { key: "con", label: "Disadvantage" },
];
export const bestAgeRows: DataRow[] = [
  { age: "18", tax: "Often low (little/no income)", growth: "Largest — decades lost", penalty: "~10% (pre-59½)", use: "First-year college gap, emergency", pro: "Low bracket year", con: "Kills the most compounding; impulse risk" },
  { age: "21", tax: "Usually low (student)", growth: "Very large", penalty: "~10% (pre-59½)", use: "College, gap year, Roth conversion window", pro: "Low bracket; conversion-friendly", con: "Still forfeits decades of growth" },
  { age: "25", tax: "Rising (first job)", growth: "Large", penalty: "~10% (pre-59½)", use: "Early-career need, first-home saving", pro: "Some flexibility", con: "Bracket climbing; penalty still applies" },
  { age: "30", tax: "Moderate–high", growth: "Meaningful", penalty: "~10% unless exception (e.g. first home)", use: "First home, family costs", pro: "Exceptions may waive penalty", con: "Income tax still due; growth lost" },
  { age: "40", tax: "Often high (peak earning)", growth: "Still meaningful", penalty: "~10% (pre-59½)", use: "Rarely ideal; major need only", pro: "Few — usually the worst window", con: "High bracket + penalty" },
  { age: "59½+ (retirement)", tax: "Managed by bracket planning", growth: "Fully captured", penalty: "None", use: "Retirement income, RMDs from 73", pro: "No penalty; maximum compounding", con: "No early access; RMDs eventually apply" },
];

/* --- P1: extra scenarios appended to the master planning table --- */
export const extraTaxScenarioRows: DataRow[] = [
  { scenario: "Medical school", age: "24", household: "$70k", childIncome: "$0", withdrawal: "$25,000", fedTax: "~$2,600 (10–12%)", stateTax: "$0–$1,300", penalty: "~$2,500", net: "~$18,600–19,900", strategy: "Prefer student loans/aid; small low-year draws only for the gap" },
  { scenario: "Child earning $25k", age: "23", household: "n/a", childIncome: "$25k", withdrawal: "$10,000", fedTax: "~$1,200 (12%)", stateTax: "$0–$500", penalty: "~$1,000", net: "~$7,300–7,800", strategy: "Low bracket — a partial Roth conversion may beat spending" },
  { scenario: "Child earning $75k", age: "27", household: "n/a", childIncome: "$75k", withdrawal: "$10,000", fedTax: "~$2,200 (22%)", stateTax: "$0–$700", penalty: "~$1,000", net: "~$6,100–6,800", strategy: "Bracket is climbing — avoid unless truly needed" },
  { scenario: "Child earning $150k", age: "30", household: "n/a", childIncome: "$150k", withdrawal: "$10,000", fedTax: "~$2,400 (24%)", stateTax: "$0–$900", penalty: "~$1,000", net: "~$5,700–6,600", strategy: "Peak-bracket — leave invested; fund a 401(k) instead" },
];

/* --- P4: mixed-status family row (appended to immigrant planning) --- */
export const mixedStatusRow: DataRow = {
  status: "Mixed-status family",
  advantages: "A U.S.-citizen child can hold the account even if a parent is on a visa or undocumented",
  risks: "Different filing statuses; some family members may lack an SSN",
  crossBorder: "Coordinate whose income and reporting the account touches",
  advice: "Whenever family members file under different rules",
};

/* --- P7: Roth conversion strategy scenarios (spoke page) --- */
export const rothScenarioCols: DataCol[] = [
  { key: "situation", label: "Conversion situation" },
  { key: "income", label: "That year's income" },
  { key: "amount", label: "Illustrative convert" },
  { key: "tax", label: "Illustrative tax", highlight: true },
  { key: "note", label: "Planning note" },
];
export const rothScenarioRows: DataRow[] = [
  { situation: "Convert all at once at 18 (no income)", income: "~$0", amount: "$20,000", tax: "Low — much absorbed by the standard deduction", note: "One big conversion can still spill into higher brackets — check the math" },
  { situation: "Convert over 3–5 low-income years", income: "Low each year", amount: "~$5,000/yr", tax: "Lowest total — fills the bottom brackets", note: "Usually the most tax-efficient path" },
  { situation: "Gap-year conversion", income: "~$0", amount: "$15,000", tax: "Near $0 if under the standard deduction", note: "A classic low-income window" },
  { situation: "Scholarship year (tuition covered)", income: "Low", amount: "$10,000", tax: "Very low", note: "No need to withdraw — convert instead of spending" },
  { situation: "Graduate school year", income: "Low–moderate", amount: "$10,000", tax: "Low (10–12%)", note: "Often a good multi-year conversion window" },
  { situation: "Convert in a high-income year", income: "$150k+", amount: "$20,000", tax: "High (24%+)", note: "Usually a poor time — defer if you can" },
  { situation: "Wait until retirement", income: "Managed", amount: "As needed", tax: "Controlled by bracket planning", note: "No penalty after 59½; but RMDs may force income first" },
];
export const rothPros: string[] = [
  "Future growth and qualified withdrawals become tax-free",
  "No required minimum distributions for the original Roth owner",
  "Locks in a low tax rate paid in a low-income year",
  "Simplifies later cross-border planning if moving abroad",
];
export const rothCons: string[] = [
  "Adds to taxable income in the conversion year",
  "Can reduce financial aid (FAFSA) for that year",
  "May trigger state income tax depending on the state",
  "Not reversible — plan the amount carefully",
];
export const rothChecklist: string[] = [
  "Confirm a Trump Account conversion is permitted under current rules",
  "Estimate the year's total income and marginal bracket first",
  "Convert only enough to fill the low bracket, not spill over",
  "Check FAFSA / financial-aid timing before converting",
  "Check your state's treatment of the conversion",
  "Keep records of the converted amount and any basis",
  "Review with a tax professional before filing",
];
export interface RothTimelineStep {
  name: string;
  text: string;
}
export const rothTimeline: RothTimelineStep[] = [
  { name: "Year the child turns 18", text: "Conversion generally first becomes possible; review whether this is a low-income year." },
  { name: "College / gap years (18–22)", text: "Often the lowest-income window — the sweet spot for partial conversions." },
  { name: "Early career (23–30)", text: "Bracket climbs; convert less or pause as income rises." },
  { name: "Peak earning (30–55)", text: "Usually a poor time to convert; let the account grow." },
  { name: "Pre-retirement (55–59½)", text: "A possible low-income window again if semi-retired." },
  { name: "Retirement (59½+)", text: "No early penalty; manage conversions and withdrawals by bracket, ahead of RMDs at 73." },
];
export const rothMistakes: string[] = [
  "Converting everything in one year and spiking the bracket",
  "Converting in a high-income year out of impatience",
  "Ignoring the FAFSA / financial-aid hit that year",
  "Forgetting state income tax on the conversion",
  "Not confirming a conversion is actually permitted first",
  "Converting money you'll need for cash before it can grow tax-free",
];

/* --- P10: structured, save-style checklists (pillar) --- */
export const checklistBefore18: string[] = [
  "Open early and automate contributions",
  "Invest the balance in the eligible index fund (don't leave cash)",
  "Save every statement, contribution, and basis record",
  "Start simple money lessons with the child",
  "Map the age-18 handoff before it arrives",
];
export const checklistTurning18: string[] = [
  "Confirm the calendar-year access rule for your child",
  "Confirm custodian access and login control",
  "Download full contribution and basis history",
  "Hold a short 'age-18 account meeting' before any withdrawal",
  "Decide: leave invested, convert, or use for a real need",
];
export const checklistBeforeWithdrawal: string[] = [
  "Add up federal tax on the taxable portion",
  "Add possible state tax",
  "Add the ~10% penalty if under 59½ (unless an exception applies)",
  "Subtract the future growth you give up",
  "Check whether a penalty exception fits your situation",
  "Consider spreading the withdrawal across tax years",
];
export const checklistBeforeRoth: string[] = [
  "Confirm conversion is permitted under current rules",
  "Estimate the year's marginal bracket first",
  "Convert only enough to fill the low bracket",
  "Check FAFSA and state-tax effects",
  "Keep conversion and basis records",
];
export const checklistBeforeOverseas: string[] = [
  "Confirm the provider allows foreign-address access + 2-factor",
  "Keep a U.S. bank link and mailing address if possible",
  "Download all statements before you leave",
  "Understand the destination country's tax on the account",
  "Line up a cross-border tax advisor",
];
export const checklistYearEnd: string[] = [
  "Confirm contributions stayed within the annual limit",
  "Save the year's statements and any tax forms",
  "Review whether it was a low-income conversion year",
  "Update beneficiary and contact information",
  "Re-check plans for any upcoming move abroad",
];

/* ================================================================== *
 * PHASE 2 DATASETS (trust, timeline, focused comparisons, mistakes,
 * quick answers, government resources)
 * ================================================================== */

/* --- P2: Official government resources (authoritative, not overloaded) --- */
export const governmentResourceLinks: { label: string; href: string }[] = [
  { label: "IRS — Trump Accounts guidance (newsroom)", href: trumpAccountSources.irsNewsroom },
  { label: "IRS Notice 2025-68 (initial guidance, PDF)", href: "https://www.irs.gov/pub/irs-drop/n-25-68.pdf" },
  { label: "U.S. Treasury", href: trumpAccountSources.treasury },
  { label: "Investor.gov (SEC investor education)", href: "https://www.investor.gov" },
  { label: "Congress.gov — CRS overview (R48910)", href: "https://www.congress.gov/crs-product/R48910" },
];

/* --- P3: verified program timeline --- */
export const trumpTimelineCols: DataCol[] = [
  { key: "date", label: "Date" },
  { key: "update", label: "Update", highlight: true },
  { key: "why", label: "Why it matters" },
];
export const trumpTimelineRows: DataRow[] = [
  {
    date: "Jul 4, 2025",
    update: "One Big Beautiful Bill Act signed into law, creating Trump Accounts",
    why: "Establishes the account as a type of traditional IRA for children",
  },
  {
    date: "2025",
    update: "IRS / Treasury issue initial guidance (Notice 2025-68)",
    why: "Clarifies the $1,000 pilot, contributions, eligible investments, and distributions",
  },
  {
    date: trumpAccountConfig.bornWindowLabel,
    update: `Birth window for the ${trumpAccountConfig.federalContribution} federal pilot contribution`,
    why: "Only U.S.-citizen children born in this window (with a valid SSN) qualify for the seed",
  },
  {
    date: trumpAccountConfig.contributionsBegan,
    update: "Contributions can first be made / accounts available for initial deposits",
    why: "Funding begins — no contributions are possible before this date",
  },
];

/* --- P6: life-stage horizontal timeline stops --- */
export const lifeStageStops: { icon: string; label: string; sub?: string }[] = [
  { icon: "👶", label: "Birth", sub: "Open + $1,000 seed if eligible" },
  { icon: "💰", label: "Contributions", sub: "Invest & compound" },
  { icon: "🎂", label: "Age 18", sub: "Access & control shift" },
  { icon: "🏦", label: "Traditional IRA", sub: "Standard IRA rules apply" },
  { icon: "🔄", label: "Roth review", sub: "Low-income conversion window" },
  { icon: "🌴", label: "Retirement", sub: "No penalty after 59½" },
];

/* --- P4: who may want to consider other options --- */
export const otherOptionsConsiderations: { title: string; body: string }[] = [
  {
    title: "Focused only on qualified education",
    body: "If the sole goal is paying qualified tuition, a 529 plan's tax-free education growth is usually more efficient than a tax-deferred Trump Account.",
  },
  {
    title: "Need unrestricted short-term access",
    body: "If you may need the money soon, a taxable brokerage or high-yield savings avoids the age-18 lock-up and the early-withdrawal penalty.",
  },
  {
    title: "Uncertain long-term U.S. residency",
    body: "If a move abroad is likely soon, weigh U.S. account access and cross-border tax before over-funding a long-hold account.",
  },
  {
    title: "Goals fit another account better",
    body: "If the child has earned income, a Roth IRA offers tax-free growth; for pure flexibility, a custodial brokerage may fit better.",
  },
];

/* --- P5: focused 1-to-1 comparison pairs --- */
const pairFeatures = ["Purpose", "Tax treatment", "Flexibility", "Withdrawal considerations", "Control", "Typical use case", "Who it may suit"];
function pair(other: { key: string; label: string }, trump: string[], otherVals: string[]): { columns: ComparisonColumn[]; rows: ComparisonRow[] } {
  return {
    columns: [
      { key: "trump", label: "Trump Account", highlight: true },
      { key: other.key, label: other.label },
    ],
    rows: pairFeatures.map((f, i) => ({ feature: f, values: { trump: trump[i], [other.key]: otherVals[i] } })),
  };
}
export const vs529Pair = pair(
  { key: "c529", label: "529 Plan" },
  [
    "Long-term, retirement-style wealth for a child",
    "Tax-deferred growth; taxed on withdrawal",
    "High — any goal, not tied to school",
    "Ordinary income + ~10% penalty before 59½",
    "Child at adulthood",
    "Early, flexible, long-hold investing",
    "Families wanting flexibility or unsure of college",
  ],
  [
    "Education savings (tuition, qualified costs)",
    "Tax-free growth for qualified education",
    "Low — education use to stay tax-free",
    "Tax + 10% penalty on non-education earnings",
    "Owner (often the parent) keeps control",
    "Funding a known U.S. college plan",
    "Families certain about qualified education",
  ],
);
export const vsRothPair = pair(
  { key: "roth", label: "Roth IRA (child)" },
  [
    "Tax-deferred child wealth without earned income",
    "Tax-deferred; taxed on withdrawal",
    "High — no earned-income requirement",
    "Ordinary income + ~10% penalty before 59½",
    "Child at adulthood",
    "Start compounding before the child works",
    "Kids with no earned income yet",
  ],
  [
    "Tax-free retirement growth",
    "Tax-free qualified growth and withdrawals",
    "Medium — retirement-focused",
    "Contributions out anytime; earnings rules apply",
    "The child (via custodian, then owner)",
    "A child with a real job / earned income",
    "Teens and young adults who earn income",
  ],
);
export const vsCustodialPair = pair(
  { key: "custodial", label: "Custodial (UTMA/UGMA)" },
  [
    "Long-term, retirement-style child wealth",
    "Tax-deferred growth",
    "High, but investments are restricted to index funds",
    "Ordinary income + ~10% penalty before 59½",
    "Child at adulthood",
    "Tax-advantaged long-hold compounding",
    "Families wanting tax deferral",
  ],
  [
    "Flexible gifting/investing for a minor",
    "Taxed yearly (kiddie-tax rules can apply)",
    "Highest — any investment, any purpose",
    "No penalty; taxed as it grows",
    "Child at adulthood (outright)",
    "Gifting assets to a minor for any goal",
    "Families wanting maximum flexibility",
  ],
);
export const vsBrokeragePair = pair(
  { key: "brokerage", label: "Taxable brokerage" },
  [
    "Long-term, retirement-style child wealth",
    "Tax-deferred until withdrawal",
    "High, with restricted index-fund choices",
    "Ordinary income + ~10% penalty before 59½",
    "Child at adulthood",
    "Tax-advantaged multi-decade compounding",
    "Families optimizing for tax deferral",
  ],
  [
    "General investing for any goal",
    "Taxed yearly on dividends and gains",
    "Highest — full access anytime",
    "No penalty; capital-gains rates may apply",
    "The account owner",
    "Flexible, penalty-free investing",
    "Families needing liquidity and control",
  ],
);

/* --- P7: top 15 planning mistakes (why / consequence / better) --- */
export interface MistakeCard {
  mistake: string;
  why: string;
  consequence: string;
  better: string;
}
export const planningMistakes15: MistakeCard[] = [
  { mistake: "Withdrawing everything at 18", why: "The money is suddenly accessible and feels like a windfall", consequence: "Ordinary income tax, a possible 10% penalty, and decades of lost growth", better: "Hold an age-18 meeting; leave it invested unless there's a real need" },
  { mistake: "Assuming withdrawals are tax-free", why: "People confuse it with a Roth or a 529", consequence: "An unexpected tax bill at filing time", better: "Treat the taxable portion as ordinary income and model it first" },
  { mistake: "Ignoring state taxes", why: "Focus stays on the federal number", consequence: "Thousands more owed in high-tax states like CA/NY", better: "Check your state's treatment before withdrawing or converting" },
  { mistake: "Not comparing with a 529", why: "The Trump Account is newer and top-of-mind", consequence: "Paying tax on a college bill a 529 could cover tax-free", better: "For qualified education, fund a 529 first; use Trump Account for the gap" },
  { mistake: "Missing low-income-year opportunities", why: "No one flags the college/gap year as a tax window", consequence: "Paying more tax later at a higher bracket", better: "Withdraw or convert in low-income years to fill low brackets" },
  { mistake: "Leaving cash uninvested", why: "Opening the account feels like the finish line", consequence: "Years of compounding lost to idle cash", better: "Invest the balance in the eligible index fund right away" },
  { mistake: "Ignoring long-term retirement value", why: "The focus is on near-term goals like college", consequence: "Cashing out an account that could fund retirement", better: "Weigh the 59½+ value before any early withdrawal" },
  { mistake: "Treating examples as universal rules", why: "Illustrations look like personalized math", consequence: "Decisions based on numbers that don't fit your facts", better: "Use examples as a framework; run your own numbers with an advisor" },
  { mistake: "Converting everything to Roth at once", why: "Eagerness to lock in tax-free growth", consequence: "Spilling out of low brackets into higher ones", better: "Spread small conversions across several low-income years" },
  { mistake: "Forgetting cross-border reporting", why: "Families assume a U.S. account is 'handled'", consequence: "Missed U.S./India filings and possible penalties", better: "Plan U.S. access and dual reporting before moving abroad" },
  { mistake: "Not tracking basis and contributions", why: "Records feel unnecessary early on", consequence: "Overpaying tax because after-tax basis can't be proven", better: "Save statements, contribution history, and basis records yearly" },
  { mistake: "Assuming the $1,000 applies to every child", why: "The seed gets more attention than its rules", consequence: "Expecting money the child never qualified for", better: "Confirm citizenship, valid SSN, and the 2025–2028 birth window" },
  { mistake: "Ignoring FAFSA / aid impact", why: "Tax and aid are considered separately", consequence: "A conversion or withdrawal shrinks financial aid that year", better: "Check aid timing before adding income in the college years" },
  { mistake: "Withdrawing in a peak-earning year", why: "A need arises when income happens to be high", consequence: "The highest possible tax plus the penalty", better: "Defer if possible, or spread the withdrawal across years" },
  { mistake: "Skipping professional advice when it's complex", why: "Advice feels like an avoidable cost", consequence: "Costly mistakes on conversions, moves, or expatriation", better: "Get cross-border advice before big or two-country decisions" },
];

/* --- P8: quick answers (pillar) --- */
export const pillarQuickAnswers: { q: string; a: string; href: string }[] = [
  {
    q: "Can my child withdraw at 18?",
    a: "Generally yes, from January 1 of the calendar year the child turns 18. But the taxable portion is ordinary income and a ~10% penalty may apply before 59½, so cashing out is usually the costliest choice.",
    href: "#age18",
  },
  {
    q: "Should I convert to a Roth?",
    a: "Often worth reviewing, but not automatic. A conversion adds to that year's income, so it's usually best in a low-income year and after checking aid and state tax. Confirm a conversion is permitted first.",
    href: "#roth",
  },
  {
    q: "Is it better than a 529?",
    a: "Neither is universally better. A 529 is more tax-efficient for qualified education; a Trump Account is more flexible for long-term, non-education goals. Many families use both and match the account to the goal.",
    href: "#compare",
  },
  {
    q: "Who pays the tax?",
    a: "The child, as the account owner. After age 18 the adult child reports withdrawals or conversions on their own return, at their own marginal rate. Parents don't get a deduction for contributing.",
    href: "#scenarios",
  },
  {
    q: "Can H-1B holders benefit?",
    a: "Yes — an H-1B parent can open and manage the account for an eligible U.S.-citizen child with a valid SSN. The parent's visa status isn't the test; the child's SSN and citizenship are.",
    href: "#status",
  },
  {
    q: "What if we return to India?",
    a: "The account stays open, but plan U.S. provider access and cross-border tax before leaving. A U.S.-citizen child keeps lifelong U.S. filing duties, and India may tax withdrawals once you're Indian residents.",
    href: "#india",
  },
];

/* --- P8: quick answers (spoke) --- */
export const spokeQuickAnswers: { q: string; a: string; href: string }[] = [
  {
    q: "When can my child first withdraw?",
    a: "Generally from January 1 of the calendar year the child turns 18 — tied to the year, not the birthday. So a December birthday can unlock access from January 1 of that same year.",
    href: "#trigger",
  },
  {
    q: "Are withdrawals taxed?",
    a: "Generally yes. As a traditional IRA, the taxable portion is ordinary income at the child's rate, and a ~10% penalty may apply before 59½ unless an exception applies. After-tax basis comes back tax-free.",
    href: "#tax",
  },
  {
    q: "Should I convert to a Roth at 18?",
    a: "Usually not all at once. Spreading small conversions across low-income years keeps each year in a low bracket. Confirm a conversion is permitted and check aid and state tax first.",
    href: "#roth-strategies",
  },
  {
    q: "Does this differ for immigrant families?",
    a: "The core rules are the same, but visa status, the child's SSN, and a possible move to India add layers. Plan U.S. access and cross-border reporting before any move abroad.",
    href: "#immigrant",
  },
];
