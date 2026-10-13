/**
 * L-1 intracompany transferee data: L-1A vs L-1B, the qualifying relationship,
 * blanket L, the stay caps, the fee stack and the admissions statistics.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROVENANCE — read before editing
 *
 * Definitions and rules are quoted from 8 CFR 214.2(l), read from the eCFR
 * title-8 API at issue date 2026-10-08. `text` fields are the regulation's own
 * wording; `plain` fields are ours.
 *
 * Fees come from Form G-1055, edition 10/07/26. The premium-processing figure
 * is read from src/lib/premiumProcessing.ts, not duplicated here.
 *
 * TWO THINGS THAT ARE EASY TO GET WRONG AND EXPENSIVE TO GET WRONG:
 *
 * 1. The 5-year and 7-year caps in (l)(12) are on time spent "under section
 *    101(a)(15)(L) and/or (H)" — COMBINED. H-1B years consume L-1A years. Every
 *    competitor guide we read states the caps without that interaction. The
 *    calculator in src/lib/calc/l1Stay.ts implements the combined rule and its
 *    test locks it in.
 *
 * 2. The REGULATION at (l)(7)(ii) still says an L-2 spouse may not work without
 *    separate authorization. That text has been overtaken by USCIS policy: since
 *    12 November 2021 certain L-2 spouses are employment authorized incident to
 *    status, and since 30 January 2022 they receive an I-94 annotated L-2S. Both
 *    facts belong on the page — the gap between the rule as written and the rule
 *    as applied is exactly what confuses readers and employers. Do not "correct"
 *    the regulation quote to match current practice.
 *
 * Admissions counts are DHS OHSS, Yearbook of Immigration Statistics FY2024,
 * Table 26 and Nonimmigrant Supplemental Table 1, rounded to the nearest 10 by
 * OHSS. They are ADMISSIONS, not people and not visas issued.
 *
 * What is deliberately NOT here: L-1 RFE and denial rates. USCIS publishes
 * I-129 adjudication data, but not in a form reachable and verifiable from this
 * environment, and travel.state.gov blocks automated requests entirely. See
 * docs/seo/oct-2026-cluster/gap-l1-visa.md.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Educational only. Not legal advice.
 */

export const L1_VERIFIED = "2026-10-13";
export const L1_UPDATED = "2026-10-13";
export const L1_PUBLISHED = "2026-10-13";

export const L1_SOURCES = {
  cfr: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2#p-214.2(l)",
  uscisL1a:
    "https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager",
  uscisL1b:
    "https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1b-intracompany-transferee-specialized-knowledge",
  feeSchedule: "https://www.uscis.gov/g-1055",
  i129: "https://www.uscis.gov/i-129",
  i129s: "https://www.uscis.gov/i-129s",
  i907: "https://www.uscis.gov/i-907",
  biometricFeeRule:
    "https://www.federalregister.gov/documents/2026/08/10/2026-16231/9-11-response-and-biometric-entry-exit-fee-for-h-1b-and-l-1-visas",
  spousePolicyManual: "https://www.uscis.gov/policy-manual/volume-10-part-b-chapter-2",
  i9Handbook:
    "https://www.uscis.gov/i-9-central/form-i-9-resources/handbook-for-employers-m-274/70-evidence-of-employment-authorization-for-certain-categories/79-other-temporary-workers/792-l-nonimmigrant-status",
  yearbook: "https://ohss.dhs.gov/topics/immigration/yearbook",
  uscisData: "https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data",
} as const;

/* ══════════════════════ 1. The two classifications ═══════════════════════ */

export interface L1Class {
  id: "l1a" | "l1b";
  code: string;
  label: string;
  /** The regulation's test, in its own words. */
  test: string;
  maxYears: 5 | 7;
  cite: string;
  blanketEligible: string;
}

export const L1_CLASSES: L1Class[] = [
  {
    id: "l1a",
    code: "L-1A",
    label: "Manager or executive",
    test:
      "A managerial or executive capacity, each with its own four-part definition in the regulation. Managing people is not the only route — managing an essential function qualifies.",
    maxYears: 7,
    cite: "8 CFR 214.2(l)(1)(ii)(B)–(C)",
    blanketEligible: "Yes — managers and executives are covered by a blanket petition.",
  },
  {
    id: "l1b",
    code: "L-1B",
    label: "Specialized knowledge",
    test:
      "Special knowledge of the organisation's product, service, research, equipment, techniques or management and its application in international markets, OR an advanced level of knowledge or expertise in the organisation's processes and procedures.",
    maxYears: 5,
    cite: "8 CFR 214.2(l)(1)(ii)(D)",
    blanketEligible:
      "Only if you are a specialized knowledge PROFESSIONAL — a member of the professions under INA 101(a)(32), which in practice means a degree. An L-1B without one cannot use the employer's blanket at all and needs an individual petition.",
  },
];

