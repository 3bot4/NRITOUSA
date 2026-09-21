/**
 * RFE response deadline arithmetic.
 *
 * The rule, from the USCIS Policy Manual (Vol. 1, Pt. E, Ch. 6):
 *   • the response period is printed on the notice — 84 days is the maximum,
 *     30 days for Form I-539 and Form I-601A;
 *   • when USCIS serves the notice BY MAIL, 3 days are added to that period;
 *   • officers are prohibited from granting more time.
 *
 * UTC-only dates, same as the other date calculators here, so the answer does
 * not shift by a day depending on where the reader is sitting.
 */

import { RFE_RULES } from "@/data/rfeData";
import { parseIsoDate, addDays, toIso, daysBetween } from "@/lib/calc/i751Window";

export type ServiceMethod = "mail" | "electronic";

export interface RfeDeadlineInput {
  /** The date printed on the notice, not the date it arrived. */
  noticeDate: string;
  /** The response period printed on the notice, in days. */
  responseDays: number;
  serviceMethod: ServiceMethod;
  /** Today, UTC midnight. Injected so tests are stable. */
  today: number;
}

export type RfeStatus = "open" | "urgent" | "due-today" | "passed";

export interface RfeDeadline {
  noticeDate: string;
  responseDays: number;
  graceDays: number;
  /** The last day USCIS will accept the response. */
  deadline: string;
  daysRemaining: number;
  status: RfeStatus;
  /** Suggested last day to POST a mailed response, working back from the deadline. */
  mailBy: string;
  /** True when the entered period exceeds what policy permits. */
  exceedsPolicyMax: boolean;
}

/**
 * Days we suggest holding back for a mailed response to arrive. USCIS counts
 * receipt, not postmark, so "posted on the deadline" is a missed deadline.
 * Deliberately conservative: the downside of posting a week early is nothing,
 * and the downside of posting a day late is a denial with no appeal to the
 * deadline itself.
 */
export const MAIL_BUFFER_DAYS = 7;

/** Days remaining at which the result is flagged urgent rather than merely open. */
export const URGENT_THRESHOLD_DAYS = 14;

/**
 * Floors a timestamp to UTC midnight.
 *
 * `today` is normalised rather than trusted: a caller that passes Date.now()
 * would otherwise get a countdown that differs by one depending on the time of
 * day, which on a deadline nobody can extend is not an acceptable rounding.
 */
function utcMidnight(ts: number): number {
  return Number.isFinite(ts) ? Math.floor(ts / 86_400_000) * 86_400_000 : NaN;
}

export function computeRfeDeadline(input: RfeDeadlineInput): RfeDeadline | null {
  const notice = parseIsoDate(input.noticeDate);
  if (notice === null) return null;

  const days = Math.floor(input.responseDays);
  if (!Number.isFinite(days) || days <= 0) return null;

  const graceDays = input.serviceMethod === "mail" ? RFE_RULES.mailGraceDays : 0;
  const deadlineTs = addDays(notice, days + graceDays);
  const today = utcMidnight(input.today);
  if (!Number.isFinite(today)) return null;
  const daysRemaining = daysBetween(today, deadlineTs);

  let status: RfeStatus;
  if (daysRemaining < 0) status = "passed";
  else if (daysRemaining === 0) status = "due-today";
  else if (daysRemaining <= URGENT_THRESHOLD_DAYS) status = "urgent";
  else status = "open";

  return {
    noticeDate: toIso(notice),
    responseDays: days,
    graceDays,
    deadline: toIso(deadlineTs),
    daysRemaining,
    status,
    mailBy: toIso(addDays(deadlineTs, -MAIL_BUFFER_DAYS)),
    exceedsPolicyMax: days > RFE_RULES.maxDays,
  };
}
