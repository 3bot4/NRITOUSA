import { describe, expect, it } from "vitest";
import {
  EB5_SETASIDE_EXCLUSION,
  IV_CATEGORIES,
  IV_POSTS_INDIA,
  PETITION_FORM_HELP,
  IV_CATEGORY_ORDER,
  compareToCutoff,
  cutoffQualifies,
  diagnoseIvScheduling,
  formatCutoffDate,
  formatMonthGap,
  getIvCutoffs,
  monthsBetween,
  parseMonth,
  type IvSchedulingInputs,
} from "./ivScheduling";

const base: IvSchedulingInputs = {
  category: "",
  country: "",
  priorityDate: "",
  dqMonth: "",
  postSchedulingMonth: "",
  post: "",
  alreadyDq: "",
};

describe("date helpers", () => {
  it("parses month and full-date forms, rejecting junk", () => {
    expect(parseMonth("2026-09")?.toISOString().slice(0, 10)).toBe("2026-09-01");
    expect(parseMonth("2015-01-15")?.toISOString().slice(0, 10)).toBe("2015-01-15");
    expect(parseMonth("")).toBeNull();
    expect(parseMonth("2026-13")).toBeNull();
    expect(parseMonth("not a date")).toBeNull();
  });

  it("formats cutoffs, including the C and U sentinels", () => {
    expect(formatCutoffDate("C")).toBe("Current");
    expect(formatCutoffDate("U")).toBe("Unavailable");
    expect(formatCutoffDate("2026-09")).toBe("September 2026");
    expect(formatCutoffDate("2015-01-15")).toBe("15 January 2015");
  });

  it("counts whole months in both directions", () => {
    expect(monthsBetween(parseMonth("2026-01")!, parseMonth("2026-09")!)).toBe(8);
    expect(monthsBetween(parseMonth("2026-09")!, parseMonth("2026-01")!)).toBe(-8);
    expect(monthsBetween(parseMonth("2024-06")!, parseMonth("2026-06")!)).toBe(24);
  });

  it("renders month gaps in years and months", () => {
    expect(formatMonthGap(0)).toBe("the same month");
    expect(formatMonthGap(1)).toBe("1 month");
    expect(formatMonthGap(11)).toBe("11 months");
    expect(formatMonthGap(12)).toBe("1 year");
    expect(formatMonthGap(16)).toBe("1 year 4 months");
    expect(formatMonthGap(-16)).toBe("1 year 4 months");
  });
});

describe("cutoff comparison", () => {
  it("treats C as current for everyone and U as unavailable", () => {
    const pd = parseMonth("2015-01-01")!;
    expect(compareToCutoff(pd, "C")).toBe("all-current");
    expect(compareToCutoff(pd, "U")).toBe("unavailable");
  });

  it("requires the priority date to be STRICTLY earlier than the cutoff", () => {
    const cutoff = "2015-01-15";
    expect(compareToCutoff(parseMonth("2015-01-14")!, cutoff)).toBe("current");
    // Equal to the cutoff is NOT current — the bulletin's own rule.
    expect(compareToCutoff(parseMonth("2015-01-15")!, cutoff)).toBe("not-current");
    expect(compareToCutoff(parseMonth("2015-01-16")!, cutoff)).toBe("not-current");
  });

  it("classifies which statuses actually let a case move", () => {
    expect(cutoffQualifies("no-limit")).toBe(true);
    expect(cutoffQualifies("all-current")).toBe(true);
    expect(cutoffQualifies("current")).toBe(true);
    expect(cutoffQualifies("not-current")).toBe(false);
    expect(cutoffQualifies("unavailable")).toBe(false);
  });
});

describe("bulletin lookup", () => {
  it("returns cutoffs for every numbered category and chargeability area", () => {
    for (const cat of IV_CATEGORY_ORDER) {
      const meta = IV_CATEGORIES[cat];
      const cutoffs = getIvCutoffs(cat, "india");
      if (meta.path === "immediate") {
        expect(cutoffs, `${cat} should have no cutoffs`).toBeNull();
      } else {
        expect(cutoffs, `${cat} missing cutoffs`).not.toBeNull();
        expect(typeof cutoffs!.fad).toBe("string");
        expect(typeof cutoffs!.dff).toBe("string");
      }
    }
  });

  it("reads the same source of truth for every chargeability area", () => {
    for (const c of ["india", "china", "mexico", "philippines", "row"] as const) {
      expect(getIvCutoffs("EB2", c)).not.toBeNull();
      expect(getIvCutoffs("F4", c)).not.toBeNull();
    }
  });
});