/** Verbatim (l)(1)(ii)(B) — managerial capacity. All four parts. */
export const MANAGERIAL_CAPACITY = {
  cite: "8 CFR 214.2(l)(1)(ii)(B)",
  parts: [
    "Manages the organization, or a department, subdivision, function, or component of the organization;",
    "Supervises and controls the work of other supervisory, professional, or managerial employees, or manages an essential function within the organization, or a department or subdivision of the organization;",
    "Has the authority to hire and fire or recommend those as well as other personnel actions (such as promotion and leave authorization) if another employee or other employees are directly supervised; if no other employee is directly supervised, functions at a senior level within the organizational hierarchy or with respect to the function managed; and",
    "Exercises discretion over the day-to-day operations of the activity or function for which the employee has authority.",
  ],
  functionManager:
    "The second part is the one worth reading twice. \"Manages an essential function\" is an alternative to supervising people, which is how a principal engineer or a function owner with no direct reports can still be L-1A. USCIS scrutinises function-manager petitions hard, and the evidence has to describe the function, not the person.",
} as const;

/** Verbatim (l)(1)(ii)(C) — executive capacity. */
export const EXECUTIVE_CAPACITY = {
  cite: "8 CFR 214.2(l)(1)(ii)(C)",
  parts: [
    "Directs the management of the organization or a major component or function of the organization;",
    "Establishes the goals and policies of the organization, component, or function;",
    "Exercises wide latitude in discretionary decision-making; and",
    "Receives only general supervision or direction from higher level executives, the board of directors, or stockholders of the organization.",
  ],
} as const;

/** Verbatim (l)(1)(ii)(D)–(E) — specialized knowledge. */
export const SPECIALIZED_KNOWLEDGE = {
  cite: "8 CFR 214.2(l)(1)(ii)(D)",
  text:
    "Specialized knowledge means special knowledge possessed by an individual of the petitioning organization's product, service, research, equipment, techniques, management, or other interests and its application in international markets, or an advanced level of knowledge or expertise in the organization's processes and procedures.",
  professionalCite: "8 CFR 214.2(l)(1)(ii)(E)",
  professionalText:
    "Specialized knowledge professional means an individual who has specialized knowledge as defined in paragraph (l)(1)(ii)(D) of this section and is a member of the professions as defined in section 101(a)(32) of the Immigration and Nationality Act.",
  plain:
    "Two routes, joined by \"or\". Either knowledge specific to this company's products or methods and how they apply in international markets, or advanced knowledge of this company's own processes. Neither route is satisfied by being good at a widely-held skill: a strong Java engineer is not, without more, an L-1B.",
} as const;

/* ══════════════════ 2. The one-year-in-three rule ════════════════════════ */

export const ONE_YEAR_RULE = {
  cite: "8 CFR 214.2(l)(1)(ii)(A)",
  text:
    "Intracompany transferee means an alien who, within three years preceding the time of his or her application for admission into the United States, has been employed abroad continuously for one year by a firm or corporation or other legal entity or parent, branch, affiliate, or subsidiary thereof, and who seeks to enter the United States temporarily in order to render his or her services to a branch of the same employer or a parent, affiliate, or subsidiary thereof in a capacity that is managerial, executive, or involves specialized knowledge.",
  usTimeText:
    "Periods spent in the United States in lawful status for a branch of the same employer or a parent, affiliate, or subsidiary thereof and brief trips to the United States for business or pleasure shall not be interruptive of the one year of continuous employment abroad but such periods shall not be counted toward fulfillment of that requirement.",
  /** The half of the rule that costs people a filing. */
  trap:
    "Read the second sentence twice. Time you spent in the United States for the same company group does not break your continuous year — but it does not count toward it either. An engineer who spent five of the last thirty-six months on a US client site has thirty-one countable months abroad, not thirty-six. Where those five months fall decides whether a continuous twelve-month block still exists inside the three-year window.",
  continuous:
    "Continuous means continuous. Twelve months in two six-month blocks separated by a year in a different group company is not one continuous year, even though the total is twelve months.",
} as const;

/* ══════════════════ 3. The qualifying relationship ═══════════════════════ */

export interface RelationshipDef {
  term: string;
  text: string;
  cite: string;
  plain?: string;
}

