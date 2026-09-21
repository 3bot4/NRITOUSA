import { describe, it, expect } from "vitest";
import {
  parseIsoDate,
  addMonths,
  addDays,
  daysBetween,
  toIso,
  computeI751Window,
  buildIcs,
  CLOSING_THRESHOLD_DAYS,
} from "./i751Window";
import { I751_FACTS } from "@/data/i751Data";

const at = (iso: string) => parseIsoDate(iso)!;

describe("parseIsoDate", () => {
  it("parses a valid date to UTC midnight", () => {
    expect(toIso(at("2026-09-16"))).toBe("2026-09-16");
  });

  it("rejects malformed input rather than guessing", () => {
    for (const bad of ["", "16/09/2026", "2026-9-16", "yesterday", "2026-09"]) {
      expect(parseIsoDate(bad)).toBeNull();
    }
  });

  it("rejects a date that does not exist instead of rolling it forward", () => {
    expect(parseIsoDate("2026-02-30")).toBeNull();
    expect(parseIsoDate("2026-13-01")).toBeNull();
    expect(parseIsoDate("2026-04-31")).toBeNull();
  });

  it("accepts 29 February in a leap year and rejects it otherwise", () => {
    expect(parseIsoDate("2028-02-29")).not.toBeNull();
    expect(parseIsoDate("2026-02-29")).toBeNull();
  });
});

describe("addMonths", () => {
  it("adds two years to a normal date", () => {
    expect(toIso(addMonths(at("2025-03-14"), 24))).toBe("2027-03-14");
  });

  it("clamps to the last day of the target month rather than rolling over", () => {
    expect(toIso(addMonths(at("2026-08-31"), 1))).toBe("2026-09-30");
    expect(toIso(addMonths(at("2026-01-31"), 1))).toBe("2026-02-28");
  });

  it("handles a leap-day anniversary by clamping", () => {
    expect(toIso(addMonths(at("2028-02-29"), 12))).toBe("2029-02-28");
  });

  it("adds 48 months across a leap year", () => {
    expect(toIso(addMonths(at("2026-09-16"), 48))).toBe("2030-09-16");
  });
});

describe("computeI751Window", () => {
  it("derives the expiry as two years after the Resident Since date", () => {
    const w = computeI751Window({ residentSince: "2025-06-10", today: at("2025-07-01") })!;
    expect(w.expiry).toBe("2027-06-10");
  });

  it("opens the window exactly 90 days before the card expires", () => {
    const w = computeI751Window({ residentSince: "2025-06-10", today: at("2025-07-01") })!;
    expect(daysBetween(at(w.opens), at(w.expiry))).toBe(I751_FACTS.windowDays);
    expect(w.opens).toBe("2027-03-12");
  });

  it("accepts an expiry date directly, and agrees with the derived route", () => {
    const fromExpiry = computeI751Window({ expiry: "2027-06-10", today: at("2025-07-01") })!;
    const fromResident = computeI751Window({ residentSince: "2025-06-10", today: at("2025-07-01") })!;
    expect(fromExpiry.opens).toBe(fromResident.opens);
    expect(fromExpiry.deadline).toBe(fromResident.deadline);
  });

  it("reports too-early before the window opens", () => {
    const w = computeI751Window({ expiry: "2027-06-10", today: at("2027-03-11") })!;
    expect(w.status).toBe("too-early");
    expect(w.daysUntilOpen).toBe(1);
  });

  it("is open on the first day of the window, not the day after", () => {
    const w = computeI751Window({ expiry: "2027-06-10", today: at("2027-03-12") })!;
    expect(w.status).toBe("open");
    expect(w.daysUntilOpen).toBe(0);
    expect(w.daysUntilDeadline).toBe(I751_FACTS.windowDays);
  });

  it("flags closing inside the final stretch", () => {
    const w = computeI751Window({
      expiry: "2027-06-10",
      today: at("2027-06-10") - CLOSING_THRESHOLD_DAYS * 86_400_000,
    })!;
    expect(w.status).toBe("closing");
    expect(w.daysUntilDeadline).toBe(CLOSING_THRESHOLD_DAYS);
  });

  it("is still open, not expired, on the expiry date itself", () => {
    const w = computeI751Window({ expiry: "2027-06-10", today: at("2027-06-10") })!;
    expect(w.daysUntilDeadline).toBe(0);
    expect(w.status).toBe("closing");
  });

  it("expires the day after the card expires", () => {
    const w = computeI751Window({ expiry: "2027-06-10", today: at("2027-06-11") })!;
    expect(w.status).toBe("expired");
    expect(w.daysUntilDeadline).toBe(-1);
  });

  it("extends conditional status 48 months past the card expiry", () => {
    const w = computeI751Window({ expiry: "2027-06-10", today: at("2027-03-12") })!;
    expect(w.extensionMonths).toBe(48);
    expect(w.extensionEnds).toBe("2031-06-10");
  });

  it("returns null for unusable input instead of a confident wrong answer", () => {
    expect(computeI751Window({ today: at("2026-09-16") })).toBeNull();
    expect(computeI751Window({ residentSince: "not a date", today: at("2026-09-16") })).toBeNull();
    expect(computeI751Window({ expiry: "2026-02-30", today: at("2026-09-16") })).toBeNull();
  });

  it("gives the same answer regardless of the host timezone offset", () => {
    // Timestamps an hour either side of UTC midnight must land on the same day.
    const base = at("2027-03-12");
    const early = computeI751Window({ expiry: "2027-06-10", today: base + 3_600_000 })!;
    const late = computeI751Window({ expiry: "2027-06-10", today: base + 82_800_000 })!;
    expect(early.status).toBe(late.status);
    expect(early.opens).toBe(late.opens);
  });
});

describe("buildIcs", () => {
  const ics = buildIcs({
    start: "2027-03-12",
    summary: "I-751 filing window opens",
    description: "File Form I-751; the card expires 2027-06-10.",
    uid: "i751-2027-03-12@nritousa.com",
  });

  it("produces a well-formed all-day VEVENT", () => {
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("DTSTART;VALUE=DATE:20270312");
    expect(ics).toContain("SUMMARY:I-751 filing window opens");
  });

  it("uses an exclusive DTEND one day later, as all-day events require", () => {
    expect(ics).toContain("DTEND;VALUE=DATE:20270313");
  });

  it("uses CRLF line endings", () => {
    expect(ics.includes("\r\n")).toBe(true);
    expect(ics.split("\r\n").length).toBeGreaterThan(10);
  });

  it("escapes commas so the description cannot break the field", () => {
    const withComma = buildIcs({
      start: "2027-03-12",
      summary: "Window opens, file now",
      description: "a, b",
      uid: "x@nritousa.com",
    });
    expect(withComma).toContain("SUMMARY:Window opens\\, file now");
  });

  it("returns an empty string for an unusable start date", () => {
    expect(buildIcs({ start: "nope", summary: "s", description: "d", uid: "u" })).toBe("");
  });

  it("carries a one-week advance alarm", () => {
    expect(ics).toContain("TRIGGER:-P7D");
  });
});

describe("addDays / daysBetween", () => {
  it("round-trips across a DST boundary in the host timezone", () => {
    const start = at("2027-03-01");
    expect(daysBetween(start, addDays(start, 30))).toBe(30);
    expect(toIso(addDays(start, 30))).toBe("2027-03-31");
  });
});
