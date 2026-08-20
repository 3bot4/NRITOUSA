/**
 * OPT timeline + unemployment engine.
 *
 * The important correctness point: unemployment on OPT is an AGGREGATE cap,
 * not a per-phase allowance. A student gets 90 days across post-completion
 * OPT, and the STEM extension adds 60 more for a lifetime total of 150 across
 * both periods combined. It does not reset to 150 at the start of STEM. A
 * great deal of published OPT content says otherwise, and students plan job
 * searches around the wrong number.
 *
 * Pure date arithmetic — no React, no I/O. All dates are ISO "YYYY-MM-DD"
 * strings handled in UTC so results never shift with the viewer's timezone.
 */

import { optRules } from "@/data/studentClusterData";

export type OptPhase = "not-applied" | "pending" | "on-opt" | "on-stem";

export interface OptInput {
  /** Program end date (I-20 completion date), ISO. */
  programEndDate: string;
  /** Where the student is in the process. */
  phase: OptPhase;
  /** OPT start date from the EAD card, ISO. Required once approved. */
  optStartDate?: string;
  /** Whether the student's degree is STEM-eligible. */
  stemEligible: boolean;
  /** Whether the STEM extension has been approved / is being counted. */
  stemApproved: boolean;
  /** Unemployment days already used during post-completion OPT. */
  unemploymentDaysUsed: number;
}

export interface OptMilestone {
  id: string;
  label: string;
  date: string;
  /** What this date means, in one sentence. */
  meaning: string;
  kind: "window" | "deadline" | "start" | "end" | "grace";
  /** Whether missing this date is unrecoverable. */
  critical: boolean;
}

export interface UnemploymentStatus {
  used: number;
  /** Cap that applies to this student right now. */
  cap: number;
  remaining: number;
  /** 0–100. */
  percentUsed: number;
  level: "ok" | "caution" | "warning" | "critical" | "exceeded";
  headline: string;
  detail: string;
  /** The cap the student would have if STEM is approved. */
  capWithStem: number;
  /** Extra days STEM would add, given what is already used. */
  stemWouldAdd: number;
}

export interface OptResult {
  milestones: OptMilestone[];
  unemployment: UnemploymentStatus;
  /** Filing window for the initial OPT I-765. */
  filingWindow: { opens: string; closes: string; isOpenOn: (iso: string) => boolean };
  warnings: string[];
  /** True when inputs were insufficient to compute dated milestones. */
  incomplete: boolean;
}

/* ───────────────────────────── date helpers ────────────────────────────── */

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = parseIso(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

export function addMonths(iso: string, months: number): string {
  const d = parseIso(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  // Clamp to the last valid day when the target month is shorter.
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
  ).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return toIso(d);
}

export function daysBetween(fromIso: string, toIsoStr: string): number {
  const ms = parseIso(toIsoStr).getTime() - parseIso(fromIso).getTime();
  return Math.round(ms / 86_400_000);
}

export function isValidIso(iso: string | undefined): iso is string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = parseIso(iso);
  return !Number.isNaN(d.getTime()) && toIso(d) === iso;
}

/* ─────────────────────────── unemployment logic ────────────────────────── */

/**
 * Applies the aggregate cap. `stemCounted` means the STEM extension is
 * approved (or being modelled), which raises the lifetime cap from 90 to 150
 * — it does NOT restore days already spent.
 */
export function unemploymentStatus(
  used: number,
  stemCounted: boolean
): UnemploymentStatus {
  const cap = stemCounted
    ? optRules.aggregateUnemploymentDaysWithStem
    : optRules.initialUnemploymentDays;
  const capWithStem = optRules.aggregateUnemploymentDaysWithStem;
  const safeUsed = Math.max(0, Math.round(used));
  const remaining = cap - safeUsed;
  const percentUsed = cap > 0 ? Math.min(100, (safeUsed / cap) * 100) : 0;

  let level: UnemploymentStatus["level"];
  if (remaining < 0) level = "exceeded";
  else if (percentUsed >= 90) level = "critical";
  else if (percentUsed >= 80) level = "warning";
  else if (percentUsed >= 60) level = "caution";
  else level = "ok";

  const headline =
    remaining < 0
      ? `${safeUsed} of ${cap} days used — over the limit by ${Math.abs(remaining)}`
      : `${safeUsed} of ${cap} days used — ${remaining} left`;

  const detail = stemCounted
    ? `The ${capWithStem}-day figure is a lifetime total across post-completion OPT and the STEM extension combined, not a fresh allowance. The ${safeUsed} days you used on initial OPT are already counted against it.`
    : `You have ${remaining} days of unemployment left on post-completion OPT. If a STEM extension is approved, your lifetime cap rises to ${capWithStem} days — which would leave you ${capWithStem - safeUsed} days in total, not ${capWithStem}.`;

  return {
    used: safeUsed,
    cap,
    remaining,
    percentUsed: Math.round(percentUsed),
    level,
    headline,
    detail,
    capWithStem,
    stemWouldAdd: Math.max(0, capWithStem - cap),
  };
}

