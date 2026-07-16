/**
 * Search Console CSV parsing.
 *
 * The real 2026-07-16 export arrived in Compare mode, whose headers are
 * "Last 28 days Clicks" / "Previous 28 days Clicks" rather than "Clicks". The
 * importer matched only the bare names, so it skipped every file — loudly, but
 * it skipped them. These tests pin the header shapes Search Console actually
 * emits so that regression cannot return silently.
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { importDir, parseCsv, toPath } from "./lib/gsc";

const SITE = "https://www.nritousa.com";

/** Write a throwaway export folder and import it. */
function importFixture(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), "gsc-"));
  for (const [name, body] of Object.entries(files)) {
    writeFileSync(join(dir, name), body);
  }
  return importDir(dir, SITE);
}

/** The exact header Search Console emits with Compare enabled. */
const COMPARE_HEADER =
  "Top pages,Last 28 days Clicks,Previous 28 days Clicks," +
  "Last 28 days Impressions,Previous 28 days Impressions," +
  "Last 28 days CTR,Previous 28 days CTR," +
  "Last 28 days Position,Previous 28 days Position";

describe("Compare-mode exports (the 2026-07-16 regression)", () => {
  it("reads both periods from one file", () => {
    const { rows, files } = importFixture({
      "Pages.csv":
        `${COMPARE_HEADER}\n` +
        `${SITE}/indian-passport-renewal-usa,1,0,932,34,0.11%,0%,49.91,44.12\n`,
    });

    expect(files[0].comparison).toBe(true);
    expect(rows).toHaveLength(1);
    const r = rows[0];
    expect(r.page).toBe("/indian-passport-renewal-usa");
    expect(r.clicks).toBe(1);
    expect(r.impressions).toBe(932);
    expect(r.ctr).toBeCloseTo(0.0011, 5);
    expect(r.position).toBeCloseTo(49.91, 2);
    expect(r.previous).toEqual({
      clicks: 0,
      impressions: 34,
      ctr: 0,
      position: 44.12,
    });
  });

  it("treats a previous position of 0 as unknown, not rank #1", () => {
    // Search Console writes 0 when the page had no data in that period.
    // Reading it as rank 0 would invent a catastrophic ranking collapse.
    const { rows } = importFixture({
      "Pages.csv":
        `${COMPARE_HEADER}\n` +
        `${SITE}/indian-passport-renewal-usa/houston-texas,1,0,46,0,2.17%,0%,13.04,0\n`,
    });
    expect(rows[0].previous?.position).toBeNull();
  });

  it("keeps a row that lost all traffic, so declines are visible", () => {
    const { rows } = importFixture({
      "Pages.csv": `${COMPARE_HEADER}\n${SITE}/gone,0,5,0,300,0%,1.6%,0,12\n`,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].previous?.impressions).toBe(300);
  });

  it("still drops rows empty in both periods", () => {
    const { rows } = importFixture({
      "Pages.csv": `${COMPARE_HEADER}\n${SITE}/nothing,0,0,0,0,0%,0%,0,0\n`,
    });
    expect(rows).toEqual([]);
  });

  it("captures the export scope from Filters.csv", () => {
    // Totals from a page-filtered export are that page's, not the site's —
    // the scope must survive into the report or the numbers get misread.
    const { filters } = importFixture({
      "Filters.csv":
        "Filter,Value\nSearch type,Web\nDate,Last 28 days\nPage,+/indian-passport-renewal-usa\n",
      "Pages.csv": `${COMPARE_HEADER}\n${SITE}/x,1,0,10,0,10%,0%,5,0\n`,
    });
    expect(filters.Page).toBe("+/indian-passport-renewal-usa");
    expect(filters.Date).toBe("Last 28 days");
  });

  it("still reads a plain non-compare export", () => {
    const { rows, files } = importFixture({
      "Queries.csv": "Top queries,Clicks,Impressions,CTR,Position\nfoo,2,50,4%,7.5\n",
    });
    expect(files[0].comparison).toBe(false);
    expect(rows[0]).toMatchObject({ query: "foo", clicks: 2, impressions: 50, position: 7.5 });
    expect(rows[0].previous).toBeNull();
  });
});

describe("parseCsv", () => {
  it("parses quoted fields containing commas", () => {
    const rows = parseCsv('a,b\n"x, y",2\n');
    expect(rows).toEqual([
      ["a", "b"],
      ["x, y", "2"],
    ]);
  });

  it("parses escaped double quotes", () => {
    expect(parseCsv('q\n"say ""hi"""\n')[1]).toEqual(['say "hi"']);
  });

  it("strips the UTF-8 BOM Search Console prepends", () => {
    // With the BOM attached, the first header cell reads "﻿Top queries"
    // and never matches the "query" alias — every query row would be dropped.
    expect(parseCsv("﻿Top queries,Clicks\nfoo,1\n")[0][0]).toBe("Top queries");
  });

  it("handles CRLF line endings", () => {
    expect(parseCsv("a,b\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("skips blank lines", () => {
    expect(parseCsv("a\n\n1\n")).toEqual([["a"], ["1"]]);
  });
});

describe("toPath", () => {
  const site = "https://www.nritousa.com";

  it("reduces an on-site URL to its path", () => {
    expect(toPath(`${site}/indian-passport-renewal-usa`, site)).toBe(
      "/indian-passport-renewal-usa",
    );
  });

  it("normalizes a trailing slash so /foo/ and /foo aggregate together", () => {
    expect(toPath(`${site}/foo/`, site)).toBe("/foo");
  });

  it("keeps the root as /", () => {
    expect(toPath(`${site}/`, site)).toBe("/");
  });

  it("treats the apex host as the same site as www", () => {
    expect(toPath("https://nritousa.com/foo", site)).toBe("/foo");
  });

  it("leaves an off-site URL untouched", () => {
    expect(toPath("https://example.com/foo", site)).toBe("https://example.com/foo");
  });
});