export const QUALIFYING_RELATIONSHIPS: RelationshipDef[] = [
  {
    term: "Qualifying organization",
    cite: "8 CFR 214.2(l)(1)(ii)(G)",
    text:
      "A United States or foreign firm, corporation, or other legal entity which: meets exactly one of the qualifying relationships specified in the definitions of a parent, branch, affiliate or subsidiary; is or will be doing business (engaging in international trade is not required) as an employer in the United States and in at least one other country directly or through a parent, branch, affiliate, or subsidiary for the duration of the alien's stay in the United States as an intracompany transferee; and otherwise meets the requirements of section 101(a)(15)(L) of the Act.",
    plain:
      "Three conditions, and the second is the one that fails petitions: both entities have to be doing business as employers, in two countries, for the whole of your stay. If the Indian entity winds down while you are in the US, the relationship that supports your status goes with it.",
  },
  {
    term: "Parent",
    cite: "8 CFR 214.2(l)(1)(ii)(I)",
    text: "A firm, corporation, or other legal entity which has subsidiaries.",
  },
  {
    term: "Branch",
    cite: "8 CFR 214.2(l)(1)(ii)(J)",
    text: "An operating division or office of the same organization housed in a different location.",
  },
  {
    term: "Subsidiary",
    cite: "8 CFR 214.2(l)(1)(ii)(K)",
    text:
      "A firm, corporation, or other legal entity of which a parent owns, directly or indirectly, more than half of the entity and controls the entity; or owns, directly or indirectly, half of the entity and controls the entity; or owns, directly or indirectly, 50 percent of a 50-50 joint venture and has equal control and veto power over the entity; or owns, directly or indirectly, less than half of the entity, but in fact controls the entity.",
    plain:
      "Four separate ways to be a subsidiary, and the last one does not need any particular shareholding — de facto control is enough. That is the route a minority-held Indian entity uses.",
  },
  {
    term: "Affiliate",
    cite: "8 CFR 214.2(l)(1)(ii)(L)",
    text:
      "One of two subsidiaries both of which are owned and controlled by the same parent or individual, or one of two legal entities owned and controlled by the same group of individuals, each individual owning and controlling approximately the same share or proportion of each entity.",
    plain:
      "Sister companies under a common parent, or two companies owned in roughly the same proportions by the same people. The regulation adds a third, narrow affiliate route for international accounting partnerships.",
  },
  {
    term: "Doing business",
    cite: "8 CFR 214.2(l)(1)(ii)(H)",
    text:
      "The regular, systematic, and continuous provision of goods and/or services by a qualifying organization and does not include the mere presence of an agent or office of the qualifying organization in the United States and abroad.",
    plain:
      "A registered entity with a bank account and no trading activity is not doing business. This is what rules out the shell-company route.",
  },
];

/* ══════════════════ 4. New office L-1 ════════════════════════════════════ */

export const NEW_OFFICE = {
  definitionCite: "8 CFR 214.2(l)(1)(ii)(F)",
  definition:
    "New office means an organization which has been doing business in the United States through a parent, branch, affiliate, or subsidiary for less than one year.",
  validity: "One year, not three.",
  validityCite: "8 CFR 214.2(l)(7)(i)(A)(3)",
  managerEvidenceCite: "8 CFR 214.2(l)(3)(v)",
  managerEvidence: [
    "Sufficient physical premises to house the new office have been secured",
    "The beneficiary has been employed for one continuous year in the three years preceding the filing in an executive or managerial capacity, and that the proposed employment involves executive or managerial authority over the new operation",
    "The intended US operation, within one year of approval, will support an executive or managerial position — supported by information on the proposed nature of the office, the size of the US investment and the foreign entity's financial ability to pay you and to commence doing business, and the organisational structure of the foreign entity",
  ],
  skEvidenceCite: "8 CFR 214.2(l)(3)(vi)",
  skEvidence: [
    "Sufficient physical premises to house the new office have been secured",
    "The employer has the financial ability to compensate the beneficiary and to begin doing business in the United States",
  ],
  extensionCite: "8 CFR 214.2(l)(14)(ii)",
  extensionTrap:
    "The first year is the easy part. To extend, the petitioner has to show the new office is now doing business as the regulation defines it — regular, systematic and continuous provision of goods or services — along with evidence of the US staffing, the activity actually conducted and the financial position. A new-office L-1 that spent its first year on setup and has no trading record is the classic extension denial.",
} as const;

/* ══════════════════ 5. Blanket L ═════════════════════════════════════════ */

