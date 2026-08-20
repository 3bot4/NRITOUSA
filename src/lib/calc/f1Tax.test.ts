import { describe, expect, it } from "vitest";
import {
  estimateFicaRefund,
  estimateNonresidentRefund,
  progressiveTax,
  exemptYearCount,
  progressiveTax,
  runSubstantialPresenceTest,
} from "./f1Tax";
import { taxConstants } from "@/data/studentClusterData";

describe("substantial presence test — exempt individual logic", () => {
  it("treats F-1 exemption as five CALENDAR years, not five 12-month periods", () => {
    // Arrived Aug 2021: 2021 counts as a full exempt year on five months.
    const r = runSubstantialPresenceTest({
      visa: "f1",
      firstArrivalYear: 2021,
      taxYear: 2025,
      daysCurrentYear: 365,
      daysPriorYear: 365,
      daysSecondPriorYear: 365,
    });
    expect(r.exemptYears).toEqual([2021, 2022, 2023, 2024, 2025]);
    expect(r.firstCountingYear).toBe(2026);
    expect(r.taxYearIsExempt).toBe(true);
    expect(r.isResident).toBe(false);
    expect(r.form).toBe("1040-NR");
  });

  it("excludes days from exempt years entirely rather than weighting them", () => {
    // 2026 is the first counting year; 2025 and 2024 were exempt so their
    // days contribute nothing, leaving only current-year days.
    const r = runSubstantialPresenceTest({
      visa: "f1",
      firstArrivalYear: 2021,
      taxYear: 2026,
      daysCurrentYear: 200,
      daysPriorYear: 365,
      daysSecondPriorYear: 365,
    });
    expect(r.breakdown.priorYearWeighted).toBe(0);
    expect(r.breakdown.secondPriorYearWeighted).toBe(0);
    expect(r.weightedDays).toBe(200);
    expect(r.isResident).toBe(true);
    expect(r.isFlipYear).toBe(true);
    expect(r.form).toBe("1040");
  });

  it("applies the 1/3 and 1/6 weights once all three years count", () => {
    const r = runSubstantialPresenceTest({
      visa: "f1",
      firstArrivalYear: 2018,
      taxYear: 2026,
      daysCurrentYear: 120,
      daysPriorYear: 120,
      daysSecondPriorYear: 120,
    });
    // 120 + 40 + 20 = 180 — just under the threshold.
    expect(r.weightedDays).toBeCloseTo(180, 5);
    expect(r.isResident).toBe(false);
  });

  it("fails the test when under the 31-day current-year minimum", () => {
    const r = runSubstantialPresenceTest({
      visa: "f1",
      firstArrivalYear: 2015,
      taxYear: 2026,
      daysCurrentYear: 20,
      daysPriorYear: 365,
      daysSecondPriorYear: 365,
    });
    expect(r.weightedDays).toBeGreaterThan(taxConstants.sptTotalDaysThreshold);
    expect(r.isResident).toBe(false);
    expect(r.verdict).toContain("31-day minimum");
  });

  it("gives J-1 scholars two exempt years, not five", () => {
    expect(exemptYearCount("j1-scholar")).toBe(2);
    expect(exemptYearCount("j1-student")).toBe(5);
    const r = runSubstantialPresenceTest({
      visa: "j1-scholar",
      firstArrivalYear: 2024,
      taxYear: 2026,
      daysCurrentYear: 300,
      daysPriorYear: 365,
      daysSecondPriorYear: 365,
    });
    expect(r.firstCountingYear).toBe(2026);
    expect(r.isResident).toBe(true);
  });

  it("requires Form 8843 exactly while the student is an exempt individual", () => {
    const exempt = runSubstantialPresenceTest({
      visa: "f1",
      firstArrivalYear: 2025,
      taxYear: 2026,
      daysCurrentYear: 365,
      daysPriorYear: 100,
      daysSecondPriorYear: 0,
    });
    expect(exempt.form8843Required).toBe(true);
  });
});

