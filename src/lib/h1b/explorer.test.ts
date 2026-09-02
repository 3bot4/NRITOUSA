import { describe, expect, it } from "vitest";
import {
  getEmployerExplorer,
  rowsToCsv,
  searchRoleTitles,
  getDataAsOf,
  MAX_EXPORT_ROWS,
} from "./explorer";

/**
 * Runs against the real committed rollup (data/h1b/sponsors.csv), not a
 * fixture: the point of these is that the browse view the tool page opens on
 * actually reconciles with the dataset, so a bad ETL run or a regression in the
 * rollup shows up here rather than as a wrong leaderboard in production.
 *
 * The absolute totals are asserted loosely (ranges, not exact counts) so a
 * legitimate quarterly data refresh doesn't turn the suite red — the invariants
 * that must hold exactly are the internal ones (sorting, filtering, paging).
 */

describe("getEmployerExplorer — default browse view", () => {
  it("returns a ranked page of named employers with no filters at all", async () => {
    const r = await getEmployerExplorer({});
    expect(r.rows).toHaveLength(25);
    expect(r.page).toBe(1);
    // The complaint this view exists to fix: company names, on load.
    expect(r.rows[0].employer).toBeTruthy();
    expect(r.rows.every((x) => x.employer.trim().length > 0)).toBe(true);
    expect(r.total).toBeGreaterThan(20_000);
    expect(r.summary.filings).toBeGreaterThan(100_000);
    expect(r.summary.employers).toBe(r.total);
  });

  it("ranks by filing volume, descending", async () => {
    const { rows } = await getEmployerExplorer({ pageSize: 100 });
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].lca_count).toBeGreaterThanOrEqual(rows[i].lca_count);
    }
  });

  it("gives every row the derived fields the table renders", async () => {
    const { rows } = await getEmployerExplorer({});
    for (const row of rows) {
      expect(row.worker_positions).toBeGreaterThanOrEqual(row.lca_count);
      expect(row.top_role).toBeTruthy();
      expect(row.states.length).toBeGreaterThan(0);
      expect(row.states.length).toBeLessThanOrEqual(4);
      expect(row.state_count).toBeGreaterThanOrEqual(row.states.length);
      expect(row.role_count).toBeGreaterThan(0);
      if (row.median_wage != null) expect(row.median_wage).toBeGreaterThan(0);
    }
  });
});

describe("getEmployerExplorer — filters", () => {
  it("filters by employer name, case-insensitively", async () => {
    const { rows, total } = await getEmployerExplorer({ q: "infosys" });
    expect(total).toBeGreaterThan(0);
    expect(rows.every((r) => r.employer.toLowerCase().includes("infosys"))).toBe(
      true
    );
  });

  it("filters by state and reports only that state on every row", async () => {
    const { rows, summary } = await getEmployerExplorer({ state: "WA" });
    expect(summary.states).toBe(1);
    expect(rows.every((r) => r.states.every((s) => s === "WA"))).toBe(true);
    const national = await getEmployerExplorer({});
    expect(summary.filings).toBeLessThan(national.summary.filings);
  });

  it("filters by occupation title", async () => {
    const { rows, topRoles } = await getEmployerExplorer({
      role: "Data Scientists",
    });
    expect(rows.length).toBeGreaterThan(0);
    expect(
      topRoles.every((t) => t.soc_title.toLowerCase().includes("data scientists"))
    ).toBe(true);
  });

  it("keeps median wages inside the requested band", async () => {
    const { rows } = await getEmployerExplorer({
      wageMin: 200_000,
      pageSize: 50,
    });
    expect(rows.length).toBeGreaterThan(0);
    // Every contributing filing was >= 200k, so the weighted median must be too.
    expect(rows.every((r) => r.median_wage != null && r.median_wage >= 200_000))
      .toBe(true);
  });

  it("drops employers below the minimum filing volume", async () => {
    const { rows, total } = await getEmployerExplorer({ minFilings: 500 });
    expect(rows.every((r) => r.lca_count >= 500)).toBe(true);
    const unfiltered = await getEmployerExplorer({});
    expect(total).toBeLessThan(unfiltered.total);
  });

  it("stacks filters", async () => {
    const { rows } = await getEmployerExplorer({
      state: "CA",
      role: "Software Developers",
      minFilings: 100,
    });
    expect(rows.length).toBeGreaterThan(0);
    expect(
      rows.every(
        (r) =>
          r.lca_count >= 100 &&
          r.states.every((s) => s === "CA") &&
          r.top_role.toLowerCase().includes("software developers")
      )
    ).toBe(true);
  });

  it("returns an empty, non-throwing result for filters nothing matches", async () => {
    const r = await getEmployerExplorer({ q: "zzzzz-no-such-employer" });
    expect(r.total).toBe(0);
    expect(r.rows).toEqual([]);
    expect(r.summary.filings).toBe(0);
    expect(r.summary.medianWage).toBeNull();
    expect(r.page).toBe(1);
    expect(r.pageCount).toBe(1);
  });
});

