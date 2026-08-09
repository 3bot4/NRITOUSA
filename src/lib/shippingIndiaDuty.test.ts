/**
 * Tests for the shipping-cost + customs-duty math behind
 * /shipping-household-goods-to-india.
 *
 * Two concerns, tested separately:
 *  1. Against the REAL data file (shippingIndiaRatesData.ts) — locks in the
 *     current, deliberate verification state: shipping-mode rates and TR
 *     value tiers are sourced (courier/air/sea rates, BHK volumes), while
 *     the household-goods duty RATE itself stays unresolved because sources
 *     conflict (35–38.5% historical vs. a claimed new 10% flat rate). These
 *     tests will need updating if that duty rate is later confirmed and
 *     filled in — that's intentional, it's the signal that the config changed.
 *  2. Against synthetic fully-verified config (mocked) — proves the
 *     arithmetic itself (volume summing, TR tier selection, dutiable excess,
 *     rate application, landed-cost combination) is correct in the general
 *     case, independent of today's specific sourced numbers.
 */
import { describe, expect, it, vi } from "vitest";

describe("shippingIndiaDuty — against the real, partially-sourced data file", () => {
  it("computeVolume: box basis sums real CBF geometry and derives weight from the verified density", async () => {
    const { computeVolume } = await import("./shippingIndiaDuty");
    const r = computeVolume({
      basis: "boxes",
      boxCounts: { small: 2, medium: 1, large: 0 },
      bhkValue: "",
    });
    // 2 small (2.4 CBF) + 1 medium (4.5 CBF) = 9.3 CBF — pure geometry, not a sourced rate.
    expect(r.cbf).toBeCloseTo(9.3, 5);
    expect(r.verified).toBe(true);
    // Density is now a verified (IATA-standard) constant, so weight is derived.
    expect(r.weightKg).not.toBeNull();
    expect(r.weightKg as number).toBeCloseTo(9.3 * 4.73, 1);
  });

  it("computeVolume: BHK basis is verified using the sourced preset volumes", async () => {
    const { computeVolume } = await import("./shippingIndiaDuty");
    const r = computeVolume({ basis: "bhk", boxCounts: { small: 0, medium: 0, large: 0 }, bhkValue: "2bhk" });
    expect(r.verified).toBe(true);
    expect(r.cbf).toBeGreaterThan(0);
    expect(r.weightKg).not.toBeNull();
  });

  it("estimateShippingCosts: all four modes now produce a real cost range", async () => {
    const { computeVolume, estimateShippingCosts } = await import("./shippingIndiaDuty");
    const volume = computeVolume({ basis: "boxes", boxCounts: { small: 5, medium: 5, large: 5 }, bhkValue: "" });
    const modes = estimateShippingCosts(volume);
    expect(modes).toHaveLength(4);
    for (const m of modes) {
      expect(m.verified).toBe(true);
      expect(m.costLowUsd).not.toBeNull();
      expect(m.costHighUsd).not.toBeNull();
      expect((m.costLowUsd as number) <= (m.costHighUsd as number)).toBe(true);
    }
  });

  it("estimateShippingCosts: courier uses the Jio Worldwide-sourced $11–13/kg rate and $36 minimum", async () => {
    const { computeVolume, estimateShippingCosts } = await import("./shippingIndiaDuty");
    const volume = computeVolume({ basis: "boxes", boxCounts: { small: 1, medium: 1, large: 0 }, bhkValue: "" });
    const modes = estimateShippingCosts(volume);
    const courier = modes.find((m) => m.mode === "courier")!;
    const weightKg = volume.weightKg as number;
    expect(courier.costLowUsd).toBeCloseTo(Math.max(weightKg * 11, 36), 5);
    expect(courier.costHighUsd).toBeCloseTo(Math.max(weightKg * 13, 36), 5);
  });

  it("estimateShippingCosts: air freight's unverified minCharge defaults to $0, not a blocker", async () => {
    const { computeVolume, estimateShippingCosts } = await import("./shippingIndiaDuty");
    // A tiny volume, so if minCharge silently used a wrong nonzero fallback it would show up here.
    const volume = computeVolume({ basis: "boxes", boxCounts: { small: 1, medium: 0, large: 0 }, bhkValue: "" });
    const modes = estimateShippingCosts(volume);
    const air = modes.find((m) => m.mode === "air")!;
    expect(air.verified).toBe(true);
    const weightKg = volume.weightKg as number;
    expect(air.costLowUsd).toBeCloseTo(weightKg * 5, 5); // no minCharge floor applied
  });

  it("estimateCategoryDuty: TR tiers resolve, but the duty rate stays unresolved (conflicting sources)", async () => {
    const { estimateCategoryDuty } = await import("./shippingIndiaDuty");
    const r = estimateCategoryDuty({ category: "householdGoods", declaredValueUsd: 5000 }, 3);
    expect(r.tierVerified).toBe(true);
    expect(r.rateVerified).toBe(false);
    expect(r.trCoveredValueUsd).not.toBeNull();
    expect(r.dutiableValueUsd).not.toBeNull();
    // The rate itself is the one deliberately-unresolved number.
    expect(r.dutyRatePct).toBeNull();
    expect(r.estimatedDutyUsd).toBeNull();
    expect(r.note).toMatch(/conflicting sources/i);
  });

  it("estimateCategoryDuty: a longer stay abroad reaches a higher TR tier and covers more value", async () => {
    const { estimateCategoryDuty } = await import("./shippingIndiaDuty");
    const shortStay = estimateCategoryDuty({ category: "householdGoods", declaredValueUsd: 10000 }, 0.5); // 6 months
    const longStay = estimateCategoryDuty({ category: "householdGoods", declaredValueUsd: 10000 }, 3); // 3 years
    expect((shortStay.trCoveredValueUsd as number)).toBeGreaterThan(0); // clears the 3-month tier
    expect((longStay.trCoveredValueUsd as number)).toBeGreaterThan(shortStay.trCoveredValueUsd as number);
  });
});

