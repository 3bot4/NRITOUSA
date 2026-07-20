import { describe, expect, it } from "vitest";
import { calculateDtaa, type DtaaRawInputs } from "./dtaaFtc";

const base: DtaaRawInputs = {
  income: "10000",
  indiaTax: "2000",
  usRate: "24",
  basket: "passive",
};

const run = (over: Partial<DtaaRawInputs> = {}) =>
  calculateDtaa({ ...base, ...over });

describe("screening estimate", () => {
  it("credits Indian tax up to the simplified limitation", () => {
    const r = run();
    expect(r.simplifiedUsLimitation).toBe(2400);
    expect(r.screeningCredit).toBe(2000);
    expect(r.residualUsTax).toBe(400);
    expect(r.exceedsLimitation).toBe(false);
  });

  it("compares total tax with and without the credit", () => {
    const r = run();
    expect(r.totalTaxWithoutCredit).toBe(4400);
    expect(r.totalTaxWithCredit).toBe(2400);
    expect(r.effectiveRateWithCredit).toBeCloseTo(24, 6);
  });
});

describe("foreign tax exceeding the simplified US limitation", () => {
  it("caps the credit at the limitation and reports the excess", () => {
    const r = run({ indiaTax: "3000" });
    expect(r.simplifiedUsLimitation).toBe(2400);
    expect(r.screeningCredit).toBe(2400);
    expect(r.excessAboveLimitation).toBe(600);
    expect(r.exceedsLimitation).toBe(true);
    expect(r.residualUsTax).toBe(0);
  });

  it("never lets the credit exceed the limitation", () => {
    for (const tax of ["2400", "5000", "9000"]) {
      const r = run({ indiaTax: tax });
      expect(r.screeningCredit).toBeLessThanOrEqual(r.simplifiedUsLimitation);
    }
  });

  it("handles the exact boundary where tax equals the limitation", () => {
    const r = run({ indiaTax: "2400" });
    expect(r.screeningCredit).toBe(2400);
    expect(r.excessAboveLimitation).toBe(0);
    expect(r.residualUsTax).toBe(0);
    expect(r.exceedsLimitation).toBe(false);
  });

  it("caps at zero limitation when the US bracket is 0%", () => {
    const r = run({ usRate: "0" });
    expect(r.simplifiedUsLimitation).toBe(0);
    expect(r.screeningCredit).toBe(0);
    expect(r.excessAboveLimitation).toBe(2000);
  });
});

describe("implausible foreign tax is flagged, not silently accepted", () => {
  it("warns when Indian tax exceeds the income", () => {
    const r = run({ indiaTax: "12000" });
    expect(r.warnings.join(" ")).toContain("larger than the income");
  });

  it("warns at an implausibly high effective foreign rate", () => {
    const r = run({ indiaTax: "7000" }); // 70%
    expect(r.warnings.join(" ")).toContain("unusually high");
  });

  it("does not warn at a normal effective rate", () => {
    expect(run({ indiaTax: "3000" }).warnings).toHaveLength(0);
  });
});

describe("assumptions are disclosed", () => {
  const r = run();

  it("states that it multiplies income by the marginal bracket", () => {
    expect(r.assumptions.join(" ")).toContain("single marginal bracket");
  });

  it("states that the real limitation is a whole-return ratio", () => {
    expect(r.assumptions.join(" ")).toContain("worldwide taxable income");
  });

  it("mentions baskets, source rules, timing, currency and carryovers", () => {
    const all = r.assumptions.join(" ").toLowerCase();
    for (const topic of [
      "basket",
      "source rules",
      "timing",
      "currency",
      "carried back",
      "state taxes",
      "resourcing",
    ]) {
      expect(all).toContain(topic);
    }
  });
});

describe("validation", () => {
  it("rejects negative income and negative tax", () => {
    expect(run({ income: "-1" }).ok).toBe(false);
    expect(run({ indiaTax: "-1" }).ok).toBe(false);
  });

  it("rejects a bracket above 100%", () => {
    expect(run({ usRate: "101" }).ok).toBe(false);
  });

  it("rejects invalid text and empty values", () => {
    expect(run({ income: "abc" }).ok).toBe(false);
    expect(run({ income: "" }).ok).toBe(false);
  });

  it("handles zero income without dividing by zero", () => {
    const r = run({ income: "0", indiaTax: "0" });
    expect(r.ok).toBe(true);
    expect(r.effectiveRateWithCredit).toBe(0);
    expect(Number.isFinite(r.effectiveRateWithoutCredit)).toBe(true);
  });

  it("never emits NaN", () => {
    const r = run({ income: "abc", indiaTax: "-5", usRate: "999" });
    for (const [key, v] of Object.entries(r)) {
      if (typeof v === "number") {
        expect(Number.isFinite(v), `${key} was ${v}`).toBe(true);
      }
    }
  });
});
