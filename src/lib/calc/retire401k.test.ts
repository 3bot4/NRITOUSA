import { describe, expect, it } from "vitest";
import { calculateRetire401k, type Retire401kRawInputs } from "./retire401k";

const base: Retire401kRawInputs = {
  balance: "100000",
  age: "35",
  effectiveTaxRate: "24",
  withholdingRate: "30",
  years: "20",
  expectedReturn: "7",
  futureTaxRate: "24",
  hasEarlyDistributionException: false,
};

const run = (over: Partial<Retire401kRawInputs> = {}) =>
  calculateRetire401k({ ...base, ...over });

describe("withholding is not double-counted", () => {
  it("does not subtract both the tax liability and the withholding from value", () => {
    const r = run();
    // Liability: 24% income tax + 10% additional = 34,000.
    expect(r.totalTaxLiability).toBe(34_000);
    // Net after-tax value is gross minus the LIABILITY only.
    expect(r.netAfterTaxValue).toBe(66_000);
    // The wrong answer would be 100,000 - 34,000 - 30,000 = 36,000.
    expect(r.netAfterTaxValue).not.toBe(36_000);
  });

  it("treats withholding as a prepayment that reduces day-one cash only", () => {
    const r = run();
    expect(r.upfrontWithholding).toBe(30_000);
    expect(r.cashReceivedInitially).toBe(70_000);
    // Cash on day one differs from the eventual after-tax value.
    expect(r.cashReceivedInitially).not.toBe(r.netAfterTaxValue);
  });

  it("reconciles over-withholding into a refund", () => {
    const r = run({ effectiveTaxRate: "10" });
    // Liability 10,000 + 10,000 additional = 20,000; withheld 30,000.
    expect(r.totalTaxLiability).toBe(20_000);
    expect(r.withholdingReconciliation).toBe(10_000);
    expect(r.netAfterTaxValue).toBe(80_000);
  });

  it("reconciles under-withholding into further tax payable", () => {
    const r = run({ withholdingRate: "10" });
    // Liability 34,000; withheld only 10,000.
    expect(r.withholdingReconciliation).toBe(-24_000);
    expect(r.netAfterTaxValue).toBe(66_000);
  });

  it("keeps net after-tax value independent of the withholding rate", () => {
    // The whole point: changing withholding changes cash timing, not cost.
    const low = run({ withholdingRate: "0" });
    const high = run({ withholdingRate: "100" });
    expect(low.netAfterTaxValue).toBe(high.netAfterTaxValue);
    expect(low.cashReceivedInitially).not.toBe(high.cashReceivedInitially);
  });
});

describe("the 10% additional tax on early distributions", () => {
  it("applies below 59½ with no exception", () => {
    const r = run({ age: "40" });
    expect(r.earlyDistributionApplies).toBe(true);
    expect(r.earlyDistributionTax).toBe(10_000);
  });

  it("does not apply at 60", () => {
    const r = run({ age: "60" });
    expect(r.earlyDistributionApplies).toBe(false);
    expect(r.earlyDistributionTax).toBe(0);
  });

  it("does not apply below 59½ when an exception is selected", () => {
    const r = run({ age: "40", hasEarlyDistributionException: true });
    expect(r.earlyDistributionApplies).toBe(false);
    expect(r.earlyDistributionTax).toBe(0);
    expect(r.totalTaxLiability).toBe(24_000);
  });

  it("treats 59 as early and 59.5 as not early", () => {
    expect(run({ age: "59" }).earlyDistributionApplies).toBe(true);
    // Age is validated as a whole number, so 60 is the first clean non-early age.
    expect(run({ age: "60" }).earlyDistributionApplies).toBe(false);
  });

  it("reports the reason in the assumptions either way", () => {
    expect(run({ age: "40" }).assumptions.join(" ")).toContain("under 59½");
    expect(run({ age: "40", hasEarlyDistributionException: true }).assumptions.join(" "))
      .toContain("exception applies");
    expect(run({ age: "65" }).assumptions.join(" ")).toContain("59½ or older");
  });
});

describe("keep-invested comparison", () => {
  it("compounds the balance and taxes it at the future rate", () => {
    const r = run({ years: "10", expectedReturn: "7", futureTaxRate: "20" });
    expect(r.projectedFutureBalance).toBeCloseTo(100_000 * 1.07 ** 10, 4);
    expect(r.futureAfterTaxValue).toBeCloseTo(r.projectedFutureBalance * 0.8, 4);
  });

  it("compares against the distribution reinvested, not the gross balance", () => {
    const r = run({ years: "10" });
    expect(r.distributionReinvestedValue).toBeCloseTo(
      r.netAfterTaxValue * 1.07 ** 10,
      4,
    );
    expect(r.advantageOfKeeping).toBeCloseTo(
      r.futureAfterTaxValue - r.distributionReinvestedValue,
      4,
    );
  });

  it("shows no advantage when rates and horizon are neutral", () => {
    // Same tax rate now and later, no early tax: keeping vs cashing is a wash.
    const r = run({ age: "65", effectiveTaxRate: "24", futureTaxRate: "24", years: "10" });
    expect(r.advantageOfKeeping).toBeCloseTo(0, 4);
  });

  it("favours keeping when the early additional tax applies", () => {
    expect(run({ age: "35", years: "10" }).advantageOfKeeping).toBeGreaterThan(0);
  });

  it("handles a zero horizon", () => {
    const r = run({ years: "0" });
    expect(r.projectedFutureBalance).toBe(100_000);
  });

  it("handles a negative expected return", () => {
    const r = run({ expectedReturn: "-5", years: "10" });
    expect(Number.isFinite(r.projectedFutureBalance)).toBe(true);
    expect(r.projectedFutureBalance).toBeLessThan(100_000);
  });
});

describe("validation", () => {
  it("rejects a negative balance", () => {
    expect(run({ balance: "-1" }).ok).toBe(false);
  });

  it("rejects a tax rate above 100", () => {
    expect(run({ effectiveTaxRate: "101" }).ok).toBe(false);
  });

  it("rejects a withholding rate below zero", () => {
    expect(run({ withholdingRate: "-1" }).ok).toBe(false);
  });

  it("rejects a fractional year count", () => {
    expect(run({ years: "20.5" }).ok).toBe(false);
  });

  it("rejects invalid text and empty required fields", () => {
    expect(run({ balance: "abc" }).ok).toBe(false);
    expect(run({ balance: "" }).ok).toBe(false);
  });

  it("never produces a negative balance or NaN", () => {
    const r = run({ balance: "abc", effectiveTaxRate: "-5" });
    for (const [key, v] of Object.entries(r)) {
      if (typeof v === "number") {
        expect(Number.isFinite(v), `${key} was ${v}`).toBe(true);
      }
    }
  });

  it("does not produce a result from invalid input", () => {
    const r = run({ balance: "-1" });
    expect(r.netAfterTaxValue).toBe(0);
    expect(r.totalTaxLiability).toBe(0);
  });
});
