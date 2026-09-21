/**
 * USCIS expedite requests — criteria, channels and the premium-processing bar.
 *
 * Read from the USCIS Expedite Requests page and Policy Manual Vol. 1, Pt. A,
 * Ch. 5. These are POLICY facts, not workload figures, so they move when USCIS
 * issues guidance rather than monthly — but the request channels in particular
 * have changed before, so re-read both when anything in this area is edited.
 *
 * Educational only. Not legal advice.
 */

import { premiumProcessing } from "@/lib/premiumProcessing";

export const EXPEDITE_SOURCES = {
  expeditePage: "https://www.uscis.gov/forms/filing-guidance/expedite-requests",
  policyManual: "https://www.uscis.gov/policy-manual/volume-1-part-a-chapter-5",
  premiumProcessing:
    "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
  formI907: "https://www.uscis.gov/i-907",
  feeSchedule: "https://www.uscis.gov/g-1055",
  contactCenter: "https://www.uscis.gov/contactcenter",
  myUscis: "https://my.uscis.gov/",
  processingTimes: "https://egov.uscis.gov/processing-times/",
  eRequest: "https://egov.uscis.gov/e-request/displayForm.do?entryPoint=init",
} as const;

export const EXPEDITE_UPDATED = "2026-09-16";

export interface ExpediteCriterion {
  id: string;
  /** USCIS's own wording. */
  label: string;
  /** What it actually covers, in plain terms. */
  meaning: string;
  /** The question the checker asks. */
  question: string;
  /** Evidence USCIS expects for this criterion. */
  evidence: string[];
  /** Whether an ordinary individual applicant can realistically use it. */
  realistic: boolean;
}

export const EXPEDITE_CRITERIA: ExpediteCriterion[] = [
  {
    id: "financial-loss",
    label: "Severe financial loss to a company or person",
    meaning:
      "Loss that is severe and that you did not cause by filing late or responding late. A job offer about to be withdrawn, or a business that cannot operate without this person, can qualify. Ordinary inconvenience, or losing income you were never authorised to earn, does not.",
    question:
      "Will you or a company suffer severe financial loss that is not the result of filing or responding late?",
    evidence: [
      "Employer letter on letterhead stating what is lost and by when",
      "The job offer or contract with its expiry date",
      "Evidence of the loss itself — a lease, a loan, a payroll obligation",
    ],
    realistic: true,
  },
  {
    id: "emergency",
    label: "Emergencies and urgent humanitarian situations",
    meaning:
      "A death or serious illness in the family, urgent medical treatment, or a comparable situation where timing genuinely matters. This is the criterion most individual applicants use, and the one most often supported by a single strong document.",
    question:
      "Is there an emergency or an urgent humanitarian situation — a death, a serious illness, urgent treatment?",
    evidence: [
      "Death certificate, or a letter from the funeral home or hospital",
      "A doctor's letter setting out the diagnosis and why the timing matters",
      "Evidence of the relationship to the person involved",
    ],
    realistic: true,
  },
  {
    id: "nonprofit",
    label: "Nonprofit organization whose request furthers US cultural or social interests",
    meaning:
      "For IRS-designated nonprofits only. This is also the single exception to the rule that you cannot expedite where premium processing is available.",
    question:
      "Is the request being made by an IRS-designated nonprofit, and does it further a US cultural or social interest?",
    evidence: [
      "Evidence of the IRS nonprofit designation",
      "An explanation of the cultural or social interest served",
    ],
    realistic: false,
  },
  {
    id: "government-interests",
    label: "US government interests",
    meaning:
      "Cases a federal agency identifies as urgent, including public safety and national security matters. In practice the agency raises this, not the applicant.",
    question:
      "Has a US government agency identified your case as urgent on its own initiative?",
    evidence: ["A request or letter from the federal agency concerned"],
    realistic: false,
  },
  {
    id: "uscis-error",
    label: "Clear USCIS error",
    meaning:
      "USCIS made a mistake — a misrouted file, a card produced with the wrong details, a notice sent to an address you never gave. You are asking them to fix their own error, not to jump the queue.",
    question:
      "Did USCIS itself make a clear error that caused the delay or the problem?",
    evidence: [
      "The USCIS notice or card showing the error",
      "Your own correct filing showing what it should have said",
      "Any prior correspondence about it",
    ],
    realistic: true,
  },
];

/** How to actually submit one. */
export const EXPEDITE_CHANNELS: { channel: string; detail: string }[] = [
  {
    channel: "Your USCIS online account",
    detail:
      "Secure messaging, selecting 'expedite' as the reason. The cleanest route because the request and your evidence land in the file together.",
  },
  {
    channel: "The USCIS Contact Center",
    detail: "By phone, with your receipt number and an explanation of the need.",
  },
  {
    channel: "Ask Emma",
    detail: "The automated assistant on uscis.gov, which can route an expedite request.",
  },
  {
    channel: "A field office appointment",
    detail: "Required for certain case types, including T and U nonimmigrant status.",
  },
];

