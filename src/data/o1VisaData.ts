/**
 * O-1 visa data: classifications, evidentiary criteria, fees, admission periods
 * and the admissions statistics behind the page charts.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROVENANCE — read before editing
 *
 * The criteria lists are quoted from 8 CFR 214.2(o)(3)(iii), (iv) and (v) and
 * the definitions from (o)(3)(ii). They are REGULATORY text, not paraphrase:
 * the `text` field on every criterion is the regulation's own wording and must
 * not be "tidied". The `plain` field is ours.
 *
 * Fee figures come from Form G-1055, the USCIS fee schedule, edition 10/07/26.
 * The premium-processing figure is NOT duplicated here — it is read from
 * src/lib/premiumProcessing.ts, which is the site's single source for it.
 *
 * Admissions counts are DHS Office of Homeland Security Statistics, Yearbook of
 * Immigration Statistics FY2024, Table 26 (by class of admission, FY2015–2024)
 * and Nonimmigrant Supplemental Table 1 (by class and country of citizenship,
 * FY2024). OHSS rounds published counts to the nearest 10. These are
 * ADMISSIONS, not people and not visas issued — one person entering four times
 * is four admissions. Every chart caption says so.
 *
 * What is deliberately NOT here: O-1 approval or denial rates. USCIS publishes
 * I-129 adjudication data, but not in a form reachable and verifiable from this
 * environment (see docs/seo/oct-2026-cluster/gap-o1-visa.md). An unsourceable
 * rate on a YMYL page is worse than no rate.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Educational only. Not legal advice. Every O-1 petition turns on an individual
 * evidentiary record that no table or checklist can weigh.
 */

export const O1_VERIFIED = "2026-10-13";
export const O1_UPDATED = "2026-10-13";
export const O1_PUBLISHED = "2026-10-13";

export const O1_SOURCES = {
  cfr: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2#p-214.2(o)",
  uscisO1:
    "https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement",
  policyManualO1: "https://www.uscis.gov/policy-manual/volume-2-part-m",
  feeSchedule: "https://www.uscis.gov/g-1055",
  i129: "https://www.uscis.gov/i-129",
  i907: "https://www.uscis.gov/i-907",
  ina101: "https://www.law.cornell.edu/uscode/text/8/1101",
  yearbook: "https://ohss.dhs.gov/topics/immigration/yearbook",
  processingTimes: "https://egov.uscis.gov/processing-times/",
} as const;

/* ══════════════════════════ 1. The four classifications ══════════════════ */

export interface O1Class {
  id: "o1a" | "o1b-arts" | "o1b-mptv" | "o2" | "o3";
  code: string;
  label: string;
  /** The statutory or regulatory standard, in the regulation's own words. */
  standard: string;
  /** How many criteria, and out of how many. */
  criteriaRule: string;
  work: string;
  cite: string;
}

/**
 * Four codes, but FIVE standards — because O-1B splits in two. The arts
 * standard is "distinction"; the motion picture and television standard is
 * "extraordinary achievement", which the regulation defines separately and
 * more highly. Competitor guides print one O-1B standard; there are two.
 */
