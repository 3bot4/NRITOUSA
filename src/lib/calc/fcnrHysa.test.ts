import { describe, expect, it } from "vitest";
import { runFcnrModel, type FcnrInputs } from "./fcnrHysa";

const base: FcnrInputs = {
  principal: 25_000,
  annualRate: 0.055,
  years: 5,
  compounding: "annual",
  indiaStatus: "nri",
  indiaRate: 0.3,
  usFederalRate: 0.24,
  stateRate: 0,
  indianSource: true,
};

const run = (over: Partial<FcnrInputs> = {}) => runFcnrModel({ ...base, ...over });

describe("reconciliation identity holds to the cent", () => {
  it("endingBalance = principal + grossInterest - tax - fees, every scenario", () => {
    const scenarios: Partial<FcnrInputs>[] = [
      {},
      { stateRate: 0.093 },
      { indiaStatus: "ror" },
      { compounding: "semiannual" },
      { compounding: "quarterly" },
      { annualRate: 0 },
      { usFederalRate: 0, stateRate: 0, indiaStatus: "nri" },
      { fee: 250 },
      { years: 1 },
      { years: 10, compounding: "quarterly", stateRate: 0.05, indiaStatus: "ror" },
    ];
    for (const s of scenarios) {
      const r = run(s);
      expect(r.reconciles, `did not reconcile for ${JSON.stringify(s)}`).toBe(true);
      const f = r.final;
      expect(f.endingBalance).toBeCloseTo(
        base.principal + f.cumulativeGrossInterest - f.cumulativeTax - (s.fee ?? 0),
        2,
      );
      expect(f.netGain).toBeCloseTo(f.endingBalance - base.principal, 2);
    }
  });
});

describe("gross interest is consistent with the maturity value", () => {
  it("compounds gross — grossInterest equals compounded balance minus principal", () => {
    const r = run({ stateRate: 0, usFederalRate: 0, indiaStatus: "nri" });
    // No tax, so ending balance is the pure compounded value.
    const expected = 25_000 * Math.pow(1.055, 5) - 25_000;
    expect(r.final.cumulativeGrossInterest).toBeCloseTo(expected, 1);
    expect(r.final.endingBalance).toBeCloseTo(25_000 * Math.pow(1.055, 5), 1);
  });

  it("does NOT use simple interest for gross (the old bug)", () => {
    const r = run({ stateRate: 0, usFederalRate: 0 });
    const simple = 25_000 * 0.055 * 5; // the wrong figure
    expect(r.final.cumulativeGrossInterest).not.toBeCloseTo(simple, 0);
    expect(r.final.cumulativeGrossInterest).toBeGreaterThan(simple);
  });
});

describe("Indian tax follows NRI / RNOR / ROR status", () => {
  it("is exempt from Indian tax while NRI", () => {
    expect(run({ indiaStatus: "nri" }).final.indianTaxBeforeFtc).toBe(0);
  });

  it("is exempt from Indian tax while RNOR", () => {
    expect(run({ indiaStatus: "rnor" }).final.indianTaxBeforeFtc).toBe(0);
  });

  it("applies Indian tax once ROR", () => {
    const r = run({ indiaStatus: "ror" });
    expect(r.final.indianTaxBeforeFtc).toBeGreaterThan(0);
  });

  it("never applies Indian tax to a non-Indian-source instrument (HYSA)", () => {
    const r = run({ indiaStatus: "ror", indianSource: false });
    expect(r.final.indianTaxBeforeFtc).toBe(0);
  });

  it("ROR pays more total tax than NRI at the same rates", () => {
    expect(run({ indiaStatus: "ror" }).final.cumulativeTax).toBeGreaterThan(
      run({ indiaStatus: "nri" }).final.cumulativeTax,
    );
  });
});

describe("federal + state tax", () => {
  it("adds state tax on top of federal", () => {
    const noState = run({ stateRate: 0 });
    const withState = run({ stateRate: 0.093 });
    expect(withState.final.stateTax).toBeGreaterThan(0);
    expect(withState.final.cumulativeTax).toBeGreaterThan(noState.final.cumulativeTax);
  });

  it("zero tax leaves the full compounded gain", () => {
    const r = run({ usFederalRate: 0, stateRate: 0, indiaStatus: "nri" });
    expect(r.final.cumulativeTax).toBe(0);
    expect(r.final.netGain).toBeCloseTo(r.final.cumulativeGrossInterest, 2);
  });
});

