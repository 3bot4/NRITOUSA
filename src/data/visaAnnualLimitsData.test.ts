/**
 * The statutory allocation math must agree with the figures the visa-bulletin
 * cluster already publishes — otherwise extracting them into a data file would
 * silently change numbers that are live on the site.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EB_WORLDWIDE_FLOOR,
  EB_ALLOCATIONS,
  EB5_SET_ASIDES,
  PER_COUNTRY_SHARE,
  fiscalYears,
  getFiscalYear,
  categoryAllocation,
  perCountryFloor,
  fmt,
  pct,
} from "./visaAnnualLimitsData";
import { getVisaBulletinChildPage } from "@/lib/visaBulletinCluster";

describe("statutory shares", () => {
  it("INA §203(b) shares sum to 100%", () => {
    const total = EB_ALLOCATIONS.reduce((s, a) => s + a.share, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  it("the three professional categories are 28.6% each", () => {
    for (const key of ["eb1", "eb2", "eb3"]) {
      expect(EB_ALLOCATIONS.find((a) => a.key === key)!.share).toBe(0.286);
    }
  });

  it("EB-5 set-asides total 32% of the category", () => {
    const total = EB5_SET_ASIDES.reduce((s, a) => s + a.share, 0);
    expect(total).toBeCloseTo(0.32, 10);
  });
});

describe("derived allocations reproduce the published figures", () => {
  const eb2 = EB_ALLOCATIONS.find((a) => a.key === "eb2")!;

  it("EB-2 gets 40,040 at the statutory floor", () => {
    expect(categoryAllocation(eb2.share, EB_WORLDWIDE_FLOOR)).toBe(40_040);
  });

  it("the per-country floor is 2,802 — the figure already on the site", () => {
    expect(perCountryFloor(eb2.share, EB_WORLDWIDE_FLOOR)).toBe(2_802);
  });

  it("agrees with the October predictions page, which quotes both", () => {
    const page = readFileSync(
      join(__dirname, "..", "app", "visa-bulletin", "october-2026-predictions", "page.tsx"),
      "utf8",
    );
    expect(page).toContain(fmt(categoryAllocation(eb2.share, EB_WORLDWIDE_FLOOR)));
    expect(page).toContain(fmt(perCountryFloor(eb2.share, EB_WORLDWIDE_FLOOR)));
    expect(page).toContain(fmt(EB_WORLDWIDE_FLOOR));
  });

  it("scales with the actual FY2026 pool rather than the floor", () => {
    const fy26 = getFiscalYear(2026)!;
    expect(fy26.ebPool).toBe(186_000);
    // 28.6% of 186,000 ≈ 53,196 — the "about 53,200" the cluster already cites.
    expect(categoryAllocation(eb2.share, fy26.ebPool!)).toBeGreaterThan(53_000);
    expect(categoryAllocation(eb2.share, fy26.ebPool!)).toBeLessThan(53_500);
  });
});

describe("FY2027 makes no claim it cannot support", () => {
  it("carries no pool until DOS publishes one", () => {
    const fy27 = getFiscalYear(2027)!;
    expect(fy27.ebPool).toBeNull();
    expect(fy27.status).toBe("awaiting-dos");
  });

  it("every fiscal year entry cites a source", () => {
    for (const fy of fiscalYears) {
      expect(fy.source).toMatch(/^https:\/\//);
      expect(fy.sourceLabel.length).toBeGreaterThan(0);
    }
  });
});

describe("formatters", () => {
  it("formats counts with thousands separators", () => {
    expect(fmt(40_040)).toBe("40,040");
  });

  it("renders percentages without floating-point noise", () => {
    expect(pct(0.286)).toBe("28.6%");
    expect(pct(0.071)).toBe("7.1%");
    expect(pct(PER_COUNTRY_SHARE)).toBe("7%");
  });
});

describe("the /visa-bulletin/annual-limits page derives, never hardcodes", () => {
  const page = () => getVisaBulletinChildPage("annual-limits")!;

  it("is registered as a cluster child", () => {
    expect(page()).toBeTruthy();
  });

  it("renders one table row per statutory category, with derived numbers", () => {
    const content = page().content as string;
    for (const a of EB_ALLOCATIONS) {
      const row = `| ${a.label} | ${pct(a.share)} | ${fmt(
        categoryAllocation(a.share, EB_WORLDWIDE_FLOOR),
      )} | ${fmt(perCountryFloor(a.share, EB_WORLDWIDE_FLOOR))} |`;
      expect(content, `missing derived row for ${a.key}`).toContain(row);
    }
  });

  it("never states an FY2027 pool, because DOS has not published one", () => {
    const content = page().content as string;
    expect(content).not.toMatch(/FY ?2027 (?:pool|limit) (?:is|was) [\d,]+/);
    expect(content).toMatch(/not knowable yet|not yet published|after the fiscal year opens/i);
  });

  it("keeps every link in the body internal (outbound links belong at the end)", () => {
    const content = page().content as string;
    expect(content).not.toMatch(/\]\(https?:\/\//);
  });
});
