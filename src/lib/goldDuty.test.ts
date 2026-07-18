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
    expect(r.warnings.join(" ")).toMatch(/no duty-free allowance/i);
  });

  it("handles a child traveler with the gender-based weight and a verify-with-CBIC warning (girl, 14 months, 50 g / $5,000)", () => {
    const r = calcGoldDuty({ category: "girl-child", monthsAbroad: 14, form: "jewellery", grams: 50, valueUsd: 5000 });
    expect(r.freeGrams).toBe(cfg.freeJewelleryGramsWoman); // 40 g free
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
    expect(uncle.ratePct).toBe(cfg.standardRatePct); // <6 months → 36%
    expect(uncle.dutyUsd).toBe(792); // $2,200 × 36%

    // No pooling: mom's spare allowance never offsets dad's excess.
    expect(mom.freeGrams + dad.freeGrams).toBe(60);
    expect(dad.dutyUsd).toBeGreaterThan(0);
  });

  it("flags totals above the 1 kg per-passenger cap", () => {
    const r = calcGoldDuty({ category: "man", monthsAbroad: 24, form: "bars", grams: 1200, valueUsd: 120000 });
    expect(r.overCap).toBe(true);
    expect(r.eligibleConcession).toBe(false);
    expect(r.ratePct).toBe(cfg.standardRatePct);
    expect(r.warnings.join(" ")).toMatch(/1 kg/i);
  });
});
