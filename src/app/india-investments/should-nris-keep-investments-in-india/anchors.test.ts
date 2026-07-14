import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  evaluateAsset,
  type AssistantInputs,
  type AssetType,
  type UsPerson,
  type ReturnPlan,
  type Horizon,
  type Currency,
  type Portion,
  type Reporting,
} from "@/components/india-investments/keepAssistantLogic";

const pageSrc = readFileSync(
  resolve(__dirname, "page.tsx"),
  "utf8",
);

/** All literal `id="..."` targets rendered on the page. */
function sectionIds(): string[] {
  return [...pageSrc.matchAll(/\bid="([a-z0-9-]+)"/g)].map((m) => m[1]);
}
/** ToC ids declared in the JUMP registry (id: "..."). */
function jumpIds(): string[] {
  const block = pageSrc.slice(pageSrc.indexOf("const JUMP"), pageSrc.indexOf("];", pageSrc.indexOf("const JUMP")));
  return [...block.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
}
/** Every literal in-page hash link (href / ctaHref="#..."). */
function hrefHashes(): string[] {
  return [...pageSrc.matchAll(/[hH]ref="#([a-z0-9-]+)"/g)].map((m) => m[1]);
}

describe("anchor integrity", () => {
  it("has no duplicate section ids", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every ToC (JUMP) entry points to a rendered section id", () => {
    const ids = new Set(sectionIds());
    for (const id of jumpIds()) {
      expect(ids.has(id), `ToC id #${id} must exist on the page`).toBe(true);
    }
  });

  it("every in-page hash link resolves to a rendered id", () => {
    const ids = new Set(sectionIds());
    for (const h of hrefHashes()) {
      expect(ids.has(h), `href #${h} must exist on the page`).toBe(true);
    }
  });

  it("preserves important indexed anchors", () => {
    const ids = new Set(sectionIds());
    for (const key of ["decision-tree", "quick-answer", "mutual-funds", "nre-nro", "faq"]) {
      expect(ids.has(key), `anchor #${key} must be preserved`).toBe(true);
    }
  });

  it("every section the decision assistant can link to exists on the page", () => {
    const ids = new Set(sectionIds());
    const usPerson: UsPerson[] = ["yes", "no", "not-sure"];
    const asset: AssetType[] = ["stocks", "mutual-fund", "ulip", "nre-fd", "fcnr", "nro-fd", "real-estate", "ppf", "nps", "gold", "other"];
    const returnPlan: ReturnPlan[] = ["within-3", "3-7", "uncertain", "no-plan"];
    const horizon: Horizon[] = ["under-2", "2-5", "over-5", "no-date"];
    const currency: Currency[] = ["usd", "inr", "both", "not-sure"];
    const portion: Portion[] = ["under-10", "10-25", "over-25", "not-sure"];
    const reporting: Reporting[] = ["yes", "no", "not-sure", "na"];
    const seen = new Set<string>();
    for (const a of asset)
      for (const u of usPerson)
        for (const r of returnPlan)
          for (const h of horizon)
            for (const c of currency)
              for (const p of portion)
                for (const rep of reporting) {
                  const input: AssistantInputs = { usPerson: u, asset: a, returnPlan: r, horizon: h, currency: c, portion: p, reporting: rep };
                  seen.add(evaluateAsset(input).sectionHref);
                }
    for (const href of seen) {
      expect(href.startsWith("#")).toBe(true);
      expect(ids.has(href.slice(1)), `assistant links to ${href}, which must exist on the page`).toBe(true);
    }
  });
});
