/**
 * Admin-managed visa bulletin data.
 * Update this file each month when the new bulletin is published (around the 8th–10th of the month).
 * Source: https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html
 *
 * Date format: "YYYY-MM-DD" — use the cutoff date exactly as printed in the bulletin.
 * "C" = Current (no cutoff — all priority dates in this category qualify).
 * "U" = Unavailable (no visa numbers available this month for this category/country).
 *
 * After updating dates, also update:
 *   month, year, sourceUrl, usingDatesForFiling (check the USCIS Visa Bulletin Acceptance memo),
 *   and lastUpdated (set to today's date).
 */

export type CutoffValue = "C" | "U" | string; // ISO date "YYYY-MM-DD" | "C" | "U"

export interface CategoryDates {
  india: CutoffValue;
  other: CutoffValue;
}

export interface BulletinChartData {
  EB1: CategoryDates;
  EB2: CategoryDates;
  EB3: CategoryDates;
}

export interface VisaBulletinData {
  month: string;
  year: number;
  sourceUrl: string;
  /** Table A — Final Action Dates (always present) */
  finalActionDates: BulletinChartData;
  /**
   * Table B — Dates for Filing.
   * Set to null if USCIS has NOT authorized use of Part B this month
   * (check the USCIS monthly Visa Bulletin Acceptance memo at uscis.gov).
   */
  datesForFiling: BulletinChartData | null;
  /** Whether USCIS has authorized use of Part B (Dates for Filing) this month */
  usingDatesForFiling: boolean;
  /** ISO date when admin last updated this file */
  lastUpdated: string;
}

/* ─── CANONICAL DATA SOURCE ───────────────────────────────────────────────────
 * The actual cutoff dates come from the single source of truth in
 * data/visa-bulletin/current.json (also used by the tools, charts, and tracker
 * via src/lib/visa-bulletin.ts). This file adapts that data into the
 * India/"Other" shape the Priority Date Checker uses, and adds the one field
 * current.json does not carry: whether USCIS authorized Dates for Filing this
 * month. Update current.json each month; only usingDatesForFiling is manual.
 *
 * Note on Table A vs Table B values: a listed date is a strict cutoff — a
 * priority date qualifies only when it is EARLIER THAN the listed date.
 * "U" = Unavailable (no numbers this month). "C" = Current (all dates qualify).
 * ───────────────────────────────────────────────────────────────────────────── */

import currentData from "../../data/visa-bulletin/current.json";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const [_y, _m] = currentData.bulletinMonth.split("-").map(Number);

type RawCat = { fad: string; dff: string };
const cats = currentData.categories as Record<
  string,
  Record<string, RawCat>
>;

/** India = the country row; "Other" = Rest-of-World row in current.json. */
const fad = (key: "eb1" | "eb2" | "eb3"): CategoryDates => ({
  india: cats[key].india.fad,
  other: cats[key].row.fad,
});
const dff = (key: "eb1" | "eb2" | "eb3"): CategoryDates => ({
  india: cats[key].india.dff,
  other: cats[key].row.dff,
});

export const CURRENT_VISA_BULLETIN: VisaBulletinData = {
  month: MONTH_NAMES[_m - 1],
  year: _y,
  sourceUrl: currentData.source,

  // Table A — Final Action Dates (from current.json)
  finalActionDates: {
    EB1: fad("eb1"),
    EB2: fad("eb2"),
    EB3: fad("eb3"),
  },

  // Table B — Dates for Filing (from current.json)
  datesForFiling: {
    EB1: dff("eb1"),
    EB2: dff("eb2"),
    EB3: dff("eb3"),
  },

  // MANUAL each month — USCIS is using Final Action Dates (Table A) for July
  // 2026 employment-based adjustment of status, so Table B cannot be used to
  // file I-485 this month. Verify at uscis.gov/visabulletininfo.
  usingDatesForFiling: false,

  lastUpdated: currentData.lastUpdated,
};

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */

/**
 * Parse a cutoff value into a Date or special sentinel.
 * Returns null for "C" (Current) and "U" (Unavailable).
 */
export function parseCutoff(v: CutoffValue): Date | "C" | "U" {
  if (v === "C") return "C";
  if (v === "U") return "U";
  return new Date(v);
}

/**
 * Compare a priority date against a cutoff value.
 * Returns: "current" | "not-current" | "unavailable" | "all-current"
 */
export function comparePriorityDate(
  priorityDate: Date,
  cutoff: CutoffValue
): "current" | "not-current" | "unavailable" | "all-current" {
  if (cutoff === "C") return "all-current";
  if (cutoff === "U") return "unavailable";
  const cutoffDate = new Date(cutoff);
  return priorityDate < cutoffDate ? "current" : "not-current";
}

/** Return true if the bulletin data is from the current calendar month. */
export function isBulletinFresh(data: VisaBulletinData): boolean {
  const now = new Date();
  return (
    data.year === now.getFullYear() &&
    new Date(data.lastUpdated).getMonth() === now.getMonth()
  );
}
