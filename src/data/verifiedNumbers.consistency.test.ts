import { describe, expect, it } from "vitest";
import { allVerifiedNumbers, permNumbers, i485Numbers } from "./siteWideVerifiedNumbers";
import {
  permDerivedRanges,
  permProcessingData,
  displayDays,
  isPendingDays,
  NEEDS_UPDATE,
  NOT_PUBLISHED,
} from "./permProcessingData";
import { i140ProcessingData } from "./i140ProcessingData";
import { i485StageEstimateRows } from "./i485ProcessingData";

/**
 * The August 2026 reconciliation audit found the same figure written down in
 * two files with two different values (PERM analyst review was "12–16 months"
 * in one place and 12–18 in another; the I-140 standard range was 4–8 in the
 * PERM data and something else in the I-140 cluster). Nothing caught it,
 * because each file was internally consistent and separately "verified".
 *
 * These tests make cross-file agreement a build gate instead of a hope.
 */

describe("PERM figures agree across files", () => {
  it("siteWideVerifiedNumbers quotes the derived PERM ranges verbatim", () => {
    expect(permNumbers.pwd.value).toBe(permDerivedRanges.pwd);
    expect(permNumbers.recruitment.value).toBe(permDerivedRanges.recruitment);
    expect(permNumbers.analystReview.value).toBe(permDerivedRanges.analystReview);
    expect(permNumbers.totalNoAudit.value).toBe(permDerivedRanges.totalNoAudit);
    expect(permNumbers.totalWithAudit.value).toBe(permDerivedRanges.totalWithAudit);
  });

  it("the no-audit total really is the sum of its stages", () => {
    const [low, high] = permDerivedRanges.totalNoAudit
      .replace(" months", "")
      .split("–")
      .map(Number);
    const recruitmentLow = Math.round(permProcessingData.recruitmentMinimumDays / 30);
    const recruitmentHigh = Math.round(permProcessingData.recruitmentTypicalDays / 30);

    expect(low).toBe(
      permProcessingData.pwdPlanningMonthsLow +
        recruitmentLow +
        permProcessingData.permAnalystPlanningMonthsLow,
    );
    expect(high).toBe(
      permProcessingData.pwdPlanningMonthsHigh +
        recruitmentHigh +
        permProcessingData.permAnalystPlanningMonthsHigh,
    );
  });

  it("the audited total is the no-audit total plus the audit range", () => {
    const parse = (s: string) =>
      s.replace("+ months", "").replace(" months", "").split("–").map(Number);
    const [noAuditLow, noAuditHigh] = parse(permDerivedRanges.totalNoAudit);
    const [withAuditLow, withAuditHigh] = parse(permDerivedRanges.totalWithAudit);

    expect(withAuditLow).toBe(noAuditLow + permProcessingData.permAuditPlanningMonthsLow);
    expect(withAuditHigh).toBe(noAuditHigh + permProcessingData.permAuditPlanningMonthsHigh);
  });

  it("the analyst planning range brackets DOL's published average", () => {
    const avgDays = permProcessingData.averagePermAnalystReviewDays;
    // Only meaningful once the monthly FLAG figure has actually been copied in
    // (it may also hold the NOT_PUBLISHED sentinel rather than a number).
    if (typeof avgDays !== "number") return;
    const avgMonths = avgDays / 30;
    expect(avgMonths).toBeGreaterThanOrEqual(
      permProcessingData.permAnalystPlanningMonthsLow - 1,
    );
    expect(avgMonths).toBeLessThanOrEqual(
      permProcessingData.permAnalystPlanningMonthsHigh + 1,
    );
  });
});

