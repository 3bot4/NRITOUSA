import { describe, expect, it } from "vitest";
import {
  countI94Days,
  parseTravelHistory,
  ABSENCE_BREAKS_DAYS,
  ABSENCE_REBUTTABLE_DAYS,
  SPT_THRESHOLD,
} from "./i94DayCount";

const asOf = "2026-10-13";

describe("day counting conventions", () => {
  it("counts both the arrival day and the departure day", () => {
    // 1 Jan to 3 Jan inclusive is three days, not two.
    const r = countI94Days(
      [{ arrival: "2026-01-01", departure: "2026-01-03" }],
      { asOf },
    );
    expect(r.valid).toBe(true);
    expect(r.totalDays).toBe(3);
    expect(r.byYear).toEqual([{ year: 2026, days: 3 }]);
  });

  it("counts a single-day stay as one day", () => {
    const r = countI94Days(
      [{ arrival: "2026-05-05", departure: "2026-05-05" }],
      { asOf },
    );
    expect(r.totalDays).toBe(1);
  });

  it("splits a stay that spans a year boundary into the right years", () => {
    // 30 Dec, 31 Dec = 2 days in 2025; 1 Jan, 2 Jan = 2 days in 2026.
    const r = countI94Days(
      [{ arrival: "2025-12-30", departure: "2026-01-02" }],
      { asOf },
    );
    expect(r.byYear).toEqual([
      { year: 2025, days: 2 },
      { year: 2026, days: 2 },
    ]);
    expect(r.totalDays).toBe(4);
  });

  it("counts an open final stay through the as-of date", () => {
    const r = countI94Days([{ arrival: "2026-10-11" }], { asOf });
    // 11, 12, 13 October.
    expect(r.totalDays).toBe(3);
  });

  it("never reports more days than a calendar year holds", () => {
    const r = countI94Days(
      [{ arrival: "2023-01-01", departure: "2026-10-13" }],
      { asOf },
    );
    for (const y of r.byYear) {
      const max = (y.year % 4 === 0 && y.year % 100 !== 0) || y.year % 400 === 0 ? 366 : 365;
      expect(y.days).toBeLessThanOrEqual(max);
    }
  });

  it("handles a leap day", () => {
    const r = countI94Days(
      [{ arrival: "2024-02-28", departure: "2024-03-01" }],
      { asOf },
    );
    // 28, 29 Feb and 1 March.
    expect(r.totalDays).toBe(3);
  });
});

describe("absence flags measure time ABROAD, not presence", () => {
  it("does not flag a trip under six months", () => {
    const r = countI94Days(
      [
        { arrival: "2025-01-01", departure: "2025-06-01" },
        { arrival: "2025-09-01", departure: "2025-12-01" },
      ],
      { asOf },
    );
    // 2 June to 31 August abroad = 91 days.
    expect(r.absenceFlags).toEqual([]);
    expect(r.longestAbsenceDays).toBe(0);
  });

  it("flags an absence over the six-month threshold as rebuttable", () => {
    const r = countI94Days(
      [
        { arrival: "2024-01-01", departure: "2024-02-01" },
        { arrival: "2024-09-01", departure: "2024-10-01" },
      ],
      { asOf },
    );
    expect(r.absenceFlags).toHaveLength(1);
    expect(r.absenceFlags[0].level).toBe("rebuttable");
    expect(r.absenceFlags[0].days).toBeGreaterThanOrEqual(ABSENCE_REBUTTABLE_DAYS);
    expect(r.absenceFlags[0].days).toBeLessThan(ABSENCE_BREAKS_DAYS);
  });

  it("flags an absence of a year or more as breaking continuous residence", () => {
    const r = countI94Days(
      [
        { arrival: "2023-01-01", departure: "2023-02-01" },
        { arrival: "2024-06-01", departure: "2024-07-01" },
      ],
      { asOf },
    );
    expect(r.absenceFlags).toHaveLength(1);
    expect(r.absenceFlags[0].level).toBe("breaks");
    expect(r.absenceFlags[0].days).toBeGreaterThanOrEqual(ABSENCE_BREAKS_DAYS);
  });

  it("excludes the departure and arrival days from the absence count", () => {
    // Depart 1 Jan, return 11 Jan. Both are days of US presence, so the
    // continuous absence is 9 days, not 10 or 11.
    const r = countI94Days(
      [
        { arrival: "2025-12-01", departure: "2026-01-01" },
        { arrival: "2026-01-11", departure: "2026-02-01" },
      ],
      { asOf, taxYear: 2026 },
    );
    // No flag at this length, but the arithmetic shows up in the year count:
    // Jan has 1 + 21 = 22 days of presence.
    const y2026 = r.byYear.find((y) => y.year === 2026)!;
    expect(y2026.days).toBe(1 + 22);
  });
});

