import { describe, expect, it } from "vitest";
import { scoreO1Criteria, O1A_REQUIRED, O1A_TOTAL, type CriterionAnswer } from "./o1Criteria";
import { O1A_CRITERIA } from "@/data/o1VisaData";

const answers = (spec: Record<string, CriterionAnswer>) => ({
  answers: spec,
  majorAward: false,
});

describe("the regulation's shape", () => {
  it("has eight criteria and needs three", () => {
    expect(O1A_TOTAL).toBe(8);
    expect(O1A_REQUIRED).toBe(3);
    expect(O1A_CRITERIA).toHaveLength(8);
  });

  it("gives every criterion a stable id the tool can key on", () => {
    const ids = O1A_CRITERIA.map((c) => c.id);
    expect(new Set(ids).size).toBe(8);
    expect(ids.every((i) => i.length > 0)).toBe(true);
  });
});

describe("counting", () => {
  it("counts nothing when nothing is answered", () => {
    const r = scoreO1Criteria(answers({}));
    expect(r.met).toBe(0);
    expect(r.shortBy).toBe(3);
    expect(r.tone).toBe("none");
  });

  it("counts only 'have' answers toward the three", () => {
    const r = scoreO1Criteria(
      answers({ awards: "have", judging: "partial", press: "partial", articles: "none" }),
    );
    expect(r.met).toBe(1);
    expect(r.partial).toBe(2);
    expect(r.shortBy).toBe(2);
  });

  // The failure mode of a self-assessment tool is optimism.
  it("never counts a partial claim toward the threshold", () => {
    const allPartial: Record<string, CriterionAnswer> = {};
    for (const c of O1A_CRITERIA) allPartial[c.id] = "partial";
    const r = scoreO1Criteria(answers(allPartial));
    expect(r.met).toBe(0);
    expect(r.partial).toBe(8);
    expect(r.shortBy).toBe(3);
    expect(r.tone).toBe("early");
  });

  it("reports the threshold reached at three", () => {
    const r = scoreO1Criteria(
      answers({ awards: "have", judging: "have", press: "have" }),
    );
    expect(r.met).toBe(3);
    expect(r.shortBy).toBe(0);
    expect(r.tone).toBe("threshold");
  });

  it("flags being one short at two", () => {
    const r = scoreO1Criteria(answers({ awards: "have", judging: "have" }));
    expect(r.tone).toBe("close");
    expect(r.shortBy).toBe(1);
  });

  it("does not report a negative shortfall above three", () => {
    const all: Record<string, CriterionAnswer> = {};
    for (const c of O1A_CRITERIA) all[c.id] = "have";
    const r = scoreO1Criteria(answers(all));
    expect(r.met).toBe(8);
    expect(r.shortBy).toBe(0);
  });

  it("treats an unanswered criterion as none", () => {
    const r = scoreO1Criteria(answers({ awards: "have" }));
    expect(r.met + r.partial + r.buildable.length).toBeLessThanOrEqual(8);
    expect(r.met).toBe(1);
  });
});

describe("the major-award route", () => {
  it("replaces the list rather than counting as one criterion", () => {
    const r = scoreO1Criteria({ answers: {}, majorAward: true });
    expect(r.majorAwardRoute).toBe(true);
    expect(r.tone).toBe("award");
    expect(r.verdict).toContain("replaces the criteria list entirely");
  });

  it("sets the register with the regulation's own example", () => {
    const r = scoreO1Criteria({ answers: {}, majorAward: true });
    expect(r.verdict).toContain("Nobel");
  });
});

describe("guidance", () => {
  it("surfaces partial claims as the closest gaps", () => {
    const r = scoreO1Criteria(answers({ judging: "partial", membership: "partial" }));
    expect(r.closest.map((c) => c.id).sort()).toEqual(["judging", "membership"]);
  });

  it("suggests the buildable criteria that are unclaimed", () => {
    const r = scoreO1Criteria(answers({ articles: "have" }));
    const ids = r.buildable.map((c) => c.id);
    expect(ids).toContain("judging");
    expect(ids).toContain("membership");
    // Structural criteria are not presented as things to go and build.
    expect(ids).not.toContain("salary");
    expect(ids).not.toContain("contributions");
  });

  it("always names the comparable-evidence route and the advisory opinion", () => {
    const steps = scoreO1Criteria(answers({})).nextSteps.join(" ");
    expect(steps).toContain("(o)(3)(iii)(C)");
    expect(steps).toContain("advisory opinion");
  });
});

describe("output hygiene", () => {
  it("never tells anyone they are eligible, even at eight of eight", () => {
    const all: Record<string, CriterionAnswer> = {};
    for (const c of O1A_CRITERIA) all[c.id] = "have";
    const blob = JSON.stringify(scoreO1Criteria(answers(all))).toLowerCase();
    expect(blob).not.toContain("you are eligible");
    expect(blob).not.toContain("you will qualify");
    expect(blob).not.toContain("approved");
  });

  it("says that meeting three is not sufficient", () => {
    const r = scoreO1Criteria(answers({ awards: "have", judging: "have", press: "have" }));
    expect(r.verdict).toContain("record as a whole");
  });

  it("never uses the word caveat", () => {
    const all: Record<string, CriterionAnswer> = {};
    for (const c of O1A_CRITERIA) all[c.id] = "partial";
    expect(JSON.stringify(scoreO1Criteria(answers(all))).toLowerCase()).not.toContain("caveat");
  });
});
