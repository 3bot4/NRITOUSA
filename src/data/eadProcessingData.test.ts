import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  eadProcessingData,
  eadSnapshotRows,
  stemPendingAuth,
  EAD_AUTO_EXTENSION_SUMMARY,
  EAD_AUTO_EXTENSION_CLAUSE,
  EAD_OPT_VS_STEM_SUMMARY,
  eadAutoExtensionRuleStatus,
} from "./eadProcessingData";

/**
 * Two mistakes have already been made in this cluster and both were reader-
 * facing:
 *
 *   1. The data file recorded that the automatic extension had ended while two
 *      pages still told readers they "currently" had up to 540 days.
 *   2. The two F-1 categories were grouped together as having no automatic
 *      extension. That is right for initial OPT and wrong for a timely-filed
 *      STEM extension, which keeps up to 180 days under
 *      8 CFR 274a.12(b)(6)(iv) — a provision the Oct 30, 2025 interim final
 *      rule never touched, because that rule amended only § 274a.13.
 *
 * Telling a STEM student they cannot work when they lawfully can is the most
 * damaging thing this cluster could say, so it is asserted from several angles.
 */

const SURFACES = [
  "src/app/ead-renewal-gap/page.tsx",
  "src/app/ead-processing-time/page.tsx",
  "src/components/tools/EadProcessingCalculator.tsx",
  "src/components/tools/H4EadNavigator.tsx",
  "src/data/eadProcessingData.ts",
];

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), "utf8");

describe("the repealed 540-day extension is never described as current", () => {
  it("no surface says the extension is 'currently' available", () => {
    // The exact phrasing that shipped wrong, plus the near variants. A mention
    // of 540 days is fine — it still applies to pre-cutoff filings — but never
    // in the present tense as something a reader has now.
    const forbidden = [
      /currently up to 540/i,
      /currently,? up to \$\{[^}]*autoExtensionDays\}/i,
      /automatically extended[^.]{0,40}\bcurrently\b/i,
      /you (currently )?(get|have|receive) up to 540/i,
      /increased this automatic extension to up to 540/i,
    ];
    for (const rel of SURFACES) {
      const src = read(rel);
      for (const re of forbidden) {
        expect(re.test(src), `${rel} presents the 540-day extension as current`).toBe(false);
      }
    }
  });

  it("every 540 mention sits next to the cutoff or a past-tense marker", () => {
    // A generous window (400 chars either side) so a field whose framing lives
    // in the doc comment above it still passes — the point is to catch a bare
    // present-tense claim, not to police comment placement.
    const framed =
      /before (october 30, 2025|oct 30, 2025|2025-10-30)|autoExtensionRemovedDate|received before|does not apply|does NOT apply|used to|previously|previous|ended|DORMANT|no longer|kept|keep|retain|would have/i;
    for (const rel of SURFACES) {
      const src = read(rel);
      for (const m of src.matchAll(/.{0,400}540.{0,400}/gs)) {
        expect(
          framed.test(m[0]),
          `${rel}: a 540-day mention lacks its cutoff or past-tense framing`,
        ).toBe(true);
      }
    }
  });

  it("the canonical summary carries all three facts at once", () => {
    // Dropping any one of these makes the sentence wrong for somebody.
    expect(EAD_AUTO_EXTENSION_SUMMARY).toMatch(/on or after October 30, 2025/);
    expect(EAD_AUTO_EXTENSION_SUMMARY).toMatch(/before that date/i);
    expect(EAD_AUTO_EXTENSION_SUMMARY).toMatch(/Federal Register notice/i);
    expect(EAD_AUTO_EXTENSION_SUMMARY).toMatch(/274a\.13\(e\)/);
    expect(EAD_AUTO_EXTENSION_CLAUSE).toMatch(/on or after October 30, 2025/);
  });

  it("carries the rule's citation and its status separately from the numbers", () => {
    expect(eadProcessingData.autoExtensionRuleCitation).toBe("90 FR 48799");
    expect(eadProcessingData.autoExtensionRemovedDate).toBe("2025-10-30");
    expect(eadAutoExtensionRuleStatus.inForce).toBe(true);
  });
});

