/**
 * Form I-751 — Petition to Remove Conditions on Residence.
 *
 * ─────────────────────────────────────────────────────────────────────────
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
  feeSchedule: "https://www.uscis.gov/g-1055",
  removingConditions:
    "https://www.uscis.gov/green-card/after-we-grant-your-green-card/conditional-permanent-residence/removing-conditions-on-permanent-residence-based-on-marriage",
  whenToFile: "https://www.uscis.gov/forms/when-to-file-your-petition-to-remove-conditions",
  extensionAlert:
    "https://www.uscis.gov/newsroom/alerts/uscis-extends-green-card-validity-for-conditional-permanent-residents-with-a-pending-form-i-751-or",
  i9Central:
    "https://www.uscis.gov/i-9-central/form-i-9-related-news/form-i-751-and-i-829-48-month-extension",
  conditionalResidence:
    "https://www.uscis.gov/green-card/after-we-grant-your-green-card/conditional-permanent-residence",
  processingTimes: "https://egov.uscis.gov/processing-times/",
  fileOnline: "https://www.uscis.gov/file-online",
} as const;

export const I751_FACTS = {
  /** USCIS fee schedule, Form G-1055, edition 09/09/26. */
  paperFee: "$750",
  onlineFee: "$700",
  feeNote:
    "Filing online is $50 cheaper. There is no separate biometrics fee — it is included. A conditional resident, spouse or child filing a waiver based on battery or extreme cruelty pays nothing.",
  feeEdition: "G-1055, edition 09/09/26",
  /** Days before the card expires that the filing window opens. */
  windowDays: 90,
  /** Conditional residence lasts two years. */
  conditionalYears: 2,
  /** Months the receipt notice extends conditional status AND work authorization. */
  extensionMonths: 48,
  extensionSince: "2023-01-25",
  lastVerified: "2026-09-16",
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
    who: "You are still married to the US citizen or permanent resident who petitioned for you, and you are both signing.",
    windowApplies: true,
    timing:
      "You must file in the 90 days immediately before your conditional card expires. File earlier and USCIS rejects it; file later and your status has already terminated.",
  },
  {
    id: "waiver",
    label: "Waiver of the joint filing requirement",
    who: "The marriage ended in divorce or annulment, your spouse died, you or your child suffered battery or extreme cruelty, or removal would cause extreme hardship.",
    windowApplies: false,
    timing:
      "The 90-day window does not apply to you. A waiver request can be filed at any time after you become a conditional resident, up until a final removal order is issued — you do not have to wait, and you are not shut out by a date that has passed.",
  },
];

/** Waiver grounds, for the page copy and the tool's branch. */
export const I751_WAIVER_GROUNDS: { title: string; detail: string }[] = [
  {
    title: "The marriage ended in divorce or annulment",
    detail:
      "You have to show the marriage was entered into in good faith, not that it lasted. A final decree is normally required, which is why a pending divorce often means filing jointly first and converting later.",
  },
  {
    title: "Your spouse died",
    detail:
      "The good-faith test is the same. The death certificate replaces the joint signature.",
  },
  {
    title: "You or your child suffered battery or extreme cruelty",
    detail:
      "Filed by the conditional resident alone. There is no fee for this waiver ground.",
  },
  {
    title: "Removal would cause extreme hardship",
    detail:
      "Judged on hardship that arose during the conditional residence period, not hardship that existed before it.",
  },
];

/** Evidence categories, strongest first. */
export const I751_EVIDENCE: { category: string; examples: string; weight: string }[] = [
  {
    category: "Shared finances",
    examples:
      "Joint bank statements across the whole two years, joint tax returns (transcripts), shared credit cards, one spouse named as beneficiary on the other's 401(k) or life insurance.",
    weight: "Strongest",
  },
  {
    category: "Living together",
    examples:
      "A lease or deed with both names, utility bills, home or renter's insurance listing both, mail addressed to each of you at the same address over time.",
    weight: "Strongest",
  },
  {
    category: "Children",
    examples:
      "Birth certificates naming both parents, school records, paediatric records listing both parents.",
    weight: "Decisive when it exists",
  },
  {
    category: "Insurance and benefits",
    examples:
      "Health insurance listing the spouse as a dependent, employer benefit enrolment forms, beneficiary designations.",
    weight: "Strong",
  },
  {
    category: "Life together over time",
    examples:
      "Photos across the two years rather than only the wedding, travel itineraries, correspondence, affidavits from people who know you both.",
    weight: "Supporting",
  },
];
