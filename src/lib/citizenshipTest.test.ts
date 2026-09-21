import { describe, it, expect } from "vitest";
import {
  QUESTIONS,
  SENIOR_QUESTIONS,
  CIVICS,
  listCategories,
  questionsInCategory,
  makeRng,
  shuffle,
  specFor,
  drawTest,
  scoreTest,
  scoreByCategory,
  outcomeSoFar,
  type ScoredAnswer,
} from "./citizenshipTest";

describe("the question bank matches what USCIS publishes", () => {
  it("holds exactly 128 questions, numbered 1 to 128 with no gaps or duplicates", () => {
    expect(QUESTIONS).toHaveLength(CIVICS.format.poolSize);
    expect(QUESTIONS.map((q) => q.n)).toEqual(
      Array.from({ length: 128 }, (_, i) => i + 1)
    );
  });

  it("marks exactly 20 questions for the 65/20 set", () => {
    expect(SENIOR_QUESTIONS).toHaveLength(CIVICS.format.senior.poolSize);
  });

  it("gives every standard question at least one answer", () => {
    const empty = QUESTIONS.filter((q) => q.kind === "standard" && q.answers.length === 0);
    expect(empty.map((q) => q.n)).toEqual([]);
  });

  it("holds NO answer for questions that depend on a current officeholder or a state", () => {
    const lookups = QUESTIONS.filter((q) => q.kind !== "standard");
    expect(lookups.length).toBeGreaterThan(0);
    for (const q of lookups) {
      expect(q.answers).toEqual([]);
      expect(q.note).toBeTruthy();
    }
  });

  it("never hard-codes a name that changes with an election", () => {
    // The president, vice president, speaker, chief justice, senators, the
    // governor: all must be lookups, never a name frozen into the repo.
    for (const n of [23, 29, 30, 38, 39, 57, 61]) {
      expect(QUESTIONS[n - 1].kind).toBe("current-official");
    }
    expect(QUESTIONS[61].kind).toBe("state-specific");
  });

  it("carries no leftover ligature damage from the source PDF", () => {
    const blob = JSON.stringify(QUESTIONS);
    for (const artifact of ["oicer", "oice ", "Aairs", "Jeerson", "A er ", "flage"]) {
      expect(blob).not.toContain(artifact);
    }
  });

  it("records the source edition and a verification date", () => {
    expect(CIVICS.sourceEdition).toMatch(/M-1778/);
    expect(CIVICS.sourceUrl).toMatch(/^https:\/\/www\.uscis\.gov\//);
    expect(CIVICS.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("states the format USCIS publishes: 128 pool, 20 asked, 12 to pass, 9 to fail", () => {
    expect(CIVICS.format.poolSize).toBe(128);
    expect(CIVICS.format.questionsAsked).toBe(20);
    expect(CIVICS.format.correctToPass).toBe(12);
    expect(CIVICS.format.incorrectToFail).toBe(9);
    expect(CIVICS.format.appliesToFilingsOnOrAfter).toBe("2025-10-20");
  });
});

describe("categories", () => {
  it("covers every question exactly once across all categories", () => {
    const cats = listCategories();
    const total = cats.reduce((sum, c) => sum + c.count, 0);
    expect(total).toBe(QUESTIONS.length);
  });

  it("returns the right questions for a category id", () => {
    for (const c of listCategories()) {
      const qs = questionsInCategory(c.id);
      expect(qs).toHaveLength(c.count);
      expect(qs.every((q) => q.category === c.category)).toBe(true);
    }
  });

  it("returns an empty list for an unknown category rather than throwing", () => {
    expect(questionsInCategory("no-such-category")).toEqual([]);
  });
});

describe("shuffle", () => {
  it("is a permutation — same members, no loss, no duplication", () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const out = shuffle(src, makeRng(42));
    expect(out.slice().sort((a, b) => a - b)).toEqual(src);
  });

  it("does not mutate the input", () => {
    const src = [1, 2, 3];
    shuffle(src, makeRng(1));
    expect(src).toEqual([1, 2, 3]);
  });

  it("is deterministic for a given seed and different across seeds", () => {
    const a = shuffle(QUESTIONS.map((q) => q.n), makeRng(7));
    const b = shuffle(QUESTIONS.map((q) => q.n), makeRng(7));
    const c = shuffle(QUESTIONS.map((q) => q.n), makeRng(8));
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });
});

describe("drawTest", () => {
  it("draws 20 distinct questions from the full bank in standard mode", () => {
    const test = drawTest("standard", makeRng(3));
    expect(test).toHaveLength(20);
    expect(new Set(test.map((q) => q.n)).size).toBe(20);
  });

  it("draws 10 questions, all starred, in 65/20 mode", () => {
    const test = drawTest("senior", makeRng(3));
    expect(test).toHaveLength(10);
    expect(test.every((q) => q.star)).toBe(true);
  });

  it("restricts the draw to a supplied review pool", () => {
    const pool = QUESTIONS.slice(0, 5);
    const test = drawTest("standard", makeRng(3), pool);
    expect(test).toHaveLength(5); // never more than the pool holds
    expect(test.every((q) => pool.indexOf(q) !== -1)).toBe(true);
  });

  it("ignores an empty review pool and falls back to the full bank", () => {
    expect(drawTest("standard", makeRng(3), [])).toHaveLength(20);
  });
});

describe("outcomeSoFar — the officer's stop rule", () => {
  const spec = specFor("standard");

  it("passes at 12 correct, before all 20 are asked", () => {
    expect(outcomeSoFar(12, 0, spec)).toBe("passed");
    expect(outcomeSoFar(11, 0, spec)).toBe("in-progress");
  });

  it("fails at 9 incorrect", () => {
    expect(outcomeSoFar(0, 9, spec)).toBe("failed");
    expect(outcomeSoFar(0, 8, spec)).toBe("in-progress");
  });

  it("derives the 65/20 fail threshold from its own numbers", () => {
    const senior = specFor("senior");
    expect(senior.asked).toBe(10);
    expect(senior.toPass).toBe(6);
    expect(senior.toFail).toBe(5); // 5 wrong makes 6 correct unreachable
    expect(outcomeSoFar(0, 5, senior)).toBe("failed");
  });
});

describe("scoreTest", () => {
  const spec = specFor("standard");
  const answers = (correct: number, incorrect: number, self = 0): ScoredAnswer[] => [
    ...Array.from({ length: correct }, (_, i) => ({ n: i + 1, grade: "correct" as const })),
    ...Array.from({ length: incorrect }, (_, i) => ({ n: 50 + i, grade: "incorrect" as const })),
    ...Array.from({ length: self }, (_, i) => ({ n: 100 + i, grade: "self-check" as const })),
  ];

  it("passes at exactly the pass mark", () => {
    const s = scoreTest(answers(12, 8), spec);
    expect(s.passed).toBe(true);
    expect(s.outcome).toBe("passed");
  });

  it("fails one short of the pass mark", () => {
    const s = scoreTest(answers(11, 9), spec);
    expect(s.passed).toBe(false);
  });

  it("never scores a self-check question as correct", () => {
    const s = scoreTest(answers(11, 0, 9), spec);
    expect(s.correct).toBe(11);
    expect(s.selfCheck).toBe(9);
    expect(s.passed).toBe(false);
  });

  it("handles an empty test without dividing by zero", () => {
    const s = scoreTest([], spec);
    expect(s.percent).toBe(0);
    expect(s.asked).toBe(0);
    expect(s.passed).toBe(false);
  });

  it("reports a percentage of what was actually asked, not of 20", () => {
    const s = scoreTest(answers(12, 0), spec);
    expect(s.asked).toBe(12);
    expect(s.percent).toBe(100);
  });
});

describe("scoreByCategory", () => {
  it("buckets answers by category and sorts weakest first", () => {
    const asked = QUESTIONS.slice(0, 30);
    const answers: ScoredAnswer[] = asked.map((q, i) => ({
      n: q.n,
      grade: i % 3 === 0 ? "incorrect" : "correct",
    }));
    const rows = scoreByCategory(answers, asked);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.reduce((s, r) => s + r.asked, 0)).toBe(30);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].percent).toBeGreaterThanOrEqual(rows[i - 1].percent);
    }
  });

  it("ignores answers for questions that were not asked", () => {
    const rows = scoreByCategory([{ n: 9999, grade: "correct" }], QUESTIONS.slice(0, 3));
    expect(rows).toEqual([]);
  });
});
