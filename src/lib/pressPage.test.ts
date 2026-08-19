import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = join(__dirname, "..");
const PRESS = join(SRC, "app/press/page.tsx");
const PAGE = readFileSync(PRESS, "utf8");
const FLAT = PAGE.replace(/\s+/g, " ");

describe("/press — the route the analysis pages cite", () => {
  it("exists as a route", () => {
    // It shipped as a 404 while two links already pointed at it.
    expect(existsSync(PRESS)).toBe(true);
  });

  it("is reachable from every page that links to it", () => {
    const october = readFileSync(
      join(SRC, "app/visa-bulletin/october-2026-predictions/page.tsx"),
      "utf8"
    );
    expect(october).toContain('href="/press"');
  });

  it("is listed in the sitemap", () => {
    const sitemap = readFileSync(join(SRC, "lib/sitemap-data.ts"), "utf8");
    expect(sitemap).toContain('e("/press"');
  });

  it("carries Organization + WebPage + Breadcrumb structured data", () => {
    for (const t of ["Organization", "WebPage", "breadcrumbJsonLd"]) {
      expect(PAGE).toContain(t);
    }
  });
});

describe("/press — attribution rules", () => {
  it("labels the LayoffNext report as a sister publication, not our own", () => {
    expect(FLAT).toMatch(/sister publication/i);
    expect(FLAT).toMatch(/Cite it to LayoffNext, not to NRItoUSA/);
  });

  it("links the report to its canonical LayoffNext URL, not a re-hosted copy", () => {
    expect(PAGE).toContain(
      "https://www.layoffnext.com/reports/h1b-layoffs-vs-overall-layoffs-2026"
    );
    expect(PAGE).toContain(
      "https://www.layoffnext.com/reports/layoffnext-h1b-layoffs-vs-overall-layoffs-2026.pdf"
    );
    // A local copy would go stale the moment LayoffNext updates the report.
    expect(PAGE).not.toMatch(/href="\/[^"]*layoffnext[^"]*\.pdf"/i);
  });

  it("warns that the H-1B layoff figures are modelled, not counted", () => {
    expect(FLAT).toMatch(/no public dataset identifies laid-off workers by visa status/i);
    expect(FLAT).toMatch(/directional estimates, not counts/i);
  });

  it("tells journalists LCAs are sponsorship filings, not visas", () => {
    expect(FLAT).toMatch(/requests to employ/i);
    expect(FLAT).toMatch(/sponsorship filings.{0,40}rather than/i);
  });

  it("carries the Census definition and vintage for population figures", () => {
    expect(PAGE).toContain("CENSUS_STATE_DEFINITION");
    expect(PAGE).toContain("INDIAN_POP_UPDATED_HUMAN");
  });

  it("states the publisher and disclaims legal advice", () => {
    expect(FLAT).toMatch(/published by \{site\.owner\}/);
    expect(FLAT).toMatch(/not legal advice/i);
  });
});

describe("/press — the dataset descriptions stay honest", () => {
  it("describes the bulletin range from the data, not a hardcoded month", () => {
    expect(PAGE).toContain("formatBulletinMonth");
    expect(PAGE).toContain("bulletin.month");
  });

  it("every dataset says what it actually measures", () => {
    // Each card carries a "What it is" qualifier so a figure cannot be lifted
    // without its definition.
    const whatItIs = PAGE.match(/What it is:/g) ?? [];
    expect(whatItIs.length).toBeGreaterThanOrEqual(1);
    const definitions = PAGE.match(/definition:/g) ?? [];
    expect(definitions.length).toBeGreaterThanOrEqual(4);
  });
});
