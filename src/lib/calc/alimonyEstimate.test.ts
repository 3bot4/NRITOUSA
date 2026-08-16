import { describe, expect, it } from "vitest";
import {
  estimateAlimony,
  NET_OF_TAX_SHARE,
  NY_INCOME_CAP_USD,
  TX_MONTHLY_CAP_USD,
  TX_MIN_YEARS_MARRIED,
  INDIA_BENCHMARK_SHARE,
  type AlimonyInputs,
} from "./alimonyEstimate";

const FX = 96.27;

const base: AlimonyInputs = {
  higherGrossAnnualUsd: 180_000,
  lowerGrossAnnualUsd: 0,
  yearsMarried: 9,
  jurisdiction: "AAML",
  payorPaysChildSupport: false,
  usdInr: FX,
};

const run = (over: Partial<AlimonyInputs> = {}) => estimateAlimony({ ...base, ...over });

describe("California — Santa Clara temporary-support guideline", () => {
  it("applies 40% of the higher NET income minus 50% of the lower NET income", () => {
    const r = run({ jurisdiction: "CA", higherGrossAnnualUsd: 180_000, lowerGrossAnnualUsd: 60_000 });
    const hiNet = (180_000 / 12) * NET_OF_TAX_SHARE;
    const loNet = (60_000 / 12) * NET_OF_TAX_SHARE;
    expect(r.usMonthlyUsd).toBe(Math.round(0.4 * hiNet - 0.5 * loNet));
  });

  it("uses net, not gross — the figure is strictly below the gross-based result", () => {
    const r = run({ jurisdiction: "CA", lowerGrossAnnualUsd: 0 });
    expect(r.usMonthlyUsd).toBeLessThan(0.4 * (180_000 / 12));
  });

  it("a 10-year marriage gets no presumptive termination date", () => {
    expect(run({ jurisdiction: "CA", yearsMarried: 10 }).usDurationLabel).toMatch(/No presumptive end date/);
    expect(run({ jurisdiction: "CA", yearsMarried: 9 }).usDurationLabel).toBe("About 4.5 years");
  });
});

describe("New York — DRL § 236(B)(6)", () => {
  it("takes the LESSER of the two candidate formulas", () => {
    // Close incomes make the 40%-of-combined cap the binding constraint.
    const r = run({ jurisdiction: "NY", higherGrossAnnualUsd: 120_000, lowerGrossAnnualUsd: 60_000 });
    const p = 120_000 / 12;
    const q = 60_000 / 12;
    const primary = 0.3 * p - 0.2 * q;
    const shareCap = 0.4 * (p + q) - q;
    expect(shareCap).toBeLessThan(primary);
    expect(r.usMonthlyUsd).toBe(Math.round(shareCap));
  });

  it("floors at zero rather than reporting a negative award", () => {
    // 40%-of-combined goes negative once the payee already out-earns that share.
    const r = run({ jurisdiction: "NY", higherGrossAnnualUsd: 120_000, lowerGrossAnnualUsd: 100_000 });
    expect(0.4 * (10_000 + 100_000 / 12) - 100_000 / 12).toBeLessThan(0);
    expect(r.usMonthlyUsd).toBe(0);
  });

  it("caps the payor's income at the statutory cap", () => {
    const atCap = run({ jurisdiction: "NY", higherGrossAnnualUsd: NY_INCOME_CAP_USD });
    const wayOver = run({ jurisdiction: "NY", higherGrossAnnualUsd: 900_000 });
    expect(wayOver.usMonthlyUsd).toBe(atCap.usMonthlyUsd);
  });

  it("flags that income above the cap is discretionary, not zero", () => {
    expect(run({ jurisdiction: "NY", higherGrossAnnualUsd: 900_000 }).usEligibilityNote).toMatch(
      /above the \$241,000 statutory cap/,
    );
    expect(run({ jurisdiction: "NY", higherGrossAnnualUsd: 100_000 }).usEligibilityNote).toMatch(
      /inside the statutory cap/,
    );
  });

  it("switches to the 20%/25% formula when the payor also pays child support", () => {
    const without = run({ jurisdiction: "NY", higherGrossAnnualUsd: 180_000, lowerGrossAnnualUsd: 40_000 });
    const with_ = run({
      jurisdiction: "NY",
      higherGrossAnnualUsd: 180_000,
      lowerGrossAnnualUsd: 40_000,
      payorPaysChildSupport: true,
    });
    expect(with_.usMonthlyUsd).toBeLessThan(without.usMonthlyUsd);
    expect(with_.usFormulaLabel).toMatch(/also pays child support/);
  });

  it("follows the statutory advisory duration brackets", () => {
    expect(run({ jurisdiction: "NY", yearsMarried: 10 }).usDurationLabel).toBe("1.5–3 years");
    expect(run({ jurisdiction: "NY", yearsMarried: 18 }).usDurationLabel).toBe("5.4–7.2 years");
    expect(run({ jurisdiction: "NY", yearsMarried: 24 }).usDurationLabel).toBe("8.4–12 years");
  });
});

