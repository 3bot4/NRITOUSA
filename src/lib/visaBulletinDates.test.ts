/**
 * Cutoff comparison + July 2026 data-integrity tests.
 *
 * The Department of State rule: a priority date qualifies only when it is
 * STRICTLY EARLIER THAN the listed Final Action Date. A date equal to the
 * cutoff is NOT current. "C" = all dates current; "U" = no dates current.
 *
 * These tests lock in the strict-earlier-than boundary and verify the canonical
 * July 2026 values flow through CURRENT_VISA_BULLETIN (sourced from current.json).
 */

import { describe, it, expect } from "vitest";
import {
  comparePriorityDate,
  parseCutoff,
  CURRENT_VISA_BULLETIN,
} from "./visaBulletinDates";

const pd = (iso: string) => new Date(iso);

describe("comparePriorityDate — strict earlier-than boundary", () => {
  it("'C' (Current) makes any priority date current", () => {
    expect(comparePriorityDate(pd("1990-01-01"), "C")).toBe("all-current");
    expect(comparePriorityDate(pd("2030-01-01"), "C")).toBe("all-current");
  });

  it("'U' (Unavailable) makes no priority date current", () => {
    expect(comparePriorityDate(pd("1990-01-01"), "U")).toBe("unavailable");
    expect(comparePriorityDate(pd("2014-01-01"), "U")).toBe("unavailable");
  });

  it("India EB-1 cutoff 2022-10-15: 2022-10-14 current, 2022-10-15 not", () => {
    expect(comparePriorityDate(pd("2022-10-14"), "2022-10-15")).toBe("current");
    expect(comparePriorityDate(pd("2022-10-15"), "2022-10-15")).toBe("not-current");
  });

  it("India EB-3 cutoff 2014-01-01: 2013-12-31 current, 2014-01-01 not", () => {
    expect(comparePriorityDate(pd("2013-12-31"), "2014-01-01")).toBe("current");
    expect(comparePriorityDate(pd("2014-01-01"), "2014-01-01")).toBe("not-current");
  });

  it("China EB-2 cutoff 2021-09-01: 2021-08-31 current, 2021-09-01 not", () => {
    expect(comparePriorityDate(pd("2021-08-31"), "2021-09-01")).toBe("current");
    expect(comparePriorityDate(pd("2021-09-01"), "2021-09-01")).toBe("not-current");
  });

  it("ROW EB-3 cutoff 2024-08-01: 2024-07-31 current, 2024-08-01 not", () => {
    expect(comparePriorityDate(pd("2024-07-31"), "2024-08-01")).toBe("current");
    expect(comparePriorityDate(pd("2024-08-01"), "2024-08-01")).toBe("not-current");
  });
});

describe("parseCutoff sentinels", () => {
  it("returns the sentinel for C and U, a Date otherwise", () => {
    expect(parseCutoff("C")).toBe("C");
    expect(parseCutoff("U")).toBe("U");
    expect(parseCutoff("2014-01-01")).toBeInstanceOf(Date);
  });
});

describe("July 2026 canonical data (from current.json)", () => {
  it("bulletin is July 2026", () => {
    expect(CURRENT_VISA_BULLETIN.month).toBe("July");
    expect(CURRENT_VISA_BULLETIN.year).toBe(2026);
  });

  it("India Final Action Dates match the July 2026 source of truth", () => {
    const fa = CURRENT_VISA_BULLETIN.finalActionDates;
    expect(fa.EB1.india).toBe("2022-10-15"); // 15OCT22
    expect(fa.EB2.india).toBe("U"); // Unavailable
    expect(fa.EB3.india).toBe("2014-01-01"); // 01JAN14
  });

  it("ROW ('Other') Final Action Dates match the July 2026 source of truth", () => {
    const fa = CURRENT_VISA_BULLETIN.finalActionDates;
    expect(fa.EB1.other).toBe("C");
    expect(fa.EB2.other).toBe("C");
    expect(fa.EB3.other).toBe("2024-08-01"); // 01AUG24
  });

  it("USCIS is using Final Action Dates (Table B not authorized) for July 2026", () => {
    expect(CURRENT_VISA_BULLETIN.usingDatesForFiling).toBe(false);
  });

  it("EB-2 India is unavailable for every priority date this month", () => {
    for (const iso of ["2008-01-01", "2013-09-01", "2015-01-01"]) {
      expect(
        comparePriorityDate(pd(iso), CURRENT_VISA_BULLETIN.finalActionDates.EB2.india)
      ).toBe("unavailable");
    }
  });
});
