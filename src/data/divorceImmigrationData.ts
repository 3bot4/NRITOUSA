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
 * 2. NEVER say a status "ends immediately" or "you must leave" as though it
 *    were settled. Where the agency has not published a bright-line rule,
 *    say so and describe what practitioners actually do. See
 *    `H4_TIMING_AMBIGUITY` — that nuance is the single most important honest
 *    statement on the page and must not be flattened into a slogan.
 *
 * 3. NEVER conflate the three separate money obligations:
 *      (a) SPOUSAL SUPPORT / ALIMONY — a state family-court order
 *      (b) FORM I-864 SUPPORT        — a federal contract enforceable by the
 *                                      sponsored immigrant, unaffected by
 *                                      divorce
 *      (c) CHILD SUPPORT             — separate again, and not modelled here
 *    They run alongside each other. Settling one does not settle the others.
 *
 * 4. VAWA HAS A HARD PREREQUISITE: the abusive spouse must be a US CITIZEN or
 *    LAWFUL PERMANENT RESIDENT. An abused H-4 spouse of an H-1B holder is NOT
 *    eligible for a VAWA self-petition, because the H-1B principal is neither.
 *    This is the most commonly repeated error in NRI-facing divorce content
 *    and it sends the most vulnerable readers down a dead end. Any edit that
 *    offers VAWA to an H-4 spouse without naming that prerequisite is a bug.
 *    The U visa / T visa route is the correct pointer for that reader.
 *
 * 5. NEVER present a guideline alimony figure as an award. Every US
 *    jurisdiction decides on statutory factors; the estimator reproduces the
 *    starting point of a negotiation. India has no formula at all.
 *
 * 6. American spelling in all visible copy — site-wide convention, asserted by
 *    a regex in the page test, so British -isation/-ise forms fail the build.
 *
 * 7. Immigration and family law are practice areas this site does not hold
 *    itself out as licensed in. Every route ends at "consult an attorney",
 *    and the financial/tax framing is the only place the site speaks with its
 *    own authority.
 */
import type { FaqItem } from "@/lib/seo";

/** ISO date the legal rules on this page were last checked against source. */
export const RULES_LAST_VERIFIED = "2026-08-16";
export const RULES_LAST_VERIFIED_HUMAN = "August 16, 2026";
/** Count of primary sources reviewed for this page (statutes, USCIS, courts). */
export const OFFICIAL_SOURCES_REVIEWED = 14;

/* ------------------------------------------------------------------ *
 * Verified figures. Nothing numeric goes on the page except from here.
 * ------------------------------------------------------------------ */
export interface VerifiedFact {
  label: string;
  value: string;
  /** Year or effective date the value applies to. NEVER omit. */
  year: string;
  jurisdiction: string;
  sourceName: string;
  sourceUrl: string;
  /** ISO date verified against the source. */
  lastVerified: string;
  note?: string;
}