describe("shippingIndiaDuty — arithmetic with synthetic fully-verified config", () => {
  it("estimateShippingCosts computes per-kg and per-CBF ranges correctly", async () => {
    vi.resetModules();
    vi.doMock("@/data/shippingIndiaRatesData", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/data/shippingIndiaRatesData")>();
      const verified = (value: number, currency: any = "usd") => ({
        value,
        currency,
        sourceUrl: "https://example.com",
        dateVerified: "2026-08-01",
        confidence: "verified" as const,
        note: "test fixture",
      });
      return {
        ...actual,
        householdGoodsDensity: verified(5, "kg_per_cbf"), // 5 kg per CBF
        shippingModeConfig: {
          ...actual.shippingModeConfig,
          seaLcl: {
            ...actual.shippingModeConfig.seaLcl,
            rateLow: verified(8, "usd_per_cbf"),
            rateHigh: verified(12, "usd_per_cbf"),
            minCharge: verified(150, "usd_flat"),
            transitDaysLow: verified(45, "days"),
            transitDaysHigh: verified(70, "days"),
          },
          courier: {
            ...actual.shippingModeConfig.courier,
            rateLow: verified(4, "usd_per_kg"),
            rateHigh: verified(7, "usd_per_kg"),
            minCharge: verified(50, "usd_flat"),
            transitDaysLow: verified(5, "days"),
            transitDaysHigh: verified(10, "days"),
          },
        },
      };
    });

    const { computeVolume, estimateShippingCosts } = await import("./shippingIndiaDuty");
    // 10 medium boxes (4.5 CBF each) = 45 CBF; weight = 45 * 5 = 225 kg.
    const volume = computeVolume({ basis: "boxes", boxCounts: { small: 0, medium: 10, large: 0 }, bhkValue: "" });
    expect(volume.cbf).toBeCloseTo(45, 5);
    expect(volume.weightKg).toBeCloseTo(225, 5);

    const modes = estimateShippingCosts(volume);
    const lcl = modes.find((m) => m.mode === "seaLcl")!;
    expect(lcl.verified).toBe(true);
    expect(lcl.costLowUsd).toBeCloseTo(45 * 8, 5); // 360, above the $150 minimum
    expect(lcl.costHighUsd).toBeCloseTo(45 * 12, 5); // 540

    const courier = modes.find((m) => m.mode === "courier")!;
    expect(courier.verified).toBe(true);
    // 225 kg * $4 = $900 (above the $50 minimum)
    expect(courier.costLowUsd).toBeCloseTo(225 * 4, 5);
    expect(courier.costHighUsd).toBeCloseTo(225 * 7, 5);

    vi.doUnmock("@/data/shippingIndiaRatesData");
    vi.resetModules();
  });

  it("estimateCategoryDuty applies the matched TR tier cap to only the excess value", async () => {
    vi.resetModules();
    vi.doMock("@/data/shippingIndiaRatesData", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/data/shippingIndiaRatesData")>();
      const verified = (value: number, currency: any = "usd") => ({
        value,
        currency,
        sourceUrl: "https://example.com",
        dateVerified: "2026-08-01",
        confidence: "verified" as const,
        note: "test fixture",
      });
      return {
        ...actual,
        dutyCategoryConfig: {
          ...actual.dutyCategoryConfig,
          householdGoods: {
            ...actual.dutyCategoryConfig.householdGoods,
            trTiers: [
              { minMonthsAbroad: 3, capUsd: verified(1500) },
              { minMonthsAbroad: 24, capUsd: verified(2000) },
            ],
            dutyRatePctBeyondRelief: verified(15, "percent"),
          },
        },
      };
    });

    const { estimateCategoryDuty } = await import("./shippingIndiaDuty");

    // 30 months abroad reaches the 24-month tier ($2,000 cap): $3,500 declared,
    // $2,000 covered, $1,500 dutiable at 15%.
    const eligible = estimateCategoryDuty({ category: "householdGoods", declaredValueUsd: 3500 }, 2.5);
    expect(eligible.tierVerified).toBe(true);
    expect(eligible.rateVerified).toBe(true);
    expect(eligible.matchedTierMonths).toBe(24);
    expect(eligible.trCoveredValueUsd).toBe(2000);
    expect(eligible.dutiableValueUsd).toBe(1500);
    expect(eligible.estimatedDutyUsd).toBeCloseTo(1500 * 0.15, 5);

    // 6 months abroad only reaches the 3-month tier ($1,500 cap).
    const shortStay = estimateCategoryDuty({ category: "householdGoods", declaredValueUsd: 3500 }, 0.5);
    expect(shortStay.matchedTierMonths).toBe(3);
    expect(shortStay.trCoveredValueUsd).toBe(1500);
    expect(shortStay.dutiableValueUsd).toBe(2000);
    expect(shortStay.estimatedDutyUsd).toBeCloseTo(2000 * 0.15, 5);

    // Under 3 months: no tier matched, full value dutiable.
    const noStay = estimateCategoryDuty({ category: "householdGoods", declaredValueUsd: 3500 }, 0.1);
    expect(noStay.matchedTierMonths).toBeNull();
    expect(noStay.trCoveredValueUsd).toBe(0);
    expect(noStay.dutiableValueUsd).toBe(3500);

    vi.doUnmock("@/data/shippingIndiaRatesData");
    vi.resetModules();
  });
});