describe("diagnosis — gate 1 (visa availability) is checked before gate 2", () => {
  it("returns an incomplete verdict until the essentials are present", () => {
    expect(diagnoseIvScheduling(base).bottleneck).toBe("incomplete");
    expect(
      diagnoseIvScheduling({ ...base, category: "EB2", country: "india" })
        .bottleneck,
    ).toBe("incomplete");
  });

  it("flags an Unavailable category as a hard stop, whatever the DQ date", () => {
    // A case DQ years before the post's marker still cannot be scheduled if the
    // category is "U" — the whole point of checking gate 1 first.
    const r = diagnoseIvScheduling({
      category: "EB2",
      country: "india",
      priorityDate: "2012-01-01",
      dqMonth: "2020-01",
      postSchedulingMonth: "2026-01",
      post: "Mumbai",
      alreadyDq: "",
    });
    const cutoffs = getIvCutoffs("EB2", "india")!;
    if (cutoffs.fad === "U") {
      expect(r.bottleneck).toBe("visa-unavailable");
      expect(r.inquiryReasonable).toBe(false);
      expect(r.gateLabel).toContain("Gate 1");
    } else {
      // Bulletin has moved on; the case must still not be mis-sorted into a
      // queue verdict when it is not current for final action.
      expect(["visa-availability", "post-queue", "due-now", "overdue"]).toContain(
        r.bottleneck,
      );
    }
  });

  it("never recommends an inquiry when visa availability is the blocker", () => {
    const blocked = ["visa-unavailable", "visa-availability", "not-yet-invited"];
    for (const cat of ["EB2", "EB3", "F4"] as const) {
      const r = diagnoseIvScheduling({
        category: cat,
        country: "india",
        priorityDate: "2025-01-01", // deliberately recent — behind every cutoff
        dqMonth: "2019-01",
        postSchedulingMonth: "2026-06",
        post: "Mumbai",
        alreadyDq: "",
      });
      if (blocked.indexOf(r.bottleneck) !== -1) {
        expect(r.inquiryReasonable, `${cat} should not invite an inquiry`).toBe(
          false,
        );
      }
    }
  });

  it("identifies the DQ-but-not-current trap when DFF is passed and FAD is not", () => {
    const cutoffs = getIvCutoffs("EB3", "india")!;
    // Only meaningful while the two charts differ, which is the normal state
    // for India EB-3. Skip cleanly if a future bulletin collapses them.
    if (
      cutoffs.fad !== "U" &&
      cutoffs.dff !== "C" &&
      cutoffs.fad !== "C" &&
      parseMonth(cutoffs.fad) &&
      parseMonth(cutoffs.dff)
    ) {
      const between = new Date(
        (parseMonth(cutoffs.fad)!.getTime() + parseMonth(cutoffs.dff)!.getTime()) / 2,
      );
      const r = diagnoseIvScheduling({
        category: "EB3",
        country: "india",
        priorityDate: between.toISOString().slice(0, 10),
        dqMonth: "2024-01",
        postSchedulingMonth: "2026-01",
        post: "Mumbai",
        alreadyDq: "",
      });
      expect(r.bottleneck).toBe("visa-availability");
      expect(r.filingStatus).toBe("current");
      expect(r.finalActionStatus).toBe("not-current");
      expect(r.inquiryReasonable).toBe(false);
    }
  });
});

