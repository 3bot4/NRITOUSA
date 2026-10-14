import { describe, expect, it } from "vitest";
import { calculateL1Stay, L1_CAP_MONTHS, type L1StayInput } from "./l1Stay";

const base: L1StayInput = {
  monthsAbroadInLast36: 24,
  monthsInUsForSameGroupInLast36: 0,
  continuous: true,
  role: "l1a",
  monthsAlreadyInL: 0,
  monthsAlreadyInH: 0,
  yearAbroadSince: false,
};

describe("the one-year-in-three requirement", () => {
  it("is met by twelve continuous months abroad", () => {
    const r = calculateL1Stay({ ...base, monthsAbroadInLast36: 12 });
    expect(r.oneYearMet).toBe(true);
    expect(r.eligibilityTone).toBe("ok");
    expect(r.countableMonths).toBe(12);
  });

  it("is not met by eleven months", () => {
    const r = calculateL1Stay({ ...base, monthsAbroadInLast36: 11 });
    expect(r.oneYearMet).toBe(false);
    expect(r.eligibilityTone).toBe("short");
    expect(r.eligibilityDetail).toContain("1 month short");
  });

  it("is not met when the time abroad is not continuous", () => {
    const r = calculateL1Stay({ ...base, monthsAbroadInLast36: 30, continuous: false });
    expect(r.oneYearMet).toBe(false);
    expect(r.eligibilityTone).toBe("not-continuous");
    expect(r.eligibilityDetail).toContain("continuous");
  });

  // The half of (l)(1)(ii)(A) that competitor guides omit.
  it("does not count US time for the same group toward the year", () => {
    const r = calculateL1Stay({
      ...base,
      monthsAbroadInLast36: 36,
      monthsInUsForSameGroupInLast36: 5,
    });
    expect(r.countableMonths).toBe(31);
    // The "ok" branch says the US months are excluded from the count; the
    // "short" branch quotes the regulation's "does not count toward the year".
    // Either way the exclusion has to be stated, because that is the trap.
    expect(r.eligibilityDetail).toContain("excluded from the count");

    const short = calculateL1Stay({
      ...base,
      monthsAbroadInLast36: 8,
      monthsInUsForSameGroupInLast36: 5,
    });
    expect(short.countableMonths).toBe(8);
    expect(short.eligibilityDetail).toContain("does not count toward the year");
  });

  it("can fail on countable months even where total service is long", () => {
    // 10 months abroad, 26 months in the US for the same group.
    const r = calculateL1Stay({
      ...base,
      monthsAbroadInLast36: 10,
      monthsInUsForSameGroupInLast36: 26,
    });
    expect(r.countableMonths).toBe(10);
    expect(r.oneYearMet).toBe(false);
  });

  it("never reports more countable months than the lookback window holds", () => {
    const r = calculateL1Stay({
      ...base,
      monthsAbroadInLast36: 999,
      monthsInUsForSameGroupInLast36: 999,
    });
    expect(r.countableMonths).toBeGreaterThanOrEqual(0);
    expect(r.countableMonths).toBeLessThanOrEqual(36);
  });
});