export const BLANKET_L = {
  cite: "8 CFR 214.2(l)(4)(i)",
  gate: [
    "The petitioner and each entity are engaged in commercial trade or services",
    "The petitioner has an office in the United States that has been doing business for one year or more",
    "The petitioner has three or more domestic and foreign branches, subsidiaries or affiliates",
  ],
  oneOfThree: [
    "Approved petitions for at least ten L managers, executives or specialized knowledge professionals in the previous 12 months",
    "US subsidiaries or affiliates with combined annual sales of at least $25 million",
    "A United States work force of at least 1,000 employees",
  ],
  whoIsCovered:
    "Managers, executives and specialized knowledge PROFESSIONALS only. A specialized-knowledge worker who is not a member of the professions cannot be certified under a blanket and needs an individual petition.",
  whoIsCoveredCite: "8 CFR 214.2(l)(4)(ii)",
  validity:
    "A blanket petition is valid initially for three years and may be extended indefinitely thereafter if the qualifying organisations have complied with the regulations.",
  validityCite: "8 CFR 214.2(l)(7)(i)(B)(2)",
  mechanics:
    "The entity completes Form I-129S, Certificate of Eligibility for Intracompany Transferee under a Blanket Petition, in an original and three copies, keeps one, and sends the original and two copies to you with a copy of the approved Form I-797 attached to each. You take those to the consulate.",
  mechanicsCite: "8 CFR 214.2(l)(5)(ii)(A)",
  admissionPeriod:
    "At inspection both copies of the I-129S are stamped with a validity period not to exceed three years. A blanket beneficiary may be admitted for three years even if the blanket petition's own validity expires sooner.",
  admissionPeriodCite: "8 CFR 214.2(l)(5)(ii)(E), (l)(11)",
  /** The risk no competitor guide states. */
  finality:
    "If the consular officer decides you are not eligible under the blanket, that decision is FINAL. There is no appeal. The officer records the reasons on the I-129S, returns the original to the USCIS office that approved the blanket, and gives you a copy. Your employer can then file an individual petition for you, stating that you were denied under the blanket and naming the post and date — but that is a fresh filing, with a fresh fee and fresh processing time, started from India.",
  finalityCite: "8 CFR 214.2(l)(5)(ii)(F)",
  clearlyApprovable:
    "Consular officers may grant L classification under a blanket only in clearly approvable applications. A borderline specialized-knowledge case is, by definition, not clearly approvable — which is why a marginal L-1B is usually better filed as an individual petition in the first place.",
  reassignment:
    "Once admitted under a blanket you may be reassigned to any organisation listed in the approved petition without going back to USCIS — but only if you will be performing virtually the same job duties. Different duties require a new Certificate of Eligibility, approved by the director who approved the blanket.",
  reassignmentCite: "8 CFR 214.2(l)(5)(ii)(G)",
  noDoubleTrack:
    "The employer may not seek L classification for the same person under both the blanket and an individual petition, unless a consular officer has already denied eligibility under the blanket.",
  noDoubleTrackCite: "8 CFR 214.2(l)(4)(iii)",
} as const;

/* ══════════════════ 6. The stay caps ═════════════════════════════════════ */

export const L1_STAY_CAPS = {
  cite: "8 CFR 214.2(l)(12)(i)",
  text:
    "An alien who has spent five years in the United States in a specialized knowledge capacity or seven years in the United States in a managerial or executive capacity under section 101(a)(15)(L) and/or (H) of the Act may not be readmitted to the United States under section 101(a)(15)(L) or (H) of the Act unless the alien has resided and been physically present outside the United States, except for brief visits for business or pleasure, for the immediate prior year.",
  l1aYears: 7,
  l1bYears: 5,
  /** The sentence this whole page exists to put in front of people. */
  combined:
    "Read \"and/or (H)\". The cap counts time in the United States under L status and H status together. Four years on an H-1B leaves three years of L-1A, not seven, and leaves one year of L-1B, not five. Nothing about changing employer, changing company group or changing classification resets it.",
  reset:
    "The only reset is a year abroad: residence AND physical presence outside the United States, except for brief visits for business or pleasure, for the immediate prior year. Those brief visits do not interrupt the year — and they do not count toward it either.",
  evidence:
    "On a new petition after a year abroad, the petitioner must supply information about your employment, your place of residence, and the dates and purpose of every trip to the United States in that year.",
  blanketToo:
    "A consular or USCIS officer may not grant L classification under a blanket petition to someone who has already spent the maximum time, either. The blanket route is not a way around the cap.",
  notCountedNote:
    "Time spent outside the United States does not count against the cap, which is the basis of a recapture claim — the same mechanic H-1B holders use. Your I-94 travel history is the evidence.",
} as const;

