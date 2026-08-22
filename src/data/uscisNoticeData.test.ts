import { describe, it, expect } from "vitest";
import {
  noticeDeadlineRules,
  noExtensionRule,
  mailingRule,
  rfeReality,
  i797Variants,
  uscisNoticeSources,
  USCIS_NOTICE_VERIFIED,
} from "@/data/uscisNoticeData";
import { getToolHubContent } from "@/lib/toolHubContent";
import { faqJsonLd } from "@/lib/seo";

/**
 * These are regulatory numbers on a page people use to work out a filing
 * deadline, so the failure mode that matters is a silent one: someone edits
 * the headline cap and leaves the derived "with mailing" figure behind, and
 * the page then shows two numbers that disagree. The arithmetic below is the
 * guard — it is not testing that addition works, it is pinning the two fields
 * together so they can only ever move as a pair.
 */
describe("USCIS notice deadline rules", () => {
  it("derives withMailingDays from capDays plus the mail-service addition", () => {
    for (const rule of noticeDeadlineRules) {
      expect(rule.withMailingDays).toBe(rule.capDays + mailingRule.addedDays);
    }
  });

  it("keeps the RFE and NOID caps at their regulatory values", () => {
    const rfe = noticeDeadlineRules.find((r) => r.label.includes("RFE"));
    const noid = noticeDeadlineRules.find((r) => r.label.includes("NOID"));
    // 8 CFR 103.2(b)(8)(iv): RFE max twelve weeks, NOID max thirty days.
    expect(rfe?.capDays).toBe(84); // twelve weeks
    expect(noid?.capDays).toBe(30);
    // A NOID must never be presented as more generous than an RFE.
    expect(noid!.capDays).toBeLessThan(rfe!.capDays);
  });

  it("cites a regulation for every rule it states", () => {
    for (const rule of noticeDeadlineRules) {
      expect(rule.cite).toMatch(/^8 CFR /);
      expect(rule.note.trim().length).toBeGreaterThan(0);
    }
    expect(noExtensionRule.cite).toMatch(/^8 CFR /);
    expect(mailingRule.cite).toMatch(/^8 CFR /);
  });
});

describe("USCIS notice supporting facts", () => {
  it("labels the RFE statistics with the fiscal year they describe", () => {
    // An unlabelled "8%" rots invisibly; "FY2024" dates itself.
    expect(rfeReality.fiscalYear).toMatch(/^FY\d{4}$/);
    expect(rfeReality.source).toContain("uscis.gov");
  });

  it("gives every I-797 variant a code and a meaning", () => {
    expect(i797Variants.length).toBeGreaterThanOrEqual(7);
    const codes = i797Variants.map((v) => v.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const v of i797Variants) {
      expect(v.code).toMatch(/^I-797[A-F]?$/);
      expect(v.meaning.trim().length).toBeGreaterThan(0);
    }
  });

  it("carries a verified stamp and resolvable sources", () => {
    expect(USCIS_NOTICE_VERIFIED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(uscisNoticeSources.length).toBeGreaterThan(0);
    for (const s of uscisNoticeSources) {
      expect(s.href).toMatch(/^https:\/\//);
      expect(s.label.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Notice decoder FAQ ↔ FAQPage schema", () => {
  const content = getToolHubContent("uscis-notice-decoder")!;

  it("has unique, non-empty questions", () => {
    const questions = content.faqs.map((f) => f.question);
    expect(new Set(questions).size).toBe(questions.length);
    for (const f of content.faqs) {
      expect(f.question.trim().length).toBeGreaterThan(0);
      expect(f.answer.trim().length).toBeGreaterThan(0);
    }
  });

  it("answers the deadline questions the page now makes claims about", () => {
    const joined = content.faqs.map((f) => f.answer).join(" ");
    expect(joined).toContain("twelve weeks");
    expect(joined).toContain("thirty days");
    expect(joined).toContain("may not be granted");
  });

  it("generates FAQPage schema 1:1 from the visible FAQs", () => {
    const schema = faqJsonLd(content.faqs);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity.length).toBe(content.faqs.length);
  });
});