describe("STEM OPT is never classified as having no automatic extension", () => {
  it("carries its 180 days and its own citation", () => {
    expect(stemPendingAuth.code).toBe("(c)(3)(C)");
    expect(stemPendingAuth.pendingAuthDays).toBe(180);
    expect(stemPendingAuth.pendingAuthCite).toMatch(/274a\.12\(b\)\(6\)\(iv\)/);
  });

  it("does not borrow the renewal mechanism that was repealed", () => {
    // Its authorisation must not be modelled as § 274a.13(d), or a future
    // change to that mechanism would silently switch STEM off too.
    expect(stemPendingAuth.autoExtension).toBe(false);
    expect(stemPendingAuth.autoExtensionPreRule).toBe(false);
  });

  it("is the only category with pending-application authorisation", () => {
    const withAuth = eadProcessingData.categories.filter(
      (c) => c.pendingAuthDays != null,
    );
    expect(withAuth.map((c) => c.key)).toEqual(["c03c"]);
  });

  it("keeps initial/post-completion OPT at no pending authorisation", () => {
    const optb = eadProcessingData.categories.find((c) => c.key === "c03b")!;
    expect(optb.code).toBe("(c)(3)(B)");
    expect(optb.pendingAuthDays).toBeNull();
  });

  it("every category states a pending-authorisation position explicitly", () => {
    for (const c of eadProcessingData.categories) {
      expect(
        c.pendingAuthDays === null || typeof c.pendingAuthDays === "number",
        `${c.key} must declare pendingAuthDays`,
      ).toBe(true);
      if (c.pendingAuthDays != null) {
        expect(c.pendingAuthCite, `${c.key} has days but no citation`).toBeTruthy();
      }
    }
  });

  it("the shared OPT-vs-STEM wording distinguishes the two", () => {
    expect(EAD_OPT_VS_STEM_SUMMARY).toMatch(/\(c\)\(3\)\(B\)/);
    expect(EAD_OPT_VS_STEM_SUMMARY).toMatch(/\(c\)\(3\)\(C\)/);
    expect(EAD_OPT_VS_STEM_SUMMARY).toMatch(/180 days/);
    expect(EAD_OPT_VS_STEM_SUMMARY).toMatch(/274a\.12\(b\)\(6\)\(iv\)/);
  });

  it("no surface groups the two OPT categories as both getting nothing", () => {
    const forbidden = [
      /OPT categories were always excluded/i,
      /F-1 OPT and STEM OPT never had it\./i,
      /OPT and STEM OPT[^.]{0,60}\bno automatic\b/i,
      /(OPT \/ STEM OPT|OPT and STEM OPT)[^.]{0,80}wait for the card/i,
    ];
    for (const rel of SURFACES) {
      const src = read(rel);
      for (const re of forbidden) {
        expect(re.test(src), `${rel} groups OPT and STEM OPT together`).toBe(false);
      }
    }
  });

  it("the calculator branches on pendingAuthDays before the repeal branch", () => {
    // Order matters: if the "no auto-extension" branch were reached first, a
    // STEM filer would be told to stop working.
    const src = read("src/components/tools/EadProcessingCalculator.tsx");
    const stemAt = src.indexOf("cat.pendingAuthDays != null");
    const repealAt = src.indexOf('autoExtValue = "No auto-extension"');
    expect(stemAt).toBeGreaterThan(-1);
    expect(repealAt).toBeGreaterThan(-1);
    expect(stemAt).toBeLessThan(repealAt);
  });
});

describe("visible content and FAQ schema cannot disagree", () => {
  // Both the accordion and the FAQPage JSON-LD are built from the same `faq`
  // array, so the guarantee is structural — these assertions protect that
  // structure rather than diffing two rendered copies.
  const pages = [
    "src/app/ead-renewal-gap/page.tsx",
    "src/app/ead-processing-time/page.tsx",
  ];

  it("each page derives its FAQ schema from the same array it renders", () => {
    for (const rel of pages) {
      const src = read(rel);
      expect(src, `${rel} must build schema from the faq array`).toMatch(
        /faqJsonLd\(faq\)/,
      );
      expect(src, `${rel} must render the same array`).toMatch(
        /<ToolFaq items=\{faq\}/,
      );
      // A second, hand-written FAQ list would defeat the single source.
      const declarations = src.match(/const faq[A-Za-z]*: FaqItem\[\]/g) ?? [];
      expect(declarations.length, `${rel} declares more than one FAQ array`).toBe(1);
    }
  });

  it("no page hand-rolls a FAQPage schema object alongside the array", () => {
    for (const rel of pages) {
      const src = read(rel);
      expect(src).not.toMatch(/"@type":\s*"FAQPage"/);
      expect(src).not.toMatch(/mainEntity:\s*\[/);
    }
  });

  it("FAQ answers that mention the extension use the shared wording", () => {
    for (const rel of pages) {
      const src = read(rel);
      const faqBlock = src.slice(
        src.indexOf("const faq: FaqItem[]"),
        src.indexOf("export default function"),
      );
      expect(faqBlock).toMatch(/EAD_AUTO_EXTENSION_SUMMARY/);
      expect(faqBlock).toMatch(/STEM\.pendingAuthDays|EAD_OPT_VS_STEM_SUMMARY/);
    }
  });
});

describe("the snapshot row shown above the fold", () => {
  it("does not present the extension as available", () => {
    const row = eadSnapshotRows.find((r) => r.label === "Auto-extension")!;
    expect(row).toBeDefined();
    expect(row.value).toMatch(/ended/i);
    expect(`${row.value} ${row.note ?? ""}`).not.toMatch(/currently up to 540/i);
  });

  it("names the cutoff and the surviving exceptions", () => {
    const row = eadSnapshotRows.find((r) => r.label === "Auto-extension")!;
    expect(row.note).toMatch(/Oct 30, 2025/);
    expect(row.note).toMatch(/Federal Register notice|law/i);
  });
});
