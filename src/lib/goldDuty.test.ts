/**
 * Acceptance tests for the gold duty calculator math — the five scenarios
 * required before /gold-limit-usa-to-india ships: under limit, over-limit
 * jewellery, bars, child traveler, and a family of three (no pooling).
 */
import { describe, expect, it } from "vitest";
import { calcGoldDuty } from "@/lib/goldDuty";
import { goldDutyConfig as cfg } from "@/data/goldCustomsData";

describe("calcGoldDuty", () => {
  it("charges nothing for jewellery under the duty-free limit (woman, 18 months abroad, 35 g)", () => {
    const r = calcGoldDuty({ category: "woman", monthsAbroad: 18, form: "jewellery", grams: 35, valueUsd: 4000 });
    expect(r.freeGrams).toBe(35);
    expect(r.dutiableGrams).toBe(0);
    expect(r.dutyUsd).toBe(0);
    expect(r.dutyInr).toBe(0);
    expect(r.eligibleConcession).toBe(true);
  });

  it("taxes only the excess for over-limit jewellery (man, 24 months abroad, 100 g / $10,000)", () => {
    const r = calcGoldDuty({ category: "man", monthsAbroad: 24, form: "jewellery", grams: 100, valueUsd: 10000 });
    expect(r.freeGrams).toBe(cfg.freeJewelleryGramsOther); // 20 g free
    expect(r.dutiableGrams).toBe(80);
    expect(r.dutiableValueUsd).toBe(8000);
    expect(r.ratePct).toBe(cfg.concessionalRatePct); // 6%
    expect(r.dutyUsd).toBe(480);
    expect(r.dutyInr).toBe(Math.round(480 * cfg.approxInrPerUsd));
  });

  it("gives bars no free allowance but the concessional rate when eligible (8 months abroad, 200 g / $20,000)", () => {
    const r = calcGoldDuty({ category: "man", monthsAbroad: 8, form: "bars", grams: 200, valueUsd: 20000 });
    expect(r.freeGrams).toBe(0);
    expect(r.dutiableValueUsd).toBe(20000);
    expect(r.ratePct).toBe(cfg.concessionalRatePct);
    expect(r.dutyUsd).toBe(1200);
    expect(r.warnings.join(" ")).toMatch(/no duty-free jewellery allowance/i);
  });

  it("handles a child traveler with the gender-based weight and a verify-with-CBIC warning (girl, 14 months, 50 g / $5,000)", () => {
    const r = calcGoldDuty({ category: "girl-child", monthsAbroad: 14, form: "jewellery", grams: 50, valueUsd: 5000 });
    expect(r.freeGrams).toBe(cfg.freeJewelleryGramsFemale); // 40 g free
    expect(r.dutiableGrams).toBe(10);
    expect(r.dutyUsd).toBe(60); // $1,000 × 6%
    expect(r.warnings.join(" ")).toMatch(/child/i);
  });

  it("computes a family of three per person with no pooling", () => {
    // Mother within her 40 g — free.
    const mom = calcGoldDuty({ category: "woman", monthsAbroad: 36, form: "jewellery", grams: 40, valueUsd: 4400 });
    // Father 30 g — 10 g over his 20 g allowance.
    const dad = calcGoldDuty({ category: "man", monthsAbroad: 36, form: "jewellery", grams: 30, valueUsd: 3300 });
    // Visiting uncle only 4 months abroad — no free allowance AND standard rate.
    const uncle = calcGoldDuty({ category: "man", monthsAbroad: 4, form: "jewellery", grams: 20, valueUsd: 2200 });

    expect(mom.dutyUsd).toBe(0);

    expect(dad.dutiableGrams).toBe(10);
    expect(dad.dutiableValueUsd).toBe(1100);
    expect(dad.dutyUsd).toBe(66); // 6% concessional

    expect(uncle.freeGrams).toBe(0); // <12 months → no allowance
    expect(uncle.ratePct).toBe(cfg.standardRatePctIllustrative); // <6 months → 36%
    expect(uncle.dutyUsd).toBe(792); // $2,200 × 36%

    // No pooling: mom's spare allowance never offsets dad's excess.
    expect(mom.freeGrams + dad.freeGrams).toBe(60);
    expect(dad.dutyUsd).toBeGreaterThan(0);
  });

  it("flags totals above the 1 kg per-passenger cap", () => {
    const r = calcGoldDuty({ category: "man", monthsAbroad: 24, form: "bars", grams: 1200, valueUsd: 120000 });
    expect(r.overCap).toBe(true);
    expect(r.eligibleConcession).toBe(false);
    expect(r.ratePct).toBe(cfg.standardRatePctIllustrative);
    expect(r.warnings.join(" ")).toMatch(/1 kg/i);
  });
});

describe("calcGoldDuty edge cases", () => {
  it("handles empty/invalid inputs without NaN", () => {
    const r = calcGoldDuty({ category: "man", monthsAbroad: 12, form: "jewellery", grams: NaN, valueUsd: NaN });
    expect(r.dutyUsd).toBe(0);
    expect(r.dutyInr).toBe(0);
    expect(Number.isFinite(r.dutiableValueUsd)).toBe(true);
  });

  it("applies boundaries exactly at 12 months (allowance) and 6 months (concession)", () => {
    const at12 = calcGoldDuty({ category: "woman", monthsAbroad: 12, form: "jewellery", grams: 40, valueUsd: 4000 });
    expect(at12.freeGrams).toBe(40);
    const at6 = calcGoldDuty({ category: "man", monthsAbroad: 6, form: "coins", grams: 100, valueUsd: 10000 });
    expect(at6.eligibleConcession).toBe(true);
    expect(at6.ratePct).toBe(cfg.concessionalRatePct);
  });

  it("survives very large values and clamps negatives", () => {
    const big = calcGoldDuty({ category: "man", monthsAbroad: 24, form: "bars", grams: 1000, valueUsd: 1e9 });
    expect(big.dutyUsd).toBe(1e9 * cfg.concessionalRatePct / 100);
    const neg = calcGoldDuty({ category: "man", monthsAbroad: 24, form: "bars", grams: -50, valueUsd: -100 });
    expect(neg.dutiableGrams).toBe(0);
    expect(neg.dutyUsd).toBe(0);
  });

  it("exposes the rate formula components for display", () => {
    const r = calcGoldDuty({ category: "man", monthsAbroad: 24, form: "bars", grams: 100, valueUsd: 10000 });
    expect(r.rateComponents.map((c) => c.pct)).toEqual([cfg.concessionalBcdPct, cfg.concessionalAidcPct]);
    expect(r.rateComponents.reduce((s, c) => s + c.pct, 0)).toBe(r.ratePct);
  });
});
