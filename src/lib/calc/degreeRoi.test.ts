import { describe, expect, it } from "vitest";
import {
  computeDegreeRoi,
  DEFAULT_ROI_INPUT,
  scoreCareerCapital,
  type RoiInput,
} from "./degreeRoi";

const input = (over: Partial<RoiInput> = {}): RoiInput => ({
  ...DEFAULT_ROI_INPUT,
  ...over,
});

describe("degree ROI simulation", () => {
  it("produces one point per horizon year for every scenario", () => {
    const r = computeDegreeRoi(input({ horizonYears: 10 }));
    expect(r.scenarios).toHaveLength(4);
    for (const s of r.scenarios) {
      expect(s.series).toHaveLength(10);
    }
  });

  it("marks the study years as studying and the rest as working", () => {
    const r = computeDegreeRoi(input({ programYears: 2 }));
    const us = r.scenarios.find((s) => s.id === "us-career")!;
    expect(us.series[0].stage).toBe("studying");
    expect(us.series[1].stage).toBe("studying");
    expect(us.series[2].stage).not.toBe("studying");
  });

  it("never marks the never-go baseline as studying", () => {
    const r = computeDegreeRoi(input());
    const baseline = r.scenarios.find((s) => s.id === "never-go")!;
    expect(baseline.series.every((p) => p.stage !== "studying")).toBe(true);
    expect(baseline.totalDegreeCostUsd).toBe(0);
  });

  it("drives net worth negative during study when family-funded", () => {
    const r = computeDegreeRoi(input({ loanShare: 0 }));
    const us = r.scenarios.find((s) => s.id === "us-career")!;
    expect(us.series[0].netWorthUsd).toBeLessThan(0);
    expect(us.series[0].loanBalanceUsd).toBe(0);
  });

  it("builds a loan balance instead of a cash hit when loan-funded", () => {
    const r = computeDegreeRoi(input({ loanShare: 1 }));
    const us = r.scenarios.find((s) => s.id === "us-career")!;
    expect(us.series[0].loanBalanceUsd).toBeGreaterThan(0);
    // No family cash has been spent, so savings are untouched...
    expect(us.series[0].savingsUsd).toBe(0);
    // ...but net worth carries the debt. A borrower is underwater from day
    // one, and a model that reported 0 here would be flattering the degree.
    expect(us.series[0].netWorthUsd).toBe(-us.series[0].loanBalanceUsd);
  });

  it("counts interest capitalised during study into the degree cost", () => {
    // Interest accruing while enrolled is capitalised and then repaid as
    // principal. Counting only repayment-phase interest understated the cost.
    const noStudyInterest = computeDegreeRoi(
      input({ loanShare: 1, loanRatePct: 0 })
    ).scenarios.find((s) => s.id === "us-career")!;
    const withStudyInterest = computeDegreeRoi(
      input({ loanShare: 1, loanRatePct: 10 })
    ).scenarios.find((s) => s.id === "us-career")!;
    expect(withStudyInterest.totalDegreeCostUsd).toBeGreaterThan(
      noStudyInterest.totalDegreeCostUsd
    );
  });

  it("reports any loan still outstanding at the horizon", () => {
    const shortHorizon = computeDegreeRoi(
      input({ loanShare: 1, loanTermYears: 15, horizonYears: 5 })
    ).scenarios.find((s) => s.id === "us-career")!;
    expect(shortHorizon.loanOutstandingAtHorizonUsd).toBeGreaterThan(0);

    const fullyRepaid = computeDegreeRoi(
      input({ loanShare: 1, loanTermYears: 5, horizonYears: 12 })
    ).scenarios.find((s) => s.id === "us-career")!;
    expect(fullyRepaid.loanOutstandingAtHorizonUsd).toBe(0);
  });

  it("pays the loan down to zero over the term", () => {
    const r = computeDegreeRoi(
      input({ loanShare: 1, loanTermYears: 5, horizonYears: 12 })
    );
    const us = r.scenarios.find((s) => s.id === "us-career")!;
    expect(us.series.at(-1)!.loanBalanceUsd).toBe(0);
  });

  it("counts loan interest into the total degree cost", () => {
    const cash = computeDegreeRoi(input({ loanShare: 0 }));
    const borrowed = computeDegreeRoi(input({ loanShare: 1, loanRatePct: 11 }));
    const cashCost = cash.scenarios.find((s) => s.id === "us-career")!.totalDegreeCostUsd;
    const loanCost = borrowed.scenarios.find((s) => s.id === "us-career")!.totalDegreeCostUsd;
    expect(loanCost).toBeGreaterThan(cashCost);
  });

  it("moves the result when the sponsorship assumption moves", () => {
    const low = computeDegreeRoi(input({ sponsorshipProbability: 0.2 }));
    const high = computeDegreeRoi(input({ sponsorshipProbability: 0.95 }));
    const lowUs = low.scenarios.find((s) => s.id === "us-career")!;
    const highUs = high.scenarios.find((s) => s.id === "us-career")!;
    expect(highUs.finalNetWorthUsd).toBeGreaterThan(lowUs.finalNetWorthUsd);
  });

  it("falls back to India earnings, not zero, in the unsponsored fraction", () => {
    // At zero sponsorship the model must still credit India income. If it
    // zeroed out instead, changing the India salary would not move the
    // result at all.
    const lowIndia = computeDegreeRoi(
      input({ sponsorshipProbability: 0, indiaStartSalaryLpa: 8 })
    );
    const highIndia = computeDegreeRoi(
      input({ sponsorshipProbability: 0, indiaStartSalaryLpa: 30 })
    );
    const low = lowIndia.scenarios.find((s) => s.id === "us-career")!;
    const high = highIndia.scenarios.find((s) => s.id === "us-career")!;
    expect(high.finalNetWorthUsd).toBeGreaterThan(low.finalNetWorthUsd);
  });

  it("still shows a loan-funded degree underwater when sponsorship fails", () => {
    // An honest model must be able to produce a bad outcome. A borrower who
    // never gets sponsored is servicing US-sized debt on Indian income.
    const r = computeDegreeRoi(
      input({ sponsorshipProbability: 0, loanShare: 1, loanRatePct: 11 })
    );
    const us = r.scenarios.find((s) => s.id === "us-career")!;
    expect(us.finalNetWorthUsd).toBeLessThan(0);
    expect(us.breakEvenYear).toBeNull();
  });

  it("returns the person to India at the chosen year", () => {
    const r = computeDegreeRoi(input({ programYears: 2, usYearsBeforeReturn: 3 }));
    const ret = r.scenarios.find((s) => s.id === "return-india")!;
    expect(ret.series[4].stage).not.toBe("working-india");
    expect(ret.series[5].stage).toBe("working-india");
  });

  it("applies the return premium only to the return path, not the baseline", () => {
    const withPremium = computeDegreeRoi(input({ indiaReturnPremiumPct: 60 }));
    const without = computeDegreeRoi(input({ indiaReturnPremiumPct: 0 }));
    const retHigh = withPremium.scenarios.find((s) => s.id === "return-india")!;
    const retLow = without.scenarios.find((s) => s.id === "return-india")!;
    expect(retHigh.finalNetWorthUsd).toBeGreaterThan(retLow.finalNetWorthUsd);

    const baseHigh = withPremium.scenarios.find((s) => s.id === "never-go")!;
    const baseLow = without.scenarios.find((s) => s.id === "never-go")!;
    expect(baseHigh.finalNetWorthUsd).toBe(baseLow.finalNetWorthUsd);
  });
});

