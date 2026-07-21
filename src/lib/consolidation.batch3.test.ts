/**
 * Regression guard for SEO remediation Batch 3: the internal-link architecture
 * pass that repairs weak hub↔spoke relationships.
 *
 * Batch 3 added NO redirects and merged NO pages — it only wired existing,
 * canonical, 200-status pages together. These tests therefore assert two kinds
 * of invariant that are easy to break silently in a later edit:
 *
 *   1. NEGATIVE — no source file renders an internal link to a known redirect
 *      alias (the Section F cleanup). If a future edit reintroduces a link to
 *      /privacy, /topics/education, /i140-approved-what-next, etc., the reader
 *      would take an avoidable redirect hop and leak link equity. Guarded here.
 *
 *   2. POSITIVE — the specific hub↔spoke links Batch 3 established still exist:
 *      the India-investments flagship's inbound links, the immigration / H-1B
 *      hub cards, the immigration-attorney cost page's inbound links, the India
 *      tax & wealth hub links, and the calculator↔article reciprocity pairs.
 *
 * Every asserted target is a canonical route (verified against the redirect
 * source list below), so these tests double as a "no new redirect hops" check.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { getArticle } from "./articles";
import { getCalculatorContent } from "./calculatorContent";
import { sitemapSegments } from "./sitemap-data";

const ROOT = join(__dirname, "..", "..");
const SRC_DIR = join(ROOT, "src");
const APP_DIR = join(SRC_DIR, "app");
const THIS_FILE = "consolidation.batch3.test.ts";

const sitemapPaths = new Set(
  sitemapSegments.flatMap(({ entries }) => entries.map((e) => e.path)),
);

/* ------------------------------------------------------------------ *
 * The complete set of internal redirect SOURCES on the site. Internal
 * links must always point at the canonical destination, never at one of
 * these. Sourced from next.config.mjs redirects() and the three
 * permanentRedirect() stub pages (app/privacy, app/terms-of-use,
 * app/tools/nri-global-wealth-tax-organizer).
 * ------------------------------------------------------------------ */
const REDIRECT_SOURCES = [
  // permanentRedirect() stubs
  "/privacy",
  "/terms-of-use",
  "/tools/nri-global-wealth-tax-organizer",
  // next.config.mjs redirects()
  "/topics/money-transfer",
  "/topics/education",
  "/articles/indian-passport-renewal-usa",
  "/articles/visa-bulletin-explained-for-indians",
  "/articles/gifting-money-india-tax-implications",
  "/calculators/rent-vs-buy-visa",
  "/i140-approved-what-next",
  "/uscis/kids-aging-out-cspa",
] as const;

/** Every .ts/.tsx under src/, excluding this test and *.test.ts files. */
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (
      (full.endsWith(".ts") || full.endsWith(".tsx")) &&
      !full.endsWith(".test.ts") &&
      !full.endsWith(".test.tsx")
    ) {
      out.push(full);
    }
  }
  return out;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Matches a redirect source used as an actual LINK — a JSX `href` attribute,
 * an `href:` object property, or a markdown `](/path)` link — with the path
 * terminated by a closing quote/backtick/paren so "/privacy" never matches
 * "/privacy-policy". Plain string mentions in comments or slug data do not
 * count, only rendered links.
 */
function linkUsageRegex(source: string): RegExp {
  const p = escapeRe(source);
  return new RegExp(
    // href="/x"  href={"/x"}  href: "/x"  href={`/x`}
    `href\\s*[:=]\\s*\\{?\\s*["'\`]${p}["'\`]` +
      // ](/x)  ](/x#a)  ](/x?a)
      `|\\]\\(${p}[)#?]`,
  );
}

const allSourceFiles = sourceFiles(SRC_DIR);

describe("Batch 3 — no internal links to redirect sources (Section F)", () => {
  it("scans a non-empty set of source files", () => {
    // Guards the crawler: an empty file list makes every assertion vacuous.
    expect(allSourceFiles.length).toBeGreaterThan(100);
  });

  it.each(REDIRECT_SOURCES)("nothing links to the redirect alias %s", (source) => {
    const re = linkUsageRegex(source);
    const offenders = allSourceFiles
      .filter((f) => !f.endsWith(THIS_FILE))
      .filter((f) => re.test(readFileSync(f, "utf8")))
      .map((f) => f.split(sep).slice(-3).join("/"));
    expect(offenders).toEqual([]);
  });
});

/* ------------------------------------------------------------------ *
 * Helpers for the positive assertions.
 * ------------------------------------------------------------------ */
function articleBody(slug: string): string {
  const a = getArticle(slug);
  expect(a, `article "${slug}" must exist`).toBeDefined();
  return a!.content;
}

function pageText(relFromApp: string): string {
  return readFileSync(join(APP_DIR, relFromApp), "utf8");
}

function calcLinks(slug: string): string[] {
  const c = getCalculatorContent(slug);
  expect(c, `calculator content "${slug}" must exist`).toBeDefined();
  return c!.relatedLinks.map((l) => l.href);
}

const FLAGSHIP = "/india-investments/should-nris-keep-investments-in-india";
const ATTORNEY = "/immigration-attorney-lawyer-cost";
const ESTATE = "/nri-estate-planning";
const GOLD = "/gold-limit-usa-to-india";
const LIFE = "/life-insurance-for-indian-families-usa";

