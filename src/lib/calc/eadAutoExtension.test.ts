import { describe, it, expect } from "vitest";
import {
  evaluateEadExtension,
  earliestFilingDate,
  getCategory,
  REPEAL_DATE,
  OLD_EXTENSION_DAYS,
  RENEWAL_WINDOW_DAYS,
} from "./eadAutoExtension";
import { parseIsoDate } from "./i751Window";

const at = (iso: string) => parseIsoDate(iso)!;
const today = at("2026-09-16");

describe("the repeal date is the pivot", () => {
  it("gives the old 540-day extension to a renewal received the day before", () => {
    const r = evaluateEadExtension({
      categoryKey: "c26", // H-4 spouse
      filedDate: "2025-10-29",
      expiryDate: "2026-01-15",
      today,
    })!;
    expect(r.basis).toBe("old-rule");
    expect(r.hasExtension).toBe(true);
    expect(r.extensionDays).toBe(OLD_EXTENSION_DAYS);
    expect(r.extensionEnds).toBe("2027-07-09"); // 15 Jan 2026 + 540 days
  });

  it("gives nothing to the same renewal received ON the repeal date", () => {
    const r = evaluateEadExtension({
      categoryKey: "c26",
      filedDate: REPEAL_DATE,
      expiryDate: "2026-01-15",
      today,
    })!;
    expect(r.basis).toBe("none");
    expect(r.hasExtension).toBe(false);
    expect(r.extensionEnds).toBeNull();
    expect(r.extensionDays).toBe(0);
  });

  it("gives nothing to a renewal received after it", () => {
    const r = evaluateEadExtension({
      categoryKey: "c09", // pending I-485
      filedDate: "2026-03-01",
      expiryDate: "2026-06-01",
      today,
    })!;
    expect(r.basis).toBe("none");
  });
});

describe("STEM OPT survives the repeal", () => {
  it("authorises 180 days past expiry even for a renewal filed after the repeal", () => {
    const r = evaluateEadExtension({
      categoryKey: "c03c",
      filedDate: "2026-04-01",
      expiryDate: "2026-06-01",
      today,
    })!;
    expect(r.basis).toBe("stem-pending");
    expect(r.extensionDays).toBe(180);
    expect(r.extensionEnds).toBe("2026-11-28");
  });

  it("does NOT extend post-completion OPT, which is a different category", () => {
    // Grouping (c)(3)(B) with (c)(3)(C) is the mistake this guards against.
    const r = evaluateEadExtension({
      categoryKey: "c03b",
      filedDate: "2026-04-01",
      expiryDate: "2026-06-01",
      today,
    })!;
    expect(r.basis).toBe("none");
    expect(getCategory("c03b")!.pendingAuthDays).toBeNull();
    expect(getCategory("c03c")!.pendingAuthDays).toBe(180);
  });
});

describe("L-2 spouses are authorised incident to status", () => {
  it("does not treat the card's expiry as the end of the right to work", () => {
    const r = evaluateEadExtension({
      categoryKey: "a18",
      filedDate: "2026-04-01",
      expiryDate: "2026-06-01",
      today,
    })!;
    expect(r.basis).toBe("incident-to-status");
    expect(r.headline).toMatch(/incident to status/);
  });

  it("applies even when the renewal was filed late — status, not the filing, is the basis", () => {
    const r = evaluateEadExtension({
      categoryKey: "a18",
      filedDate: "2026-08-01",
      expiryDate: "2026-06-01",
      today,
    })!;
    expect(r.basis).toBe("incident-to-status");
  });
});

describe("timeliness", () => {
  it("extends nothing when the renewal reached USCIS after the card expired", () => {
    const r = evaluateEadExtension({
      categoryKey: "c26",
      filedDate: "2025-10-01",
      expiryDate: "2025-09-01",
      today,
    })!;
    expect(r.basis).toBe("not-timely");
    expect(r.filedBeforeExpiry).toBe(false);
    expect(r.hasExtension).toBe(false);
  });

  it("treats a renewal received on the expiry date itself as timely", () => {
    const r = evaluateEadExtension({
      categoryKey: "c26",
      filedDate: "2025-09-01",
      expiryDate: "2025-09-01",
      today,
    })!;
    expect(r.filedBeforeExpiry).toBe(true);
    expect(r.basis).toBe("old-rule");
  });
});

describe("countdown", () => {
  it("counts down to the end of cover, and goes negative once the gap has started", () => {
    const future = evaluateEadExtension({
      categoryKey: "c26",
      filedDate: "2026-06-01",
      expiryDate: "2026-10-16",
      today,
    })!;
    expect(future.daysUntilCoverEnds).toBe(30);

    const past = evaluateEadExtension({
      categoryKey: "c26",
      filedDate: "2026-01-01",
      expiryDate: "2026-08-16",
      today,
    })!;
    expect(past.daysUntilCoverEnds).toBeLessThan(0);
  });

  it("does not drift with the time of day", () => {
    const base = { categoryKey: "c26", filedDate: "2026-06-01", expiryDate: "2026-10-16" };
    const early = evaluateEadExtension({ ...base, today: today + 3_600_000 })!;
    const late = evaluateEadExtension({ ...base, today: today + 82_800_000 })!;
    expect(early.daysUntilCoverEnds).toBe(late.daysUntilCoverEnds);
  });
});

describe("guards", () => {
  it("returns null rather than a wrong answer for unusable input", () => {
    const base = { categoryKey: "c26", filedDate: "2026-06-01", expiryDate: "2026-10-16", today };
    expect(evaluateEadExtension({ ...base, categoryKey: "nope" })).toBeNull();
    expect(evaluateEadExtension({ ...base, filedDate: "" })).toBeNull();
    expect(evaluateEadExtension({ ...base, expiryDate: "2026-02-30" })).toBeNull();
    expect(evaluateEadExtension({ ...base, today: NaN })).toBeNull();
  });
});

describe("earliestFilingDate", () => {
  it("works back from the expiry by the renewal window", () => {
    expect(RENEWAL_WINDOW_DAYS).toBe(180);
    expect(earliestFilingDate("2026-10-16")).toBe("2026-04-19");
  });

  it("returns null for an unusable date", () => {
    expect(earliestFilingDate("not a date")).toBeNull();
  });
});
