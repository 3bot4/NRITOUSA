/**
 * Regression guard: FAQ schema must be generated from the same source as the
 * visible FAQ, and only from one place.
 *
 * Why this exists: FcnrVsHysaCalculator injected its own hidden FAQPage block
 * with five questions that appeared nowhere on the rendered page, while
 * calculators/[slug]/page.tsx separately emitted the real FAQPage from
 * calculatorContent. The page therefore shipped two competing FAQPage nodes,
 * one of them invisible — which Google's FAQPage guidelines prohibit, since
 * the content must be visible to the user.
 *
 * The invariant: calculator components never emit FAQPage schema. The route
 * owns it, reading the same `faqs` array that CalculatorDeepDive renders, so
 * visible and machine-readable cannot drift apart.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { calculatorContent } from "./calculatorContent";

const CALC_COMPONENT_DIR = join(__dirname, "..", "components", "calculators");

const componentFiles = readdirSync(CALC_COMPONENT_DIR).filter((f) =>
  f.endsWith(".tsx"),
);

describe("FAQ schema ownership", () => {
  it("finds the calculator components it is meant to guard", () => {
    // Guards the glob: an empty list would make the assertion below vacuous.
    expect(componentFiles.length).toBeGreaterThan(5);
  });

  it.each(componentFiles)(
    "%s does not emit its own FAQPage schema",
    (file) => {
      const src = readFileSync(join(CALC_COMPONENT_DIR, file), "utf8");
      // Match the JSON-LD @type value, not the word in a comment explaining
      // why it must not appear.
      const emitsFaqPage = /["']@type["']\s*:\s*["']FAQPage["']/.test(src);
      expect(
        emitsFaqPage,
        `${file} emits FAQPage schema. The route owns FAQ schema so it stays ` +
          `in sync with the visible FAQ — add questions to calculatorContent.ts.`,
      ).toBe(false);
    },
  );
});

describe("FAQ content is well formed", () => {
  const entries = Object.entries(calculatorContent);

  it("covers the calculators that have hub content", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)("%s has non-empty questions and answers", (slug, content) => {
    expect(content.faqs.length, `${slug} has no FAQs`).toBeGreaterThan(0);
    for (const faq of content.faqs) {
      expect(faq.question.trim(), `${slug} has a blank question`).not.toBe("");
      expect(faq.answer.trim(), `${slug} has a blank answer`).not.toBe("");
    }
  });

  it.each(entries)("%s has no duplicate questions", (slug, content) => {
    const qs = content.faqs.map((f) => f.question.trim().toLowerCase());
    const dupes = [...new Set(qs.filter((q, i) => qs.indexOf(q) !== i))];
    expect(dupes, `${slug} repeats a question`).toEqual([]);
  });
});