describe("FICA refund", () => {
  it("computes 7.65% split into its two components", () => {
    const r = estimateFicaRefund({
      wages: 50000,
      wasNonresident: true,
      employerWithheld: true,
    });
    expect(r.refundable).toBe(true);
    expect(r.socialSecurity).toBeCloseTo(3100, 2);
    expect(r.medicare).toBeCloseTo(725, 2);
    expect(r.amount).toBeCloseTo(3825, 2);
    expect(r.basis).toBe("estimated");
  });

  it("prefers the exact W-2 figure when supplied", () => {
    const r = estimateFicaRefund({
      wages: 50000,
      wasNonresident: true,
      employerWithheld: true,
      actualWithheldAmount: 3810.5,
    });
    expect(r.amount).toBe(3810.5);
    expect(r.basis).toBe("w2");
  });

  it("returns nothing recoverable for a resident alien", () => {
    const r = estimateFicaRefund({
      wages: 50000,
      wasNonresident: false,
      employerWithheld: true,
    });
    expect(r.refundable).toBe(false);
    expect(r.amount).toBe(0);
  });

  it("puts the employer request before Form 843 in the recovery steps", () => {
    const r = estimateFicaRefund({
      wages: 40000,
      wasNonresident: true,
      employerWithheld: true,
    });
    const employerStep = r.steps.findIndex((s) => s.includes("employer"));
    const form843Step = r.steps.findIndex((s) => s.includes("843"));
    expect(employerStep).toBeGreaterThanOrEqual(0);
    expect(form843Step).toBeGreaterThan(employerStep);
  });
});

describe("nonresident refund estimate", () => {
  it("applies the India treaty standard deduction", () => {
    const r = estimateNonresidentRefund({
      taxYear: 2026,
      wages: 40000,
      federalWithheld: 4000,
      claimIndiaTreaty: true,
    });
    expect(r.standardDeduction).toBe(taxConstants.standardDeductionSingle[2026]);
    expect(r.treatyApplied).toBe(true);
    expect(r.taxableIncome).toBe(40000 - 16100);
  });

  it("gives no standard deduction to a nonresident without the treaty", () => {
    const r = estimateNonresidentRefund({
      taxYear: 2026,
      wages: 40000,
      federalWithheld: 4000,
      claimIndiaTreaty: false,
    });
    expect(r.standardDeduction).toBe(0);
    expect(r.taxableIncome).toBe(40000);
    expect(r.caveats[0]).toContain("No standard deduction");
  });

  it("makes the treaty worth strictly more than not claiming it", () => {
    const base = { taxYear: 2026, wages: 40000, federalWithheld: 4000 };
    const withTreaty = estimateNonresidentRefund({ ...base, claimIndiaTreaty: true });
    const without = estimateNonresidentRefund({ ...base, claimIndiaTreaty: false });
    expect(withTreaty.net).toBeGreaterThan(without.net);
    expect(withTreaty.estimatedTax).toBeLessThan(without.estimatedTax);
  });

  it("uses the correct standard deduction per tax year", () => {
    const y2025 = estimateNonresidentRefund({
      taxYear: 2025,
      wages: 40000,
      federalWithheld: 4000,
      claimIndiaTreaty: true,
    });
    expect(y2025.standardDeduction).toBe(15750);
  });

  it("reports a balance owed when withholding falls short", () => {
    const r = estimateNonresidentRefund({
      taxYear: 2026,
      wages: 60000,
      federalWithheld: 100,
      claimIndiaTreaty: true,
    });
    expect(r.isRefund).toBe(false);
    expect(r.net).toBeLessThan(0);
  });

  it("charges no tax when the deduction covers all income", () => {
    const r = estimateNonresidentRefund({
      taxYear: 2026,
      wages: 9000,
      federalWithheld: 700,
      claimIndiaTreaty: true,
    });
    expect(r.taxableIncome).toBe(0);
    expect(r.estimatedTax).toBe(0);
    expect(r.net).toBe(700);
  });

  it("always warns that state tax does not follow the treaty", () => {
    const r = estimateNonresidentRefund({
      taxYear: 2026,
      wages: 40000,
      federalWithheld: 4000,
      claimIndiaTreaty: true,
    });
    expect(r.caveats.some((c) => c.includes("state"))).toBe(true);
  });
});

