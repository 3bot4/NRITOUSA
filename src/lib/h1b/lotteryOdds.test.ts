import { describe, it, expect } from "vitest";
import {
  calculateH1BOdds,
  compareSelectionRegimes,
  randomRegimeChance,
  ODDS_CONFIG,
  VOLUME_SCENARIOS,
  type WageLevel,
} from "./lotteryOdds";

const LEVELS: Exclude<WageLevel, "unknown">[] = ["I", "II", "III", "IV"];
const N = VOLUME_SCENARIOS.baseline.totalBeneficiaries;

describe("the weights match the final rule", () => {
  it("enters a registration once per wage level I through IV", () => {
    // 90 FR 60864, effective 2026-02-27: Level I once, II twice, III three
    // times, IV four times.
    expect(ODDS_CONFIG.weights).toEqual({ I: 1, II: 2, III: 3, IV: 4 });
  });

  it("uses the statutory caps, not rounded approximations", () => {
    expect(ODDS_CONFIG.regularCap).toBe(65_000);
    expect(ODDS_CONFIG.mastersCap).toBe(20_000);
  });

  it("assumes a wage distribution that sums to 1", () => {
    const d = ODDS_CONFIG.wageDistribution;
    expect(d.I + d.II + d.III + d.IV).toBeCloseTo(1, 6);
  });
});

describe("calculateH1BOdds", () => {
  const base = { degreeCategory: "regular" as const, totalBeneficiaries: N, attempts: 1 };

  it("always returns probabilities inside (0, 1)", () => {
    for (const level of [...LEVELS, "unknown" as const]) {
      const r = calculateH1BOdds({ ...base, wageLevel: level });
      for (const p of [r.oneYearLow, r.oneYearHigh, r.multiYearLow, r.multiYearHigh]) {
        expect(p).toBeGreaterThan(0);
        expect(p).toBeLessThan(1);
      }
    }
  });

  it("rises monotonically with wage level — the whole point of the rule", () => {
    const odds = LEVELS.map(
      (level) => calculateH1BOdds({ ...base, wageLevel: level }).oneYearLow
    );
    for (let i = 1; i < odds.length; i++) {
      expect(odds[i]).toBeGreaterThan(odds[i - 1]);
    }
  });

  it("gives a master's candidate better odds than a regular one at the same level", () => {
    for (const level of LEVELS) {
      const reg = calculateH1BOdds({ ...base, wageLevel: level });
      const mas = calculateH1BOdds({ ...base, wageLevel: level, degreeCategory: "masters" });
      expect(mas.oneYearLow).toBeGreaterThan(reg.oneYearLow);
    }
  });

  it("keeps low below high, and widens over multiple attempts", () => {
    const r = calculateH1BOdds({ ...base, wageLevel: "II", attempts: 3 });
    expect(r.oneYearLow).toBeLessThan(r.oneYearHigh);
    expect(r.multiYearLow).toBeGreaterThan(r.oneYearLow);
    expect(r.multiYearHigh).toBeGreaterThan(r.oneYearHigh);
  });

  it("uses a wider band, and the pool average weight, when the level is unknown", () => {
    const unknown = calculateH1BOdds({ ...base, wageLevel: "unknown" });
    const known = calculateH1BOdds({ ...base, wageLevel: "II" });
    const spread = (r: { oneYearLow: number; oneYearHigh: number }) =>
      (r.oneYearHigh - r.oneYearLow) / ((r.oneYearHigh + r.oneYearLow) / 2);
    expect(spread(unknown)).toBeGreaterThan(spread(known));
    expect(unknown.interpretation).toBe("unknown");
    expect(unknown.wageWeightLabel).toMatch(/unknown/);
  });

  it("gets worse as the registration pool grows", () => {
    const low = calculateH1BOdds({
      ...base,
      wageLevel: "III",
      totalBeneficiaries: VOLUME_SCENARIOS.low.totalBeneficiaries,
    });
    const high = calculateH1BOdds({
      ...base,
      wageLevel: "III",
      totalBeneficiaries: VOLUME_SCENARIOS.high.totalBeneficiaries,
    });
    expect(high.oneYearLow).toBeLessThan(low.oneYearLow);
  });

  it("clamps hostile inputs instead of returning NaN", () => {
    for (const total of [0, -1, NaN]) {
      const r = calculateH1BOdds({ ...base, wageLevel: "I", totalBeneficiaries: total });
      expect(Number.isFinite(r.oneYearLow)).toBe(true);
      expect(r.oneYearLow).toBeGreaterThan(0);
    }
    const clamped = calculateH1BOdds({ ...base, wageLevel: "I", attempts: 99 });
    expect(Number.isFinite(clamped.multiYearHigh)).toBe(true);
    expect(clamped.multiYearHigh).toBeLessThan(1);
  });

  it("shows its working — every assumption is listed", () => {
    const r = calculateH1BOdds({ ...base, wageLevel: "IV" });
    expect(r.assumptionsUsed.length).toBeGreaterThanOrEqual(6);
    expect(r.assumptionsUsed.join(" ")).toMatch(/65,000/);
    expect(r.assumptionsUsed.join(" ")).toMatch(/Level I=1×/);
  });
});

describe("randomRegimeChance — the old draw, for comparison", () => {
  it("does not depend on wage level at all", () => {
    // There is no wage-level argument, and that IS the finding: before the
    // weighted rule, a Level I and a Level IV registrant had identical odds.
    expect(randomRegimeChance(N, "regular")).toBe(randomRegimeChance(N, "regular"));
  });

  it("gives master's candidates a second bite", () => {
    expect(randomRegimeChance(N, "masters")).toBeGreaterThan(
      randomRegimeChance(N, "regular")
    );
  });

  it("falls as the pool grows", () => {
    expect(randomRegimeChance(450_000, "regular")).toBeLessThan(
      randomRegimeChance(220_000, "regular")
    );
  });

  it("stays a probability for absurd inputs", () => {
    for (const n of [0, -5, NaN]) {
      const p = randomRegimeChance(n, "regular");
      expect(p).toBeGreaterThan(0);
      expect(p).toBeLessThanOrEqual(0.99);
    }
  });
});

describe("compareSelectionRegimes", () => {
  const rows = compareSelectionRegimes(N, "regular");

  it("returns one row per wage level, in order", () => {
    expect(rows.map((r) => r.level)).toEqual(LEVELS);
    expect(rows.map((r) => r.weight)).toEqual([1, 2, 3, 4]);
  });

  it("shows the same random-draw figure on every row", () => {
    const uniq = new Set(rows.map((r) => r.random));
    expect(uniq.size).toBe(1);
  });

  it("shows weighted odds rising across the levels", () => {
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].weighted).toBeGreaterThan(rows[i - 1].weighted);
    }
  });

  it("leaves Level I worse off than the old random draw — the real story", () => {
    // A Level I registrant gets one entry while others get up to four, so the
    // same 65,000 selections are spread over a larger weighted pool.
    const levelOne = rows[0];
    expect(levelOne.weighted).toBeLessThan(levelOne.random);
  });

  it("keeps every figure a valid probability", () => {
    for (const r of rows) {
      for (const p of [r.random, r.weighted]) {
        expect(p).toBeGreaterThan(0);
        expect(p).toBeLessThan(1);
      }
    }
  });
});