export const divorceFacts: Record<string, VerifiedFact> = {
  unlawfulPresence3Year: {
    label: "Unlawful presence — three-year re-entry bar",
    value: "More than 180 days but less than 1 year",
    year: "INA § 212(a)(9)(B)(i)(I)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 8, Part O",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-8-part-o",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The bar attaches on DEPARTURE from the United States, not on the day the 180th day passes. Someone who accrues unlawful presence and then leaves triggers it; the accrual alone is not the trigger. That distinction changes what an attorney will advise you to do next.",
  },
  unlawfulPresence10Year: {
    label: "Unlawful presence — ten-year re-entry bar",
    value: "1 year or more",
    year: "INA § 212(a)(9)(B)(i)(II)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 8, Part O",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-8-part-o",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Also triggered on departure. Waivers exist (Form I-601 / I-601A) but require a qualifying relative and a hardship showing.",
  },
  i864Threshold: {
    label: "Form I-864 support obligation",
    value: "125% of the federal poverty guidelines",
    year: "INA § 213A",
    jurisdiction: "Federal",
    sourceName: "USCIS — Affidavit of Support",
    sourceUrl: "https://www.uscis.gov/i-864",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Measured against the sponsored immigrant's own household, not the sponsor's. Using the 2026 federal poverty guidelines for the 48 contiguous states, 125% for a one-person household is about $19,950 a year, and about $27,050 for a household of two.",
  },
  i864Quarters: {
    label: "Form I-864 — work-quarters exit",
    value: "40 qualifying quarters (about 10 years of work)",
    year: "INA § 213A(a)(3)(B)",
    jurisdiction: "Federal",
    sourceName: "USCIS — Affidavit of Support",
    sourceUrl: "https://www.uscis.gov/i-864",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Quarters worked by a spouse during the marriage can count toward the immigrant's total — which is one reason the obligation sometimes ends sooner than a sponsor expects.",
  },
  naturalizationFiveYear: {
    label: "Naturalization — standard residence requirement",
    value: "5 years as a permanent resident",
    year: "INA § 316(a)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 12, Part D",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-12-part-d",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Applications may be filed up to 90 days before the residence requirement is met.",
  },
  naturalizationThreeYear: {
    label: "Naturalization — spouse-of-citizen route",
    value: "3 years, in marital union throughout",
    year: "INA § 319(a)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 12, Part G",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-12-part-g",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Requires living in marital union with the same US-citizen spouse for the whole three years and continuing to be married through the oath. Divorce, and in most cases legal separation, ends access to this route.",
  },
  conditionalResidence: {
    label: "Conditional permanent residence",
    value: "2 years, when the marriage was under 2 years old at approval",
    year: "INA § 216",
    jurisdiction: "Federal",
    sourceName: "USCIS — Removing Conditions on Permanent Residence",
    sourceUrl:
      "https://www.uscis.gov/green-card/after-we-grant-your-green-card/conditional-permanent-residence/removing-conditions-on-permanent-residence-based-on-marriage",
    lastVerified: RULES_LAST_VERIFIED,
  },
  i751JointWindow: {
    label: "Form I-751 — joint filing window",
    value: "The 90 days before the card expires",
    year: "8 CFR § 216.4",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 6, Part I, Ch. 4",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-6-part-i-chapter-4",
    lastVerified: RULES_LAST_VERIFIED,
    note: "This 90-day window applies to JOINT petitions only. A waiver request filed alone has no such window — see the waiver fact below.",
  },
  i751WaiverWindow: {
    label: "Form I-751 — waiver request filing window",
    value: "Any time before, during or after the 90-day period",
    year: "USCIS Policy Manual, Vol. 6, Part I, Ch. 5",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual — Waiver of Joint Filing Requirement",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-6-part-i-chapter-5",
    lastVerified: RULES_LAST_VERIFIED,
    note: "A conditional resident may file a waiver request as soon as they are eligible for it and does not have to wait for the 90-day period to open. Where the divorce is still pending, USCIS issues a Request for Evidence for the final decree — and the marriage may legally terminate during the response period, which is enough to establish eligibility.",
  },
  vawaPrerequisite: {
    label: "VAWA self-petition — status of the abusive spouse",
    value: "Must be a US citizen or lawful permanent resident",
    year: "INA § 204(a)(1)(A)(iii) / (B)(ii)",
    jurisdiction: "Federal",
    sourceName: "USCIS Policy Manual, Vol. 3, Part D, Ch. 2",
    sourceUrl: "https://www.uscis.gov/policy-manual/volume-3-part-d-chapter-2",
    lastVerified: RULES_LAST_VERIFIED,
    note: "This is the eligibility fact most often reported wrongly in NRI-facing content. An abused H-4 spouse of an H-1B holder cannot self-petition under VAWA, because the H-1B principal is neither a citizen nor a permanent resident. The U visa and T visa are the routes that do not depend on the abuser's immigration status.",
  },
  vawaAfterDivorce: {
    label: "VAWA self-petition after the marriage has ended",
    value: "Within 2 years of the termination of the marriage",
    year: "INA § 204(a)(1)(A)(iii)(II)(aa)(CC)",
    jurisdiction: "Federal",
    sourceName: "USCIS — Abused Spouses, Children and Parents",
    sourceUrl: "https://www.uscis.gov/humanitarian/abused-spouses-children-and-parents",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The self-petitioner must also show a connection between the battery or extreme cruelty and the end of the marriage.",
  },
  gracePeriod60: {
    label: "60-day grace period — what it actually covers",
    value: "Cessation of employment of a nonimmigrant worker",
    year: "8 CFR § 214.1(l)(2)",
    jurisdiction: "Federal",
    sourceName: "eCFR — 8 CFR § 214.1",
    sourceUrl: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.1",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The regulation is written for E-1, E-2, E-3, H-1B, H-1B1, L-1, O-1 and TN workers whose employment ends. There is no equivalent provision for a dependent whose qualifying relationship ends, which is why the widely repeated '60 days after divorce' advice has no regulatory basis.",
  },
  nyIncomeCap: {
    label: "New York maintenance income cap",
    value: "$241,000",
    year: "Effective March 1, 2026 (from $228,000)",
    jurisdiction: "New York State",
    sourceName: "NY Courts — Matrimonial Legislation & Court Rules",
    sourceUrl: "https://www.nycourts.gov/divorce/whats-new-matrimonial-legislation-court-rules-and-forms",
    lastVerified: RULES_LAST_VERIFIED,
    note: "Adjusted every two years for CPI-U. The guideline formula reaches the payor's income only up to the cap; a court may award more on the excess after weighing the statutory factors.",
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
    label: "Texas spousal maintenance — eligibility gate",
    value: "Married 10 years or longer (or a § 8.051 exception)",
    year: "Tex. Fam. Code § 8.051",
    jurisdiction: "Texas",
    sourceName: "Texas Family Code, Chapter 8",
    sourceUrl: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.8.htm",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The spouse seeking maintenance must also lack sufficient property to meet minimum reasonable needs. The exceptions to the 10-year rule are family violence within two years of filing, and a disability of the spouse or of a child in their care. Below 10 years without an exception, the usual Texas outcome is no maintenance at all — not a smaller number.",
  },
  alimonyTaxTreatment: {
    label: "Federal tax treatment of alimony",
    value: "Not deductible by the payer, not taxable to the recipient",
    year: "Divorce or separation agreements executed after December 31, 2018",
    jurisdiction: "Federal",
    sourceName: "IRS Topic No. 452 — Alimony and Separate Maintenance",
    sourceUrl: "https://www.irs.gov/taxtopics/tc452",
    lastVerified: RULES_LAST_VERIFIED,
    note: "The Tax Cuts and Jobs Act reversed the old treatment. Agreements executed on or before December 31, 2018 keep the old rules unless later modified to adopt the new ones. This is why post-2018 settlement numbers are not comparable to older ones.",
  },
  usdInr: {
    label: "USD → INR reference rate",
    value: "₹96.27",
    year: "Snapshot of July 19, 2026",
    jurisdiction: "Market data",
    sourceName: "NRItoUSA market snapshot (Yahoo Finance EOD)",
    sourceUrl: "https://finance.yahoo.com/quote/USDINR=X/",
    lastVerified: "2026-07-19",
    note: "The estimator's India column scales directly with this rate, so it is an editable input rather than a buried constant. A cross-border maintenance discussion that runs for two years can move 10% on currency alone.",
  },
};