describe("substantial presence test estimate", () => {
  it("applies the 1, one-third and one-sixth weights", () => {
    const r = countI94Days(
      [
        // 2024: 1 Jan – 30 Jun inclusive = 182 days.
        { arrival: "2024-01-01", departure: "2024-06-30" },
        // 2025: 1 Jan – 30 Jun inclusive = 181 days.
        { arrival: "2025-01-01", departure: "2025-06-30" },
        // 2026: 1 Jan – 31 Mar inclusive = 90 days.
        { arrival: "2026-01-01", departure: "2026-03-31" },
      ],
      { asOf, taxYear: 2026 },
    );
    const spt = r.spt!;
    expect(spt.currentYearDays).toBe(90);
    expect(spt.priorYearDays).toBe(181);
    expect(spt.secondPriorYearDays).toBe(182);
    expect(spt.weightedDays).toBeCloseTo(90 + 181 / 3 + 182 / 6, 6);
    expect(spt.meets31Day).toBe(true);
    // 90 + 60.33 + 30.33 = 180.67, just under 183.
    expect(spt.meets183Day).toBe(false);
    expect(spt.meetsOnDaysAlone).toBe(false);
  });

  it("requires the 31-day current-year minimum independently of the weighted total", () => {
    const r = countI94Days(
      [
        // Two prior years entirely in the US, a token current year.
        { arrival: "2024-01-01", departure: "2024-12-31" },
        { arrival: "2025-01-01", departure: "2025-12-31" },
        { arrival: "2026-01-01", departure: "2026-01-10" },
      ],
      { asOf, taxYear: 2026 },
    );
    const spt = r.spt!;
    expect(spt.currentYearDays).toBe(10);
    expect(spt.meets31Day).toBe(false);
    // The weighted total clears 183 on its own.
    expect(spt.weightedDays).toBeGreaterThan(SPT_THRESHOLD);
    // But the test is still not met, because both conditions are required.
    expect(spt.meetsOnDaysAlone).toBe(false);
    expect(spt.verdict).toContain("31-day minimum");
  });

  it("reports the test met when both conditions hold", () => {
    const r = countI94Days(
      [{ arrival: "2026-01-01", departure: "2026-09-30" }],
      { asOf, taxYear: 2026 },
    );
    const spt = r.spt!;
    expect(spt.meets31Day).toBe(true);
    expect(spt.meets183Day).toBe(true);
    expect(spt.meetsOnDaysAlone).toBe(true);
  });

  it("never claims a residency determination", () => {
    const r = countI94Days(
      [{ arrival: "2026-01-01", departure: "2026-09-30" }],
      { asOf, taxYear: 2026 },
    );
    const text = r.spt!.verdict.toLowerCase();
    expect(text).toContain("not a residency determination");
    expect(text).not.toContain("you are a resident alien");
  });
});

describe("input validation", () => {
  it("rejects a departure before its arrival", () => {
    const r = countI94Days(
      [{ arrival: "2026-05-10", departure: "2026-05-01" }],
      { asOf },
    );
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/before its arrival/);
  });

  it("rejects an impossible calendar date", () => {
    const r = countI94Days([{ arrival: "2026-02-31" }], { asOf });
    expect(r.valid).toBe(false);
  });

  it("rejects an empty set", () => {
    expect(countI94Days([], { asOf }).valid).toBe(false);
    expect(countI94Days([{}], { asOf }).valid).toBe(false);
  });

  it("rejects a bad as-of date", () => {
    const r = countI94Days([{ arrival: "2026-01-01" }], { asOf: "nope" });
    expect(r.valid).toBe(false);
  });
});

describe("parsing pasted travel history", () => {
  it("pairs arrival and departure rows", () => {
    const { segments, skipped } = parseTravelHistory(`
      2026-01-05  Arrival  JFK
      2026-02-10  Departure  JFK
      2026-05-01  Arrival  SFO
    `);
    expect(skipped).toEqual([]);
    expect(segments).toEqual([
      { arrival: "2026-01-05", departure: "2026-02-10" },
      { arrival: "2026-05-01" },
    ]);
  });

  it("reads D-MMM-YYYY and MM/DD/YYYY dates", () => {
    const { segments } = parseTravelHistory(`
      5 Jan 2026 Arrival
      10/02/2026 Departure
    `);
    expect(segments[0]).toEqual({
      arrival: "2026-01-05",
      departure: "2026-10-02",
    });
  });

  it("reports lines it could not read rather than dropping them", () => {
    const { segments, skipped } = parseTravelHistory(`
      Travel History for TRAVELLER
      2026-01-05 Arrival JFK
      some header row with no date
    `);
    expect(segments).toHaveLength(1);
    expect(skipped).toHaveLength(2);
  });

  it("handles a departure with no prior arrival", () => {
    const { segments } = parseTravelHistory("2026-03-01 Departure LAX");
    expect(segments).toEqual([{ departure: "2026-03-01" }]);
  });
});