describe("getEmployerExplorer — sorting", () => {
  it("sorts by employer name ascending by default for that column", async () => {
    const { rows } = await getEmployerExplorer({ sort: "employer" });
    const names = rows.map((r) => r.employer);
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
  });

  it("sorts by wage and never floats undisclosed wages to the top", async () => {
    const desc = await getEmployerExplorer({ sort: "wage", pageSize: 50 });
    for (let i = 1; i < desc.rows.length; i++) {
      const prev = desc.rows[i - 1].median_wage;
      const cur = desc.rows[i].median_wage;
      if (prev == null || cur == null) continue;
      expect(prev).toBeGreaterThanOrEqual(cur);
    }
    const asc = await getEmployerExplorer({ sort: "wage", dir: "asc" });
    expect(asc.rows[0].median_wage).not.toBeNull();
  });

  it("sorts by worker positions", async () => {
    const { rows } = await getEmployerExplorer({ sort: "positions" });
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].worker_positions).toBeGreaterThanOrEqual(
        rows[i].worker_positions
      );
    }
  });
});

describe("getEmployerExplorer — paging", () => {
  it("does not repeat employers across pages and clamps overflow", async () => {
    const p1 = await getEmployerExplorer({ page: 1, pageSize: 25 });
    const p2 = await getEmployerExplorer({ page: 2, pageSize: 25 });
    const names = new Set(p1.rows.map((r) => r.employer));
    expect(p2.rows.some((r) => names.has(r.employer))).toBe(false);
    expect(p1.pageCount).toBe(Math.ceil(p1.total / 25));

    const overflow = await getEmployerExplorer({ page: 1_000_000 });
    expect(overflow.page).toBe(overflow.pageCount);
  });

  it("keeps the summary scoped to the filters, not the page", async () => {
    const p1 = await getEmployerExplorer({ q: "infosys", page: 1, pageSize: 1 });
    const all = await getEmployerExplorer({ q: "infosys", pageSize: 500 });
    expect(p1.rows).toHaveLength(1);
    expect(p1.summary.filings).toBe(all.summary.filings);
    expect(p1.total).toBe(all.total);
    const summed = all.rows.reduce((s, r) => s + r.lca_count, 0);
    expect(summed).toBe(all.summary.filings);
  });
});

describe("facets", () => {
  it("returns clickable occupation and state facets for the filtered set", async () => {
    const { topRoles, topStates } = await getEmployerExplorer({});
    expect(topRoles.length).toBeGreaterThan(0);
    expect(topStates.length).toBeGreaterThan(0);
    for (let i = 1; i < topRoles.length; i++) {
      expect(topRoles[i - 1].lca_count).toBeGreaterThanOrEqual(
        topRoles[i].lca_count
      );
    }
    expect(topStates[0].name).not.toBe(topStates[0].code); // resolved to a full name
  });
});

describe("searchRoleTitles", () => {
  it("returns distinct titles ranked by volume, and nothing for a stub query", async () => {
    const titles = await searchRoleTitles("software");
    expect(titles.length).toBeGreaterThan(0);
    expect(new Set(titles).size).toBe(titles.length);
    expect(titles.every((t) => t.toLowerCase().includes("software"))).toBe(true);
    expect(await searchRoleTitles("s")).toEqual([]);
  });
});

describe("rowsToCsv", () => {
  it("quotes employer names containing commas", async () => {
    const { rows } = await getEmployerExplorer({ pageSize: 100 });
    const csv = rowsToCsv(rows);
    const [header, ...lines] = csv.split("\n");
    expect(header.startsWith("rank,employer,")).toBe(true);
    expect(lines).toHaveLength(rows.length);
    const commaRow = rows.find((r) => r.employer.includes(","));
    if (commaRow) expect(csv).toContain(`"${commaRow.employer}"`);
  });
});

describe("getDataAsOf", () => {
  it("derives the coverage stamp from the data rather than a hardcoded string", async () => {
    expect(await getDataAsOf()).toMatch(/^filings through [A-Z][a-z]+ \d{4}$/);
  });
});

describe("export cap", () => {
  it("honours a page size up to the export cap rather than clamping below it", async () => {
    const r = await getEmployerExplorer({ pageSize: MAX_EXPORT_ROWS });
    expect(r.pageSize).toBe(MAX_EXPORT_ROWS);
    expect(r.rows).toHaveLength(MAX_EXPORT_ROWS);
    expect(rowsToCsv(r.rows).split("\n")).toHaveLength(MAX_EXPORT_ROWS + 1);
  });
});
