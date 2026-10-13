import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Mobile-layout and editorial guards for the October 2026 immigration-cluster
 * build (O-1, L-1, A-number, I-94, green card travel rules, and the three
 * projected visa-bulletin months).
 *
 * Same shape and the same reasoning as gap-2026-09.mobile.test.ts: this repo
 * ships no headless browser, so a real 390px render cannot be asserted here.
 * What CAN be asserted is the set of traps a previous site-wide phone audit
 * actually found — every one of them shipped to production once. See the notes
 * at the top of ToolFirstLayout and mobile-layout.test.ts.
 *
 * It also carries this build's content rules, because they are cheaper to
 * enforce than to re-review: no forecast word in a month slug, no projected
 * figure labelled official, and the word "caveat" nowhere.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

/**
 * The same file with comments removed.
 *
 * Several assertions below forbid an identifier (`localStorage`, `fetch`) that
 * the component's own doc comment legitimately NAMES in order to say it is not
 * used. Scanning the raw text makes a correct comment fail the test it
 * documents, so the code-level guards read this instead.
 */
const code = (p: string) =>
  read(p)
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

/** Directories whose every .tsx must be covered by the lists below. */
const WATCHED_DIRS = [
  "components/tools/o1",
  "components/tools/l1",
  "components/tools/a-number",
  "components/tools/i94",
  "components/tools/gc-travel",
];

/** Inline-SVG figure modules added by this build. */
const SVG_FILES = [
  "components/tools/o1/O1Visuals.tsx",
  "components/tools/l1/L1Visuals.tsx",
  "components/tools/a-number/ANumberVisuals.tsx",
  "components/tools/i94/I94Visuals.tsx",
  "components/tools/gc-travel/GcTravelVisuals.tsx",
  "components/visa-bulletin/ProjectedMonthCharts.tsx",
];

/** Interactive tools added by this build. */
const TOOLS = [
  "components/tools/O1CriteriaSelfCheck.tsx",
  "components/tools/L1EligibilityCalculator.tsx",
  "components/tools/WhichNumberIsThis.tsx",
  "components/tools/I94DayCounter.tsx",
  "components/tools/TripRiskChecker.tsx",
];

/** Page routes added by this build. */
const PAGES = [
  "app/o1-visa/page.tsx",
  "app/l1-visa/page.tsx",
  "app/uscis/a-number/page.tsx",
  "app/uscis/i-94/page.tsx",
  "app/green-card/travel-rules/page.tsx",
];

const ALL_RENDERING = [...SVG_FILES, ...TOOLS, ...PAGES, "components/visa-bulletin/ProjectedMonthPage.tsx"];