/** Default FX rate the estimator opens with. Kept in sync with the fact above. */
export const DEFAULT_USD_INR = 96.27;

/* ------------------------------------------------------------------ *
 * The honest statement of what is, and is not, settled about H-4 timing.
 * Referenced by name in the editing rules above — do not inline-edit into
 * a slogan.
 * ------------------------------------------------------------------ */
export const H4_TIMING_AMBIGUITY =
  "USCIS has never published a bright-line rule stating the exact hour H-4 status ends on divorce. What is settled is that H-4 exists only because of the marriage, that the 60-day grace period in the regulations is written for workers who lose a job rather than dependents who lose a qualifying relationship, and that an I-94 end-date printed before the decree does not extend a status whose basis has gone. What follows from that is a planning rule, not a countdown: file the change of status while you are still married, and do not build a plan around days you may not have.";

/* ------------------------------------------------------------------ *
 * Table primitives (shared shape with the Trump Account / benefits tables)
 * ------------------------------------------------------------------ */
export interface DataCol {
  key: string;
  label: string;
  highlight?: boolean;
}
export type DataRow = Record<string, string>;

/* --- The quick-answer matrix: what divorce does to each status --- */
export const statusImpactCols: DataCol[] = [
  { key: "status", label: "Your status" },
  { key: "effect", label: "What divorce does", highlight: true },
  { key: "urgency", label: "How urgent" },
];

export const statusImpactRows: DataRow[] = [
  {
    status: "H-4 dependent",
    effect:
      "Status is derivative and falls away with the marriage. Any H-4 EAD goes with it, whatever expiry date is printed on the card.",
    urgency: "Highest — act before the decree, not after",
  },
  {
    status: "H-1B principal",
    effect:
      "No effect on you. Your spouse's H-4 ends; your children's H-4 continues, because it comes from being your child.",
    urgency: "Low for you, highest for your spouse",
  },
  {
    status: "Conditional (2-year) green card",
    effect:
      "You keep the card and file Form I-751 alone, requesting a waiver of the joint-filing requirement. The test is whether the marriage was genuine when you entered it.",
    urgency: "High — an evidence-heavy filing that takes months to assemble",
  },
  {
    status: "10-year green card",
    effect:
      "Your residence is unaffected. Divorce is not a ground of removability and does not affect renewal.",
    urgency: "Low — only the naturalization timeline changes",
  },
  {
    status: "I-130 / I-485 still pending",
    effect:
      "The spousal petition rests on a qualifying relationship. When the marriage ends the petition is no longer approvable and the adjustment application is denied.",
    urgency: "Critical — take advice before anyone files for divorce",
  },
  {
    status: "F-2, L-2, O-3 and other dependents",
    effect:
      "Same structure as H-4: the status is derivative and ends with the marriage. L-2 and E-2 spouses lose work authorization with it.",
    urgency: "Highest — same planning as H-4",
  },
  {
    status: "Naturalized US citizen",
    effect: "None. Citizenship, once granted, does not depend on the marriage continuing.",
    urgency: "None",
  },
];