describe('"not published" is not the same as "not updated yet"', () => {
  it("shows a number as days, not as a sentinel", () => {
    expect(displayDays(372)).toBe("372 days");
    expect(isPendingDays(372)).toBe(false);
  });

  it("warns only for a value we have not copied yet", () => {
    expect(displayDays(null)).toBe(NEEDS_UPDATE);
    expect(isPendingDays(null)).toBe(true);
  });

  it("states a DOL-unpublished figure plainly without an update warning", () => {
    expect(displayDays(NOT_PUBLISHED)).toBe(NOT_PUBLISHED);
    // The bug this guards: NOT_PUBLISHED rendering as "Update from DOL FLAG"
    // told readers the page was stale about something no update can ever fix.
    expect(displayDays(NOT_PUBLISHED)).not.toBe(NEEDS_UPDATE);
    expect(isPendingDays(NOT_PUBLISHED)).toBe(false);
  });

  it("never leaves a live page rendering the raw update prompt for audit review", () => {
    expect(displayDays(permProcessingData.averagePermAuditReviewDays)).not.toBe(
      NEEDS_UPDATE,
    );
  });
});

describe("I-140 figures agree across files", () => {
  it("the PERM cluster mirrors the I-140 cluster's standard range", () => {
    expect(permProcessingData.standardI140EstimateMonthsLow).toBe(
      i140ProcessingData.standardMonthsLow,
    );
    expect(permProcessingData.standardI140EstimateMonthsHigh).toBe(
      i140ProcessingData.standardMonthsHigh,
    );
  });

  it("the median sits inside the published range", () => {
    expect(i140ProcessingData.standardMedianMonths).toBeGreaterThanOrEqual(
      i140ProcessingData.standardMonthsLow,
    );
    expect(i140ProcessingData.standardMedianMonths).toBeLessThanOrEqual(
      i140ProcessingData.standardMonthsHigh,
    );
  });

  it("premium SLAs match between the PERM and I-140 data files", () => {
    expect(permProcessingData.i140PremiumProcessingBusinessDays).toBe(
      i140ProcessingData.premiumBusinessDays,
    );
    expect(permProcessingData.i140Niweb1cPremiumProcessingBusinessDays).toBe(
      i140ProcessingData.niwEb1cPremiumBusinessDays,
    );
  });
});

describe("I-485 figures agree across files", () => {
  it("the cluster stage table and the central number say the same thing", () => {
    const decisionRow = i485StageEstimateRows.find((r) =>
      r.stage.startsWith("Employment-based"),
    );
    expect(decisionRow).toBeDefined();
    // The stage table prefixes "~"; the central figure does not.
    expect(decisionRow!.estimatedTime.replace("~", "")).toBe(
      i485Numbers.employmentBased.value,
    );
  });

  it("the biometrics window matches the cluster stage table", () => {
    const biometricsRow = i485StageEstimateRows.find((r) =>
      r.stage.startsWith("Biometrics"),
    );
    expect(biometricsRow?.estimatedTime).toBe(i485Numbers.biometrics.value);
  });
});

describe("every tracked number is auditable", () => {
  const entries = Object.entries(allVerifiedNumbers).flatMap(([group, numbers]) =>
    Object.entries(numbers).map(([key, n]) => ({ group, key, ...n })),
  );

  it("carries a label, a value, an ISO lastVerified date and a source URL", () => {
    for (const e of entries) {
      expect(e.label, `${e.group}.${e.key} label`).toBeTruthy();
      expect(e.value, `${e.group}.${e.key} value`).toBeTruthy();
      expect(e.lastVerified, `${e.group}.${e.key} lastVerified`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      );
      expect(e.sourceUrl, `${e.group}.${e.key} sourceUrl`).toMatch(/^https:\/\//);
    }
  });

  it("is never stamped with a future verification date", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const e of entries) {
      expect(
        e.lastVerified <= today,
        `${e.group}.${e.key} claims to have been verified on ${e.lastVerified}`,
      ).toBe(true);
    }
  });

  it("is parseable by the monthly audit script's regex", () => {
    // audit-monthly-numbers.ts finds entries by splitting on `{ label:` and
    // then matching `value: "…"`. A value written as a template literal or a
    // computed expression silently drops out of the audit — which is worse
    // than a wrong number, because nothing reports it as untracked.
    for (const e of entries) {
      expect(
        e.value.includes("`") || e.value.includes("${"),
        `${e.group}.${e.key} must be a plain string literal`,
      ).toBe(false);
    }
  });
});