describe("policy honesty guarantees", () => {
  it("labels only the OPT-fee scenario as speculative", () => {
    const r = computeDegreeRoi(input());
    const speculative = r.scenarios.filter((s) => s.speculative).map((s) => s.id);
    expect(speculative).toEqual(["opt-fee"]);
  });

  it("says PROPOSED ONLY on the OPT-fee scenario", () => {
    const r = computeDegreeRoi(input());
    const opt = r.scenarios.find((s) => s.id === "opt-fee")!;
    expect(opt.note).toContain("PROPOSED ONLY");
    expect(opt.note).toContain("employers");
  });

  it("never charges the student the $100,000 H-1B fee", () => {
    // The fee is vacated and was an employer obligation; it must not appear
    // as a cost in any scenario's degree cost.
    const r = computeDegreeRoi(input());
    for (const s of r.scenarios) {
      expect(s.totalDegreeCostUsd).toBeLessThan(500_000);
    }
    const us = r.scenarios.find((s) => s.id === "us-career")!;
    expect(us.note).toContain("not being collected");
  });

  it("picks the best path only from non-speculative scenarios", () => {
    const r = computeDegreeRoi(input());
    expect(r.best.speculative).toBe(false);
  });

  it("models the OPT fee as a sponsorship shock, never as a student bill", () => {
    const r = computeDegreeRoi(input());
    const opt = r.scenarios.find((s) => s.id === "opt-fee")!;
    const us = r.scenarios.find((s) => s.id === "us-career")!;
    // Same degree cost — the student is not billed in the stress test.
    expect(opt.totalDegreeCostUsd).toBe(us.totalDegreeCostUsd);
    // But the outcome is worse, because sponsorship collapses.
    expect(opt.finalNetWorthUsd).toBeLessThan(us.finalNetWorthUsd);
  });
});

