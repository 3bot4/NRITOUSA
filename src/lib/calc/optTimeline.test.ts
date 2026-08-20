import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  buildIcs,
  buildOptTimeline,
  daysBetween,
  isValidIso,
  unemploymentStatus,
} from "./optTimeline";
import { optRules } from "@/data/studentClusterData";

describe("date helpers", () => {
  it("adds days across a month boundary", () => {
    expect(addDays("2026-05-15", 90)).toBe("2026-08-13");
  });

  it("adds days backwards", () => {
    expect(addDays("2026-05-15", -90)).toBe("2026-02-14");
  });

  it("adds months and clamps to a shorter target month", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2026-05-15", 12)).toBe("2027-05-15");
    expect(addMonths("2026-05-15", 24)).toBe("2028-05-15");
  });

  it("handles a leap-year February", () => {
    expect(addMonths("2028-01-31", 1)).toBe("2028-02-29");
  });

  it("counts days between dates", () => {
    expect(daysBetween("2026-01-01", "2026-01-31")).toBe(30);
  });

  it("validates ISO dates and rejects impossible ones", () => {
    expect(isValidIso("2026-05-15")).toBe(true);
    expect(isValidIso("2026-02-30")).toBe(false);
    expect(isValidIso("15-05-2026")).toBe(false);
    expect(isValidIso(undefined)).toBe(false);
  });

  it("is timezone-stable", () => {
    // A date-only string must not drift regardless of the host timezone.
    expect(addDays("2026-01-01", 0)).toBe("2026-01-01");
  });
});

describe("unemployment is an aggregate cap, not a reset", () => {
  it("caps at 90 days before a STEM extension", () => {
    const s = unemploymentStatus(40, false);
    expect(s.cap).toBe(optRules.initialUnemploymentDays);
    expect(s.remaining).toBe(50);
  });

  it("does NOT restore used days when STEM is approved", () => {
    const s = unemploymentStatus(40, true);
    expect(s.cap).toBe(optRules.aggregateUnemploymentDaysWithStem);
    // The critical assertion: 150 - 40 = 110 remaining, not 150.
    expect(s.remaining).toBe(110);
  });

  it("states the aggregate rule explicitly in its detail text", () => {
    const s = unemploymentStatus(40, true);
    expect(s.detail).toContain("lifetime total");
    expect(s.detail).not.toMatch(/resets/i);
  });

  it("tells a pre-STEM student the real post-STEM total", () => {
    const s = unemploymentStatus(40, false);
    expect(s.detail).toContain("110");
  });

  it("escalates severity as the allowance is consumed", () => {
    expect(unemploymentStatus(10, false).level).toBe("ok");
    expect(unemploymentStatus(55, false).level).toBe("caution");
    expect(unemploymentStatus(75, false).level).toBe("warning");
    expect(unemploymentStatus(85, false).level).toBe("critical");
    expect(unemploymentStatus(95, false).level).toBe("exceeded");
  });

  it("reports how far over the limit a student is", () => {
    const s = unemploymentStatus(100, false);
    expect(s.remaining).toBe(-10);
    expect(s.headline).toContain("over the limit by 10");
  });

  it("clamps negative input", () => {
    expect(unemploymentStatus(-5, false).used).toBe(0);
  });
});

