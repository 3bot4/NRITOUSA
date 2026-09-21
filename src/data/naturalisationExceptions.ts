/**
 * Exceptions and accommodations for the naturalisation English and civics
 * tests.
 *
 * Neither our practice-test page nor the competitor's covered this, and it is
 * the half that matters most to the reader we actually have: an Indian parent
 * naturalising in their sixties or seventies after a family-based green card,
 * for whom the question is not "how do I study 128 questions" but "do I have
 * to take this in English at all".
 *
 * Read from uscis.gov/citizenship/exceptions-and-accommodations and the USCIS
 * Policy Manual Vol. 12, Pt. E, Ch. 2 and Ch. 3 on 2026-09-20.
 *
 * Educational only. Not legal advice.
 */

export const NAT_EXCEPTION_SOURCES = {
  exceptions: "https://www.uscis.gov/citizenship/exceptions-and-accommodations",
  englishCivicsPolicy: "https://www.uscis.gov/policy-manual/volume-12-part-e-chapter-2",
  n648Policy: "https://www.uscis.gov/policy-manual/volume-12-part-e-chapter-3",
  n648Form: "https://www.uscis.gov/n-648",
  fiftyPlusFactSheet:
    "https://www.uscis.gov/sites/default/files/document/fact-sheets/Fact-Sheet-Promoting-Citizenship-for-50-and-Older.pdf",
} as const;

export const NAT_EXCEPTIONS_UPDATED = "2026-09-20";

export interface AgeTimeException {
  id: string;
  /** The shorthand everybody uses. */
  name: string;
  minAge: number;
  minYearsLpr: number;
  /** Does the English test still apply? */
  englishRequired: boolean;
  /** Does the civics test still apply, and in what form? */
  civics: string;
  note: string;
}

/**
 * The three age-and-residence exceptions. Eligibility is measured AT THE TIME
 * OF FILING the N-400, not at the interview — which matters, because a few
 * weeks either side of a birthday can change which rule you file under.
 */
export const AGE_TIME_EXCEPTIONS: AgeTimeException[] = [
  {
    id: "50-20",
    name: "50/20",
    minAge: 50,
    minYearsLpr: 20,
    englishRequired: false,
    civics: "Still required, but you may take it in the language of your choice.",
    note: "You bring an interpreter. The full civics pool still applies.",
  },
  {
    id: "55-15",
    name: "55/15",
    minAge: 55,
    minYearsLpr: 15,
    englishRequired: false,
    civics: "Still required, but you may take it in the language of your choice.",
    note: "Identical treatment to 50/20 — a different age-and-years combination reaching the same place.",
  },
  {
    id: "65-20",
    name: "65/20",
    minAge: 65,
    minYearsLpr: 20,
    englishRequired: false,
    civics:
      "Required, in the language of your choice, and from a reduced set of questions with a lower pass mark.",
    note: "The only exception that reduces what you have to study. USCIS marks the qualifying questions in its own publication.",
  },
];

/** The medical disability exception. A different mechanism entirely. */
export const N648 = {
  form: "N-648",
  title: "Medical Certification for Disability Exceptions",
  covers:
    "An exception to the English requirement, the civics requirement, or both.",
  condition:
    "A medically determinable physical or developmental disability or mental impairment that has lasted, or is expected to last, at least 12 months.",
  certifier:
    "Only a medical doctor, doctor of osteopathy, or clinical psychologist licensed to practise in the United States may certify it.",
  excludes:
    "The impairment cannot be the direct effect of illegal drug use.",
  filedWith:
    "Filed with the N-400 where possible, or brought to the interview. There is no fee for the form itself.",
  lastVerified: NAT_EXCEPTIONS_UPDATED,
} as const;

/** The English portion, broken into its three parts. */
export const ENGLISH_PORTION: {
  part: string;
  what: string;
  howJudged: string;
}[] = [
  {
    part: "Reading",
    what: "Read one of three sentences aloud correctly.",
    howJudged:
      "One correct reading out of up to three attempts. USCIS publishes the vocabulary list the sentences are drawn from.",
  },
  {
    part: "Writing",
    what: "Write one of three sentences correctly.",
    howJudged:
      "One correct writing out of up to three attempts, from the same published vocabulary list.",
  },
  {
    part: "Speaking",
    what: "Not a separate exercise at all.",
    howJudged:
      "Assessed by the officer through the eligibility interview itself — your answers to the N-400 questions are the test.",
  },
];