export const O1_CLASSES: O1Class[] = [
  {
    id: "o1a",
    code: "O-1A",
    label: "Sciences, education, business or athletics",
    standard:
      "a level of expertise indicating that the person is one of the small percentage who have arisen to the very top of the field of endeavor",
    criteriaRule: "A major, internationally recognised award — or at least 3 of 8",
    work: "Work in the area of extraordinary ability, for the petitioning employer or through an agent.",
    cite: "8 CFR 214.2(o)(3)(ii)–(iii)",
  },
  {
    id: "o1b-arts",
    code: "O-1B (arts)",
    label: "Arts — the distinction standard",
    standard:
      "distinction … a high level of achievement in the field of arts evidenced by a degree of skill and recognition substantially above that ordinarily encountered to the extent that a person described as prominent is renowned, leading, or well-known in the field of arts",
    criteriaRule:
      "A nomination for, or receipt of, a significant national or international award — or at least 3 of 6",
    work: "Performing or creating in the field of arts, broadly defined.",
    cite: "8 CFR 214.2(o)(3)(ii), (iv)",
  },
  {
    id: "o1b-mptv",
    code: "O-1B (motion picture / TV)",
    label: "Motion picture or television — extraordinary achievement",
    standard:
      "a very high level of accomplishment in the motion picture or television industry evidenced by a degree of skill and recognition significantly above that ordinarily encountered to the extent that the person is recognized as outstanding, notable, or leading in the motion picture or television field",
    criteriaRule:
      "A nomination for, or receipt of, a significant national or international award — or at least 3 of 6",
    work: "Work on a motion picture or television production.",
    cite: "8 CFR 214.2(o)(3)(ii), (v)",
  },
  {
    id: "o2",
    code: "O-2",
    label: "Essential support to an O-1 artist or athlete",
    standard:
      "critical skills and experience with the O-1 alien which are not of a general nature and which are not possessed by a U.S. worker",
    criteriaRule: "No criteria list — essentiality and a working relationship are the test",
    work: "Assisting the specific O-1 artist or athlete, as an integral part of the performance. May not work separately from the O-1.",
    cite: "8 CFR 214.2(o)(4)",
  },
  {
    id: "o3",
    code: "O-3",
    label: "Spouse and unmarried minor children",
    standard: "Derivative status, subject to the same period of admission and limits as the principal",
    criteriaRule: "Not applicable",
    work: "None. Neither the spouse nor a child may accept employment unless separately granted employment authorization.",
    cite: "8 CFR 214.2(o)(6)(iv)",
  },
];

/** O-2 cannot accompany an O-1 in science, business or education — only arts and athletics. */
export const O2_FIELD_LIMIT = {
  rule: "An O-2 may not accompany an O-1 alien in the fields of science, business or education.",
  cite: "8 CFR 214.2(o)(4)(i)",
  multiple:
    "More than one O-2 may be named on a petition if they assist the same O-1 for the same events, during the same period, in the same location. Up to 25 named beneficiaries per petition.",
  multipleCite: "8 CFR 214.2(o)(2)(iv)(F)",
} as const;

/* ══════════════════════════ 2. The O-1A criteria ══════════════════════════ */

export interface O1Criterion {
  /** Stable id used by the self-check tool. */
  id: string;
  ref: string;
  /** Verbatim from the regulation. Do not edit. */
  text: string;
  /** Our plain-English restatement. */
  plain: string;
  /** What this looks like in an Indian tech, research or founder career. */
  indiaExample: string;
  /**
   * How reachable this criterion generally is from ordinary industry work,
   * as a planning signal rather than a prediction. "structural" means it
   * either exists in your record or it does not; "buildable" means it is
   * commonly within reach inside 12–24 months of deliberate effort.
   */
  reach: "structural" | "buildable";
}

/**
 * 8 CFR 214.2(o)(3)(iii)(B)(1)–(8). At least three are required, unless the
 * beneficiary holds a major, internationally recognised award under (iii)(A).
 *
 * The regulation does not rank these and neither do we — `reach` is a planning
 * aid, not a legal weighting. USCIS weighs the record as a whole.
 */
