/**
 * Regression guard for the Batch 2 CORRECTIVE pass — the YMYL immigration-law
 * fixes applied after the structural Batch 2 shipped. These assert that the
 * specific inaccurate claims cannot silently return anywhere in the codebase,
 * and that the corrected framing is present where it matters.
 *
 * Controlling sources (verified during the corrective pass):
 *  - 8 CFR 204.5(e) — priority-date retention & its four revocation exceptions
 *  - 8 CFR 205.1(a)(3)(iii)(C) — I-140 withdrawal / 180-day petition-survival rule
 *  - INA §204(j) / USCIS PM Vol.7 Pt.E Ch.5 — I-485 job portability (same-or-similar)
 *  - USCIS PM Vol.1 Pt.E Ch.6 — RFE response periods & consequences
 *  - INA §202 — 7% per-country limit on the COMBINED FB+EB preference totals
 *  - USCIS premium processing — 15 vs 45 business days by form/classification
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getVisaBulletinChildPage } from "./visaBulletinCluster";
import { getGreenCardChildPage } from "./greenCardCluster";
import { pageMetadata, extractFaq } from "./seo";

const ROOT = join(__dirname, "..", "..");
const SRC = join(ROOT, "src");
const THIS = "consolidation.batch2corrective.test.ts";

/** Every .ts/.tsx under src/, excluding test files. */
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (
      (full.endsWith(".ts") || full.endsWith(".tsx")) &&
      !full.endsWith(".test.ts") &&
      !full.endsWith(".test.tsx") &&
      !full.endsWith(THIS)
    ) {
      out.push(full);
    }
  }
  return out;
}

const FILES = sourceFiles(SRC);
/** One big blob of all non-test source, for absence assertions. */
const ALL = FILES.map((f) => readFileSync(f, "utf8")).join("\n");

/** Report which files match a pattern, for actionable failures. */
function offenders(re: RegExp): string[] {
  return FILES.filter((f) => re.test(readFileSync(f, "utf8"))).map((f) =>
    f.slice(SRC.length + 1),
  );
}