describe("compounding frequency", () => {
  it("produces one row per period", () => {
    expect(run({ compounding: "annual", years: 5 }).rows).toHaveLength(5);
    expect(run({ compounding: "semiannual", years: 5 }).rows).toHaveLength(10);
    expect(run({ compounding: "quarterly", years: 5 }).rows).toHaveLength(20);
  });

  it("higher frequency yields slightly more gross interest at the same rate", () => {
    const a = run({ compounding: "annual", usFederalRate: 0, stateRate: 0 });
    const q = run({ compounding: "quarterly", usFederalRate: 0, stateRate: 0 });
    expect(q.final.cumulativeGrossInterest).toBeGreaterThan(a.final.cumulativeGrossInterest);
  });
});

describe("edge cases", () => {
  it("zero interest earns nothing and reconciles", () => {
    const r = run({ annualRate: 0 });
    expect(r.final.cumulativeGrossInterest).toBe(0);
    expect(r.final.netGain).toBe(0);
    expect(r.reconciles).toBe(true);
  });

  it("a fee reduces the ending balance and never produces NaN", () => {
    const r = run({ fee: 500 });
    expect(r.final.endingBalance).toBeLessThan(run({ fee: 0 }).final.endingBalance);
    for (const row of r.rows) {
      expect(Number.isFinite(row.endingBalance)).toBe(true);
    }
  });

  it("never emits a non-finite value in any row", () => {
    const r = run({ years: 10, compounding: "quarterly", indiaStatus: "ror", stateRate: 0.1 });
    for (const row of r.rows) {
      for (const [k, v] of Object.entries(row)) {
        if (typeof v === "number") expect(Number.isFinite(v), `${k}=${v}`).toBe(true);
      }
    }
  });
});

describe("ROR foreign tax credit — separate values, lower-of, no double-add", () => {
  const ror = (over: Partial<FcnrInputs> = {}) =>
    run({ indiaStatus: "ror", indiaRate: 0.3, usFederalRate: 0.24, stateRate: 0.05, ...over });

  it("FTC is zero when not modeled (default)", () => {
    const r = ror({ ftcTreatment: "not_modeled" });
    expect(r.final.foreignTaxCredit).toBe(0);
    // combined = fed + state + indian, all separate and additive here.
    expect(r.final.cumulativeTax).toBeCloseTo(
      r.final.usFederalTax + r.final.stateTax + r.final.indianTaxBeforeFtc,
      2,
    );
  });

  it("estimate credits the lower of Indian tax and US federal tax", () => {
    const r = ror({ ftcTreatment: "estimate" });
    // Indian 30% > US federal 24%, so FTC is capped at the US federal tax.
    expect(r.final.foreignTaxCredit).toBeCloseTo(r.final.usFederalTax, 2);
    expect(r.final.foreignTaxCredit).toBeLessThanOrEqual(r.final.indianTaxBeforeFtc);
  });

  it("does NOT simply add full Indian + full US when FTC is estimated", () => {
    const notModeled = ror({ ftcTreatment: "not_modeled" });
    const estimate = ror({ ftcTreatment: "estimate" });
    expect(estimate.final.cumulativeTax).toBeLessThan(notModeled.final.cumulativeTax);
  });

  it("combined net tax = fed + state + indian − FTC, and reconciles", () => {
    const r = ror({ ftcTreatment: "estimate" });
    expect(r.final.cumulativeTax).toBeCloseTo(
      r.final.usFederalTax + r.final.stateTax + r.final.indianTaxBeforeFtc - r.final.foreignTaxCredit,
      2,
    );
    expect(r.reconciles).toBe(true);
  });

  it("keeps US and Indian tax as separate fields (never merged)", () => {
    const r = ror({ ftcTreatment: "not_modeled" });
    expect(r.final.usFederalTax).toBeGreaterThan(0);
    expect(r.final.indianTaxBeforeFtc).toBeGreaterThan(0);
    // The Indian figure is not folded into the US figure.
    expect(r.final.usFederalTax).not.toBeCloseTo(
      r.final.usFederalTax + r.final.indianTaxBeforeFtc,
      2,
    );
  });

  it("FTC never exceeds Indian tax, so combined tax is never negative", () => {
    const r = ror({ ftcTreatment: "estimate", usFederalRate: 0.9, indiaRate: 0.1 });
    expect(r.final.foreignTaxCredit).toBeLessThanOrEqual(r.final.indianTaxBeforeFtc);
    expect(r.final.cumulativeTax).toBeGreaterThanOrEqual(0);
  });

  it("NRI/RNOR carry no Indian tax and no FTC regardless of treatment", () => {
    for (const st of ["nri", "rnor"] as const) {
      const r = run({ indiaStatus: st, ftcTreatment: "estimate", indiaRate: 0.3 });
      expect(r.final.indianTaxBeforeFtc).toBe(0);
      expect(r.final.foreignTaxCredit).toBe(0);
    }
  });
})