export const EXPEDITE_FACTS = {
  /**
   * The rule that decides most cases before any criterion is reached: USCIS
   * will not consider an expedite request where premium processing is
   * available for that filing category, unless the petitioner is an
   * IRS-designated nonprofit.
   */
  premiumBar:
    "USCIS will not consider an expedite request for a petition or application where premium processing service is available, unless the petitioner is an IRS-designated nonprofit.",
  /** USCIS does not publish a decision timeframe, and says so. */
  noPublishedTimeframe:
    "USCIS publishes no timeframe for deciding an expedite request, and states that it generally does not explain expedite decisions.",
  premiumEffectiveDate: premiumProcessing.effectiveDate,
  premiumSourceUrl: premiumProcessing.officialSourceUrl,
  lastVerified: EXPEDITE_UPDATED,
} as const;

/** Forms most commonly asked about, and whether premium processing exists for them. */
export interface PremiumAvailability {
  form: string;
  label: string;
  premiumAvailable: boolean;
  fee?: string;
  note: string;
}

export const PREMIUM_AVAILABILITY: PremiumAvailability[] = [
  {
    form: "I-129",
    label: "H-1B, L-1, O-1 and similar worker petitions",
    premiumAvailable: true,
    fee: "$2,965",
    note: "Premium is available, so an expedite request will not be considered — pay for premium instead.",
  },
  {
    form: "I-140",
    label: "Employment-based immigrant petition (EB-1, EB-2, EB-3)",
    premiumAvailable: true,
    fee: "$2,965",
    note: "Premium is available. Note it speeds the petition, not the visa bulletin.",
  },
  {
    form: "I-765",
    label: "Employment authorisation — F-1 OPT and STEM OPT categories",
    premiumAvailable: true,
    fee: "$1,780",
    note: "Premium is available for the OPT and STEM OPT categories only, not for every EAD category.",
  },
  {
    form: "I-765",
    label: "Employment authorisation — other categories, including based on a pending I-485",
    premiumAvailable: false,
    note: "No premium option, so an expedite request is available on the criteria. This is the common H-4 and adjustment-based EAD case.",
  },
  {
    form: "I-539",
    label: "Extend or change nonimmigrant status — F, J, M categories",
    premiumAvailable: true,
    fee: "$2,075",
    note: "Premium is available for those categories. H-4 and L-2 extensions are the ones people usually ask about — check the current I-907 page before assuming.",
  },
  {
    form: "I-485",
    label: "Adjustment of status",
    premiumAvailable: false,
    note: "No premium option. Expedite on the criteria, but the visa bulletin still governs whether a number is available at all.",
  },
  {
    form: "I-131",
    label: "Advance parole / re-entry permit",
    premiumAvailable: false,
    note: "No premium option. Emergency advance parole through a field office is a separate route for genuine emergencies.",
  },
  {
    form: "I-90",
    label: "Replace or renew a green card",
    premiumAvailable: false,
    note: "No premium option. Expedite on the criteria.",
  },
  {
    form: "N-400",
    label: "Naturalisation",
    premiumAvailable: false,
    note: "No premium option. Expedite on the criteria.",
  },
  {
    form: "I-751",
    label: "Remove conditions on residence",
    premiumAvailable: false,
    note: "No premium option. The receipt notice already extends status 48 months, which is usually the real answer to the worry behind the request.",
  },
];

/* ═══════════════ the escalation ladder (depth pass, 2026-09-20) ══════════ */

/**
 * What to do when no expedite criterion applies — which is most readers, and
 * which the page previously left as a dead end.
 *
 * These are four DIFFERENT mechanisms, not four flavours of "asking nicely".
 * They have different prerequisites, different deciders and different powers,
 * and the order below is the order they unlock in: you cannot skip to the
 * Ombudsman without having gone through USCIS first, by the Ombudsman's own
 * rule.
 *
 * Verified 2026-09-20 against the sources in ESCALATION_SOURCES.
 * Educational only. Not legal advice — a mandamus action in particular is
 * federal litigation and is not something this site is advising anyone to file.
 */

export const ESCALATION_SOURCES = {
  eRequestOnpt:
    "https://egov.uscis.gov/e-request/displayONPTForm.do;entryPoint=init&sroPageType=onpt",
  srmtPolicy: "https://www.uscis.gov/policy-manual/volume-1-part-a-chapter-4",
  processingTimesFaq:
    "https://egov.uscis.gov/processing-times/processing-times-faqs",
  ombudsmanHow: "https://www.dhs.gov/case-assistance",
  ombudsmanForm: "https://www.dhs.gov/publication/form-dhs-7001-instructions",
  findRepresentative: "https://www.house.gov/representatives/find-your-representative",
  findSenator: "https://www.senate.gov/senators/senators-contact.htm",
  privacyAct: "https://www.law.cornell.edu/uscode/text/5/552a",
  mandamusStatute: "https://www.law.cornell.edu/uscode/text/28/1361",
  courtFees: "https://www.uscourts.gov/court-programs/fees/district-court-miscellaneous-fee-schedule",
  filingFeeStatute: "https://www.law.cornell.edu/uscode/text/28/1914",
} as const;