describe("every SVG figure is fluid, not fixed-width", () => {
  it("uses a viewBox with h-auto w-full so it scales instead of overflowing", () => {
    for (const f of SVG_FILES) {
      const src = read(f);
      expect(src, `${f} has no viewBox`).toMatch(/viewBox=/);
      expect(src, `${f} is not fluid`).toContain('className="h-auto w-full"');
    }
  });

  it("never sets a pixel width or height attribute on the <svg> itself", () => {
    // A width="720" attribute wins over the class and forces overflow at 390px.
    for (const f of SVG_FILES) {
      const src = read(f);
      for (const tag of src.match(/<svg[^>]*>/g) ?? []) {
        expect(tag, `${f}: fixed size on <svg>`).not.toMatch(/\s(width|height)="\d/);
      }
    }
  });

  it("gives every figure a role and a text equivalent", () => {
    for (const f of SVG_FILES) {
      const src = code(f);
      const svgs = (src.match(/<svg/g) ?? []).length;
      const roles = (src.match(/role="img"/g) ?? []).length;
      const labels = (src.match(/aria-label=/g) ?? []).length;
      expect(roles, `${f}: ${svgs} svgs but ${roles} role="img"`).toBe(svgs);
      expect(labels, `${f}: ${svgs} svgs but ${labels} aria-labels`).toBeGreaterThanOrEqual(svgs);
    }
  });

  it("gives every figure a visible caption", () => {
    for (const f of SVG_FILES) {
      const src = read(f);
      const figures = (src.match(/<figure/g) ?? []).length;
      const captions = (src.match(/<figcaption/g) ?? []).length;
      expect(captions, `${f}: ${figures} figures but ${captions} captions`).toBe(figures);
    }
  });
});

describe("every wide figure and table can scroll sideways", () => {
  it("wraps each chart in an overflow-x-auto with a min-w inner element", () => {
    // The audited failure: a 760-wide viewBox squashed to illegibility at
    // 390px because nothing let it scroll.
    for (const f of PAGES.concat("components/visa-bulletin/ProjectedMonthPage.tsx")) {
      const src = read(f);
      const chartUses = (src.match(/<(Projected)?[A-Z]\w*(Chart|Diagram|Flow)\b/g) ?? []).length;
      if (chartUses === 0) continue;
      expect(src, `${f}: charts with no scroll wrapper`).toContain("overflow-x-auto");
      expect(src, `${f}: scroll wrapper with no min-w`).toMatch(/min-w-\[\d+px\]/);
    }
  });

  it("gives every table a horizontal scroll wrapper and a min-width", () => {
    for (const f of ALL_RENDERING) {
      const src = read(f);
      const tables = (src.match(/<table/g) ?? []).length;
      if (tables === 0) continue;
      const wrappers = (src.match(/overflow-x-auto/g) ?? []).length;
      expect(wrappers, `${f}: ${tables} tables but ${wrappers} scroll wrappers`).toBeGreaterThanOrEqual(
        tables,
      );
      const minW = (src.match(/min-w-\[\d+px\]/g) ?? []).length;
      expect(minW, `${f}: ${tables} tables but ${minW} min-widths`).toBeGreaterThanOrEqual(tables);
    }
  });

  it("gives every table a caption for screen readers", () => {
    for (const f of ALL_RENDERING) {
      const src = read(f);
      const tables = (src.match(/<table/g) ?? []).length;
      if (tables === 0) continue;
      const captions = (src.match(/<caption/g) ?? []).length;
      expect(captions, `${f}: ${tables} tables but ${captions} captions`).toBeGreaterThanOrEqual(
        tables,
      );
    }
  });
});

describe("form controls clear the 16px iOS zoom floor", () => {
  it("uses the shared fieldClass rather than a hand-rolled input style", () => {
    // Below 16px, iOS Safari zooms a focused control and never zooms back out.
    // fieldClass is text-base with sm:text-sm for exactly this reason.
    for (const f of TOOLS) {
      const src = read(f);
      const hasControl = /<(input|select|textarea)\b/.test(src);
      if (!hasControl) continue;
      expect(src, `${f}: inputs without fieldClass`).toMatch(/fieldClass|InputCard/);
    }
  });

  it("never puts text-sm or smaller directly on an input, select or textarea", () => {
    for (const f of TOOLS) {
      const src = read(f);
      for (const tag of src.match(/<(input|select|textarea)[^>]*>/g) ?? []) {
        // A `sm:text-sm` is fine — that breakpoint is desktop-only.
        const bare = tag.replace(/sm:text-\w+/g, "");
        expect(bare, `${f}: sub-16px control`).not.toMatch(/\btext-(xs|sm|\[1[0-5]px\])/);
      }
    }
  });
});

describe("long strings cannot overflow a phone", () => {
  it("never relies on whitespace-nowrap for a cell that holds prose", () => {
    // nowrap is correct for a date or a fee and wrong for a sentence.
    for (const f of PAGES) {
      const src = read(f);
      // Only a literal run of text counts. `{expr}` inside a nowrap cell is a
      // formatted date or fee — which is exactly what nowrap is for — and the
      // earlier version of this regex flagged the expression's own source.
      for (const m of src.matchAll(/whitespace-nowrap[^>]*>\s*([A-Za-z][^<{}]{90,})/g)) {
        expect(m[1], `${f}: nowrap on prose`).toBeUndefined();
      }
    }
  });

  it("uses min-w-0 or a scroll wrapper wherever a grid holds a long value", () => {
    // A grid child defaults to min-width:auto, so a long unbroken string
    // widens the track past the viewport instead of wrapping.
    for (const f of TOOLS) {
      const src = read(f);
      if (!/\bgrid\b/.test(src)) continue;
      const guarded =
        src.includes("min-w-0") ||
        src.includes("[&>*]:min-w-0") ||
        src.includes("overflow-x-auto") ||
        src.includes("break-words") ||
        src.includes("overflow-hidden");
      expect(guarded, `${f}: grid with no overflow guard`).toBe(true);
    }
  });
});

describe("the tools keep their privacy promise", () => {
  it("makes no network call from any tool in this build", () => {
    for (const f of TOOLS) {
      const src = code(f);
      expect(src, `${f}: fetch in a browser-only tool`).not.toMatch(/\bfetch\s*\(/);
      expect(src, `${f}: XHR in a browser-only tool`).not.toMatch(/XMLHttpRequest/);
      expect(src, `${f}: axios in a browser-only tool`).not.toMatch(/\baxios\b/);
    }
  });

  it("persists nothing", () => {
    for (const f of TOOLS) {
      const src = code(f);
      expect(src, `${f}: localStorage`).not.toMatch(/localStorage/);
      expect(src, `${f}: sessionStorage`).not.toMatch(/sessionStorage/);
      expect(src, `${f}: cookie`).not.toMatch(/document\.cookie/);
      expect(src, `${f}: indexedDB`).not.toMatch(/indexedDB/);
    }
  });

  it("never offers a browser autofill on an immigration identifier", () => {
    const src = read("components/tools/WhichNumberIsThis.tsx");
    expect(src).toContain('autoComplete="off"');
    expect(src).toContain("spellCheck={false}");
  });

  it("gives the trip checker no free-text field for criminal history", () => {
    const src = read("components/tools/TripRiskChecker.tsx");
    // A yes/no checkbox and nothing else. A textarea here would be collecting
    // exactly the detail the page promises not to ask for.
    expect(src).toContain('type="checkbox"');
    expect(src).not.toMatch(/<textarea/);
  });
});

describe("editorial rules for this build", () => {
  it("never uses the word caveat", () => {
    for (const f of ALL_RENDERING) {
      expect(read(f).toLowerCase(), `${f}: uses "caveat"`).not.toContain("caveat");
    }
  });

  it("keeps a forecast word out of every month route", () => {
    const src = read("lib/visaBulletinProjections.ts");
    for (const m of src.matchAll(/"(\d{4}-\d{2})"/g)) {
      expect(m[1]).toMatch(/^\d{4}-\d{2}$/);
    }
    // And the page itself must say so, because the reasoning is the content.
    const page = read("components/visa-bulletin/ProjectedMonthPage.tsx");
    expect(page).toMatch(/clean URL|URL is the month|same address/i);
  });

  it("labels every projected value and never calls one official", () => {
    const page = read("components/visa-bulletin/ProjectedMonthPage.tsx");
    expect(page).toContain("PROJECTED_BANNER");
    expect(page).toContain("PROJECTED_BADGE");
    expect(page).toContain("Projected range");
    // The phrase a careless edit would produce.
    expect(page).not.toMatch(/official (final action|cutoff|dates) for \$\{label\}/);
  });

  it("never asserts a USCIS chart determination for a projected month", () => {
    const page = read("components/visa-bulletin/ProjectedMonthPage.tsx");
    expect(page).toContain("determinationMonthLabel");
    expect(page).toMatch(/Not determined for|Nobody knows yet/);
  });

  it("stamps every page with a verified date from a constant, never a clock", () => {
    for (const f of PAGES) {
      const src = read(f);
      expect(src, `${f}: no verified stamp`).toMatch(/_VERIFIED/);
      expect(src, `${f}: clock-derived date`).not.toMatch(/new Date\(\)/);
    }
  });

  it("gives every page a ReviewedByline and a NotLegalAdvice", () => {
    for (const f of PAGES.concat("components/visa-bulletin/ProjectedMonthPage.tsx")) {
      const src = read(f);
      expect(src, `${f}: no byline`).toContain("ReviewedByline");
      expect(src, `${f}: no disclosure`).toContain("NotLegalAdvice");
    }
  });

  it("puts outbound links only in a source box, a tracker entry or a lawyer list", () => {
    // Site rule: external links belong at the end of a page, not in the body.
    // The source box, the ICE tracker's own citations and the find-a-lawyer
    // list are the sanctioned places.
    for (const f of PAGES) {
      const src = read(f);
      const externals = (src.match(/href="https?:\/\//g) ?? []).length;
      if (externals === 0) continue;
      const sanctioned =
        src.includes("OfficialSourceBox") ||
        src.includes("FIND_A_LAWYER") ||
        src.includes("e.sources");
      expect(sanctioned, `${f}: body-level external links`).toBe(true);
    }
  });
});

describe("the coverage lists cannot drift", () => {
  it("has no unlisted component in this build's directories", () => {
    const found: string[] = [];
    for (const d of WATCHED_DIRS) {
      const abs = join(ROOT, d);
      try {
        if (!statSync(abs).isDirectory()) continue;
      } catch {
        continue;
      }
      for (const name of readdirSync(abs)) {
        if (name.endsWith(".tsx")) found.push(`${d}/${name}`);
      }
    }
    const listed = new Set(SVG_FILES);
    expect(
      found.filter((f) => !listed.has(f)),
      "new visual components not covered above",
    ).toEqual([]);
  });

  it("finds every file it claims to check", () => {
    for (const f of ALL_RENDERING) {
      expect(() => read(f), `${f} is missing`).not.toThrow();
    }
  });
});

describe("the projected months' robots directives", () => {
  // A silent bug this build shipped once: `robots` was passed INTO
  // pageMetadata, which does not accept it, and an object spread inside a call
  // argument disables excess-property checking — so all three months went out
  // as index, follow. It has to be applied to the returned metadata.
  it("applies robots to the returned metadata, not to pageMetadata's options", () => {
    const src = read("app/visa-bulletin/[slug]/page.tsx");
    // The fixed shape: build the metadata, then spread it with robots.
    expect(src).toMatch(/const meta = pageMetadata\(\{/);
    expect(src).toMatch(/\.\.\.meta,\s*\n\s*robots: \{/);
    // And the broken shape must not come back.
    const badSpread = /pageMetadata\(\{[\s\S]*?\.\.\.\([^)]*robots/;
    expect(src, "robots passed into pageMetadata again").not.toMatch(badSpread);
  });

  it("drives index and noindex from one predicate", () => {
    const src = read("app/visa-bulletin/[slug]/page.tsx");
    expect(src).toContain("isIndexableProjectedMonth");
    expect(src).toContain("follow: true");
  });
});