describe("career capital scoring", () => {
  it("scores zero US years as limited", () => {
    const c = scoreCareerCapital(input({ usYearsBeforeReturn: 0 }));
    expect(c.band).toBe("limited");
    expect(c.mobilityScore).toBe(25);
  });

  it("rises in bands with years of US experience", () => {
    expect(scoreCareerCapital(input({ usYearsBeforeReturn: 1 })).band).toBe("moderate");
    expect(scoreCareerCapital(input({ usYearsBeforeReturn: 3 })).band).toBe("strong");
    expect(scoreCareerCapital(input({ usYearsBeforeReturn: 5 })).band).toBe("exceptional");
  });

  it("caps the score at 100", () => {
    expect(scoreCareerCapital(input({ usYearsBeforeReturn: 20 })).mobilityScore).toBe(100);
  });

  it("always credits the degree itself as portable", () => {
    const c = scoreCareerCapital(input({ usYearsBeforeReturn: 0 }));
    expect(c.drivers[0].earned).toBe(true);
    expect(c.drivers[0].label).toContain("US degree");
  });

  it("makes the point that experience outlives the visa", () => {
    const c = scoreCareerCapital(input({ usYearsBeforeReturn: 3 }));
    expect(c.durabilityNote).toContain("revoked");
    expect(c.durabilityNote).toContain("Express Entry");
  });

  it("is kept out of the dollar projection", () => {
    // Career capital must not alter any net-worth figure.
    const a = computeDegreeRoi(input({ usYearsBeforeReturn: 1 }));
    const b = computeDegreeRoi(input({ usYearsBeforeReturn: 1 }));
    expect(a.scenarios[0].finalNetWorthUsd).toBe(b.scenarios[0].finalNetWorthUsd);
    expect(a.careerCapital.mobilityScore).toBe(b.careerCapital.mobilityScore);
  });
});

describe("verdict", () => {
  it("names the winning scenario and points at career capital", () => {
    const r = computeDegreeRoi(input({ sponsorshipProbability: 0.9 }));
    expect(r.verdict).toContain(r.best.label);
    expect(r.verdict).toContain("career-capital");
  });

  it("acknowledges when staying in India wins", () => {
    const r = computeDegreeRoi(
      input({
        tuitionTotalUsd: 250_000,
        sponsorshipProbability: 0.05,
        indiaStartSalaryLpa: 40,
      })
    );
    if (r.best.id === "never-go") {
      expect(r.verdict).toContain("India comes out ahead");
    }
    expect(r.baseline.id).toBe("never-go");
  });

  it("is deterministic", () => {
    const a = computeDegreeRoi(input());
    const b = computeDegreeRoi(input());
    expect(a.verdict).toBe(b.verdict);
    expect(a.spreadVsBaselineUsd).toBe(b.spreadVsBaselineUsd);
  });
});
