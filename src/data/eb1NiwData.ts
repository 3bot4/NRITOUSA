/**
 * EB-1A / EB-1B / EB-1C / EB-2 NIW comparison data.
 *
 * Criteria counts and requirements read from 8 CFR 204.5(h), (i) and (j), and
 * the NIW framework from the USCIS Policy Manual, Vol. 6, Pt. F, Ch. 5, which
 * applies Matter of Dhanasar. These are REGULATORY facts — they change when the
 * regulation or the Policy Manual changes, not monthly.
 *
 * Educational only. Not legal advice, and every one of these routes turns on an
 * individual evidentiary record that no comparison table can assess.
 */

export const EB1_NIW_SOURCES = {
  cfr2045: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-204/section-204.5",
  eb1: "https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-first-preference-eb-1",
  eb2: "https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2",
  niwPolicyManual: "https://www.uscis.gov/policy-manual/volume-6-part-f-chapter-5",
  niwPolicyAlert:
    "https://www.uscis.gov/sites/default/files/document/policy-manual-updates/20250115-Employment-BasedNationalInterestWaivers.pdf",
  niwGuidanceNews:
    "https://www.uscis.gov/newsroom/alerts/uscis-updates-guidance-on-eb-2-national-interest-waiver-petitions",
  i140: "https://www.uscis.gov/i-140",
  visaBulletin:
    "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
} as const;

export const EB1_NIW_UPDATED = "2026-09-16";

export type RouteId = "eb1a" | "eb1b" | "eb1c" | "niw";

export interface Route {
  id: RouteId;
  short: string;
  label: string;
  preference: "EB-1" | "EB-2";
  /** Can the beneficiary file for themselves? */
  selfPetition: boolean;
  /** Is a job offer required? */
  jobOffer: boolean;
  /** Is PERM labour certification required? */
  perm: boolean;
  /** The evidentiary test, stated as the regulation states it. */
  test: string;
  /** Who it actually fits. */
  fits: string;
  /** The honest difficulty. */
  hard: string;
  cite: string;
}

export const ROUTES: Route[] = [
  {
    id: "eb1a",
    short: "EB-1A",
    label: "Extraordinary ability",
    preference: "EB-1",
    selfPetition: true,
    jobOffer: false,
    perm: false,
    test:
      "Either a one-time major internationally recognised award, or at least three of ten listed criteria — plus evidence you are coming to continue work in the field, and that you have risen to the very top of it.",
    fits:
      "Researchers, founders, athletes and artists with a genuine external record: citations, press, judging, awards, membership requiring outstanding achievement.",
    hard:
      "Meeting three criteria on paper is not the end of it. USCIS applies a final merits determination on the record as a whole, and 'three boxes ticked' has failed many petitions.",
    cite: "8 CFR 204.5(h)",
  },
  {
    id: "eb1b",
    short: "EB-1B",
    label: "Outstanding professor or researcher",
    preference: "EB-1",
    selfPetition: false,
    jobOffer: true,
    perm: false,
    test:
      "At least two of six listed criteria showing international recognition as outstanding, plus at least three years of experience in teaching or research in the field.",
    fits:
      "Academics with a tenure-track or permanent research offer, and researchers at private employers with a research department employing at least three full-time researchers.",
    hard:
      "The employer must make a formal offer of a permanent or tenure-track position. That requirement, not the criteria, is what rules most industry researchers out.",
    cite: "8 CFR 204.5(i)",
  },
  {
    id: "eb1c",
    short: "EB-1C",
    label: "Multinational manager or executive",
    preference: "EB-1",
    selfPetition: false,
    jobOffer: true,
    perm: false,
    test:
      "At least one year of employment in a managerial or executive capacity in the three years before the petition, with the same employer or a subsidiary or affiliate of the US petitioner.",
    fits:
      "Someone transferred into the US by a company they already managed for abroad — the classic L-1A path continuing into a green card.",
    hard:
      "'Managerial' has a specific meaning: managing people or an essential function, not merely being senior or technically excellent. Managing your own work is not managing.",
    cite: "8 CFR 204.5(j)",
  },
  {
    id: "niw",
    short: "EB-2 NIW",
    label: "National interest waiver",
    preference: "EB-2",
    selfPetition: true,
    jobOffer: false,
    perm: false,
    test:
      "First qualify for EB-2 — an advanced degree, or exceptional ability. Then satisfy three prongs: the proposed endeavour has substantial merit and national importance; you are well positioned to advance it; and on balance it benefits the United States to waive the job offer and labour certification.",
    fits:
      "Researchers, entrepreneurs and specialists whose work has demonstrable national importance, and who can evidence a track record of advancing it.",
    hard:
      "The second prong is where petitions fail. 'Well positioned to advance the endeavour' asks for a record of actually having advanced it, not a plan and a good CV.",
    cite: "USCIS Policy Manual Vol. 6, Pt. F, Ch. 5 (applying Matter of Dhanasar)",
  },
];

