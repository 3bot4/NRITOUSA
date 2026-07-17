/**
 * Single source of truth for the "USA Government Benefits for Immigrants"
 * pillar (/usa-government-benefits-immigrants) and its household screener.
 *
 * ══════════════════════════════════════════════════════════════════════
 * RULES FOR EDITING THIS FILE — READ BEFORE YOU CHANGE ANYTHING
 * ══════════════════════════════════════════════════════════════════════
 * This is the highest-stakes YMYL topic on the site: it sits at the
 * intersection of immigration law, benefits law, and tax. A wrong sentence
 * here can push a family to skip food or medical care they are entitled to,
 * or to file something that damages a green card case. Accordingly:
 *
 * 1. NEVER hardcode a benefit figure, threshold, or date in a page body.
 *    Pull it from `benefitFacts` / `keyDates` below. Every entry carries a
 *    value, the applicable YEAR, the JURISDICTION, an official SOURCE URL,
 *    and a `lastVerified` ISO date.
 *
 * 2. NEVER publish an unverified figure. If a current-year number is not yet
 *    published by the agency, keep the prior year's number and label the year
 *    honestly. Do not interpolate, estimate, or carry a number forward.
 *
 * 3. NEVER state a single national income threshold for a program whose
 *    limits are set by the state (Medicaid, CHIP, TANF, LIHEAP, child care,
 *    unemployment). Say it is state-set and link the user to their state.
 *
 * 4. NEVER say "you qualify" / "you are eligible". Only agencies decide.
 *    Use "may qualify", "appears potentially eligible", "requires agency
 *    review". The screener returns likelihood tiers, never determinations.
 *
 * 5. NEVER conflate the three distinct legal tracks:
 *      (a) PUBLIC CHARGE       — an inadmissibility test at admission/AOS
 *      (b) I-864 REIMBURSEMENT — a sponsor's contract debt to an agency
 *      (c) PROGRAM ELIGIBILITY — whether the person can get the benefit
 *    They have different triggers, different actors, different consequences.
 *
 * 6. NEVER use fear-based framing. Do not tell anyone to avoid healthcare,
 *    food, or children's benefits. State the current rule and route
 *    uncertain facts to an immigration attorney or DOJ-accredited rep.
 *
 * 7. Household members are evaluated INDIVIDUALLY. A parent's temporary visa
 *    does not make a U.S.-citizen child ineligible. Never imply otherwise.
 *
 * 8. Link only to .gov / official program pages. Never to lead-gen sites.
 *
 * ── LEGAL LANDSCAPE AS VERIFIED ON 2026-07-16 (three moving pieces) ──────
 *  • PUBLIC CHARGE is mid-transition. The 2022 Final Rule (narrow: cash
 *    assistance for income maintenance + long-term institutionalization)
 *    governs through 2026-09-17. DHS final rule 2026-14539 (filed for public
 *    inspection 2026-07-16, publishing 2026-07-20) REMOVES 8 CFR 212.20–212.23
 *    effective 2026-09-18 and restores an undefined, discretionary totality-of-
 *    the-circumstances test. Critically, the rule states receipt of means-tested
 *    benefits BEFORE the effective date is judged under the 2022 Final Rule.
 *  • SNAP was narrowed by OBBB §10108 (P.L. 119-21), which rewrote
 *    7 U.S.C. 2015(f) effective 2025-07-04. 8 U.S.C. 1612(a) was NOT repealed,
 *    so BOTH statutes must be satisfied. (Cornell/US Code prelim still show the
 *    old 1612 text — that is not an error, 1612 genuinely was not amended.)
 *  • ACA/Medicaid were narrowed by OBBBA §§71109, 71301, 71302 on a staggered
 *    timeline: 2026-01-01 (sub-100% FPL PTC gone), 2026-10-01 (Medicaid),
 *    2027-01-01 (PTC limited to LPR/CHE/COFA).
 *
 * Re-verify every `lastVerified` date at least quarterly, and immediately
 * after any Federal Register action on public charge.
 */
import type { FaqItem } from "@/lib/seo";

/* ------------------------------------------------------------------ *
 * Verification stamp
 * ------------------------------------------------------------------ */

/** ISO date every rule on this page was last checked against its source. */
export const RULES_LAST_VERIFIED = "2026-07-16";
export const RULES_LAST_VERIFIED_HUMAN = "July 16, 2026";

/** Number of distinct official sources reviewed (E-E-A-T line). */
export const OFFICIAL_SOURCES_REVIEWED = 14;

export const GB_DISCLAIMER =
  "This page is educational information, not legal, immigration, tax, or benefits advice. It does not create an attorney-client relationship. Benefit agencies make all final eligibility decisions, and immigration consequences depend on individual facts. Rules, dollar figures, and dates change — several of the rules described here change during 2026 and 2027. Always confirm with the official agency or a qualified professional before you apply, decline, or disenroll from anything.";

export const GB_SCREENER_NOTE =
  "This tool provides an educational screening, not an official eligibility decision. Benefit agencies make final determinations. Immigration consequences can depend on individual facts.";

export const GB_PRIVACY_NOTE =
  "Everything you enter stays in your browser. Nothing is sent to a server, no account or email is required, and we never ask for your Social Security number, A-number, or any document number. Your answers are kept only for this browser session and are cleared when you choose Start over.";

/* ------------------------------------------------------------------ *
 * Official sources — .gov only. Deep-link from these.
 * ------------------------------------------------------------------ */
export interface SourceLink {
  label: string;
  href: string;
}

