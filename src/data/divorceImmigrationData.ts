/**
 * Single source of truth for "Divorce and Your US Immigration Status"
 * (/divorce-immigration-status) and its alimony / maintenance estimator.
 *
 * ══════════════════════════════════════════════════════════════════════
 * RULES FOR EDITING THIS FILE — READ BEFORE YOU CHANGE ANYTHING
 * ══════════════════════════════════════════════════════════════════════
 * This page sits at the intersection of US immigration law, US family law and
 * Indian matrimonial law, and it is read by people making an irreversible
 * decision under time pressure. A wrong sentence here can cost someone their
 * status. Accordingly:
 *
 * 1. NEVER state a deadline, fee, threshold or cap inline in the page body.
 *    Pull it from `divorceFacts` below. Every entry carries a value, the
 *    applicable YEAR, the JURISDICTION, an official SOURCE URL and a
 *    `lastVerified` ISO date.
 *
 * 2. NEVER make a categorical legal claim where the underlying law is
 *    fact-specific. Immigration consequences of a divorce turn on the facts,
 *    the filing history and the adjudicator. Say what CAN happen, name the
 *    planning risk, and route the reader to counsel. In particular:
 *      - Do NOT assert an exact moment at which a derivative status ends.
 *        No current primary source establishes a universal timestamp.
 *      - Do NOT say a person "begins accruing unlawful presence" the instant
 *        a decree is entered. Unlawful presence, status violation and
 *        unauthorized employment are three distinct concepts with distinct
 *        triggers, and the re-entry bars turn on DEPARTURE.
 *      - Do NOT assert that an EAD ceases to be effective at a named instant.
 *        Say the printed date should not be relied on once the underlying
 *        status is in question, and route to counsel.
 *    See `H4_TIMING_AMBIGUITY`, which carries this framing and must not be
 *    flattened back into a slogan.
 *
 * 3. NEVER conflate the three separate money obligations:
 *      (a) SPOUSAL SUPPORT / ALIMONY — a state family-court order
 *      (b) FORM I-864 SUPPORT        — a federal undertaking enforceable by
 *                                      the sponsored immigrant, which a
 *                                      divorce does not itself terminate
 *      (c) CHILD SUPPORT             — separate again, and not modelled here
 *    They run alongside each other. Settling one does not settle the others.
 *
 * 4. VAWA HAS A HARD PREREQUISITE: the abusive spouse must be a US CITIZEN or
 *    LAWFUL PERMANENT RESIDENT. An abused H-4 spouse of an H-1B holder is NOT
 *    eligible for a VAWA self-petition, because the H-1B principal is neither.
 *    This is the most commonly repeated error in NRI-facing divorce content
 *    and it sends the most vulnerable readers down a path that cannot work.
 *    Any edit that offers VAWA to an H-4 spouse without naming that
 *    prerequisite is a bug. U and T nonimmigrant status are the classifications
 *    that do not depend on the abuser's immigration status — but they have
 *    their OWN eligibility requirements, and a divorce alone does not create
 *    eligibility for either. Never imply that it does.
 *
 * 5. NEVER present a guideline alimony figure as an award or a prediction.
 *    Every US jurisdiction decides on statutory factors; the estimator
 *    reproduces an illustrative benchmark that negotiations often start from.
 *    India has no statutory formula at all.
 *
 * 6. American spelling in all visible copy — site-wide convention, asserted by
 *    a regex in the page test, so British -isation/-ise forms fail the build.
 *
 * 7. NO ATTORNEY REVIEW is claimed anywhere on this page, because none has
 *    taken place. `RULES_LAST_VERIFIED` means the cited SOURCES were checked
 *    on that date — it is source verification, not legal review. Do not add a
 *    reviewer credential that does not exist.
 *
 * 8. Immigration and family law are practice areas this site does not hold
 *    itself out as licensed in. Every route ends at "consult an attorney",
 *    and the financial/tax framing is the only place the site speaks with its
 *    own authority.
 */
import type { FaqItem } from "@/lib/seo";

/**
 * ISO date the cited SOURCES were last checked. This is source verification,
 * not legal review — see editing rule 7. Nothing on this page has been
 * reviewed by an attorney.
 */
export const RULES_LAST_VERIFIED = "2026-08-16";
export const RULES_LAST_VERIFIED_HUMAN = "August 16, 2026";
/** Count of primary sources reviewed for this page (statutes, USCIS, courts). */
export const OFFICIAL_SOURCES_REVIEWED = 18;

/** Shown wherever the page might otherwise be mistaken for legal advice. */
export const SHORT_DISCLAIMER =
  "Educational information only — not legal advice. Immigration and family-law outcomes depend on your specific facts.";

/* ------------------------------------------------------------------ *
 * Verified figures. Nothing numeric goes on the page except from here.
 * ------------------------------------------------------------------ */
export interface VerifiedFact {
  label: string;
  value: string;
  /** Year, effective date, or statutory cite the value applies to. NEVER omit. */
  year: string;
  jurisdiction: string;
  sourceName: string;
  sourceUrl: string;
  /** ISO date the source was checked. */
  lastVerified: string;
  note?: string;
}

