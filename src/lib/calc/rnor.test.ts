import { describe, expect, it } from "vitest";
import { calculateRnor, type RnorRawInputs } from "./rnor";

const base: RnorRawInputs = {
  daysCurrentFy: "90",
  daysPrior4Fy: "300",
  daysPrior7Fy: "500",
  nonResidentYears: "9",
  citizenship: "indianCitizen",
  presenceReason: "visiting",
  incomeOver15Lakh: false,
  liableToTaxElsewhere: "yes",
  possibleDualResidence: false,
};

const run = (over: Partial<RnorRawInputs> = {}) =>
  calculateRnor({ ...base, ...over });

describe("182-day test — section 6(1)(a)", () => {
  it("181 days alone is not resident", () => {
    const r = run({ daysCurrentFy: "181", daysPrior4Fy: "0" });
    expect(r.meets182DayTest).toBe(false);
    expect(r.status).toBe("NRI");
  });

  it("182 days is resident regardless of prior years", () => {
    const r = run({ daysCurrentFy: "182", daysPrior4Fy: "0", daysPrior7Fy: "182" });
    expect(r.meets182DayTest).toBe(true);
    expect(r.isResident).toBe(true);
  });
});

describe("second limb — section 6(1)(c) and Explanation 1", () => {
  it("uses 60 days for someone who is neither visiting nor leaving for employment", () => {
    const r = run({ citizenship: "other", presenceReason: "other", daysCurrentFy: "60", daysPrior4Fy: "365" });
    expect(r.secondLimbThreshold).toBe(60);
    expect(r.meetsSecondLimbTest).toBe(true);
    expect(r.isResident).toBe(true);
  });

  it("relaxes to 182 days for an Indian citizen leaving India for employment", () => {
    const r = run({
      presenceReason: "leavingForEmployment",
      daysCurrentFy: "150",
      daysPrior4Fy: "365",
    });
    expect(r.secondLimbThreshold).toBe(182);
    expect(r.meetsSecondLimbTest).toBe(false);
    expect(r.status).toBe("NRI");
  });

  it("does not apply the 120-day variant to the leaving-for-employment category", () => {
    // Explanation 1(a) has no Rs 15 lakh / 120-day variant.
    const r = run({
      presenceReason: "leavingForEmployment",
      incomeOver15Lakh: true,
      daysCurrentFy: "130",
      daysPrior4Fy: "365",
      liableToTaxElsewhere: "yes",
    });
    expect(r.secondLimbThreshold).toBe(182);
    expect(r.isResident).toBe(false);
  });

  it("relaxes to 182 days for a visiting citizen or PIO below the income threshold", () => {
    const r = run({ presenceReason: "visiting", incomeOver15Lakh: false, daysCurrentFy: "150", daysPrior4Fy: "365" });
    expect(r.secondLimbThreshold).toBe(182);
    expect(r.status).toBe("NRI");
  });

  it("tightens to 120 days for a visiting citizen or PIO above the income threshold", () => {
    const r = run({ presenceReason: "visiting", incomeOver15Lakh: true, daysCurrentFy: "150", daysPrior4Fy: "365" });
    expect(r.secondLimbThreshold).toBe(120);
    expect(r.meetsSecondLimbTest).toBe(true);
    expect(r.isResident).toBe(true);
  });

  it("applies the visitor relaxation to a PIO as well as a citizen", () => {
    const r = run({ citizenship: "pio", presenceReason: "visiting", daysCurrentFy: "100", daysPrior4Fy: "365" });
    expect(r.secondLimbThreshold).toBe(182);
    expect(r.status).toBe("NRI");
  });

  it("requires 365 days in the preceding 4 years for the second limb", () => {
    const r = run({ citizenship: "other", presenceReason: "other", daysCurrentFy: "100", daysPrior4Fy: "364" });
    expect(r.meetsSecondLimbTest).toBe(false);
  });
});

describe("the 120-day category is RNOR by statute — section 6(6)(c)", () => {
  it("returns RNOR for a high-income visitor between 120 and 182 days", () => {
    const r = run({
      presenceReason: "visiting",
      incomeOver15Lakh: true,
      daysCurrentFy: "150",
      daysPrior4Fy: "365",
      daysPrior7Fy: "2000",
      nonResidentYears: "0",
    });
    // Would otherwise be ROR on history, but the category overrides.
    expect(r.rnorBy120DayCategory).toBe(true);
    expect(r.status).toBe("RNOR");
  });

  it("does not apply at 182 days or more", () => {
    const r = run({
      presenceReason: "visiting",
      incomeOver15Lakh: true,
      daysCurrentFy: "182",
      daysPrior4Fy: "365",
      daysPrior7Fy: "2000",
      nonResidentYears: "0",
    });
    expect(r.rnorBy120DayCategory).toBe(false);
    expect(r.status).toBe("ROR");
  });
});

