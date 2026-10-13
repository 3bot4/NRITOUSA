import { describe, expect, it } from "vitest";
import {
  PROJECTED_MONTHS,
  PROJECTED_BANNER,
  LAST_PUBLISHED_MONTH,
  WINDOW,
  fiscalStage,
  indiaEbProjections,
  isProjectedMonth,
  monthsBetween,
  projectCutoff,
  projectedMonthForSlug,
  projectedMonthDescription,
  projectedMonthSlugs,
  projectionTable,
  readSeries,
} from "./visaBulletinProjections";
import { PUBLISHED_MONTHS, monthSlug, slugToMonth } from "./visaBulletinMonths";

describe("status lists cannot contradict each other", () => {
  // The flip from projected to official is a data edit. If someone adds a
  // month to PUBLISHED_MONTHS and forgets to remove it from PROJECTED_MONTHS,
  // two different pages claim the same URL. This is the guard.
  it("never lists a month as both published and projected", () => {
    const overlap = PROJECTED_MONTHS.filter(
      (m) => PUBLISHED_MONTHS.indexOf(m) !== -1,
    );
    expect(overlap).toEqual([]);
  });

  it("projects only months after the last published bulletin", () => {
    for (const m of PROJECTED_MONTHS) {
      expect(m > LAST_PUBLISHED_MONTH).toBe(true);
    }
  });

  it("round-trips every projected month through its slug", () => {
    for (const m of PROJECTED_MONTHS) {
      expect(slugToMonth(monthSlug(m))).toBe(m);
      expect(projectedMonthForSlug(monthSlug(m))).toBe(m);
    }
  });

  it("returns null for a slug that is not a projected month", () => {
    expect(projectedMonthForSlug("eb2-india")).toBeNull();
    expect(projectedMonthForSlug("september-2026")).toBeNull();
    expect(projectedMonthForSlug("not-a-month")).toBeNull();
  });

  it("keeps no forecast word in any slug", () => {
    for (const slug of projectedMonthSlugs()) {
      expect(slug).not.toMatch(/predict|project|forecast|expect|outlook/i);
      expect(slug).toMatch(/^[a-z]+-\d{4}$/);
    }
  });

  it("orders the slugs newest first", () => {
    const slugs = projectedMonthSlugs();
    const months = slugs.map((s) => slugToMonth(s)!);
    const sortedDesc = months.slice().sort().reverse();
    expect(months).toEqual(sortedDesc);
  });

  it("recognises its own months", () => {
    expect(isProjectedMonth(PROJECTED_MONTHS[0])).toBe(true);
    expect(isProjectedMonth("2026-09")).toBe(false);
  });
});

describe("reading the archive", () => {
  it("expands the sparse change-point series into one row per month", () => {
    const series = readSeries("eb2", "india", "categories", "2026-10");
    expect(series.length).toBeGreaterThan(40);
    // Ascending, no gaps.
    for (let i = 1; i < series.length; i += 1) {
      expect(series[i].month > series[i - 1].month).toBe(true);
    }
    expect(series[series.length - 1].month).toBe("2026-10");
  });

  it("carries a cutoff forward until the next change-point", () => {
    const series = readSeries("eb2", "india", "categories", "2026-10");
    const at = (m: string) => series.find((p) => p.month === m)!;
    // The archive records no EB-2 India change between April and May 2026.
    expect(at("2026-04").fad).toBe("2014-07-15");
    expect(at("2026-05").fad).toBe("2014-07-15");
  });

  it("preserves U as a state rather than converting it to a date", () => {
    const series = readSeries("eb2", "india", "categories", "2026-10");
    const at = (m: string) => series.find((p) => p.month === m)!;
    expect(at("2026-07").fad).toBe("U");
    expect(at("2026-08").fad).toBe("U");
    expect(at("2026-09").fad).toBe("U");
    // And the FY2027 reset is a real date again.
    expect(at("2026-10").fad).toBe("2013-11-01");
  });

  it("stops at the requested month", () => {
    const series = readSeries("eb3", "india", "categories", "2025-12");
    expect(series[series.length - 1].month).toBe("2025-12");
  });

  it("returns nothing for a series the archive does not hold", () => {
    expect(readSeries("eb9", "atlantis", "categories", "2026-10")).toEqual([]);
  });

  it("reads family series out of the same flat namespace", () => {
    const series = readSeries("f2a", "india", "family", "2026-10");
    expect(series.length).toBeGreaterThan(10);
    expect(series[series.length - 1].fad).toBe("2026-09-22");
  });
});