export const divorceFacts: Record<string, VerifiedFact> = {
  unlawfulPresence3Year: {
    label: "Unlawful presence — three-year re-entry bar",
    value: "More than 180 days but less than 1 year, followed by departure",
    year: "INA § 212(a)(9)(B)(i)(I)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 8, Part O",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-8-part-o",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Four different things are often confused here. Unlawful presence is a period counted under the statute; a status violation is a separate concept; unauthorized employment is a third; and the re-entry bar itself is triggered by DEPARTURE from the United States after the relevant period has accrued. How the period is counted in a particular case depends on the facts and on any application that is pending, which is why this is a question for counsel rather than a countdown you can run yourself.",
  },
  unlawfulPresence10Year: {
    label: "Unlawful presence — ten-year re-entry bar",
    value: "1 year or more, followed by departure",
    year: "INA § 212(a)(9)(B)(i)(II)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 8, Part O",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-8-part-o",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Also turns on departure. Waivers exist (Form I-601 / I-601A) but require a qualifying relative and a hardship showing, and they are discretionary.",
  },
  i864Threshold: {
    label: "Form I-864 support undertaking",
    value: "125% of the federal poverty guidelines",
    year: "INA § 213A; 8 CFR § 213a.2",
    jurisdiction: "Federal",
    sourceName: "USCIS — Affidavit of Support",
    sourceUrl: "https://www.uscis.gov/i-864",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Measured against the sponsored immigrant's own household. The dollar figure depends on household size and on which poverty-guideline set applies — see the poverty-guideline fact below.",
  },
  povertyGuidelines2026: {
    label: "2026 HHS Poverty Guidelines — 48 contiguous states and D.C.",
    value: "$15,960 for a 1-person household, plus $5,680 per additional person",
    year: "2026",
    jurisdiction: "Federal — 48 contiguous states and D.C. only",
    sourceName: "HHS ASPE — Poverty Guidelines",
    sourceUrl: "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Alaska and Hawaii use different poverty guidelines, and USCIS publishes its own I-864P table applying these figures at 125%. On the 48-state figures, 125% works out to about $19,950 a year for a household of one and about $27,050 for a household of two. Check the current I-864P before relying on any number.",
  },
  i864Quarters: {
    label: "Form I-864 — work-quarters termination condition",
    value: "40 qualifying quarters of coverage (roughly 10 years of work)",
    year: "INA § 213A(a)(3)(B); 8 CFR § 213a.2(e)(2)(i)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 8, Part G, Ch. 6",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-8-part-g-chapter-6",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Quarters worked by a spouse during the marriage can in some circumstances be credited to the immigrant, which is one reason the undertaking sometimes ends sooner than a sponsor expects.",
  },
  i864Termination: {
    label: "Form I-864 — the statutory termination conditions",
    value: "Five conditions, and divorce is not among them",
    year: "8 CFR § 213a.2(e)(2)",
    jurisdiction: "Federal",
    sourceName: "eCFR — 8 CFR § 213a.2",
    sourceUrl:
      "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-213a/section-213a.2",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Termination of the undertaking does not relieve a sponsor of a reimbursement obligation that accrued before it terminated. Whether and how a sponsored immigrant can enforce the undertaking after a divorce is litigated in state and federal courts and outcomes have varied, so this is a question for a lawyer rather than a rule you can apply from a page.",
  },
  naturalizationFiveYear: {
    label: "Naturalization — standard residence requirement",
    value: "5 years as a permanent resident",
    year: "INA § 316(a)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 12, Part D",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-12-part-d",
    lastVerified: RULES_LAST_VERIFIED,
    note: "An application may generally be filed up to 90 days before the residence requirement is met. Other requirements — continuous residence, physical presence, good moral character — apply separately.",
  },
  naturalizationThreeYear: {
    label: "Naturalization — spouse-of-citizen route",
    value: "3 years, living in marital union throughout",
    year: "INA § 319(a)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 12, Part G",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-12-part-g",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Requires living in marital union with the same US-citizen spouse for the three years before filing, and USCIS guidance requires the marital union to continue through the time of naturalization. A divorce generally ends access to this route; legal separation raises the same question and should be discussed with counsel.",
  },
  conditionalResidence: {
    label: "Conditional permanent residence",
    value: "2 years, where the marriage was under 2 years old when status was granted",
    year: "INA § 216",
    jurisdiction: "Federal",
    sourceName: "USCIS — Removing Conditions on Permanent Residence",
    sourceUrl:
      "https://www.uscis.gov/green-card/after-we-grant-your-green-card/conditional-permanent-residence/removing-conditions-on-permanent-residence-based-on-marriage",
    lastVerified: RULES_LAST_VERIFIED,
  },
  i751JointWindow: {
    label: "Form I-751 — joint filing window",
    value: "The 90 days before the conditional card expires",
    year: "8 CFR § 216.4",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 6, Part I, Ch. 4",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-6-part-i-chapter-4",
    lastVerified: RULES_LAST_VERIFIED,
    note: "This 90-day window governs JOINT petitions. A request to waive the joint-filing requirement is not confined to it — see the waiver fact below.",
  },
  i751WaiverWindow: {
    label: "Form I-751 — waiver request filing window",
    value: "Before, during or after the 90-day period",
    year: "USCIS Policy Manual, Vol. 6, Part I, Ch. 5",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual — Waiver of Joint Filing Requirement",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-6-part-i-chapter-5",
    lastVerified: RULES_LAST_VERIFIED,
    note: "USCIS guidance states that a conditional resident may file a waiver request once a waiver ground applies and need not wait for the 90-day period to open. Where a divorce is still pending, USCIS may issue a Request for Evidence for the final decree, and the marriage may terminate during the response period.",
  },
  vawaPrerequisite: {
    label: "VAWA self-petition — status of the abusive spouse",
    value: "Must be a US citizen or lawful permanent resident",
    year: "INA § 204(a)(1)(A)(iii) / (B)(ii)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 3, Part D, Ch. 2",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-3-part-d-chapter-2",
    lastVerified: RULES_LAST_VERIFIED,
    note: "This is the eligibility requirement most often reported wrongly in NRI-facing content. An abused H-4 spouse of an H-1B holder cannot self-petition under VAWA, because the H-1B principal is neither a citizen nor a permanent resident. U and T nonimmigrant status do not depend on the abuser's immigration status, but they carry their own separate eligibility requirements.",
  },
  vawaAfterDivorce: {
    label: "VAWA self-petition after the marriage has ended",
    value: "Generally within 2 years of the termination of the marriage",
    year: "INA § 204(a)(1)(A)(iii)(II)(aa)(CC)",
    jurisdiction: "Federal",
    sourceName: "USCIS — Abused Spouses, Children and Parents",
    sourceUrl: "https://www.uscis.gov/humanitarian/abused-spouses-children-and-parents",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The self-petitioner must also show a connection between the battery or extreme cruelty and the termination of the marriage, alongside the other eligibility requirements.",
  },
  gracePeriod60: {
    label: "The 60-day provision — what the regulation addresses",
    value: "Cessation of employment of certain nonimmigrant workers and their dependents",
    year: "8 CFR § 214.1(l)(2)",
    jurisdiction: "Federal",
    sourceName: "eCFR — 8 CFR § 214.1",
    sourceUrl: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.1",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The regulation covers an individual in E-1, E-2, E-3, H-1B, H-1B1, L-1, O-1 or TN classification 'and his or her dependents', for up to 60 consecutive days once during each authorized validity period — but the trigger it names is CESSATION OF THE EMPLOYMENT on which the classification was based. It does not expressly create a 60-day period for a dependent whose qualifying marriage has ended, so it should not be assumed to apply after a divorce. DHS may also shorten or eliminate the period as a matter of discretion, and it does not by itself authorize work.",
  },
  nyIncomeCap: {
    label: "New York maintenance income cap",
    value: "$241,000",
    year: "Effective March 1, 2026 (raised from $228,000)",
    jurisdiction: "New York State",
    sourceName: "NY Courts — Matrimonial Legislation & Court Rules",
    sourceUrl:
      "https://www.nycourts.gov/divorce/whats-new-matrimonial-legislation-court-rules-and-forms",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Adjusted every two years for CPI-U. The guideline formula reaches the payor's income up to the cap; a court may award additional maintenance on income above it after weighing the statutory factors.",
  },
  txCap: {
    label: "Texas spousal maintenance cap",
    value: "The lesser of $5,000/month or 20% of average monthly gross income",
    year: "Tex. Fam. Code § 8.055",
    jurisdiction: "Texas",
    sourceName: "Texas Family Code, Chapter 8",
    sourceUrl: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.8.htm",
    lastVerified: RULES_LAST_VERIFIED,
  },
  txEligibility: {
    label: "Texas spousal maintenance — eligibility requirements",
    value: "Married 10 years or longer, or a § 8.051 exception",
    year: "Tex. Fam. Code § 8.051",
    jurisdiction: "Texas",
    sourceName: "Texas Family Code, Chapter 8",
    sourceUrl: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.8.htm",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The spouse seeking maintenance must also lack sufficient property, including separate property, to provide for their minimum reasonable needs. The statutory alternatives to the 10-year requirement include family violence within two years of filing and a disability of the spouse or of a child in their care. Where neither the duration requirement nor an exception is met, a Texas court's authority to order maintenance is limited.",
  },
  alimonyTaxTreatment: {
    label: "Federal tax treatment of alimony",
    value: "Not deductible by the payer, not taxable to the recipient",
    year: "Divorce or separation agreements executed after December 31, 2018",
    jurisdiction: "Federal",
    sourceName: "IRS Topic No. 452 — Alimony and Separate Maintenance",
    sourceUrl: "https://www.irs.gov/taxtopics/tc452",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The Tax Cuts and Jobs Act changed the prior treatment. Agreements executed on or before December 31, 2018 generally keep the old rules unless later modified to adopt the new ones — which is why settlement figures from older cases are not directly comparable to current ones.",
  },
  usdInr: {
    label: "USD → INR reference rate",
    value: "₹96.27",
    year: "Snapshot of July 19, 2026",
    jurisdiction: "Market data — illustrative only",
    sourceName: "Federal Reserve H.10 — Foreign Exchange Rates",
    sourceUrl: "https://www.federalreserve.gov/releases/h10/current/",
    lastVerified: "2026-07-19",
    note: "The estimator's India column scales directly with this rate, so it is an editable input rather than a buried constant. Check a current rate before relying on any cross-currency comparison; the Federal Reserve publishes India rupee rates in its H.10 release.",
  },
};