/* --- What an H-4 spouse can actually file --- */
export const h4OptionsCols: DataCol[] = [
  { key: "option", label: "Option" },
  { key: "works", label: "Can you work?", highlight: true },
  { key: "lead", label: "Lead time you need" },
  { key: "reality", label: "The honest read" },
];

export const h4OptionsRows: DataRow[] = [
  {
    option: "Change of status to B-2 (visitor)",
    works: "No",
    lead: "Days — it is the fastest package to assemble",
    reality:
      "The standard stopgap. Buys time to wind up a household, sell a car, finish a school term. It leads nowhere by design; treat it as a bridge, not a plan.",
  },
  {
    option: "Change of status to F-1 (student)",
    works: "Limited (on-campus, then CPT/OPT)",
    lead: "Months — you need an admission and an I-20 before you file",
    reality:
      "A real option if retraining was already on the table. It cannot be arranged in a week, which is why it has to be started while the marriage is still legally intact.",
  },
  {
    option: "Change of status to H-1B",
    works: "Yes",
    lead: "Depends entirely on an employer and cap position",
    reality:
      "The strongest outcome when it is available, and rarely available on this timeline. Needs a selected registration or a cap-exempt employer.",
  },
  {
    option: "Employment-based petition in another category",
    works: "Varies",
    lead: "Months",
    reality:
      "O-1, L-1 on a transfer back through an employer, or an EB-2 NIW self-petition where the profile genuinely supports it. Worth a conversation if your résumé is strong.",
  },
  {
    option: "U visa or T visa (crime or trafficking victims)",
    works: "Yes, once the work authorization issues",
    lead: "Years, with a long wait for the visa cap — but it does not depend on your spouse at all",
    reality:
      "This, not VAWA, is the route for an abused H-4 spouse whose husband or wife holds H-1B. It needs a qualifying crime, cooperation with law enforcement, and usually a certification from them.",
  },
  {
    option: "VAWA self-petition",
    works: "Yes, once the self-petition is approved",
    lead: "Months to years, and it runs without your spouse's knowledge",
    reality:
      "Only if the abusive spouse is a US citizen or permanent resident. It is not available against an H-1B holder — that is a statutory limit, not a paperwork problem.",
  },
];

/* --- The three I-751 waiver grounds --- */
export const i751WaiverCols: DataCol[] = [
  { key: "ground", label: "Waiver ground" },
  { key: "shows", label: "What you have to show", highlight: true },
  { key: "when", label: "When it fits" },
];

export const i751WaiverRows: DataRow[] = [
  {
    ground: "Good-faith marriage terminated by divorce or annulment",
    shows:
      "That the marriage was entered into in good faith — not that it lasted, and not whose fault the divorce was.",
    when: "The ordinary route after a genuine marriage ends. Generally needs a final decree, though the petition can be filed first.",
  },
  {
    ground: "Battery or extreme cruelty",
    shows:
      "That you were subjected to battery or extreme cruelty by the petitioning spouse during a good-faith marriage.",
    when: "Available whether or not you are divorced, and whether or not you are still living together. Non-physical abuse counts.",
  },
  {
    ground: "Extreme hardship",
    shows:
      "That removal would cause extreme hardship, based on circumstances arising during the conditional residence period.",
    when: "The narrowest of the three, and the one most often paired with another ground rather than used alone.",
  },
];

/* --- Evidence that a marriage was genuine --- */
export const goodFaithEvidence: string[] = [
  "Joint financial records — bank statements, jointly filed tax returns, joint credit cards, insurance policies naming each other",
  "A joint lease or mortgage, utility bills, and mail addressed to both of you at a shared address",
  "Photographs across the whole span of the relationship, including with both families",
  "Wedding documentation, including the Indian ceremony and the marriage registration if you married in India",
  "Communication history, travel taken together, and joint memberships",
  "Birth certificates of any children of the marriage",
  "Sworn statements from people who knew you as a couple, with enough specific detail to be worth reading",
  "The divorce decree itself, and where it helps, a short personal statement explaining what went wrong",
];

/* --- I-864: what actually ends it --- */
export const i864Terminators: string[] = [
  "The sponsored immigrant becomes a US citizen",
  "The sponsored immigrant is credited with 40 qualifying quarters of work — roughly ten years, and quarters worked by a spouse during the marriage can count",
  "The sponsored immigrant permanently leaves the US and abandons permanent residence",
  "The sponsored immigrant obtains a new grant of status through a different sponsor after leaving and returning, or after being placed in removal proceedings",
  "Either the sponsor or the sponsored immigrant dies",
];