export const O1A_CRITERIA: O1Criterion[] = [
  {
    id: "awards",
    ref: "(1)",
    text:
      "Documentation of the alien's receipt of nationally or internationally recognized prizes or awards for excellence in the field of endeavor",
    plain:
      "A prize or award for excellence, recognised at national or international level — not an internal company award.",
    indiaExample:
      "A best-paper award at a recognised international conference; a national-level award from an Indian professional body; a major industry award judged beyond your employer.",
    reach: "structural",
  },
  {
    id: "membership",
    ref: "(2)",
    text:
      "Documentation of the alien's membership in associations in the field for which classification is sought, which require outstanding achievements of their members, as judged by recognized national or international experts in their disciplines or fields",
    plain:
      "Membership in a body that admits people on the strength of achievement, judged by recognised experts. Paying a subscription is not membership in this sense.",
    indiaExample:
      "An elevated professional grade such as IEEE Senior Member or Fellow, ACM Distinguished Member, or a national academy fellowship MAY support this criterion, depending on what the body's documented admission requirements actually are. The title alone does not settle it: USCIS looks at whether admission genuinely requires outstanding achievements judged by recognised national or international experts, so the petition has to put the association's own published criteria and review process in evidence. Ordinary IEEE or ACM membership, which anyone may join by subscription, does not support it.",
    reach: "buildable",
  },
  {
    id: "press",
    ref: "(3)",
    text:
      "Published material in professional or major trade publications or major media about the alien, relating to the alien's work in the field for which classification is sought, which shall include the title, date, and author of such published material, and any necessary translation",
    plain:
      "Coverage about you and your work, in professional, major trade or major media outlets. About you — not merely quoting you, and not written by you.",
    indiaExample:
      "A profile in a recognised Indian business or technology title; trade-press coverage of a product you led. Keep the title, date and author for each piece; the regulation requires them, and Hindi or regional-language coverage needs a certified translation.",
    reach: "buildable",
  },
  {
    id: "judging",
    ref: "(4)",
    text:
      "Evidence of the alien's participation on a panel, or individually, as a judge of the work of others in the same or in an allied field of specialization to that for which classification is sought",
    plain: "You have judged other people's work, on a panel or alone.",
    indiaExample:
      "Peer review for a journal or conference; serving on a hackathon or grant panel; judging a startup competition. This is the criterion most often left unclaimed because people do it and never document it — keep the invitation email and the completion record.",
    reach: "buildable",
  },
  {
    id: "contributions",
    ref: "(5)",
    text:
      "Evidence of the alien's original scientific, scholarly, or business-related contributions of major significance in the field",
    plain:
      "Original contributions — and the phrase that carries the weight is *of major significance*. Significance has to be shown in the field, not asserted in a letter.",
    indiaExample:
      "A granted patent that others have licensed or built on; an open-source project with documented adoption; an architecture or method adopted beyond your employer. Citation counts, adoption figures and independent letters are how significance gets shown.",
    reach: "structural",
  },
  {
    id: "articles",
    ref: "(6)",
    text:
      "Evidence of the alien's authorship of scholarly articles in the field, in professional journals, or other major media",
    plain: "You have authored scholarly articles in professional journals or major media.",
    indiaExample:
      "Peer-reviewed papers; a substantive engineering article in a recognised professional publication. A company blog post is not a scholarly article.",
    reach: "structural",
  },
  {
    id: "critical-role",
    ref: "(7)",
    text:
      "Evidence that the alien has been employed in a critical or essential capacity for organizations and establishments that have a distinguished reputation",
    plain:
      "Two things at once: a critical or essential role, and an employer with a distinguished reputation. Both halves have to be evidenced.",
    indiaExample:
      "Leading a core platform at a well-known Indian or global company; a founding engineer role at a funded startup with recognised investors. Org charts, scope letters and the organisation's own standing all go in.",
    reach: "buildable",
  },
  {
    id: "salary",
    ref: "(8)",
    text:
      "Evidence that the alien has either commanded a high salary or will command a high salary or other remuneration for services, evidenced by contracts or other reliable evidence",
    plain:
      "High remuneration, now or under the offer on the table — compared against the field, not against the national average.",
    indiaExample:
      "A US offer well above the relevant occupational wage data for the role and area. Note the tense: a future high salary counts, which makes this reachable at the point of the offer even if your Indian salary history is not comparable.",
    reach: "structural",
  },
];

/** (o)(3)(iii)(A) — the one-step route almost nobody takes. */
export const O1A_MAJOR_AWARD = {
  text: "Receipt of a major, internationally recognized award, such as the Nobel Prize",
  cite: "8 CFR 214.2(o)(3)(iii)(A)",
  note:
    "This replaces the criteria list entirely rather than counting as one of the three. The regulation's own example is the Nobel Prize, which sets the register.",
} as const;

/** (o)(3)(iii)(C) — the route for occupations the eight criteria do not fit. */
export const O1A_COMPARABLE_EVIDENCE = {
  text:
    "If the criteria in paragraph (o)(3)(iii) of this section do not readily apply to the beneficiary's occupation, the petitioner may submit comparable evidence in order to establish the beneficiary's eligibility.",
  cite: "8 CFR 214.2(o)(3)(iii)(C)",
  plain:
    "Scholarly articles and peer review are academic measures. For a founder or a product leader they may not apply at all, and the regulation anticipates that — comparable evidence is a route written into the rule, not a concession. The petition has to say which criterion the evidence stands in for, and why the listed one does not readily apply.",
  examples: [
    "Funding rounds, investor letters and a cap table in place of grants",
    "Acquisition or revenue milestones in place of citation counts",
    "Adoption metrics for an open-source project in place of journal authorship",
    "Selection into a highly selective accelerator in place of association membership",
  ],
} as const;

/* ══════════ 3. The O-1B criteria (arts, and motion picture / TV) ══════════ */

