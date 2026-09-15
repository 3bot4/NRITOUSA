import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The ledger stated several headline counts twice — once in a generated tile or
 * table and again hand-typed inside an item's prose — and the two halves
 * drifted the first time the audits re-ran. The published page contradicted
 * itself in five places at once (79 vs 89 verified-number gaps, 223 vs 226
 * titles over 60, 63 vs 60 over 80, 152 vs 158 descriptions over 160, 34 vs 38
 * over 200), with nothing marking which half was stale.
 *
 * The fix is structural: item prose may not contain a count, only a
 * `{{token}}` the renderer substitutes from one results object. These tests
 * guard that structure, and the rendered output when it exists.
 */

const ROOT = process.cwd();
const LEDGER_JSON = join(ROOT, "data", "content-ledger.json");
const LEDGER_JS = join(ROOT, "scripts", "audit", "ledger.js");
const LEDGER_HTML = join(ROOT, "reports", "ledger.html");

const ledger = JSON.parse(readFileSync(LEDGER_JSON, "utf8")) as {
  items: { id: string; title: string; detail?: string; nextStep?: string; next?: string }[];
};
const renderer = readFileSync(LEDGER_JS, "utf8");

/** The counts that are computed and must therefore never be hand-typed. */
const GENERATED_TOKENS = [
  "titleOver60",
  "titleOver80",
  "descOver160",
  "descOver200",
  "fastAnswerGap",
];