export const ESCALATION_UPDATED = "2026-09-20";

export interface EscalationRung {
  id: string;
  /** Order on the ladder, 1 = try first. */
  step: number;
  name: string;
  /** Who actually decides / acts. */
  decider: string;
  /** What you have to have done before this one is open to you. */
  prerequisite: string;
  /** Out-of-pocket cost. */
  cost: string;
  /** Published turnaround, or the honest absence of one. */
  timeframe: string;
  /** What it can actually achieve. */
  canDo: string;
  /** What it cannot, however well you argue it. */
  cannotDo: string;
  /** Which source this rung was read from. */
  sourceKey: keyof typeof ESCALATION_SOURCES;
}

export const ESCALATION_RUNGS: EscalationRung[] = [
  {
    id: "onpt",
    step: 1,
    name: "Case inquiry — outside normal processing time",
    decider: "The USCIS office holding your file",
    prerequisite:
      "Your receipt date must be earlier than the case inquiry date USCIS publishes for your form, category and office. If your form is not listed at all, six months pending is the fallback.",
    cost: "Free",
    timeframe:
      "USCIS sets a target completion date by category and states a general goal of 15 business days to resolve a service request.",
    canDo:
      "Puts a service request in front of the officer and produces a written answer about where the case stands.",
    cannotDo:
      "It is not an expedite. It does not move you up the queue, and a very common reply is simply that the case remains within normal processing time.",
    sourceKey: "srmtPolicy",
  },
  {
    id: "congressional",
    step: 2,
    name: "Congressional inquiry",
    decider: "Your Representative's or Senator's casework staff, who ask USCIS",
    prerequisite:
      "You must live in the district or state. Every office requires your written consent before USCIS may discuss your file with them — the Privacy Act bars the disclosure without it.",
    cost: "Free",
    timeframe:
      "No published standard. Each office runs its own casework process and its own queue.",
    canDo:
      "Reaches a dedicated USCIS congressional liaison rather than the general Contact Center, which is why it often produces a more specific answer than rung 1 did.",
    cannotDo:
      "It confers no legal priority. A member of Congress cannot instruct USCIS to approve, deny or reorder anything.",
    sourceKey: "privacyAct",
  },
  {
    id: "ombudsman",
    step: 3,
    name: "CIS Ombudsman — DHS Form 7001",
    decider:
      "The DHS Office of the Citizenship and Immigration Services Ombudsman, independent of USCIS",
    prerequisite:
      "You must have contacted USCIS within the last 90 days and given USCIS at least 60 days to resolve the problem. Rung 1 is how most people satisfy that, so keep your service request numbers.",
    cost: "Free",
    timeframe:
      "No published decision timeframe. The Ombudsman asks USCIS to look again; it does not run its own clock.",
    canDo:
      "Independent review of a case that is stuck, and the office that is best placed to surface an actual USCIS error.",
    cannotDo:
      "It cannot decide your case, overrule USCIS, or make a legal determination. It is an escalation, not an appeal.",
    sourceKey: "ombudsmanHow",
  },
  {
    id: "mandamus",
    step: 4,
    name: "Mandamus action in federal district court",
    decider: "A federal judge",
    prerequisite:
      "A clear duty USCIS owes you that it has unreasonably failed to perform. In practice this means genuine, documented delay and a lawyer — this is federal litigation, not a form.",
    cost:
      "$350 statutory filing fee under 28 U.S.C. § 1914(a) plus a $55 administrative fee, before any legal representation.",
    timeframe:
      "Set by the court's schedule. The government has 60 days to respond to a complaint against a federal agency.",
    canDo:
      "Compels USCIS to make a decision on a case it has unreasonably delayed.",
    cannotDo:
      "It cannot compel a favourable decision. A court can order USCIS to decide; the decision it then makes may be a denial.",
    sourceKey: "mandamusStatute",
  },
];

/**
 * The honest framing the whole section hangs on. Three of the four rungs are
 * free, none of them is an expedite, and the first one is the only one most
 * people ever need.
 */
export const ESCALATION_FACTS = {
  srmtGoal: "15 business days",
  ombudsmanContactWindowDays: 90,
  ombudsmanUscisDays: 60,
  mandamusFilingFee: 350,
  mandamusAdminFee: 55,
  get mandamusTotalFee() {
    return this.mandamusFilingFee + this.mandamusAdminFee;
  },
  lastVerified: ESCALATION_UPDATED,
} as const;
