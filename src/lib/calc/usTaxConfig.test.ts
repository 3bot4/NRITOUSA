import { describe, expect, it } from "vitest";
import {
  marginalRateOptions,
  saltCapFor,
  SALT_2026,
  US_TAX_2026,
} from "./usTaxConfig";

describe("2026 marginal-rate options — all seven brackets, exact thresholds", () => {
  const opts = marginalRateOptions();

  it("lists all seven brackets", () => {
    expect(opts.map((o) => o.value)).toEqual(["10", "12", "22", "24", "32", "35", "37"]);
  });

  it("uses exact dollar thresholds, not rounded $k ranges", () => {
    const label22 = opts.find((o) => o.value === "22")!.label;
    expect(label22).toContain("$50,400"); // single 22% starts here
    expect(label22).toContain("$100,800"); // MFJ 22% starts here
    expect(label22).not.toMatch(/\$50k|\$106k/);
  });

  it("caps the top bracket with a + and the verified 2026 floors", () => {
    const label37 = opts.find((o) => o.value === "37")!.label;
    expect(label37).toContain("$640,600+"); // single 37%
    expect(label37).toContain("$768,700+"); // MFJ 37%
  });
});

describe("SALT cap 2026 — verified figures and phase-down", () => {
  it("uses the verified base caps and floors", () => {
    expect(SALT_2026.general.baseCap).toBe(40_400);
    expect(SALT_2026.mfs.baseCap).toBe(20_200);
    expect(SALT_2026.general.floor).toBe(10_000);
    expect(SALT_2026.mfs.floor).toBe(5_000);
    expect(SALT_2026.general.magiThreshold).toBe(505_000);
    expect(SALT_2026.mfs.magiThreshold).toBe(252_500);
  });

  it("gives the full cap at or below the threshold (general)", () => {
    expect(saltCapFor("single", 0)).toBe(40_400);
    expect(saltCapFor("mfj", 505_000)).toBe(40_400);
  });

  it("phases down by 30% of MAGI over the threshold", () => {
    // $505,001 -> reduced by 0.30 of $1 = $0.30
    expect(saltCapFor("single", 505_001)).toBeCloseTo(40_399.7, 2);
    // $555,000 -> 40,400 - 0.30*50,000 = 25,400
    expect(saltCapFor("mfj", 555_000)).toBe(25_400);
  });

  it("reaches the $10,000 floor at $606,333 and never goes below", () => {
    expect(saltCapFor("single", 606_333)).toBeCloseTo(10_000, 0);
    expect(saltCapFor("single", 700_000)).toBe(10_000);
    expect(saltCapFor("single", 5_000_000)).toBe(10_000);
  });

  it("applies the MFS base, threshold and $5,000 floor", () => {
    expect(saltCapFor("mfs", 252_500)).toBe(20_200);
    // $302,500 -> 20,200 - 0.30*50,000 = 5,200
    expect(saltCapFor("mfs", 302_500)).toBe(5_200);
    expect(saltCapFor("mfs", 1_000_000)).toBe(5_000);
  });

  it("boundary: immediately below vs above $505,000", () => {
    expect(saltCapFor("single", 504_999)).toBe(40_400);
    expect(saltCapFor("single", 505_000)).toBe(40_400);
    expect(saltCapFor("single", 505_100)).toBeCloseTo(40_400 - 0.3 * 100, 2);
  });

  it("never returns a non-finite or below-floor value", () => {
    for (const magi of [-1, 0, NaN, Infinity, 1e9]) {
      const g = saltCapFor("single", magi);
      const m = saltCapFor("mfs", magi);
      expect(Number.isFinite(g)).toBe(true);
      expect(g).toBeGreaterThanOrEqual(10_000);
      expect(m).toBeGreaterThanOrEqual(5_000);
    }
  });
});

describe("2026 standard deductions are the verified IRS values", () => {
  it("matches the release", () => {
    expect(US_TAX_2026.single.standardDeduction).toBe(16_100);
    expect(US_TAX_2026.marriedJoint.standardDeduction).toBe(32_200);
    expect(US_TAX_2026.headOfHousehold.standardDeduction).toBe(24_150);
    expect(US_TAX_2026.marriedSeparate.standardDeduction).toBe(16_100);
  });
});
