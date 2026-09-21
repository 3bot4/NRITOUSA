/**
 * Typed access + quiz logic for the 2025-version USCIS civics test.
 *
 * Reads data/citizenship-test-2025.json, which holds the official 128-question
 * bank transcribed from USCIS publication M-1778 (09/25) — a US government
 * work in the public domain.
 *
 * Pure functions only, so the selection and scoring rules are unit-testable and
 * the component stays a renderer. Deliberately NOT a React hook: the shuffle
 * has to be seedable for the tests, and a hook would hide that.
 *
 * Related: src/lib/citizenship.ts decides WHICH version of the test applies
 * from an N-400 filing date, and backs /tools/citizenship-checklist. This
 * module is the question bank and the quiz.
 */

import data from "../../data/citizenship-test-2025.json";

export type QuestionKind = "standard" | "current-official" | "state-specific";

export interface CivicsQuestion {
  /** Official question number, 1–128. */
  n: number;
  section: string;
  category: string;
  question: string;
  /**
   * Accepted answers as USCIS words them. Empty for questions whose answer
   * depends on who currently holds an office or on the applicant's state —
   * those carry a `note` pointing at where to look the answer up instead.
   */
  answers: string[];
  /** In the 20-question 65/20 set. */
  star: boolean;
  kind: QuestionKind;
  note?: string;
}

export const CIVICS = {
  version: data.version,
  sourceEdition: data.sourceEdition,
  sourceUrl: data.sourceUrl,
  testUpdatesUrl: data.testUpdatesUrl,
  studyPageUrl: data.studyPageUrl,
  lastVerified: data.lastVerified,
  format: data.format,
  priorVersion: data.priorVersion,
  interview: data.interview,
} as const;

export const QUESTIONS: CivicsQuestion[] = data.questions as CivicsQuestion[];

/** The 20 starred questions that make up the 65/20 set. */
export const SENIOR_QUESTIONS: CivicsQuestion[] = QUESTIONS.filter((q) => q.star);

/* ── Categories ─────────────────────────────────────────────────────────── */