/** Default FX rate the estimator opens with. Kept in sync with the fact above. */
export const DEFAULT_USD_INR = 96.27;

/* ------------------------------------------------------------------ *
 * The careful statement of H-4 timing. Referenced by name in editing rule 2 —
 * do not flatten this back into a slogan.
 * ------------------------------------------------------------------ */
export const H4_TIMING_AMBIGUITY =
  "A final divorce can end the qualifying relationship underlying H-4 status. What no current primary source establishes is a universal moment at which that happens, so treat this as a planning question rather than a countdown. Do not assume that the expiration date printed on your I-94 or EAD, or the 60-day provision written for workers who lose a job, protects you after the divorce. Because the exact consequences depend on the facts of the case, speak with an immigration attorney and consider any alternative status or filing options while you are still eligible to pursue them.";

/* ------------------------------------------------------------------ *
 * Table primitives (shared shape with the Trump Account / benefits tables)
 * ------------------------------------------------------------------ */
export interface DataCol {
  key: string;
  label: string;
  highlight?: boolean;
}
export type DataRow = Record<string, string>;

/* --- The quick-answer matrix: what divorce generally changes --- */
export const statusImpactCols: DataCol[] = [
  { key: "status", label: "Your status" },
  { key: "effect", label: "General effect of divorce", highlight: true },
  { key: "urgency", label: "Urgency" },
  { key: "next", label: "Next step to consider" },
];

export const statusImpactRows: DataRow[] = [
  {
    status: "H-4 dependent",
    effect:
      "H-4 is derivative of the marriage, so a final divorce can end the relationship it rests on. Do not rely on the date printed on an I-94 or EAD.",
    urgency: "High",
    next: "Speak to an immigration attorney and explore a change of status or another filing option while still eligible.",
  },
  {
    status: "H-1B principal",
    effect:
      "Your own H-1B rests on your employer and petition rather than the marriage, so it is generally unaffected. Your spouse's H-4 is affected; a child's H-4 rests on the parent-child relationship.",
    urgency: "Low for you",
    next: "If you signed a Form I-864 for your spouse, review that undertaking — it is not resolved by the divorce itself.",
  },
  {
    status: "Conditional (2-year) green card",
    effect:
      "You generally keep the status and file Form I-751 requesting a waiver of the joint-filing requirement. The central question is whether the marriage was entered into in good faith.",
    urgency: "High",
    next: "Begin assembling good-faith evidence early; it takes months to gather and access to joint records can be lost.",
  },
  {
    status: "10-year green card",
    effect:
      "Permanent residence is held in your own right. A divorce is not itself a ground of removability and does not change card renewal.",
    urgency: "Low",
    next: "Note that the shortened spouse-of-citizen naturalization route generally becomes unavailable.",
  },
  {
    status: "Pending marriage-based I-130 / I-485",
    effect:
      "Ending the qualifying marriage can eliminate the basis for the petition and the adjustment application. Exceptions and alternative pathways may apply depending on the circumstances.",
    urgency: "High",
    next: "Take immigration advice before anyone files for divorce — the sequence of events can change the options available.",
  },
  {
    status: "F-2, L-2, O-3 and other dependents",
    effect:
      "These are derivative in the same way as H-4, and dependent work authorization is tied to the underlying status where it exists.",
    urgency: "High",
    next: "Treat the planning the same way as H-4, and confirm the specific rules for your classification with counsel.",
  },
  {
    status: "Naturalized US citizen",
    effect:
      "Citizenship is held in your own right and does not depend on the marriage continuing.",
    urgency: "None",
    next: "No immigration filing is prompted by the divorce itself.",
  },
];

