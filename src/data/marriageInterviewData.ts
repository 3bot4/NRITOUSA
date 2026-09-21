/**
 * Marriage-based green card interview: example question sets and the documents
 * table for /green-card/marriage-interview-questions.
 *
 * ⚠️ THESE ARE NOT AN OFFICIAL USCIS LIST. USCIS does not publish the questions
 * an officer will ask, and any site claiming to reproduce "the" list is
 * inventing one. Every question below was written for this page, grouped by the
 * themes officers are documented as probing (the genuineness of the marriage,
 * shared life, finances, and the parts of the story only a real couple would
 * know). They are practice prompts, not predictions.
 *
 * The page must say all of that on its face, and the tool repeats it.
 *
 * Educational only. Not legal advice.
 */

export const MARRIAGE_INTERVIEW_SOURCES = {
  policyManualAdjustment: "https://www.uscis.gov/policy-manual/volume-7-part-a-chapter-5",
  policyManualMarriage: "https://www.uscis.gov/policy-manual/volume-7-part-b",
  i485: "https://www.uscis.gov/i-485",
  i130: "https://www.uscis.gov/i-130",
  interviewPage:
    "https://www.uscis.gov/green-card/green-card-processes-and-procedures/adjustment-of-status",
  i751: "https://www.uscis.gov/i-751",
} as const;

export const MARRIAGE_INTERVIEW_UPDATED = "2026-09-16";