describe("shippingIndiaDuty — combineLandedCost", () => {
  it("adds duty only to modes with a known cost, and converts to INR consistently", async () => {
    const { combineLandedCost } = await import("./shippingIndiaDuty");
    const modes = [
      {
        mode: "seaLcl" as const,
        label: "Sea LCL",
        shortLabel: "Sea LCL",
        verified: true,
        costLowUsd: 400,
        costHighUsd: 600,
        transitDaysLow: 45,
        transitDaysHigh: 70,
        note: "",
      },
      {
        mode: "courier" as const,
        label: "Courier",
        shortLabel: "Courier",
        verified: false,
        costLowUsd: null,
        costHighUsd: null,
        transitDaysLow: null,
        transitDaysHigh: null,
        note: "",
      },
    ];
    const rows = combineLandedCost(modes, 200);
    const lcl = rows.find((r) => r.mode === "seaLcl")!;
    expect(lcl.totalLowUsd).toBe(600);
    expect(lcl.totalHighUsd).toBe(800);
    expect(lcl.totalLowInr).toBe(600 * 88);
    expect(lcl.totalHighInr).toBe(800 * 88);

    const courier = rows.find((r) => r.mode === "courier")!;
    expect(courier.totalLowUsd).toBeNull();
    expect(courier.totalHighUsd).toBeNull();
    expect(courier.totalLowInr).toBeNull();
  });
});
