import { describe, expect, it } from "vitest";
import { calculateProperty, monthsBetween, type PropertyRawInputs } from "./indiaPropertyGains";
import { REPATRIATION_LIMIT_USD, SEC_54EC_CAP } from "./indiaPropertyRates";

const base: PropertyRawInputs = {
  purchasePrice: "5000000",
  salePrice: "12000000",
  sellingExpenses: "0",
  improvementCosts: "0",
  sec54Exemption: "0",
  sec54ec: "0",
  stcgSlabRate: "",
  approvedTdsRate: "",
  fxRate: "86",
  alreadyRepatriated: "0",
  termMode: "long",
  acquisitionDate: "",
  saleDate: "",
  hasLowerTdsCertificate: false,
  isInherited: false,
};

const run = (over: Partial<PropertyRawInputs> = {}) =>
  calculateProperty({ ...base, ...over });

describe("long-term gain", () => {
  const r = run();

  it("computes the gain from the adjusted cost base", () => {
    expect(r.capitalGain).toBe(7_000_000);
    expect(r.taxableGain).toBe(7_000_000);
    expect(r.isLongTerm).toBe(true);
  });

  it("taxes the gain at 12.5% plus surcharge and cess", () => {
    expect(r.baseTax).toBe(875_000); // 7,000,000 x 12.5%
    expect(r.surcharge).toBeCloseTo(87_500, 2); // 10% band
    expect(r.cess).toBeCloseTo((875_000 + 87_500) * 0.04, 2);
    expect(r.finalTaxLiability).toBeCloseTo(875_000 + 87_500 + 38_500, 2);
  });

  it("deducts selling expenses and improvements from the gain", () => {
    const withCosts = run({ sellingExpenses: "200000", improvementCosts: "300000" });
    expect(withCosts.adjustedCostBase).toBe(5_500_000);
    expect(withCosts.capitalGain).toBe(6_500_000);
  });
});

describe("TDS is a separate calculation from final tax", () => {
  it("withholds on gross consideration, not on the gain", () => {
    const r = run();
    // TDS base is 12,000,000 (the sale price), not 7,000,000 (the gain).
    expect(r.tdsBasis).toBe("gross-consideration");
    expect(r.estimatedTds).toBeGreaterThan(r.finalTaxLiability);
    expect(r.estimatedTds).toBeCloseTo(12_000_000 * 0.125 * 1.15 * 1.04, 2);
  });

  it("produces a refund position when TDS exceeds the final liability", () => {
    const r = run();
    expect(r.excessTdsRefundable).toBeGreaterThan(0);
    expect(r.excessTdsRefundable).toBeCloseTo(r.estimatedTds - r.finalTaxLiability, 2);
  });

  it("still withholds TDS on a sale at a loss, where tax is zero", () => {
    // The clearest proof that TDS and final tax are not the same number.
    const r = run({ purchasePrice: "15000000", salePrice: "12000000" });
    expect(r.isCapitalLoss).toBe(true);
    expect(r.capitalGain).toBe(-3_000_000);
    expect(r.taxableGain).toBe(0);
    expect(r.finalTaxLiability).toBe(0);
    expect(r.estimatedTds).toBeGreaterThan(0);
    expect(r.excessTdsRefundable).toBe(r.estimatedTds);
    expect(r.warnings.join(" ")).toContain("still required to withhold");
  });

  it("charges no tax when the sale price equals the adjusted cost", () => {
    const r = run({ purchasePrice: "12000000", salePrice: "12000000" });
    expect(r.capitalGain).toBe(0);
    expect(r.taxableGain).toBe(0);
    expect(r.finalTaxLiability).toBe(0);
    expect(r.estimatedTds).toBeGreaterThan(0);
  });
});

