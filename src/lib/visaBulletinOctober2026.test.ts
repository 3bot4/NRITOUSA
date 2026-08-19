import { describe, it, expect } from "vitest";
import {
  getVisaBulletinChildPage,
  visaBulletinChildPages,
} from "@/lib/visaBulletinCluster";
import { getSeries, monthIndex, type SeriesPoint, type Cutoff } from "@/lib/visa-bulletin";

const SLUG = "october-2026-predictions";
const page = getVisaBulletinChildPage(SLUG)!;

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

describe("October 2026 predictions page — exists and is wired into the cluster", () => {
  it("is a cluster child page with the expected identity", () => {
    expect(page).toBeTruthy();
    expect(page.slug).toBe(SLUG);
    expect(page.title).toMatch(/October 2026/i);
    expect(page.seoTitle).toMatch(/October 2026 Visa Bulletin Predictions/i);
    expect(page.navLabel).toBe("October 2026 Predictions");
  });

  it("renders the live EB-2 status card by declaring its category", () => {
    // `category` drives <VisaBulletinCategoryStatus> in the [slug] route, so the
    // current cutoffs come from bulletin data rather than hand-written prose.
    expect(page.category).toBe("eb2");
  });

  it("produces FAQ entries for FAQPage schema", () => {
    expect(page.content).toContain("## Frequently asked questions");
    const questions = page.content.match(/^### .+$/gm) ?? [];
    expect(questions.length).toBeGreaterThanOrEqual(5);
  });
});

describe("October 2026 predictions page — the forecast is never overstated", () => {
  it("says the DOS advancement is 'likely', never committed/guaranteed/promised", () => {
    expect(page.content).toMatch(/likely/i);
    // DOS attached a condition and guaranteed nothing — these claims must not appear.
    expect(page.content).not.toMatch(/State Department has committed/i);
    expect(page.content).not.toMatch(/DOS has committed/i);
    expect(page.content).not.toMatch(/guarantee[sd]? (that )?EB-2/i);
  });

  it("carries the DOS condition on demand and the FY2027 annual limit", () => {
    expect(page.content).toMatch(/dependent on the demand for EB-2 numbers/i);
    expect(page.content).toMatch(/FY ?2027 annual limit/i);
  });

  it("labels the page as analysis and every forward-looking row as predicted", () => {
    expect(page.content).toMatch(/analysis, not a published date/i);
    expect(page.content).toMatch(/predicted/i);
    expect(page.content).toMatch(/Confidence/);
  });
});

describe("October 2026 predictions page — factual claims match the bulletin data", () => {
  const series = getSeries("eb2", "india")!;

  it("the October cutoffs quoted in the prose match history.json", () => {
    // Each of these is stated as a published figure in the four-Octobers table.
    expect(cutoffAt(series.fad, "2023-10")).toBe("2012-01-01");
    expect(cutoffAt(series.fad, "2024-10")).toBe("2012-07-15");
    expect(cutoffAt(series.fad, "2025-10")).toBe("2013-04-01");
    expect(cutoffAt(series.dff, "2023-10")).toBe("2012-05-15");
    expect(cutoffAt(series.dff, "2024-10")).toBe("2013-01-01");
    expect(cutoffAt(series.dff, "2025-10")).toBe("2013-12-01");
  });

  it("July 15, 2014 really was the FY2026 high-water mark, reached in April 2026", () => {
    expect(cutoffAt(series.fad, "2026-04")).toBe("2014-07-15");
    expect(cutoffAt(series.fad, "2026-05")).toBe("2014-07-15");
    expect(page.content).toContain("July 15, 2014");
    // The prose credits the April bulletin for the advance, not May.
    expect(page.content).toMatch(/\*\*April 2026\*\* bulletin and held it through May/);
  });

  it("EB-2 India is Unavailable in the current bulletin, as the page states", () => {
    expect(cutoffAt(series.fad, "2026-07")).toBe("U");
    expect(page.content).toMatch(/Unavailable through September 30, 2026/);
  });

  it("the stated month movements match the data", () => {
    const months = (a: string, b: string) => monthIndex(b) - monthIndex(a);
    // +15.5 vs Oct 2025; +8.5 Oct24→Oct25; +6.5 Oct23→Oct24; -10.5 June retrogression.
    expect(months("2013-04-01", "2014-07-15")).toBeCloseTo(15.5, 1);
    expect(months("2012-07-15", "2013-04-01")).toBeCloseTo(8.5, 1);
    expect(months("2012-01-01", "2012-07-15")).toBeCloseTo(6.5, 1);
    expect(months("2013-09-01", "2014-07-15")).toBeCloseTo(10.5, 1);
    for (const m of ["+15.5 months", "+8.5 months", "+6.5 months"]) {
      expect(page.content).toContain(m);
    }
  });

  it("reports FY2026 supply as 186,000 — not a monotonic 'shrinking supply' story", () => {
    // FY2026 rose to 186,000 (140k floor + ~46k family fall-up). Omitting it
    // would imply supply has fallen every year since FY2022, which is false.
    expect(page.content).toContain("186,000");
    expect(page.content).toMatch(/volatile, not steadily shrinking/i);
  });

  it("frames the 7% per-country limit as proration, not a fixed India quota", () => {
    expect(page.content).toMatch(/not a fixed India quota/i);
    expect(page.content).toMatch(/otherwise unused/i);
  });
});

describe("October 2026 predictions page — interlinking", () => {
  const OUTBOUND = [
    "/visa-bulletin/eb2-india",
    "/visa-bulletin/retrogression",
    "/visa-bulletin/cross-chargeability",
    "/visa-bulletin/final-action-date-vs-date-of-filing",
    "/visa-bulletin/priority-date-current-what-next",
    "/visa-bulletin/eb2-to-eb3-downgrade",
    "/visa-bulletin/eb3-to-eb2-interfiling",
    "/visa-bulletin/monthly-update",
    "/tools/priority-date-checker",
    "/tools/green-card-tracker",
    "/eb2-eb3-priority-date-india",
  ];

  it("links out to the rest of the cluster and the tools", () => {
    for (const href of OUTBOUND) {
      expect(page.content, `missing outbound link ${href}`).toContain(href);
    }
  });

  it("is linked to from sibling cluster pages, not just the hub index", () => {
    const inbound = visaBulletinChildPages.filter(
      (p) => p.slug !== SLUG && p.content.includes(`/visa-bulletin/${SLUG}`)
    );
    expect(inbound.length).toBeGreaterThanOrEqual(3);
    // The two most topically relevant siblings must carry a link.
    const slugs = inbound.map((p) => p.slug);
    expect(slugs).toContain("eb2-india");
    expect(slugs).toContain("retrogression");
  });

  it("keeps external links out of the opening of the page", () => {
    // House rule: outbound links belong at the end (source box), never in the
    // top-of-page callouts. The body should carry no raw http(s) markdown links.
    const firstHalf = page.content.slice(0, Math.floor(page.content.length / 2));
    expect(firstHalf).not.toMatch(/\]\(https?:\/\//);
  });
});
