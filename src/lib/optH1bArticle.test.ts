import { describe, expect, it } from "vitest";
import { getArticle } from "@/lib/articles";
import { extractFaq, extractHeadings } from "@/lib/seo";
import {
  capGapRules,
  h1bCapSubjectFeeProposal,
  h1bRegistrationFeeUsd,
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
        /not being collected|vacated|PROPOSED ONLY|DISCUSSED\/REPORTED ONLY|not formally proposed|not a rule|nobody is paying|not currently being charged|misreported|belongs in your budget|fell on the employer/i.test(
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

describe("the August 24, 2026 proposed $103,265 cap-subject fee", () => {
  const paragraphs = article.content.split(/\n\n+/);

  it("is present and dated", () => {
    expect(article.content).toContain(h1bCapSubjectFeeProposal.value);
    expect(article.content).toContain("August 24, 2026");
  });

  it("never presents it as a fee that is currently payable", () => {
    const blocks = paragraphs.filter((b) =>
      b.includes(h1bCapSubjectFeeProposal.value)
    );
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(
        /proposed|not a fee currently being collected|not being collected|rulemaking|comment period|notice of proposed/i.test(
          b
        ),
        `$103,265 appears without "proposed" framing in: ${b.slice(0, 140)}`
      ).toBe(true);
    }
    // The one phrasing that would be flatly wrong.
    expect(article.content).not.toMatch(/you (will|must) pay (the )?\$103,265/i);
  });

  it("states the actual proposed scope rather than calling it an open question", () => {
    // The operative text (8 CFR 106.2(a)(3)(xii)) covers all cap-subject
    // petitions, so an in-country F-1 change of status is in scope as drafted.
    expect(article.content).toMatch(
      /would apply to \*\*all cap-subject H-1B petitions, including a cap-subject F-1-to-H-1B change-of-status petition filed inside the United States/
    );
    expect(article.content).not.toMatch(/Do not assume (that )?an F-1-to-H-1B change of status/i);
    expect(article.content).not.toMatch(/open question that could go either way/i);
  });

  it("keeps the advanced-degree allocation expressly in scope", () => {
    expect(article.content).toMatch(/advanced-degree allocation is included/i);
    expect(article.content).toContain("214(g)(5)(C)");
    // Never cite 214(g)(5) and (7) as blanket exclusions.
    expect(article.content).not.toMatch(
      /not to cap-exempt petitions under INA secs\. 214\(g\)\(5\) and \(7\)/i
    );
  });

  it("names who pays and what is outside the proposal", () => {
    expect(article.content).toMatch(/employer-petitioner, not the student beneficiary/i);
    expect(article.content).toMatch(/genuinely cap-exempt petitions/i);
    expect(article.content).toMatch(
      /extensions and employer changes for a beneficiary already counted/i
    );
  });

  it("keeps it separate from the vacated proclamation payment", () => {
    expect(article.content).toMatch(/separate from,? and additive to/i);
    expect(article.content).toMatch(/would pay both/i);
  });
});

describe("tax-residency claims are conditional, not absolute", () => {
  it("does not assert a flat five-year nonresident rule", () => {
    expect(article.content).not.toMatch(
      /For your first \d+ calendar years on F-1 you are an exempt individual/i
    );
    expect(article.content).not.toMatch(/you are a nonresident alien, and you file Form 1040-NR/i);
  });

  it("states the substantial-presence framing and the prior-years caveat", () => {
    expect(article.content).toMatch(
      /days of US presence generally do not count toward the Substantial Presence Test/i
    );
    expect(article.content).toMatch(/prior calendar years/i);
    expect(article.content).toMatch(/part of a calendar year generally counts as one calendar year/i);
  });

  it("does not claim the switch year necessarily raises the bill", () => {
    expect(article.content).not.toMatch(/tax bill (then )?jumps twice/i);
    expect(article.content).not.toMatch(/tax residency usually flips/i);
    expect(article.content).toMatch(
      /full-year US resident may instead qualify for the ordinary resident standard deduction/i
    );
  });

  it("keeps the 92-day October example", () => {
    expect(article.content).toContain("92 days");
  });
});

describe("401(k) claims are qualified", () => {
  it("drops the universal 'penalty is smaller than the match' claim", () => {
    expect(article.content).not.toMatch(
      /That is a smaller number than the match you refused/i
    );
    expect(article.content).toMatch(/If the employer match is vested/i);
  });

  it("qualifies the rollover claim", () => {
    expect(article.content).not.toMatch(
      /rolls into an IRA you can hold from anywhere in the world/i
    );
    expect(article.content).toMatch(/receiving custodian's policy for non-US residents/i);
  });

  it("states vesting, withholding and penalty-exception caveats", () => {
    expect(article.content).toMatch(/own contributions are always 100% vested/i);
    expect(article.content).toMatch(/Withholding is not the final tax bill/i);
    expect(article.content).toMatch(/10% additional tax has statutory exceptions/i);
  });
});

describe("small factual clarifications", () => {
  it("says 12 months or more of full-time CPT, at that educational level", () => {
    expect(article.content).toMatch(
      /months \*\*or more\*\* of full-time CPT eliminates post-completion OPT at that educational level/i
    );
  });

  it("labels the 90-day figure as the initial post-completion OPT limit", () => {
    expect(article.content).toMatch(
      /initial post-completion OPT unemployment limit\*\*, not the F-1 departure period/i
    );
  });

  it("quotes the verified H-1B registration fee rather than calling it small", () => {
    expect(article.content).toContain(`$${h1bRegistrationFeeUsd}`);
    expect(article.content).not.toMatch(/a form and a small fee/i);
  });

  it("separates cap-gap work authorisation from the remaining departure period", () => {
    expect(article.content).toMatch(/work authorisation and permission to stay end at different times/i);
    expect(article.content).toContain(capGapRules.afterItEndsException);
    expect(article.content).not.toMatch(/you must stop working immediately\./i);
  });
});

describe("the $100,000 OPT figure is labelled without contradicting itself", () => {
  it("no longer calls it PROPOSED ONLY", () => {
    expect(article.content).not.toMatch(/PROPOSED ONLY — reported July 30/i);
  });

  it("labels it discussed/reported only and not formally proposed", () => {
    expect(article.content).toContain("DISCUSSED/REPORTED ONLY");
    expect(article.content).toMatch(/not formally proposed/i);
    expect(article.content).toMatch(/nobody is currently being charged/i);
  });

  it("keeps it distinct from the formally proposed $103,265 fee", () => {
    expect(article.content).toMatch(/one was never formally proposed, and one is a live proposal/i);
  });
});