/* --- What an H-4 spouse can consider filing --- */
export const h4OptionsCols: DataCol[] = [
  { key: "option", label: "Option" },
  { key: "works", label: "Work authorization?", highlight: true },
  { key: "lead", label: "Lead time to plan for" },
  { key: "reality", label: "What it involves" },
];

export const h4OptionsRows: DataRow[] = [
  {
    option: "Change of status to B-2 (visitor)",
    works: "No",
    lead: "Days to weeks — the fastest package to assemble",
    reality:
      "A common stopgap. It can buy time to wind up a household, sell a car or finish a school term. It is not a work status and does not lead to one, so it functions as a bridge rather than a plan.",
  },
  {
    option: "Change of status to F-1 (student)",
    works: "Limited (on-campus, then CPT/OPT if eligible)",
    lead: "Months — an admission and an I-20 are needed before filing",
    reality:
      "A realistic option where retraining was already under consideration. It cannot usually be arranged in a week, which is why it is worth starting while the marriage is still legally intact.",
  },
  {
    option: "Change of status to H-1B",
    works: "Yes, if approved",
    lead: "Depends on an employer and cap position",
    reality:
      "Often the strongest outcome where it is available, though it is rarely available on a divorce timeline. It generally requires a selected registration or a cap-exempt employer.",
  },
  {
    option: "Employment-based petition in another category",
    works: "Varies by classification",
    lead: "Months",
    reality:
      "O-1, an L-1 transfer through an employer, or an EB-2 national-interest waiver where the profile genuinely supports one. Worth a conversation with counsel if your professional record is strong.",
  },
  {
    option: "U or T nonimmigrant status (crime and trafficking victims)",
    works: "Yes, if status and work authorization are granted",
    lead: "Years, including a wait against the annual U visa cap",
    reality:
      "These classifications do not require the abuser to be a US citizen or permanent resident, which is why they can be relevant where VAWA is not. They have their own requirements — a qualifying crime, and for U status, helpfulness to law enforcement and usually a certification. A divorce alone does not create eligibility.",
  },
  {
    option: "VAWA self-petition",
    works: "Yes, if the self-petition is approved and work authorization is granted",
    lead: "Months to years, and it can proceed without the spouse's participation",
    reality:
      "Available only where the abusive spouse is a US citizen or lawful permanent resident. That requirement is statutory, so it is not available against an H-1B holder.",
  },
];

/* --- The three I-751 waiver grounds, side by side --- */
export const i751WaiverCols: DataCol[] = [
  { key: "ground", label: "I-751 waiver" },
  { key: "divorce", label: "Divorce required?", highlight: true },
  { key: "issue", label: "Main issue" },
  { key: "notes", label: "Notes" },
];

export const i751WaiverRows: DataRow[] = [
  {
    ground: "Good-faith marriage terminated by divorce or annulment",
    divorce: "Generally yes",
    issue: "That the marriage was entered into in good faith",
    notes:
      "The question is the intent at the outset, not how long the marriage lasted or who was at fault. A waiver request may generally be filed before a decree is final, with USCIS requesting the decree later.",
  },
  {
    ground: "Battery or extreme cruelty",
    divorce: "No",
    issue: "Abuse during a good-faith marriage",
    notes:
      "Available whether or not the marriage has ended. The standard covers battery or extreme cruelty, and extreme cruelty is not limited to physical violence.",
  },
  {
    ground: "Extreme hardship",
    divorce: "No",
    issue: "Extreme hardship resulting from removal",
    notes:
      "Assessed on circumstances arising during the conditional residence period. It is the narrowest of the three and is often requested alongside another ground.",
  },
];

/* ------------------------------------------------------------------ *
 * Divorce vs. the H-1B losing a job — two different events that readers
 * routinely merge into one. The 60-day regulation covers dependents, but the
 * trigger it names is the END OF EMPLOYMENT, not the end of a marriage.
 * ------------------------------------------------------------------ */
export const gracePeriodComparisonCols: DataCol[] = [
  { key: "event", label: "What happened" },
  { key: "sixty", label: "Does the 60-day provision apply?", highlight: true },
  { key: "what", label: "What it means for the H-4 spouse" },
];

export const gracePeriodComparisonRows: DataRow[] = [
  {
    event: "The H-1B spouse loses their job (marriage intact)",
    sixty: "Yes — the regulation names dependents",
    what: "8 CFR § 214.1(l)(2) covers the worker 'and his or her dependents' for up to 60 consecutive days once per authorized validity period, so the H-4 spouse is generally within the same window while the marriage continues. DHS may shorten or eliminate it as a matter of discretion, and the period does not by itself authorize work.",
  },
  {
    event: "You divorce the H-1B spouse",
    sixty: "Do not assume it does",
    what: "The trigger the regulation names is cessation of the employment the classification was based on — not the end of a marriage. A final divorce can end the qualifying relationship H-4 rests on, and no primary source establishes an equivalent 60-day window for that situation. Plan on the basis of what you can file while still eligible, not on a period that may not exist.",
  },
];

/* --- Evidence relevant to a good-faith marriage --- */

/**
 * The subset worth pulling first. The full list below matters, but an
 * unranked list of eight is hard to act on in the week someone finds this
 * page — these four are the ones that are hardest to obtain later.
 */
export const priorityEvidence: string[] = [
  "Joint lease or mortgage statements showing you lived at the same address",
  "Joint bank account statements and any jointly filed tax returns",
  "Utility bills and insurance policies in both names, spread across the marriage",
  "Photographs across the whole span of the relationship, with dates where possible",
];

export const goodFaithEvidence: string[] = [
  "Joint financial records — bank statements, jointly filed tax returns, joint credit cards, insurance policies naming each other",
  "A joint lease or mortgage, utility bills, and mail addressed to both of you at a shared address",
  "Photographs across the span of the relationship, including with both families",
  "Wedding documentation, including the Indian ceremony and the marriage registration if you married in India",
  "Communication history, travel taken together, and joint memberships",
  "Birth certificates of any children of the marriage",
  "Sworn statements from people who knew you as a couple, with enough specific detail to be useful",
  "The divorce decree, and where it helps, a personal statement explaining the circumstances",
];

/* --- I-864 termination, tracking 8 CFR 213a.2(e)(2) --- */
export const i864Terminators: string[] = [
  "The sponsored immigrant becomes a US citizen",
  "The sponsored immigrant has worked, or can be credited with, 40 qualifying quarters of coverage",
  "The sponsored immigrant is no longer a lawful permanent resident and has departed the United States",
  "The sponsored immigrant, having become subject to removal, applies for and obtains in removal proceedings a new grant of adjustment of status, based on a new affidavit of support where one is required",
  "The sponsored immigrant dies, or the sponsor dies",
];