/** Individual petition validity, and admission. */
export const L1_PERIODS = [
  {
    label: "Individual petition validity",
    value: "Up to 3 years",
    note: "The period of established need for your services, not to exceed three years — except for a new office.",
    cite: "8 CFR 214.2(l)(7)(i)(A)(2)",
  },
  {
    label: "New office petition validity",
    value: "1 year",
    note: "Extended only on evidence that the US entity is now doing business.",
    cite: "8 CFR 214.2(l)(7)(i)(A)(3)",
  },
  {
    label: "Maximum admission period",
    value: "3 years at a time",
    note: "No L admission exceeds three years unless an extension of stay is granted.",
    cite: "8 CFR 214.2(l)(11)",
  },
  {
    label: "Maximum total stay — L-1A",
    value: "7 years",
    note: "Counting L and H time in the United States together.",
    cite: "8 CFR 214.2(l)(12)(i)",
    highlight: true,
  },
  {
    label: "Maximum total stay — L-1B",
    value: "5 years",
    note: "Counting L and H time in the United States together.",
    cite: "8 CFR 214.2(l)(12)(i)",
    highlight: true,
  },
  {
    label: "Must be in the US to file an extension of stay",
    value: "Yes",
    note: "The beneficiary must be physically present in the United States when the extension of stay is filed.",
    cite: "8 CFR 214.2(l)(15)(i)",
  },
] as const;

/* ══════════════════ 7. L-1 Visa Reform Act 2004 ══════════════════════════ */

export const L1B_OFFSITE_RULE = {
  act: "L-1 Visa Reform Act of 2004",
  appliesFrom: "Petitions filed on or after 6 June 2005",
  cite: "INA 214(c)(2)(F)",
  aimedAt:
    "Petitions for L-1B employees who will be stationed primarily at the worksite of an employer other than the petitioning employer or its affiliate, subsidiary or parent.",
  tests: [
    "The employee will not be principally controlled or supervised by such an unaffiliated employer; and",
    "The work being provided by the employee is not considered to be labor for hire by such an unaffiliated employer.",
  ],
  whyItMatters:
    "This is the provision that governs a client-site placement, which is how a large part of the Indian IT services industry actually deploys people. If you will sit at a bank or a retailer rather than at your employer's own office, the petition has to assert and evidence both tests — who directs your work, and that your employer is delivering a service rather than supplying a body. It is the most RFE-prone L-1B fact pattern there is, and the petition, not you, carries the burden.",
} as const;

/* ══════════════════ 8. Fees ══════════════════════════════════════════════ */

export const L1_FEE_SCHEDULE_EDITION = "10/07/26";

export interface L1Fee {
  label: string;
  regular: string;
  reduced: string | null;
  who: string;
  note?: string;
  highlight?: boolean;
}

export const L1_FEES: L1Fee[] = [
  {
    label: "Form I-129, L petition — paper filing",
    regular: "$1,385",
    reduced: "$695",
    who: "Petitioner",
    note: "Reduced figure applies to a small employer (25 or fewer full-time equivalent employees) or a nonprofit.",
  },
  {
    label: "Form I-129, L petition — online filing",
    regular: "$1,335",
    reduced: "$695",
    who: "Petitioner",
    note: "Filing online saves $50 at the regular rate.",
  },
  {
    label: "Asylum Program Fee",
    regular: "$600",
    reduced: "$300 small employer · $0 nonprofit",
    who: "Petitioner",
    note: "Applies to every Form I-129 classification. Separate from the base fee.",
  },
  {
    label: "Fraud Prevention and Detection fee",
    regular: "$500",
    reduced: null,
    who: "Petitioner",
    note: "Payable on an L petition seeking initial approval of L status, seeking to employ an L worker currently working for another petitioner, or — for blanket petitions — seeking approval for an L worker to continue employment with a different entity. May not be waived.",
  },
  {
    label: "Public Law 114-113 fee — L-1",
    regular: "$4,500",
    reduced: null,
    who: "Petitioner, if it is a 50/50 employer",
    note: "Non-waivable and non-refundable regardless of the outcome of the petition. See the 50/50 test below.",
    highlight: true,
  },
  {
    label: "Form I-907, premium processing",
    regular: "see the site-wide figure",
    reduced: null,
    who: "Optional",
    note: "Available for L-1, including blanket L-1. Read from the site's central premium-processing record.",
  },
];

/**
 * The 50/50 employer test, quoted from the fee schedule's own wording, plus
 * the change that took effect on 9 September 2026.
 */