export interface QuestionCategory {
  id: string;
  label: string;
  /** What an officer is testing with this group. */
  testing: string;
  questions: string[];
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "how-you-met",
    label: "How you met and how it became a marriage",
    testing:
      "Whether there is a coherent, consistent story with real texture in it — dates, places, the people who were there.",
    questions: [
      "Where were you when you first met, and who else was there?",
      "Who introduced you, and what did they say about the other person beforehand?",
      "How long was it between meeting and deciding to marry?",
      "Which of you raised marriage first, and where were you when it happened?",
      "Did your families meet before the wedding? Where, and who travelled?",
      "What did you disagree about while planning the wedding?",
      "Where did the wedding take place, and roughly how many people came?",
      "Who paid for the wedding, and how was that decided?",
      "Where did you go immediately after the wedding?",
      "What is the date of your wedding anniversary?",
    ],
  },
  {
    id: "daily-life",
    label: "Daily life in the home",
    testing:
      "Whether you actually live together. These are the questions people find hardest, because nobody rehearses the boring parts of their own life.",
    questions: [
      "What time does each of you usually leave for work in the morning?",
      "Who gets up first, and what is the first thing that person does?",
      "Which side of the bed does each of you sleep on?",
      "How many bedrooms does your home have, and what is each used for?",
      "What colour are the walls in your living room?",
      "Where do you keep the spare keys?",
      "Who does the cooking on a weekday, and what did you eat last night?",
      "Which of you does the laundry, and where is the machine?",
      "What did you both do last weekend?",
      "Who takes the rubbish out, and which day is collection?",
      "What is your spouse's morning drink — tea, coffee, neither, and how do they take it?",
      "Do you have a car? Who drives it more, and where is it parked?",
    ],
  },
  {
    id: "family-and-people",
    label: "Each other's family and friends",
    testing:
      "Whether you have actually been absorbed into each other's lives, which is much harder to fake than a shared address.",
    questions: [
      "What are your mother-in-law's and father-in-law's first names?",
      "How many siblings does your spouse have, and where do they live?",
      "When did you last speak to your spouse's parents, and what about?",
      "Whose birthday is next in the family, and what are you doing for it?",
      "Name two of your spouse's closest friends and how they know each other.",
      "Which relative of your spouse's do you get on with best, and why?",
      "What languages are spoken when your spouse's family is together?",
      "Who came to visit you most recently, and where did they sleep?",
    ],
  },
  {
    id: "money",
    label: "Money and the practical machinery",
    testing:
      "Whether your finances are actually entangled. This is the group that most often exposes a marriage of convenience, because two lives that are not really shared tend to keep separate money.",
    questions: [
      "Do you have a joint account? At which bank, and who opened it?",
      "Who pays the rent or the mortgage, and how — transfer, cheque, card?",
      "Roughly what is your monthly rent or mortgage payment?",
      "How do you split the bills?",
      "Whose name is on the electricity account?",
      "Did you file taxes jointly or separately last year, and who prepared them?",
      "Is your spouse on your health insurance? Through which employer?",
      "Who is named as the beneficiary on your retirement account or life insurance?",
      "Have you sent money to family abroad in the last year? Who sent it and to whom?",
      "What is the biggest thing you have bought together?",
    ],
  },
  {
    id: "history-and-plans",
    label: "Shared history and what comes next",
    testing:
      "Whether the marriage has a past and a future, rather than only a filing date.",
    questions: [
      "Where did you spend your last anniversary?",
      "What did you give each other for the most recent birthday?",
      "Where was your last trip together, and who booked it?",
      "Has either of you been in hospital since the marriage? What happened?",
      "What is the hardest thing you have been through together?",
      "Do you plan to have children, or do you have children already?",
      "Where do you expect to be living in five years?",
      "Has either of you been married before? What happened?",
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTION_CATEGORIES.reduce(
  (n, c) => n + c.questions.length,
  0
);

/* ── Documents table (used instead of a chart — there is no honest dataset) ── */

export interface DocumentRow {
  category: string;
  items: string;
  weight: "Essential" | "Strong" | "Supporting";
}

export const DOCUMENT_ROWS: DocumentRow[] = [
  {
    category: "Identity and the notice",
    items:
      "The interview appointment notice itself, passports for both of you, the beneficiary's I-94 and current EAD or advance parole, and any prior USCIS notices.",
    weight: "Essential",
  },
  {
    category: "The marriage",
    items:
      "Original marriage certificate. For a marriage registered in India, bring the registration certificate as well as the religious certificate — the registered one is the document USCIS treats as the marriage record.",
    weight: "Essential",
  },
  {
    category: "Ending prior marriages",
    items:
      "Original divorce decrees or death certificates for any earlier marriage on either side, with certified translations.",
    weight: "Essential",
  },
  {
    category: "Living together",
    items:
      "Lease or deed with both names, utility bills across the whole period, home or renter's insurance, and mail addressed to each of you at the same address over time.",
    weight: "Strong",
  },
  {
    category: "Shared finances",
    items:
      "Joint bank statements covering the full marriage, joint tax return transcripts, shared credit cards, and beneficiary designations naming each other.",
    weight: "Strong",
  },
  {
    category: "Insurance and employment",
    items:
      "Health insurance listing the spouse as a dependent, employer benefit enrolment forms, and emergency-contact records naming each other.",
    weight: "Strong",
  },
  {
    category: "Children",
    items:
      "Birth certificates naming both parents, school or medical records listing both.",
    weight: "Strong",
  },
  {
    category: "The relationship over time",
    items:
      "Photographs spread across the whole relationship rather than clustered at the wedding, travel itineraries, and correspondence between you and with each other's families.",
    weight: "Supporting",
  },
  {
    category: "Wedding evidence from India",
    items:
      "The invitation card, photographs with both families identifiable, receipts from the venue or caterer, and flight records for relatives who travelled.",
    weight: "Supporting",
  },
  {
    category: "Financial support",
    items:
      "The affidavit of support with the sponsor's most recent tax return, W-2s or 1099s, and recent pay evidence.",
    weight: "Essential",
  },
];

/* ── Interview-day stages, for the diagram ─────────────────────────────── */

export const INTERVIEW_DAY: { t: string; d: string }[] = [
  { t: "Check in", d: "Security, then the waiting room. Arrive early; bring the appointment notice." },
  { t: "The oath", d: "The officer swears you both in. Everything said after this is under oath." },
  { t: "Documents reviewed", d: "Originals are checked against the copies already in the file." },
  { t: "Questions together", d: "Usually most of the interview: the relationship, the household, the finances." },
  { t: "Separate interviews — only sometimes", d: "If the officer has doubts, you are questioned apart and the answers compared. This is the 'second-stage' or Stokes interview." },
  { t: "Outcome", d: "Approved on the day, an RFE for more evidence, a case continued for review, or a denial." },
];

/* ══════════ scrutiny factors and the second interview (2026-09-20) ═══════ */

/**
 * What raises scrutiny, and — just as important — what does not.
 *
 * Written deliberately as two columns rather than as a "red flags" list. The
 * lists circulating online frighten genuine couples about things that are not
 * problems at all (an age gap, an arranged marriage, a short courtship), while
 * saying nothing about the thing that actually decides it: whether the paper
 * record shows two people running one life.
 *
 * These are patterns in how cases are examined, not a published USCIS
 * checklist, and the page says so. Educational only. Not legal advice.
 */

export interface ScrutinyFactor {
  factor: string;
  /** Why it draws a closer look. */
  why: string;
  /** What answers it. */
  answer: string;
}

export const SCRUTINY_FACTORS: ScrutinyFactor[] = [
  {
    factor: "Very little documentary overlap",
    why: "No joint account, no joint lease, no shared insurance, nothing with both names on it. This is the single biggest driver of a second look.",
    answer:
      "Whatever genuinely exists, across time rather than from one week — and an honest explanation where a normal document is missing.",
  },
  {
    factor: "The couple has not lived together",
    why: "Common and legitimate — a posting, a visa, an elderly parent — but it removes most of the evidence officers usually rely on.",
    answer:
      "Travel records, call and message logs, remittances, leases at both addresses, and a clear account of why and for how long.",
  },
  {
    factor: "Answers that diverge on ordinary facts",
    why: "Not the memorable things. The side of the bed, the brand of toothpaste, who took the bins out.",
    answer:
      "Nothing to fix in advance except not rehearsing. Rehearsed couples diverge more, not less, because they agree a script and then improvise under pressure.",
  },
  {
    factor: "The marriage came very soon after a status problem",
    why: "A filing that closely follows an expiring status or a removal proceeding invites the question of sequence.",
    answer:
      "The timeline as it actually happened, documented — and the relationship evidence that predates the status event.",
  },
  {
    factor: "A prior marriage-based petition",
    why: "A second marriage-based filing by the same petitioner is examined more closely by design.",
    answer: "Complete documentation of how the earlier marriage began and ended.",
  },
  {
    factor: "Inconsistencies between the forms and the answers",
    why: "Addresses, employment dates and travel that do not match what is on the I-130, the I-485 or the DS-260.",
    answer:
      "Re-read your own filings the week before. Most inconsistencies are clerical, and correcting one yourself is far better than being corrected.",
  },
];

/** Things widely repeated as "red flags" that are not, on their own, problems. */
export const NOT_RED_FLAGS: { thing: string; reality: string }[] = [
  {
    thing: "An arranged marriage",
    reality:
      "Officers see them constantly and the legal test is unchanged: was the marriage entered into in good faith. How you met is not the question.",
  },
  {
    thing: "A short courtship",
    reality:
      "Nothing in the law sets a minimum. What a short courtship does is leave less evidence, which is a documentation problem, not a credibility one.",
  },
  {
    thing: "A large age difference",
    reality: "Not a ground for anything by itself.",
  },
  {
    thing: "Living apart for part of the marriage",
    reality:
      "Extremely common in immigration cases by definition. It needs explaining, not defending.",
  },
  {
    thing: "Being nervous",
    reality:
      "Everybody is. Officers conduct these interviews daily and nerves are the baseline, not a signal.",
  },
  {
    thing: "Not remembering a date",
    reality:
      "Saying you do not remember is a better answer than guessing. A wrong confident answer is what creates a discrepancy.",
  },
];

/** The second interview, by the name people search for. */
export const STOKES = {
  name: "Stokes interview",
  alsoCalled: "second-stage interview, or simply 'separate interviews'",
  whatItIs:
    "Each spouse is questioned separately, on the same questions, and the two sets of answers are compared. It follows a joint interview where the officer was not satisfied.",
  whatItIsNot:
    "It is not a denial, and it is not a fraud finding. It is a request for better evidence, delivered as questions rather than as an RFE.",
  whatHappens:
    "One spouse waits outside. The officer works through daily-life detail in depth, records the answers, then repeats the process with the other spouse. Differences are put to you for explanation rather than held back.",
  howToPrepare:
    "The same way you prepare for the first one, which is to say barely at all — know your own life, re-read your own forms, and do not agree on a version of anything.",
} as const;