export interface CivicsCategory {
  id: string;
  section: string;
  category: string;
  label: string;
  count: number;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Categories in the order USCIS prints them, which is also the order that
 * makes sense to study in. Built by walking the bank rather than hard-coding,
 * so a new edition cannot leave a stale category list behind.
 */
export function listCategories(): CivicsCategory[] {
  const out: CivicsCategory[] = [];
  const seen = new Set<string>();
  for (const q of QUESTIONS) {
    const id = `${slug(q.section)}--${slug(q.category)}`;
    if (seen.has(id)) {
      const existing = out.filter((c) => c.id === id)[0];
      existing.count += 1;
      continue;
    }
    seen.add(id);
    out.push({
      id,
      section: q.section,
      category: q.category,
      label: q.category,
      count: 1,
    });
  }
  return out;
}

export function questionsInCategory(id: string): CivicsQuestion[] {
  return QUESTIONS.filter((q) => `${slug(q.section)}--${slug(q.category)}` === id);
}

/* ── Selection ──────────────────────────────────────────────────────────── */

/**
 * Deterministic PRNG (mulberry32). Used so a test can assert the selection
 * rules without flakiness, and so a "retake the same set" option is possible.
 */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function rng() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates, non-mutating. */
export function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

export type TestMode = "standard" | "senior";

export interface TestSpec {
  mode: TestMode;
  poolSize: number;
  asked: number;
  toPass: number;
  /** Wrong answers at which the outcome is already decided against you. */
  toFail: number;
}

export function specFor(mode: TestMode): TestSpec {
  return mode === "senior"
    ? {
        mode,
        poolSize: CIVICS.format.senior.poolSize,
        asked: CIVICS.format.senior.questionsAsked,
        toPass: CIVICS.format.senior.correctToPass,
        // 10 asked, 6 to pass — so 5 wrong makes 6 correct unreachable.
        toFail:
          CIVICS.format.senior.questionsAsked -
          CIVICS.format.senior.correctToPass +
          1,
      }
    : {
        mode,
        poolSize: CIVICS.format.poolSize,
        asked: CIVICS.format.questionsAsked,
        toPass: CIVICS.format.correctToPass,
        toFail: CIVICS.format.incorrectToFail,
      };
}

export type Outcome = "in-progress" | "passed" | "failed";

/**
 * The real test stops early. USCIS: the officer "will stop asking questions
 * when an alien answers 12 questions correctly, or 9 questions incorrectly" —
 * so a real 2025 civics test is usually shorter than 20 questions, and the
 * mock test here behaves the same way rather than always running to 20.
 */
export function outcomeSoFar(
  correct: number,
  incorrect: number,
  spec: TestSpec
): Outcome {
  if (correct >= spec.toPass) return "passed";
  if (incorrect >= spec.toFail) return "failed";
  return "in-progress";
}

/**
 * Draws a mock test in the official format: 20 questions from all 128 (or 10
 * from the 20 starred questions in the 65/20 set).
 *
 * `only` restricts the draw to a supplied subset — used by "review the ones I
 * got wrong", which is the mode that actually moves a score.
 */
export function drawTest(
  mode: TestMode,
  rng: () => number,
  only?: CivicsQuestion[]
): CivicsQuestion[] {
  const spec = specFor(mode);
  const pool = only && only.length > 0
    ? only
    : mode === "senior"
      ? SENIOR_QUESTIONS
      : QUESTIONS;
  return shuffle(pool, rng).slice(0, Math.min(spec.asked, pool.length));
}

/* ── Scoring ────────────────────────────────────────────────────────────── */

export type Grade = "correct" | "incorrect" | "self-check";

export interface ScoredAnswer {
  n: number;
  grade: Grade;
}

export interface TestScore {
  asked: number;
  correct: number;
  incorrect: number;
  /** Questions the user marked as "I need to look this up" — never counted as correct. */
  selfCheck: number;
  toPass: number;
  passed: boolean;
  /** Decided, and how — mirrors the officer's stop rule. */
  outcome: Outcome;
  percent: number;
}

/**
 * Scores a finished test.
 *
 * A self-check question — one whose answer depends on a current officeholder or
 * on the applicant's state — is never scored as correct. Doing otherwise would
 * inflate the score on exactly the questions people most often fumble at the
 * interview, and the real test gives no such credit.
 */
export function scoreTest(answers: ScoredAnswer[], spec: TestSpec): TestScore {
  let correct = 0;
  let incorrect = 0;
  let selfCheck = 0;
  for (const a of answers) {
    if (a.grade === "correct") correct += 1;
    else if (a.grade === "incorrect") incorrect += 1;
    else selfCheck += 1;
  }
  const asked = answers.length;
  return {
    asked,
    correct,
    incorrect,
    selfCheck,
    toPass: spec.toPass,
    passed: correct >= spec.toPass,
    outcome: outcomeSoFar(correct, incorrect, spec),
    percent: asked === 0 ? 0 : Math.round((correct / asked) * 100),
  };
}

export interface CategoryScore {
  id: string;
  label: string;
  asked: number;
  correct: number;
  percent: number;
}

/** Per-category breakdown for the session chart. Categories with no questions asked are omitted. */
export function scoreByCategory(
  answers: ScoredAnswer[],
  questions: CivicsQuestion[]
): CategoryScore[] {
  const byN = new Map<number, CivicsQuestion>();
  for (const q of questions) byN.set(q.n, q);

  const acc: Record<string, CategoryScore> = {};
  for (const a of answers) {
    const q = byN.get(a.n);
    if (!q) continue;
    const id = `${slug(q.section)}--${slug(q.category)}`;
    if (!acc[id]) acc[id] = { id, label: q.category, asked: 0, correct: 0, percent: 0 };
    acc[id].asked += 1;
    if (a.grade === "correct") acc[id].correct += 1;
  }

  const out = Object.keys(acc).map((id) => {
    const c = acc[id];
    c.percent = c.asked === 0 ? 0 : Math.round((c.correct / c.asked) * 100);
    return c;
  });
  out.sort((a, b) => a.percent - b.percent || a.label.localeCompare(b.label));
  return out;
}

/**
 * Whether a self-check question can ever be scored correct. It cannot — see
 * scoreTest. Named here because it is the rule most likely to be "fixed" by a
 * future edit that would quietly inflate every score.
 */
export const SELF_CHECK_NEVER_COUNTS_CORRECT = true;
