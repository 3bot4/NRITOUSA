/**
 * Cutoff comparison + September 2026 data-integrity tests.
 *
 * The Department of State rule: a priority date qualifies only when it is
 * STRICTLY EARLIER THAN the listed Final Action Date. A date equal to the
 * cutoff is NOT current. "C" = all dates current; "U" = no dates current.
 *
 * These tests lock in the strict-earlier-than boundary and verify the canonical
 * September 2026 values flow through CURRENT_VISA_BULLETIN (sourced from current.json).
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

describe("October 2026 canonical data (from current.json)", () => {
  it("bulletin is October 2026", () => {
    expect(CURRENT_VISA_BULLETIN.month).toBe("October");
    expect(CURRENT_VISA_BULLETIN.year).toBe(2026);
  });

  it("India Final Action Dates match the October 2026 source of truth", () => {
    const fa = CURRENT_VISA_BULLETIN.finalActionDates;
    expect(fa.EB1.india).toBe("2023-02-01"); // 01FEB23, advanced from 15OCT22
    expect(fa.EB2.india).toBe("2013-11-01"); // 01NOV13, re-opened from Unavailable
    expect(fa.EB3.india).toBe("2014-01-01"); // 01JAN14, unchanged from September
  });

  it("ROW ('Other') Final Action Dates match the October 2026 source of truth", () => {
    // The FY2027 reset retrogressed Rest of World to hold issuance inside the
    // new year's quarterly and annual limits — EB-2 ROW is no longer Current.
    const fa = CURRENT_VISA_BULLETIN.finalActionDates;
    expect(fa.EB1.other).toBe("C");
    expect(fa.EB2.other).toBe("2025-01-01"); // 01JAN25, retrogressed from Current
    expect(fa.EB3.other).toBe("2024-05-15"); // 15MAY24, retrogressed from 01SEP24
  });

  it("reports the posted October 2026 USCIS chart determination", () => {
    // USCIS posts its determination after DOS publishes the bulletin; until it
    // does, filingChartPending stays true so no UI asserts a chart for the
    // current month. USCIS posted the October 2026 determination (verified
    // 2026-09-29): applicants may use Dates for Filing for BOTH employment-based
    // and family-sponsored adjustment of status — a switch from September 2026,
    // when employment-based filings had to use Final Action Dates.
    expect(CURRENT_VISA_BULLETIN.usingDatesForFiling).toBe(true);
    expect(CURRENT_VISA_BULLETIN.filingChartPending).toBe(false);
    expect(CURRENT_VISA_BULLETIN.filingChartDeterminationMonthLabel).toBe("October 2026");
    expect(CURRENT_VISA_BULLETIN.filingChartBadgeLabel).toBe("Dates for Filing");
    expect(CURRENT_VISA_BULLETIN.filingChartStatusNote).toBe(
      "October 2026 USCIS filing chart: Dates for Filing."
    );
  });

  it("never reports a posted determination for a month other than the bulletin month", () => {
    // The invariant the pending state exists to protect: a 'posted' status must
    // describe THIS bulletin, never a carried-over prior month.
    if (!CURRENT_VISA_BULLETIN.filingChartPending) {
      expect(CURRENT_VISA_BULLETIN.filingChartDeterminationMonthLabel).toBe(
        `${CURRENT_VISA_BULLETIN.month} ${CURRENT_VISA_BULLETIN.year}`
      );
    }
  });

  it("EB-2 India admits priority dates before the re-opened Nov 1, 2013 cutoff", () => {
    const eb2India = CURRENT_VISA_BULLETIN.finalActionDates.EB2.india;
    for (const iso of ["2008-01-01", "2013-09-01"]) {
      expect(comparePriorityDate(pd(iso), eb2India)).toBe("current");
    }
    for (const iso of ["2013-12-01", "2015-01-01"]) {
      expect(comparePriorityDate(pd(iso), eb2India)).toBe("not-current");
    }
  });
});
