import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Mobile-layout regressions, for the pages and components added by the
 * September 2026 competitor-gap build.
 *
 * This repo ships no headless browser, so a real 360px render cannot be
 * asserted here. What CAN be asserted is the set of traps a previous site-wide
 * phone audit actually found (see mobile-layout.test.ts and the notes in
 * ToolFirstLayout) — every one of these shipped to production once.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

/** Every file added by this build that renders something. */
const NEW_COMPONENTS = [
  "components/tools/I864SponsorIncomeChecker.tsx",
  "components/tools/I751WindowCalculator.tsx",
  "components/tools/CitizenshipTestPractice.tsx",
  "components/tools/NvcTimelineEstimator.tsx",
  "components/tools/RfeDeadlineCalculator.tsx",
  "components/tools/CouplePracticeMode.tsx",
  "components/tools/ExpediteEligibilityChecker.tsx",
  "components/tools/DivorceStatusChecker.tsx",
  "components/tools/EadExtensionCalculator.tsx",
  "components/tools/Eb1RouteFinder.tsx",
  "components/tools/EmailMyResult.tsx",
];

const NEW_SVG_FILES = [
  "components/tools/i864/charts.tsx",
  "components/tools/i751/timeline.tsx",
  "components/tools/citizenship/charts.tsx",
  "components/visa-bulletin/MonthCharts.tsx",
  "components/tools/nvc/ConsularPathDiagram.tsx",
  "components/tools/rfe/RfeFlowDiagram.tsx",
  "components/tools/h1b-weighted/WeightedSelection.tsx",
  "components/tools/marriage/InterviewDayDiagram.tsx",
  "components/tools/expedite/ExpediteDecisionTree.tsx",
  "components/tools/expedite/EscalationLadder.tsx",
  "components/tools/divorce/DivorceByStageDiagram.tsx",
  "components/tools/ead/OldVsNewRuleDiagram.tsx",
  "components/tools/eb1/Eb1Visuals.tsx",
];

/** New dedicated page routes added by this build. */
const NEW_PAGES = [
  "app/uscis/forms/i-864/page.tsx",
  "app/uscis/forms/i-751/page.tsx",
  "app/tools/citizenship-test-practice/page.tsx",
  "app/green-card/marriage-interview-questions/page.tsx",
  "app/uscis/expedite-request/page.tsx",
  "app/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw/page.tsx",
];

describe("every SVG chart and diagram is fluid, not fixed-width", () => {
  it("uses a viewBox with h-auto w-full, so it scales instead of overflowing", () => {
    for (const f of NEW_SVG_FILES) {
      const src = read(f);
      expect(src, `${f} has no viewBox`).toMatch(/viewBox=/);
      expect(src, `${f} is not fluid`).toContain('className="h-auto w-full"');
    }
  });

  it("never sets a pixel width or height attribute on the <svg> itself", () => {
    // A width="720" attribute wins over the class and forces overflow at 360px.
    for (const f of NEW_SVG_FILES) {
      const src = read(f);
      const svgOpen = src.match(/<svg[^>]*>/g) ?? [];
      for (const tag of svgOpen) {
        expect(tag, `${f}: fixed size on <svg>`).not.toMatch(/\s(width|height)="\d/);
      }
    }
  });

  it("gives every figure an accessible label and a text equivalent", () => {
    for (const f of NEW_SVG_FILES) {
      const src = read(f);
      expect(src, `${f} missing role="img"`).toContain('role="img"');
      expect(src, `${f} missing aria-label`).toContain("aria-label");
      expect(src, `${f} missing a <figcaption> text equivalent`).toContain("figcaption");
    }
  });
});

describe("text-entry controls cannot trigger iOS focus-zoom", () => {
  it("uses the shared fieldClass or an explicit 16px floor on every input", () => {
    for (const f of NEW_COMPONENTS) {
      const src = read(f);
      const hasControl = /<(input|select|textarea)\b/.test(src);
      if (!hasControl) continue;
      const usesShared = src.includes("fieldClass");
      const usesFloor = src.includes("text-base");
      expect(
        usesShared || usesFloor,
        `${f} has a form control but neither fieldClass nor text-base`
      ).toBe(true);
    }
  });
});

describe("wide content scrolls inside its own container", () => {
  it("wraps every table in an overflow-x-auto element", () => {
    for (const f of [...NEW_PAGES, "components/visa-bulletin/MonthPage.tsx"]) {
      const src = read(f);
      const tables = (src.match(/<table\b/g) ?? []).length;
      if (tables === 0) continue;
      const wrappers = (src.match(/overflow-x-auto/g) ?? []).length;
      expect(
        wrappers,
        `${f} has ${tables} table(s) but ${wrappers} overflow-x-auto wrapper(s)`
      ).toBeGreaterThanOrEqual(tables);
    }
  });

  it("gives every wide table a min-width so columns do not crush", () => {
    for (const f of NEW_PAGES) {
      const src = read(f);
      const tables = (src.match(/<table\b[^>]*>/g) ?? []);
      for (const t of tables) {
        expect(t, `${f}: table without a min-w`).toMatch(/min-w-\[/);
      }
    }
  });
});

describe("ToolFirstLayout children supply their own Container", () => {
  it("wraps content in <Container> on every page that uses the layout", () => {
    // ToolFirstLayout renders {children} raw — its header is wrapped but the
    // body is not. A page that forgets this runs edge-to-edge on a phone.
    for (const f of NEW_PAGES) {
      const src = read(f);
      if (!src.includes("ToolFirstLayout")) continue;
      expect(src, `${f} uses ToolFirstLayout without importing Container`).toContain(
        '@/components/Container'
      );
      expect(src, `${f} uses ToolFirstLayout but renders no <Container>`).toContain(
        "<Container>"
      );
    }
  });
});

describe("no hard-coded viewport assumptions", () => {
  it("never relies on window.innerWidth for layout decisions", () => {
    // Chrome's shrink-to-fit makes innerWidth lie about overflow; the audit
    // harness uses documentElement.clientWidth for the same reason.
    for (const f of [...NEW_COMPONENTS, ...NEW_SVG_FILES]) {
      expect(read(f), `${f} reads window.innerWidth`).not.toContain("window.innerWidth");
    }
  });
});

describe("every new component file is actually covered by this test", () => {
  it("has no un-listed tool component from this build", () => {
    // Guards the lists above from drifting as files are added.
    const dirs = [
      "components/tools/i864",
      "components/tools/i751",
      "components/tools/citizenship",
      "components/tools/nvc",
      "components/tools/rfe",
      "components/tools/h1b-weighted",
      "components/tools/marriage",
      "components/tools/expedite",
      "components/tools/divorce",
      "components/tools/ead",
      "components/tools/eb1",
      "components/visa-bulletin",
    ];
    const found: string[] = [];
    for (const d of dirs) {
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
    const listed = new Set([...NEW_SVG_FILES, "components/visa-bulletin/MonthPage.tsx", "components/visa-bulletin/MonthIndex.tsx"]);
    const unlisted = found.filter((f) => !listed.has(f));
    expect(unlisted, "new visual components not covered above").toEqual([]);
  });
});
