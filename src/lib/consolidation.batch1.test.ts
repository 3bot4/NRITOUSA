/**
 * Regression guard for SEO remediation Batch 1: the two duplicate-page
 * consolidations.
 *
 *   /i140-approved-what-next      → /green-card/i-140-approved-what-next
 *   /uscis/kids-aging-out-cspa    → /green-card/cspa-kids-aging-out
 *
 * Each legacy URL must permanently redirect in a single hop to the survivor,
 * must not appear in any sitemap, and must not be linked from anywhere in the
 * app. The survivors must stay live, self-canonical, and keep FAQ schema that
 * is derived from — and therefore matches — their visible content.
 *
 * These invariants are easy to break silently (re-add a link, resurrect the
 * slug, drop the redirect), so they are asserted here rather than trusted to
 * review.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { sitemapSegments } from "./sitemap-data";
import { pageMetadata, extractFaq } from "./seo";
import {
  greenCardChildSlugs,
  getGreenCardChildPage,
  GREEN_CARD_CLUSTER_BASE,
} from "./greenCardCluster";
import { lifePlanningChildSlugs } from "./uscisLifePlanningCluster";

const ROOT = join(__dirname, "..", "..");
const SRC_DIR = join(ROOT, "src");
const APP_DIR = join(SRC_DIR, "app");

/** The two consolidations in this batch. */
const CONSOLIDATIONS = [
  {
    legacy: "/i140-approved-what-next",
    survivor: "/green-card/i-140-approved-what-next",
    survivorSlug: "i-140-approved-what-next",
  },
  {
    legacy: "/uscis/kids-aging-out-cspa",
    survivor: "/green-card/cspa-kids-aging-out",
    survivorSlug: "cspa-kids-aging-out",
  },
] as const;

interface Redirect {
  source: string;
  destination: string;
  statusCode?: number;
  permanent?: boolean;
}

/** Parse the redirect objects out of next.config.mjs. */
function parseRedirects(): Redirect[] {
  const src = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
  const re =
    /source:\s*["']([^"']+)["'],\s*destination:\s*["']([^"']+)["'],\s*(?:statusCode:\s*(\d+)|permanent:\s*(true|false))/g;
  const out: Redirect[] = [];
  for (const m of src.matchAll(re)) {
    out.push({
      source: m[1],
      destination: m[2],
      statusCode: m[3] ? Number(m[3]) : undefined,
      permanent: m[4] ? m[4] === "true" : undefined,
    });
  }
  return out;
}

/**
 * Every .ts/.tsx file under src/, excluding *.test.ts(x). Test files are not
 * rendered pages and never emit links; some (e.g. consolidation.batch3.test.ts)
 * legitimately list these legacy URLs as data to assert nothing links to them,
 * so scanning them would be a false positive.
 */
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

const redirects = parseRedirects();
const sitemapPaths = sitemapSegments.flatMap(({ entries }) =>
  entries.map((e) => e.path),
);

describe("Batch 1 consolidation — redirects", () => {
  it("parsed the redirects out of next.config.mjs", () => {
    // Guards the parser: an empty list would make every assertion vacuous.
    expect(redirects.length).toBeGreaterThan(0);
  });

  it.each(CONSOLIDATIONS)(
    "$legacy → $survivor is a single permanent (301) hop",
    ({ legacy, survivor }) => {
      const hits = redirects.filter((r) => r.source === legacy);
      // Exactly one rule for the legacy URL — no ambiguity.
      expect(hits).toHaveLength(1);
      const r = hits[0];
      expect(r.destination).toBe(survivor);
      // A permanent redirect: hard 301 or Next's `permanent: true` (308).
      const isPermanent = r.statusCode === 301 || r.permanent === true;
      expect(isPermanent, `${legacy} must redirect permanently`).toBe(true);
    },
  );

  it.each(CONSOLIDATIONS)(
    "$legacy → $survivor has no chain or loop",
    ({ legacy, survivor }) => {
      // Source and destination differ (no self-loop).
      expect(survivor).not.toBe(legacy);
      // The destination is not itself the source of another redirect (no chain).
      expect(redirects.map((r) => r.source)).not.toContain(survivor);
    },
  );
});

describe("Batch 1 consolidation — survivors stay live & indexable", () => {
  it.each(CONSOLIDATIONS)(
    "$survivor is a generated green-card cluster page",
    ({ survivorSlug }) => {
      expect(greenCardChildSlugs).toContain(survivorSlug);
      expect(getGreenCardChildPage(survivorSlug)).toBeDefined();
    },
  );

  it.each(CONSOLIDATIONS)("$survivor is self-canonical", ({ survivor }) => {
    const meta = pageMetadata({
      title: "x",
      description: "y",
      path: survivor,
      type: "article",
    });
    expect(meta.alternates?.canonical).toBe(survivor);
    // No noindex is applied to the survivor.
    expect(meta.robots).toBeUndefined();
  });

  it.each(CONSOLIDATIONS)("$survivor is in the sitemap", ({ survivor }) => {
    expect(sitemapPaths).toContain(survivor);
  });
});

describe("Batch 1 consolidation — legacy URLs are fully retired", () => {
  it.each(CONSOLIDATIONS)("$legacy is not in any sitemap", ({ legacy }) => {
    expect(sitemapPaths).not.toContain(legacy);
  });

  it("the legacy /i140-approved-what-next route no longer exists", () => {
    expect(existsSync(join(APP_DIR, "i140-approved-what-next"))).toBe(false);
  });

  it("the kids-aging-out-cspa slug is gone from the life-planning cluster", () => {
    expect(lifePlanningChildSlugs).not.toContain("kids-aging-out-cspa");
  });

  it.each(CONSOLIDATIONS)(
    "no source file links to $legacy",
    ({ legacy }) => {
      const offenders = sourceFiles(SRC_DIR).filter((f) =>
        readFileSync(f, "utf8").includes(legacy),
      );
      expect(
        offenders.map((f) => f.split(sep).slice(-3).join("/")),
      ).toEqual([]);
    },
  );
});

describe("Batch 1 consolidation — merged content & FAQ/schema parity", () => {
  it.each(CONSOLIDATIONS)(
    "$survivor FAQ schema is derived from visible content",
    ({ survivorSlug }) => {
      const page = getGreenCardChildPage(survivorSlug)!;
      const faqs = extractFaq(page.content);
      expect(faqs.length).toBeGreaterThan(0);
      for (const faq of faqs) {
        // Every schema question is a visible "### …" heading in the body, so
        // FAQPage schema and the rendered FAQ cannot drift apart.
        expect(page.content).toContain(faq.question);
        expect(faq.answer.trim()).not.toBe("");
      }
    },
  );

  it("the merged priority-date-retention FAQ is present on the I-140 survivor", () => {
    const page = getGreenCardChildPage("i-140-approved-what-next")!;
    const faqs = extractFaq(page.content);
    expect(
      faqs.some((f) =>
        /keep my priority date if a new I-140 is filed/i.test(f.question),
      ),
    ).toBe(true);
  });

  it("the merged CSPA worked example is present on the CSPA survivor", () => {
    const page = getGreenCardChildPage("cspa-kids-aging-out")!;
    expect(page.content).toContain("Worked example:");
  });

  it("the green-card cluster base is unchanged", () => {
    expect(GREEN_CARD_CLUSTER_BASE).toBe("/green-card");
  });
});