export const ROUTE_BY_ID: Record<RouteId, Route> = ROUTES.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<RouteId, Route>
);

/* ── The questionnaire ─────────────────────────────────────────────────── */

export interface RouteQuestion {
  id: string;
  question: string;
  help: string;
  /** Routes this answer supports when the answer is yes. */
  supports: RouteId[];
  /** Routes this answer rules out when the answer is NO. */
  requiredFor?: RouteId[];
}

export const ROUTE_QUESTIONS: RouteQuestion[] = [
  {
    id: "self-petition",
    question: "Do you need to file without an employer sponsoring you?",
    help:
      "Because you are between jobs, changing employers, founding something, or simply do not want your green card tied to one company.",
    supports: ["eb1a", "niw"],
  },
  {
    id: "permanent-academic-offer",
    question:
      "Do you have — or can you get — a formal offer of a tenure-track or permanent research position?",
    help:
      "Including a permanent research role at a private employer whose research department employs at least three full-time researchers.",
    supports: ["eb1b"],
    requiredFor: ["eb1b"],
  },
  {
    id: "three-years-research",
    question:
      "Do you have at least three years of experience teaching or researching in your field?",
    help: "Counted in the academic field the petition is about.",
    supports: ["eb1b"],
    requiredFor: ["eb1b"],
  },
  {
    id: "multinational-manager",
    question:
      "In the last three years, did you spend at least a year managing people or an essential function abroad, for the same company group that now employs you in the US?",
    help:
      "Managerial or executive capacity, with the US employer being the same employer, a subsidiary or an affiliate. Managing your own workload does not count.",
    supports: ["eb1c"],
    requiredFor: ["eb1c"],
  },
  {
    id: "external-recognition",
    question:
      "Do you have substantial external recognition — significant awards, press about your work, judging others' work, heavily cited publications, or membership requiring outstanding achievement?",
    help:
      "External means recognition from outside your own employer. Internal promotions and good performance reviews are not this.",
    supports: ["eb1a"],
    requiredFor: ["eb1a"],
  },
  {
    id: "advanced-degree",
    question:
      "Do you hold an advanced degree (or a bachelor's plus five years of progressive experience), or can you show exceptional ability in your field?",
    help: "This is the gate into EB-2 before the waiver question is even reached.",
    supports: ["niw"],
    requiredFor: ["niw"],
  },
  {
    id: "national-importance",
    question:
      "Is your work of demonstrable national importance — and can you show a record of already advancing it?",
    help:
      "Prongs one and two of the NIW test. The second is where most petitions fail: it asks what you have already moved, not what you intend to.",
    supports: ["niw"],
    requiredFor: ["niw"],
  },
];

/* ── Comparison matrix rows for the diagram ─────────────────────────────── */

export const MATRIX_ROWS: { label: string; values: Record<RouteId, string> }[] = [
  {
    label: "Self-petition?",
    values: { eb1a: "Yes", eb1b: "No", eb1c: "No", niw: "Yes" },
  },
  {
    label: "Job offer needed?",
    values: { eb1a: "No", eb1b: "Yes", eb1c: "Yes", niw: "No" },
  },
  {
    label: "PERM needed?",
    values: { eb1a: "No", eb1b: "No", eb1c: "No", niw: "No" },
  },
  {
    label: "Preference category",
    values: { eb1a: "EB-1", eb1b: "EB-1", eb1c: "EB-1", niw: "EB-2" },
  },
  {
    label: "Criteria to meet",
    values: { eb1a: "3 of 10", eb1b: "2 of 6", eb1c: "1 yr abroad", niw: "3 prongs" },
  },
];

/* ═══════════ the regulatory criteria, verbatim (depth pass 2026-09-20) ═══ */