export interface O1BCriterion {
  ref: string;
  text: string;
  plain: string;
}

/**
 * 8 CFR 214.2(o)(3)(iv)(B)(1)–(6) for the arts, and (o)(3)(v)(B)(1)–(6) for
 * motion picture and television. The six items are worded almost identically
 * in the two paragraphs; what differs is the STANDARD they are measured
 * against — distinction for the arts, extraordinary achievement for MPTV.
 */
export const O1B_CRITERIA: O1BCriterion[] = [
  {
    ref: "(1)",
    text:
      "Evidence that the alien has performed, and will perform, services as a lead or starring participant in productions or events which have a distinguished reputation",
    plain:
      "Lead or starring participation, past and future, in productions or events that themselves have standing. Evidenced by critical reviews, advertisements, publicity releases, publication contracts or endorsements.",
  },
  {
    ref: "(2)",
    text:
      "Evidence that the alien has achieved national or international recognition for achievements evidenced by critical reviews or other published materials by or about the individual in major newspapers, trade journals, magazines, or other publications",
    plain: "Recognition at national or international level, shown through published material.",
  },
  {
    ref: "(3)",
    text:
      "Evidence that the alien has performed, and will perform, in a lead, starring, or critical role for organizations and establishments that have a distinguished reputation",
    plain:
      "A lead, starring or critical role for organisations with a distinguished reputation — evidenced by articles, trade journals, publications or testimonials.",
  },
  {
    ref: "(4)",
    text:
      "Evidence that the alien has a record of major commercial or critically acclaimed successes",
    plain:
      "Commercial or critical success, shown by indicators the regulation names: title, rating, standing in the field, box office receipts, motion picture or television ratings, and other occupational achievements reported in the trade or major press.",
  },
  {
    ref: "(5)",
    text:
      "Evidence that the alien has received significant recognition for achievements from organizations, critics, government agencies, or other recognized experts in the field in which the alien is engaged",
    plain:
      "Significant recognition from organisations, critics, government agencies or recognised experts. The regulation adds a requirement to the testimonial itself: it must clearly indicate the author's authority, expertise and knowledge of your achievements.",
  },
  {
    ref: "(6)",
    text:
      "Evidence that the alien has either commanded a high salary or will command a high salary or other substantial remuneration for services in relation to others in the field",
    plain: "High remuneration relative to others in the field, evidenced by contracts or other reliable evidence.",
  },
];

export const O1B_AWARD_ROUTE = {
  text:
    "Evidence that the alien has been nominated for, or has been the recipient of, significant national or international awards or prizes in the particular field such as an Academy Award, an Emmy, a Grammy, or a Director's Guild Award",
  cite: "8 CFR 214.2(o)(3)(iv)(A) and (o)(3)(v)(A)",
  note:
    "Note the word nominated. Unlike the O-1A award route, which requires receipt, the O-1B route is satisfied by a nomination for a significant award.",
} as const;

/** "Arts" is defined far more broadly than people assume — (o)(3)(ii). */
export const ARTS_DEFINITION = {
  text:
    "Arts includes any field of creative activity or endeavor such as, but not limited to, fine arts, visual arts, culinary arts, and performing arts. Aliens engaged in the field of arts include not only the principal creators and performers but other essential persons such as, but not limited to, directors, set designers, lighting designers, sound designers, choreographers, choreologists, conductors, orchestrators, coaches, arrangers, musical supervisors, costume designers, makeup artists, flight masters, stage technicians, and animal trainers.",
  cite: "8 CFR 214.2(o)(3)(ii)",
} as const;

/** "Event" is also broad, which is what makes the itinerary requirement workable. */
export const EVENT_DEFINITION = {
  text:
    "Event means an activity such as, but not limited to, a scientific project, conference, convention, lecture series, tour, exhibit, business project, academic year, or engagement. Such activity may include short vacations, promotional appearances, and stopovers which are incidental and/or related to the event. A group of related activities may also be considered to be an event. In the case of an O-1 athlete, the event could be the alien's contract.",
  cite: "8 CFR 214.2(o)(3)(ii)",
  plain:
    "A business project or an academic year is an event. That is why an O-1 can cover ordinary continuous employment rather than only a tour or a tournament — the petition frames the work as the event.",
} as const;

/* ══════════════════════════ 4. Consultation ══════════════════════════════ */