describe("deemed residency — section 6(1A)", () => {
  const deemed: Partial<RnorRawInputs> = {
    citizenship: "indianCitizen",
    presenceReason: "other",
    incomeOver15Lakh: true,
    daysCurrentFy: "20",
    daysPrior4Fy: "40",
    daysPrior7Fy: "100",
    nonResidentYears: "10",
  };

  it("makes an Indian citizen resident when not liable to tax anywhere else", () => {
    const r = run({ ...deemed, liableToTaxElsewhere: "no" });
    expect(r.isDeemedResident).toBe(true);
    expect(r.isResident).toBe(true);
    expect(r.status).toBe("RNOR");
    expect(r.reasons.join(" ")).toContain("6(1A)");
  });

  it("is always RNOR, never ROR", () => {
    const r = run({
      ...deemed,
      liableToTaxElsewhere: "no",
      nonResidentYears: "0",
      daysPrior7Fy: "2500",
    });
    expect(r.status).toBe("RNOR");
  });

  it("does not apply when the person is liable to tax elsewhere", () => {
    const r = run({ ...deemed, liableToTaxElsewhere: "yes" });
    expect(r.isDeemedResident).toBe(false);
    expect(r.status).toBe("NRI");
  });

  it("does not apply to a non-citizen", () => {
    const r = run({ ...deemed, citizenship: "pio", liableToTaxElsewhere: "no" });
    expect(r.isDeemedResident).toBe(false);
  });

  it("does not apply below the income threshold", () => {
    const r = run({ ...deemed, incomeOver15Lakh: false, liableToTaxElsewhere: "no" });
    expect(r.isDeemedResident).toBe(false);
  });

  it("returns REVIEW rather than guessing when liability elsewhere is unknown", () => {
    const r = run({ ...deemed, liableToTaxElsewhere: "unsure" });
    expect(r.status).toBe("REVIEW");
    expect(r.reviewReasons.join(" ")).toContain("6(1A)");
  });
});

describe("not-ordinarily-resident history tests — section 6(6)(a) and (b)", () => {
  const resident: Partial<RnorRawInputs> = {
    daysCurrentFy: "200",
    citizenship: "other",
    presenceReason: "other",
  };

  it("RNOR when non-resident in 9 of the last 10 years", () => {
    const r = run({ ...resident, nonResidentYears: "9", daysPrior7Fy: "2000" });
    expect(r.status).toBe("RNOR");
  });

  it("RNOR at exactly 729 days in the preceding 7 years", () => {
    const r = run({ ...resident, nonResidentYears: "0", daysPrior7Fy: "729" });
    expect(r.status).toBe("RNOR");
  });

  it("ROR at 730 days with no other qualifying test", () => {
    const r = run({ ...resident, nonResidentYears: "0", daysPrior7Fy: "730" });
    expect(r.status).toBe("ROR");
  });

  it("ROR when non-resident in only 8 of 10 years and over 729 days", () => {
    const r = run({ ...resident, nonResidentYears: "8", daysPrior7Fy: "1500" });
    expect(r.status).toBe("ROR");
  });
});

describe("DTAA tie-breaker returns REVIEW", () => {
  it("refuses to give a confident answer for a possible dual resident", () => {
    const r = run({ daysCurrentFy: "200", possibleDualResidence: true });
    expect(r.status).toBe("REVIEW");
    expect(r.reviewReasons.join(" ")).toContain("tie-breaker");
  });

  it("does not trigger for a non-resident, where no tie-break arises", () => {
    const r = run({ daysCurrentFy: "10", daysPrior4Fy: "0", possibleDualResidence: true });
    expect(r.status).toBe("NRI");
  });
});

describe("day-count validation", () => {
  it("rejects more days than exist in a financial year", () => {
    expect(run({ daysCurrentFy: "400" }).ok).toBe(false);
  });

  it("rejects negative day counts", () => {
    expect(run({ daysCurrentFy: "-1" }).ok).toBe(false);
    expect(run({ daysPrior4Fy: "-1" }).ok).toBe(false);
  });

  it("rejects fractional day counts", () => {
    expect(run({ daysCurrentFy: "90.5" }).ok).toBe(false);
  });

  it("rejects impossible totals over 4 and 7 financial years", () => {
    expect(run({ daysPrior4Fy: "1465" }).ok).toBe(false);
    expect(run({ daysPrior7Fy: "2563" }).ok).toBe(false);
  });

  it("accepts the legal maximums", () => {
    expect(run({ daysCurrentFy: "366", daysPrior4Fy: "1464", daysPrior7Fy: "2562" }).ok).toBe(true);
  });

  it("rejects more than 10 non-resident years in the last 10", () => {
    expect(run({ nonResidentYears: "11" }).ok).toBe(false);
  });

  it("returns REVIEW rather than a status when input is invalid", () => {
    const r = run({ daysCurrentFy: "abc" });
    expect(r.ok).toBe(false);
    expect(r.status).toBe("REVIEW");
  });
});

describe("result never overstates certainty", () => {
  it("gives a reason for every determinate status", () => {
    for (const over of [
      { daysCurrentFy: "10", daysPrior4Fy: "0" },
      { daysCurrentFy: "200", nonResidentYears: "9" },
      { daysCurrentFy: "200", nonResidentYears: "0", daysPrior7Fy: "2000", citizenship: "other" as const, presenceReason: "other" as const },
    ]) {
      const r = run(over);
      expect(r.status).not.toBe("REVIEW");
      expect(r.reasons.length).toBeGreaterThan(0);
    }
  });
});
