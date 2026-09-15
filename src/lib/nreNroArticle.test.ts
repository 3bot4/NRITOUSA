import { describe, expect, it } from "vitest";
import { getArticle } from "@/lib/articles";

/**
 * A claim may appear in order to be DENIED — the article quotes both popular
 * over-statements and corrects them, which is the point. So the assertions
 * below check for an *unnegated* claim, not for the words.
 */
const NEGATED =
  /\bwrong\b|\bnot\b|\bno\b|never|equally wrong|over-?statement|misconception|is incorrect|common claim/i;

const expectNoUnnegatedClaim = (content: string, re: RegExp, what: string) => {
  for (const m of content.matchAll(new RegExp(re.source, "gis"))) {
    const from = Math.max(0, (m.index ?? 0) - 260);
    const context = content.slice(from, (m.index ?? 0) + m[0].length + 260);
    expect(
      NEGATED.test(context),
      `${what}: ...${m[0].slice(0, 130)}...`,
    ).toBe(true);
  }
};

/**
 * The NRE/NRO article is cited as the authority by three sibling articles and
 * by the /send-money-to-india hub, so an over-simplification here propagates.
 * Four over-simplifications are easy to make and each is materially wrong:
 *
 *   1. "NRE interest is tax-free" — exempt in India only, and only while the
 *      holder satisfies the nonresident conditions the exemption rests on.
 *   2. "You can only repatriate USD 1 million a year from NRO" — that is the
 *      remittance-of-assets facility. Current income is freely repatriable
 *      net of tax and is not counted against it.
 *   3. "Forms 15CA and 15CB are both required" — Form 15CB is event-based, and
 *      some remittances are outside Form 15CA entirely under Rule 37BB(3).
 *   4. "NRO interest is taxed at 30%" — before surcharge and cess, before any
 *      treaty position, and before any refund on filing.
 */
const article = getArticle("nre-nro-accounts-explained")!;
const content = article.content;

describe("NRE interest exemption is stated conditionally", () => {
  it("never claims a flat tax-free status without the conditions", () => {
    for (const m of content.matchAll(/.{0,200}tax-free.{0,200}/gs)) {
      expect(
        /in India|conditional|nonresident conditions|exempt|qualify|not exempt from US/i.test(m[0]),
        `an unqualified "tax-free" claim: ...${m[0].slice(0, 120)}...`,
      ).toBe(true);
    }
  });

  it("names the nonresident condition the exemption depends on", () => {
    expect(content).toMatch(/nonresident conditions/i);
    expect(content).toMatch(/resident outside India|FEMA/i);
  });

  it("states the US side for both account types", () => {
    expect(content).toMatch(/worldwide income/i);
    expect(content).toMatch(/both\*{0,2} NRE and NRO|NRE and NRO/i);
    expect(content).toMatch(/Form 8938/);
    expect(content).toMatch(/FBAR/);
  });
});

describe("NRO repatriation is two rules, not one cap", () => {
  it("says current income is freely repatriable and outside the facility", () => {
    expect(content).toMatch(/current income/i);
    expect(content).toMatch(/freely/i);
    expect(content).toMatch(/not counted against/i);
  });

  it("never implies every NRO remittance is capped at USD 1 million", () => {
    // The claim is only correct of balances and other eligible assets.
    for (const m of content.matchAll(/.{0,260}(USD 1 million|\$1 ?M|USD 1\b).{0,260}/gs)) {
      expect(
        /balances|assets|inheritance|facility|not counted|current income|capital/i.test(m[0]),
        `a USD 1 million mention without its scope: ...${m[0].slice(0, 140)}...`,
      ).toBe(true);
    }
    expectNoUnnegatedClaim(
      content,
      /only (take|remit|send) USD 1 million a year out of an NRO/,
      "an unnegated blanket USD 1 million cap claim",
    );
  });

  it("corrects the popular over-statement explicitly", () => {
    expect(content).toMatch(/wrong as a general statement|describes the remittance-of-assets facility/i);
  });
});

describe("15CA / 15CB documentation is event-based", () => {
  it("never says both forms are always required", () => {
    const forbidden = [
      /each remittance needs Forms 15CA and 15CB/,
      /Forms? 15CA and 15CB (are )?always/,
      /needs? Forms 15CA and 15CB — the latter certified[^.]*every time/,
      /15CA\/15CB process, every time/,
    ];
    for (const re of forbidden) {
      expectNoUnnegatedClaim(content, re, "asserts 15CA+15CB are always required");
    }
  });

  it("explains that it turns on the remittance and Rule 37BB", () => {
    expect(content).toMatch(/Rule 37BB/);
    expect(content).toMatch(/event-based/i);
    expect(content).toMatch(/₹5 lakh/);
    expect(content).toMatch(/four parts/i);
    expect(content).toMatch(/37BB\(3\)/);
  });
});

describe("the NRO TDS rate carries its caveats", () => {
  it("never states a bare 30% as the outcome", () => {
    for (const m of content.matchAll(/.{0,240}30%.{0,240}/gs)) {
      expect(
        /surcharge|cess|treaty|DTAA|refund|about|commonly quoted|starting point/i.test(m[0]),
        `a bare 30% TDS claim: ...${m[0].slice(0, 140)}...`,
      ).toBe(true);
    }
  });

  it("names all four things that move the effective result", () => {
    expect(content).toMatch(/surcharge/i);
    expect(content).toMatch(/cess/i);
    expect(content).toMatch(/DTAA|treaty/i);
    expect(content).toMatch(/refund/i);
  });
});

describe("primary sourcing", () => {
  it("cites RBI and the Income Tax Department, not secondary write-ups", () => {
    const sources = content.split("## Official sources")[1];
    expect(sources, "no Official sources section").toBeDefined();
    const links = [...sources.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThanOrEqual(6);
    const hosts = new Set(links.map((l) => new URL(l).host));
    expect([...hosts].some((h) => h.includes("rbi.org.in"))).toBe(true);
    expect(
      [...hosts].some((h) => h.includes("incometax.gov.in") || h.includes("incometaxindia.gov.in")),
    ).toBe(true);
    for (const l of links) {
      expect(l, `${l} is not a primary source`).toMatch(
        /rbi\.org\.in|incometax\.gov\.in|incometaxindia\.gov\.in|irs\.gov/,
      );
    }
  });

  it("keeps outbound links out of the body, per the article template", () => {
    const [body] = content.split("## Official sources");
    expect(body).not.toMatch(/\]\(https?:\/\//);
  });
});