describe("Texas — the eligibility gate, not just the cap", () => {
  it("screens out a marriage under 10 years instead of reporting a confident figure", () => {
    const r = run({ jurisdiction: "TX", yearsMarried: 4 });
    expect(r.usEligibility).toBe("screened-out");
    expect(r.usEligibilityNote).toMatch(/no court-ordered maintenance at all/);
  });

  it("treats a 10-year marriage as clearing the statutory threshold", () => {
    expect(run({ jurisdiction: "TX", yearsMarried: TX_MIN_YEARS_MARRIED }).usEligibility).toBe("guideline");
  });

  it("caps at the lesser of $5,000/month and 20% of gross monthly income", () => {
    // 20% binds: $180k/yr → $15,000/mo → 20% = $3,000.
    expect(run({ jurisdiction: "TX", yearsMarried: 12, higherGrossAnnualUsd: 180_000 }).usMonthlyUsd).toBe(3_000);
    // The dollar cap binds on a high earner.
    expect(run({ jurisdiction: "TX", yearsMarried: 12, higherGrossAnnualUsd: 900_000 }).usMonthlyUsd).toBe(
      TX_MONTHLY_CAP_USD,
    );
  });

  it("scales the duration ceiling by marriage length", () => {
    expect(run({ jurisdiction: "TX", yearsMarried: 12 }).usDurationLabel).toBe("Up to 5 years");
    expect(run({ jurisdiction: "TX", yearsMarried: 22 }).usDurationLabel).toBe("Up to 7 years");
    expect(run({ jurisdiction: "TX", yearsMarried: 31 }).usDurationLabel).toBe("Up to 10 years");
  });
});

describe("AAML benchmark", () => {
  it("applies 30% of payor gross minus 20% of payee gross", () => {
    const r = run({ higherGrossAnnualUsd: 180_000, lowerGrossAnnualUsd: 30_000 });
    expect(r.usMonthlyUsd).toBe(Math.round(0.3 * (180_000 / 12) - 0.2 * (30_000 / 12)));
  });

  it("caps the payee at 40% of combined income", () => {
    const r = run({ higherGrossAnnualUsd: 120_000, lowerGrossAnnualUsd: 60_000 });
    const p = 120_000 / 12;
    const q = 60_000 / 12;
    const shareCap = 0.4 * (p + q) - q;
    expect(shareCap).toBeLessThan(0.3 * p - 0.2 * q);
    expect(r.usMonthlyUsd).toBe(Math.round(shareCap));
  });

  it("uses bracketed duration factors, not a flat half", () => {
    expect(run({ yearsMarried: 2 }).usDurationLabel).toBe("About 0.6 years");
    expect(run({ yearsMarried: 9 }).usDurationLabel).toBe("About 4.5 years");
    expect(run({ yearsMarried: 15 }).usDurationLabel).toBe("About 11.3 years");
    expect(run({ yearsMarried: 25 }).usDurationLabel).toMatch(/indefinite/);
  });
});