/* --- Recognition of a US divorce in India --- */
export const indiaRecognitionCols: DataCol[] = [
  { key: "test", label: "Section 13 CPC condition" },
  { key: "turns", label: "What it turns on", highlight: true },
  { key: "why", label: "Why it matters for a US decree" },
];

export const indiaRecognitionRows: DataRow[] = [
  {
    test: "The judgment was pronounced by a court of competent jurisdiction",
    turns: "Whether Indian law regards that forum as competent in the matrimonial context",
    why: "Narasimha Rao reads this narrowly in matrimonial matters — broadly, the forum under the law under which the parties married, or one to which the respondent voluntarily and effectively submitted.",
  },
  {
    test: "The judgment was given on the merits of the case",
    turns: "Whether the case was actually contested and decided",
    why: "An ex parte decree, or one entered by default where the other spouse did not appear, raises a real question under this condition.",
  },
  {
    test: "The judgment is not founded on an incorrect view of international law or a refusal to recognize Indian law where applicable",
    turns: "Whether the ground of divorce is one the governing Indian personal law recognizes",
    why: "This is the condition US decrees most often have to address, because irretrievable breakdown is not among the grounds listed in the Hindu Marriage Act.",
  },
  {
    test: "The proceedings were not opposed to natural justice",
    turns: "Whether the respondent had proper notice and a real opportunity to be heard",
    why: "Service, representation and a genuine chance to contest all matter here.",
  },
  {
    test: "The judgment was not obtained by fraud",
    turns: "Whether the jurisdictional facts as well as the merits were presented honestly",
    why: "Misstating residence or domicile to establish jurisdiction can be treated as fraud for this purpose.",
  },
];

/* --- Document checklist --- */
export const documentChecklist: string[] = [
  "Certified copies of the divorce decree — obtain several, as different agencies and courts may each require one",
  "The marriage certificate, including the Indian registration if you married in India",
  "Certified English translations of any document not in English",
  "Every approval and receipt notice: I-797s, I-140, I-130, I-485, I-751, EADs, advance parole",
  "Copies of prior immigration filings, and notices held in your USCIS online account",
  "Copies of prior family-court filings, orders and settlement agreements",
  "Copies of every passport, visa stamp and I-94 for you and your children",
  "Proof of shared residence — leases, mortgage statements, utility accounts, mail at a joint address",
  "Insurance records — health, auto, life and renters or homeowners policies naming both spouses",
  "Employment and pay records — offer letters, pay statements, W-2s and 1099s",
  "Joint financial records covering the marriage — gather these before accounts are separated, as access can be lost quickly",
  "Jointly filed tax returns for every married year",
  "Your Form I-864 if you signed one, or your spouse's if they signed one for you",
  "Any documentation of abuse, if it is part of the history — messages, photographs, police reports, medical records",
  "Your children's US birth certificates, and OCI cards or Indian passports if they hold them",
];

/* ------------------------------------------------------------------ *
 * Support resources. Contact details verified against the organizations'
 * own sites on RULES_LAST_VERIFIED — do not carry forward a number from
 * memory or from another page, and re-check these when the page is reviewed.
 * A wrong number here fails someone at the worst possible moment.
 * ------------------------------------------------------------------ */
export interface SupportResource {
  name: string;
  detail: string;
  href?: string;
}

export const DV_RESOURCE_INTRO =
  "If a spouse threatens your immigration status, withholds your passport or immigration documents, controls your money, or subjects you to abuse, these lines are free, confidential and available around the clock. You do not need to have decided anything before calling, and you do not need to be a US citizen or permanent resident to use them.";

export const dvResources: SupportResource[] = [
  {
    name: "National Domestic Violence Hotline",
    detail: "Call 800-799-SAFE (800-799-7233), or text START to 88788",
    href: "https://www.thehotline.org/",
  },
  {
    name: "The Deaf Hotline (video phone)",
    detail: "Video phone 855-812-1001",
    href: "https://www.thedeafhotline.org/",
  },
  {
    name: "National Human Trafficking Hotline",
    detail: "Call 1-888-373-7888 (TTY 711), or text 233733",
    href: "https://humantraffickinghotline.org/",
  },
  {
    name: "Find a DOJ-accredited representative or recognized organization",
    detail: "Free and low-cost immigration help, searchable by state",
    href: "https://www.justice.gov/eoir/recognition-and-accreditation-program",
  },
];

/** Rendered directly under the checklist. */
export const DOCUMENT_HANDLING_NOTE =
  "Keep originals secure; provide copies unless an agency, court, or other authority specifically requires an original. Ask the Indian authority, court, consulate, or attorney whether an apostille, authentication, certified copy, or other form of document legalization is required for the specific document and purpose — the answer differs by document and by the office receiving it.";

/* ------------------------------------------------------------------ *
 * Official sources. Every href must be a government, court or statute URL —
 * asserted by the page test, and each was checked for status on
 * RULES_LAST_VERIFIED.
 * ------------------------------------------------------------------ */
