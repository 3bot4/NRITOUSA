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

/* ─── UPDATE THIS OBJECT EACH MONTH ──────────────────────────────────────── */

export const CURRENT_VISA_BULLETIN: VisaBulletinData = {
  month: "June",
  year: 2026,
  sourceUrl:
    "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-june-2026.html",

  // Table A — Final Action Dates
  // A priority date ON OR BEFORE this date qualifies for final approval.
  finalActionDates: {
    EB1: { india: "C",          other: "C"    },
    EB2: { india: "2012-08-01", other: "C"    },
    EB3: { india: "2012-11-01", other: "C"    },
  },

  // Table B — Dates for Filing
  // Set the entire object to null if USCIS has not authorized Part B this month.
  datesForFiling: {
    EB1: { india: "C",          other: "C"    },
    EB2: { india: "2013-04-01", other: "C"    },
    EB3: { india: "2013-01-01", other: "C"    },
  },

  usingDatesForFiling: true, // USCIS Visa Bulletin Acceptance memo — verify at uscis.gov each month

  lastUpdated: "2026-06-01",
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
