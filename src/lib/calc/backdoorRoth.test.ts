import { describe, expect, it } from "vitest";
import { calculateRoth, reducedContribution, resolveRange } from "./backdoorRoth";
import { IRA_LIMITS_2026 } from "./irsLimits";

const L = IRA_LIMITS_2026;

const run = (
  magi: number,
  status: Parameters<typeof resolveRange>[0] = "single",
  age = 35,
  tradBal = 0,
) =>
  calculateRoth({
    magi: String(magi),
    age: String(age),
    tradBal: String(tradBal),
    status,
  });

describe("2026 IRS limits are wired through", () => {
  it("uses the verified 2026 contribution limits", () => {
    expect(L.under50).toBe(7_500);
    expect(L.age50Plus).toBe(8_600);
    expect(L.catchUp).toBe(1_100);
  });

  it("uses the verified 2026 phase-out ranges", () => {
    expect(L.phaseOut.single).toEqual({ start: 153_000, end: 168_000 });
    expect(L.phaseOut.mfj).toEqual({ start: 242_000, end: 252_000 });
    expect(L.phaseOut.mfsLivedWithSpouse).toEqual({ start: 0, end: 10_000 });
  });
});

describe("phase-out boundaries — single / head of household", () => {
  const { start, end } = L.phaseOut.single;

  it("below the range: full contribution", () => {
    const r = run(start - 1);
    expect(r.verdict).toBe("full");
    expect(r.directAllowed).toBe(7_500);
  });

  it("exactly at the start of the range: still full", () => {
    expect(run(start).verdict).toBe("full");
  });

  it("$1 into the range: the round-up-to-$10 rule still allows the full limit", () => {
    // Reduction is 7,500 x (1 / 15,000) = $0.50, and Pub 590-A rounds the
    // result UP to the next $10 — so the full $7,500 remains available.
    const r = run(start + 1);
    expect(r.directAllowed).toBe(7_500);
    expect(r.verdict).toBe("full");
  });

  it("meaningfully inside the range: genuinely reduced", () => {
    const r = run(start + 2_000);
    expect(r.verdict).toBe("partial");
    expect(r.directAllowed).toBeLessThan(7_500);
    expect(r.directAllowed).toBeGreaterThan(0);
  });

  it("mid-range: roughly half the limit", () => {
    const r = run((start + end) / 2);
    expect(r.directAllowed).toBeGreaterThan(3_500);
    expect(r.directAllowed).toBeLessThan(4_000);
  });

  it("just below the top of the range: floors at $200, never a trivial amount", () => {
    const r = run(end - 1);
    expect(r.directAllowed).toBe(200);
  });

  it("exactly at the end of the range: no direct contribution", () => {
    const r = run(end);
    expect(r.verdict).toBe("backdoor");
    expect(r.directAllowed).toBe(0);
  });

  it("above the range: no direct contribution", () => {
    expect(run(end + 1).directAllowed).toBe(0);
  });
});

describe("phase-out boundaries — married filing jointly", () => {
  const { start, end } = L.phaseOut.mfj;

  it("below the range", () => {
    expect(run(start - 1, "mfj").verdict).toBe("full");
  });

  it("inside the range", () => {
    expect(run((start + end) / 2, "mfj").verdict).toBe("partial");
  });

  it("above the range", () => {
    expect(run(end + 1, "mfj").verdict).toBe("backdoor");
  });

  it("a MFJ earner below the single range is unaffected by the single band", () => {
    expect(run(160_000, "mfj").directAllowed).toBe(7_500);
  });
});

describe("phase-out boundaries — married filing separately", () => {
  it("lived with spouse: phases out across $0–$10,000", () => {
    expect(run(0, "mfsLivedWithSpouse").verdict).toBe("full");
    expect(run(5_000, "mfsLivedWithSpouse").verdict).toBe("partial");
    expect(run(10_000, "mfsLivedWithSpouse").directAllowed).toBe(0);
  });

  it("lived apart all year: treated as single, not the $0–$10,000 band", () => {
    const r = run(120_000, "mfsLivedApart");
    expect(r.usedSingleRangeForMfs).toBe(true);
    expect(r.range).toEqual(L.phaseOut.single);
    expect(r.directAllowed).toBe(7_500);
  });
});

