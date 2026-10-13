/**
 * O-1A criteria self-check.
 *
 * Counts how many of the eight criteria in 8 CFR 214.2(o)(3)(iii)(B) a user's
 * own assessment of their evidence plausibly supports, and reports the gap to
 * the three the regulation requires.
 *
 * WHAT THIS IS NOT. It is not an eligibility opinion and the arithmetic is the
 * easy half of the problem. Meeting three criteria on paper is necessary and
 * not sufficient: the evidence has to satisfy an officer on its own terms, and
 * the quality of a claim under one criterion is worth more than the count. The
 * `verdict` strings say so, and nothing in this module returns "eligible".
 *
 * Three answer states, deliberately:
 *   have    — you hold documentary evidence you could file today
 *   partial — something is there but it is not yet documented or not yet strong
 *   none    — nothing
 *
 * `partial` is counted SEPARATELY and never toward the three. The whole failure
 * mode of a self-assessment tool is optimism, so a half-claim counts as zero
 * and is reported as a gap worth closing rather than as progress.
 */

import { O1A_CRITERIA } from "@/data/o1VisaData";

export type CriterionAnswer = "have" | "partial" | "none";

export interface O1CriteriaInput {
  /** criterion id → answer. Missing ids are treated as "none". */
  answers: Record<string, CriterionAnswer>;
  /** Does the user hold a major, internationally recognised award? */
  majorAward: boolean;
}

export interface O1CriteriaResult {
  /** Criteria answered "have". This is the number that counts. */
  met: number;
  /** Criteria answered "partial". Counted toward nothing. */
  partial: number;
  /** How many more "have" answers are needed to reach three. */
  shortBy: number;
  /** True only when the user claimed a major award. */
  majorAwardRoute: boolean;
  required: number;
  tone: "none" | "early" | "close" | "threshold" | "award";
  headline: string;
  verdict: string;
  /** Criteria answered "partial", ordered with the most reachable first. */
  closest: { id: string; ref: string; plain: string; reach: string }[];
  /** Criteria answered "none" that the data marks as buildable. */
  buildable: { id: string; ref: string; plain: string }[];
  nextSteps: string[];
}

export const O1A_REQUIRED = 3;
export const O1A_TOTAL = O1A_CRITERIA.length;

const answerOf = (
  answers: Record<string, CriterionAnswer>,
  id: string,
): CriterionAnswer => answers[id] ?? "none";

export function scoreO1Criteria(input: O1CriteriaInput): O1CriteriaResult {
  const { answers, majorAward } = input;

  const have = O1A_CRITERIA.filter((c) => answerOf(answers, c.id) === "have");
  const part = O1A_CRITERIA.filter((c) => answerOf(answers, c.id) === "partial");
  const none = O1A_CRITERIA.filter((c) => answerOf(answers, c.id) === "none");

  const met = have.length;
  const shortBy = Math.max(0, O1A_REQUIRED - met);

  // "buildable" first inside each group — the data file marks which criteria
  // are commonly reachable from ordinary industry work rather than structural.
  const byReach = <T extends { reach: string }>(xs: T[]) =>
    xs.slice().sort((a, b) => (a.reach === "buildable" ? -1 : 1) - (b.reach === "buildable" ? -1 : 1));

  const closest = byReach(part).map((c) => ({
    id: c.id,
    ref: c.ref,
    plain: c.plain,
    reach: c.reach,
  }));

  const buildable = none
    .filter((c) => c.reach === "buildable")
    .map((c) => ({ id: c.id, ref: c.ref, plain: c.plain }));

  let tone: O1CriteriaResult["tone"];
  let headline: string;
  let verdict: string;

  if (majorAward) {
    tone = "award";
    headline = "The award route, if the award qualifies";
    verdict =
      "A major, internationally recognised award under 8 CFR 214.2(o)(3)(iii)(A) replaces the criteria list entirely rather than counting as one of the three. The regulation's own example is the Nobel Prize, which sets the register — a national award, an industry prize or a company honour is almost certainly a criterion (1) claim rather than this route. Have the award assessed against that standard before building a petition around it, and build the three-criteria case in parallel.";
  } else if (met === 0 && part.length === 0) {
    tone = "none";
    headline = "Nothing recorded yet";
    verdict =
      "Mark the evidence you actually hold. The question for each criterion is whether you could put documents in front of an officer today, not whether the description sounds like you.";
  } else if (met >= O1A_REQUIRED) {
    tone = "threshold";
    headline = `${met} of ${O1A_TOTAL} criteria supported by documents you hold`;
    verdict =
      `Three is the regulatory threshold and you are at ${met}. That clears the arithmetic, and the arithmetic is the easy part: USCIS weighs the record as a whole, and petitions that meet three criteria on paper are refused on the strength of the underlying evidence. The useful next step is to have the strongest ${Math.min(met, 4)} claims assessed on their documents, not to add a fourth weak one.`;
  } else if (met === 2) {
    tone = "close";
    headline = `2 of ${O1A_TOTAL} criteria supported — one short`;
    verdict =
      "One more documented criterion reaches the threshold. Look first at the ones below that are commonly reachable inside a year of deliberate effort: judging other people's work and an achievement-based association membership are the two most often left unclaimed by people who already qualify for them.";
  } else {
    tone = "early";
    headline = `${met} of ${O1A_TOTAL} criteria supported — ${shortBy} short`;
    verdict =
      `You need ${shortBy} more criteria supported by documents you hold. That is a planning problem rather than a verdict: several of the eight are built rather than inherited, and the ones marked below as reachable are where that effort goes furthest.`;
  }

  const nextSteps: string[] = [];
  if (!majorAward && shortBy > 0) {
    nextSteps.push(
      `Close ${shortBy === 1 ? "one" : String(shortBy)} more criterion to reach the regulatory threshold of three.`,
    );
  }
  if (closest.length > 0) {
    nextSteps.push(
      `Turn your ${closest.length === 1 ? "partial claim" : `${closest.length} partial claims`} into documents. A criterion you can describe but not evidence counts for nothing in a petition.`,
    );
  }
  if (buildable.length > 0) {
    nextSteps.push(
      "Several unclaimed criteria are ones people in ordinary industry roles can reach deliberately — see the reachable list below.",
    );
  }
  nextSteps.push(
    "If a listed criterion does not readily apply to your occupation, 8 CFR 214.2(o)(3)(iii)(C) allows comparable evidence. That is a route written into the regulation, not a concession — but the petition has to name the criterion it stands in for and say why the listed one does not fit.",
  );
  nextSteps.push(
    "An O-1 needs a petitioning employer or a US agent, and a mandatory advisory opinion. Neither is something this check can assess, and both take lead time.",
  );

  return {
    met,
    partial: part.length,
    shortBy,
    majorAwardRoute: majorAward,
    required: O1A_REQUIRED,
    tone,
    headline,
    verdict,
    closest,
    buildable,
    nextSteps,
  };
}