/* --- Recognition of a US divorce in India --- */
export const indiaRecognitionCols: DataCol[] = [
  { key: "test", label: "Narasimha Rao condition" },
  { key: "meets", label: "Does a typical US decree meet it?", highlight: true },
  { key: "why", label: "Why" },
];

export const indiaRecognitionRows: DataRow[] = [
  {
    test: "The foreign court had jurisdiction Indian matrimonial law recognizes",
    meets: "Often yes",
    why: "Usually satisfied where the marriage was solemnized or the couple last resided together in that forum, or where the respondent voluntarily and effectively submitted to it.",
  },
  {
    test: "The decision was on the merits",
    meets: "Frequently not",
    why: "An ex parte decree, or one granted by default when the other spouse never appeared, is treated as not decided on the merits.",
  },
  {
    test: "The ground is one Indian personal law recognizes",
    meets: "Frequently not",
    why: "This is where most American divorces fail. Irretrievable breakdown — the standard US no-fault ground — is not a ground for divorce under the Hindu Marriage Act.",
  },
  {
    test: "Natural justice was observed",
    meets: "Usually yes",
    why: "Requires that the respondent had proper notice and a real opportunity to contest.",
  },
  {
    test: "The decree was not obtained by fraud",
    meets: "Usually yes",
    why: "Includes fraud as to the jurisdictional facts, not just fraud on the merits.",
  },
];

/* --- Document checklist --- */
export const documentChecklist: string[] = [
  "Certified copies of the divorce decree — get several, and have them apostilled if India is involved at all",
  "The marriage certificate, including the Indian registration if you married in India",
  "Every approval and receipt notice: I-797s, I-140, I-130, I-485, I-751, EADs, advance parole",
  "Copies of every passport, visa stamp and I-94 for you and your children",
  "Joint financial records covering the whole marriage — pull these BEFORE accounts are separated, because access disappears quickly",
  "Jointly filed tax returns and W-2s for every married year",
  "Your Form I-864 if you signed one, or your spouse's if they signed one for you",
  "Any documentation of abuse, if it is part of the history — messages, photographs, police reports, medical records",
  "Your children's US birth certificates, OCI cards and Indian passports if they hold them",
];

/* ------------------------------------------------------------------ *
 * Official sources. Every href must be a government, court or statute URL —
 * asserted by the page test.
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
  { label: "USCIS — Form I-751", href: "https://www.uscis.gov/i-751" },
  {
    label: "USCIS — Abused Spouses, Children and Parents (VAWA)",
    href: "https://www.uscis.gov/humanitarian/abused-spouses-children-and-parents",
  },
  {
    label: "USCIS Policy Manual — VAWA Eligibility (Vol. 3, Pt. D, Ch. 2)",
    href: "https://www.uscis.gov/policy-manual/volume-3-part-d-chapter-2",
  },
  { label: "USCIS — Victims of Criminal Activity: U Visa", href: "https://www.uscis.gov/humanitarian/victims-of-human-trafficking-and-other-crimes/victims-of-criminal-activity-u-nonimmigrant-status" },
  { label: "USCIS — Form I-864, Affidavit of Support", href: "https://www.uscis.gov/i-864" },
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
    label: "eCFR — 8 CFR § 214.1 (grace periods)",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.1",
  },
  { label: "IRS Topic No. 452 — Alimony and Separate Maintenance", href: "https://www.irs.gov/taxtopics/tc452" },
  {
    label: "Texas Family Code, Chapter 8 — Maintenance",
    href: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.8.htm",
  },
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
      "Sets the conditions under which an Indian court will recognize a foreign matrimonial decree under Section 13 of the Code of Civil Procedure.",
  },
  {
    cite: "Section 13, Code of Civil Procedure, 1908",
    point: "The statutory rule that a foreign judgment is conclusive only if it clears five specific tests.",
  },
  {
    cite: "Section 13B, Hindu Marriage Act, 1955",
    point:
      "Divorce by mutual consent — two motions with a statutory six-month interval, which the court may waive.",
  },
  {
    cite: "Amardeep Singh v. Harveen Kaur, (2017) 8 SCC 746",
    point:
      "Held that the six-month cooling-off period under Section 13B(2) is directory rather than mandatory, and may be waived where reconciliation is clearly impossible.",
  },
  {
    cite: "Shilpa Sailesh v. Varun Sreenivasan, (2023) 14 SCC 231",
    point:
      "Confirmed that only the Supreme Court, exercising its Article 142 powers, may dissolve a marriage on the ground of irretrievable breakdown. No other Indian court can — which is precisely why a US no-fault decree struggles for recognition.",
  },
  {
    cite: "Rajnesh v. Neha, (2021) 2 SCC 324",
    point:
      "Requires both spouses to file a sworn affidavit of assets and income in every maintenance proceeding, and directs courts to assess real earning capacity.",
  },
  {
    cite: "Kalyan Dey Chowdhury v. Rita Dey Chowdhury, (2017) 14 SCC 200",
    point:
      "Referred to 25% of the husband's net salary as a just and proper benchmark for maintenance on those facts. A reference point, never a formula.",
  },
  {
    cite: "Pratibha Rani v. Suraj Kumar, (1985) 2 SCC 370",
    point:
      "Stridhan is the wife's absolute property. It sits entirely outside maintenance and outside any division of matrimonial assets.",
  },
  {
    cite: "Section 82, Bharatiya Nyaya Sanhita, 2023 (formerly Section 494 IPC)",
    point: "Marrying again during the lifetime of a spouse is a criminal offence where the first marriage subsists.",
  },
];

/* ------------------------------------------------------------------ *
 * FAQs. The page renders this exact array and feeds the same array to
 * faqJsonLd, so visible text and schema cannot diverge.
 * ------------------------------------------------------------------ */