export const FIFTY_FIFTY_FEE = {
  amount: "$4,500",
  h1bAmount: "$4,000",
  statute: "Pub. L. 114-113",
  conditions: [
    "The petitioner employs 50 or more individuals in the United States;",
    "More than 50 percent of those employees are in H-1B, L-1A, or L-1B nonimmigrant status; and",
    "The petition is filed on or before 30 September 2027.",
  ],
  exception:
    "The fee applies unless the petitioner is filing an amended petition that does not seek an extension of the beneficiary's currently authorized L-1 status.",
  nonWaivable:
    "When applicable it may not be waived and is not refundable, regardless of any action taken on the petition.",
  source: "Form G-1055, edition 10/07/26, Appendix A",
  /** The 2026 change. */
  extensionChange: {
    rule: "9-11 Response and Biometric Entry-Exit Fee for H-1B and L-1 Visas",
    published: "2026-08-10",
    effective: "2026-09-09",
    what:
      "DHS's final rule extended the fee to extension petitions. Form I-129 petitions postmarked or electronically submitted on or after 9 September 2026 must include the fee as the rule requires, and a 50/50 employer that previously paid it only on new petitions now pays it on renewals too.",
    whoItHits:
      "The 50/50 definition describes a large employer whose US headcount is mostly H-1B and L-1 workers — which is the shape of the major Indian IT services firms. For an employee of one of those companies, every three-year L-1 renewal now carries the fee.",
    yourMoney:
      "It is the petitioner's fee, not yours. An employer requiring a worker to reimburse a fee the statute places on the employer raises a wage-and-hour problem, not a favour.",
  },
} as const;

/* ══════════════════ 9. L-2 and L-2S ══════════════════════════════════════ */

export const L2_SPOUSE = {
  regulationCite: "8 CFR 214.2(l)(7)(ii)",
  regulationText:
    "The spouse and unmarried minor children of the beneficiary are entitled to L nonimmigrant classification, subject to the same period of admission and limits as the beneficiary, if the spouse and unmarried minor children are accompanying or following to join the beneficiary in the United States. Neither the spouse nor any child may accept employment unless he or she has been granted employment authorization.",
  /** The policy position that has overtaken the regulation's last sentence. */
  policyFrom: "2021-11-12",
  policy:
    "Since 12 November 2021 USCIS has considered certain L-2 dependent spouses employment authorized incident to status. They do not need to obtain authorization before working, and they no longer need an EAD — though Form I-765 remains available to anyone who wants the card.",
  annotationFrom: "2022-01-30",
  annotation:
    "Since 30 January 2022 these spouses receive a Form I-94 with class of admission L-2S on admission, or when USCIS approves an extension or change of status.",
  i9:
    "An unexpired Form I-94 annotated L-2S is acceptable as evidence of employment authorization under List C of Form I-9. An I-94 annotated only L-2 is NOT sufficient — which is the practical trap: an older I-94 reading plain L-2 needs the USCIS notice issued to pre-30-January-2022 holders alongside it.",
  children:
    "Children are admitted L-2Y. Children have no work authorization incident to status at any age.",
  whyItMatters:
    "An H-4 spouse generally cannot work until the principal has an approved I-140 or qualifies under AC21, and then only with an EAD that has to be applied for and renewed. An L-2 spouse works from the day they are admitted, with no application and no fee. For a two-income family choosing between an H-1B transfer and an L-1 transfer, that is usually the largest single financial difference between the routes — and it is missing from every L-1-versus-H-1B table we checked.",
} as const;

/* ══════════════════ 10. Dual intent ═════════════════════════════════════ */

export const L1_DUAL_INTENT = {
  cite: "8 CFR 214.2(l)(16)",
  lead:
    "An alien may legitimately come to the United States for a temporary period as an L-1 nonimmigrant and, at the same time, lawfully seek to become a permanent resident of the United States provided he or she intends to depart voluntarily at the end of his or her authorized stay.",
  cannotDeny: [
    "An L-1 petition filed on behalf of the alien",
    "A request to extend an L-1 petition previously filed on behalf of the alien",
    "An application for admission as an L-1, or as an L-2 by the spouse or child",
    "An application for change of status to H-1 or L-2 by the alien, or to H-1, H-4 or L-1 by the L-2 spouse or child",
    "An application for change of status to H-4 by the L-1 holder, if their spouse has been approved as an H-1",
    "An application for extension of stay by the alien, or by the L-2 spouse or child",
  ],
} as const;

/* ══════════════════ 11. Admissions statistics ════════════════════════════ */

