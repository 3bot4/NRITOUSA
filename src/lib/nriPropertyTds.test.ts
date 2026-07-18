/**
 * Tests for the educational NRI property TDS estimator: long-term vs
 * short-term classification, known-income vs unknown-income (range) paths,
 * certificate math, joint-ownership shares, regime-date handling, and input
 * validation (empty, boundary, huge, and invalid-date cases).
 */
import { describe, expect, it } from "vitest";
import { estimateNriPropertyTds, type TdsEstimatorInput } from "@/lib/nriPropertyTds";
import { nriTdsConfig as cfg } from "@/data/nriPropertySaleTdsData";

const base: TdsEstimatorInput = {
  saleConsideration: 20_000_000, // ₹2 crore
  ownershipPct: 100,
  sellerType: "individual",
  purchaseDate: "2015-06-01",
  saleDate: "2026-06-01",
  purchaseCost: 12_000_000,
  improvementCost: 0,
  transferExpenses: 500_000,
  exemption54: 0,
  exemption54EC: 0,
  hasCertificate: false,
  certificateRatePct: 0,
  otherIncomeKnown: false,
  otherIncomeInr: 0,
  panAvailable: true,
};

describe("estimateNriPropertyTds", () => {
  it("classifies >24 months as long-term and computes the gain", () => {
    const r = estimateNriPropertyTds(base);
    expect(r.valid).toBe(true);
    expect(r.isLongTerm).toBe(true);
    expect(r.newRegime).toBe(true);
    expect(r.estimatedGain).toBe(7_500_000); // 2cr − 1.2cr − 5L
  });

  it("returns a final-tax RANGE when aggregate income is unknown", () => {
    const r = estimateNriPropertyTds(base);
    const baseTax = (7_500_000 * cfg.ltcgBasePct) / 100;
    expect(r.finalTax.low).toBe(Math.round(baseTax * 1.04));
    expect(r.finalTax.high).toBe(Math.round(baseTax * 1.15 * 1.04));
    expect(r.finalTax.high).toBeGreaterThan(r.finalTax.low);
  });

  it("returns a point final tax when income is known (surcharge from aggregate income)", () => {
    const r = estimateNriPropertyTds({ ...base, otherIncomeKnown: true, otherIncomeInr: 0 });
    // aggregate = 75L → 10% surcharge slab
    const expected = Math.round(((7_500_000 * cfg.ltcgBasePct) / 100) * 1.1 * 1.04);
    expect(r.finalTax.low).toBe(expected);
    expect(r.finalTax.high).toBe(expected);
  });

  it("computes illustrative withholding on the gross share (payment-size surcharge assumption)", () => {
    const r = estimateNriPropertyTds(base);
    // ₹2cr payment → 15% assumed surcharge; 12.5% × 1.15 × 1.04 ≈ 14.95%
    const expected = Math.round(((20_000_000 * cfg.ltcgBasePct) / 100) * 1.15 * 1.04);
    expect(r.withholdingNoCert).toBe(expected);
    expect(r.assumptions.join(" ")).toMatch(/ILLUSTRATION/);
  });

  it("uses the certificate rate when one exists and shows potential excess", () => {
    const r = estimateNriPropertyTds({ ...base, hasCertificate: true, certificateRatePct: 5 });
    expect(r.withholdingWithCert).toBe(1_000_000); // 5% of 2cr
    expect(r.potentialExcess.high).toBe(Math.max(0, 1_000_000 - r.finalTax.low));
  });

  it("splits by ownership share for joint sellers", () => {
    const r = estimateNriPropertyTds({ ...base, ownershipPct: 50 });
    expect(r.shareConsideration).toBe(10_000_000);
    expect(r.estimatedGain).toBe(3_750_000);
    expect(r.assumptions.join(" ")).toMatch(/each seller/i);
  });

  it("treats ≤24 months as short-term with a planning band", () => {
    const r = estimateNriPropertyTds({ ...base, purchaseDate: "2025-01-01", saleDate: "2026-06-01" });
    expect(r.isLongTerm).toBe(false);
    expect(r.finalTax.high).toBeGreaterThan(r.finalTax.low);
    expect(r.assumptions.join(" ")).toMatch(/slab/i);
  });

  it("is exactly long-term only ABOVE 24 months (boundary)", () => {
    const at24 = estimateNriPropertyTds({ ...base, purchaseDate: "2024-06-01", saleDate: "2026-06-01" });
    expect(at24.holdingMonths).toBe(24);
    expect(at24.isLongTerm).toBe(false);
    const over = estimateNriPropertyTds({ ...base, purchaseDate: "2024-05-01", saleDate: "2026-06-01" });
    expect(over.holdingMonths).toBe(25);
    expect(over.isLongTerm).toBe(true);
  });

  it("flags pre-23-Jul-2024 sales as outside the 12.5% regime", () => {
    const r = estimateNriPropertyTds({ ...base, purchaseDate: "2010-01-01", saleDate: "2024-06-01" });
    expect(r.newRegime).toBe(false);
    expect(r.assumptions.join(" ")).toMatch(/before July 23, 2024/);
  });

  it("rejects invalid dates and empty inputs with messages, without NaN", () => {
    const bad = estimateNriPropertyTds({ ...base, saleConsideration: 0, purchaseDate: "not-a-date" });
    expect(bad.valid).toBe(false);
    expect(bad.errors.length).toBeGreaterThanOrEqual(2);
    expect(Number.isFinite(bad.withholdingNoCert)).toBe(true);
    const reversed = estimateNriPropertyTds({ ...base, purchaseDate: "2027-01-01" });
    expect(reversed.valid).toBe(false);
  });

  it("survives very large values and clamps exemptions to a non-negative gain", () => {
    const big = estimateNriPropertyTds({ ...base, saleConsideration: 1e12, purchaseCost: 0, transferExpenses: 0 });
    expect(Number.isFinite(big.withholdingNoCert)).toBe(true);
    const exempt = estimateNriPropertyTds({ ...base, exemption54: 1e9 });
    expect(exempt.estimatedGain).toBe(0);
    expect(exempt.finalTax.high).toBe(0);
  });

  it("adds professional-review notes for non-individual sellers and missing PAN", () => {
    const r = estimateNriPropertyTds({ ...base, sellerType: "company", panAvailable: false });
    const text = r.assumptions.join(" ");
    expect(text).toMatch(/Non-individual/);
    expect(text).toMatch(/PAN/);
  });
});
