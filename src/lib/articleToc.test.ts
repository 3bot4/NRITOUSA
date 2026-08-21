/**
 * Guards for the article table of contents.
 *
 * The ToC is built in two places that must agree: the route calls
 * `extractHeadings()` to render the jump links, and `ArticleBody` stamps an
 * `id` on each rendered <h2>. Both go through `headingId()`, but they read the
 * heading from different points in the pipeline — the route from the raw
 * markdown line, ArticleBody from its own parse loop. If those ever diverge the
 * page still renders perfectly and every ToC link silently scrolls nowhere,
 * which is exactly the kind of break nothing else would catch.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { articles } from "./articles";
import { extractHeadings, headingId } from "./seo";

const tocArticles = articles.filter((a) => a.toc);

describe("headingId", () => {
  it("slugifies to url-safe anchors", () => {
    expect(headingId("Will SSA actually pay you in India?")).toBe(
      "will-ssa-actually-pay-you-in-india",
    );
    expect(headingId("What you'll be taxed on U.S. Social Security")).toBe(
      "what-youll-be-taxed-on-us-social-security",
    );
  });

  it("ignores inline markdown, so bolding a heading never moves its anchor", () => {
    expect(headingId("The **40 credits** rule")).toBe(headingId("The 40 credits rule"));
  });
});

describe("extractHeadings", () => {
  it("returns one item per H2, in document order", () => {
    const content = "intro\n\n## First\ntext\n\n### Sub\n\n## Second\n";
    expect(extractHeadings(content)).toEqual([
      { id: "first", label: "First" },
      { id: "second", label: "Second" },
    ]);
  });

  it("de-duplicates repeated headings so anchors stay unique", () => {
    const ids = extractHeadings("## Sources\n\n## Sources\n\n## Sources").map(
      (h) => h.id,
    );
    expect(ids).toEqual(["sources", "sources-2", "sources-3"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("shortens long headings for the rail but keeps the full text in the id", () => {
    const [item] = extractHeadings(
      "## How Social Security credits work — and why 40 credits is the whole game",
    );
    expect(item.label).toBe("How Social Security credits work");
    // The anchor still covers the whole heading, so it stays stable if the
    // display rule is ever retuned.
    expect(item.id).toBe(
      "how-social-security-credits-work-and-why-40-credits-is-the-whole-game",
    );
  });

  it("leaves a short heading alone", () => {
    expect(extractHeadings("## The bottom line")[0].label).toBe("The bottom line");
  });
});

describe("ArticleBody and the ToC agree on anchors", () => {
  it("derives heading ids from the same helper", () => {
    // Cheapest possible guard against the two implementations drifting: the
    // renderer must go through headingId() rather than rolling its own slug.
    const body = readFileSync(
      join(__dirname, "..", "components", "ArticleBody.tsx"),
      "utf8",
    );
    expect(body).toContain('import { headingId } from "@/lib/seo"');
    expect(body).toMatch(/id=\{n === 0 \? base : `\$\{base\}-\$\{n \+ 1\}`\}/);
  });

  it("gives H2s scroll margin so anchors clear the fixed header", () => {
    const body = readFileSync(
      join(__dirname, "..", "components", "ArticleBody.tsx"),
      "utf8",
    );
    expect(body).toMatch(/scroll-mt-\d+ text-xl font-bold/);
  });
});

describe("articles that opt into a ToC", () => {
  it("has at least one", () => {
    expect(tocArticles.length).toBeGreaterThan(0);
  });

  it.each(tocArticles.map((a) => [a.slug, a] as const))(
    "%s has enough sections to be worth navigating, with unique anchors",
    (_slug, article) => {
      const headings = extractHeadings(article.content);
      // The route also gates on this; a ToC of two links is chrome.
      expect(headings.length).toBeGreaterThan(2);
      expect(new Set(headings.map((h) => h.id)).size).toBe(headings.length);
      expect(headings.every((h) => h.label.trim().length > 0)).toBe(true);
    },
  );
});
