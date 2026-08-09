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

import { i140ProcessingData } from "./i140ProcessingData";

/** Sentinel: a monthly FLAG value that has not been confirmed yet. */
export const NEEDS_UPDATE = "Update from DOL FLAG" as const;

/**
 * Sentinel: DOL itself publishes no figure for this field. Distinct from
 * NEEDS_UPDATE — "we haven't copied it yet" is our backlog and deserves a
 * warning badge; "the source doesn't publish it" is a fact about DOL and must
 * not be shown as if the page were stale. Bumping lastUpdated will never
 * clear one of these.
 */
export const NOT_PUBLISHED = "Not published by DOL" as const;

/** A FLAG "average days" figure: a number, not-yet-copied, or not published. */
export type FlagDays = number | null | typeof NOT_PUBLISHED;

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
  averagePermAnalystReviewDays: FlagDays;
  averagePermAuditReviewDays: FlagDays;

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
 * Current working data. Monthly queue months are copied by hand from the DOL
 * FLAG dashboard; any field not yet confirmed there stays NEEDS_UPDATE / null
 * rather than being guessed. The numeric planning inputs below are stable
 * rule-of-thumb defaults you rarely change.
 */
export const permProcessingData: PermProcessingData = {
  lastUpdated: "August 2026 (FLAG dashboard data as of Aug 7, 2026)",
  dolSourceUrl: "https://flag.dol.gov/processingtimes",

  // Monthly FLAG queue snapshots — replace each with the current
  // "processing cases filed in <MONTH YEAR>" value from the FLAG dashboard.
  pwdPermOewsReceiptMonth: "April 2026",
  pwdPermNonOewsReceiptMonth: "March 2026",
  permAnalystReviewPriorityDate: "September 2025",
  permAuditReviewPriorityDate: "December 2025",
  permReconsiderationDate: "March 2026",

  // Published averages. DOL shows no average for audit review on the FLAG
  // dashboard at all, so that field is NOT_PUBLISHED, not null — it is not a
  // gap in our data and no monthly update will ever fill it.
  averagePermAnalystReviewDays: 372,
  averagePermAuditReviewDays: NOT_PUBLISHED,

  // Rule-based / stable inputs.
  recruitmentMinimumDays: 60,
  recruitmentTypicalDays: 90,
  i140PremiumProcessingBusinessDays: 15,
  i140Niweb1cPremiumProcessingBusinessDays: 45,
  // Mirrored from i140ProcessingData so the PERM pages and the I-140 cluster
  // can never quote different I-140 ranges (they used to: 4–8 here vs. the
  // I-140 cluster's own figures).
  standardI140EstimateMonthsLow: i140ProcessingData.standardMonthsLow,
  standardI140EstimateMonthsHigh: i140ProcessingData.standardMonthsHigh,

  // General planning ranges (labelled as estimates on-page).
  pwdPlanningMonthsLow: 4,
  pwdPlanningMonthsHigh: 8,
  permAnalystPlanningMonthsLow: 12,
  permAnalystPlanningMonthsHigh: 16,
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
export function displayDays(value: FlagDays): string {
  if (value === NOT_PUBLISHED) return NOT_PUBLISHED;
  return value == null ? NEEDS_UPDATE : `${value} days`;
}

/**
 * True only when a figure is genuinely missing from our data — i.e. it should
 * carry an "update me" warning. NOT_PUBLISHED is deliberately excluded.
 */
export function isPendingDays(value: FlagDays): boolean {
  return value == null;
}

/** Standard educational data-source note shown on every page using this data. */
export const DOL_DATA_NOTE =
  "Data source: U.S. Department of Labor FLAG Processing Times. Processing dates can change monthly and may not reflect every individual case.";

/* ─────────────── PERM stage planning estimate (Fast Answer) ─────────────── */

/**
 * General, rule-of-thumb planning ranges for the whole PERM → I-140 path, shown
 * as the top "Fast Answer" on the PERM cluster pages. These are planning
 * estimates (clearly labelled), NOT the official current FLAG queue — that
 * lives in the monthly snapshot fields above. Verify against DOL FLAG before
 * relying on any figure. lastVerified: 2026-08-09, reconciled against the FLAG
 * dashboard as of Aug 7, 2026 (analyst review averaging 372 days ≈ 12.2 months,
 * which sits at the low end of the 12–16 month planning band).
 */
export const PERM_ESTIMATE_VERIFIED = "2026-08-09";

export interface PermEstimateRow {
  stage: string;
  estimatedTime: string;
  whatToCheck?: string;
  notes?: string;
  highlight?: boolean;
}

const D = permProcessingData;

/** Months the recruitment + mandatory 30-day quiet period realistically takes. */
const RECRUITMENT_MONTHS_LOW = Math.round(D.recruitmentMinimumDays / 30);
const RECRUITMENT_MONTHS_HIGH = Math.round(D.recruitmentTypicalDays / 30);

const noAuditTotalLow =
  D.pwdPlanningMonthsLow + RECRUITMENT_MONTHS_LOW + D.permAnalystPlanningMonthsLow;
const noAuditTotalHigh =
  D.pwdPlanningMonthsHigh + RECRUITMENT_MONTHS_HIGH + D.permAnalystPlanningMonthsHigh;

/**
 * The canonical rendered PERM ranges, derived from the planning constants
 * above — never hand-typed. A previous version hard-coded "12–16 months" in
 * the stage table while the constant said 12–18, and the two silently
 * disagreed on the same page. Change the constant, not the string.
 *
 * `siteWideVerifiedNumbers.permNumbers` must quote these verbatim; that is
 * enforced by verifiedNumbers.consistency.test.ts.
 */
export const permDerivedRanges = {
  pwd: `${D.pwdPlanningMonthsLow}–${D.pwdPlanningMonthsHigh} months`,
  recruitment: `${RECRUITMENT_MONTHS_LOW}–${RECRUITMENT_MONTHS_HIGH} months`,
  analystReview: `${D.permAnalystPlanningMonthsLow}–${D.permAnalystPlanningMonthsHigh} months`,
  audit: `${D.permAuditPlanningMonthsLow}–${D.permAuditPlanningMonthsHigh}+ months`,
  totalNoAudit: `${noAuditTotalLow}–${noAuditTotalHigh} months`,
  totalWithAudit: `${noAuditTotalLow + D.permAuditPlanningMonthsLow}–${noAuditTotalHigh + D.permAuditPlanningMonthsHigh}+ months`,
  i140AfterPerm: `${D.standardI140EstimateMonthsLow}–${D.standardI140EstimateMonthsHigh} months`,
} as const;

export const permStageEstimateRows: PermEstimateRow[] = [
  { stage: "Prevailing Wage (PWD)", estimatedTime: permDerivedRanges.pwd, whatToCheck: "DOL FLAG PWD queue", notes: "Filed with DOL before recruitment; timing varies by wage source." },
  { stage: "Recruitment + quiet period", estimatedTime: permDerivedRanges.recruitment, whatToCheck: "Ad run dates + 30-day quiet period", notes: "Employer-run; includes the mandatory 30-day wait after ads." },
  { stage: "PERM analyst review", estimatedTime: permDerivedRanges.analystReview, whatToCheck: "DOL FLAG analyst-review queue", notes: "Depends on the DOL queue; no premium processing for PERM." },
  { stage: "PERM audit (if selected)", estimatedTime: `+${permDerivedRanges.audit}`, whatToCheck: "Audit notice + response deadline", notes: "Only if audited; adds substantial time on top of analyst review." },
  { stage: "Total to PERM approval — no audit", estimatedTime: `~${permDerivedRanges.totalNoAudit}`, notes: "PWD + recruitment + analyst review, planning range.", highlight: true },
  { stage: "Total to PERM approval — with audit", estimatedTime: `~${permDerivedRanges.totalWithAudit}`, notes: "When the case is audited." },
  { stage: "I-140 after PERM", estimatedTime: `Premium ${D.i140PremiumProcessingBusinessDays} business days; regular ~${permDerivedRanges.i140AfterPerm}`, whatToCheck: "USCIS Processing Times / I-907", notes: "Premium processing may be available depending on category." },
];

/** Convenience source links for the PERM Fast Answer. */
export const permEstimateSourceLinks: { label: string; href: string }[] = [
  { label: "DOL FLAG Processing Times", href: "https://flag.dol.gov/processingtimes" },
  { label: "USCIS Processing Times", href: "https://egov.uscis.gov/processing-times/" },
  { label: "Visa Bulletin", href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" },
];

export const PERM_ESTIMATE_DISCLAIMER =
  "General planning ranges only — the official current queue is on DOL FLAG and changes monthly. PERM has no premium processing. Not legal advice; verify with official sources before relying on any date.";