describe("India benchmark", () => {
  it("is 25% of the higher earner's net income when the other spouse earns nothing", () => {
    const r = run({ lowerGrossAnnualUsd: 0 });
    const hiNetInr = (180_000 / 12) * NET_OF_TAX_SHARE * FX;
    expect(r.indiaMonthlyInr).toBe(Math.round(hiNetInr * INDIA_BENCHMARK_SHARE));
  });

  it("falls to zero when both spouses earn the same", () => {
    const r = run({ higherGrossAnnualUsd: 150_000, lowerGrossAnnualUsd: 150_000 });
    expect(r.indiaMonthlyInr).toBe(0);
  });

  it("offsets proportionally for the lower earner's own income", () => {
    const full = run({ lowerGrossAnnualUsd: 0 }).indiaMonthlyInr;
    const half = run({ lowerGrossAnnualUsd: 90_000 }).indiaMonthlyInr;
    expect(half).toBe(Math.round(full / 2));
  });

  it("reports a lump-sum range of 36–84 months of the benchmark", () => {
    const r = run();
    expect(r.indiaLumpSumLowInr).toBe(r.indiaMonthlyInr * 36);
    expect(r.indiaLumpSumHighInr).toBe(r.indiaMonthlyInr * 84);
  });

  it("scales with the exchange rate — a stale rate distorts the whole comparison", () => {
    const at87 = run({ usdInr: 87 }).indiaMonthlyInr;
    const at96 = run({ usdInr: 96 }).indiaMonthlyInr;
    expect(at96).toBeGreaterThan(at87);
    // The USD read-back is FX-invariant, which is the point of showing it.
    expect(run({ usdInr: 87 }).indiaMonthlyUsd).toBe(run({ usdInr: 96 }).indiaMonthlyUsd);
  });
});

describe("forum comparison", () => {
  it("reports neither when the incomes are identical", () => {
    const r = run({ higherGrossAnnualUsd: 150_000, lowerGrossAnnualUsd: 150_000, jurisdiction: "CA" });
    expect(r.usMonthlyUsd).toBe(0);
    expect(r.indiaMonthlyInr).toBe(0);
    expect(r.comparison).toBe("neither");
    expect(r.ratio).toBeNull();
  });

  it("compares like for like — both sides converted to INR", () => {
    const r = run({ jurisdiction: "CA", lowerGrossAnnualUsd: 0 });
    expect(r.ratio).toBe(Math.round(((r.usMonthlyUsd * FX) / r.indiaMonthlyInr) * 10) / 10);
  });

  it("flags the Texas cap as the case where India can come out higher", () => {
    // Texas is capped at $5,000/mo however high the income goes; the Indian
    // benchmark keeps scaling with it, so the forums invert on a big earner.
    const r = run({ jurisdiction: "TX", yearsMarried: 12, higherGrossAnnualUsd: 1_000_000 });
    expect(r.usMonthlyUsd).toBe(TX_MONTHLY_CAP_USD);
    expect(r.comparison).toBe("india-higher");
  });
});

describe("input hygiene", () => {
  it("normalizes the order of the two incomes", () => {
    const a = run({ higherGrossAnnualUsd: 40_000, lowerGrossAnnualUsd: 200_000 });
    const b = run({ higherGrossAnnualUsd: 200_000, lowerGrossAnnualUsd: 40_000 });
    expect(a).toEqual(b);
  });

  it("never returns NaN, Infinity or a negative figure", () => {
    for (const bad of [NaN, Infinity, -Infinity, -50_000]) {
      for (const j of ["CA", "NY", "TX", "AAML"] as const) {
        const r = run({ higherGrossAnnualUsd: bad, lowerGrossAnnualUsd: bad, jurisdiction: j, usdInr: bad });
        for (const n of [r.usMonthlyUsd, r.indiaMonthlyInr, r.indiaMonthlyUsd, r.indiaLumpSumLowInr]) {
          expect(Number.isFinite(n)).toBe(true);
          expect(n).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("never lets a negative formula result surface as a payment", () => {
    // Lower earner out-earning the guideline share drives the raw formula below zero.
    const r = run({ jurisdiction: "CA", higherGrossAnnualUsd: 100_000, lowerGrossAnnualUsd: 99_000 });
    expect(r.usMonthlyUsd).toBe(0);
  });

  it("a zero exchange rate cannot divide by zero", () => {
    const r = run({ usdInr: 0 });
    expect(Number.isFinite(r.indiaMonthlyUsd)).toBe(true);
  });
});