describe("progressive tax", () => {
  it("stays inside the first bracket for small amounts", () => {
    expect(progressiveTax(10000, 2026)).toBeCloseTo(1000, 2);
  });

  it("spans brackets correctly", () => {
    // 2026: 12,400 @ 10% = 1,240; remaining 7,600 @ 12% = 912.
    expect(progressiveTax(20000, 2026)).toBeCloseTo(2152, 2);
  });

  it("is zero or negative-safe", () => {
    expect(progressiveTax(0, 2026)).toBe(0);
    expect(progressiveTax(-500, 2026)).toBe(0);
  });

  it("falls back to the latest published year for an unknown year", () => {
    expect(progressiveTax(20000, 1999)).toBeCloseTo(
      progressiveTax(20000, taxConstants.latestPublishedTaxYear),
      2
    );
  });
});

describe("resident filers get the ordinary standard deduction", () => {
  // Regression: the calculator passed claimIndiaTreaty=false for residents and
  // never passed isResident, so a resident's deduction fell to zero and the
  // estimate overstated their tax by thousands of dollars.
  it("deducts the published standard deduction for a resident", () => {
    const r = estimateNonresidentRefund({
      taxYear: 2026,
      wages: 60000,
      federalWithheld: 8000,
      claimIndiaTreaty: false,
      isResident: true,
    });
    expect(r.standardDeduction).toBe(taxConstants.standardDeductionSingle[2026]);
    expect(r.taxableIncome).toBe(60000 - taxConstants.standardDeductionSingle[2026]);
    expect(r.treatyApplied).toBe(false);
  });

  it("still gives a nonresident with no treaty nothing", () => {
    const r = estimateNonresidentRefund({
      taxYear: 2026,
      wages: 60000,
      federalWithheld: 8000,
      claimIndiaTreaty: false,
      isResident: false,
    });
    expect(r.standardDeduction).toBe(0);
  });

  it("taxes a resident less than an unrelieved nonresident on the same wage", () => {
    const base = { taxYear: 2026, wages: 60000, federalWithheld: 8000 };
    const resident = estimateNonresidentRefund({
      ...base,
      claimIndiaTreaty: false,
      isResident: true,
    });
    const nonresident = estimateNonresidentRefund({
      ...base,
      claimIndiaTreaty: false,
      isResident: false,
    });
    expect(resident.estimatedTax).toBeLessThan(nonresident.estimatedTax);
  });
});

describe("the bracket ladder is complete", () => {
  // Truncating at 32% understated tax for high earners and, more importantly,
  // made the on-page treaty comparison disagree with the calculator.
  it("applies 35% and 37% at the top", () => {
    const justUnder = progressiveTax(256_225, 2026);
    const wayOver = progressiveTax(700_000, 2026);
    const marginal = (wayOver - progressiveTax(699_000, 2026)) / 1000;
    expect(marginal).toBeCloseTo(0.37, 2);
    expect(wayOver).toBeGreaterThan(justUnder);
  });

  it("matches hand-computed 2026 tax at the treaty comparison points", () => {
    // 10% to 12,400 then 12% — the figures printed on the calculator page.
    expect(progressiveTax(20_000, 2026)).toBeCloseTo(2152, 2);
    expect(progressiveTax(3_900, 2026)).toBeCloseTo(390, 2);
    expect(progressiveTax(35_000, 2026)).toBeCloseTo(3952, 2);
    expect(progressiveTax(50_000, 2026)).toBeCloseTo(5752, 2);
  });
});