export const faqs: FaqItem[] = [
  {
    question: "Do I have to leave the US immediately after divorce on H-4?",
    answer:
      "H-4 status exists only because of the marriage, so it does not survive a final decree, and there is no grace period written for dependents who lose a qualifying relationship. USCIS has not published an exact cut-off hour, which is why practitioners plan around the decree date rather than around a countdown: file a change of status while you are still married, and a timely-filed application generally lets you remain while it is pending. Accruing unlawful presence and then departing is what triggers the three- and ten-year re-entry bars.",
  },
  {
    question: "Can I keep working on my H-4 EAD after divorce?",
    answer:
      "No. An H-4 EAD is granted against valid H-4 status. When the underlying status ends, the work authorization ends with it, even though the physical card still shows a future expiry date. Continuing to work on it is unauthorized employment, which creates a separate problem on top of the status problem. Tell your employer before, not after.",
  },
  {
    question: "Is there a 60-day grace period after divorce on H-4?",
    answer:
      "No. The 60-day grace period at 8 CFR 214.1(l)(2) is written for nonimmigrant workers whose employment ends — E, H, L, O and TN principals. There is no equivalent provision for a dependent whose marriage ends. The advice circulates widely on forums and is one of the most damaging pieces of misinformation in this area, because it persuades people to wait.",
  },
  {
    question: "Does divorce affect my H-1B?",
    answer:
      "No. H-1B is tied to your employer and your petition, not your marriage. Your extensions, transfers, I-140 and priority date are all unaffected, and you do not need to notify USCIS of the divorce for H-1B purposes. What changes is that your spouse's H-4 ends, and if you sponsored them for a green card your Form I-864 obligation continues.",
  },
  {
    question: "Will I lose my green card if I get divorced?",
    answer:
      "If you hold a 10-year green card, no. Divorce is not a ground of removability and does not affect renewal. If you hold a conditional two-year card, you keep it but must file Form I-751 on your own with a waiver of the joint-filing requirement, showing the marriage was entered into in good faith.",
  },
  {
    question: "Can my green card be revoked after divorce?",
    answer:
      "Not because of the divorce. Revocation risk arises only where USCIS believes the marriage was fraudulent from the outset, which is a marriage-fraud question with its own evidence and its own consequences. A marriage that was genuine and later failed is not fraud, and the I-751 waiver exists precisely for that situation.",
  },
  {
    question: "What happens if I divorce before the green card interview?",
    answer:
      "A Form I-130 filed by a citizen or permanent-resident spouse rests on a qualifying relationship. When the marriage ends, the petition is no longer approvable and a pending I-485 based on it is denied. If you have no other status at that point, you fall out of status on denial. Speak to an immigration attorney before anyone files for divorce, because the sequencing genuinely changes the options.",
  },
  {
    question: "How long after getting a green card can I get divorced?",
    answer:
      "There is no waiting period and no minimum. You can divorce at any time. The only distinction that matters for immigration is whether you hold a conditional two-year card, which means an evidence-heavy I-751 waiver filing, or a 10-year card, which carries no immigration consequence at all.",
  },
  {
    question: "Can I file Form I-751 if the divorce is not final yet?",
    answer:
      "Yes. A waiver request can be filed as soon as a waiver ground applies, and it is not confined to the 90-day window that governs joint petitions. If you are still legally married but separated or in pending divorce proceedings, USCIS issues a Request for Evidence asking for the final decree — and the marriage may legally terminate during the response period, which is enough to establish eligibility.",
  },
  {
    question: "What if my I-751 deadline arrives before my divorce is final?",
    answer:
      "File anyway rather than letting the conditional status lapse. Divorces in several states routinely run longer than the I-751 window, and USCIS has a defined path for it: the petition is filed, an RFE issues for the decree, and the decree can be supplied during the response period. Raise the collision with both your immigration and family lawyer early, because a family lawyer will not usually think to ask.",
  },
  {
    question: "What does USCIS actually test on an I-751 divorce waiver?",
    answer:
      "One thing: whether the marriage was entered into in good faith. Not whether it lasted, not whose fault the divorce was, and not whether you behaved well during it. Build the file around the beginning and the middle of the relationship — joint finances, a shared home, photographs across the whole span, and statements from people who knew you as a couple.",
  },
  {
    question: "Can I apply for citizenship after divorce?",
    answer:
      "Yes, under the standard five-year rule. What you lose is the shortened three-year route, which requires living in marital union with the same US-citizen spouse for the full three years and remaining married through the oath. The years you have already accrued as a permanent resident are not lost — the clock does not reset, the finish line moves.",
  },
  {
    question: "Does the affidavit of support end when we divorce?",
    answer:
      "No, and this surprises almost everyone. Form I-864 is a contract with the federal government, enforceable by the person you sponsored. It ends only on their naturalization, 40 qualifying quarters of work, permanent departure with abandonment of residence, a new grant of status through a different sponsor, or the death of either party. Divorce is not on that list.",
  },
  {
    question: "Can my ex-spouse sue me on the I-864 after we divorce?",
    answer:
      "Yes. A sponsored immigrant with income below 125% of the federal poverty guidelines can sue the sponsor to enforce it. They do not have to prove hardship and do not have to have claimed public benefits — only that the sponsor failed to maintain the promised level of support. Courts have awarded back-support plus attorney's fees. It runs alongside alimony, not instead of it.",
  },
  {
    question: "Can a divorce settlement waive the I-864 obligation?",
    answer:
      "Not automatically, and courts have split on whether it can be waived at all. Because the undertaking runs to the government as well as to the immigrant, a settlement that simply waives spousal support does not dispose of it. If you are the sponsoring spouse, this belongs in the negotiation explicitly and in writing. If you are the sponsored spouse, it is a right you may not know you have.",
  },
  {
    question: "Can a man file a VAWA self-petition?",
    answer:
      "Yes. Despite the name, VAWA self-petitions are available to any abused spouse of a US citizen or lawful permanent resident regardless of gender, and the same is true of the U visa. Under-reporting by men is a practical problem, not a legal one.",
  },
  {
    question: "Can I file VAWA if my spouse is on H-1B and I am on H-4?",
    answer:
      "No. A VAWA self-petition requires the abusive spouse to be a US citizen or lawful permanent resident, and an H-1B holder is neither. This is the single most commonly repeated error in NRI-facing divorce content. If you are an abused H-4 spouse, the routes that do not depend on your spouse's status are the U visa, for victims of qualifying crimes who cooperate with law enforcement, and the T visa for trafficking. Speak to an immigration attorney or a DOJ-accredited representative, not a forum.",
  },
  {
    question: "Can I file VAWA if my spouse never hit me?",
    answer:
      "Possibly. The statutory standard is battery or extreme cruelty, and extreme cruelty covers coercive control, threats to withdraw an immigration petition, financial isolation and confiscation of a passport or immigration documents. Two patterns recur specifically in immigrant households and are often not recognized as abuse by the person living through them: using a pending petition as leverage, and holding a spouse's documents.",
  },
  {
    question: "What happens to my children's H-4 status after divorce?",
    answer:
      "It continues. A child's H-4 derives from the parent-child relationship with the H-1B holder, and divorce does not end that relationship. Their status is unaffected even if they live with the other parent. Custody, travel consent and passport custody are separate issues, and they need to be addressed explicitly in the settlement.",
  },
  {
    question: "Can my ex-spouse take our child to India after divorce?",
    answer:
      "Not without complying with the custody order. The practical difficulty is that India is not a signatory to the Hague Convention on the Civil Aspects of International Child Abduction, so a US custody order is not directly enforceable there and recovery becomes an Indian court proceeding. Address travel consent, who holds the passports, and OCI documents explicitly in the settlement rather than assuming the order is enough.",
  },
  {
    question: "Is my US divorce automatically valid in India?",
    answer:
      "No. It has to satisfy the conditions in Y. Narasimha Rao under Section 13 of the Code of Civil Procedure. Most US no-fault decrees fail one of them, because irretrievable breakdown is not a ground for divorce under the Hindu Marriage Act — only the Supreme Court of India can dissolve a marriage on that basis, under Article 142. A joint divorce where both spouses appeared voluntarily is far stronger than an ex parte one.",
  },
  {
    question: "Do I need to file for divorce again in India?",
    answer:
      "Not automatically, but often in practice. Where you need certainty — to remarry, to transfer property, or to do anything official in India — the two routes are a declaratory suit in an Indian court confirming your marital status, or a fresh Section 13B mutual-consent petition if your ex-spouse will cooperate. Section 13B is usually faster and cleaner.",
  },
  {
    question: "Can I file for divorce in India from the USA without travelling?",
    answer:
      "Largely, for mutual consent. A notarized and apostilled special power of attorney lets your advocate act for you, and Indian courts permit appearance by video conference. Expect two motions with a six-month interval that a court may waive where reconciliation is clearly impossible, and six to eighteen months in total. Contested cases are far harder to run remotely.",
  },
  {
    question: "What happens if I remarry on a US decree India does not recognize?",
    answer:
      "If the first marriage still subsists under Indian law, remarrying exposes you to prosecution for bigamy under Section 82 of the Bharatiya Nyaya Sanhita, the successor to Section 494 of the Indian Penal Code. This has happened to real NRIs who assumed a US decree ended the matter everywhere. Resolve the Indian position before you remarry, not after.",
  },
  {
    question: "Should I file for divorce in the US or in India?",
    answer:
      "It turns on where you live, where the assets are, and which forum produces a better outcome for you — the estimator on this page shows how far apart the two systems can land on maintenance alone. Speed, cost, custody and enforceability all differ, and the first filing often controls. Get advice in both jurisdictions before either spouse files.",
  },
  {
    question: "How much alimony will I pay or receive?",
    answer:
      "There is no formula that produces the answer. Most US states decide on statutory factors, and the guideline figures the estimator shows are what temporary orders and negotiations typically start from. Texas has an eligibility gate before any figure applies, New York caps the formula at a statutory income ceiling, and India has no formula at all — courts there work from disclosed assets, real earning capacity and a benchmark of roughly a quarter of net income.",
  },
  {
    question: "Is alimony still tax-deductible?",
    answer:
      "Not for agreements executed after December 31, 2018. The Tax Cuts and Jobs Act reversed the old treatment, so alimony is no longer deductible by the payer and is no longer taxable income to the recipient. Agreements executed on or before that date keep the old rules unless they are later modified to adopt the new ones — which matters if you are comparing your settlement against numbers from an older case.",
  },
  {
    question: "Does divorce affect my I-140 or my priority date?",
    answer:
      "No. An approved I-140 and the priority date attached to it belong to the principal beneficiary, and a divorce does not touch either. What ends is a spouse's derivative claim: if your I-485 is pending and your spouse was a derivative applicant, their side of the case ends with the marriage while yours continues.",
  },
  {
    question: "What happens to a joint bank account, 401(k) or Indian property in a divorce?",
    answer:
      "Retirement accounts are divided by a qualified domestic relations order, which is a separate document from the divorce decree and is easy to overlook. Indian assets — NRE and NRO balances, property, and stridhan — sit outside a US decree's practical reach and usually need Indian proceedings of their own. Pull statements for every joint account before they are separated, because access disappears quickly.",
  },
];