/**
 * The searcher comparing EB-1A and EB-1B is, nine times out of ten, trying to
 * work out which list of boxes they can tick. Describing the lists is not the
 * same as showing them, so here they are, quoted from the regulation rather
 * than paraphrased.
 *
 * Read from 8 CFR 204.5 on 2026-09-20. `plain` is our own gloss and is clearly
 * separated from the regulation's own words in `text`.
 */

export interface RegCriterion {
  /** The regulation's own enumerator, e.g. "(i)" or "(A)". */
  ref: string;
  /** The regulation's own words. */
  text: string;
  /** What it means in practice, and what typically satisfies it. */
  plain: string;
}

/** 8 CFR 204.5(h)(3) — meet at least three, unless you hold a major award. */
export const EB1A_CRITERIA: RegCriterion[] = [
  {
    ref: "(i)",
    text: "Receipt of lesser nationally or internationally recognized prizes or awards for excellence in the field of endeavor",
    plain:
      "Awards below the one-time major award standard. The award has to be for excellence in the field and recognised beyond the body that gave it — an internal company award rarely lands.",
  },
  {
    ref: "(ii)",
    text: "Membership in associations in the field which require outstanding achievements of their members, as judged by recognized national or international experts",
    plain:
      "The membership must be gated on achievement. Anything you can join by paying a fee or holding a degree does not count, which excludes most professional bodies.",
  },
  {
    ref: "(iii)",
    text: "Published material about the alien in professional or major trade publications or other major media, relating to the alien's work in the field",
    plain:
      "Coverage about you and your work, not written by you. Press releases from your own employer are the usual weak spot.",
  },
  {
    ref: "(iv)",
    text: "Participation, either individually or on a panel, as a judge of the work of others in the same or an allied field",
    plain:
      "Peer review, conference programme committees, grant panels, judging competitions. This is the criterion most working researchers already meet and most forget to document.",
  },
  {
    ref: "(v)",
    text: "Original scientific, scholarly, artistic, athletic, or business-related contributions of major significance in the field",
    plain:
      "The heaviest of the ten, and the one that drives the final merits determination. Major significance means impact others can point to, evidenced by citation, adoption or independent expert letters.",
  },
  {
    ref: "(vi)",
    text: "Authorship of scholarly articles in the field, in professional or major trade publications or other major media",
    plain:
      "Publication itself, separate from its impact. Common for academics, rare for industry practitioners.",
  },
  {
    ref: "(vii)",
    text: "Display of the alien's work in the field at artistic exhibitions or showcases",
    plain: "An arts criterion. Not available to most technical filers.",
  },
  {
    ref: "(viii)",
    text: "Performance in a leading or critical role for organizations or establishments that have a distinguished reputation",
    plain:
      "Two halves, and both must be evidenced: your role was leading or critical, and the organisation itself is distinguished. An org chart plus letters from people above you is the usual proof.",
  },
  {
    ref: "(ix)",
    text: "Command of a high salary or other significantly high remuneration for services, in relation to others in the field",
    plain:
      "Comparative, not absolute. A strong US salary means little without wage data showing where it sits in the field and geography.",
  },
  {
    ref: "(x)",
    text: "Commercial successes in the performing arts, as shown by box office receipts or record, cassette, compact disk, or video sales",
    plain: "A performing-arts criterion. Not available to most technical filers.",
  },
];

/** 8 CFR 204.5(i)(3)(i) — meet at least two. */
export const EB1B_CRITERIA: RegCriterion[] = [
  {
    ref: "(A)",
    text: "Receipt of major prizes or awards for outstanding achievement in the academic field",
    plain: "A higher bar than the EB-1A equivalent: 'major', not 'lesser'.",
  },
  {
    ref: "(B)",
    text: "Membership in associations in the academic field which require outstanding achievements of their members",
    plain: "Same achievement-gated test as EB-1A, read within the academic field.",
  },
  {
    ref: "(C)",
    text: "Published material in professional publications written by others about the alien's work in the academic field",
    plain:
      "Note the narrowing against EB-1A: professional publications, and written by others.",
  },
  {
    ref: "(D)",
    text: "Participation, either individually or on a panel, as the judge of the work of others in the same or an allied academic field",
    plain: "Peer review and programme committees, as in EB-1A.",
  },
  {
    ref: "(E)",
    text: "Original scientific or scholarly research contributions to the academic field",
    plain:
      "Note what is missing against the EB-1A version: no 'of major significance'. This is the single biggest reason a strong academic record can clear EB-1B and not EB-1A.",
  },
  {
    ref: "(F)",
    text: "Authorship of scholarly books or articles (in scholarly journals with international circulation) in the academic field",
    plain: "International circulation is explicit here, and is checked.",
  },
];

