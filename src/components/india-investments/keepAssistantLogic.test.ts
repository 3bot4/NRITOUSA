import { describe, it, expect } from "vitest";
import {
  evaluateAsset,
  CATEGORY_LABELS,
  type AssistantInputs,
  type ResultCategory,
} from "./keepAssistantLogic";

const base: AssistantInputs = {
  usPerson: "yes",
  asset: "stocks",
  returnPlan: "no-plan",
  horizon: "over-5",
  currency: "usd",
  portion: "under-10",
  reporting: "yes",
};
const withInputs = (o: Partial<AssistantInputs>): AssistantInputs => ({ ...base, ...o });

describe("evaluateAsset — invariants", () => {
  const cases: AssistantInputs[] = [
    base,
    withInputs({ asset: "mutual-fund" }),
    withInputs({ asset: "nro-fd", portion: "over-25" }),
    withInputs({ asset: "ppf" }),
    withInputs({ asset: "real-estate", portion: "over-25" }),
    withInputs({ asset: "gold", currency: "usd", horizon: "under-2" }),
    withInputs({ usPerson: "not-sure", currency: "not-sure", portion: "not-sure", reporting: "not-sure" }),
  ];

  it("always returns 3–5 reasons, a section anchor, and at least one guide link", () => {
    for (const c of cases) {
      const r = evaluateAsset(c);
      expect(r.reasons.length).toBeGreaterThanOrEqual(3);
      expect(r.reasons.length).toBeLessThanOrEqual(5);
      expect(r.sectionHref.startsWith("#")).toBe(true);
      expect(r.guideLinks.length).toBeGreaterThanOrEqual(1);
      expect(r.summary.length).toBeGreaterThan(0);
      expect(CATEGORY_LABELS[r.category]).toBe(r.categoryLabel);
    }
  });

  it("never has duplicate reasons", () => {
    for (const c of cases) {
      const r = evaluateAsset(c);
      expect(new Set(r.reasons).size).toBe(r.reasons.length);
    }
  });
});

describe("evaluateAsset — branching", () => {
  it("US person + Indian mutual fund → PFIC, high friction", () => {
    const r = evaluateAsset(withInputs({ asset: "mutual-fund" }));
    expect(r.category).toBe<ResultCategory>("high-friction");
    expect(r.mainIssue).toBe("PFIC");
    expect(r.sectionHref).toBe("#mutual-funds");
  });

  it("reporting gap takes priority over PFIC for a US person", () => {
    const r = evaluateAsset(withInputs({ asset: "mutual-fund", reporting: "no" }));
    expect(r.category).toBe<ResultCategory>("pro-review");
    expect(r.mainIssue).toBe("FBAR/FATCA reporting");
  });

  it("unsure US-person status on a pooled product → professional review, PFIC", () => {
    const r = evaluateAsset(withInputs({ asset: "ulip", usPerson: "not-sure", reporting: "na" }));
    expect(r.category).toBe<ResultCategory>("pro-review");
    expect(r.mainIssue).toBe("PFIC");
  });

  it("non-US holder of a mutual fund is not flagged as PFIC high-friction", () => {
    const r = evaluateAsset(withInputs({ asset: "mutual-fund", usPerson: "no", reporting: "na" }));
    expect(r.category).not.toBe("high-friction");
    expect(r.mainIssue).not.toBe("PFIC");
  });

  it("US person + NRO FD → NRO taxation (keep-review small, high-friction if large)", () => {
    expect(evaluateAsset(withInputs({ asset: "nro-fd", portion: "under-10" })).category).toBe("keep-review");
    expect(evaluateAsset(withInputs({ asset: "nro-fd", portion: "over-25" })).category).toBe("high-friction");
    expect(evaluateAsset(withInputs({ asset: "nro-fd" })).mainIssue).toBe("NRO taxation");
  });

  it("large Indian real estate → professional review, repatriation", () => {
    const r = evaluateAsset(withInputs({ asset: "real-estate", portion: "over-25" }));
    expect(r.category).toBe<ResultCategory>("pro-review");
    expect(r.mainIssue).toBe("Repatriation");
  });

  it("PPF held by a US person → professional review", () => {
    expect(evaluateAsset(withInputs({ asset: "ppf" })).category).toBe("pro-review");
    expect(evaluateAsset(withInputs({ asset: "nps" })).category).toBe("pro-review");
  });

  it("returning soon with rupee goals → return-changes / RNOR", () => {
    const r = evaluateAsset(withInputs({ asset: "stocks", returnPlan: "within-3", currency: "inr" }));
    expect(r.category).toBe<ResultCategory>("return-changes");
    expect(r.mainIssue).toBe("RNOR planning");
    expect(r.sectionHref).toBe("#returning");
  });

  it("USD goal + rupee asset needed soon → favour USD, currency mismatch", () => {
    const r = evaluateAsset(withInputs({ asset: "gold", currency: "usd", horizon: "2-5", returnPlan: "no-plan" }));
    expect(r.category).toBe<ResultCategory>("favor-usd");
    expect(r.mainIssue).toBe("Currency mismatch");
  });

  it("NRE / FCNR deposit for a long-horizon or rupee goal → simple to keep", () => {
    expect(evaluateAsset(withInputs({ asset: "fcnr", currency: "inr", horizon: "over-5" })).category).toBe("simple-keep");
    expect(evaluateAsset(withInputs({ asset: "nre-fd", currency: "inr", horizon: "over-5" })).category).toBe("simple-keep");
  });

  it("small direct stock position, dollar-neutral → simple to keep", () => {
    const r = evaluateAsset(withInputs({ asset: "stocks", currency: "both", portion: "under-10", horizon: "over-5" }));
    expect(r.category).toBe<ResultCategory>("simple-keep");
    expect(r.sectionHref).toBe("#stocks");
  });

  it("very little information → more-info", () => {
    const r = evaluateAsset(
      withInputs({ usPerson: "not-sure", asset: "other", currency: "not-sure", portion: "not-sure", reporting: "not-sure" }),
    );
    expect(r.category).toBe<ResultCategory>("more-info");
    expect(r.mainIssue).toBe("Insufficient information");
  });

  it("all seven result categories are reachable from some input", () => {
    const reachable = new Set<ResultCategory>();
    const opts = {
      usPerson: ["yes", "no", "not-sure"],
      asset: ["stocks", "mutual-fund", "ulip", "nre-fd", "fcnr", "nro-fd", "real-estate", "ppf", "nps", "gold", "other"],
      returnPlan: ["within-3", "3-7", "uncertain", "no-plan"],
      horizon: ["under-2", "2-5", "over-5", "no-date"],
      currency: ["usd", "inr", "both", "not-sure"],
      portion: ["under-10", "10-25", "over-25", "not-sure"],
      reporting: ["yes", "no", "not-sure", "na"],
    } as const;
    for (const usPerson of opts.usPerson)
      for (const asset of opts.asset)
        for (const returnPlan of opts.returnPlan)
          for (const horizon of opts.horizon)
            for (const currency of opts.currency)
              for (const portion of opts.portion)
                for (const reporting of opts.reporting)
                  reachable.add(
                    evaluateAsset({ usPerson, asset, returnPlan, horizon, currency, portion, reporting }).category,
                  );
    for (const cat of Object.keys(CATEGORY_LABELS) as ResultCategory[]) {
      expect(reachable.has(cat), `category ${cat} should be reachable`).toBe(true);
    }
  });
});