/* ------------------------------------------------------------------ *
 * Disclaimer
 * ------------------------------------------------------------------ */
export const DIVORCE_DISCLAIMER =
  "This guide is general educational information about how US immigration rules and Indian matrimonial law interact when a marriage ends. It is not legal advice, it does not create an attorney-client relationship, and it cannot account for the facts of your case.";

export const DISCLAIMER_POINTS: string[] = [
  "Nothing here is immigration advice. Deepak Middha is a CA and Series 65 holder who reviews the financial and tax explanations on this site. He is not an immigration attorney and not a family lawyer.",
  "Immigration rules change, and different USCIS offices apply them differently. Verify every rule against the official source before you act on it.",
  "The alimony estimator produces a guideline starting point, not an award. Spousal support is discretionary in every jurisdiction shown, Texas has an eligibility gate before any figure applies, and India has no statutory formula at all.",
  "The estimator excludes child support, division of property, retirement accounts and QDROs, Indian real estate, NRE and NRO balances, and stridhan claims — several of which are larger than the maintenance number.",
  "If there is abuse in your situation, speak to an immigration attorney or a DOJ-accredited representative before doing anything else. The safest route often depends on facts this page cannot see.",
  "For your own case you need three professionals: a licensed immigration attorney, a family lawyer in your US state, and — where India is involved — an advocate practising before the relevant Indian family court.",
];
