/**
 * Regression guard for the July 2026 "Unavailable" (U) outage.
 *
 * In July 2026 the Visa Bulletin marked EB-2 India and EB-5 India Final Action
 * Dates as "U" (Unavailable). Code paths that assumed every cutoff was a
 * parseable date passed "U" to monthIndex()/new Date(), producing NaN — which
 * surfaced as "NaN yr gap" on the homepage and crashed several tool routes.
 *
 * These tests exercise EVERY category/country combination through the core
 * math + formatting helpers and assert that no NaN, Invalid Date, or throw can
 * escape — regardless of whether a cutoff is a date, "C" (Current), or "U"
 * (Unavailable). Run before shipping any new bulletin: `npm test`.
 */

import { describe, it, expect } from "vitest";
import {
  CATEGORY_LABELS,
  COUNTRY_LABELS,
  EB5_SETASIDE_ORDER,
  EXTENDED_CATEGORIES,
  EXTENDED_COUNTRIES,
  countRetrogressionMonths,
  estimateWait,
  expandSeries,
  extendedEstimateWait,
  extendedGetMovement,
  formatCutoff,
  getApplicableChart,
  getBulletinLabel,
  getCutoffs,
  getEb5SetAside,
  getExtendedCutoffs,
  getExtendedSeries,
  getMovement,
  getSeries,
  isCurrent,
  isUnavailableVisaValue,
  isValidVisaDate,
  projectWithPace,
  velocity,
  type BulletinCountry,
  type EbCategory,
} from "./visa-bulletin";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as EbCategory[];
const COUNTRIES = Object.keys(COUNTRY_LABELS) as BulletinCountry[];

/** Every cutoff value shape a bulletin can throw at us. */
const CUTOFF_SAMPLES = ["2014-01-01", "C", "U"] as const;

describe("visa-bulletin value helpers", () => {
  it("isUnavailableVisaValue only matches the Unavailable sentinel", () => {
    expect(isUnavailableVisaValue("U")).toBe(true);
    expect(isUnavailableVisaValue("C")).toBe(false);
    expect(isUnavailableVisaValue("2014-01-01")).toBe(false);
  });

  it("isValidVisaDate rejects C, U, and parses real dates", () => {
    expect(isValidVisaDate("2014-01-01")).toBe(true);
    expect(isValidVisaDate("2026-07")).toBe(true);
    expect(isValidVisaDate("C")).toBe(false);
    expect(isValidVisaDate("U")).toBe(false);
  });

  it("formatCutoff never returns NaN/Invalid Date for any cutoff shape", () => {
    for (const v of CUTOFF_SAMPLES) {
      const label = formatCutoff(v);
      expect(label).not.toMatch(/NaN|Invalid/);
    }
    expect(formatCutoff("U")).toBe("Unavailable");
    expect(formatCutoff("C")).toBe("Current");
  });
});

describe("estimateWait never produces NaN for any real category/country", () => {
  for (const category of CATEGORIES) {
    for (const country of COUNTRIES) {
      it(`${category}/${country} — current bulletin`, () => {
        const est = estimateWait("2019-06-01", category, country);
        const numericFields = [
          est.monthsBehind,
          est.optimisticMonths,
          est.pessimisticMonths,
          est.velocityPerMonth,
        ];
        for (const n of numericFields) {
          if (n !== null) expect(Number.isNaN(n)).toBe(false);
        }
        // Unavailable categories must short-circuit to the safe status.
        const { fad } = getCutoffs(category, country);
        if (isUnavailableVisaValue(fad)) {
          expect(est.status).toBe("unavailable");
          expect(est.optimisticMonths).toBeNull();
          expect(est.pessimisticMonths).toBeNull();
        }
      });
    }
  }
});

describe("chart + velocity math is NaN-free across all series", () => {
  for (const category of CATEGORIES) {
    for (const country of COUNTRIES) {
      it(`${category}/${country} — expandSeries + velocity`, () => {
        const series = getSeries(category, country);
        if (!series) return; // ROW has no series — expected null
        for (const key of ["fad", "dff"] as const) {
          for (const pt of expandSeries(series[key])) {
            // Plotted values must be real numbers; "U"/"C"/gaps become null.
            if (pt.value !== null) expect(Number.isNaN(pt.value)).toBe(false);
          }
          const v = velocity(series[key]);
          if (v !== null) expect(Number.isNaN(v)).toBe(false);
        }
      });
    }
  }
});