describe("the maximum-stay caps", () => {
  it("uses seven years for L-1A and five for L-1B", () => {
    expect(L1_CAP_MONTHS.l1a).toBe(84);
    expect(L1_CAP_MONTHS.l1b).toBe(60);
    expect(calculateL1Stay({ ...base, role: "l1a" }).capYears).toBe(7);
    expect(calculateL1Stay({ ...base, role: "l1b" }).capYears).toBe(5);
  });

  // 8 CFR 214.2(l)(12)(i): "under section 101(a)(15)(L) and/or (H)".
  // This is the single most consequential rule on the page.
  it("counts H-1B time against the L-1A cap", () => {
    const r = calculateL1Stay({
      ...base,
      role: "l1a",
      monthsAlreadyInH: 48,
      monthsAlreadyInL: 0,
    });
    expect(r.usedMonths).toBe(48);
    expect(r.remainingMonths).toBe(84 - 48); // 36 months, not 84
    expect(r.hImpactMonths).toBe(48);
    expect(r.notes.join(" ")).toContain("and/or (H)");
  });

  it("counts H-1B time against the L-1B cap too", () => {
    const r = calculateL1Stay({
      ...base,
      role: "l1b",
      monthsAlreadyInH: 48,
    });
    expect(r.remainingMonths).toBe(60 - 48); // 12 months, not 60
  });

  it("adds L and H months together rather than taking the larger", () => {
    const r = calculateL1Stay({
      ...base,
      role: "l1a",
      monthsAlreadyInL: 24,
      monthsAlreadyInH: 36,
    });
    expect(r.usedMonths).toBe(60);
    expect(r.remainingMonths).toBe(24);
  });

  it("reports the cap as used up and never goes negative", () => {
    const r = calculateL1Stay({
      ...base,
      role: "l1b",
      monthsAlreadyInH: 72,
      monthsAlreadyInL: 12,
    });
    expect(r.remainingMonths).toBe(0);
    expect(r.capTone).toBe("maxed");
  });

  it("warns when a year or less remains", () => {
    const r = calculateL1Stay({ ...base, role: "l1a", monthsAlreadyInL: 76 });
    expect(r.capTone).toBe("tight");
    expect(r.remainingMonths).toBe(8);
  });

  it("does not warn when there is plenty of room", () => {
    const r = calculateL1Stay({ ...base, role: "l1a", monthsAlreadyInL: 12 });
    expect(r.capTone).toBe("ok");
    expect(r.remainingMonths).toBe(72);
  });
});

describe("the year-abroad reset", () => {
  it("restores the whole cap", () => {
    const r = calculateL1Stay({
      ...base,
      role: "l1a",
      monthsAlreadyInL: 60,
      monthsAlreadyInH: 24,
      yearAbroadSince: true,
    });
    expect(r.resetApplied).toBe(true);
    expect(r.usedMonths).toBe(0);
    expect(r.remainingMonths).toBe(84);
    expect(r.capTone).toBe("ok");
  });

  it("drops the H-1B warning once the clock has reset", () => {
    const r = calculateL1Stay({
      ...base,
      monthsAlreadyInH: 48,
      yearAbroadSince: true,
    });
    expect(r.hImpactMonths).toBe(0);
    expect(r.notes.join(" ")).not.toContain("and/or (H)");
  });

  it("asks for the evidence the regulation requires on a new petition", () => {
    const r = calculateL1Stay({ ...base, yearAbroadSince: true });
    expect(r.capDetail).toContain("dates and purpose of every trip");
  });
});

describe("guard rails", () => {
  it("suggests the L-1A route when an L-1B is close to its shorter cap", () => {
    const r = calculateL1Stay({ ...base, role: "l1b", monthsAlreadyInL: 40 });
    expect(r.notes.join(" ")).toContain("L-1B runs out two years earlier");
  });

  it("always mentions that the status is tied to the company group", () => {
    const r = calculateL1Stay(base);
    expect(r.notes.join(" ")).toContain("tied to the company group");
  });

  it("never claims the applicant is eligible", () => {
    const r = calculateL1Stay({ ...base, monthsAbroadInLast36: 36 });
    const blob = `${r.eligibilityHeadline} ${r.eligibilityDetail}`.toLowerCase();
    expect(blob).not.toContain("you are eligible");
    // It names the other requirements a duration check cannot assess.
    expect(blob).toContain("qualifying relationship");
  });

  it("tolerates non-finite input without throwing", () => {
    const r = calculateL1Stay({
      ...base,
      monthsAbroadInLast36: Number.NaN,
      monthsAlreadyInH: Number.POSITIVE_INFINITY,
    });
    expect(Number.isFinite(r.countableMonths)).toBe(true);
    expect(Number.isFinite(r.remainingMonths)).toBe(true);
  });
});

describe("the employer-change claim is precise, not a slogan", () => {
  // The review that produced this test: "you cannot change employer" is
  // overbroad. An existing L-1 approval cannot be used for an UNRELATED
  // employer; movement inside the qualifying group is possible with a filing.
  it("limits the restriction to an unrelated employer", () => {
    const notes = calculateL1Stay(base).notes.join(" ");
    expect(notes).toMatch(/unrelated employer/);
    expect(notes).not.toMatch(/you cannot change employer/i);
  });

  it("says movement inside the group needs a filing rather than being barred", () => {
    const notes = calculateL1Stay(base).notes.join(" ");
    expect(notes).toMatch(/amended or new petition|I-129S/);
    expect(notes).toMatch(/inside the group|between listed entities/);
  });
});