export const CONSULTATION = {
  mandatory:
    "Consultation with an appropriate U.S. peer group (which could include a person or persons with expertise in the field), labor and/or management organization regarding the nature of the work to be done and the alien's qualifications is mandatory before a petition for an O-1 or O-2 classification can be approved.",
  cite: "8 CFR 214.2(o)(5)(i)(A)",
  advisory:
    "Consultations are advisory and are not binding on the Service.",
  advisoryCite: "8 CFR 214.2(o)(5)(i)(D)",
  noObjection:
    "A consulting organization may also submit a letter of no objection in lieu of the above if it has no objection to the approval of the petition.",
  peerGroup:
    "Peer group means a group or organization which is comprised of practitioners of the alien's occupation. If there is a collective bargaining representative of an employer's employees in the occupational classification for which the alien is being sought, such a representative may be considered the appropriate peer group for purposes of consultation.",
  peerGroupCite: "8 CFR 214.2(o)(3)(ii)",
  favourable:
    "If the advisory opinion is favorable to the petitioner, it should describe the alien's ability and achievements in the field of endeavor, describe the nature of the duties to be performed, and state whether the position requires the services of an alien of extraordinary ability.",
  unfavourable:
    "If the advisory opinion is not favorable to the petitioner, the advisory opinion must set forth a specific statement of facts which supports the conclusion reached in the opinion.",
  artsWaiver:
    "Consultation for an alien of extraordinary ability in the field of arts shall be waived by the Director in those instances where the alien seeks readmission to the United States to perform similar services within 2 years of the date of a previous consultation.",
  artsWaiverCite: "8 CFR 214.2(o)(5)(ii)(B)",
  mptv:
    "For an O-1 of extraordinary achievement working on a motion picture or television production, consultation must be with BOTH the appropriate union representing the occupational peers AND a management organization in the area of the alien's ability.",
  mptvCite: "8 CFR 214.2(o)(5)(iii)",
} as const;

/* ══════════════════════════ 5. Periods and extensions ════════════════════ */

export const O1_PERIODS = [
  {
    label: "Initial petition validity",
    value: "Up to 3 years",
    note: "The period the Director determines is necessary to accomplish the event or activity, not to exceed 3 years.",
    cite: "8 CFR 214.2(o)(6)(iii)(A)",
  },
  {
    label: "Admission window",
    value: "Validity + 10 days either side",
    note: "You may be admitted up to 10 days before the validity period begins and may remain up to 10 days after it ends. You may only work during the validity period itself.",
    cite: "8 CFR 214.2(o)(10)",
  },
  {
    label: "Extension increments",
    value: "Up to 1 year at a time",
    note: "To continue or complete the same event or activity, plus 10 days to put personal affairs in order.",
    cite: "8 CFR 214.2(o)(12)(ii)",
  },
  {
    label: "Statutory maximum stay",
    value: "None",
    note: "There is no six-year wall on O-1 the way there is on H-1B. Extensions run in one-year increments for as long as the same event or activity continues.",
    cite: "8 CFR 214.2(o)(12)",
    highlight: true,
  },
  {
    label: "Must be in the US to file an extension of stay",
    value: "Yes",
    note: "The beneficiary must be physically present in the United States at the time the extension of stay is filed. The petition extension and the extension of stay are decided separately.",
    cite: "8 CFR 214.2(o)(12)(i)",
  },
  {
    label: "O-2 validity",
    value: "Up to 3 years",
    note: "Tied to assisting the O-1 in the same event or activity.",
    cite: "8 CFR 214.2(o)(6)(iii)(B)",
  },
] as const;

/** (o)(13) — the provision that makes O-1 a long-horizon status. */
export const O1_DUAL_INTENT = {
  text:
    "The approval of a permanent labor certification or the filing of a preference petition for an alien shall not be a basis for denying an O-1 petition, a request to extend such a petition, or the alien's application for admission, change of status, or extension of stay. The alien may legitimately come to the United States for a temporary period as an O-1 nonimmigrant and depart voluntarily at the end of his or her authorized stay and, at the same time, lawfully seek to become a permanent resident of the United States.",
  cite: "8 CFR 214.2(o)(13)",
} as const;

/* ══════════════════════════ 6. Fees ══════════════════════════════════════ */

/**
 * Form G-1055, edition 10/07/26. The premium-processing row is intentionally
 * absent — pages read it from src/lib/premiumProcessing.ts so there is one
 * number for it site-wide.
 */