describe("synthetic bulletins: a category going Unavailable mid-series", () => {
  it("velocity returns null when the latest point is U (no fake movement)", () => {
    const v = velocity([
      ["2025-01", "2013-01-01"],
      ["2026-07", "U"],
    ]);
    expect(v).toBeNull();
  });

  it("expandSeries maps U months to null, not NaN", () => {
    const out = expandSeries([
      ["2026-05", "2014-01-01"],
      ["2026-07", "U"],
    ]);
    const july = out.find((p) => p.month === "2026-7");
    expect(july?.value ?? null).toBeNull();
    for (const p of out) {
      if (p.value !== null) expect(Number.isNaN(p.value)).toBe(false);
    }
  });

  it("estimateWait against a U cutoff is 'unavailable', not a NaN range", () => {
    // Drive through the public API: any category whose current FAD is U.
    const unavailable = CATEGORIES.flatMap((c) =>
      COUNTRIES.map((co) => ({ c, co, fad: getCutoffs(c, co).fad }))
    ).filter((x) => isUnavailableVisaValue(x.fad));
    // July 2026 has at least EB-2 India + EB-5 India Unavailable.
    expect(unavailable.length).toBeGreaterThan(0);
    for (const { c, co } of unavailable) {
      expect(estimateWait("2015-01-01", c, co).status).toBe("unavailable");
    }
  });

  it("isCurrent + Unavailable are mutually exclusive sentinels", () => {
    expect(isCurrent("U")).toBe(false);
    expect(isUnavailableVisaValue("C")).toBe(false);
  });
});

describe("EB-5 set-aside categories (July 2026)", () => {
  it("exposes all three set-asides", () => {
    expect(EB5_SETASIDE_ORDER).toEqual([
      "rural",
      "highUnemployment",
      "infrastructure",
    ]);
  });

  it("all India set-asides are Current (separate from Unavailable Unreserved)", () => {
    // EB-5 India Unreserved is "U" this month...
    expect(getCutoffs("eb5", "india").fad).toBe("U");
    // ...but the reserved set-asides remain Current.
    for (const key of EB5_SETASIDE_ORDER) {
      const cut = getEb5SetAside(key, "india");
      expect(cut).not.toBeNull();
      expect(isCurrent(cut!.fad)).toBe(true);
      expect(formatCutoff(cut!.fad)).toBe("Current");
    }
  });

  it("set-asides resolve for every country without throwing", () => {
    for (const co of COUNTRIES) {
      for (const key of EB5_SETASIDE_ORDER) {
        const cut = getEb5SetAside(key, co);
        expect(cut).not.toBeNull();
        expect(formatCutoff(cut!.fad)).not.toMatch(/NaN|Invalid/);
      }
    }
  });
});

describe("month label + applicable chart", () => {
  it("getBulletinLabel renders a full month + year", () => {
    expect(getBulletinLabel()).toMatch(
      /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/
    );
  });

  it("getApplicableChart returns a coherent chart + label", () => {
    const c = getApplicableChart();
    expect(["final-action", "dates-for-filing"]).toContain(c.chart);
    expect(c.usingDatesForFiling).toBe(c.chart === "dates-for-filing");
    expect(c.label).toBe(
      c.chart === "dates-for-filing" ? "Dates for Filing" : "Final Action Dates"
    );
  });
});

describe("getMovement is C/U-safe and consistent across every category", () => {
  it("classifies C as current and U as unavailable, never doing date math", () => {
    for (const cat of CATEGORIES) {
      for (const co of COUNTRIES) {
        const m = getMovement(cat, co);
        const { fad } = getCutoffs(cat, co);
        if (fad === "C") {
          expect(m.status).toBe("current");
          expect(m.monthsMoved).toBeNull();
        } else if (fad === "U") {
          expect(m.status).toBe("unavailable");
          expect(m.monthsMoved).toBeNull();
        }
        // monthsMoved is either null or a finite number — never NaN.
        if (m.monthsMoved !== null) expect(Number.isFinite(m.monthsMoved)).toBe(true);
        expect(m.currentMonthLabel).not.toMatch(/NaN|Invalid|undefined/);
        expect(m.priorMonthLabel).not.toMatch(/NaN|Invalid|undefined/);
      }
    }
  });

  it("detects the EB-1 India July-2026 retrogression from history", () => {
    // History: EB-1 India FAD 2026-06 = 2022-12-15, 2026-07 = 2022-10-15.
    const m = getMovement("eb1", "india");
    expect(m.status).toBe("retrogressed");
    expect(m.priorFad).toBe("2022-12-15");
    expect(m.monthsMoved).not.toBeNull();
    expect(m.monthsMoved!).toBeLessThan(0);
  });
});

