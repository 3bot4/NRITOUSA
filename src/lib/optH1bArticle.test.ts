import { describe, expect, it } from "vitest";
import { getArticle } from "@/lib/articles";
import { extractFaq, extractHeadings } from "@/lib/seo";
import {
  capGapRules,
  optRules,
  taxConstants,
} from "@/data/studentClusterData";

/**
 * The OPT → H-1B article is the finance-side entry point to the student
 * cluster, and it carries three claims that are easy to get wrong and
 * expensive for a reader if they are:
 *   1. the cap-gap end date, which moved from October 1 to April 1 in 2025;
 *   2. the $100,000 figures, which must never appear without their status;
 *   3. the 150-day unemployment cap, which is aggregate, not a reset.
 * These lock all three to the cluster data rather than to prose.
 */
const article = getArticle("opt-h1b-financial-planning-students")!;

describe("OPT to H-1B article", () => {
  it("exists and opts into the answer-first template", () => {
    expect(article).toBeDefined();
    expect(article.answerFirst).toBe(true);
    expect(article.toc).toBe(true);
    expect(article.expertiseTags?.length).toBeGreaterThan(0);
  });

  it("keeps SEO title and description within limits", () => {
    expect(article.seoTitle!.length).toBeLessThanOrEqual(60);
    expect(article.seoDescription!.length).toBeLessThanOrEqual(165);
  });

  it("opens with a quick answer that carries real numbers", () => {
    const quick = article.content.split(":::quickanswer")[1]?.split(":::")[0];
    expect(quick, "quickanswer fence missing").toBeDefined();
    expect(quick).toContain(String(optRules.initialUnemploymentDays));
    expect(quick).toContain(String(optRules.aggregateUnemploymentDaysWithStem));
    expect(quick).toContain(String(taxConstants.ficaPct));
  });

  it("earns its table of contents", () => {
    expect(extractHeadings(article.content).length).toBeGreaterThan(2);
  });
});

describe("cap-gap end date", () => {
  it("states the current April 1 end date", () => {
    expect(article.content).toContain(capGapRules.endsOnShort);
    expect(article.content).toMatch(/January 17, 2025/);
  });

  it("never presents the retired October 1 date as current", () => {
    // "October 1" may appear as the H-1B start date or as the superseded
    // cap-gap date being corrected, but never as what cap-gap runs "to".
    expect(article.content).not.toMatch(/cap-gap[^.]{0,80}(through|until|to) September 30/i);
    expect(article.content).not.toMatch(/cap-gap[^.]{0,40}runs? to October 1/i);
    expect(article.content).not.toMatch(/through September 30/i);
  });
});

describe("the $100,000 figures", () => {
  const paragraphs = article.content.split(/\n\n+/);

  it("never prints $100,000 without a status in the same block", () => {
    const blocks = paragraphs.filter((b) => b.includes("$100,000"));
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(
        /not being collected|vacated|PROPOSED ONLY|not a rule|nobody is paying|misreported|belongs in your budget|fell on the employer/i.test(
          b
        ),
        `"$100,000" appears without its status in: ${b.slice(0, 120)}`
      ).toBe(true);
    }
  });
});

describe("the numbers match the cluster data", () => {
  it("uses the aggregate unemployment cap, not a reset", () => {
    const remaining =
      optRules.aggregateUnemploymentDaysWithStem - 40;
    expect(article.content).toContain(
      `you have ${remaining} left, not ${optRules.aggregateUnemploymentDaysWithStem}`
    );
  });

  it("quotes the FICA rate and the exempt-year count from the data file", () => {
    expect(article.content).toContain(`${taxConstants.ficaPct}%`);
    expect(article.content).toContain(
      `${taxConstants.f1ExemptCalendarYears} calendar years`
    );
  });

  it("quotes both grace periods and flags the fixed-admission change", () => {
    expect(article.content).toContain(`${optRules.gracePeriodDays}-day`);
    expect(article.content).toContain(
      `${optRules.gracePeriodDaysUnderFixedAdmission} days`
    );
    expect(article.content).toContain("September 15, 2026");
  });
});

describe("citability", () => {
  it("ends with an official-sources list of primary sources", () => {
    const sources = article.content.split("## Official sources")[1];
    expect(sources, "no Official sources section").toBeDefined();
    const links = sources.match(/\]\(https:\/\/[^)]+\)/g) ?? [];
    expect(links.length).toBeGreaterThanOrEqual(12);
    for (const l of links) {
      expect(l).toMatch(/irs\.gov|dhs\.gov|uscis\.gov|federalregister\.gov|ecfr\.gov/);
    }
  });

  it("keeps every outbound link in the sources section, none in the body", () => {
    const [body] = article.content.split("## Official sources");
    expect(body).not.toMatch(/\]\(https?:\/\//);
  });

  it("produces FAQ entries for schema", () => {
    const faqs = extractFaq(article.content);
    expect(faqs.length).toBeGreaterThanOrEqual(8);
    for (const f of faqs) {
      expect(f.answer.length).toBeGreaterThan(60);
    }
  });
});
