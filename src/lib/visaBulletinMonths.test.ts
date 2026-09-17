import { describe, it, expect } from "vitest";
import {
  PUBLISHED_MONTHS,
  monthSlug,
  slugToMonth,
  monthLabel,
  previousMonth,
  getSnapshot,
  publishedMonthSlugs,
  describeMovement,
  movementTable,
  indiaEmploymentMovement,
  monthPath,
  EB_ORDER,
} from "./visaBulletinMonths";

describe("month slugs", () => {
  it("round-trips a bulletin month through its slug", () => {
    for (const m of ["2026-01", "2026-09", "2026-12", "2027-10"]) {
      expect(slugToMonth(monthSlug(m))).toBe(m);
    }
  });

  it("builds the slug people actually search for", () => {
    expect(monthSlug("2026-09")).toBe("september-2026");
    expect(monthPath("2026-09")).toBe("/visa-bulletin/september-2026");
  });

  it("labels a month the way the bulletin does", () => {
    expect(monthLabel("2026-09")).toBe("September 2026");
  });

  it("returns null for slugs that are not months, so cluster slugs still route", () => {
    for (const slug of ["eb2-india", "retrogression", "priority-date", "october-2026-predictions", "notamonth-2026", "2026-09"]) {
      expect(slugToMonth(slug)).toBeNull();
    }
  });

  it("steps back across a year boundary", () => {
    expect(previousMonth("2026-01")).toBe("2025-12");
    expect(previousMonth("2026-09")).toBe("2026-08");
  });
});

describe("PUBLISHED_MONTHS is only ever real, published bulletins", () => {
  it("has a snapshot behind every listed month", () => {
    expect(PUBLISHED_MONTHS.length).toBeGreaterThan(0);
    for (const m of PUBLISHED_MONTHS) {
      const snap = getSnapshot(m);
      expect(snap, `no snapshot for ${m}`).not.toBeNull();
      expect(snap!.bulletinMonth).toBe(m);
    }
  });

  it("has the previous month's snapshot too, so movement can be computed", () => {
    for (const m of PUBLISHED_MONTHS) {
      expect(getSnapshot(previousMonth(m)), `no prior snapshot for ${m}`).not.toBeNull();
    }
  });

  it("lists slugs newest first", () => {
    const slugs = publishedMonthSlugs();
    expect(slugs).toEqual(
      PUBLISHED_MONTHS.slice().sort().reverse().map(monthSlug)
    );
  });

  it("does not publish a month page for the unreleased October 2026 bulletin", () => {
    // Guards the rule that forecasts stay on the predictions page.
    expect(PUBLISHED_MONTHS).not.toContain("2026-10");
  });
});

describe("describeMovement", () => {
  it("reports forward movement in weeks and months, not raw days", () => {
    // Under 14 days reads in days, under 60 in weeks (the unit the bulletin
    // commentary uses), and beyond that in months.
    expect(describeMovement("2014-01-01", "2014-01-06").label).toBe("Advanced 5 days");
    expect(describeMovement("2014-01-01", "2014-01-22").label).toBe("Advanced 3 weeks");
    expect(describeMovement("2014-01-01", "2014-02-15").label).toBe("Advanced 6 weeks");
    expect(describeMovement("2014-01-01", "2014-06-01").label).toBe("Advanced 5 months");
  });

  it("reports retrogression as retrogression", () => {
    const m = describeMovement("2014-06-01", "2014-01-01");
    expect(m.kind).toBe("retrogressed");
    expect(m.days).toBeLessThan(0);
    expect(m.label).toMatch(/^Retrogressed/);
  });

  it("treats U as a state, never as a date — the classic silent bug", () => {
    // "U" parsed as a date would produce a confident, enormous day count.
    const toU = describeMovement("2014-07-15", "U");
    expect(toU.kind).toBe("became-unavailable");
    expect(toU.days).toBe(0);
    expect(toU.label).toBe("Became unavailable");

    const fromU = describeMovement("U", "2014-07-15");
    expect(fromU.kind).toBe("left-unavailable");
    expect(fromU.days).toBe(0);
  });

  it("treats C as a state too", () => {
    expect(describeMovement("2024-09-01", "C").kind).toBe("became-current");
    expect(describeMovement("C", "2024-09-01").kind).toBe("retrogressed");
    expect(describeMovement("C", "C").label).toBe("Current — no backlog");
    expect(describeMovement("U", "U").label).toBe("Still unavailable");
  });

  it("says so when there is nothing to compare against", () => {
    expect(describeMovement("", "2024-09-01").kind).toBe("no-comparison");
    expect(describeMovement("2024-09-01", "").kind).toBe("no-comparison");
    expect(describeMovement("garbage", "also-garbage").kind).toBe("no-comparison");
  });

  it("reports an identical date as no movement", () => {
    expect(describeMovement("2014-01-01", "2014-01-01").label).toBe("No movement");
  });
});

describe("movementTable", () => {
  const month = PUBLISHED_MONTHS[0];

  it("covers every employment category and country in the snapshot", () => {
    const rows = movementTable(month, "categories");
    expect(rows.length).toBeGreaterThan(20);
    expect(new Set(rows.map((r) => r.country)).size).toBeGreaterThan(1);
  });

  it("covers the family categories too", () => {
    const rows = movementTable(month, "family");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => /^F/.test(r.categoryLabel))).toBe(true);
  });

  it("never invents a movement for a pair missing from the snapshot", () => {
    for (const row of movementTable(month, "categories")) {
      expect(row.fad.to).toBeTruthy();
    }
  });

  it("returns an empty table for a month with no snapshot", () => {
    expect(movementTable("1999-01", "categories")).toEqual([]);
  });

  it("orders the India employment rows the way the bulletin prints them", () => {
    const rows = indiaEmploymentMovement(month);
    expect(rows.every((r) => r.country === "india")).toBe(true);
    const seen = rows.map((r) => r.category);
    const expected = EB_ORDER.filter((c) => seen.indexOf(c) !== -1);
    expect(seen).toEqual(expected);
  });

  it("reports India EB-2 as unavailable in the September 2026 bulletin", () => {
    // Pins the page's headline fact against the snapshot data.
    const eb2 = indiaEmploymentMovement("2026-09").filter((r) => r.category === "eb2")[0];
    expect(eb2.fad.to).toBe("U");
  });
});
