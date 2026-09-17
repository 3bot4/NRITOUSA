import { describe, it, expect } from "vitest";
import {
  householdSize,
  povertyGuideline,
  requiredIncome,
  evaluateSponsor,
  thresholdSeries,
  EMPTY_HOUSEHOLD,
  MAX_HOUSEHOLD,
} from "./i864Income";
import {
  I864_TABLES,
  I864P_PRINTED_125_CONTIGUOUS,
  I864_LOCATIONS,
  ASSET_RULES,
} from "@/data/affidavitOfSupportData";

describe("householdSize", () => {
  it("counts the sponsor even with an otherwise empty household", () => {
    expect(
      householdSize({ spouse: 0, children: 0, dependents: 0, immigrants: 0, priorObligations: 0 })
    ).toBe(1);
  });

  it("counts sponsor + one intending immigrant as 2 (the default affidavit)", () => {
    expect(householdSize(EMPTY_HOUSEHOLD)).toBe(2);
  });

  it("adds every component", () => {
    expect(
      householdSize({ spouse: 1, children: 2, dependents: 1, immigrants: 3, priorObligations: 1 })
    ).toBe(9);
  });

  it("caps spouse at 1 however the input is abused", () => {
    expect(
      householdSize({ spouse: 4, children: 0, dependents: 0, immigrants: 1, priorObligations: 0 })
    ).toBe(3);
  });

  it("floors negatives, NaN and Infinity at zero rather than producing nonsense", () => {
    expect(
      householdSize({ spouse: -3, children: NaN, dependents: Infinity, immigrants: 1, priorObligations: -1 })
    ).toBe(2);
  });

  it("truncates fractional counts downwards", () => {
    expect(
      householdSize({ spouse: 0, children: 2.9, dependents: 0, immigrants: 1, priorObligations: 0 })
    ).toBe(4);
  });

  it("caps at MAX_HOUSEHOLD", () => {
    expect(
      householdSize({ spouse: 1, children: 40, dependents: 0, immigrants: 1, priorObligations: 0 })
    ).toBe(MAX_HOUSEHOLD);
  });
});

describe("povertyGuideline", () => {
  it("reads the published table for sizes 1–8", () => {
    for (const table of I864_LOCATIONS) {
      table.base.forEach((value, i) => {
        expect(povertyGuideline(i + 1, table.id)).toBe(value);
      });
    }
  });

  it("extends beyond 8 by the per-person increment", () => {
    const t = I864_TABLES.contiguous;
    expect(povertyGuideline(9, "contiguous")).toBe(t.base[7] + t.basePerExtra);
    expect(povertyGuideline(12, "contiguous")).toBe(t.base[7] + 4 * t.basePerExtra);
  });

  it("treats sizes below 1 as 1 instead of indexing off the table", () => {
    expect(povertyGuideline(0, "contiguous")).toBe(I864_TABLES.contiguous.base[0]);
    expect(povertyGuideline(-5, "hawaii")).toBe(I864_TABLES.hawaii.base[0]);
  });
});

describe("requiredIncome — pinned to the figures printed on Form I-864P", () => {
  it("reproduces the printed 125% column for the 48 contiguous states", () => {
    for (const [size, printed] of Object.entries(I864P_PRINTED_125_CONTIGUOUS)) {
      expect(requiredIncome(Number(size), "contiguous", false)).toBe(printed);
    }
  });

  it("derives every 125% figure as exactly 1.25x the published guideline", () => {
    for (const table of I864_LOCATIONS) {
      for (let size = 1; size <= 8; size++) {
        expect(requiredIncome(size, table.id, false)).toBe(
          Math.round(table.base[size - 1] * 1.25)
        );
      }
    }
  });

  it("applies the 100% rule for an active-duty sponsor petitioning a spouse or child", () => {
    expect(requiredIncome(2, "contiguous", true)).toBe(I864_TABLES.contiguous.base[1]);
    expect(requiredIncome(2, "contiguous", true)).toBeLessThan(
      requiredIncome(2, "contiguous", false)
    );
  });

  it("keeps Alaska above Hawaii above the contiguous states at every size", () => {
    for (let size = 2; size <= 8; size++) {
      expect(requiredIncome(size, "alaska", false)).toBeGreaterThan(
        requiredIncome(size, "hawaii", false)
      );
      expect(requiredIncome(size, "hawaii", false)).toBeGreaterThan(
        requiredIncome(size, "contiguous", false)
      );
    }
  });
});

