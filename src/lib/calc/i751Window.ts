/**
 * Form I-751 filing-window arithmetic.
 *
 * All dates are handled as UTC calendar days, deliberately. A user in Mumbai
 * and a user in California must see the same window for the same card, and
 * local-time Date construction silently shifts a date by a day either side of
 * midnight — which for a 90-day statutory window is a real error, not a
 * rounding one.
 */

import { I751_FACTS } from "@/data/i751Data";

/** Parses "YYYY-MM-DD" into a UTC-midnight timestamp, or null if unusable. */
export function parseIsoDate(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? "").trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const ts = Date.UTC(y, mo - 1, d);
  const back = new Date(ts);
  // Rejects 2026-02-31 and friends, which Date.UTC would happily roll forward.
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) {
    return null;
  }
  return ts;
}

export const DAY_MS = 86_400_000;

export function toIso(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function addDays(ts: number, days: number): number {
  return ts + days * DAY_MS;
}

/**
 * Adds whole months on the UTC calendar, clamping to the last day of the target
 * month. Without the clamp, 31 August + 48 months would roll into September.
 */
export function addMonths(ts: number, months: number): number {
  const d = new Date(ts);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const targetY = y + Math.floor((m + months) / 12);
  const targetM = ((m + months) % 12 + 12) % 12;
  const lastDay = new Date(Date.UTC(targetY, targetM + 1, 0)).getUTCDate();
  return Date.UTC(targetY, targetM, Math.min(day, lastDay));
}

export function daysBetween(a: number, b: number): number {
  return Math.round((b - a) / DAY_MS);
}

export type WindowStatus = "too-early" | "open" | "closing" | "expired";

export interface I751Window {
  /** Conditional card expiry — derived from "Resident Since" or given directly. */
  expiry: string;
  /** First day USCIS will accept a joint filing. */
  opens: string;
  /** The card's expiry date: the last day to file before status terminates. */
  deadline: string;
  /** Negative until the window opens; counts down once it is open. */
  daysUntilOpen: number;
  daysUntilDeadline: number;
  status: WindowStatus;
  /** When a receipt notice would carry conditional status to. */
  extensionEnds: string;
  extensionMonths: number;
}

export interface I751WindowInput {
  /** The "Resident Since" date printed on the conditional card. */
  residentSince?: string;
  /** Or the card's expiration date, if the user prefers to read that off. */
  expiry?: string;
  /** Today, as a UTC-midnight timestamp. Injected so the tests are stable. */
  today: number;
}

/**
 * Days remaining at which the window is flagged as "closing" rather than
 * merely open. Chosen so someone who still has to gather two years of joint
 * documents, get them scanned and pay is told to move, not reassured.
 */
export const CLOSING_THRESHOLD_DAYS = 30;

/**
 * Works out the joint-filing window.
 *
 * Returns null when neither date is usable — the caller renders a prompt
 * rather than a confident-looking wrong answer.
 */
export function computeI751Window(input: I751WindowInput): I751Window | null {
  const expiryTs = input.expiry
    ? parseIsoDate(input.expiry)
    : (() => {
        const rs = parseIsoDate(input.residentSince ?? "");
        return rs === null ? null : addMonths(rs, I751_FACTS.conditionalYears * 12);
      })();

  if (expiryTs === null) return null;

  const opensTs = addDays(expiryTs, -I751_FACTS.windowDays);
  const daysUntilOpen = daysBetween(input.today, opensTs);
  const daysUntilDeadline = daysBetween(input.today, expiryTs);

  let status: WindowStatus;
  if (daysUntilDeadline < 0) status = "expired";
  else if (daysUntilOpen > 0) status = "too-early";
  else if (daysUntilDeadline <= CLOSING_THRESHOLD_DAYS) status = "closing";
  else status = "open";

  return {
    expiry: toIso(expiryTs),
    opens: toIso(opensTs),
    deadline: toIso(expiryTs),
    daysUntilOpen,
    daysUntilDeadline,
    status,
    extensionEnds: toIso(addMonths(expiryTs, I751_FACTS.extensionMonths)),
    extensionMonths: I751_FACTS.extensionMonths,
  };
}

/**
 * A minimal RFC 5545 VEVENT for the window-opens reminder, built as a string so
 * the browser can hand it straight to a Blob download. No library, no network.
 *
 * All-day events use DATE values and an exclusive DTEND, hence the +1 day.
 */
export function buildIcs(opts: {
  start: string;
  summary: string;
  description: string;
  uid: string;
}): string {
  const startTs = parseIsoDate(opts.start);
  if (startTs === null) return "";
  const stamp = (ts: number) => toIso(ts).replace(/-/g, "");
  // Escape per RFC 5545: backslash, semicolon, comma, newline.
  const esc = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NRI to USA//I-751 filing window//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${esc(opts.uid)}`,
    `DTSTAMP:${stamp(startTs)}T000000Z`,
    `DTSTART;VALUE=DATE:${stamp(startTs)}`,
    `DTEND;VALUE=DATE:${stamp(addDays(startTs, 1))}`,
    `SUMMARY:${esc(opts.summary)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(opts.summary)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