export const officialSourceLinks: { label: string; href: string }[] = [
  {
    label: "USCIS — Removing Conditions on Permanent Residence",
    href: "https://www.uscis.gov/green-card/after-we-grant-your-green-card/conditional-permanent-residence/removing-conditions-on-permanent-residence-based-on-marriage",
  },
  {
    label: "USCIS Policy Manual — Waiver of Joint Filing (Vol. 6, Pt. I, Ch. 5)",
    href: "https://www.uscis.gov/policy-manual/volume-6-part-i-chapter-5",
  },
  {
    label: "USCIS Policy Manual — Petition to Remove Conditions (Vol. 6, Pt. I, Ch. 3)",
    href: "https://www.uscis.gov/policy-manual/volume-6-part-i-chapter-3",
  },
  { label: "USCIS — Form I-751", href: "https://www.uscis.gov/i-751" },
  {
    label: "USCIS — Abused Spouses, Children and Parents (VAWA)",
    href: "https://www.uscis.gov/humanitarian/abused-spouses-children-and-parents",
  },
  {
    label: "USCIS Policy Manual — VAWA Eligibility (Vol. 3, Pt. D, Ch. 2)",
    href: "https://www.uscis.gov/policy-manual/volume-3-part-d-chapter-2",
  },
  {
    label: "USCIS — U Nonimmigrant Status (victims of criminal activity)",
    href: "https://www.uscis.gov/humanitarian/victims-of-criminal-activity-u-nonimmigrant-status",
  },
  {
    label: "USCIS — T Nonimmigrant Status (victims of human trafficking)",
    href: "https://www.uscis.gov/humanitarian/victims-of-human-trafficking-t-nonimmigrant-status",
  },
  { label: "USCIS — Form I-864, Affidavit of Support", href: "https://www.uscis.gov/i-864" },
  {
    label: "USCIS Policy Manual — Affidavit of Support (Vol. 8, Pt. G, Ch. 6)",
    href: "https://www.uscis.gov/policy-manual/volume-8-part-g-chapter-6",
  },
  {
    label: "eCFR — 8 CFR § 213a.2 (use of affidavit of support)",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-213a/section-213a.2",
  },
  {
    label: "HHS ASPE — Poverty Guidelines",
    href: "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
  },
  {
    label: "USCIS Policy Manual — Unlawful Presence (Vol. 8, Pt. O)",
    href: "https://www.uscis.gov/policy-manual/volume-8-part-o",
  },
  {
    label: "USCIS Policy Manual — Spouses of US Citizens (Vol. 12, Pt. G)",
    href: "https://www.uscis.gov/policy-manual/volume-12-part-g",
  },
  { label: "USCIS — Form I-539, Change of Nonimmigrant Status", href: "https://www.uscis.gov/i-539" },
  {
    label: "eCFR — 8 CFR § 214.1 (nonimmigrant general requirements)",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.1",
  },
  { label: "IRS Topic No. 452 — Alimony and Separate Maintenance", href: "https://www.irs.gov/taxtopics/tc452" },
  {
    label: "Texas Family Code, Chapter 8 — Maintenance",
    href: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.8.htm",
  },
  // nycourts.gov returns 403 to automated requests (as uscis.gov and
  // travel.state.gov do). The page resolves normally in a browser — a link
  // check that reports 403 here is bot-blocking, not a dead link.
  {
    label: "NY Courts — Maintenance & Child Support Income Caps",
    href: "https://www.nycourts.gov/divorce/whats-new-matrimonial-legislation-court-rules-and-forms",
  },
];

/** Indian authorities cited on the page. Case law, so not .gov URLs. */
export const indianAuthorities: { cite: string; point: string }[] = [
  {
    cite: "Y. Narasimha Rao v. Y. Venkata Lakshmi, (1991) 3 SCC 451",
    point:
      "Sets out how Section 13 of the Code of Civil Procedure applies to foreign matrimonial decrees, reading the jurisdiction and merits conditions narrowly in the matrimonial context.",
  },
  {
    cite: "Section 13, Code of Civil Procedure, 1908",
    point:
      "Provides that a foreign judgment is conclusive except in the enumerated situations — which is the statutory basis for the recognition analysis.",
  },
  {
    cite: "Section 13, Hindu Marriage Act, 1955",
    point:
      "Lists the grounds on which a divorce may be granted. Irretrievable breakdown of marriage is not among them.",
  },
  {
    cite: "Section 13B, Hindu Marriage Act, 1955",
    point:
      "Divorce by mutual consent — two motions with a statutory interval between them, subject to the statutory conditions.",
  },
  {
    cite: "Amardeep Singh v. Harveen Kaur, (2017) 8 SCC 746",
    point:
      "Held that the waiting period under Section 13B(2) is directory rather than mandatory, and may be waived in appropriate cases.",
  },
  {
    cite: "Shilpa Sailesh v. Varun Sreenivasan, (2023) 14 SCC 231",
    point:
      "Addressed the Supreme Court's power under Article 142 of the Constitution to dissolve a marriage on the ground of irretrievable breakdown, a power other courts do not exercise.",
  },
  {
    cite: "Rajnesh v. Neha, (2021) 2 SCC 324",
    point:
      "Directed that both parties file an affidavit of disclosure of assets and income in maintenance proceedings, and set out the factors courts weigh.",
  },
  {
    cite: "Kalyan Dey Chowdhury v. Rita Dey Chowdhury, (2017) 14 SCC 200",
    point:
      "Referred to 25% of the husband's net salary as a just and proper figure on the facts before the Court. It is a reference point from a decided case, not a statutory formula.",
  },
  {
    cite: "Pratibha Rani v. Suraj Kumar, (1985) 2 SCC 370",
    point:
      "Held that stridhan is the wife's property, a question that sits separately from maintenance and from the division of matrimonial assets.",
  },
  {
    cite: "Section 82, Bharatiya Nyaya Sanhita, 2023 (formerly Section 494 IPC)",
    point:
      "Addresses marrying again during the lifetime of a spouse where the first marriage subsists.",
  },
];

/* ------------------------------------------------------------------ *
 * FAQs. The page renders this exact array and feeds the same array to
 * faqJsonLd, so visible text and schema cannot diverge.
 * ------------------------------------------------------------------ */