describe("evaluateSponsor", () => {
  const base = {
    counts: EMPTY_HOUSEHOLD,
    location: "contiguous" as const,
    military: false,
    assetCase: "other" as const,
  };

  it("passes a sponsor exactly on the line (>= is the rule, not >)", () => {
    const r = evaluateSponsor({ ...base, income: I864P_PRINTED_125_CONTIGUOUS[2] });
    expect(r.meets).toBe(true);
    expect(r.shortfall).toBe(0);
    expect(r.surplus).toBe(0);
    expect(r.assetsNeeded).toBe(0);
  });

  it("fails a sponsor one dollar short and reports the exact gap", () => {
    const r = evaluateSponsor({ ...base, income: I864P_PRINTED_125_CONTIGUOUS[2] - 1 });
    expect(r.meets).toBe(false);
    expect(r.shortfall).toBe(1);
  });

  it("asks for five times the shortfall in a standard case", () => {
    const r = evaluateSponsor({ ...base, income: 20_000 });
    expect(r.assetsNeeded).toBe(r.shortfall * 5);
    expect(r.assetMultiple).toBe(ASSET_RULES.other.multiple);
  });

  it("asks for three times the shortfall for the spouse of a US citizen", () => {
    const r = evaluateSponsor({
      ...base,
      income: 20_000,
      assetCase: "spouse-or-child-of-usc",
    });
    expect(r.assetsNeeded).toBe(r.shortfall * 3);
  });

  it("asks for the shortfall itself for an adopted orphan", () => {
    const r = evaluateSponsor({ ...base, income: 20_000, assetCase: "orphan" });
    expect(r.assetsNeeded).toBe(r.shortfall);
  });

  it("never returns NaN for a blank or hostile income", () => {
    for (const income of [NaN, -5000, Infinity]) {
      const r = evaluateSponsor({ ...base, income });
      expect(Number.isFinite(r.shortfall)).toBe(true);
      expect(Number.isFinite(r.assetsNeeded)).toBe(true);
      expect(r.income).toBe(0);
      expect(r.meets).toBe(false);
    }
  });

  it("raises the requirement as the household grows — the classic forgotten immigrant", () => {
    const alone = evaluateSponsor({ ...base, income: 30_000 });
    const withKids = evaluateSponsor({
      ...base,
      counts: { ...EMPTY_HOUSEHOLD, immigrants: 3 },
      income: 30_000,
    });
    expect(withKids.required).toBeGreaterThan(alone.required);
    expect(alone.meets).toBe(true);
    expect(withKids.meets).toBe(false);
  });

  it("lets the military rule rescue a sponsor who fails the 125% test", () => {
    const income = 22_000; // above 100% for a household of 2, below 125%
    expect(evaluateSponsor({ ...base, income }).meets).toBe(false);
    expect(evaluateSponsor({ ...base, income, military: true }).meets).toBe(true);
  });

  it("falls back to the 5x rule for an unrecognised asset case", () => {
    const r = evaluateSponsor({
      ...base,
      income: 20_000,
      assetCase: "not-a-real-case" as never,
    });
    expect(r.assetMultiple).toBe(5);
  });
});

describe("thresholdSeries", () => {
  it("covers household sizes 2–8 and rises monotonically", () => {
    const series = thresholdSeries("contiguous", false);
    expect(series.map((p) => p.size)).toEqual([2, 3, 4, 5, 6, 7, 8]);
    for (let i = 1; i < series.length; i++) {
      expect(series[i].required).toBeGreaterThan(series[i - 1].required);
    }
  });

  it("matches the printed I-864P column exactly", () => {
    for (const point of thresholdSeries("contiguous", false)) {
      expect(point.required).toBe(I864P_PRINTED_125_CONTIGUOUS[point.size]);
    }
  });
});