describe("short-term gain", () => {
  it("refuses to invent a liability without a slab rate", () => {
    const r = run({ termMode: "short" });
    expect(r.taxCalculable).toBe(false);
    expect(r.baseTax).toBe(0);
    expect(r.finalTaxLiability).toBe(0);
    expect(r.needsMoreInfo.join(" ")).toContain("applicable slab rate");
  });

  it("never applies a blanket 30% rate to the seller's liability", () => {
    const r = run({ termMode: "short", stcgSlabRate: "20" });
    expect(r.baseTax).toBe(7_000_000 * 0.2);
    expect(r.baseTax).not.toBe(7_000_000 * 0.3);
  });

  it("uses the slab rate supplied by the user", () => {
    const r = run({ termMode: "short", stcgSlabRate: "5" });
    expect(r.taxCalculable).toBe(true);
    expect(r.baseTax).toBe(350_000);
  });

  it("labels the 30% short-term withholding as a convention, not a tax rate", () => {
    const r = run({ termMode: "short", stcgSlabRate: "20" });
    expect(r.warnings.join(" ")).toContain("withholding convention, not your tax rate");
  });

  it("ignores Section 54EC on a short-term sale and says so", () => {
    const r = run({ termMode: "short", stcgSlabRate: "20", sec54ec: "1000000" });
    expect(r.exemptionUsed).toBe(0);
    expect(r.warnings.join(" ")).toContain("long-term gains only");
  });
});

describe("Section 54EC", () => {
  it("applies the maximum permitted investment", () => {
    const r = run({ sec54ec: String(SEC_54EC_CAP) });
    expect(r.exemptionUsed).toBe(SEC_54EC_CAP);
    expect(r.taxableGain).toBe(7_000_000 - SEC_54EC_CAP);
  });

  it("rejects an investment above the statutory cap", () => {
    const r = run({ sec54ec: "6000000" });
    expect(r.ok).toBe(false);
    expect(r.errors.sec54ec).toContain("cannot be more than");
  });

  it("rejects an exemption larger than the eligible gain", () => {
    const r = run({ purchasePrice: "11000000", sec54ec: "5000000" });
    // Gain is only 1,000,000 here.
    expect(r.ok).toBe(false);
    expect(r.errors.sec54ec).toContain("cannot exceed the capital gain");
  });

  it("rejects a negative investment", () => {
    expect(run({ sec54ec: "-1" }).ok).toBe(false);
  });
});

describe("lower / nil TDS certificate", () => {
  it("uses the approved rate rather than the generic estimate", () => {
    const r = run({ hasLowerTdsCertificate: true, approvedTdsRate: "2" });
    expect(r.tdsBasis).toBe("certificate");
    expect(r.tdsRateApplied).toBe(0.02);
    expect(r.estimatedTds).toBe(12_000_000 * 0.02);
  });

  it("supports a nil certificate", () => {
    const r = run({ hasLowerTdsCertificate: true, approvedTdsRate: "0" });
    expect(r.estimatedTds).toBe(0);
    expect(r.immediateCashAfterTds).toBe(12_000_000);
  });

  it("withholds far more without a certificate than with one", () => {
    const withCert = run({ hasLowerTdsCertificate: true, approvedTdsRate: "2" });
    const without = run();
    expect(without.estimatedTds).toBeGreaterThan(withCert.estimatedTds);
  });

  it("rejects an approved rate above 100%", () => {
    const r = run({ hasLowerTdsCertificate: true, approvedTdsRate: "150" });
    expect(r.ok).toBe(false);
  });
});

describe("input validation", () => {
  it("rejects a negative purchase price — the live-site regression", () => {
    const r = run({ purchasePrice: "-1" });
    expect(r.ok).toBe(false);
    expect(r.errors.purchasePrice).toContain("cannot be less than 0");
  });

  it("rejects a negative sale price", () => {
    expect(run({ salePrice: "-1" }).ok).toBe(false);
  });

  it("rejects a zero exchange rate rather than dividing by zero", () => {
    const r = run({ fxRate: "0" });
    expect(r.ok).toBe(false);
    expect(Number.isFinite(r.estimatedRepatriableUsd)).toBe(true);
  });

  it("rejects negative expenses and improvements", () => {
    expect(run({ sellingExpenses: "-1" }).ok).toBe(false);
    expect(run({ improvementCosts: "-1" }).ok).toBe(false);
  });

  it("rejects a slab rate outside 0–100", () => {
    expect(run({ termMode: "short", stcgSlabRate: "-5" }).ok).toBe(false);
    expect(run({ termMode: "short", stcgSlabRate: "101" }).ok).toBe(false);
  });

  it("rejects a negative previously-repatriated amount", () => {
    expect(run({ alreadyRepatriated: "-1" }).ok).toBe(false);
  });

  it("rejects a previously-repatriated amount above the annual limit", () => {
    expect(run({ alreadyRepatriated: "1000001" }).ok).toBe(false);
  });

  it("rejects malformed and non-finite values", () => {
    expect(run({ salePrice: "abc" }).ok).toBe(false);
    expect(run({ salePrice: "Infinity" }).ok).toBe(false);
    expect(run({ salePrice: "" }).ok).toBe(false);
  });

  it("never emits NaN or Infinity in any output", () => {
    const r = run({ salePrice: "abc", fxRate: "0", purchasePrice: "-1" });
    for (const [key, v] of Object.entries(r)) {
      if (typeof v === "number") {
        expect(Number.isFinite(v), `${key} was ${v}`).toBe(true);
      }
    }
  });
});