/* ==========================================================================
 * Extended matrix (family categories, EB-3 Other/EB-4, Mexico/Philippines)
 * — added for the Green Card Queue Tracker rebuild.
 * ========================================================================== */

describe("extended category/country matrix — never throws, never NaN", () => {
  it("getExtendedCutoffs covers every combo without throwing, null means honestly unverified", () => {
    for (const cat of EXTENDED_CATEGORIES) {
      for (const co of EXTENDED_COUNTRIES) {
        const { fad, dff } = getExtendedCutoffs(cat, co);
        for (const v of [fad, dff]) {
          if (v === null) continue; // unverified — acceptable, never a guess
          expect(typeof v).toBe("string");
          expect(v).not.toMatch(/NaN|Invalid|undefined/);
        }
      }
    }
  });

  it("extendedEstimateWait never throws or produces NaN across the full matrix", () => {
    for (const cat of EXTENDED_CATEGORIES) {
      for (const co of EXTENDED_COUNTRIES) {
        const est = extendedEstimateWait("2015-01-01", cat, co);
        expect(est.status).toBeTruthy();
        if (est.optimisticMonths !== null) expect(Number.isFinite(est.optimisticMonths)).toBe(true);
        if (est.pessimisticMonths !== null) expect(Number.isFinite(est.pessimisticMonths)).toBe(true);
        if (est.monthsBehind !== null) expect(Number.isFinite(est.monthsBehind)).toBe(true);
      }
    }
  });

  it("extendedEstimateWait returns no-data (not a guess) when a cell is unverified", () => {
    // EB-3 Other Workers / Philippines has genuine unverified months in the backfill.
    const est = extendedEstimateWait("2015-01-01", "eb3Other", "philippines");
    if (est.fad === null) {
      expect(est.status).toBe("no-data");
      expect(est.optimisticMonths).toBeNull();
      expect(est.pessimisticMonths).toBeNull();
    }
  });

  it("extendedGetMovement covers every combo without throwing", () => {
    for (const cat of EXTENDED_CATEGORIES) {
      for (const co of EXTENDED_COUNTRIES) {
        const m = extendedGetMovement(cat, co);
        expect(m.status).toBeTruthy();
        if (m.monthsMoved !== null) expect(Number.isFinite(m.monthsMoved)).toBe(true);
      }
    }
  });

  it("getExtendedSeries returns a well-formed series or null, never throws", () => {
    for (const cat of EXTENDED_CATEGORIES) {
      for (const co of EXTENDED_COUNTRIES) {
        const series = getExtendedSeries(cat, co);
        if (series) {
          expect(Array.isArray(series.fad)).toBe(true);
          expect(Array.isArray(series.dff)).toBe(true);
        }
      }
    }
  });
});

describe("projectWithPace", () => {
  it("projects a wait proportional to months-behind / pace", () => {
    const { months, capped } = projectWithPace(120, 2);
    expect(months).toBe(60);
    expect(capped).toBe(false);
  });

  it("returns null for zero/negative pace or non-positive gap (no honest projection)", () => {
    expect(projectWithPace(120, 0).months).toBeNull();
    expect(projectWithPace(120, -1).months).toBeNull();
    expect(projectWithPace(0, 2).months).toBeNull();
    expect(projectWithPace(-5, 2).months).toBeNull();
  });

  it("caps the projection and flags it at the estimate ceiling", () => {
    const { months, capped } = projectWithPace(10000, 0.01);
    expect(capped).toBe(true);
    expect(months).toBeLessThanOrEqual(300);
  });
});

describe("countRetrogressionMonths", () => {
  it("returns a non-negative integer within [0, trailingMonths] for every combo", () => {
    for (const cat of EXTENDED_CATEGORIES) {
      for (const co of EXTENDED_COUNTRIES) {
        const n = countRetrogressionMonths(cat, co, "fad", 60);
        expect(Number.isInteger(n)).toBe(true);
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(60);
      }
    }
  });

  it("finds at least the known EB-1 India August-2023 retrogression within the trailing 60 months", () => {
    const n = countRetrogressionMonths("eb1", "india", "fad", 60);
    expect(n).toBeGreaterThanOrEqual(1);
  });
});
