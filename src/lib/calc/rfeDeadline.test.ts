import { describe, it, expect } from "vitest";
import {
  computeRfeDeadline,
  MAIL_BUFFER_DAYS,
  URGENT_THRESHOLD_DAYS,
} from "./rfeDeadline";
import { parseIsoDate } from "./i751Window";
import { RFE_RULES } from "@/data/rfeData";

const at = (iso: string) => parseIsoDate(iso)!;
const base = {
  noticeDate: "2026-09-01",
  responseDays: 84,
  serviceMethod: "mail" as const,
  today: at("2026-09-16"),
};

describe("computeRfeDeadline", () => {
  it("adds the 3-day mail grace, giving 87 days from the notice date", () => {
    const r = computeRfeDeadline(base)!;
    expect(r.graceDays).toBe(RFE_RULES.mailGraceDays);
    expect(r.deadline).toBe("2026-11-27"); // 1 Sep + 87 days
  });

  it("adds no grace for electronic service", () => {
    const r = computeRfeDeadline({ ...base, serviceMethod: "electronic" })!;
    expect(r.graceDays).toBe(0);
    expect(r.deadline).toBe("2026-11-24"); // 1 Sep + 84 days
  });

  it("uses the period printed on the notice, not the maximum", () => {
    const r = computeRfeDeadline({ ...base, responseDays: 30 })!;
    expect(r.deadline).toBe("2026-10-04"); // 30 + 3 days
  });

  it("flags a period longer than policy permits rather than silently accepting it", () => {
    expect(computeRfeDeadline({ ...base, responseDays: 120 })!.exceedsPolicyMax).toBe(true);
    expect(computeRfeDeadline({ ...base, responseDays: 84 })!.exceedsPolicyMax).toBe(false);
  });

  it("works back from the deadline to a last-safe-post date", () => {
    const r = computeRfeDeadline(base)!;
    expect(r.mailBy).toBe("2026-11-20"); // deadline - 7
    expect(MAIL_BUFFER_DAYS).toBe(7);
  });

  it("counts down, and is urgent inside the final fortnight", () => {
    const r = computeRfeDeadline({
      ...base,
      today: at("2026-11-27") - URGENT_THRESHOLD_DAYS * 86_400_000,
    })!;
    expect(r.daysRemaining).toBe(URGENT_THRESHOLD_DAYS);
    expect(r.status).toBe("urgent");
  });

  it("is due-today on the deadline itself, not passed", () => {
    const r = computeRfeDeadline({ ...base, today: at("2026-11-27") })!;
    expect(r.daysRemaining).toBe(0);
    expect(r.status).toBe("due-today");
  });

  it("is passed the day after", () => {
    const r = computeRfeDeadline({ ...base, today: at("2026-11-28") })!;
    expect(r.status).toBe("passed");
    expect(r.daysRemaining).toBe(-1);
  });

  it("returns null rather than a wrong deadline for unusable input", () => {
    expect(computeRfeDeadline({ ...base, noticeDate: "" })).toBeNull();
    expect(computeRfeDeadline({ ...base, noticeDate: "2026-02-30" })).toBeNull();
    expect(computeRfeDeadline({ ...base, responseDays: 0 })).toBeNull();
    expect(computeRfeDeadline({ ...base, responseDays: -30 })).toBeNull();
    expect(computeRfeDeadline({ ...base, responseDays: NaN })).toBeNull();
  });

  it("gives the same countdown at any time of day, not just at midnight", () => {
    // A caller passing Date.now() must not get a countdown that drifts by one
    // depending on the hour — `today` is floored to UTC midnight internally.
    const day = at("2026-09-16");
    const early = computeRfeDeadline({ ...base, today: day + 3_600_000 })!;
    const late = computeRfeDeadline({ ...base, today: day + 82_800_000 })!;
    expect(early.deadline).toBe(late.deadline);
    expect(early.daysRemaining).toBe(late.daysRemaining);
    expect(early.daysRemaining).toBe(computeRfeDeadline(base)!.daysRemaining);
  });

  it("rejects a non-finite today rather than producing NaN days", () => {
    expect(computeRfeDeadline({ ...base, today: NaN })).toBeNull();
  });

  it("crosses a year boundary correctly", () => {
    const r = computeRfeDeadline({ ...base, noticeDate: "2026-11-15" })!;
    expect(r.deadline).toBe("2027-02-10"); // 15 Nov + 87 days
  });

  it("encodes that no extension exists", () => {
    // A future edit that adds an "extension" input should have to delete this.
    expect(RFE_RULES.extensionsAllowed).toBe(false);
  });
});