export const officialSourceLinks: SourceLink[] = [
  { label: "Benefits.gov — find benefits you may be eligible for", href: "https://www.benefits.gov/" },
  { label: "USA.gov — government benefits", href: "https://www.usa.gov/benefits" },
  { label: "USCIS — Public Charge Resources", href: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/public-charge" },
  { label: "USCIS Policy Manual Vol. 8, Part G — Public Charge", href: "https://www.uscis.gov/policy-manual/volume-8-part-g" },
  { label: "Federal Register — Public Charge Ground of Inadmissibility (final rule)", href: "https://www.federalregister.gov/public-inspection/2026-14539/public-charge-ground-of-inadmissibility" },
  { label: "HealthCare.gov — coverage for lawfully present immigrants", href: "https://www.healthcare.gov/immigrants/lawfully-present-immigrants/" },
  { label: "HealthCare.gov — immigration statuses that qualify", href: "https://www.healthcare.gov/immigrants/immigration-status/" },
  { label: "Medicaid.gov — noncitizen eligibility in Medicaid & CHIP", href: "https://www.medicaid.gov/medicaid/enrollment-strategies/downloads/overview-of-eligibility-for-non-citizens-in-medicaid-and-chip.pdf" },
  { label: "USDA FNS — SNAP noncitizen eligibility policy", href: "https://www.fns.usda.gov/snap/eligibility/citizen/non-citizen-policy" },
  { label: "USDA FNS — WIC and immigration participation", href: "https://www.fns.usda.gov/wic/impact-participation-alien-status" },
  { label: "SSA — benefits for noncitizens", href: "https://www.ssa.gov/faqs/en/questions/KA-02447.html" },
  { label: "SSA — SSI for noncitizens", href: "https://www.ssa.gov/ssi/spotlights/spot-non-citizens.htm" },
  { label: "IRS — Child Tax Credit", href: "https://www.irs.gov/credits-deductions/individuals/child-tax-credit" },
  { label: "StudentAid.gov — federal aid for non-U.S. citizens", href: "https://studentaid.gov/understand-aid/eligibility/requirements/non-us-citizens" },
  { label: "DOL — unemployment insurance by state", href: "https://www.dol.gov/general/topic/unemployment-insurance" },
  { label: "USCIS — Affidavit of Support (Form I-864)", href: "https://www.uscis.gov/i-864" },
  { label: "HHS LIHEAP — energy assistance", href: "https://www.acf.hhs.gov/ocs/programs/liheap" },
  { label: "HUD — Housing Choice Voucher program", href: "https://www.hud.gov/helping-americans/housing-choice-vouchers" },
  { label: "HRSA — find a community health center", href: "https://findahealthcenter.hrsa.gov/" },
  { label: "DOJ — find free/low-cost legal help (accredited reps)", href: "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers" },
];

/* ------------------------------------------------------------------ *
 * Verified facts. Every changeable number lives here.
 * ------------------------------------------------------------------ */
export interface VerifiedFact {
  /** Human label. */
  label: string;
  /** Display value. */
  value: string;
  /** Benefit or tax year the value applies to. NEVER omit. */
  year: string;
  /** Federal, or state-set. */
  jurisdiction: string;
  sourceName: string;
  sourceUrl: string;
  /** ISO date verified against the source. */
  lastVerified: string;
  note?: string;
}

export const benefitFacts: Record<string, VerifiedFact> = {
  ctcMax: {
    label: "Child Tax Credit — maximum per qualifying child",
    value: "$2,200",
    year: "Tax year 2025 (filed in 2026)",
    jurisdiction: "Federal",
    sourceName: "IRS — Child Tax Credit",
    sourceUrl: "https://www.irs.gov/credits-deductions/individuals/child-tax-credit",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Set at $2,200 for tax years beginning in 2025 and indexed for inflation after that. We show the tax year 2025 figure because it is the one the IRS has published as a final amount; confirm the tax year 2026 figure on the IRS page before relying on it.",
  },
  actcMax: {
    label: "Additional Child Tax Credit — maximum refundable per child",
    value: "$1,700",
    year: "Tax year 2025 (filed in 2026)",
    jurisdiction: "Federal",
    sourceName: "IRS — Schedule 8812 instructions",
    sourceUrl: "https://www.irs.gov/instructions/i1040s8",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The refundable portion — the part you can receive as a refund even if you owe no tax.",
  },
  eitcMax3Kids: {
    label: "Earned Income Tax Credit — maximum (three or more qualifying children)",
    value: "$8,231",
    year: "Tax year 2026",
    jurisdiction: "Federal",
    sourceName: "IRS — tax year 2026 inflation adjustments (Rev. Proc. 2025-32)",
    sourceUrl: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Up from $8,046 for tax year 2025. Maximums for other family sizes are in Rev. Proc. 2025-32.",
  },
  eitcMax3KidsPrior: {
    label: "Earned Income Tax Credit — maximum (three or more qualifying children)",
    value: "$8,046",
    year: "Tax year 2025",
    jurisdiction: "Federal",
    sourceName: "IRS — tax year 2026 inflation adjustments (Rev. Proc. 2025-32)",
    sourceUrl: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
    lastVerified: RULES_LAST_VERIFIED,
  },
  ssQuarters: {
    label: "Social Security — work credits needed for retirement benefits",
    value: "40 credits (about 10 years of work)",
    year: "Current rule",
    jurisdiction: "Federal",
    sourceName: "SSA — benefits for noncitizens",
    sourceUrl: "https://www.ssa.gov/faqs/en/questions/KA-02447.html",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Credits are earned through work on which Social Security tax was paid, under a Social Security number valid for work. You can earn a maximum of 4 credits per year.",
  },
  medicareResidency: {
    label: "Medicare — residency rule for green card holders without 40 quarters",
    value: "5 years of continuous U.S. residence as a permanent resident",
    year: "Current rule",
    jurisdiction: "Federal",
    sourceName: "Medicare.gov — eligibility",
    sourceUrl: "https://www.medicare.gov/basics/get-started-with-medicare",
    lastVerified: RULES_LAST_VERIFIED,
    note: "A green card holder aged 65+ with fewer than 40 quarters may still be able to enrol by paying a Part A premium if they have been a permanent resident with 5 years of continuous residence. Those with 40 quarters generally get premium-free Part A.",
  },
  fiveYearBar: {
    label: "Five-year bar — federal means-tested benefits for many qualified immigrants",
    value: "5 years after obtaining qualified immigration status",
    year: "Current rule",
    jurisdiction: "Federal (states may cover some groups sooner with state funds)",
    sourceName: "Medicaid.gov — noncitizen eligibility overview",
    sourceUrl: "https://www.medicaid.gov/medicaid/enrollment-strategies/downloads/overview-of-eligibility-for-non-citizens-in-medicaid-and-chip.pdf",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The bar does not apply to every program or every person. Children, people with 40 qualifying quarters, and military-connected families are common exceptions — and the exceptions differ program by program.",
  },
  snapQuarters: {
    label: "SNAP — work-history exception to the five-year bar",
    value: "40 qualifying quarters of covered work",
    year: "Current rule",
    jurisdiction: "Federal",
    sourceName: "8 U.S.C. §1612(a)(2)(B) — Office of the Law Revision Counsel",
    sourceUrl: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title8-section1612&num=0&edition=prelim",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Quarters worked by a spouse or parent can count in some cases. Quarters after 1996 in which the person received a federal means-tested benefit do not count.",
  },
  i864End: {
    label: "Form I-864 — when a sponsor's obligation ends",
    value: "Citizenship, 40 qualifying quarters, death, or loss of LPR status + departure",
    year: "Current rule",
    jurisdiction: "Federal",
    sourceName: "USCIS — Affidavit of Support",
    sourceUrl: "https://www.uscis.gov/green-card/green-card-processes-and-procedures/affidavit-of-support",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Divorce does NOT end the obligation. The sponsor's duty typically continues until the sponsored immigrant naturalises or is credited with 40 qualifying quarters (usually about 10 years of work).",
  },
};

/* ------------------------------------------------------------------ *
 * Federal poverty guidelines — the backbone of every income screen.
 *
 * HHS publishes these each January. They are the single most load-bearing
 * number set on this page, so they are verified digit-by-digit against ASPE
 * (each size = base + increment × (size − 1); the 8-person figure reconciles).
 * Update every January and re-check the increments, not just the base.
 * ------------------------------------------------------------------ */
export interface PovertyTable {
  /** 1-person annual guideline. */
  base: number;
  /** Added per additional person. */
  increment: number;
}

export const POVERTY_GUIDELINE_YEAR = "2026";

/** Keyed by region. "other" = the 48 contiguous states + DC. */
export const povertyGuidelines: Record<"other" | "AK" | "HI", PovertyTable> = {
  other: { base: 15960, increment: 5680 },
  AK: { base: 19950, increment: 7100 },
  HI: { base: 18360, increment: 6530 },
};

export const povertyGuidelinesFact: VerifiedFact = {
  label: "Federal poverty guideline — 1-person household, 48 contiguous states + DC",
  value: "$15,960 (add $5,680 per additional person)",
  year: "2026",
  jurisdiction: "Federal (Alaska and Hawaii have higher figures)",
  sourceName: "HHS ASPE — Poverty Guidelines",
  sourceUrl: "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
  lastVerified: RULES_LAST_VERIFIED,
  note: "Programs apply different percentages of this figure (for example 130% for SNAP, 138% for Medicaid expansion, 100–400% for the premium tax credit), and several use a different figure set for Alaska and Hawaii. The guideline is a starting point, not an eligibility test.",
};

/** Annual poverty guideline for a household size in a state. */
export function povertyGuideline(householdSize: number, state?: string): number {
  const key = state === "AK" || state === "HI" ? state : "other";
  const t = povertyGuidelines[key];
  const size = Math.max(1, Math.floor(householdSize || 1));
  return t.base + t.increment * (size - 1);
}

/** Household income as a percentage of the federal poverty guideline. */
export function fplPercent(income: number, householdSize: number, state?: string): number {
  const g = povertyGuideline(householdSize, state);
  if (g <= 0) return 0;
  return Math.round((income / g) * 100);
}

/* ------------------------------------------------------------------ *
 * Key dates — the three moving pieces. These drive on-page warnings.
 * ------------------------------------------------------------------ */
export interface KeyDate {
  id: string;
  date: string;
  dateIso: string;
  title: string;
  what: string;
  who: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  status: "in-effect" | "upcoming";
}

export const keyDates: KeyDate[] = [
  {
    id: "ptc-sub100",
    date: "January 1, 2026",
    dateIso: "2026-01-01",
    title: "Premium tax credit removed below 100% of the poverty level",
    what: "Congress repealed the rule that let lawfully present immigrants with income under 100% of the federal poverty level claim the premium tax credit when they were locked out of Medicaid because of immigration status. That pathway is gone for tax years beginning after December 31, 2025.",
    who: "Lawfully present immigrants with very low income — including green card holders inside the five-year bar.",
    sourceName: "OBBBA §71302 (P.L. 119-21)",
    sourceUrl: "https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm",
    lastVerified: RULES_LAST_VERIFIED,
    status: "in-effect",
  },
  {
    id: "medicaid-oct",
    date: "October 1, 2026",
    dateIso: "2026-10-01",
    title: "Federal Medicaid payment limited by immigration status",
    what: "Federal Medicaid funds may only be used for U.S. citizens and nationals, green card holders, Cuban/Haitian entrants, and COFA residents. The statute expressly preserves Emergency Medicaid and the state option covering lawfully residing children and pregnant women.",
    who: "Groups who are 'qualified immigrants' today but fall outside the new list — including refugees, asylees, people granted withholding, and parolees.",
    sourceName: "OBBBA §71109 (P.L. 119-21), adding 42 U.S.C. §1396b(v)(5)",
    sourceUrl: "https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm",
    lastVerified: RULES_LAST_VERIFIED,
    status: "upcoming",
  },
  {
    id: "public-charge-sept",
    date: "September 18, 2026",
    dateIso: "2026-09-18",
    title: "New public-charge framework takes effect",
    what: "DHS removes the 2022 rule's regulations (8 CFR 212.20–212.23). Officers return to a discretionary, case-by-case totality-of-the-circumstances test with no regulatory list limiting which means-tested benefits they may weigh. Benefits received BEFORE this date are still judged under the narrow 2022 standard.",
    who: "People applying for admission, or filing adjustment of status, on or after the effective date — and who are not in an exempt category.",
    sourceName: "DHS final rule, 91 FR (doc. 2026-14539)",
    sourceUrl: "https://www.federalregister.gov/public-inspection/2026-14539/public-charge-ground-of-inadmissibility",
    lastVerified: RULES_LAST_VERIFIED,
    status: "upcoming",
  },
  {
    id: "ptc-2027",
    date: "January 1, 2027",
    dateIso: "2027-01-01",
    title: "Premium tax credit limited to green card holders and two other groups",
    what: "For tax years beginning after December 31, 2026, only U.S. citizens/nationals and 'eligible aliens' — green card holders, Cuban/Haitian entrants, and COFA residents — can claim the premium tax credit. Work-visa and student-visa families can still buy a Marketplace plan, but at full price.",
    who: "H-1B, H-4, L-1, L-2, F-1, J-1, O-1, E and TPS households who rely on ACA subsidies.",
    sourceName: "OBBBA §71301 (P.L. 119-21), amending 26 U.S.C. §36B(e)",
    sourceUrl: "https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm",
    lastVerified: RULES_LAST_VERIFIED,
    status: "upcoming",
  },
];

/* ------------------------------------------------------------------ *
 * Public charge — the two regimes, stated precisely.
 * ------------------------------------------------------------------ */
export const publicCharge = {
  transitionDate: "September 18, 2026",
  transitionDateIso: "2026-09-18",
  ruleDocNumber: "2026-14539",
  ruleFiledDate: "July 16, 2026",
  rulePublicationDate: "July 20, 2026",
  ruleUrl: "https://www.federalregister.gov/public-inspection/2026-14539/public-charge-ground-of-inadmissibility",
  /** Statutory minimum factors — INA 212(a)(4)(B)(i). Unchanged by either rule. */
  statutoryFactors: [
    "Age",
    "Health",
    "Family status",
    "Assets, resources, and financial status",
    "Education and skills",
  ],
  /** What the 2022 rule counts — governs benefits received before the transition. */
  countedBefore: [
    "Supplemental Security Income (SSI)",
    "Cash assistance for income maintenance under Temporary Assistance for Needy Families (TANF)",
    "State, local, tribal, or territorial cash assistance for income maintenance (often called General Assistance)",
    "Long-term institutionalization at government expense",
  ],
  notCountedBefore: [
    "SNAP and other nutrition programs (WIC, school meals)",
    "Medicaid — other than for long-term institutionalization",
    "CHIP",
    "Housing benefits and rental assistance",
    "Energy assistance (LIHEAP)",
    "Marketplace premium tax credits and other tax credits",
    "Unemployment insurance and other earned benefits",
    "Emergency disaster relief, immunizations, and testing for communicable diseases",
    "School lunch, Head Start, child care assistance",
  ],
};

/* ------------------------------------------------------------------ *
 * Table types (mirror TrumpAccountUI's contracts)
 * ------------------------------------------------------------------ */
export interface DataCol {
  key: string;
  label: string;
  highlight?: boolean;
}
export type DataRow = Record<string, string>;

/* --- The status × program decision table (Phase 7) --- */
export const statusTableCols: DataCol[] = [
  { key: "status", label: "Immigration status" },
  { key: "aca", label: "Marketplace / ACA", highlight: true },
  { key: "medicaid", label: "Medicaid / CHIP", highlight: true },
  { key: "food", label: "SNAP / WIC / school meals" },
  { key: "ui", label: "Unemployment" },
  { key: "ssa", label: "Social Security / Medicare" },
  { key: "ssi", label: "SSI / TANF" },
  { key: "tax", label: "Tax credits" },
  { key: "aid", label: "Federal student aid" },
  { key: "pc", label: "Public-charge review" },
  { key: "exception", label: "Key exception" },
];

export const statusTableRows: DataRow[] = [
  {
    status: "U.S. citizen (born or naturalised)",
    aca: "Often eligible",
    medicaid: "Often eligible — state-dependent",
    food: "Often eligible",
    ui: "Work-history dependent",
    ssa: "Work-history dependent",
    ssi: "May be eligible",
    tax: "Often eligible",
    aid: "Often eligible",
    pc: "Does not apply",
    exception: "Citizens are not subject to public charge at all. Income and state rules still decide each program.",
  },
  {
    status: "Green card holder, 5+ years",
    aca: "Often eligible",
    medicaid: "May be eligible — state-dependent",
    food: "May be eligible",
    ui: "Work-history dependent",
    ssa: "Work-history dependent",
    ssi: "Professional review recommended",
    tax: "Often eligible",
    aid: "Often eligible",
    pc: "Applies at admission/AOS, not renewal",
    exception: "SSI has its own harder rule — 40 quarters is usually needed on top of the five years.",
  },
  {
    status: "Green card holder, under 5 years",
    aca: "Often eligible",
    medicaid: "Usually not eligible — state-dependent",
    food: "Usually not eligible",
    ui: "Work-history dependent",
    ssa: "Work-history dependent",
    ssi: "Usually not eligible",
    tax: "Often eligible",
    aid: "Often eligible",
    pc: "Applies at admission/AOS, not renewal",
    exception: "Children under 18 and people with 40 quarters or military service are common exceptions. Some states cover this group with state funds.",
  },
  {
    status: "H-1B / L-1 and dependents (H-4, L-2)",
    aca: "May be eligible — changes Jan 1, 2027",
    medicaid: "Usually not eligible",
    food: "Usually not eligible",
    ui: "State-dependent",
    ssa: "Work-history dependent",
    ssi: "Usually not eligible",
    tax: "May be eligible",
    aid: "Usually not eligible",
    pc: "Applies if adjusting status",
    exception: "Child may qualify. U.S.-citizen children are assessed on their own status, not the parents'.",
  },
  {
    status: "F-1 / J-1 students and dependents",
    aca: "May be eligible — changes Jan 1, 2027",
    medicaid: "Usually not eligible",
    food: "Usually not eligible",
    ui: "Usually not eligible",
    ssa: "Work-history dependent",
    ssi: "Usually not eligible",
    tax: "Professional review recommended",
    aid: "Usually not eligible",
    pc: "Applies if adjusting status",
    exception: "Nonresident-alien tax status changes which credits apply. School meals and WIC do not ask about status.",
  },
  {
    status: "Refugees and asylees",
    aca: "May be eligible — changes Jan 1, 2027",
    medicaid: "May be eligible — changes Oct 1, 2026",
    food: "Usually not eligible since July 4, 2025",
    ui: "Work-history dependent",
    ssa: "Work-history dependent",
    ssi: "May be eligible — time-limited",
    tax: "Often eligible",
    aid: "Often eligible",
    pc: "Exempt",
    exception: "Refugees and asylees are exempt from public charge. But SNAP eligibility by virtue of that status ended in 2025, and Medicaid changes Oct 1, 2026 — adjusting to a green card restores several programs.",
  },
  {
    status: "TPS, parole, other humanitarian categories",
    aca: "May be eligible — changes Jan 1, 2027",
    medicaid: "Professional review recommended",
    food: "Usually not eligible",
    ui: "State-dependent",
    ssa: "Work-history dependent",
    ssi: "Usually not eligible",
    tax: "May be eligible",
    aid: "State-dependent",
    pc: "Professional review recommended",
    exception: "This group is the most affected by the 2025–2027 changes and the most fact-specific. Get individual advice.",
  },
  {
    status: "Mixed-status family",
    aca: "Child may qualify",
    medicaid: "Child may qualify",
    food: "Child may qualify",
    ui: "Work-history dependent",
    ssa: "Work-history dependent",
    ssi: "Child may qualify",
    tax: "May be eligible",
    aid: "Child may qualify",
    pc: "Per person",
    exception: "Every member is assessed separately. One ineligible adult does not disqualify the household.",
  },
  {
    status: "U.S.-citizen child of visa-holder parents",
    aca: "Often eligible",
    medicaid: "Often eligible — state-dependent",
    food: "Often eligible",
    ui: "Not applicable",
    ssa: "Not applicable",
    ssi: "May be eligible",
    tax: "Often eligible",
    aid: "Often eligible",
    pc: "Does not apply to the child",
    exception: "The child is a citizen. Their eligibility does not depend on the parents' visas, and DHS generally does not count a family member's benefits against a parent's own case.",
  },
];

/* --- Programs the screener can evaluate --- */
export const programCatalogCols: DataCol[] = [
  { key: "program", label: "Program" },
  { key: "what", label: "What it is" },
  { key: "who", label: "Who runs it" },
  { key: "pc", label: "Public charge (before Sept 18, 2026)", highlight: true },
];

export const programCatalogRows: DataRow[] = [
  { program: "Marketplace / ACA + premium tax credit", what: "Subsidised private health insurance", who: "Federal + state exchanges", pc: "Not counted" },
  { program: "Medicaid", what: "Health coverage for low-income people", who: "Federal + state", pc: "Not counted (except long-term institutional care)" },
  { program: "CHIP", what: "Children's health coverage", who: "Federal + state", pc: "Not counted" },
  { program: "Emergency Medicaid", what: "Emergency treatment regardless of status", who: "Federal + state", pc: "Not counted" },
  { program: "Community health centers", what: "Sliding-scale clinics, no status test", who: "HRSA-funded", pc: "Not counted" },
  { program: "Medicare", what: "Health coverage at 65+ / disability", who: "Federal", pc: "Not counted — earned benefit" },
  { program: "SNAP", what: "Monthly food benefit", who: "Federal + state", pc: "Not counted" },
  { program: "WIC", what: "Food + nutrition for pregnancy and young children", who: "Federal + state", pc: "Not counted" },
  { program: "School meals", what: "Free/reduced breakfast and lunch", who: "Federal + school district", pc: "Not counted" },
  { program: "TANF", what: "Cash assistance for families", who: "Federal + state", pc: "COUNTED (cash aid)" },
  { program: "Child care assistance / Head Start", what: "Subsidised child care and early education", who: "Federal + state", pc: "Not counted" },
  { program: "Unemployment insurance", what: "Wage replacement after job loss", who: "State", pc: "Not counted — earned benefit" },
  { program: "Social Security retirement / SSDI / survivors", what: "Earned benefits from payroll taxes", who: "Federal", pc: "Not counted — earned benefit" },
  { program: "SSI", what: "Cash for aged/blind/disabled with low income", who: "Federal", pc: "COUNTED (cash aid)" },
  { program: "Workers' compensation", what: "Injury benefit paid via employer insurance", who: "State", pc: "Not counted — not a means-tested public benefit" },
  { program: "Paid family / medical leave", what: "State wage replacement for leave", who: "State (only some states)", pc: "Not counted — earned benefit" },
  { program: "Child Tax Credit / EITC / other credits", what: "Tax credits claimed on a return", who: "Federal (IRS)", pc: "Not counted — tax credits are not public assistance" },
  { program: "Federal student aid (FAFSA)", what: "Grants and loans for college", who: "Federal (ED)", pc: "Not counted" },
  { program: "Housing vouchers / public housing", what: "Rent assistance", who: "Federal + local housing agency", pc: "Not counted" },
  { program: "LIHEAP", what: "Help with energy bills", who: "Federal + state", pc: "Not counted" },
];

/* ------------------------------------------------------------------ *
 * FAQs — visibly rendered on the page (required for FAQPage schema).
 * ------------------------------------------------------------------ */
export const faqs: FaqItem[] = [
  {
    question: "Can green card holders receive government benefits?",
    answer:
      "Often yes, but not automatically and not every program on day one. Green card holders are 'qualified immigrants', which opens the door to most federal programs. Several of those programs then apply a five-year waiting period that starts when you got qualified status. Earned benefits like Social Security, Medicare, and unemployment work differently — they depend on your work record, not on a waiting period. Tax credits depend on your tax filing and Social Security number, not on a waiting period either.",
  },
  {
    question: "What is the five-year waiting period for green card holders?",
    answer:
      "It is a rule that makes many lawfully present immigrants wait five years after receiving qualified immigration status before they can get certain federal means-tested benefits, most notably Medicaid and SNAP. It does not apply to every program or every person. Children under 18, people credited with 40 qualifying quarters of work, and military-connected families are common exceptions, and the exceptions are different for each program. Some states also cover people during the waiting period using state money.",
  },
  {
    question: "Can H-1B visa holders receive government benefits?",
    answer:
      "Some, but not the means-tested federal programs. H-1B workers are lawfully present but are not 'qualified immigrants', so they are generally outside SNAP, Medicaid, TANF, and SSI. What they can often access are earned and tax-based benefits: Social Security and Medicare credits from the payroll taxes they pay, Marketplace health insurance, tax credits like the Child Tax Credit if they file with a valid Social Security number, and — in some circumstances and states — unemployment insurance. Emergency Medicaid, WIC, school meals, and community health centers also do not turn on being a qualified immigrant.",
  },
  {
    question: "Can an H-4 spouse qualify for benefits?",
    answer:
      "An H-4 spouse is lawfully present, so they can generally buy Marketplace coverage and be included on a family tax return. They are not a qualified immigrant, so SNAP, Medicaid, TANF, and SSI are generally unavailable. WIC, school meals, emergency care, and community health centers do not ask about qualified-immigrant status. If the H-4 spouse has an EAD and a work record, unemployment may be possible depending on the state and on whether they remain authorised to work.",
  },
  {
    question: "Can F-1 students receive government assistance?",
    answer:
      "Generally not from federal means-tested programs, and F-1 students are also not eligible for federal student aid through FAFSA. They can typically buy Marketplace coverage while lawfully present, though the premium tax credit is being limited to green card holders and two other groups for tax years beginning after December 31, 2026. Most F-1 students are nonresident aliens for tax purposes for a period of years, which changes which tax credits apply — that is worth checking with a tax professional.",
  },
  {
    question: "Can a U.S.-citizen child receive benefits if the parents are on visas?",
    answer:
      "Yes. A U.S.-citizen child is a U.S. citizen regardless of the parents' immigration status, and is assessed on their own eligibility. The child's household income and state still decide the outcome, but the parents' visas do not disqualify the child from Medicaid, CHIP, SNAP, WIC, or school meals. This is one of the most common and most costly misunderstandings in immigrant families.",
  },
  {
    question: "Do parents have to provide immigration information when applying only for a child?",
    answer:
      "Generally no. When you apply only for an eligible child, agencies ask for the immigration status of the person seeking benefits — not of family members who are not applying. Non-applicant parents are usually asked for identity and income information so the agency can size the household and verify income, but they are not required to supply their own immigration status to get a child enrolled. If a form appears to ask for more than that, ask the agency or a benefits counselor before you fill it in.",
  },
  {
    question: "Does Medicaid affect a green card application?",
    answer:
      "For benefits received before September 18, 2026, no — the 2022 rule counts only cash assistance for income maintenance and long-term institutionalization at government expense, and ordinary Medicaid is neither. From September 18, 2026, DHS removes that narrow list and officers may weigh means-tested benefits, including non-cash benefits, in a totality-of-the-circumstances assessment. The rule expressly says receipt before the effective date is judged under the old, narrower standard. Public charge also does not apply to everyone — renewals, naturalisation, and exempt categories are outside it.",
  },
  {
    question: "Does CHIP affect immigration status?",
    answer:
      "CHIP is not counted under the 2022 public-charge rule that governs benefits received before September 18, 2026. From that date the regulatory list disappears and officers have discretion, so there is no longer a published list guaranteeing CHIP is excluded. CHIP has never been a basis for deportation, and it is not counted at naturalisation. If you are planning an adjustment of status filing, this is a good question for an immigration attorney rather than a general web page.",
  },
  {
    question: "Does SNAP affect a green card?",
    answer:
      "Not for benefits received before September 18, 2026 — SNAP is expressly outside the 2022 rule's list. From that date, officers regain discretion to weigh means-tested benefits, and SNAP is a means-tested benefit. Two things soften this: receipt before the effective date is judged under the old standard, and public charge is a totality test in which no single benefit is decisive. Separately, most people who could receive SNAP as green card holders are past the point where public charge applies to them.",
  },
  {
    question: "Does WIC count under public charge?",
    answer:
      "WIC is not counted under the 2022 rule that governs receipt before September 18, 2026, and USDA has long stated that WIC participation does not make someone a public charge. WIC also does not require proof of immigration status. After the transition date there is no regulatory list, so nothing is formally guaranteed to be excluded — but WIC is a short-term nutrition program for pregnancy and young children, and the new rule specifically notes that officers consider that pregnancy is a temporary condition.",
  },
  {
    question: "Do free school meals affect immigration status?",
    answer:
      "School meals are not counted under the 2022 public-charge rule, and the National School Lunch and School Breakfast Programs do not test immigration status — they are available to enrolled children. Federal law preserves school meal access for anyone eligible for public education. There is no history of school meals being used against a family in an immigration case.",
  },
  {
    question: "Can H-1B workers claim unemployment?",
    answer:
      "It depends on the state, and the practical answer is often no. Unemployment is an earned, state-run benefit funded by employer taxes, and federal law requires that the work was performed while lawfully present and authorised. The obstacle is usually the other test: you must be able, available, and legally authorised to work now. An H-1B worker whose employment ends generally loses work authorisation unless they are in a grace period or have a pending change of status, which is why many states deny. Some states pay for the period while authorisation still exists. File with your state agency and let them decide rather than assuming.",
  },
  {
    question: "Can receiving unemployment affect visa status?",
    answer:
      "Unemployment insurance is an earned benefit funded by employer contributions, not a means-tested public assistance program, and it is not counted under the 2022 public-charge rule. It is also not a basis for deportation. The real risk for a visa holder is not the benefit — it is the underlying job loss, which affects status directly. Address the status question with an immigration attorney; do not let fear of the benefit drive the decision.",
  },
  {
    question: "Can green card holders receive unemployment?",
    answer:
      "Generally yes, if they meet the same tests as anyone else: enough recent covered wages, job loss through no fault of their own, and being able, available, and authorised to work. Permanent residents have ongoing work authorisation, so the authorisation obstacle that blocks many visa holders does not apply. There is no five-year bar for unemployment — it is an earned benefit, not a means-tested one.",
  },
  {
    question: "Can visa holders buy Marketplace insurance?",
    answer:
      "Yes. Lawfully present immigrants — including H-1B, H-4, L-1, L-2, F-1, J-1, O-1, E visa holders, TPS holders, and green card holders — can buy a Health Insurance Marketplace plan. Buying coverage is separate from qualifying for a subsidy, and the subsidy rules are changing: for tax years beginning after December 31, 2026, the premium tax credit is limited to green card holders, Cuban/Haitian entrants, and COFA residents.",
  },
  {
    question: "Can H-1B families receive an ACA subsidy?",
    answer:
      "For 2026, generally yes if household income is at least 100% of the federal poverty level and the other premium tax credit rules are met. Two changes matter. First, the pathway that allowed lawfully present immigrants under 100% of the poverty level to claim the credit was repealed for tax years beginning after December 31, 2025 — so very low income now means no credit rather than more help. Second, for tax years beginning after December 31, 2026, H-1B and H-4 holders are no longer 'eligible aliens' for the credit at all. They can still buy a plan, at full price.",
  },
  {
    question: "Can green card holders receive Medicare?",
    answer:
      "Yes, in the normal ways. At 65+ with 40 quarters of covered work, a green card holder generally gets premium-free Part A just like a citizen. With fewer than 40 quarters, a green card holder aged 65+ who has been a permanent resident with five years of continuous residence can generally enrol by paying a Part A premium. Medicare is an earned benefit and is not counted under the 2022 public-charge rule.",
  },
  {
    question: "How many work credits are needed for Social Security?",
    answer:
      "Forty credits — about ten years of work — for retirement benefits. You earn credits by working in jobs where Social Security tax is withheld, under a Social Security number valid for work, and you can earn at most four credits per year. Disability benefits can require fewer credits depending on your age when you become disabled. If you have worked in both the U.S. and another country, a totalisation agreement may let you combine coverage — though the U.S. and India do not currently have one in force.",
  },
  {
    question: "Can immigrants receive Social Security retirement benefits?",
    answer:
      "Yes, if they are lawfully present, have the required work credits, and meet the other rules. Social Security is an earned benefit: you paid in through payroll taxes and you draw out based on your record. It is not means-tested, has no five-year bar, and is not counted under the 2022 public-charge rule. Payments generally require lawful presence, and there are separate rules about receiving benefits while living outside the U.S.",
  },
  {
    question: "Can green card holders receive SSI?",
    answer:
      "It is much harder than most people expect, and SSI is the one program where the caution is real. SSI requires qualified-immigrant status, and a green card holder who entered on or after August 22, 1996 is generally not eligible for the first five years as a permanent resident — even with 40 quarters. Most permanent residents qualify only through 40 qualifying quarters (work by a spouse or parent can count for SSI) or through military service. SSI is also cash assistance, which means it is counted under the public-charge rule both before and after the September 2026 transition.",
  },
  {
    question: "Can immigrants claim the Child Tax Credit?",
    answer:
      "Often yes, if the tax rules are met. The child must have a Social Security number valid for employment — a child with an ITIN is not a qualifying child for this credit. Beginning with tax year 2025, the filer also needs a valid Social Security number; on a joint return, at least one spouse must have one and the other needs an SSN or ITIN. The maximum was $2,200 per qualifying child for tax year 2025, with up to $1,700 refundable. Tax credits are not public assistance and are not counted under the 2022 public-charge rule.",
  },
  {
    question: "Can ITIN holders claim the Earned Income Tax Credit?",
    answer:
      "No. The EITC requires a Social Security number valid for employment for the filer, the spouse on a joint return, and any qualifying children. An SSN issued only to receive a federally funded benefit, and one that does not authorise work, does not count. ITIN filers may still qualify for other tax benefits — such as the Child and Dependent Care Credit or education credits — so an ITIN household should not assume it gets nothing.",
  },
  {
    question: "Can green card holders complete FAFSA?",
    answer:
      "Yes. Permanent residents and conditional permanent residents are 'eligible noncitizens' for federal student aid and should file the FAFSA. So are people whose I-94 shows Refugee, Asylum Granted, or Parolee, and certain T-visa holders and battered-immigrant qualified aliens. There is no five-year bar for federal student aid.",
  },
  {
    question: "Can visa holders receive federal student aid?",
    answer:
      "Generally no. F-1, J-1, H-1B, H-4, L-1 and similar nonimmigrant statuses are not eligible-noncitizen categories, so they cannot get federal grants or loans. That does not close off college money: institutional scholarships, private scholarships, and some state aid have their own rules, and in-state tuition is set by state law — several states grant it based on where the student attended high school rather than on immigration status.",
  },
  {
    question: "Do government benefits affect citizenship applications?",
    answer:
      "Lawfully receiving a benefit you qualify for is not a bar to naturalisation, and there is no public-charge test at naturalisation. Two things do matter. Getting a benefit through fraud or misrepresentation goes to good moral character. And for men who lived in the U.S. between 18 and 26, Selective Service registration can come up. Public charge is a test for admission and adjustment of status — a different stage entirely.",
  },
  {
    question: "Does public charge apply when renewing a green card?",
    answer:
      "No. Renewing a green card with Form I-90 is a document replacement — you are already a permanent resident, and you are not applying for admission or adjustment of status, so there is no public-charge test. This is one of the most common sources of unnecessary fear. Where the question genuinely arises for existing permanent residents is returning from a long trip abroad, where a lengthy absence can raise whether you are seeking a new admission.",
  },
  {
    question: "Does public charge apply to naturalisation?",
    answer:
      "No. Public charge is a ground of inadmissibility applied when someone seeks admission to the U.S. or adjusts to permanent resident status. Naturalisation applies different tests — continuous residence, physical presence, good moral character, English and civics. Using benefits you were entitled to does not create a public-charge problem at the naturalisation stage.",
  },
  {
    question: "Are benefits received by children counted against parents?",
    answer:
      "Generally no. DHS states that officers are not directed to consider a family member's receipt of public benefits unless that family member is themselves applying for admission or adjustment and is subject to public charge. There is one indirect route worth understanding: the applicant's own income is a mandatory factor, so if the record shows that family members the applicant is legally obligated to support receive means-tested benefits because the applicant's income falls below a threshold, that fact can be weighed as part of the applicant's financial status. That is a judgment about the applicant's income — not a penalty for the child's benefit.",
  },
  {
    question: "What benefits are considered under the current public-charge rule?",
    answer:
      "It depends on when the benefit was received. For receipt before September 18, 2026, the 2022 rule governs and counts only cash assistance for income maintenance — SSI, TANF cash aid, and state or local General Assistance — plus long-term institutionalization at government expense. For receipt on or after September 18, 2026, DHS removes that list and does not replace it with a new one. Officers may weigh means-tested public benefits within the totality of the circumstances, and no single benefit is automatically decisive. Because there is no published list for the new framework, be sceptical of any site that gives you a confident 'counts / does not count' table for the post-September period.",
  },
  {
    question: "What benefits are generally not considered?",
    answer:
      "Under the 2022 rule governing receipt before September 18, 2026: SNAP and other nutrition programs, WIC, school meals, CHIP, Medicaid other than long-term institutional care, housing benefits, energy assistance, tax credits, unemployment and other earned benefits, emergency disaster relief, and immunizations or testing for communicable diseases. Earned benefits and tax credits are conceptually different from public assistance and have never been treated as public-charge negatives.",
  },
  {
    question: "Can an immigration sponsor be required to repay benefits?",
    answer:
      "Yes, and this is separate from public charge. A sponsor who signed Form I-864 makes a legally enforceable promise to the U.S. government. If the sponsored immigrant receives a federal means-tested public benefit, the agency that paid it can ask the sponsor to reimburse it and can sue if the sponsor refuses. The programs usually named are SNAP, non-emergency Medicaid, SSI, TANF, and CHIP. The obligation typically ends when the sponsored immigrant naturalises, is credited with 40 qualifying quarters, dies, or loses permanent residence and leaves. Divorce does not end it.",
  },
  {
    question: "What is the difference between public charge and sponsor repayment?",
    answer:
      "Different tests, different actors, different consequences. Public charge asks whether an intending immigrant is likely to become primarily dependent on the government, and it decides whether an application for admission or adjustment is approved — it is USCIS or a consular officer looking forward. I-864 reimbursement is contract enforcement: a benefit agency asking the sponsor for money already spent, looking backward. Public charge can block a green card. Sponsor reimbursement cannot — it creates a debt. A family can face one, both, or neither.",
  },
  {
    question: "Do state benefits have different immigration rules?",
    answer:
      "Yes, and this is where a national answer becomes useless. States can spend their own money on people federal rules exclude. Several states cover children, pregnant people, or adults regardless of immigration status or during the federal five-year bar; states run their own unemployment tests; only some states have paid family leave; and TANF, LIHEAP, and child care rules vary widely. Always check your state agency before concluding your family is excluded.",
  },
  {
    question: "Can undocumented household members apply for eligible citizen children?",
    answer:
      "Yes. A parent without status can apply on behalf of an eligible child, and agencies ask about the status of the person seeking benefits — the child — not of a non-applicant parent. The parent's information is used for identity and income verification. Many families forgo benefits their citizen children are entitled to because of this misunderstanding. If you are anxious about it, a DOJ-accredited representative or benefits counselor can walk through the specific form with you.",
  },
  {
    question: "What documents are usually needed?",
    answer:
      "Typically: proof of identity, proof of income (recent pay stubs, an award letter, or a tax return), proof of address, immigration documents for the people actually applying, Social Security numbers for applicants who have them, and household composition. You do not have to supply immigration documents for household members who are not applying. Gather these before you start — incomplete applications are the most common reason for delay.",
  },
  {
    question: "Will the benefit agency share information with immigration authorities?",
    answer:
      "Benefit agencies collect information to run their programs, and longstanding federal policy has limited the use of that information for immigration enforcement. But this is an area where policy has shifted and continues to be litigated, so the honest answer in 2026 is that this depends on the program, the state, and current federal policy, and we will not promise you a guarantee we cannot verify. If this is your main concern, talk to an immigration attorney or a DOJ-accredited representative about your specific facts before you apply — not to a website.",
  },
  {
    question: "What should I do if I am unsure about applying?",
    answer:
      "Do not simply skip a benefit your family needs out of general fear. Work out which specific question you have. If it is about eligibility, the benefit agency or a certified benefits counselor answers it. If it is about immigration consequences, an immigration attorney or DOJ-accredited representative answers it. If you have an adjustment of status filing coming up and are receiving means-tested benefits, that combination is genuinely worth paid advice before the September 18, 2026 transition.",
  },
  {
    question: "Where can I get free or low-cost immigration advice?",
    answer:
      "The Department of Justice publishes a list of free and low-cost legal service providers, and maintains the roster of accredited representatives — non-attorneys authorised to give immigration advice through recognised organisations. Legal aid organisations, law school clinics, and community organisations in areas with large immigrant populations often run free consultations. Avoid 'notarios' and consultants who are not attorneys or accredited representatives.",
  },
  {
    question: "How often are benefit rules updated?",
    answer:
      "Constantly, and 2026 is an unusually active year. Dollar figures change annually with inflation, poverty guidelines update every January, state rules change with state budgets, and three federal changes land between January 2026 and January 2027 alone. This page carries the date every rule was last verified against its official source. When a number matters to a decision, click through to the agency and confirm it.",
  },
  {
    question: "Does applying for a benefit for someone else put me at risk?",
    answer:
      "Applying on behalf of an eligible family member is not the same as receiving the benefit yourself. Public charge looks at the applicant's own circumstances, and DHS states it will generally not consider benefits received by the applicant's family members. There is one filing detail worth knowing: on Form I-485 you must exclude income received from means-tested public benefits when reporting household income. Including it can create a misrepresentation problem — a much more serious issue than the benefit itself. Read the form instructions carefully or have them reviewed.",
  },
  {
    question: "I am already enrolled in a benefit and have an adjustment of status filing coming up. What should I know?",
    answer:
      "This is the one scenario where the September 2026 transition creates a genuinely time-sensitive question. DHS says officers will not consider non-cash benefits received before the effective date. But it also says that where someone was approved or certified for benefits covering a period extending past the effective date, and there is no evidence they disenrolled or withdrew, the receipt occurring on or after the effective date can be considered. That is a specific interaction between your enrolment and your filing date, and it deserves individual legal advice — not a decision made from a web page, and not a panicked disenrollment from coverage your family needs.",
  },
];

/* ------------------------------------------------------------------ *
 * Documents checklist (used on-page + in the optional emailed checklist)
 * ------------------------------------------------------------------ */
export const documentsChecklist: string[] = [
  "Photo ID for each person applying",
  "Proof of income — recent pay stubs, benefit award letters, or last year's tax return",
  "Proof of address — a lease, utility bill, or official mail",
  "Immigration documents for the people who are applying only (not for non-applicant family members)",
  "Social Security numbers for applicants who have one — never for people who are not applying",
  "Birth certificates for children being enrolled",
  "Proof of pregnancy or a due date, for WIC and pregnancy-related coverage",
  "Job separation paperwork, if you are claiming unemployment",
];

/* ------------------------------------------------------------------ *
 * Denial next-steps
 * ------------------------------------------------------------------ */
export const denialSteps: string[] = [
  "Read the notice for the actual reason — most denials are about missing paperwork or an income calculation, not immigration status.",
  "Note the appeal deadline. It is often short (frequently 30–90 days) and it is set by your state, not by federal law.",
  "Ask for the decision in writing if you were told 'no' verbally. A verbal 'you don't qualify' is not a determination.",
  "Check whether the denial was for the household or only for one member — an ineligible adult does not make an eligible child ineligible.",
  "Ask a certified benefits counselor or legal aid office to review it. This help is usually free.",
  "Request a fair hearing if you believe the rule was misapplied. Filing an appeal is not an immigration act and is not counted under public charge.",
];