export const faqs: FaqItem[] = [
  {
    question: "Can an H-4 spouse stay in the US after divorce?",
    answer:
      "Not on H-4 alone, once the marriage that supports it has ended. A final divorce can end the qualifying relationship the status rests on, and the regulation containing a 60-day provision addresses workers who lose employment rather than dependents whose marriage ends. The practical approach most attorneys take is to file a change of status, or another available application, while the person is still eligible to do so — a timely-filed application can affect what happens next. Because the consequences depend on the facts, this is a question to take to an immigration attorney rather than a deadline to calculate yourself.",
  },
  {
    question: "What happens to an H-4 EAD after divorce?",
    answer:
      "If the H-4 status supporting the EAD ends, you should not assume the expiration date printed on the card continues to authorize employment. The card is issued against the underlying status rather than independently of it. Because working without authorization creates a separate and serious problem on top of any status question, get individualized immigration advice before continuing employment, and factor the conversation with your employer into your timing.",
  },
  {
    question: "Is there a 60-day grace period for H-4 after divorce?",
    answer:
      "Do not assume so. The 60-day provision at 8 CFR 214.1(l)(2) addresses cessation of employment for certain nonimmigrant workers — E, H, L, O and TN principals. It does not expressly create a 60-day period for a dependent whose qualifying marriage has ended. The belief that it does circulates widely and can lead people to wait when they have options worth pursuing sooner.",
  },
  {
    question: "Can I change from H-4 to H-1B after divorce?",
    answer:
      "It is possible where an employer is willing to petition for you and your cap position allows it — typically a selected registration or a cap-exempt employer such as a university or affiliated nonprofit. It is often the strongest outcome when available, and it is rarely available on a divorce timeline, because it depends on the annual registration cycle. If your professional profile supports it, raise it with an immigration attorney early rather than after the decree.",
  },
  {
    question: "Can I change from H-4 to F-1 after divorce?",
    answer:
      "Often yes, and it is a realistic route where retraining was already under consideration. It requires admission to a SEVP-certified school and an I-20 before the change-of-status application is filed, so the lead time runs to months rather than days. F-1 work authorization is limited — generally on-campus employment, then CPT or OPT if you become eligible. Starting the school application while the marriage is still intact is what makes the timing workable.",
  },
  {
    question: "Does divorce affect my H-1B?",
    answer:
      "Your own H-1B rests on your employer and your petition rather than on your marriage, so it is generally unaffected, and extensions, transfers and an approved I-140 are not disturbed by the divorce itself. What changes sits elsewhere: your spouse's H-4 is affected, and if you signed a Form I-864 sponsoring your spouse for a green card, that undertaking is not resolved by the divorce.",
  },
  {
    question: "Will I lose my green card if I get divorced?",
    answer:
      "If you hold a 10-year green card, permanent residence is held in your own right, and a divorce is not itself a ground of removability. If you hold a conditional two-year card, you generally keep the status but need to file Form I-751 requesting a waiver of the joint-filing requirement, with evidence that the marriage was entered into in good faith. Either way, the divorce itself does not cancel the status.",
  },
  {
    question: "Can I get a green card after divorce?",
    answer:
      "It depends entirely on the basis. A marriage-based petition filed by the former spouse generally cannot continue once the qualifying marriage ends. Other routes are unaffected by the divorce and may remain open — an employment-based petition through an employer, a self-petition such as an EB-2 national-interest waiver where the profile supports one, or, where there was abuse by a US-citizen or permanent-resident spouse, a VAWA self-petition. Which of these is realistic is a question for an immigration attorney who can see the full history.",
  },
  {
    question: "Can my green card be revoked after divorce?",
    answer:
      "The divorce itself is not the issue. Where questions arise, they generally concern whether the marriage was entered into in good faith at the outset, which is a distinct inquiry with its own evidence. A marriage that was genuine and later broke down is the situation the I-751 waiver exists to address.",
  },
  {
    question: "What happens if I divorce before the green card interview?",
    answer:
      "For a typical marriage-based I-130 and I-485, ending the qualifying marriage can eliminate the basis for both the petition and the adjustment application. Exceptions and alternative pathways may apply depending on the circumstances, including abuse-related protections and independent immigration classifications. Because the order of events can change what remains available, speak to an immigration attorney before anyone files for divorce.",
  },
  {
    question: "How long after getting a green card can I get divorced?",
    answer:
      "There is no waiting period in immigration law. The distinction that matters is whether you hold a conditional two-year card, which means a Form I-751 filing with evidence of a good-faith marriage, or a 10-year card, where the divorce generally carries no immigration filing of its own.",
  },
  {
    question: "What happens to I-751 after divorce?",
    answer:
      "The petition is filed on your own rather than jointly, with a request to waive the joint-filing requirement. There are three separate waiver grounds — a good-faith marriage terminated by divorce or annulment, battery or extreme cruelty, and extreme hardship — and they do not all require a divorce. The good-faith-plus-divorce ground turns on whether the marriage was entered into in good faith, not on how long it lasted or who was at fault.",
  },
  {
    question: "Can I file Form I-751 if the divorce is not final yet?",
    answer:
      "USCIS guidance indicates a waiver request may be filed once a waiver ground applies, and it is not confined to the 90-day window that governs joint petitions. Where the parties are still married but separated or in pending divorce proceedings, USCIS may issue a Request for Evidence asking for the final decree, and the marriage may terminate during the response period. Coordinate the timing with both your immigration and family lawyers, since divorce proceedings in some states run longer than the conditional card's validity.",
  },
  {
    question: "What does USCIS look at on an I-751 good-faith waiver?",
    answer:
      "Whether the marriage was entered into in good faith — the intent at the outset, rather than how long it lasted or who was responsible for the breakdown. The evidence that speaks to that tends to come from the beginning and middle of the relationship: joint finances, a shared home, photographs across the span of the relationship, and statements from people who knew you as a couple.",
  },
  {
    question: "Can I apply for citizenship after divorce?",
    answer:
      "Generally yes, under the standard five-year residence requirement. What is affected is the shortened three-year route for spouses of US citizens, which requires living in marital union with the same citizen spouse for the three years before filing and, under USCIS guidance, continuing through naturalization. Time already accrued as a permanent resident is not lost — the applicable period changes rather than restarting.",
  },
  {
    question: "Does the affidavit of support end when we divorce?",
    answer:
      "Divorce is not among the conditions that terminate a Form I-864 undertaking. The regulation lists the sponsored immigrant becoming a US citizen; being credited with 40 qualifying quarters of coverage; no longer being a permanent resident and having departed the United States; obtaining, in removal proceedings, a new grant of adjustment of status based on a new affidavit of support where one is required; and the death of the sponsored immigrant or the sponsor. Termination also does not erase a reimbursement obligation that accrued beforehand.",
  },
  {
    question: "Can my ex-spouse collect under the I-864 after divorce?",
    answer:
      "The undertaking is enforceable by the sponsored immigrant, and divorce is not one of the conditions that ends it. How and to what extent it can be enforced after a divorce has been litigated in state and federal courts, and results have varied — including on whether it can be waived by agreement and how a court treats a settlement that addresses spousal support. Because it runs alongside alimony rather than in place of it, both sponsoring and sponsored spouses should raise it explicitly with their family lawyer.",
  },
  {
    question: "Can a man file a VAWA self-petition?",
    answer:
      "Yes. Despite the name, a self-petition under these provisions is available to an abused spouse of a US citizen or lawful permanent resident regardless of gender, and the same is true of U and T nonimmigrant status. The eligibility requirements are the same either way.",
  },
  {
    question: "Can I file VAWA if my spouse is on H-1B and I am on H-4?",
    answer:
      "No. A VAWA self-petition requires the abusive spouse to be a US citizen or lawful permanent resident, and an H-1B holder is neither. This is among the most commonly repeated errors in NRI-facing content. Depending on the facts, U or T nonimmigrant classification may provide an alternative, because those do not require the abuser to be a citizen or permanent resident — but they carry their own eligibility requirements, including a qualifying crime and, for U status, helpfulness to law enforcement. A divorce alone does not create eligibility. Speak with an immigration attorney or a DOJ-accredited representative.",
  },
  {
    question: "Can I file VAWA if my spouse never hit me?",
    answer:
      "Possibly, depending on the facts. The statutory standard is battery or extreme cruelty, and extreme cruelty is not limited to physical violence. Patterns that recur in immigrant households — using a pending immigration petition as leverage, or withholding a spouse's passport or immigration documents — can be relevant to the analysis. Whether a particular history meets the standard is a question for counsel.",
  },
  {
    question: "What happens to my children's H-4 status after divorce?",
    answer:
      "A child's H-4 derives from the parent-child relationship with the H-1B holder, and a divorce between the parents does not end that relationship. Custody, travel consent and who holds the children's passports are separate questions that the immigration status does not resolve, and they are worth addressing explicitly in the settlement.",
  },
  {
    question: "Can my ex-spouse take our child to India after divorce?",
    answer:
      "Any international travel needs to comply with the custody order. The practical complication is that India is not a party to the Hague Convention on the Civil Aspects of International Child Abduction, so a US custody order does not automatically resolve enforcement questions there and a cross-border dispute can require separate proceedings and legal advice in India. Outcomes are highly fact-specific. Addressing travel consent, passport custody and OCI documents in the settlement is more effective than relying on the order alone.",
  },
  {
    question: "Is a US divorce valid in India?",
    answer:
      "Not automatically. Recognition depends on whether the foreign decree satisfies Section 13 of the Code of Civil Procedure and the applicable personal-law requirements, as discussed in Y. Narasimha Rao v. Y. Venkata Lakshmi. Some US no-fault divorces may face recognition problems depending on the divorce ground, the jurisdiction, whether both parties participated, and the circumstances of the case. A decree obtained where both spouses appeared voluntarily generally stands on stronger ground than one entered by default.",
  },
  {
    question: "Do I need to file for divorce again in India?",
    answer:
      "Not necessarily, though it is often worth establishing your status there where you need certainty — to remarry, to deal with property, or for anything official. Two routes are commonly used: a declaratory suit in an Indian court confirming marital status, or, where both spouses cooperate and it is available, a fresh mutual-consent petition under Section 13B of the Hindu Marriage Act. Which is appropriate depends on the facts and on whether your former spouse will participate.",
  },
  {
    question: "Can I file for divorce in India from the USA without travelling?",
    answer:
      "For mutual-consent proceedings this is often practicable. A notarized power of attorney, legalized as the receiving court requires, can allow an advocate to act for you, and Indian courts have permitted appearance by video conference. Section 13B involves two motions with a statutory interval that a court may waive in appropriate cases. Contested proceedings are considerably harder to run remotely. Confirm the specific requirements with an advocate practising before the relevant court.",
  },
  {
    question: "What if I remarry on a US decree India does not recognize?",
    answer:
      "Before remarrying, confirm that the divorce is recognized under the law applicable to the first marriage. Where a first marriage subsists under Indian law, remarriage raises exposure under Section 82 of the Bharatiya Nyaya Sanhita, the successor provision to Section 494 of the Indian Penal Code. Resolving the Indian position first is considerably simpler than addressing it afterwards.",
  },
  {
    question: "Should I file for divorce in the US or in India?",
    answer:
      "It turns on where you live, where the assets are, and which forum is likely to produce a better outcome on the issues that matter to you — the estimator on this page illustrates how far apart the two systems can be on maintenance alone. Speed, cost, custody and enforceability all differ, and the first filing can influence what follows. Get advice in both jurisdictions before either spouse files.",
  },
  {
    question: "How much alimony will I pay or receive?",
    answer:
      "No formula produces that answer. Most US states decide spousal support on statutory factors, and guideline figures of the kind this page illustrates are benchmarks that temporary orders and negotiations often start from rather than predictions of an award. Texas requires specified eligibility conditions before maintenance can be ordered, New York applies its formula up to a statutory income cap, and India has no statutory formula at all — Indian courts work from disclosed assets, needs and earning capacity.",
  },
  {
    question: "Does divorce affect my I-140 or my priority date?",
    answer:
      "An approved I-140 and the priority date attached to it belong to the principal beneficiary, and a divorce does not disturb either. What is affected is a spouse's derivative claim: where an I-485 is pending and the spouse was a derivative applicant, that derivative side of the case is affected by the end of the marriage while the principal's own case continues.",
  },
  {
    question: "What happens to a joint bank account, 401(k) or Indian property in a divorce?",
    answer:
      "Retirement accounts are typically divided by a qualified domestic relations order, a separate document from the divorce decree that is easy to overlook. Indian assets — NRE and NRO balances, property, and stridhan — generally require attention under Indian law and may need proceedings there. Gathering statements for joint accounts before they are separated is worth doing early, as access can be lost quickly.",
  },
];