/** The two EB-1B requirements that sit outside the six criteria. */
export const EB1B_EXTRA_REQUIREMENTS: { label: string; detail: string; cite: string }[] = [
  {
    label: "Three years of experience",
    detail:
      "At least three years of experience in teaching and/or research in the academic field. Work done toward a doctorate can count in limited circumstances.",
    cite: "8 CFR 204.5(i)(3)(iii)",
  },
  {
    label: "A qualifying offer",
    detail:
      "A tenured or tenure-track teaching offer, a comparable permanent research position at a university, or a permanent research position at a private employer.",
    cite: "8 CFR 204.5(i)(3)(iv)",
  },
  {
    label: "If the employer is private",
    detail:
      "The research department must employ at least three persons full-time in research positions and have documented accomplishments in the academic field.",
    cite: "8 CFR 204.5(i)(3)(iv)(C)",
  },
];

/** Matter of Dhanasar, as applied by the USCIS Policy Manual. */
export const DHANASAR_PRONGS: { n: number; prong: string; asks: string; fails: string }[] = [
  {
    n: 1,
    prong: "The proposed endeavour has both substantial merit and national importance",
    asks:
      "Describe the endeavour specifically — not your occupation, but the work you propose to do — and show why its implications reach beyond your employer or region.",
    fails:
      "Describing a job rather than an endeavour. 'I am a machine learning engineer' is an occupation; the endeavour is what you will build and who it serves.",
  },
  {
    n: 2,
    prong: "You are well positioned to advance the proposed endeavour",
    asks:
      "Your record, skills, progress to date, and interest from those who would use or fund the work.",
    fails:
      "This is where most NIW petitions die. The prong asks for evidence you have already advanced this endeavour, not that you are qualified to attempt it. A good CV plus a plan is not enough.",
  },
  {
    n: 3,
    prong:
      "On balance, it would be beneficial to the United States to waive the job offer and labour certification requirements",
    asks:
      "Why requiring a labour certification would be impractical or against the national interest in your case — for example self-employment, or urgency in the field.",
    fails:
      "Treating it as a formality. It is a separate balancing test and it has to be argued on its own terms.",
  },
];

/** The extended side-by-side grid, rendered as a real table. */
export const COMPARISON_TABLE: {
  label: string;
  values: Record<RouteId, string>;
  note?: string;
}[] = [
  {
    label: "Preference category",
    values: { eb1a: "EB-1", eb1b: "EB-1", eb1c: "EB-1", niw: "EB-2" },
    note: "This is the row that decides the wait for an India-born applicant.",
  },
  {
    label: "Who files",
    values: {
      eb1a: "You, for yourself",
      eb1b: "Your employer",
      eb1c: "Your US employer",
      niw: "You, for yourself",
    },
  },
  {
    label: "Job offer required",
    values: { eb1a: "No", eb1b: "Yes — permanent or tenure-track", eb1c: "Yes", niw: "No — waived" },
  },
  {
    label: "PERM labour certification",
    values: { eb1a: "No", eb1b: "No", eb1c: "No", niw: "No — waived" },
    note: "All four skip PERM. That is the whole appeal of this group of routes.",
  },
  {
    label: "The evidentiary test",
    values: {
      eb1a: "3 of 10 criteria, or one major award",
      eb1b: "2 of 6 criteria",
      eb1c: "1 year managerial or executive abroad",
      niw: "EB-2 eligibility, then 3 Dhanasar prongs",
    },
  },
  {
    label: "Is there a second-stage test?",
    values: {
      eb1a: "Yes — final merits determination",
      eb1b: "Yes — final merits determination",
      eb1c: "No — capacity is the test",
      niw: "The three prongs are the test",
    },
    note: "Ticking the boxes is necessary and not sufficient for EB-1A and EB-1B.",
  },
  {
    label: "Prior US status needed",
    values: {
      eb1a: "None",
      eb1b: "None",
      eb1c: "None, but the L-1A route is the common path",
      niw: "None",
    },
  },
  {
    label: "Regulation or guidance",
    values: {
      eb1a: "8 CFR 204.5(h)",
      eb1b: "8 CFR 204.5(i)",
      eb1c: "8 CFR 204.5(j)",
      niw: "Policy Manual Vol. 6, Pt. F, Ch. 5",
    },
  },
];
