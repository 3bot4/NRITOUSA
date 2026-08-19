import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { visaBulletinChildPages } from "@/lib/visaBulletinCluster";
import { getSeries, monthIndex, type SeriesPoint, type Cutoff } from "@/lib/visa-bulletin";

const SRC = join(__dirname, "..");
const PATH = "/visa-bulletin/october-2026-predictions";
const PAGE = readFileSync(
  join(SRC, "app/visa-bulletin/october-2026-predictions/page.tsx"),
  "utf8"
);
/** JSX wraps prose across lines, so match copy against a flattened copy. */
const FLAT = PAGE.replace(/\s+/g, " ");

/** Step carry-forward — the cutoff in force for a given bulletin month. */
function cutoffAt(points: SeriesPoint[], ym: string): Cutoff | null {
  const target = monthIndex(ym);
  let v: Cutoff | null = null;
  for (const [month, cutoff] of points) {
    if (monthIndex(month) > target) break;
    v = cutoff;
  }
  return v;
}

describe("October 2026 predictions — standalone route, not a cluster child", () => {
  it("is NOT registered as a /visa-bulletin/[slug] child", () => {
    // Both routes would otherwise claim the same URL.
    expect(
      visaBulletinChildPages.some((p) => p.slug === "october-2026-predictions")
    ).toBe(false);
  });

  it("keeps its own document layout rather than the cluster article template", () => {
    // The shared template pieces must not be imported here (the file may still
    // name them in its explanatory header comment).
    for (const shared of ["ArticleBody", "ReviewedByline", "VisaBulletinCategoryStatus"]) {
      expect(PAGE, `should not import ${shared}`).not.toMatch(
        new RegExp(`^import .*${shared}`, "m")
      );
    }
    // ...and the document's own furniture must be present.
    for (const cls of ["kicker", "tldr", "tiles", "term", "cite", "byline"]) {
      expect(PAGE, `missing .${cls}`).toContain(cls);
    }
  });

  it("is listed in the sitemap explicitly, since nothing auto-includes it now", () => {
    const sitemap = readFileSync(join(SRC, "lib/sitemap-data.ts"), "utf8");
    expect(sitemap).toContain(PATH);
  });

  it("is linked from the hub and from sibling cluster pages", () => {
    const hub = readFileSync(join(SRC, "app/visa-bulletin/page.tsx"), "utf8");
    expect(hub).toContain(PATH);

    const inbound = visaBulletinChildPages.filter((p) => p.content.includes(PATH));
    expect(inbound.length).toBeGreaterThanOrEqual(3);
    const slugs = inbound.map((p) => p.slug);
    expect(slugs).toContain("eb2-india");
    expect(slugs).toContain("retrogression");
  });

  it("carries Article + Breadcrumb + FAQPage structured data", () => {
    for (const fn of ["breadcrumbJsonLd", "faqJsonLd", "jsonLdGraph"]) {
      expect(PAGE).toContain(fn);
    }
    const questions = PAGE.match(/question:/g) ?? [];
    expect(questions.length).toBeGreaterThanOrEqual(5);
  });
});

describe("October 2026 predictions — the forecast is never overstated", () => {
  it("says the DOS advance is 'likely', never committed or guaranteed", () => {
    expect(PAGE).toMatch(/likely/);
    expect(PAGE).not.toMatch(/State Department has committed/i);
    expect(PAGE).not.toMatch(/DOS has committed/i);
  });

  it("carries the DOS condition on demand and the FY2027 annual limit", () => {
    expect(FLAT).toMatch(/dependent on the demand for EB-2 numbers/);
    expect(FLAT).toMatch(/FY ?2027 annual limit/);
  });

  it("flags that only the EB-2 row rests on DOS guidance", () => {
    expect(FLAT).toMatch(/Only the EB-2 row rests on an on-the-record DOS statement/);
    expect(FLAT).toMatch(/guaranteed no specific date/i);
  });
});

describe("October 2026 predictions — figures match the bulletin data", () => {
  const series = getSeries("eb2", "india")!;

  it("the October cutoffs quoted on the page match history.json", () => {
    expect(cutoffAt(series.fad, "2023-10")).toBe("2012-01-01");
    expect(cutoffAt(series.fad, "2024-10")).toBe("2012-07-15");
    expect(cutoffAt(series.fad, "2025-10")).toBe("2013-04-01");
    expect(cutoffAt(series.dff, "2023-10")).toBe("2012-05-15");
    expect(cutoffAt(series.dff, "2024-10")).toBe("2013-01-01");
    expect(cutoffAt(series.dff, "2025-10")).toBe("2013-12-01");
  });

  it("July 15, 2014 was the FY2026 high-water mark, first reached in April 2026", () => {
    expect(cutoffAt(series.fad, "2026-04")).toBe("2014-07-15");
    expect(cutoffAt(series.fad, "2026-05")).toBe("2014-07-15");
    expect(FLAT).toContain("July 15, 2014");
    expect(FLAT).toMatch(/April 2026<\/strong> bulletin and held through May/);
  });

  it("EB-2 India is Unavailable in the current bulletin, as the page states", () => {
    expect(cutoffAt(series.fad, "2026-07")).toBe("U");
    expect(FLAT).toMatch(/Unavailable in the July 2026 bulletin/);
  });

  it("the stated month movements match the data", () => {
    const months = (a: string, b: string) => monthIndex(b) - monthIndex(a);
    expect(months("2013-04-01", "2014-07-15")).toBeCloseTo(15.5, 1);
    expect(months("2012-07-15", "2013-04-01")).toBeCloseTo(8.5, 1);
    expect(months("2012-01-01", "2012-07-15")).toBeCloseTo(6.5, 1);
    expect(months("2013-09-01", "2014-07-15")).toBeCloseTo(10.5, 1);
    for (const m of ["+15.5 months", "+8.5 months", "+6.5 months", "−3 months"]) {
      expect(FLAT).toContain(m);
    }
  });

  it("reports FY2026 supply as 186,000 — not a monotonic 'shrinking supply' story", () => {
    expect(FLAT).toContain("186,000");
    expect(FLAT).toMatch(/has not simply shrunk/);
  });

  it("frames ~2,802 as a floor and gives India's actual FY2026 EB-2 number", () => {
    expect(FLAT).toContain("~2,802");
    expect(FLAT).toMatch(/a floor, not what it actually receives/);
    expect(FLAT).toMatch(/~9,300 EB-2 numbers/);
    expect(FLAT).toMatch(/otherwise unused/);
  });

  it("attributes the Cato backlog figures correctly", () => {
    expect(FLAT).toContain("1.8 million");
    expect(FLAT).toContain("1.1 million");
    expect(FLAT).toContain("134 years");
  });
});