describe("Corrective — the '9,800 India EB quota' claim is gone", () => {
  it("no source states a 9,800 (or 9800) India EB figure", () => {
    expect(offenders(/9,?800/)).toEqual([]);
  });
  it("no source states the 2,803 EB-1 India 'floor'", () => {
    expect(offenders(/2,?803/)).toEqual([]);
  });
  it("no source computes India's quota as 7% of 140,000", () => {
    expect(offenders(/7%\s*(of|×|x|\*)\s*~?\s*140[,.]?000/i)).toEqual([]);
  });
  it("no source calls the per-country limit a fixed India ceiling/quota/allotment", () => {
    expect(
      offenders(/india['’]?s?\s+(hard|effective|guaranteed|fixed)\s+(ceiling|quota|allotment|floor|share)/i),
    ).toEqual([]);
  });
  it("the correct 7%-of-combined-FB+EB framing is present", () => {
    // Named in the backlog page and the visa-bulletin cluster.
    expect(ALL).toMatch(/7%\s+of\s+the\s+combined\s+family/i);
    expect(ALL).toMatch(/25,620/); // FY2026 combined per-country preference limit
    expect(ALL).toMatch(/proration cap/i);
    // 25,620 is never framed as India's EB allotment.
    expect(offenders(/25,620\s+(india|employment-based visas for india|india eb)/i)).toEqual([]);
  });
});

describe("Corrective — RFE claims", () => {
  it("no source claims an 'automatic denial'", () => {
    expect(offenders(/automatic denial/i)).toEqual([]);
  });
  it("no source claims 'no recourse' / 'no second chance' on an RFE deadline", () => {
    expect(offenders(/denial with no recourse|no second chance/i)).toEqual([]);
  });
  it("no source calls a NOID a 'second RFE'", () => {
    expect(offenders(/second RFE \(NOID\)/i)).toEqual([]);
  });
  it("no source states a universal 87-day RFE deadline without qualification", () => {
    // The bare "typically/usually 87 days" claim is replaced everywhere with the
    // 84-day (≈87 with mail) framing. Guard the two bare phrasings.
    expect(offenders(/typically\s+87\s+days/i)).toEqual([]);
    expect(offenders(/usually\s+87\s+days\s+from/i)).toEqual([]);
  });
  it("the corrected deadline framing (84 days / receive by deadline) is present", () => {
    expect(ALL).toMatch(/84\s+days/);
    expect(ALL).toMatch(/must\s+receive/i);
    // I-539 / I-601A 30-day carve-out is documented on the owner pages.
    expect(ALL).toMatch(/I-539/);
    expect(ALL).toMatch(/30-day|30 days/);
  });
  it("the RFE notice is identified as Form I-797E", () => {
    expect(ALL).toMatch(/I-797E/);
  });
  it("the corrected 'abandoned / decide on the existing record' consequence is present", () => {
    expect(ALL).toMatch(/existing record/i);
    expect(ALL).toMatch(/abandoned/i);
  });
});

describe("Corrective — premium processing distinguishes 15 vs 45 business days", () => {
  it("no source makes a universal 'I-140 premium processing is 15 business days' claim", () => {
    expect(
      offenders(/I-140\s+premium\s+processing\s+(is|takes|=)\s+15\s+business\s+days/i),
    ).toEqual([]);
  });
  it("45-business-day E13/E21 (EB-1C / NIW) timeframe is documented", () => {
    expect(ALL).toMatch(/45\s+business\s+days/);
    expect(ALL).toMatch(/E13|EB-1C/);
    expect(ALL).toMatch(/E21|national.interest.waiver|NIW/i);
  });
});

describe("Corrective — priority-date retention vs petition survival vs §204(j)", () => {
  const pd = () => getGreenCardChildPage("priority-date")!.content;
  const cj = () => getGreenCardChildPage("change-jobs-after-i140")!.content;

  it("no source says the priority date is automatically lost merely because of a pre-180-day withdrawal", () => {
    expect(
      offenders(/lose (that|the|your) priority date[^.]{0,60}before\s+180\s+days/i),
    ).toEqual([]);
    expect(
      offenders(/priority date[^.]{0,40}(is at risk|can be revoked)[^.]{0,40}withdraw/i),
    ).toEqual([]);
  });

  it("priority-date page cites 8 CFR 204.5(e) and that withdrawal is not a loss ground", () => {
    expect(pd()).toMatch(/204\.5\(e\)/);
    expect(pd()).toMatch(/withdrawal is not one of/i);
  });

  it("change-jobs page carries the 3-rule comparison table with all three sources", () => {
    const c = cj();
    expect(c).toMatch(/three rules, side by side/i);
    expect(c).toMatch(/8 CFR 205\.1/);
    expect(c).toMatch(/8 CFR 204\.5\(e\)/);
    expect(c).toMatch(/same or similar occupation/i);
  });

  it("no source requires 'same or similar' merely to RETAIN a priority date", () => {
    // Retention pages must explicitly say the opposite.
    expect(pd()).toMatch(/["']same or similar["'][^.]{0,40}(portability|not a retention|§204\(j\))/i);
    expect(
      offenders(/same or similar[^.]{0,30}(to )?retain[^.]{0,20}priority date/i),
    ).toEqual([]);
  });
});

describe("Corrective — H-1B extension language is qualified (AC21 §104(c))", () => {
  it("no source claims extensions continue 'indefinitely' or are automatic/guaranteed", () => {
    expect(offenders(/extensions?[^.]{0,30}indefinitely/i)).toEqual([]);
    expect(offenders(/extended indefinitely in 3-year/i)).toEqual([]);
    expect(offenders(/automatically qualif[a-z]+ for (a )?3-year/i)).toEqual([]);
  });
  it("the §104(c) 'visa number unavailable' qualifier is present", () => {
    expect(ALL).toMatch(/104\(c\)/);
    expect(ALL).toMatch(/visa number is unavailable/i);
  });
});

describe("Corrective — EB-2/EB-3 India bulletin pages emphasize current cutoff & movement", () => {
  it("EB-2 India title/seoTitle no longer say 'Backlog & Predictions'", () => {
    const p = getVisaBulletinChildPage("eb2-india")!;
    expect(p.title).toMatch(/Current Cutoff and Movement/i);
    expect(p.seoTitle).not.toMatch(/predictions/i);
    expect(p.seoTitle).toMatch(/Current Cutoff/i);
  });
  it("EB-3 India title/seoTitle emphasize current cutoff & movement", () => {
    const p = getVisaBulletinChildPage("eb3-india")!;
    expect(p.title).toMatch(/Current Cutoff and Movement/i);
    expect(p.seoTitle).toMatch(/Current Cutoff/i);
  });
  it("both bulletin pages point detailed wait-modeling to the scenarios page", () => {
    for (const slug of ["eb2-india", "eb3-india"]) {
      expect(getVisaBulletinChildPage(slug)!.content).toContain("/eb2-eb3-priority-date-india");
    }
  });
  it("the scenarios page stays labeled as estimates, not forecasts", () => {
    const src = readFileSync(join(SRC, "app/eb2-eb3-priority-date-india/page.tsx"), "utf8");
    expect(src).toMatch(/estimates, not predictions/i);
  });
});

describe("Corrective — /green-card/i-140-approved-what-next: no false unlock/portability claims", () => {
  const PATH = "/green-card/i-140-approved-what-next";
  const page = getGreenCardChildPage("i-140-approved-what-next")!;

  // Every source field feeding the page: metadata title/desc, excerpt, and the
  // body markdown (which becomes hero, bullets, tables, FAQs, and — via
  // pageMetadata — OG/Twitter, and via the Article JSON-LD — its description).
  const FIELDS = {
    title: page.title,
    seoTitle: page.seoTitle ?? "",
    metaDescription: page.metaDescription ?? "",
    excerpt: page.excerpt,
    content: page.content,
  };
  const BLOB = Object.values(FIELDS).join("\n");

  // The three prohibited claims, as patterns that catch their phrasings.
  const BAD: [RegExp, string][] = [
    [/immediately\s+unlocks?\s+.{0,20}(3-year|three-year)/i, "I-140 immediately unlocks 3-year extensions"],
    [/unlocks?\s+(\*\*)?3-year(\*\*)? h-?1b extensions?/i, "I-140 unlocks 3-year H-1B extensions"],
    [/(available|extensions?)\s+the moment the i-140 is approved/i, "extensions available the moment I-140 is approved"],
    [/(3-year|three-year|h-?1b) extensions?[^.]{0,20}once i-140 is approved/i, "extensions once I-140 approved (unconditional)"],
    [/after\s+180\s+days[^.]{0,30}(ac21|portability)/i, "AC21 portability begins 180 days after I-140 approval"],
    [/180\s+days after approval[^|]*\|[^|]*(same or similar|portability)/i, "AC21 portability = 180 days after approval (table)"],
    [/portabilit[a-z]+\s+(begins|starts)[^.]{0,25}(180 days after|approval)/i, "portability begins at I-140 approval"],
    [/port the i-140/i, "the I-140 itself can be 'ported'"],
    [/ported petition/i, "'ported petition' after 180 days"],
    [/gain (green card |limited )?(ac21 )?(job )?portability[^.]{0,25}approved for \*\*?180/i, "180-day-approval gives portability"],
  ];

  it.each(BAD)("no field contains: %s", (re) => {
    expect(BLOB).not.toMatch(re);
  });

  it("OG/Twitter + <title> metadata carry no false unlock/portability claim", () => {
    // Mirrors app/green-card/[slug]/page.tsx generateMetadata().
    const meta = pageMetadata({
      title: page.seoTitle ?? page.title,
      description: page.metaDescription ?? page.excerpt,
      path: PATH,
      type: "article",
    });
    const og = meta.openGraph as { title?: unknown; description?: unknown };
    const tw = meta.twitter as { title?: unknown; description?: unknown };
    const metaText = [
      meta.title,
      meta.description,
      og?.title,
      og?.description,
      tw?.title,
      tw?.description,
    ].join(" | ");
    expect(meta.alternates?.canonical).toBe(PATH);
    for (const [re] of BAD) expect(metaText).not.toMatch(re);
    // The description is affirmatively corrected.
    expect(String(meta.description)).toMatch(/104\(c\)|retains your priority date/i);
  });

  it("the Article JSON-LD description (page.excerpt) is corrected", () => {
    expect(page.excerpt).toMatch(/104\(c\)|retains your priority date/i);
    for (const [re] of BAD) expect(page.excerpt).not.toMatch(re);
  });

  it("visible FAQ (source of FAQPage schema) carries no prohibited claim", () => {
    const faqs = extractFaq(page.content);
    expect(faqs.length).toBeGreaterThan(0);
    const faqText = faqs.map((f) => `${f.question} ${f.answer}`).join("\n");
    for (const [re] of BAD) expect(faqText).not.toMatch(re);
    // FAQ schema stays derived from the visible questions.
    for (const f of faqs) expect(page.content).toContain(f.question);
  });

  it("the corrected legal distinctions are all present on the page", () => {
    expect(FIELDS.content).toMatch(/204\.5\(e\)/); // retention
    expect(FIELDS.content).toMatch(/205\.1/); // petition survival
    expect(FIELDS.content).toMatch(/204\(j\)/); // job portability
    expect(FIELDS.content).toMatch(/245\.25/); // portability reg
    expect(FIELDS.content).toMatch(/104\(c\)/); // 3-year extensions
    expect(FIELDS.content).toMatch(/pending (for )?at least 180 days|pending 180\+ days/i);
  });
});

describe("Corrective — the RFE process render defect is fixed at the component level", () => {
  it("StepsBox parses a leading `title:` directive into a heading", () => {
    const ab = readFileSync(join(SRC, "components/ArticleBody.tsx"), "utf8");
    const start = ab.indexOf("function StepsBox");
    const body = ab.slice(start, ab.indexOf("function CtaCard", start));
    expect(body).toContain("parseDirectives");
    expect(body).toContain("directives.title");
  });
  it("the rfe-notice steps block still uses a title: directive (so the fix is exercised)", () => {
    const rfe = readFileSync(join(SRC, "lib/myuscisCluster.ts"), "utf8");
    expect(rfe).toMatch(/:::steps\ntitle: How the RFE response process works/);
  });
});