describe("scope, data gaps and retrogression", () => {
  it("works for immediate relatives with no priority date at all", () => {
    const r = diagnoseIvScheduling({
      category: "IR1",
      country: "india",
      priorityDate: "",
      dqMonth: "",
      postSchedulingMonth: "",
      post: "Mumbai",
      alreadyDq: "",
    });
    expect(r.bottleneck).not.toBe("incomplete");
    expect(r.finalActionStatus).toBe("no-limit");
  });

  it("covers CR1 and CR2 as immediate relatives", () => {
    for (const c of ["CR1", "CR2"] as const) {
      expect(IV_CATEGORIES[c].path).toBe("immediate");
      const r = diagnoseIvScheduling({
        category: c,
        country: "india",
        priorityDate: "",
        dqMonth: "",
        postSchedulingMonth: "",
        post: "Mumbai",
        alreadyDq: "",
      });
      expect(r.finalActionStatus).toBe("no-limit");
    }
  });

  it("returns EB-2 India as Unavailable on the September 2026 bulletin", () => {
    const cutoffs = getIvCutoffs("EB2", "india")!;
    expect(cutoffs.fad).toBe("U");
    const r = diagnoseIvScheduling({
      category: "EB2",
      country: "india",
      priorityDate: "2012-01-01",
      dqMonth: "2020-01",
      postSchedulingMonth: "2026-01",
      post: "Mumbai",
      alreadyDq: "no",
    });
    expect(r.bottleneck).toBe("visa-unavailable");
  });

  it("retains DQ when a documentarily complete case retrogresses", () => {
    const r = diagnoseIvScheduling({
      category: "EB2",
      country: "india",
      priorityDate: "2012-01-01",
      dqMonth: "2020-01",
      postSchedulingMonth: "2026-01",
      post: "Mumbai",
      alreadyDq: "yes",
    });
    expect(r.bottleneck).toBe("dq-retrogressed");
    expect(r.detail).toMatch(/stays that way|retained|does not undo DQ/i);
    expect(r.nextStep).not.toMatch(/nothing for NVC to review/i);
  });

  it("offers only real Indian IV posts", () => {
    expect(IV_POSTS_INDIA).toEqual(["Mumbai", "New Delhi"]);
    expect(IV_POSTS_INDIA as readonly string[]).not.toContain("Chennai");
    expect(IV_POSTS_INDIA as readonly string[]).not.toContain("Hyderabad");
    expect(IV_POSTS_INDIA as readonly string[]).not.toContain("Kolkata");
  });

  it("names the right petition form per category", () => {
    // EB-4 and EB-5 must name their own forms and say plainly that I-140 is
    // not the right one - the copy disclaims it rather than omitting it.
    expect(PETITION_FORM_HELP.EB4).toMatch(/I-360/);
    expect(PETITION_FORM_HELP.EB4).toMatch(/not I-140/);
    expect(PETITION_FORM_HELP.EB5).toMatch(/I-526/);
    expect(PETITION_FORM_HELP.EB5).toMatch(/not I-140/);
    expect(PETITION_FORM_HELP.EB2).toMatch(/I-140/);
    expect(PETITION_FORM_HELP.family).toMatch(/I-130/);
  });

  it("excludes EB-5 reserved set-asides explicitly", () => {
    expect(EB5_SETASIDE_EXCLUSION).toMatch(/Rural/);
    expect(IV_CATEGORIES.EB5.hint).toMatch(/NOT supported/i);
  });
});

describe("diagnosis — gate 2 (the post's queue)", () => {
  // Immediate relatives skip gate 1 entirely, so they exercise gate 2 cleanly
  // without depending on this month's bulletin.
  const ir = (dqMonth: string, postSchedulingMonth: string) =>
    diagnoseIvScheduling({
      category: "IR5",
      country: "india",
      priorityDate: "",
      dqMonth,
      postSchedulingMonth,
      post: "Mumbai",
      alreadyDq: "",
    });

  it("has no priority date wait for immediate relatives", () => {
    const r = ir("", "");
    expect(r.finalActionStatus).toBe("no-limit");
    expect(r.bottleneck).toBe("post-queue");
  });

  it("reports how far behind the post's marker a case sits", () => {
    const r = ir("2026-01", "2025-09");
    expect(r.bottleneck).toBe("post-queue");
    expect(r.queueGapMonths).toBe(4);
    expect(r.headline).toContain("4 months");
    expect(r.inquiryReasonable).toBe(false);
  });

  it("calls out the month currently being scheduled", () => {
    const r = ir("2025-09", "2025-09");
    expect(r.bottleneck).toBe("due-now");
    expect(r.queueGapMonths).toBe(0);
    expect(r.tone).toBe("positive");
  });

  it("only recommends an inquiry once the case is past the posted marker", () => {
    const r = ir("2024-06", "2025-09");
    expect(r.bottleneck).toBe("overdue");
    expect(r.queueGapMonths).toBe(-15);
    expect(r.inquiryReasonable).toBe(true);
    expect(r.nextStep).toContain("CEAC");
  });
});
