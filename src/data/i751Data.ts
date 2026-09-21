/**
 * Form I-751 — Petition to Remove Conditions on Residence.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * SCOPE — read this before editing any copy that consumes this file.
 * Form I-751 is used by a conditional resident who obtained status THROUGH
 * MARRIAGE (Form I-751 Instructions, 04/01/24, "What Is the Purpose of Form
 * I-751?"). It is NOT the form for every two-year green card: a conditional
 * resident who obtained status through EB-5 investment files Form I-829
 * instead. Never write "if your card is valid for two years, I-751 is your
 * form" — the basis of the status, not the validity period, picks the form.
 *
 * REFRESH: fees come from the USCIS fee schedule (Form G-1055) and change with
 * each new edition; the 48-month extension length is set by a USCIS operational
 * decision and has changed before (it was 24 months, then 18, before Jan 2023).
 * Reopen both sources and bump `lastVerified` together.
 *
 * ⚠️ The extension length is the single most-often-stale fact on third-party
 * I-751 pages — competitor pages were still printing "24 months" and a
 * separate "$85 biometrics fee" in 2026. Neither is current.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Educational only. Not legal advice.
 */

export const I751_SOURCES = {
  form: "https://www.uscis.gov/i-751",
  instructions:
    "https://www.uscis.gov/sites/default/files/document/forms/i-751instr.pdf",
  feeSchedule: "https://www.uscis.gov/g-1055",
  feeWaiver: "https://www.uscis.gov/i-912",
  i829: "https://www.uscis.gov/i-829",
  removingConditions:
    "https://www.uscis.gov/green-card/after-we-grant-your-green-card/conditional-permanent-residence/removing-conditions-on-permanent-residence-based-on-marriage",
  whenToFile: "https://www.uscis.gov/forms/when-to-file-your-petition-to-remove-conditions",
  extensionAlert:
    "https://www.uscis.gov/newsroom/alerts/uscis-extends-green-card-validity-for-conditional-permanent-residents-with-a-pending-form-i-751-or",
  i9Central:
    "https://www.uscis.gov/i-9-central/form-i-9-related-news/form-i-751-and-i-829-48-month-extension",
  conditionalResidence:
    "https://www.uscis.gov/green-card/after-we-grant-your-green-card/conditional-permanent-residence",
  /** Policy Manual — CPRs and naturalisation (N-400 / I-751 interaction). */
  policyManualNatz: "https://www.uscis.gov/policy-manual/volume-12-part-g-chapter-5",
  /** Policy Manual — spouses of US citizens, INA 319(a) requirements. */
  policyManualSpouse: "https://www.uscis.gov/policy-manual/volume-12-part-g-chapter-2",
  /** Policy Manual — continuous residence and absences for naturalisation. */
  policyManualContinuousResidence:
    "https://www.uscis.gov/policy-manual/volume-12-part-d-chapter-3",
  /** Policy Manual — CPRs in removal proceedings; USCIS keeps I-751 jurisdiction. */
  policyManualRemoval: "https://www.uscis.gov/policy-manual/volume-6-part-i-chapter-7",
  /** Temporary evidence of LPR status (ADIT / I-551 stamp). */
  temporaryStatusDocs: "https://www.uscis.gov/policy-manual/volume-11-part-b-chapter-2",
  contactCenter: "https://www.uscis.gov/contactcenter",
  processingTimes: "https://egov.uscis.gov/processing-times/",
  fileOnline: "https://www.uscis.gov/file-online",
} as const;

export const I751_FACTS = {
  /** USCIS fee schedule, Form G-1055, edition 09/09/26. */
  paperFee: "$750",
  onlineFee: "$700",
  feeNote:
    "Filing online is $50 cheaper. G-1055 lists no separate biometric services fee for Form I-751. A conditional permanent resident, spouse or child who files a waiver of the joint filing requirement based on battery or extreme cruelty pays $0. G-1055 also notes that certain applicants may be eligible to request a fee waiver on Form I-912.",
  feeEdition: "G-1055, edition 09/09/26",
  /** Edition of the Form I-751 instructions the timing copy is drawn from. */
  instructionsEdition: "04/01/24",
  /** Days before conditional residence expires that the joint-filing window opens. */
  windowDays: 90,
  /** Conditional residence lasts two years. */
  conditionalYears: 2,
  /** Months the receipt notice extends conditional status AND work authorization. */
  extensionMonths: 48,
  extensionSince: "2023-01-25",
  lastVerified: "2026-09-21",
} as const;

export interface I751FilingBasis {
  id: "joint" | "waiver";
  label: string;
  who: string;
  /** Whether the 90-day window constrains this filer. */
  windowApplies: boolean;
  timing: string;
}

export const I751_BASES: I751FilingBasis[] = [
  {
    id: "joint",
    label: "Joint filing with your spouse",
    who: "You obtained conditional resident status through marriage, you are still married to the US citizen or permanent resident who petitioned for you, and you are both signing.",
    windowApplies: true,
    timing:
      "The instructions require a joint petition to be filed during the 90-day period immediately before your conditional residence expires. Filed earlier, USCIS rejects it; filed later, it is a late filing you have to ask USCIS to excuse.",
  },
  {
    id: "waiver",
    label: "Individual filing / waiver of the joint filing requirement",
    who: "You obtained conditional resident status through marriage, but the marriage ended in divorce or annulment, your spouse died, you or your conditional resident child suffered battery or extreme cruelty, or termination of status and removal would cause extreme hardship.",
    windowApplies: false,
    timing:
      "The 90-day window does not govern this route. The Form I-751 instructions say an eligible individual or waiver petition may be filed at any time after you are granted conditional resident status and before you are removed from the United States. That is not a promise your particular case is timely: if your status has already expired or you are in removal proceedings, get individualised advice from an immigration lawyer before you file.",
  },
];

