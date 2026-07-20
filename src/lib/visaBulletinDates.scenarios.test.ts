/**
 * Scenario coverage for the priority-date comparison and the stale-bulletin
 * safeguard. Test 6 is a regression guard: isBulletinFresh used to compare
 * `lastUpdated` (mid-June for the July bulletin) against the current month,
 * so correct current-month data was reported as stale.
 */
import { describe, it, expect } from "vitest";
import { comparePriorityDate, isBulletinFresh, CURRENT_VISA_BULLETIN } from "@/lib/visaBulletinDates";

const CUT = "2014-01-01";
const d = (s: string) => new Date(s);

describe("priority date vs cutoff", () => {
  it("1. one day before cutoff -> current", () =>
    expect(comparePriorityDate(d("2013-12-31"), CUT)).toBe("current"));
  it("2. exactly equal to cutoff -> NOT current", () =>
    expect(comparePriorityDate(d("2014-01-01"), CUT)).toBe("not-current"));
  it("3. one day after cutoff -> not current", () =>
    expect(comparePriorityDate(d("2014-01-02"), CUT)).toBe("not-current"));
  it("4. category C -> all-current", () =>
    expect(comparePriorityDate(d("2025-01-01"), "C")).toBe("all-current"));
  it("5. category U -> unavailable", () =>
    expect(comparePriorityDate(d("1999-01-01"), "U")).toBe("unavailable"));
});

describe("staleness", () => {
  it("6. current-month bulletin is fresh", () =>
    expect(isBulletinFresh(CURRENT_VISA_BULLETIN)).toBe(true));
  it("7. older bulletin month is stale", () =>
    expect(isBulletinFresh({ ...CURRENT_VISA_BULLETIN, month: "January", year: 2025 })).toBe(false));
  it("8. future bulletin month is not stale", () =>
    expect(isBulletinFresh({ ...CURRENT_VISA_BULLETIN, month: "December", year: 2030 })).toBe(true));
});

describe("chart selection", () => {
  it("9. USCIS chart flag is a real boolean from data", () =>
    expect(typeof CURRENT_VISA_BULLETIN.usingDatesForFiling).toBe("boolean"));
  it("10. FAD and DFF are distinct charts", () => {
    expect(CURRENT_VISA_BULLETIN.finalActionDates.EB2.india)
      .not.toBe(CURRENT_VISA_BULLETIN.datesForFiling!.EB2.india);
  });
});
