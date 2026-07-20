import { describe, expect, it } from "vitest";
import {
  addMonths,
  monthLabel,
  visaBulletinState,
} from "./visaBulletinState";

const RELEASES = [
  "2026-06-13",
  "2026-07-15",
  "2026-08-14",
  "2026-09-12",
  "2026-10-14",
];

describe("bulletin state on 20 July 2026 — the reported bug", () => {
  const s = visaBulletinState(new Date(Date.UTC(2026, 6, 20)), RELEASES);

  it("July is effective", () => {
    expect(s.effectiveMonth).toBe("2026-07");
  });

  it("August is the latest PUBLISHED bulletin (out since Jul 15)", () => {
    expect(s.latestPublishedMonth).toBe("2026-08");
  });

  it("September is the next EXPECTED bulletin — never August", () => {
    expect(s.nextExpectedMonth).toBe("2026-09");
    expect(s.nextExpectedMonth).not.toBe("2026-08");
  });

  it("the next publication date is the Aug 14 release", () => {
    expect(s.nextPublicationDate).toBe("2026-08-14");
  });
});

describe("invariant: next expected is always after the latest published", () => {
  it("holds across every day of the schedule", () => {
    // Walk daily from June through October 2026.
    for (let d = new Date(Date.UTC(2026, 5, 1)); d <= new Date(Date.UTC(2026, 9, 31)); d = new Date(d.getTime() + 86_400_000)) {
      const s = visaBulletinState(d, RELEASES);
      if (s.nextExpectedMonth) {
        expect(
          s.nextExpectedMonth > s.latestPublishedMonth,
          `on ${d.toISOString().slice(0, 10)}: next ${s.nextExpectedMonth} must be after latest published ${s.latestPublishedMonth}`,
        ).toBe(true);
      }
    }
  });

  it("latest published is never earlier than the effective month", () => {
    for (const day of ["2026-07-01", "2026-07-14", "2026-07-15", "2026-07-20", "2026-08-01"]) {
      const [y, m, dd] = day.split("-").map(Number);
      const s = visaBulletinState(new Date(Date.UTC(y, m - 1, dd)), RELEASES);
      expect(s.latestPublishedMonth >= s.effectiveMonth).toBe(true);
    }
  });
});

describe("just before vs after a release flips the published month", () => {
  it("on Jul 14 (before the Jul 15 release) August is not yet published", () => {
    const s = visaBulletinState(new Date(Date.UTC(2026, 6, 14)), RELEASES);
    // Latest published is July (the effective month); next expected is August.
    expect(s.latestPublishedMonth).toBe("2026-07");
    expect(s.nextExpectedMonth).toBe("2026-08");
  });

  it("on Jul 15 (release day) August becomes published", () => {
    const s = visaBulletinState(new Date(Date.UTC(2026, 6, 15)), RELEASES);
    expect(s.latestPublishedMonth).toBe("2026-08");
    expect(s.nextExpectedMonth).toBe("2026-09");
  });
});

describe("helpers", () => {
  it("addMonths rolls over the year", () => {
    expect(addMonths("2026-11", 1)).toBe("2026-12");
    expect(addMonths("2026-12", 1)).toBe("2027-01");
  });

  it("monthLabel formats human-readable", () => {
    expect(monthLabel("2026-09")).toBe("September 2026");
  });
});