export const O1_FEE_SCHEDULE_EDITION = "10/07/26";

export interface O1Fee {
  label: string;
  regular: string;
  reduced: string | null;
  who: string;
  note?: string;
}

export const O1_FEES: O1Fee[] = [
  {
    label: "Form I-129, O petition — paper filing",
    regular: "$1,055",
    reduced: "$530",
    who: "Petitioner (the employer or agent)",
    note: "Reduced figure applies to a small employer (25 or fewer full-time equivalent employees) or a nonprofit. An O-1 petition is limited to ONE beneficiary; O-2 petitions may name up to 25.",
  },
  {
    label: "Form I-129, O petition — online filing",
    regular: "$1,005",
    reduced: "$530",
    who: "Petitioner",
    note: "Filing online saves $50 at the regular rate. The reduced rate is the same either way.",
  },
  {
    label: "Asylum Program Fee",
    regular: "$600",
    reduced: "$300 small employer · $0 nonprofit",
    who: "Petitioner",
    note: "Applies to every Form I-129 classification, including O petitions filed by an agent. It is a separate fee, not part of the base filing fee.",
  },
  {
    label: "Form I-907, premium processing",
    regular: "see the site-wide figure",
    reduced: null,
    who: "Optional — and the one fee a worker may lawfully pay",
    note: "Read from the site's central premium-processing record so one number serves every page. Premium processing buys USCIS action, not approval.",
  },
  {
    label: "DS-160 nonimmigrant visa application fee",
    regular: "set by the Department of State",
    reduced: null,
    who: "The applicant, if applying at a consulate",
    note: "Payable when you apply for the visa itself in India rather than changing status inside the US. Verify the current amount on the consulate's own fee page before paying.",
  },
];

/** Fees that exist on H-1B and do NOT exist on O-1. */
export const O1_FEES_NOT_PAYABLE = [
  {
    fee: "ACWIA training fee ($1,500 / $750)",
    why: "Statutory to H-1B and H-1B1 petitions only.",
  },
  {
    fee: "Fraud Prevention and Detection fee ($500)",
    why: "Imposed on H-1B, H-1B change-of-employer, H-2B and L petitions. Not on O petitions.",
  },
  {
    fee: "Public Law 114-113 fee ($4,000 H-1B / $4,500 L-1)",
    why: "Applies only to H-1B and L-1 petitions by 50/50 employers.",
  },
  {
    fee: "Cap registration fee and the lottery",
    why: "There is no numerical cap on O-1 and no registration lottery. This is the structural reason the route exists for people who were not selected.",
  },
] as const;

/* ══════════════════════════ 7. Admissions statistics ═════════════════════ */

/**
 * DHS OHSS Yearbook of Immigration Statistics FY2024, Table 26: I-94
 * nonimmigrant ADMISSIONS by class of admission. Counts are rounded to the
 * nearest 10 by OHSS. Admissions, not individuals.
 */
export const O1_ADMISSIONS_BY_YEAR = [
  { fy: 2015, o1: 93_090, o2: 26_590, o3: 11_730 },
  { fy: 2016, o1: 102_350, o2: 28_690, o3: 13_890 },
  { fy: 2017, o1: 111_520, o2: 30_660, o3: 15_340 },
  { fy: 2018, o1: 120_630, o2: 33_780, o3: 16_070 },
  { fy: 2019, o1: 127_970, o2: 35_370, o3: 17_680 },
  { fy: 2020, o1: 63_490, o2: 15_600, o3: 8_700 },
  { fy: 2021, o1: 26_400, o2: 8_510, o3: 5_690 },
  { fy: 2022, o1: 79_770, o2: 38_650, o3: 13_450 },
  { fy: 2023, o1: 108_180, o2: 57_120, o3: 17_500 },
  { fy: 2024, o1: 122_160, o2: 62_690, o3: 19_220 },
] as const;

/**
 * OHSS Yearbook FY2024, Nonimmigrant Supplemental Table 1: admissions by class
 * of admission AND country of citizenship. The H-1B row is here as the
 * comparison the whole page turns on.
 */
