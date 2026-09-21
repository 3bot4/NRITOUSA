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