/** OHSS Yearbook FY2024 Table 26. Admissions, rounded to the nearest 10. */
export const L1_ADMISSIONS_BY_YEAR = [
  { fy: 2015, l1: 648_610, l2: 269_000, l2s: null, l2y: null },
  { fy: 2016, l1: 680_620, l2: 284_610, l2s: null, l2y: null },
  { fy: 2017, l1: 687_100, l2: 289_410, l2s: null, l2y: null },
  { fy: 2018, l1: 703_100, l2: 290_190, l2s: null, l2y: null },
  { fy: 2019, l1: 698_790, l2: 289_040, l2s: null, l2y: null },
  { fy: 2020, l1: 336_680, l2: 133_970, l2s: null, l2y: null },
  { fy: 2021, l1: 116_120, l2: 66_260, l2s: null, l2y: null },
  { fy: 2022, l1: 305_520, l2: 23_030, l2s: 98_700, l2y: 51_110 },
  { fy: 2023, l1: 503_490, l2: 390, l2s: 148_290, l2y: 100_000 },
  { fy: 2024, l1: 598_330, l2: 70, l2s: 168_840, l2y: 120_350 },
] as const;

export const L2S_SPLIT_NOTE =
  "The L-2 line collapsing to almost nothing from FY2022 while L-2S and L-2Y appear is the employment-authorization change showing up in the admissions data: spouses moved to the L-2S code and children to L-2Y. It is the cleanest official evidence that the policy is in force, and it is why an I-94 that still says plain L-2 is now unusual.";

/** OHSS Yearbook FY2024 Nonimmigrant Supplemental Table 1. */
export const L1_ADMISSIONS_BY_COUNTRY_FY2024 = [
  { country: "Canada", l1: 156_760 },
  { country: "India", l1: 64_910 },
  { country: "Mexico", l1: 62_530 },
  { country: "Brazil", l1: 25_400 },
  { country: "Japan", l1: 22_240 },
  { country: "Korea, South", l1: 21_160 },
  { country: "Germany", l1: 20_130 },
  { country: "Israel", l1: 3_970 },
] as const;

export const L1_INDIA_FY2024 = {
  fy: 2024,
  l1Total: 598_330,
  l1India: 64_910,
  l2sIndia: 27_470,
  l2yIndia: 19_530,
  h1bTotal: 890_310,
  h1bIndia: 497_460,
  source: "DHS OHSS Yearbook of Immigration Statistics FY2024, Nonimmigrant Supplemental Table 1",
} as const;

export const L1_STATS_NOTE =
  "Figures are I-94 admissions, not people and not visas issued: one person entering four times in a year counts four times, and a change of status inside the United States does not appear at all. OHSS rounds published counts to the nearest 10. Use them for shape and share, not as a headcount.";

export const L1_DENIAL_DATA_NOTE =
  "We do not publish an L-1 denial or RFE rate here. USCIS releases I-129 adjudication data, but not in a form we could retrieve and verify against the primary source on the date this page was built, and a figure we cannot trace is worse than none on a page people make decisions from. Check the USCIS immigration and citizenship data page directly if you need it.";

/* ══════════════════ 12. L-1 vs H-1B comparison ══════════════════════════ */

export type L1CompareRoute = "l1a" | "l1b" | "h1b";

export const L1_COMPARE_ROUTES: { id: L1CompareRoute; short: string; label: string }[] = [
  { id: "l1a", short: "L-1A", label: "Manager or executive" },
  { id: "l1b", short: "L-1B", label: "Specialized knowledge" },
  { id: "h1b", short: "H-1B", label: "Specialty occupation" },
];

export interface L1CompareRow {
  label: string;
  values: Record<L1CompareRoute, string>;
  note?: string;
}

