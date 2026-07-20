import { describe, expect, it } from "vitest";
import { calculateTcs, TCS_THRESHOLD_INR, type TcsInputs } from "./remittanceTcs";

const base: TcsInputs = {
  remitterStatus: "resident",
  purpose: "family",
  priorRemittedInrFY: 0,
  currentRemittanceInr: 500_000,
};

const run = (over: Partial<TcsInputs> = {}) => calculateTcs({ ...base, ...over });

describe("₹10 lakh aggregate threshold — boundary cases", () => {
  it("below the threshold: no TCS", () => {
    const r = run({ currentRemittanceInr: 900_000 });
    expect(r.taxableBase).toBe(0);
    expect(r.tcs).toBe(0);
  });

  it("exactly at the threshold: no TCS", () => {
    const r = run({ currentRemittanceInr: TCS_THRESHOLD_INR });
    expect(r.taxableBase).toBe(0);
    expect(r.tcs).toBe(0);
  });

  it("just above the threshold: TCS only on the excess", () => {
    const r = run({ currentRemittanceInr: 1_000_001 });
    expect(r.taxableBase).toBe(1);
    expect(r.tcs).toBeCloseTo(0.2, 4);
  });

  it("well above: 20% on the amount over ₹10L", () => {
    const r = run({ currentRemittanceInr: 1_500_000 });
    expect(r.taxableBase).toBe(500_000);
    expect(r.tcs).toBe(100_000);
  });
});

describe("prior remittances consume the threshold", () => {
  it("prior below threshold, current straddles it", () => {
    // prior 600k + current 600k = 1.2M; 200k over threshold
    const r = run({ priorRemittedInrFY: 600_000, currentRemittanceInr: 600_000 });
    expect(r.taxableBase).toBe(200_000);
    expect(r.tcs).toBe(40_000);
  });

  it("prior already exhausted the threshold: whole current is taxable", () => {
    const r = run({ priorRemittedInrFY: 1_200_000, currentRemittanceInr: 300_000 });
    expect(r.taxableBase).toBe(300_000);
    expect(r.tcs).toBe(60_000);
  });

  it("prior + current still under threshold: nothing taxable", () => {
    const r = run({ priorRemittedInrFY: 400_000, currentRemittanceInr: 500_000 });
    expect(r.taxableBase).toBe(0);
    expect(r.tcs).toBe(0);
  });

  it("prior exactly at threshold: current fully taxable", () => {
    const r = run({ priorRemittedInrFY: 1_000_000, currentRemittanceInr: 200_000 });
    expect(r.taxableBase).toBe(200_000);
  });
});

describe("education-loan remittances are exempt", () => {
  it("charges no TCS even far above the threshold", () => {
    const r = run({ purpose: "education_loan", currentRemittanceInr: 5_000_000 });
    expect(r.rate).toBe(0);
    expect(r.tcs).toBe(0);
    expect(r.rateVerified).toBe(true);
  });

  it("is not the old 0.5% rate", () => {
    const r = run({ purpose: "education_loan", currentRemittanceInr: 5_000_000 });
    // 0.5% of 4,000,000 over threshold would be 20,000 — must NOT happen.
    expect(r.tcs).not.toBe(20_000);
  });
});

describe("education not via loan / medical carry unverified rates", () => {
  it("applies 5% above threshold but flags it unverified", () => {
    const r = run({ purpose: "education_self", currentRemittanceInr: 1_500_000 });
    expect(r.rate).toBe(0.05);
    expect(r.taxableBase).toBe(500_000);
    expect(r.tcs).toBe(25_000);
    expect(r.rateVerified).toBe(false);
    expect(r.rateNote).toBeTruthy();
  });

  it("medical is the same shape", () => {
    const r = run({ purpose: "medical", currentRemittanceInr: 1_500_000 });
    expect(r.rate).toBe(0.05);
    expect(r.rateVerified).toBe(false);
  });
});

describe("NRI status stops the LRS calculation", () => {
  it("does not compute LRS TCS for an NRI", () => {
    const r = run({ remitterStatus: "nri", currentRemittanceInr: 5_000_000 });
    expect(r.lrsApplies).toBe(false);
    expect(r.tcs).toBe(0);
    expect(r.notApplicableReason).toContain("resident individuals only");
    expect(r.notApplicableReason).toContain("NRO");
  });

  it("computes normally for a resident", () => {
    expect(run({ remitterStatus: "resident" }).lrsApplies).toBe(true);
  });
});

describe("step-by-step output", () => {
  it("shows the threshold, the excess, the rate and the TCS", () => {
    const r = run({ currentRemittanceInr: 1_500_000 });
    const labels = r.steps.map((s) => s.label.toLowerCase()).join(" | ");
    expect(labels).toContain("threshold");
    expect(labels).toContain("above the threshold");
    expect(labels).toContain("tcs collected");
  });

  it("emits no steps for an NRI (no LRS calc)", () => {
    expect(run({ remitterStatus: "nri" }).steps).toHaveLength(0);
  });
});

describe("validation-safe", () => {
  it("treats negative prior/current as zero and never goes negative", () => {
    const r = run({ priorRemittedInrFY: -100, currentRemittanceInr: -100 });
    expect(r.tcs).toBe(0);
    expect(r.taxableBase).toBe(0);
    expect(Number.isFinite(r.tcs)).toBe(true);
  });
});
