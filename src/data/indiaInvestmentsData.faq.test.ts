import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { faqs } from "@/data/indiaInvestmentsData";
import { faqJsonLd } from "@/lib/seo";

describe("India Investments FAQ ↔ FAQPage schema", () => {
  it("has at least 40 FAQs", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(40);
  });

  it("has unique, non-empty questions and answers", () => {
    const questions = faqs.map((f) => f.question);
    expect(new Set(questions).size).toBe(questions.length);
    for (const f of faqs) {
      expect(f.question.trim().length).toBeGreaterThan(0);
      expect(f.answer.trim().length).toBeGreaterThan(0);
    }
  });

  it("schema is generated 1:1 from the same visible FAQ data", () => {
    const schema = faqJsonLd(faqs);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity.length).toBe(faqs.length);
    schema.mainEntity.forEach((entity, i) => {
      expect(entity["@type"]).toBe("Question");
      expect(entity.name).toBe(faqs[i].question);
      expect(entity.acceptedAnswer.text).toBe(faqs[i].answer);
    });
  });

  it("serialises to valid, escaped JSON", () => {
    const json = JSON.stringify(faqJsonLd(faqs));
    expect(() => JSON.parse(json)).not.toThrow();
    // No raw/unescaped double quotes leak (JSON.stringify guarantees this).
    expect(JSON.parse(json).mainEntity.length).toBe(faqs.length);
  });

  it("the page renders exactly one FAQ list, wired to the schema source", () => {
    const src = readFileSync(
      resolve(__dirname, "../app/india-investments/should-nris-keep-investments-in-india/page.tsx"),
      "utf8",
    );
    // Single visible FAQ list…
    expect((src.match(/<ToolFaq items=\{faqs\}/g) ?? []).length).toBe(1);
    // …and schema built from the same `faqs`, not a duplicated list.
    expect(src.includes("faqJsonLd(faqs)")).toBe(true);
  });
});
