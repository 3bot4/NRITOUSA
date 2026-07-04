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

/* ─────────────── PERM stage planning estimate (Fast Answer) ─────────────── */

/**
 * General, rule-of-thumb planning ranges for the whole PERM → I-140 path, shown
 * as the top "Fast Answer" on the PERM cluster pages. These are planning
 * estimates (clearly labelled), NOT the official current FLAG queue — that lives
 * in the NEEDS_UPDATE fields above. Verify against DOL FLAG before relying on
 * any figure. lastVerified: 2026-07-04.
 */
export const PERM_ESTIMATE_VERIFIED = "2026-07-04";

export interface PermEstimateRow {
  stage: string;
  estimatedTime: string;
  whatToCheck?: string;
  notes?: string;
  highlight?: boolean;
}

export const permStageEstimateRows: PermEstimateRow[] = [
  { stage: "Prevailing Wage (PWD)", estimatedTime: "5–7 months", whatToCheck: "DOL FLAG PWD queue", notes: "Filed with DOL before recruitment; timing varies by wage source." },
  { stage: "Recruitment + quiet period", estimatedTime: "2–3 months", whatToCheck: "Ad run dates + 30-day quiet period", notes: "Employer-run; includes the mandatory 30-day wait after ads." },
  { stage: "PERM analyst review", estimatedTime: "12–16 months", whatToCheck: "DOL FLAG analyst-review queue", notes: "Depends on the DOL queue; no premium processing for PERM." },
  { stage: "PERM audit (if selected)", estimatedTime: "+6–12+ months", whatToCheck: "Audit notice + response deadline", notes: "Only if audited; adds substantial time on top of analyst review." },
  { stage: "Total to PERM approval — no audit", estimatedTime: "~20–26 months", notes: "PWD + recruitment + analyst review, planning range.", highlight: true },
  { stage: "Total to PERM approval — with audit", estimatedTime: "~26–36+ months", notes: "When the case is audited." },
  { stage: "I-140 after PERM", estimatedTime: "Premium 15 business days; regular ~4–8 months", whatToCheck: "USCIS Processing Times / I-907", notes: "Premium processing may be available depending on category." },
];

/** Convenience source links for the PERM Fast Answer. */
export const permEstimateSourceLinks: { label: string; href: string }[] = [
  { label: "DOL FLAG Processing Times", href: "https://flag.dol.gov/processingtimes" },
  { label: "USCIS Processing Times", href: "https://egov.uscis.gov/processing-times/" },
  { label: "Visa Bulletin", href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" },
];

export const PERM_ESTIMATE_DISCLAIMER =
  "General planning ranges only — the official current queue is on DOL FLAG and changes monthly. PERM has no premium processing. Not legal advice; verify with official sources before relying on any date.";