/* ───────────────────────────── main engine ─────────────────────────────── */

export function buildOptTimeline(input: OptInput): OptResult {
  const {
    programEndDate,
    phase,
    optStartDate,
    stemEligible,
    stemApproved,
    unemploymentDaysUsed,
  } = input;

  const milestones: OptMilestone[] = [];
  const warnings: string[] = [];
  const hasProgramEnd = isValidIso(programEndDate);
  const hasOptStart = isValidIso(optStartDate);

  const stemCounted = stemEligible && stemApproved;
  const unemployment = unemploymentStatus(unemploymentDaysUsed, stemCounted);

  const windowOpens = hasProgramEnd
    ? addDays(programEndDate, -optRules.filingWindowDaysBefore)
    : "";
  const windowCloses = hasProgramEnd
    ? addDays(programEndDate, optRules.filingWindowDaysAfter)
    : "";

  if (hasProgramEnd) {
    milestones.push({
      id: "window-opens",
      label: "OPT filing window opens",
      date: windowOpens,
      meaning: `The earliest USCIS will accept your Form I-765 — ${optRules.filingWindowDaysBefore} days before your program end date. Filing on the first possible day is the single highest-value thing you can do, because processing time comes out of your job-search runway.`,
      kind: "window",
      critical: false,
    });
    milestones.push({
      id: "program-end",
      label: "Program end date",
      date: programEndDate,
      meaning:
        "The completion date on your I-20. Your 60-day grace period is measured from here if you never activate OPT.",
      kind: "end",
      critical: false,
    });
    milestones.push({
      id: "window-closes",
      label: "OPT filing deadline",
      date: windowCloses,
      meaning: `The last day USCIS will accept your initial OPT application — ${optRules.filingWindowDaysAfter} days after your program end date. Miss it and post-completion OPT is gone permanently; there is no late filing and no appeal.`,
      kind: "deadline",
      critical: true,
    });
  }

  if (hasOptStart) {
    const optEnd = addMonths(optStartDate, optRules.postCompletionMonths);
    milestones.push({
      id: "opt-start",
      label: "OPT start date",
      date: optStartDate,
      meaning:
        "The start date on your EAD. Your unemployment counter begins running on this date — not on your graduation date, and not when you start looking.",
      kind: "start",
      critical: false,
    });
    milestones.push({
      id: "opt-end",
      label: "OPT end date",
      date: optEnd,
      meaning: `${optRules.postCompletionMonths} months after your start date. Work authorisation stops here unless a STEM extension is pending or approved.`,
      kind: "end",
      critical: false,
    });

    if (stemEligible) {
      const stemWindowOpens = addDays(
        optEnd,
        -optRules.stemFilingWindowDaysBefore
      );
      milestones.push({
        id: "stem-window-opens",
        label: "STEM extension filing window opens",
        date: stemWindowOpens,
        meaning: `You may file the STEM I-765 up to ${optRules.stemFilingWindowDaysBefore} days before your current EAD expires. It must be received before the EAD expires — a STEM application filed even one day late is rejected.`,
        kind: "window",
        critical: true,
      });
      milestones.push({
        id: "stem-deadline",
        label: "STEM extension deadline",
        date: optEnd,
        meaning: `The last day USCIS can receive your STEM application. File early — transit time counts against you and a rejection for lateness cannot be cured. File on time and you keep working for up to ${optRules.stemPendingAutoExtensionDays} days past your EAD expiry while it is pending; file late and you do not.`,
        kind: "deadline",
        critical: true,
      });
      if (stemApproved) {
        milestones.push({
          id: "stem-end",
          label: "STEM OPT end date",
          date: addMonths(optEnd, optRules.stemMonths),
          meaning: `${optRules.stemMonths} months beyond your initial OPT end date, for a total of ${optRules.postCompletionMonths + optRules.stemMonths} months of work authorisation.`,
          kind: "end",
          critical: false,
        });
      }
    }

    const finalEnd =
      stemCounted
        ? addMonths(addMonths(optStartDate, optRules.postCompletionMonths), optRules.stemMonths)
        : optEnd;
    milestones.push({
      id: "grace-end",
      label: "Grace period ends",
      date: addDays(finalEnd, optRules.gracePeriodDays),
      meaning: `${optRules.gracePeriodDays} days after your work authorisation ends, for a student admitted for duration of status. By this date you must have departed the US, started a new program, or have a pending change of status — you cannot work during it. A DHS final rule effective September 15, 2026 reduces this to ${optRules.gracePeriodDaysUnderFixedAdmission} days for students admitted under it, so check your I-94 rather than assuming ${optRules.gracePeriodDays}.`,
      kind: "grace",
      critical: true,
    });
  } else if (hasProgramEnd && phase !== "on-opt" && phase !== "on-stem") {
    milestones.push({
      id: "grace-end-no-opt",
      label: "Grace period ends (if you never activate OPT)",
      date: addDays(programEndDate, optRules.gracePeriodDays),
      meaning: `Without OPT, your ${optRules.gracePeriodDays}-day grace period runs from your program end date, on a duration-of-status admission. You cannot work during it, and the September 15, 2026 fixed-admission rule cuts it to ${optRules.gracePeriodDaysUnderFixedAdmission} days for students admitted under it.`,
      kind: "grace",
      critical: true,
    });
  }

  milestones.sort((a, b) => a.date.localeCompare(b.date));

  /* ── warnings ── */
  if (unemployment.level === "exceeded") {
    warnings.push(
      `You are over the unemployment limit by ${Math.abs(unemployment.remaining)} days. Exceeding the cap is a status violation and your SEVIS record can be terminated. Speak to your DSO immediately — do not wait to see whether anything happens.`
    );
  } else if (unemployment.level === "critical") {
    warnings.push(
      `You have ${unemployment.remaining} unemployment days left. At this point, qualifying part-time work of at least ${optRules.initialMinWeeklyHours} hours a week, or a documented unpaid role directly related to your degree, stops the counter. Talk to your DSO this week.`
    );
  } else if (unemployment.level === "warning") {
    warnings.push(
      `You have used ${unemployment.percentUsed}% of your unemployment allowance. Start reporting any qualifying employment in the SEVP Portal — days often accrue simply because work was never reported.`
    );
  }

  if (stemEligible && !stemApproved && unemployment.used > 0) {
    warnings.push(
      `A STEM extension would raise your lifetime cap to ${unemployment.capWithStem} days, leaving you ${unemployment.capWithStem - unemployment.used} in total — the ${unemployment.used} days already used are not returned. Any tool or adviser telling you STEM resets the counter to ${unemployment.capWithStem} is wrong.`
    );
  }

  if (phase === "not-applied" || phase === "pending") {
    warnings.push(
      `Second deadline most OPT pages omit: once your DSO enters the OPT recommendation in SEVIS, USCIS must receive your I-765 within ${optRules.dsoRecommendationFilingDays} days. Filing inside the ${optRules.filingWindowDaysBefore}/${optRules.filingWindowDaysAfter}-day window but outside that ${optRules.dsoRecommendationFilingDays}-day window still gets you denied. Ask your DSO for the exact date they entered it.`
    );
  }

  if (!hasProgramEnd) {
    warnings.push(
      "Enter your program end date (the completion date on your I-20) to see your filing window and deadlines."
    );
  }
  if ((phase === "on-opt" || phase === "on-stem") && !hasOptStart) {
    warnings.push(
      "Enter the OPT start date printed on your EAD card to see your end dates and grace period."
    );
  }

  return {
    milestones,
    unemployment,
    filingWindow: {
      opens: windowOpens,
      closes: windowCloses,
      isOpenOn: (iso: string) =>
        isValidIso(iso) &&
        hasProgramEnd &&
        iso >= windowOpens &&
        iso <= windowCloses,
    },
    warnings,
    incomplete: !hasProgramEnd,
  };
}

/* ───────────────────────────── calendar export ─────────────────────────── */

/**
 * Builds an RFC 5545 .ics payload for the computed milestones so a student
 * can drop every deadline straight into their calendar. All-day VEVENTs.
 */
export function buildIcs(
  milestones: OptMilestone[],
  opts: { calendarName?: string; stamp?: string } = {}
): string {
  const stamp = opts.stamp ?? "20260101T000000Z";
  const name = opts.calendarName ?? "OPT deadlines";
  const esc = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const events = milestones.map((m) => {
    const start = m.date.replace(/-/g, "");
    const end = addDays(m.date, 1).replace(/-/g, "");
    return [
      "BEGIN:VEVENT",
      `UID:${m.id}-${start}@nritousa.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${esc(m.label)}`,
      `DESCRIPTION:${esc(m.meaning)}`,
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NRItoUSA//OPT Calculator//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${esc(name)}`,
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}
