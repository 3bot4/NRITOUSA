import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GOVERNMENT_FEES, PASSPORT_UPDATE } from "@/lib/oci/config";
import { SERVICE_TYPE_OPTIONS, computeCost, DEFAULT_COST_INPUTS } from "@/lib/oci/cost";
import { getOciGuide } from "@/lib/ociGuides";

/**
 * Two OCI rules were published here that no official source supports:
 *   • "OCI must be re-issued once you cross 50" — there is no such milestone.
 *   • "A minor must re-issue with every new passport" — that is an upload.
 * A third error was in the fees: a revision set lost/damaged re-issue to $25
 * when it is $100, understating it fourfold.
 *
 * The verified position, cross-checked against the GoI OCI portal FAQs, the
 * CGI San Francisco advisory of June 16 2026, CGI Chicago and CGI Atlanta, is
 * that a passport-particulars update is online, free within three months, and
 * needs no physical application. The missions do NOT agree on whether it is
 * required after every new passport or only up to 20 and once after 50, so the
 * cluster must present the common ground and attribute the divergence rather
 * than adopting one consulate's wording as national.
 */

const SURFACES = [
  "src/lib/ociGuides.ts",
  "src/app/oci/page.tsx",
  "src/app/oci/e-oci-card/page.tsx",
  "src/lib/oci/config.ts",
  "src/lib/oci/cost.ts",
];
const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

describe("the two rules that do not exist", () => {
  /**
   * These rules may legitimately appear in order to be DENIED — the guide
   * quotes both to undeceive readers who saw the earlier version. So a hit is
   * only a failure when it is not negated nearby.
   */
  const NEGATED =
    /\bno\b|\bnot\b|never|no longer|used to say|misconception|does not exist|no source supports|no official source|wrong|incorrect/i;

  const expectNoAssertion = (patterns: RegExp[], what: string) => {
    for (const rel of SURFACES) {
      const src = read(rel);
      for (const re of patterns) {
        for (const m of src.matchAll(new RegExp(re.source, "gis"))) {
          const from = Math.max(0, (m.index ?? 0) - 240);
          const context = src.slice(from, (m.index ?? 0) + m[0].length + 240);
          expect(
            NEGATED.test(context),
            `${rel} appears to assert ${what}: ...${m[0].slice(0, 90)}...`,
          ).toBe(true);
        }
      }
    }
  };

  it("never asserts a re-issue milestone at age 50", () => {
    expectNoAssertion(
      [
        /re-?issue[^.]{0,40}(after|at|crossing|crosses|once past)\s*(age\s*)?50/,
        /(crosses|turning|after)\s*50[^.]{0,40}re-?issue is required/,
        /one re-?issue is required after age 50/,
      ],
      "a re-issue at 50",
    );
  });

  it("never says a minor must re-issue on each new passport", () => {
    expectNoAssertion(
      [
        /minor[^.]{0,60}re-?issue each time/,
        /re-?issue[^.]{0,40}each time[^.]{0,30}minor/,
        /minor \(under 20\) gets a new passport[^.]{0,30}re-?issue/,
      ],
      "a per-passport re-issue for minors",
    );
  });

  it("states the corrections explicitly in the guide, so readers who saw the old rule are undeceived", () => {
    const guide = getOciGuide("renewal")!;
    expect(guide.content).toMatch(/No source supports a paid re-issue milestone at 50/i);
    expect(guide.content).toMatch(/For a minor it is an upload, not a re-issue/i);
  });
});