/**
 * Waiver grounds, for the page copy and the tool's branch.
 *
 * `short` exists because the decision diagram's boxes are ~44 characters wide;
 * without it the SVG clipped titles mid-word. The full `title` is what the page
 * copy and the figcaption use, so nothing is lost to the shortening.
 */
export const I751_WAIVER_GROUNDS: { title: string; short: string; detail: string }[] = [
  {
    title: "The marriage ended in divorce or annulment",
    short: "Divorce or annulment",
    detail:
      "You have to show the marriage was entered into in good faith, not that it lasted. The instructions call for a copy of the final divorce decree or other document terminating or annulling the marriage, so this ground generally needs a final decree rather than a divorce that is still in progress.",
  },
  {
    title: "Your spouse died",
    short: "Your spouse died",
    detail:
      "The good-faith test is the same. A copy of the death certificate goes in with evidence of the qualifying relationship, in place of the joint signature.",
  },
  {
    title: "You or your conditional resident child suffered battery or extreme cruelty",
    short: "Battery or extreme cruelty",
    detail:
      "Filed by the conditional resident alone, with evidence of the abuse. G-1055 sets the fee for this category at $0, and no separate fee waiver request is needed for it.",
  },
  {
    title: "Termination of status and removal would cause extreme hardship",
    short: "Extreme hardship on removal",
    detail:
      "Measured against the hardship other people face on removal after a long stay, and the instructions limit the evidence to factors that arose during the two-year conditional residence period.",
  },
];

/**
 * Evidence categories.
 *
 * Deliberately NOT ranked. USCIS publishes no weighting of I-751 evidence, and
 * the instructions ask for documents covering the relationship "from the date
 * of the marriage to the present date" — breadth and consistency over time, not
 * one decisive document. The old "Strongest / Decisive" column was our
 * invention and was removed.
 */
export const I751_EVIDENCE: { category: string; examples: string; why: string }[] = [
  {
    category: "Shared finances",
    examples:
      "Joint savings and checking accounts with transaction history, complete joint federal and state tax returns, shared credit cards, insurance policies naming the other spouse as beneficiary, joint loans and joint utility bills.",
    why: "The instructions list joint ownership of assets and joint responsibility for liabilities as examples of good-faith evidence.",
  },
  {
    category: "Living together",
    examples:
      "A lease or mortgage contract in both names, utility bills, home or renter's insurance listing both of you, mail addressed to each of you at the same address over time.",
    why: "Documents joint occupancy or ownership of a shared home, which the instructions list by name.",
  },
  {
    category: "Children of the marriage",
    examples:
      "Birth certificates of children born during the marriage, school records, paediatric records listing both parents.",
    why: "Listed in the instructions as an example. Having children together does not by itself establish that the marriage was entered into in good faith, and not having them does not count against you.",
  },
  {
    category: "Insurance and benefits",
    examples:
      "Health insurance listing the spouse as a dependent, employer benefit enrolment forms, beneficiary designations, and for military families Leave and Earnings Statements or Form DD-1172.",
    why: "Shows the two of you treated as one household by third parties who had no immigration reason to do so.",
  },
  {
    category: "Life together over time",
    examples:
      "Photographs from across the conditional period rather than only the wedding, travel itineraries, correspondence.",
    why: "Helps demonstrate the circumstances of the relationship from the date of the marriage to the present, which is what the instructions ask you to document.",
  },
  {
    category: "Affidavits",
    examples:
      "Sworn or affirmed statements from at least two people who have known you both since conditional residence was granted, giving their full name and address, date and place of birth, relationship to you, and how they know what they know.",
    why: "The instructions accept affidavits but require that they be supported by the other types of evidence — they do not stand on their own.",
  },
];

/**
 * Which children go on the parent's petition and which file their own.
 * Source: Form I-751 Instructions, "Who May File Form I-751?".
 */
export const I751_CHILDREN = {
  included:
    "Dependent children who acquired conditional resident status on the same day as you, or within 90 days after, can be included on your petition — list their names and A-Numbers in Part 5, and file a copy of the front and back of each child's card with yours.",
  separate:
    "A child who acquired conditional resident status more than 90 days after you must file their own Form I-751, and so must a child whose conditional resident parent has died. A child filing separately has to include a full explanation of why they are filing separately, with supporting documents.",
} as const;

/**
 * Fee categories beyond the standard filing fee.
 * Source: Form G-1055, edition 09/09/26, Form I-751 rows.
 */
export const I751_FEE_EXEMPTIONS: { label: string; fee: string; detail: string }[] = [
  {
    label: "Waiver based on battery or extreme cruelty",
    fee: "$0",
    detail:
      "G-1055 sets the fee at $0 for a conditional permanent resident, spouse or child who files a waiver of the joint filing requirement based on battery or extreme cruelty. It is an automatic fee category for that filing, not a request you have to win.",
  },
  {
    label: "Form I-912 fee waiver request",
    fee: "$0 if granted",
    detail:
      "Separately, G-1055 notes that certain applicants may be eligible for a fee waiver and points to the Form I-912 instructions. Eligibility is set by those instructions, the request is decided by USCIS, and it is not granted automatically — read Form I-912 before relying on it, and file the request with the petition.",
  },
];

/** Certified translation requirement. Source: I-751 Instructions, "Translations". */
export const I751_TRANSLATION =
  "Any document in a foreign language must be filed with a full English translation. The translator signs a certification that the translation is complete and accurate and that they are competent to translate from that language into English; the certification carries their signature, printed name, the date they signed and their contact information. This catches Indian marriage certificates, birth certificates, property papers and bank records more often than anything else on the list.";
