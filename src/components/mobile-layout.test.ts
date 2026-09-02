import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(__dirname, p), "utf8");

const articleBody = read("ArticleBody.tsx");
const articleToc = read("india-investments/ArticleToc.tsx");
const globalsCss = read("../app/globals.css");
const inputCard = read("tools/InputCard.tsx");
const employerExplorer = read("tools/h1b/H1bEmployerExplorer.tsx");

/**
 * Regressions found by a site-wide phone audit (320-430px, iOS + Android).
 * Each of these shipped to production once; the assertions below are the
 * cheapest way to keep them from shipping again.
 */

describe("inline markdown renders links nested inside bold", () => {
  it("recurses into the bold branch instead of emitting raw text", () => {
    // `**see [label](href)**` used to render the literal markdown, because the
    // bold branch pushed match[3] as a string. The unbreakable URL then forced
    // up to 122px of horizontal overflow on a 360px phone.
    expect(articleBody).toMatch(/<strong[\s\S]{0,200}?\{renderInline\(match\[3\]/);
    expect(articleBody).not.toMatch(/<strong[^>]*>\s*\{match\[3\]\}\s*<\/strong>/);
  });
});

describe("form controls never trigger iOS focus-zoom", () => {
  it("floors every text-entry control at 16px below the sm breakpoint", () => {
    expect(globalsCss).toContain("font-size: 16px");
    expect(globalsCss).toMatch(/@media \(max-width: 639\.98px\)/);
  });

  it("gives select/textarea enough specificity to beat Tailwind's .text-sm", () => {
    // A bare `select` is (0,0,1) and loses to `.text-sm` (0,1,0); the :not()
    // lifts it to (0,1,1). Measured: without it, 14 of 41 controls on
    // /tools/visitor-insurance-plan-comparison stayed at 14px.
    expect(globalsCss).toContain("select:not([hidden])");
    expect(globalsCss).toContain("textarea:not([hidden])");
  });

  it("keeps the shared field style at 16px on phones", () => {
    const decl = inputCard.match(/export const fieldClass =\s*\n?\s*"([^"]*)"/)?.[1] ?? "";
    expect(decl).toContain("text-base");
    // `sm:text-sm` is fine (no touch keyboard there); an unprefixed `text-sm` is not.
    expect(decl).not.toMatch(/(?<![\w:-])text-sm\b/);
  });
});

describe("ArticleToc mobile bar", () => {
  it("collapses via an explicit display class, not the hidden attribute alone", () => {
    // Tailwind preflight's [hidden]:where(...) has zero specificity, so it ties
    // with .grid and loses on source order — the panel stayed expanded forever,
    // covering 68% of a 360x800 screen.
    expect(articleToc).toMatch(/open \? "grid" : "hidden"/);
    expect(articleToc).not.toMatch(/hidden=\{!open\}\s*\n\s*className="mt-1 grid /);
  });

  it("does not negative-margin out of an unpadded parent", () => {
    // ArticleToc renders directly under <main>, outside any <Container>, so
    // -mx-4 had nothing to bleed into and pushed the document 16px wide.
    const stickyBar = articleToc.match(/className="sticky top-16[^"]*"/)?.[0] ?? "";
    expect(stickyBar).not.toContain("-mx-4");
  });
});

describe("H-1B employer explorer table", () => {
  it("keeps the 860px-wide table off phones and ships cards instead", () => {
    // The leaderboard needs 8 columns to be useful on a laptop, which is ~2.3x
    // a 375px screen. It is display:none below `sm` and a card list takes over;
    // dropping either half puts the table (or a duplicate) on the phone.
    expect(employerExplorer).toMatch(/hidden[^"]*sm:block/);
    expect(employerExplorer).toContain("min-w-[860px]");
    expect(employerExplorer).toMatch(/space-y-2\.5 sm:hidden/);
  });

  it("scrolls the table inside its own container rather than the page", () => {
    // Same element as the `hidden ... sm:block` wrapper: the wide table scrolls
    // within its own box instead of dragging the whole page sideways.
    expect(employerExplorer).toMatch(
      /className="hidden overflow-x-auto[^"]*sm:block"/
    );
  });
});