/* ------------------------------------------------------------------ *
 * Disclaimer
 * ------------------------------------------------------------------ */
export const DIVORCE_DISCLAIMER =
  "This guide is general educational information about how US immigration rules and Indian matrimonial law interact when a marriage ends. It is not legal advice, it does not create an attorney-client relationship, NRItoUSA does not provide legal representation, and nothing here can account for the facts of your case.";

export const DISCLAIMER_POINTS: string[] = [
  "Nothing here is immigration advice. Deepak Middha is a CA and Series 65 holder who reviews the financial and tax explanations on this site. He is not an immigration attorney and not a family lawyer.",
  "This page has not been reviewed by an attorney. The verification date shown means the cited sources were checked on that date — it is source verification, not legal review.",
  "Immigration rules change, and adjudicators apply them to the facts of individual cases. Verify every rule against the official source before you act on it.",
  "The alimony estimator is illustrative. It is not a prediction of what a court will award. Spousal support is discretionary in every jurisdiction shown, Texas requires specified eligibility conditions before maintenance can be ordered, and India has no statutory formula.",
  "The estimator excludes child support, division of property, retirement accounts and QDROs, Indian real estate, NRE and NRO balances, and stridhan claims — several of which can be larger than the maintenance figure.",
  "If there is abuse in your situation, speak to an immigration attorney or a DOJ-accredited representative before doing anything else. The safest route often depends on facts this page cannot see.",
  "For your own case you are likely to need three professionals: a licensed immigration attorney, a family lawyer in your US state, and — where India is involved — an advocate practising before the relevant Indian court.",
];