describe("the renderer has exactly one results object", () => {
  it("builds it once and interpolates item prose from it", () => {
    expect(renderer).toMatch(/function buildResults\(/);
    expect(renderer).toMatch(/function interpolate\(/);
    expect(renderer).toMatch(/function resolveItems\(/);
    expect(renderer).toMatch(/const results = buildResults\(/);
  });

  it("throws on an unknown token rather than rendering it literally", () => {
    // A silent `{{typo}}` on a published page is worse than a failed build.
    const body = renderer.slice(
      renderer.indexOf("function interpolate("),
      renderer.indexOf("function resolveItems("),
    );
    expect(body).toMatch(/throw new Error/);
    expect(body).toMatch(/not in the results object/);
  });

  it("throws when a referenced audit did not run", () => {
    const body = renderer.slice(
      renderer.indexOf("function interpolate("),
      renderer.indexOf("function resolveItems("),
    );
    expect(body).toMatch(/did not run/);
  });

  it("renders the generated tables from results, not from the raw stat objects", () => {
    // These four used `meta.*` and `intent.*` directly while items used typed
    // numbers, which is how the two halves diverged.
    for (const token of GENERATED_TOKENS) {
      expect(
        renderer.includes(`results.${token}`),
        `the rendered output should read results.${token}`,
      ).toBe(true);
    }
    // Scope to the emitted template: buildResults legitimately reads the raw
    // stat objects — that is its job. Nothing downstream of it may.
    const template = renderer.slice(renderer.indexOf("const html = `"));
    expect(template).not.toMatch(/\$\{meta\.titleOver60\}/);
    expect(template).not.toMatch(/\$\{meta\.descOver160\}/);
    expect(template).not.toMatch(/\$\{intent\.incompleteHigh\}/);
    expect(template).not.toMatch(/\$\{intent\.matching\}/);
  });
});

describe("no ledger item hand-types a generated count", () => {
  it("uses tokens for every count the audits compute", () => {
    for (const item of ledger.items) {
      const prose = [item.title, item.detail, item.nextStep, item.next]
        .filter(Boolean)
        .join(" ");
      // A bare 2-4 digit number immediately before one of the phrases the
      // generated counts describe is the shape of the old drift.
      //
      // Exception: an explicit "79 vs 89" pair is a historical record of the
      // drift itself, not a live count — it cannot go stale, because it
      // describes what two stale halves once said.
      const suspicious = [
        /\b\d{2,4} (high-intent pages|titles|meta descriptions)\b/i,
        /\b\d{2,4} (exceed|over) (60|80|160|200)\b/i,
      ];
      for (const re of suspicious) {
        for (const m of prose.matchAll(new RegExp(re.source, "gi"))) {
          const from = Math.max(0, (m.index ?? 0) - 70);
          const context = prose.slice(from, (m.index ?? 0) + m[0].length + 30);
          const historical = /\d+\s*vs\.?\s*\d+|drifted|once said|used to say|previously said/i.test(
            context,
          );
          expect(
            historical,
            `${item.id} hand-types a live count ("${m[0]}") — use a token instead`,
          ).toBe(true);
        }
      }
    }
  });

  it("only references tokens the renderer can resolve", () => {
    const available = new Set(
      [
        ...renderer
          .slice(renderer.indexOf("function buildResults("), renderer.indexOf("function interpolate("))
          .matchAll(/^\s{4}(\w+):/gm),
      ].map((m) => m[1]),
    );
    expect(available.size).toBeGreaterThan(10);
    for (const item of ledger.items) {
      const prose = [item.title, item.detail, item.nextStep, item.next]
        .filter(Boolean)
        .join(" ");
      for (const m of prose.matchAll(/\{\{(\w+)\}\}/g)) {
        expect(
          available.has(m[1]),
          `${item.id} references {{${m[1]}}}, which buildResults does not provide`,
        ).toBe(true);
      }
    }
  });
});

describe("character targets are framed as heuristics, not Google limits", () => {
  it("the renderer says so in the metadata section", () => {
    expect(renderer).toMatch(/HEURISTIC_NOTE/);
    expect(renderer).toMatch(/not Google limits/i);
    expect(renderer).toMatch(/pixel width/i);
  });

  it("no item calls 60 or 160 characters a limit Google enforces", () => {
    for (const item of ledger.items) {
      const prose = [item.title, item.detail, item.nextStep, item.next]
        .filter(Boolean)
        .join(" ");
      // The phrase may appear in order to be denied ("not a Google limit"),
      // which is exactly the framing we want, so require a negation nearby.
      for (const m of prose.matchAll(
        /Google'?s? (character )?limit|SERP display limit|exceeds? the Google limit/gi,
      )) {
        const from = Math.max(0, (m.index ?? 0) - 90);
        const context = prose.slice(from, (m.index ?? 0) + m[0].length + 40);
        expect(
          /\bnot\b|\bno\b|never|rather than|house (target|heuristic)/i.test(context),
          `${item.id} treats a house target as a Google limit: "${context.trim()}"`,
        ).toBe(true);
      }
    }
  });
});

describe("the rendered page agrees with itself", () => {
  // Only meaningful after a full refresh; skipped on a clean checkout.
  const html = existsSync(LEDGER_HTML) ? readFileSync(LEDGER_HTML, "utf8") : null;

  it.skipIf(!html)("leaves no unsubstituted tokens", () => {
    expect(html!.match(/\{\{\w+\}\}/g)).toBeNull();
  });

  it.skipIf(!html)("quotes each count identically in prose and in the table", () => {
    const table = (re: RegExp) => {
      const m = html!.match(re);
      expect(m, `table row not found: ${re}`).toBeTruthy();
      return m!;
    };
    const titleRow = table(
      /<td>Title<\/td><td class="num">\d+<\/td><td class="num">\d+<\/td><td class="num">([\d,]+) &gt;60 · ([\d,]+) &gt;80<\/td>/,
    );
    const descRow = table(
      /<td>Description<\/td><td class="num">\d+<\/td><td class="num">\d+<\/td><td class="num">([\d,]+) &gt;160 · ([\d,]+) &gt;200<\/td>/,
    );

    const prose = (re: RegExp) => {
      const m = html!.match(re);
      expect(m, `prose count not found: ${re}`).toBeTruthy();
      return m![1];
    };
    expect(prose(/([\d,]+) titles run past/)).toBe(titleRow[1]);
    expect(prose(/([\d,]+) meta descriptions run past/)).toBe(descRow[1]);

    const tile = html!.match(/Fast Answer gap<\/div><div class="v [a-z]*">([\d,]+)</);
    expect(tile).toBeTruthy();
    expect(prose(/([\d,]+) high-intent pages still lack/)).toBe(tile![1]);
  });
});