describe("holding period from dates", () => {
  it("treats more than 24 months as long-term", () => {
    const r = run({
      termMode: "dates",
      acquisitionDate: "2020-01-01",
      saleDate: "2026-01-01",
    });
    expect(r.holdingMonths).toBe(72);
    expect(r.isLongTerm).toBe(true);
  });

  it("treats exactly 24 months as short-term", () => {
    const r = run({
      termMode: "dates",
      acquisitionDate: "2024-01-01",
      saleDate: "2026-01-01",
      stcgSlabRate: "30",
    });
    expect(r.holdingMonths).toBe(24);
    expect(r.isLongTerm).toBe(false);
  });

  it("rejects a sale date before the acquisition date", () => {
    const r = run({
      termMode: "dates",
      acquisitionDate: "2026-01-01",
      saleDate: "2020-01-01",
    });
    expect(r.ok).toBe(false);
    expect(r.errors.dates).toContain("on or after");
  });

  it("rejects malformed dates", () => {
    const r = run({ termMode: "dates", acquisitionDate: "not-a-date", saleDate: "2026-01-01" });
    expect(r.ok).toBe(false);
  });

  it("monthsBetween handles partial months", () => {
    expect(monthsBetween("2024-01-15", "2026-01-14")).toBe(23);
    expect(monthsBetween("2024-01-15", "2026-01-15")).toBe(24);
  });
});

describe("repatriation headroom", () => {
  it("caps the repatriable amount at the remaining headroom", () => {
    const r = run({ alreadyRepatriated: "900000" });
    expect(r.remainingHeadroomUsd).toBe(100_000);
    expect(r.estimatedRepatriableUsd).toBeLessThanOrEqual(100_000);
  });

  it("reports zero headroom once the annual limit is exhausted", () => {
    const r = run({ alreadyRepatriated: String(REPATRIATION_LIMIT_USD) });
    expect(r.remainingHeadroomUsd).toBe(0);
    expect(r.estimatedRepatriableUsd).toBe(0);
    expect(r.exceedsRepatriationLimit).toBe(true);
  });

  it("computes immediate cash from TDS, not from final tax", () => {
    const r = run();
    expect(r.immediateCashAfterTds).toBeCloseTo(12_000_000 - r.estimatedTds, 2);
    expect(r.netProceedsAfterFinalTax).toBeCloseTo(12_000_000 - r.finalTaxLiability, 2);
    expect(r.immediateCashAfterTds).not.toBe(r.netProceedsAfterFinalTax);
  });
});

describe("inherited property", () => {
  it("routes to a CA rather than assuming a fair-value basis", () => {
    const r = run({ isInherited: true });
    expect(r.needsMoreInfo.join(" ")).toContain("previous owner's cost");
    expect(r.needsMoreInfo.join(" ")).toContain("Indian CA");
  });
});

describe("surcharge", () => {
  it("caps long-term surcharge at 15%", () => {
    const r = run({ purchasePrice: "0", salePrice: "300000000" });
    // Gain is 30 crore, which falls in the 25% band, but LTCG caps at 15%.
    expect(r.surcharge / r.baseTax).toBeCloseTo(0.15, 6);
  });

  it("charges no surcharge below the first band", () => {
    const r = run({ purchasePrice: "1000000", salePrice: "3000000" });
    expect(r.surcharge).toBe(0);
  });

  it("flags that surcharge is estimated from the gain alone", () => {
    expect(run().warnings.join(" ")).toContain("total Indian income");
  });
});