describe("OPT timeline", () => {
  const base = {
    programEndDate: "2026-05-15",
    phase: "not-applied" as const,
    stemEligible: true,
    stemApproved: false,
    unemploymentDaysUsed: 0,
  };

  it("opens the filing window 90 days before program end", () => {
    const r = buildOptTimeline(base);
    expect(r.filingWindow.opens).toBe("2026-02-14");
  });

  it("closes the filing window 60 days after program end", () => {
    const r = buildOptTimeline(base);
    expect(r.filingWindow.closes).toBe("2026-07-14");
  });

  it("knows whether a given date is inside the window", () => {
    const r = buildOptTimeline(base);
    expect(r.filingWindow.isOpenOn("2026-03-01")).toBe(true);
    expect(r.filingWindow.isOpenOn("2026-01-01")).toBe(false);
    expect(r.filingWindow.isOpenOn("2026-08-01")).toBe(false);
  });

  it("marks the filing deadline as critical and unrecoverable", () => {
    const r = buildOptTimeline(base);
    const deadline = r.milestones.find((m) => m.id === "window-closes")!;
    expect(deadline.critical).toBe(true);
    expect(deadline.meaning).toContain("permanently");
  });

  it("derives OPT end 12 months after the EAD start date", () => {
    const r = buildOptTimeline({
      ...base,
      phase: "on-opt",
      optStartDate: "2026-07-01",
    });
    expect(r.milestones.find((m) => m.id === "opt-end")!.date).toBe("2027-07-01");
  });

  it("puts the STEM end 24 months past initial OPT end", () => {
    const r = buildOptTimeline({
      ...base,
      phase: "on-stem",
      optStartDate: "2026-07-01",
      stemApproved: true,
    });
    expect(r.milestones.find((m) => m.id === "stem-end")!.date).toBe("2029-07-01");
  });

  it("ends the grace period 60 days after work authorisation ends", () => {
    const r = buildOptTimeline({
      ...base,
      phase: "on-opt",
      optStartDate: "2026-07-01",
      stemEligible: false,
    });
    // OPT ends 2027-07-01; +60 days.
    expect(r.milestones.find((m) => m.id === "grace-end")!.date).toBe("2027-08-30");
  });

  it("extends the grace period past STEM when STEM is approved", () => {
    const r = buildOptTimeline({
      ...base,
      phase: "on-stem",
      optStartDate: "2026-07-01",
      stemApproved: true,
    });
    expect(r.milestones.find((m) => m.id === "grace-end")!.date).toBe("2029-08-30");
  });

  it("returns milestones in chronological order", () => {
    const r = buildOptTimeline({
      ...base,
      phase: "on-opt",
      optStartDate: "2026-07-01",
    });
    const dates = r.milestones.map((m) => m.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it("warns that STEM does not reset the counter", () => {
    const r = buildOptTimeline({ ...base, unemploymentDaysUsed: 40 });
    expect(r.warnings.some((w) => w.includes("110"))).toBe(true);
    expect(r.warnings.some((w) => w.includes("is wrong"))).toBe(true);
  });

  it("escalates when the cap is exceeded", () => {
    const r = buildOptTimeline({ ...base, unemploymentDaysUsed: 95 });
    expect(r.warnings[0]).toContain("over the unemployment limit");
    expect(r.warnings[0]).toContain("DSO");
  });

  it("flags incomplete input rather than inventing dates", () => {
    const r = buildOptTimeline({ ...base, programEndDate: "" });
    expect(r.incomplete).toBe(true);
    expect(r.milestones).toHaveLength(0);
  });

  it("shows the no-OPT grace path when OPT was never activated", () => {
    const r = buildOptTimeline(base);
    expect(r.milestones.some((m) => m.id === "grace-end-no-opt")).toBe(true);
  });
});

describe("ics export", () => {
  const r = buildOptTimeline({
    programEndDate: "2026-05-15",
    phase: "on-opt",
    optStartDate: "2026-07-01",
    stemEligible: true,
    stemApproved: false,
    unemploymentDaysUsed: 0,
  });

  it("produces a valid calendar envelope", () => {
    const ics = buildIcs(r.milestones);
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("VERSION:2.0");
  });

  it("emits one event per milestone", () => {
    const ics = buildIcs(r.milestones);
    expect(ics.match(/BEGIN:VEVENT/g)!).toHaveLength(r.milestones.length);
  });

  it("uses all-day events with an exclusive end date", () => {
    const ics = buildIcs(r.milestones);
    expect(ics).toContain("DTSTART;VALUE=DATE:20260214");
    expect(ics).toContain("DTEND;VALUE=DATE:20260215");
  });

  it("escapes commas and semicolons in text fields", () => {
    const ics = buildIcs([
      {
        id: "t",
        label: "A, B; C",
        date: "2026-01-01",
        meaning: "x, y",
        kind: "deadline",
        critical: true,
      },
    ]);
    expect(ics).toContain("SUMMARY:A\\, B\\; C");
  });

  it("uses CRLF line endings as the spec requires", () => {
    expect(buildIcs(r.milestones)).toContain("\r\n");
  });
});