describe("age 49 vs 50 catch-up", () => {
  it("age 49 gets the base limit", () => {
    const r = run(100_000, "single", 49);
    expect(r.catchUpApplied).toBe(false);
    expect(r.contributionLimit).toBe(7_500);
  });

  it("age 50 gets the catch-up limit", () => {
    const r = run(100_000, "single", 50);
    expect(r.catchUpApplied).toBe(true);
    expect(r.contributionLimit).toBe(8_600);
  });

  it("the catch-up also raises the reduced amount inside the band", () => {
    const mid = (L.phaseOut.single.start + L.phaseOut.single.end) / 2;
    expect(run(mid, "single", 50).directAllowed).toBeGreaterThan(
      run(mid, "single", 49).directAllowed,
    );
  });
});

describe("pro-rata rule", () => {
  it("no pre-tax IRA balance means a clean conversion", () => {
    const r = run(200_000, "single", 35, 0);
    expect(r.proRataTaxablePct).toBe(0);
    expect(r.proRataTaxableAmount).toBe(0);
  });

  it("a pre-tax balance makes most of the conversion taxable", () => {
    const r = run(200_000, "single", 35, 92_500);
    // 92,500 / (92,500 + 7,500) = 92.5%
    expect(r.proRataTaxablePct).toBeCloseTo(92.5, 5);
    expect(r.proRataTaxableAmount).toBeCloseTo(6_937.5, 5);
  });

  it("an equal pre-tax balance makes half the conversion taxable", () => {
    const r = run(200_000, "single", 35, 7_500);
    expect(r.proRataTaxablePct).toBeCloseTo(50, 5);
  });
});

describe("input validation blocks results", () => {
  it("rejects a negative MAGI", () => {
    const r = run(-1);
    expect(r.ok).toBe(false);
    expect(r.errors.magi).toContain("cannot be less than");
  });

  it("rejects a fractional age", () => {
    const r = calculateRoth({ magi: "100000", age: "35.5", tradBal: "0", status: "single" });
    expect(r.ok).toBe(false);
    expect(r.errors.age).toBe("Your age must be a whole number.");
  });

  it("rejects invalid text and returns no contribution", () => {
    const r = calculateRoth({ magi: "abc", age: "35", tradBal: "0", status: "single" });
    expect(r.ok).toBe(false);
    expect(r.directAllowed).toBe(0);
  });

  it("rejects a negative pre-tax balance", () => {
    const r = run(100_000, "single", 35, -5_000);
    expect(r.ok).toBe(false);
    expect(r.errors.tradBal).toContain("cannot be less than");
  });

  it("never emits NaN for any output", () => {
    const r = calculateRoth({ magi: "", age: "", tradBal: "", status: "single" });
    expect(Number.isFinite(r.directAllowed)).toBe(true);
    expect(Number.isFinite(r.proRataTaxablePct)).toBe(true);
    expect(Number.isFinite(r.proRataTaxableAmount)).toBe(true);
  });
});

describe("reducedContribution rounding", () => {
  it("rounds up to the nearest $10 per Publication 590-A", () => {
    const v = reducedContribution(160_000, 7_500, L.phaseOut.single);
    expect(v % 10).toBe(0);
  });

  it("applies the $200 minimum rather than returning a token amount", () => {
    expect(reducedContribution(167_999, 7_500, L.phaseOut.single)).toBe(200);
  });

  it("never exceeds the contribution limit", () => {
    expect(reducedContribution(153_001, 7_500, L.phaseOut.single)).toBeLessThanOrEqual(7_500);
  });
});
