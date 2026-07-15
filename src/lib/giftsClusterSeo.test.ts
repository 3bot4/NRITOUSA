import { describe, it, expect } from "vitest";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import {
  giftPages,
  giftPillar,
  giftPath,
  getGiftPage,
} from "@/lib/giftsCluster";
import { articles } from "@/lib/articles";
import {
  breadcrumbJsonLd,
  extractFaq,
  faqJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

const OLD_SLUG = "gifting-money-india-tax-implications";
const WINNER_SLUG = "gift-from-parents-india-to-usa";
const OLD_PATH = `/articles/${OLD_SLUG}`;
const WINNER_PATH = `/india-tax-compliance/${WINNER_SLUG}`;

/** The three retained guide pages that own distinct intents. */
const RETAINED = ["foreign-gifts-inheritance-form-3520-india", WINNER_SLUG, "form-3520-indian-gift-inheritance-checklist"];

describe("301 redirect for the consolidated article", () => {
  it("has a single-hop 301 from the old article to the winner", async () => {
    const url = pathToFileURL(resolve(process.cwd(), "next.config.mjs")).href;
    // Dynamic import with a computed URL: avoids static .mjs type resolution.
    const mod: { default: { redirects: () => Promise<Array<Record<string, unknown>>> } } =
      await import(url);
    const redirects = await mod.default.redirects();

    const rule = redirects.find((r) => r.source === OLD_PATH);
    expect(rule).toBeDefined();
    expect(rule!.destination).toBe(WINNER_PATH);
    // A hard 301 (statusCode) or a permanent (308) both count as permanent;
    // this cluster uses statusCode 301 explicitly.
    expect(rule!.statusCode === 301 || rule!.permanent === true).toBe(true);

    // No redirect chain: the destination must not itself be a redirect source.
    expect(redirects.some((r) => r.source === WINNER_PATH)).toBe(false);
  });
});

describe("the old URL is no longer an indexable page", () => {
  it("is removed from the articles catalog (so it is absent from the sitemap & search index)", () => {
    expect(articles.some((a) => a.slug === OLD_SLUG)).toBe(false);
  });

  it("keeps the winner page live in the cluster", () => {
    expect(getGiftPage(WINNER_SLUG)).toBeDefined();
  });
});

describe("each retained page has a unique canonical, title, and description", () => {
  it("canonical paths are unique", () => {
    const paths = giftPages.map((p) => giftPath(p.slug));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("SEO titles are unique across the cluster", () => {
    const titles = giftPages.map((p) => p.seoTitle ?? p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("meta descriptions are unique across the cluster", () => {
    const descs = giftPages.map((p) => p.metaDescription ?? p.excerpt);
    expect(new Set(descs).size).toBe(descs.length);
  });

  it("each retained page exists and has exactly one H1 source", () => {
    for (const slug of RETAINED) {
      const page = getGiftPage(slug);
      expect(page, slug).toBeDefined();
      expect((page!.h1 ?? page!.title).length).toBeGreaterThan(0);
    }
  });
});

describe("FAQ schema matches visible FAQs and is not duplicated across pages", () => {
  it("every retained guide exposes visible FAQs that extractFaq can read", () => {
    for (const slug of RETAINED) {
      const page = getGiftPage(slug)!;
      const faqs = extractFaq(page.content);
      expect(faqs.length, slug).toBeGreaterThan(0);
      // faqJsonLd is built from the SAME extractFaq output the page renders,
      // so schema and visible FAQ can never drift.
      const schema = faqJsonLd(faqs);
      expect(schema.mainEntity.length).toBe(faqs.length);
    }
  });

  it("no identical FAQ question is copied across the retained pages", () => {
    const seen = new Map<string, string>();
    for (const slug of RETAINED) {
      const page = getGiftPage(slug)!;
      for (const f of extractFaq(page.content)) {
        const q = f.question.trim().toLowerCase();
        expect(seen.has(q), `duplicate FAQ "${f.question}" on ${slug} and ${seen.get(q)}`).toBe(false);
        seen.set(q, slug);
      }
    }
  });
});

describe("JSON-LD builds and serializes without errors", () => {
  it("produces a parseable @graph for a cluster page", () => {
    const page = giftPillar;
    const faqs = extractFaq(page.content);
    const graph = jsonLdGraph(
      { "@type": "Article", headline: page.title },
      breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Guide", url: giftPath(page.slug) },
      ]),
      faqJsonLd(faqs)
    );
    const json = JSON.stringify(graph);
    expect(() => JSON.parse(json)).not.toThrow();
    const parsed = JSON.parse(json);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(Array.isArray(parsed["@graph"])).toBe(true);
  });
});