describe("Batch 3 — every asserted target is canonical, not a redirect source", () => {
  const targets = [
    FLAGSHIP,
    ATTORNEY,
    ESTATE,
    GOLD,
    LIFE,
    "/trump-account-h1b-immigrant-families",
    "/h1b-lottery-results",
    "/tools/h1b-sponsor-finder",
    "/nri-selling-property-in-india-tds",
    "/calculators/fcnr-vs-hysa",
    "/calculators/remittance-tcs-cost",
    "/calculators/401k-return-to-india",
    "/calculators/rnor-tax-residency",
    "/calculators/india-property-capital-gains",
    "/articles/fcnr-deposit-usd-yield",
    "/articles/tcs-india-remittance-tax",
    "/articles/what-happens-to-401k-leaving-usa",
  ];
  it.each(targets)("%s is not a redirect source", (t) => {
    expect(REDIRECT_SOURCES).not.toContain(t);
  });

  it("the key hubs Batch 3 links to are indexable (in the sitemap)", () => {
    for (const p of [FLAGSHIP, ATTORNEY, ESTATE, GOLD, LIFE]) {
      expect(sitemapPaths.has(p), `${p} should be in the sitemap`).toBe(true);
    }
  });
});

describe("Batch 3 A — India-investments flagship inbound links", () => {
  it.each([
    "invest-in-usa-or-india",
    "india-fd-vs-us-investments",
    "keeping-too-much-money-in-india",
    "invest-indian-stock-market-nri",
    "us-kids-india-property-problems",
  ])("article %s links to the flagship pillar", (slug) => {
    expect(articleBody(slug)).toContain(FLAGSHIP);
  });

  it("the long-term-nri-wealth hub links to the flagship", () => {
    expect(pageText("long-term-nri-wealth/page.tsx")).toContain(FLAGSHIP);
  });

  it("the india-tax-compliance hub links to the flagship", () => {
    expect(pageText("india-tax-compliance/page.tsx")).toContain(FLAGSHIP);
  });
});

describe("Batch 3 B — immigration & H-1B hub cards", () => {
  it("the immigration hub links to the Trump Account H-1B guide", () => {
    expect(pageText("immigration/page.tsx")).toContain(
      "/trump-account-h1b-immigrant-families",
    );
  });

  it.each(["/h1b-lottery-results", "/tools/h1b-sponsor-finder"])(
    "the H-1B hub links to %s",
    (target) => {
      expect(pageText("h1b/page.tsx")).toContain(target);
    },
  );
});

describe("Batch 3 C — immigration-attorney cost page inbound links", () => {
  it.each([
    "h1b/page.tsx",
    "green-card/page.tsx",
    "uscis/page.tsx",
    "h1b-layoff/page.tsx",
    "h1b-lottery-not-selected-options/page.tsx",
  ])("%s links to the attorney-cost page", (rel) => {
    expect(pageText(rel)).toContain(ATTORNEY);
  });
});

describe("Batch 3 D — India tax & wealth hub links", () => {
  it("the india-tax-compliance hub links to estate, gold & life-insurance", () => {
    const t = pageText("india-tax-compliance/page.tsx");
    expect(t).toContain(ESTATE);
    expect(t).toContain(GOLD);
    expect(t).toContain(LIFE);
  });

  it.each(["estate-planning-usa-india-assets", "inheriting-indian-assets-us-tax"])(
    "article %s links to the estate-planning hub",
    (slug) => {
      expect(articleBody(slug)).toContain(ESTATE);
    },
  );

  it("the long-term-nri-wealth hub links to the estate-planning hub", () => {
    expect(pageText("long-term-nri-wealth/page.tsx")).toContain(ESTATE);
  });

  it("the return-to-india hub links to the gold customs-limit guide", () => {
    expect(pageText("return-to-india/page.tsx")).toContain(GOLD);
  });

  it("the term-life article links to the life-insurance pillar", () => {
    expect(articleBody("term-life-insurance-immigrant-families")).toContain(LIFE);
  });
});

describe("Batch 3 E — calculator ↔ article reciprocity", () => {
  const PAIRS = [
    {
      calc: "fcnr-vs-hysa",
      article: "fcnr-deposit-usd-yield",
      calcHref: "/calculators/fcnr-vs-hysa",
      articleHref: "/articles/fcnr-deposit-usd-yield",
    },
    {
      calc: "remittance-tcs-cost",
      article: "tcs-india-remittance-tax",
      calcHref: "/calculators/remittance-tcs-cost",
      articleHref: "/articles/tcs-india-remittance-tax",
    },
    {
      calc: "401k-return-to-india",
      article: "what-happens-to-401k-leaving-usa",
      calcHref: "/calculators/401k-return-to-india",
      articleHref: "/articles/what-happens-to-401k-leaving-usa",
    },
    {
      calc: "rnor-tax-residency",
      article: "what-happens-to-401k-leaving-usa",
      calcHref: "/calculators/rnor-tax-residency",
      articleHref: "/articles/what-happens-to-401k-leaving-usa",
    },
  ] as const;

  it.each(PAIRS)(
    "$calc ↔ $article link to each other",
    ({ calc, article, calcHref, articleHref }) => {
      // calculator → article
      expect(calcLinks(calc)).toContain(articleHref);
      // article → calculator
      expect(articleBody(article)).toContain(calcHref);
    },
  );

  it("india-property-capital-gains ↔ the NRI property-sale TDS guide", () => {
    // calculator → explanatory page
    expect(calcLinks("india-property-capital-gains")).toContain(
      "/nri-selling-property-in-india-tds",
    );
    // page → calculator (reciprocity established before Batch 3, kept here)
    expect(pageText("nri-selling-property-in-india-tds/page.tsx")).toContain(
      "/calculators/india-property-capital-gains",
    );
  });
});
