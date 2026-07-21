import { describe, expect, it } from "vitest";
import {
  marginalRateOptions,
  bracketRateFor,
  saltCapFor,
  SALT_2026,
  US_TAX_2026,
} from "./usTaxConfig";

describe("2026 marginal-rate options — all seven brackets, official 'over' structure", () => {
  const opts = marginalRateOptions();
  const label = (v: string) => opts.find((o) => o.value === v)!.label;

  it("lists all seven brackets", () => {
    expect(opts.map((o) => o.value)).toEqual(["10", "12", "22", "24", "32", "35", "37"]);
  });

  it("10% uses ≤ threshold, not an adjusted $12,399 endpoint", () => {
    expect(label("10")).toBe("10% — Single: ≤ $12,400 · MFJ: ≤ $24,800");
    expect(label("10")).not.toContain("12,399");
  });

  it("12% uses > lower to ≤ upper, not $50,399", () => {
    expect(label("12")).toBe("12% — Single: > $12,400 to ≤ $50,400 · MFJ: > $24,800 to ≤ $100,800");
    expect(label("12")).not.toContain("50,399");
  });

  it("22% uses exact 50,400 / 105,700 / 100,800 / 211,400", () => {
    expect(label("22")).toBe("22% — Single: > $50,400 to ≤ $105,700 · MFJ: > $100,800 to ≤ $211,400");
  });

  it("top 37% bracket uses > threshold only", () => {
    expect(label("37")).toBe("37% — Single: > $640,600 · MFJ: > $768,700");
  });

  it("never contains an artificial $-1 endpoint", () => {
    const all = opts.map((o) => o.label).join(" ");
    expect(all).not.toMatch(/12,399|50,399|105,699|24,799|100,799|211,399/);
  });
});

describe("bracketRateFor — official 'over' boundaries", () => {
  const single = (n: number) => bracketRateFor(n, "single");
  const mfj = (n: number) => bracketRateFor(n, "mfj");

  it("Single: exactly $12,400 is 10%, $12,401 is 12%", () => {
    expect(single(12_400)).toBe(0.1);
    expect(single(12_401)).toBe(0.12);
  });

  it("Single: exactly $50,400 is 12%, $50,401 is 22%", () => {
    expect(single(50_400)).toBe(0.12);
    expect(single(50_401)).toBe(0.22);
  });

  it("Single: exactly $105,700 is 22%, $105,701 is 24%", () => {
    expect(single(105_700)).toBe(0.22);
    expect(single(105_701)).toBe(0.24);
  });

  it("Single: the highest 37% threshold", () => {
    expect(single(640_600)).toBe(0.35);
    expect(single(640_601)).toBe(0.37);
  });

  it("MFJ: every threshold behaves at the exact boundary", () => {
    expect(mfj(24_800)).toBe(0.1);
    expect(mfj(24_801)).toBe(0.12);
    expect(mfj(100_800)).toBe(0.12);
    expect(mfj(100_801)).toBe(0.22);
    expect(mfj(211_400)).toBe(0.22);
    expect(mfj(211_401)).toBe(0.24);
    expect(mfj(403_550)).toBe(0.24);
    expect(mfj(403_551)).toBe(0.32);
    expect(mfj(512_450)).toBe(0.32);
    expect(mfj(512_451)).toBe(0.35);
    expect(mfj(768_700)).toBe(0.35);
    expect(mfj(768_701)).toBe(0.37);
  });

  it("income of zero is the lowest bracket, and non-finite is safe", () => {
    expect(single(0)).toBe(0.1);
    expect(single(NaN)).toBe(0.1);
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