export const O1_ADMISSIONS_BY_COUNTRY_FY2024 = [
  { country: "Canada", o1: 20_320 },
  { country: "Mexico", o1: 6_170 },
  { country: "India", o1: 5_080 },
  { country: "Germany", o1: 4_630 },
  { country: "Brazil", o1: 2_740 },
  { country: "Japan", o1: 2_360 },
  { country: "Korea, South", o1: 2_180 },
  { country: "Israel", o1: 1_850 },
] as const;

export const O1_VS_H1B_INDIA_FY2024 = {
  fy: 2024,
  o1Total: 122_160,
  o1India: 5_080,
  h1bTotal: 890_310,
  h1bIndia: 497_460,
  o3India: 990,
  source: "DHS OHSS Yearbook of Immigration Statistics FY2024, Nonimmigrant Supplemental Table 1",
} as const;

export const O1_STATS_NOTE =
  "Figures are I-94 admissions, not people and not visas issued: one person who enters four times in a year counts four times, and someone who changes status inside the United States without travelling does not appear at all. OHSS rounds published counts to the nearest 10. Use them for shape and share, not as a headcount.";

/* ══════════════════════════ 8. Comparison table ══════════════════════════ */

export type CompareRoute = "o1a" | "h1b" | "eb1a" | "niw";

export interface CompareRow {
  label: string;
  values: Record<CompareRoute, string>;
  note?: string;
}

export const O1_COMPARE_ROUTES: { id: CompareRoute; short: string; label: string }[] = [
  { id: "o1a", short: "O-1A", label: "Extraordinary ability (nonimmigrant)" },
  { id: "h1b", short: "H-1B", label: "Specialty occupation" },
  { id: "eb1a", short: "EB-1A", label: "Extraordinary ability (green card)" },
  { id: "niw", short: "EB-2 NIW", label: "National interest waiver" },
];

export const O1_COMPARISON: CompareRow[] = [
  {
    label: "What it gives you",
    values: {
      o1a: "Temporary status and work authorisation",
      h1b: "Temporary status and work authorisation",
      eb1a: "A green card",
      niw: "A green card",
    },
  },
  {
    label: "Lottery or numerical cap",
    values: {
      o1a: "Neither",
      h1b: "Both — 85,000 cap, annual registration lottery",
      eb1a: "Annual limit, and a per-country limit",
      niw: "Annual limit, and a per-country limit",
    },
    note: "This is the whole reason the O-1 appears in \"not selected\" conversations.",
  },
  {
    label: "Can you file for yourself?",
    values: {
      o1a: "No — an employer or a US agent must petition",
      h1b: "No",
      eb1a: "Yes",
      niw: "Yes",
    },
  },
  {
    label: "Evidentiary test",
    values: {
      o1a: "Major international award, or 3 of 8 (8 CFR 214.2(o)(3)(iii))",
      h1b: "A specialty occupation and a qualifying degree — not an achievement test",
      eb1a: "Major international award, or 3 of 10 (8 CFR 204.5(h)), then final merits",
      niw: "EB-2 eligibility, then the three Dhanasar prongs",
    },
  },
  {
    label: "Maximum stay",
    values: {
      o1a: "No statutory maximum — 1-year extensions continue",
      h1b: "6 years, extendable only through AC21",
      eb1a: "Permanent",
      niw: "Permanent",
    },
    note: "For an India-born applicant in a decade-long queue, this row usually matters more than the evidentiary one.",
  },
  {
    label: "Prevailing wage / LCA",
    values: {
      o1a: "No LCA and no prevailing-wage requirement",
      h1b: "LCA with a prevailing-wage obligation",
      eb1a: "Not applicable",
      niw: "Not applicable",
    },
  },
  {
    label: "Spouse work authorisation",
    values: {
      o1a: "No — O-3 cannot work",
      h1b: "H-4 EAD, only once the I-140 is approved or AC21 applies",
      eb1a: "Yes, once a green card is issued",
      niw: "Yes, once a green card is issued",
    },
    note: "The clearest disadvantage of O-1 against H-1B for a two-income family.",
  },
  {
    label: "Dual intent protected in the regulation",
    values: {
      o1a: "Yes — 8 CFR 214.2(o)(13)",
      h1b: "Yes",
      eb1a: "Not applicable",
      niw: "Not applicable",
    },
  },
  {
    label: "Advisory opinion required",
    values: {
      o1a: "Yes, from a peer group, labor and/or management organisation",
      h1b: "No",
      eb1a: "No",
      niw: "No",
    },
  },
];

/* ══════════════════════════ 9. Filing sequence ═══════════════════════════ */