describe("the passport-particulars update", () => {
  const guide = getOciGuide("renewal")!;

  it("is free, online and within three months", () => {
    expect(PASSPORT_UPDATE.windowMonths).toBe(3);
    expect(PASSPORT_UPDATE.timelyFeeUsd).toBe(0);
    expect(guide.content).toMatch(/free/i);
    expect(guide.content).toMatch(/no physical application/i);
    expect(guide.content).toMatch(/three months|3 months/i);
  });

  it("does not present one consulate's wording as national", () => {
    // San Francisco is the newest and clearest source but it is not the only
    // one, and the others differ. Adopting it silently would be wrong.
    expect(PASSPORT_UPDATE.jurisdictionsDiverge).toBe(true);
    expect(guide.content).toMatch(/Where the missions do not agree/i);
    expect(guide.content).toMatch(/CGI San Francisco/);
    expect(guide.content).toMatch(/CGI Chicago/);
    expect(guide.content).toMatch(/Government of India OCI portal|GoI portal/);
    // and it must tell the reader to use their own jurisdiction
    expect(guide.content).toMatch(/mission that covers your state|your own mission/i);
  });

  it("cites more than one mission plus the national portal", () => {
    const hosts = PASSPORT_UPDATE.sources.map((x) => new URL(x.href).host);
    expect(hosts).toContain("ociservices.gov.in");
    expect(new Set(hosts).size).toBeGreaterThanOrEqual(3);
  });

  it("carries the age-20 biometric point as attributed, not as a card re-issue", () => {
    expect(PASSPORT_UPDATE.biometricsAfterAge).toBe(20);
    expect(guide.content).toMatch(/biometric/i);
  });
});

describe("OCI fees", () => {
  it("prices a lost or damaged card at $100, not the miscellaneous rate", () => {
    // The specific regression: $25 understated this fourfold.
    expect(GOVERNMENT_FEES.lostDamaged.amount).toBe(100);
    expect(GOVERNMENT_FEES.lostDamaged.amount).not.toBe(25);
  });

  it("prices PIO conversion at $100 and never as free", () => {
    expect(GOVERNMENT_FEES.pioConversion.amount).toBe(100);
    expect(GOVERNMENT_FEES.pioConversion.amount).toBeGreaterThan(0);
  });

  it("keeps fresh registration at the registration rate", () => {
    expect(GOVERNMENT_FEES.freshAdult.amount).toBe(275);
    expect(GOVERNMENT_FEES.freshMinor.amount).toBe(275);
  });

  it("charges the late passport update at the miscellaneous-services rate", () => {
    expect(GOVERNMENT_FEES.passportUpdateLate.amount).toBe(25);
  });

  it("keeps lost/damaged and PIO conversion separate from a passport update", () => {
    const guide = getOciGuide("renewal")!;
    expect(guide.content).toMatch(/Lost, stolen or damaged card — a different service/i);
    expect(guide.content).toMatch(/PIO card conversion — also separate/i);
    // The three must not be collapsed into one fee.
    expect(GOVERNMENT_FEES.lostDamaged.amount).not.toBe(
      GOVERNMENT_FEES.passportUpdateLate.amount,
    );
  });

  it("exposes every priced service in the cost calculator, and costs them", () => {
    const keys = SERVICE_TYPE_OPTIONS.map((o) => o.value).sort();
    expect(keys).toEqual(Object.keys(GOVERNMENT_FEES).sort());
    for (const o of SERVICE_TYPE_OPTIONS) {
      const out = computeCost({ ...DEFAULT_COST_INPUTS, serviceType: o.value });
      expect(out.total, `${o.value} produced no total`).toBeGreaterThan(0);
      expect(Number.isFinite(out.total)).toBe(true);
    }
  });

  it("has no dangling fee key that would resolve to undefined at runtime", () => {
    // GOVERNMENT_FEES was once typed Record<string, FeeLine>, which let a
    // removed key type-check everywhere and go undefined in the browser.
    for (const [key, line] of Object.entries(GOVERNMENT_FEES)) {
      expect(line, `${key} is undefined`).toBeTruthy();
      expect(typeof line.amount).toBe("number");
      expect(line.id).toBeTruthy();
    }
    const src = read("src/lib/oci/config.ts");
    expect(src).toMatch(/satisfies Record<string, FeeLine>/);
    expect(src).not.toMatch(/GOVERNMENT_FEES: Record<string, FeeLine>/);
  });
});
