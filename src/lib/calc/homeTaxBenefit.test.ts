import { describe, expect, it } from "vitest";
import { homeTaxBenefit, type HomeBenefitInput } from "./homeTaxBenefit";

// 2026 single standard deduction is $16,100 (sourced in usTaxConfig).
const base: HomeBenefitInput = {
  mortgageInterest: 18_000,
  propertyTax: 8_000,
  otherSaltPaid: 0,
  otherItemized: 0,
  standardDeduction: 16_100,
  saltCap: 40_000,
  marginalRate: 0.24,
  itemize: true,
};

const run = (over: Partial<HomeBenefitInput> = {}) => homeTaxBenefit({ ...base, ...over });

describe("standard-deduction users get zero incremental benefit", () => {
  it("returns zero when the user is not itemizing", () => {
    const r = run({ itemize: false });
    expect(r.incrementalDeduction).toBe(0);
    expect(r.taxBenefit).toBe(0);
    expect(r.hasBenefit).toBe(false);
  });

  it("returns zero when itemized-with-home does not exceed the standard deduction", () => {
    // Small home: interest 5k + property 3k = 8k itemized < 16,100 standard.
    const r = run({ mortgageInterest: 5_000, propertyTax: 3_000 });
    expect(r.incrementalDeduction).toBe(0);
    expect(r.taxBenefit).toBe(0);
  });

  it("does NOT simply multiply interest+property tax by the marginal rate", () => {
    // The old bug: (18,000 + 8,000) x 0.24 = 6,240 every year.
    const r = run();
    expect(r.taxBenefit).not.toBeCloseTo(6_240, 0);
    expect(r.taxBenefit).toBeLessThan(6_240);
  });
});

describe("incremental deduction over the standard deduction", () => {
  it("counts only the excess over the standard deduction", () => {
    // itemizedWithHome = 18,000 interest + 8,000 SALT = 26,000; minus 16,100 std.
    const r = run();
    expect(r.incrementalDeduction).toBeCloseTo(26_000 - 16_100, 2);
    expect(r.taxBenefit).toBeCloseTo((26_000 - 16_100) * 0.24, 2);
  });

  it("measures against other itemized deductions when they beat the standard", () => {
    // otherItemized 20,000 already exceeds the 16,100 std.
    // without home: 20,000; with home: 20,000 + 18,000 + 8,000 = 46,000.
    const r = run({ otherItemized: 20_000 });
    expect(r.incrementalDeduction).toBeCloseTo(46_000 - 20_000, 2);
  });
});

describe("SALT cap", () => {
  it("limits the property-tax contribution to the remaining cap room", () => {
    // otherSaltPaid 38,000, cap 40,000 -> only 2,000 of property tax counts.
    const r = run({ otherSaltPaid: 38_000, propertyTax: 8_000, otherItemized: 0 });
    // withoutHome SALT = min(38,000, 40,000) = 38,000; itemizedWithoutHome = 38,000
    // withHome SALT = min(46,000, 40,000) = 40,000; +18,000 interest = 58,000
    // incremental = 58,000 - max(38,000, 16,100) = 20,000
    expect(r.incrementalDeduction).toBeCloseTo(20_000, 2);
  });

  it("adds no property-tax benefit once the cap is already used up", () => {
    const capped = run({ otherSaltPaid: 40_000, propertyTax: 8_000 });
    const noProp = run({ otherSaltPaid: 40_000, propertyTax: 0 });
    // Property tax beyond the cap contributes nothing extra.
    expect(capped.incrementalDeduction).toBeCloseTo(noProp.incrementalDeduction, 2);
  });
});

describe("robustness", () => {
  it("never returns negative or NaN", () => {
    for (const over of [
      { mortgageInterest: -1 },
      { propertyTax: -1 },
      { marginalRate: -1 },
      { marginalRate: 5 },
      { otherItemized: -1000 },
    ]) {
      const r = run(over);
      expect(Number.isFinite(r.incrementalDeduction)).toBe(true);
      expect(Number.isFinite(r.taxBenefit)).toBe(true);
      expect(r.incrementalDeduction).toBeGreaterThanOrEqual(0);
      expect(r.taxBenefit).toBeGreaterThanOrEqual(0);
    }
  });

  it("clamps the marginal rate to at most 100%", () => {
    const r = run({ marginalRate: 5 });
    expect(r.taxBenefit).toBeLessThanOrEqual(r.incrementalDeduction);
  });
});