export interface O1Step {
  n: number;
  title: string;
  who: string;
  detail: string;
  cite?: string;
}

export const O1_STEPS: O1Step[] = [
  {
    n: 1,
    title: "Fix the classification and the event",
    who: "You and counsel",
    detail:
      "Decide whether the petition is O-1A, O-1B arts, or O-1B motion picture and television, because the standard and the criteria list differ. Then define the event — a business project or an academic year counts, which is what lets an O-1 cover ordinary employment.",
    cite: "8 CFR 214.2(o)(3)(ii)",
  },
  {
    n: 2,
    title: "Assemble the evidence against named criteria",
    who: "You",
    detail:
      "Three of eight for O-1A. Label each exhibit with the criterion it is offered under. Where a criterion does not readily apply to your occupation, say so and offer comparable evidence under (o)(3)(iii)(C) rather than stretching the listed one.",
  },
  {
    n: 3,
    title: "Get the advisory opinion",
    who: "Petitioner",
    detail:
      "A written advisory opinion from an appropriate peer group, labor and/or management organisation. A letter of no objection is an accepted alternative. Build the lead time in — this step is outside your control and is a common cause of delay.",
    cite: "8 CFR 214.2(o)(5)",
  },
  {
    n: 4,
    title: "Prepare the itinerary and the contract",
    who: "Petitioner",
    detail:
      "A copy of the written contract or a summary of the oral agreement, and an itinerary of the events or activities with dates and locations. An agent filing for multiple employers has to supply the complete itinerary.",
  },
  {
    n: 5,
    title: "File Form I-129 with the fees",
    who: "Petitioner",
    detail:
      "The O petition fee plus the Asylum Program Fee, and Form I-907 separately if you are using premium processing. One beneficiary per O-1 petition.",
    cite: "8 CFR 214.2(o)(2)",
  },
  {
    n: 6,
    title: "Approval on Form I-797",
    who: "USCIS",
    detail:
      "The approval notice carries the beneficiary's name, the classification and the petition's period of validity. That validity period is the ceiling on your admission.",
    cite: "8 CFR 214.2(o)(6)(i)",
  },
  {
    n: 7,
    title: "Visa at a consulate, or change of status inside the US",
    who: "You",
    detail:
      "In India: DS-160, fee, appointment at Delhi, Mumbai, Chennai, Hyderabad or Kolkata, and an interview. O-1 is not on the interview-waiver list under the rules effective 1 October 2025. If you are already in the US in another status, the petition can request a change of status instead and no consular step is needed.",
  },
  {
    n: 8,
    title: "Admission, and the 10-day windows",
    who: "CBP",
    detail:
      "You may be admitted up to 10 days before validity begins and remain up to 10 days after it ends, but may work only during the validity period. Check your I-94 after every entry.",
    cite: "8 CFR 214.2(o)(10)",
  },
];

/* ══════════════════════════ 10. Changing employers ═══════════════════════ */

export const O1_EMPLOYER_CHANGE = {
  rule:
    "An O-1 is tied to the petitioner. A new employer must file a new Form I-129 before you start work for them, and the petitioner must notify USCIS of any change in the terms and conditions of employment that could affect eligibility.",
  cite: "8 CFR 214.2(o)(8)(i)(A)",
  automaticRevocation:
    "Approval of an unexpired petition is automatically revoked if the petitioner — or the named employer where an agent filed — goes out of business, withdraws the petition, or notifies USCIS that you are no longer employed by them. An automatic revocation cannot be appealed.",
  automaticRevocationCite: "8 CFR 214.2(o)(8)(ii), (o)(9)(ii)",
  athleteException:
    "One narrow exception exists, and it is for athletes: a professional O-1 athlete who is traded keeps employment authorization for 30 days after acquisition by the new organisation, and remains in valid O-1 status while a petition filed inside those 30 days is pending.",
  athleteExceptionCite: "8 CFR 214.2(o)(2)(iv)(G)",
  returnTransport:
    "If an employer terminates an O-1 beneficiary for reasons other than voluntary resignation, the employer must pay the reasonable cost of return transportation to the beneficiary's last place of residence before entering the United States. Where an agent filed the petition for the employer, USCIS states that the agent and the employer are equally responsible for those costs.",
  returnTransportCite: "USCIS, O-1 Visa: Individuals with Extraordinary Ability or Achievement",
} as const;
