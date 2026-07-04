/**
 * PERM / PWD / DOL processing-time data — the single editable source for the
 * PERM processing-time cluster (calculator + /dol-processing-times +
 * /pwd-processing-time + /perm-timeline + /h1b-perm-max-out-calculator).
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  HOW TO UPDATE (do this monthly):                                        │
 * │  1. Open the official DOL FLAG processing-times dashboard:               │
 * │       https://flag.dol.gov/processingtimes                                │
 * │  2. Copy the current "we are processing cases filed in <MONTH>" queue     │
 * │     months into the *ReceiptMonth / *PriorityDate string fields below.    │
 * │  3. Copy the published "average number of days" figures into the          │
 * │     average*Days number fields.                                           │
 * │  4. Set `lastUpdated` to the date you pulled the numbers.                 │
 * │  Anything left as NEEDS_UPDATE renders as "Update from DOL FLAG" on the   │
 * │  page — it is never presented as a confirmed current value.              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * IMPORTANT: These pages are educational planning tools, not legal advice, and
 * never a substitute for the official FLAG dashboard. The queue/priority-date
 * string fields change monthly; do NOT invent them — leave NEEDS_UPDATE until a
 * real value is copied from FLAG. The `*PlanningMonths*` ranges are general,
 * rule-of-thumb planning ranges (clearly labelled as estimates on-page), not
 * the official current queue.
 */

/** Sentinel: a monthly FLAG value that has not been confirmed yet. */
export const NEEDS_UPDATE = "Update from DOL FLAG" as const;

export interface PermProcessingData {
  /** Date these numbers were last pulled from DOL FLAG (human-readable). */
  lastUpdated: string;
  /** Official source for every value on the cluster. */
  dolSourceUrl: string;

  /* --- Monthly FLAG queue snapshots (copy from flag.dol.gov/processingtimes) --- */
  /** PWD (prevailing wage) — OEWS wage source: cases filed in this month now being processed. */
  pwdPermOewsReceiptMonth: string;
  /** PWD — non-OEWS wage source (surveys, CBA, etc.). */
  pwdPermNonOewsReceiptMonth: string;
  /** PERM analyst review: month of cases currently under analyst review. */
  permAnalystReviewPriorityDate: string;
  /** PERM audit review: month of audited cases currently under review. */
  permAuditReviewPriorityDate: string;
  /** PERM reconsideration / appeals queue month. */
  permReconsiderationDate: string;

  /* --- Published "average number of days" (null → show NEEDS_UPDATE) --- */
  averagePermAnalystReviewDays: number | null;
  averagePermAuditReviewDays: number | null;

  /* --- Rule-based / stable planning inputs (safe defaults, still editable) --- */
  /** Minimum days recruitment must span, incl. the 30-day quiet period after ads. */
  recruitmentMinimumDays: number;
  /** Typical safe-planning recruitment window end-to-end. */
  recruitmentTypicalDays: number;
  /** USCIS I-140 premium processing SLA (EB-2/EB-3 non-NIW). */
  i140PremiumProcessingBusinessDays: number;
  /** USCIS premium processing SLA for I-140 NIW (EB-2) and EB-1C. */
  i140Niweb1cPremiumProcessingBusinessDays: number;
  /** Standard (non-premium) I-140 adjudication estimate, low bound (months). */
  standardI140EstimateMonthsLow: number;
  /** Standard (non-premium) I-140 adjudication estimate, high bound (months). */
  standardI140EstimateMonthsHigh: number;

  /* --- General planning ranges used when an official queue value is missing --- */
  /** PWD determination, general planning range (months). */
  pwdPlanningMonthsLow: number;
  pwdPlanningMonthsHigh: number;
  /** PERM analyst decision after filing, general planning range (months). */
  permAnalystPlanningMonthsLow: number;
  permAnalystPlanningMonthsHigh: number;
  /** Additional time when a PERM is audited, general planning range (months). */
  permAuditPlanningMonthsLow: number;
  permAuditPlanningMonthsHigh: number;
}

/**
 * Current working data. Monthly queue months start as NEEDS_UPDATE on purpose:
 * they must be copied from FLAG before they can be shown as confirmed. The
 * numeric planning inputs are stable rule-of-thumb defaults you rarely change.
 */
export const permProcessingData: PermProcessingData = {
  lastUpdated: "Pending first monthly update — pull from DOL FLAG",
  dolSourceUrl: "https://flag.dol.gov/processingtimes",

  // Monthly FLAG queue snapshots — replace each NEEDS_UPDATE with the current
  // "processing cases filed in <MONTH YEAR>" value from the FLAG dashboard.
  pwdPermOewsReceiptMonth: NEEDS_UPDATE,
  pwdPermNonOewsReceiptMonth: NEEDS_UPDATE,
  permAnalystReviewPriorityDate: NEEDS_UPDATE,
  permAuditReviewPriorityDate: NEEDS_UPDATE,
  permReconsiderationDate: NEEDS_UPDATE,

  // Published averages — null until copied from FLAG.
  averagePermAnalystReviewDays: null,
  averagePermAuditReviewDays: null,

  // Rule-based / stable inputs.
  recruitmentMinimumDays: 60,
  recruitmentTypicalDays: 90,
  i140PremiumProcessingBusinessDays: 15,
  i140Niweb1cPremiumProcessingBusinessDays: 45,
  standardI140EstimateMonthsLow: 4,
  standardI140EstimateMonthsHigh: 8,

  // General planning ranges (labelled as estimates on-page).
  pwdPlanningMonthsLow: 4,
  pwdPlanningMonthsHigh: 8,
  permAnalystPlanningMonthsLow: 12,
  permAnalystPlanningMonthsHigh: 18,
  permAuditPlanningMonthsLow: 6,
  permAuditPlanningMonthsHigh: 12,
};

/** True when a monthly FLAG string field still holds the sentinel. */
export function isPending(value: string): boolean {
  return value === NEEDS_UPDATE;
}

/** Display helper: a confirmed value, or the friendly "update" prompt. */
export function displayValue(value: string): string {
  return isPending(value) ? NEEDS_UPDATE : value;
}

/** Display helper for the numeric average-days fields. */
export function displayDays(value: number | null): string {
  return value == null ? NEEDS_UPDATE : `${value} days`;
}

/** Standard educational data-source note shown on every page using this data. */
export const DOL_DATA_NOTE =
  "Data source: U.S. Department of Labor FLAG Processing Times. Processing dates can change monthly and may not reflect every individual case.";
