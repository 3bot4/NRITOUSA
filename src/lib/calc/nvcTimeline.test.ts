import { describe, it, expect } from "vitest";
import { estimateNvcTimeline, monthsBetween, SELF_PACED_DAYS } from "./nvcTimeline";
import { nvcProcessingData as D } from "@/data/nvcData";

describe("estimateNvcTimeline", () => {
  const base = "2026-01-15";

  it("returns null for an unusable approval date rather than a wrong timeline", () => {
    for (const bad of ["", "15/01/2026", "2026-02-30", "soon"]) {
      expect(estimateNvcTimeline(bad)).toBeNull();
    }
  });

  it("produces every stage, in order", () => {
    const e = estimateNvcTimeline(base)!;
    expect(e.stages.map((s) => s.id)).toEqual([
      "case-creation",
      "fees-ds260",
      "document-review",
      "documentarily-qualified",
      "interview",
    ]);
  });

  it("never lets a stage's earliest date fall after its own latest", () => {
    const e = estimateNvcTimeline(base)!;
    for (const s of e.stages) {
      if (s.earliest && s.latest) {
        expect(s.earliest <= s.latest, `${s.id} inverted`).toBe(true);
      }
    }
  });

  it("moves forward through the stages — no stage starts before the one before it", () => {
    const e = estimateNvcTimeline(base)!;
    const dated = e.stages.filter((s) => s.earliest !== null);
    for (let i = 1; i < dated.length; i++) {
      expect(dated[i].earliest! >= dated[i - 1].earliest!).toBe(true);
    }
  });

  it("starts case creation at the published planning range from the approval date", () => {
    const e = estimateNvcTimeline("2026-01-15")!;
    const creation = e.stages[0];
    // low weeks after 15 Jan
    expect(creation.earliest).toBe("2026-01-29"); // +2 weeks
    expect(creation.latest).toBe("2026-03-12"); // +8 weeks
    expect(D.caseCreationWeeksLow).toBe(2);
    expect(D.caseCreationWeeksHigh).toBe(8);
  });

  it("marks the fee and DS-260 stage as self-paced", () => {
    const e = estimateNvcTimeline(base)!;
    expect(e.stages[1].selfPaced).toBe(true);
    expect(e.stages.filter((s) => s.selfPaced)).toHaveLength(1);
  });

  it("anchors review on the real submission date once one is given", () => {
    const withDate = estimateNvcTimeline(base, "2026-04-01")!;
    const review = withDate.stages.filter((s) => s.id === "document-review")[0];
    // review low weeks after the actual submission, not after an estimate
    expect(review.earliest).toBe("2026-04-15"); // +2 weeks
    expect(withDate.documentsSubmitted).toBe("2026-04-01");
    // and the self-paced stage stops guessing
    expect(withDate.stages[1].earliest).toBeNull();
  });

  it("ignores a submission date earlier than the approval date instead of running backwards", () => {
    const e = estimateNvcTimeline("2026-06-01", "2026-01-01")!;
    expect(e.documentsSubmitted).toBeNull();
    const review = e.stages.filter((s) => s.id === "document-review")[0];
    expect(review.earliest! > "2026-06-01").toBe(true);
  });

  it("ignores an unparseable submission date without failing the whole estimate", () => {
    const e = estimateNvcTimeline(base, "not-a-date")!;
    expect(e).not.toBeNull();
    expect(e.documentsSubmitted).toBeNull();
  });

  it("puts the interview last and widens with the published DQ-to-interview range", () => {
    const e = estimateNvcTimeline(base)!;
    expect(e.interviewEarliest).toBe(e.stages[4].earliest);
    expect(e.interviewLatest).toBe(e.stages[4].latest);
    expect(e.interviewLatest > e.interviewEarliest).toBe(true);
  });

  it("keeps the self-paced allowance visible in the estimate, not hidden", () => {
    const e = estimateNvcTimeline(base)!;
    const selfPaced = e.stages[1];
    const creation = e.stages[0];
    expect(selfPaced.earliest).toBe(
      // creation earliest + the low self-paced allowance
      new Date(Date.parse(`${creation.earliest}T00:00:00Z`) + SELF_PACED_DAYS.low * 86_400_000)
        .toISOString()
        .slice(0, 10)
    );
  });

  it("handles a leap-day approval date", () => {
    const e = estimateNvcTimeline("2028-02-29");
    expect(e).not.toBeNull();
    expect(e!.approvalDate).toBe("2028-02-29");
  });
});

describe("monthsBetween", () => {
  it("rounds to whole months", () => {
    expect(monthsBetween("2026-01-01", "2026-07-01")).toBe(6);
    expect(monthsBetween("2026-01-01", "2026-01-20")).toBe(1);
  });

  it("never returns a negative", () => {
    expect(monthsBetween("2026-07-01", "2026-01-01")).toBe(0);
  });

  it("returns null for unusable dates", () => {
    expect(monthsBetween("nope", "2026-01-01")).toBeNull();
  });
});