export const L1_COMPARISON: L1CompareRow[] = [
  {
    label: "Lottery or cap",
    values: {
      l1a: "Neither",
      l1b: "Neither",
      h1b: "85,000 cap and an annual registration lottery",
    },
  },
  {
    label: "Prior employment needed",
    values: {
      l1a: "1 continuous year abroad with the group, in the last 3",
      l1b: "1 continuous year abroad with the group, in the last 3",
      h1b: "None",
    },
    note: "This is the gate: L-1 is not open to someone hired directly into a US role.",
  },
  {
    label: "Can you change employer?",
    values: {
      l1a: "No — the status belongs to the company group",
      l1b: "No",
      h1b: "Yes, through a transfer petition",
    },
    note: "The L-1's defining limitation. An H-1B is portable; an L-1 is not.",
  },
  {
    label: "Maximum stay",
    values: {
      l1a: "7 years, counting H time too",
      l1b: "5 years, counting H time too",
      h1b: "6 years, extendable under AC21",
    },
  },
  {
    label: "Prevailing wage / LCA",
    values: {
      l1a: "None",
      l1b: "None",
      h1b: "LCA with a prevailing-wage obligation",
    },
  },
  {
    label: "Spouse work authorisation",
    values: {
      l1a: "Yes — L-2S, incident to status, no EAD needed",
      l1b: "Yes — L-2S, incident to status, no EAD needed",
      h1b: "H-4 EAD only, and only after I-140 approval or AC21",
    },
    note: "Usually the biggest financial difference between the two routes for a family.",
  },
  {
    label: "Green card route it feeds",
    values: {
      l1a: "EB-1C, which skips PERM",
      l1b: "EB-2 or EB-3, which need PERM",
      h1b: "EB-2 or EB-3, which need PERM",
    },
    note: "L-1A is the only one of the three with a PERM-free path built into it.",
  },
  {
    label: "Interview waiver (dropbox) in India",
    values: {
      l1a: "Not eligible",
      l1b: "Not eligible",
      h1b: "Not eligible",
    },
  },
  {
    label: "Degree required",
    values: {
      l1a: "No",
      l1b: "Only to use a blanket petition",
      h1b: "Yes, or the equivalent",
    },
  },
  {
    label: "Blanket processing available",
    values: {
      l1a: "Yes",
      l1b: "Professionals only",
      h1b: "No",
    },
  },
];

/* ══════════════════ 13. Filing sequence ═════════════════════════════════ */

export interface L1Step {
  n: number | string;
  title: string;
  who: string;
  detail: string;
  cite?: string;
}

export const L1_STEPS: L1Step[] = [
  {
    n: 1,
    title: "Confirm the qualifying year",
    who: "You and HR",
    detail:
      "One continuous year with the group abroad inside the last three. Pull your own travel history first — US time for the same group does not count toward the year, and people routinely discover they are a month short.",
    cite: "8 CFR 214.2(l)(1)(ii)(A)",
  },
  {
    n: 2,
    title: "Confirm the relationship, in writing",
    who: "Employer",
    detail:
      "Parent, branch, subsidiary or affiliate — exactly one of them — plus evidence both entities are doing business as employers in two countries, and will be for the whole of your stay.",
    cite: "8 CFR 214.2(l)(1)(ii)(G)",
  },
  {
    n: 3,
    title: "Pick L-1A or L-1B, and the route",
    who: "Employer and counsel",
    detail:
      "L-1A if the US role meets the managerial or executive definition; L-1B if it rests on specialized knowledge. Then choose a blanket certification or an individual petition. A marginal L-1B belongs in an individual petition, because a blanket denial at the consulate is final.",
  },
  {
    n: "4a",
    title: "Individual petition: Form I-129 with the L Supplement",
    who: "Employer",
    detail:
      "With the fee stack: base fee, Asylum Program Fee, Fraud Prevention and Detection fee where it applies, and the Public Law 114-113 fee if the employer is a 50/50 employer — now including on an extension.",
  },
  {
    n: "4b",
    title: "Blanket route: Form I-129S instead",
    who: "Employer",
    detail:
      "Original plus three copies, a copy of the approved I-797 attached to each, original and two copies sent to you. No new USCIS petition and no USCIS processing time — the adjudication happens at the consulate.",
    cite: "8 CFR 214.2(l)(5)(ii)(A)",
  },
  {
    n: 5,
    title: "Visa interview in India",
    who: "You",
    detail:
      "DS-160, fee, appointment at Delhi, Mumbai, Chennai, Hyderabad or Kolkata. L-1 and L-2 are not interview-waiver eligible under the rules effective 1 October 2025, so expect an in-person interview including for dependants.",
  },
  {
    n: 6,
    title: "Admission, and check the I-94",
    who: "CBP",
    detail:
      "Up to three years. Download the I-94 after every entry: for an L-2 spouse the annotation has to read L-2S for the work authorization to be usable on Form I-9.",
  },
];

/**
 * The caption for the combined-clock diagram. Lives here rather than in the
 * component so the sentence that carries the page's most consequential fact is
 * next to the regulation quote it comes from.
 */
export const L1_CAP_MONTHS_NOTE =
  "8 CFR 214.2(l)(12)(i) caps time spent in the United States “under section 101(a)(15)(L) and/or (H)” — one clock, two statuses. Six years on an H-1B leaves one year of L-1A and no L-1B time at all. Nothing about changing employer, changing company group or changing classification resets it; only a year of residence and physical presence abroad does.";
