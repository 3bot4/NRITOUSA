import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Note: page.tsx is not imported directly — it pulls in React components
// (Icon, AuthorCard, etc.) that need the Next.js JSX runtime and fail under
// plain vitest. We verify the FAQ ↔ schema wiring via source inspection
// instead, matching the pattern used for other editorial pages in this repo.
const src = readFileSync(resolve(__dirname, "page.tsx"), "utf8");

function extractFaqQuestions(source: string): string[] {
  const block = source.match(/contributorFaqs[^=]*=\s*\[([\s\S]*?)\n\];/)?.[1] ?? "";
  return [...block.matchAll(/question:\s*"([^"]+)"/g)].map((m) => m[1]);
}

describe("Contributors page — editorial-transparency FAQ ↔ schema parity", () => {
  it("defines a non-empty, unique set of contributor FAQ questions", () => {
    const questions = extractFaqQuestions(src);
    expect(questions.length).toBeGreaterThanOrEqual(4);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("renders the FAQ list visibly and builds schema from that same list (no schema-only content)", () => {
    expect(src.includes("contributorFaqs.map((f) =>")).toBe(true);
    expect(src.includes("faqJsonLd(contributorFaqs)")).toBe(true);
  });

  it("covers the required editorial-transparency topics", () => {
    const required = [
      "Who may contribute",
      "Credential expectations",
      "Editorial review process",
      "Source requirements",
      "Conflicts of interest",
      "Submission process",
      "Author profile",
    ];
    for (const topic of required) {
      expect(src, `expected a section on "${topic}"`).toContain(topic);
    }
  });

  it("does not fabricate contributor testimonials or promise AI citation", () => {
    const lower = src.toLowerCase();
    expect(lower).not.toContain("guaranteed to be cited");
    expect(lower).not.toContain("will be cited by ai");
  });
});