describe("the method", () => {
  it("excludes C and U transitions from the arithmetic", () => {
    // EB-2 India went Unavailable for three bulletins inside the window, then
    // returned with a date. Those four transitions must not be counted as
    // movement of some number of days.
    const p = projectCutoff("eb2", "india", "fad", "2026-11");
    expect(p.excludedMonths).toBeGreaterThan(0);
    // No individual observed advance may be an absurd number of days, which is
    // what treating "U" as a date produces.
    for (const d of p.observedAdvances) {
      expect(d).toBeLessThan(1000);
      expect(d).toBeGreaterThan(0);
    }
  });

  it("uses the last published bulletin as the basis, not the target month", () => {
    const nov = projectCutoff("eb2", "india", "fad", "2026-11");
    const jan = projectCutoff("eb2", "india", "fad", "2027-01");
    expect(nov.basisMonth).toBe(LAST_PUBLISHED_MONTH);
    expect(jan.basisMonth).toBe(LAST_PUBLISHED_MONTH);
    // Same window, same sample — only the horizon differs.
    expect(jan.sampleSize).toBe(nov.sampleSize);
    expect(jan.perMonthAdvance).toBe(nov.perMonthAdvance);
  });

  it("always sets the low bound to no movement", () => {
    for (const m of PROJECTED_MONTHS) {
      for (const row of indiaEbProjections(m)) {
        expect(row.fad.low).toBe(row.fad.basis);
        expect(row.dff.low).toBe(row.dff.basis);
      }
    }
  });

  it("widens the range as the horizon lengthens", () => {
    const nov = projectCutoff("eb3", "india", "fad", "2026-11");
    const dec = projectCutoff("eb3", "india", "fad", "2026-12");
    const jan = projectCutoff("eb3", "india", "fad", "2027-01");
    expect(nov.horizon).toBe(1);
    expect(dec.horizon).toBe(2);
    expect(jan.horizon).toBe(3);
    expect(dec.highAdvanceDays).toBeGreaterThan(nov.highAdvanceDays);
    expect(jan.highAdvanceDays).toBeGreaterThan(dec.highAdvanceDays);
  });

  it("never projects a cutoff past the bulletin's own month", () => {
    for (const m of PROJECTED_MONTHS) {
      const rows = projectionTable(m, "categories", ["india", "china", "row", "mexico", "philippines"]);
      for (const row of rows) {
        for (const p of [row.fad, row.dff]) {
          if (p.stateOnly) continue;
          const iso = /^\d{4}-\d{2}-\d{2}$/.exec(p.high);
          if (!iso) continue;
          expect(p.high <= `${m}-01`).toBe(true);
        }
      }
    }
  });

  it("says 'or Current' when the high bound hits the ceiling", () => {
    const rows = projectionTable("2027-01", "categories", ["india"]);
    const clamped = rows.flatMap((r) => [r.fad, r.dff]).filter((p) => p.reachesCurrent);
    for (const p of clamped) {
      expect(p.rangeLabel).toContain("or Current");
    }
  });

  it("projects no date from a state-only basis", () => {
    // Synthesise the condition by reading a category that is Current for ROW.
    const p = projectCutoff("eb1", "row", "fad", "2026-11");
    if (p.stateOnly) {
      expect(p.highAdvanceDays).toBe(0);
      expect(p.low).toBe(p.high);
      expect(p.method).toMatch(/state and not a date|no backlog/);
    }
  });

  it("states its own basis in every method sentence", () => {
    for (const row of indiaEbProjections("2026-11")) {
      expect(row.fad.method.length).toBeGreaterThan(60);
      expect(row.dff.method.length).toBeGreaterThan(60);
    }
  });

  it("carries a downside note wherever the window contains a reversal", () => {
    const eb2 = projectCutoff("eb2", "india", "fad", "2026-11");
    expect(eb2.retrogressedMonths + eb2.excludedMonths).toBeGreaterThan(0);
    expect(eb2.downside).toBeDefined();
    expect(eb2.downside).toContain("Retrogression");
  });

  it("reports the sample size so a thin basis is visible", () => {
    for (const row of indiaEbProjections("2026-11")) {
      expect(row.fad.sampleSize).toBeGreaterThanOrEqual(0);
      expect(row.fad.sampleSize).toBeLessThanOrEqual(WINDOW);
      expect(["none", "low", "moderate"]).toContain(row.fad.confidence);
    }
  });

  it("skips category/country pairs the archive knows nothing about", () => {
    const rows = projectionTable("2026-11", "categories", ["atlantis"]);
    expect(rows).toEqual([]);
  });
});

describe("month arithmetic", () => {
  it("counts whole bulletin months forward", () => {
    expect(monthsBetween("2026-10", "2026-11")).toBe(1);
    expect(monthsBetween("2026-10", "2027-01")).toBe(3);
    expect(monthsBetween("2026-12", "2027-01")).toBe(1);
  });

  it("never returns a negative horizon", () => {
    expect(monthsBetween("2026-11", "2026-10")).toBe(0);
  });
});

describe("fiscal-year stage", () => {
  it("places October as month 1 of the next fiscal year", () => {
    expect(fiscalStage("2026-10")).toMatchObject({ fy: 2027, monthOfFy: 1 });
    expect(fiscalStage("2026-11")).toMatchObject({ fy: 2027, monthOfFy: 2 });
    expect(fiscalStage("2027-01")).toMatchObject({ fy: 2027, monthOfFy: 4 });
    expect(fiscalStage("2027-09")).toMatchObject({ fy: 2027, monthOfFy: 12 });
  });

  it("describes the early-year stage without predicting an outcome", () => {
    const note = fiscalStage("2026-11").note;
    expect(note).toContain("archive shows");
    expect(note).not.toMatch(/will advance|we expect|is expected to/i);
  });
});

describe("page copy honesty", () => {
  it("says in the banner that the bulletin is not published", () => {
    expect(PROJECTED_BANNER).toContain("not been published");
    expect(PROJECTED_BANNER).toContain("Projected");
  });

  it("labels the description as a projection and never as official", () => {
    for (const m of PROJECTED_MONTHS) {
      const d = projectedMonthDescription(m);
      expect(d.toLowerCase()).toContain("project");
      expect(d).toContain("not published yet");
      expect(d.toLowerCase()).not.toContain("official bulletin shows");
    }
  });

  it("never uses the word caveat anywhere in generated copy", () => {
    const blob = PROJECTED_MONTHS.map((m) =>
      JSON.stringify(indiaEbProjections(m)) + projectedMonthDescription(m) + fiscalStage(m).note,
    ).join(" ");
    expect(blob.toLowerCase()).not.toContain("caveat");
  });

  it("never asserts a USCIS chart determination in projected copy", () => {
    const blob = PROJECTED_MONTHS.map((m) => JSON.stringify(indiaEbProjections(m))).join(" ");
    expect(blob).not.toMatch(/USCIS (is accepting|accepts|will accept)/i);
  });
});
