/**
 * Typed access + estimation math for the visa bulletin data under
 * /data/visa-bulletin. Pure functions only — safe to import from client
 * components. Data refresh procedure: docs/DATA-UPDATE-PLAYBOOK.md.
 *
 * Estimation methodology (deliberately honest):
 *   wait = months your priority date is behind the current Final Action Date,
 *   projected forward at the average monthly advancement of that cutoff over
 *   the trailing 24–36 months. We always output a RANGE, never a single date,
 *   and we say plainly when a category is stalled or retrogressing.
 */

import currentData from "../../data/visa-bulletin/current.json";
import historyData from "../../data/visa-bulletin/history.json";

export type EbCategory = "eb1" | "eb2" | "eb3" | "eb5";
export type BulletinCountry = "india" | "china" | "row";

/** A cutoff is an ISO date "YYYY-MM-DD" or "C" (Current — no backlog). */
export type Cutoff = string;

export interface CategoryCutoffs {
  fad: Cutoff;
  dff: Cutoff;
  fadTodo?: boolean;
  dffTodo?: boolean;
}

export type SeriesPoint = [bulletinMonth: string, cutoff: Cutoff];

export const CATEGORY_LABELS: Record<EbCategory, string> = {
  eb1: "EB-1 (extraordinary ability / multinational managers)",
  eb2: "EB-2 (advanced degree / exceptional ability)",
  eb3: "EB-3 (skilled workers / professionals)",
  eb5: "EB-5 (investors, unreserved)",
};

export const CATEGORY_SHORT: Record<EbCategory, string> = {
  eb1: "EB-1",
  eb2: "EB-2",
  eb3: "EB-3",
  eb5: "EB-5",
};

export const COUNTRY_LABELS: Record<BulletinCountry, string> = {
  india: "India",
  china: "China (mainland)",
  row: "All other countries",
};

export const bulletin = {
  month: currentData.bulletinMonth,
  lastUpdated: currentData.lastUpdated,
  source: currentData.source,
  sourceLabel: currentData.sourceLabel,
};

/**
 * MANUALLY MAINTAINED point-in-time note about the current bulletin's movement
 * direction. Single source of truth — surfaced on /visa-bulletin,
 * /tools/priority-date-checker, /green-card, and the immigration tracker.
 * Update (or clear) this whenever a new bulletin is configured.
 */
export const currentBulletinNote =
  "August 2026 Visa Bulletin: EB-1 India holds at Oct 15, 2022 (unchanged from July). EB-2 India is Unavailable for the remainder of FY 2026. EB-3 India holds at Jan 1, 2014. EB-5 India Unreserved is also Unavailable; EB-5 set-aside categories (Rural, High Unemployment, Infrastructure) remain Current. USCIS is using Final Action Dates for employment-based adjustment filings this month. Always verify with the official Department of State Visa Bulletin.";

/**
 * Short, consistent alert headline used by the reusable <VisaBulletinAlert />
 * component across visa-bulletin pages, the priority date checker, the green
 * card tracker, and the USCIS hub. Update this each bulletin alongside the data
 * files. Single source of truth for the standing alert wording.
 */
export const bulletinAlert =
  "EB-2 India and EB-5 India Unreserved are Unavailable for the remainder of FY 2026. EB-1 India holds at October 15, 2022. EB-3 India holds at January 1, 2014. For August 2026 employment-based adjustment of status, use Final Action Dates.";

export function getCutoffs(
  category: EbCategory,
  country: BulletinCountry
): CategoryCutoffs {
  const cats = currentData.categories as Record<
    string,
    Record<string, CategoryCutoffs>
  >;
  return cats[category][country];
}

/* ---------------------------- EB-5 set-asides ---------------------------- */

/** The three reserved EB-5 set-aside categories (separate from Unreserved). */
export type Eb5SetAside = "rural" | "highUnemployment" | "infrastructure";

export const EB5_SETASIDE_LABELS: Record<Eb5SetAside, string> = {
  rural: "Rural (20% set-aside)",
  highUnemployment: "High Unemployment (10% set-aside)",
  infrastructure: "Infrastructure (2% set-aside)",
};

export const EB5_SETASIDE_ORDER: Eb5SetAside[] = [
  "rural",
  "highUnemployment",
  "infrastructure",
];

const eb5SetAsideData = (currentData as { eb5SetAsides?: Record<
  string,
  Record<string, CategoryCutoffs>
> }).eb5SetAsides;

/**
 * Final Action / Dates for Filing for an EB-5 reserved set-aside category.
 * Returns null only if the data file predates set-aside support.
 */
export function getEb5SetAside(
  setAside: Eb5SetAside,
  country: BulletinCountry
): CategoryCutoffs | null {
  return eb5SetAsideData?.[setAside]?.[country] ?? null;
}

export function getSeries(
  category: EbCategory,
  country: BulletinCountry
): { fad: SeriesPoint[]; dff: SeriesPoint[] } | null {
  if (country === "row") return null; // ROW has been Current throughout
  const series = historyData.series as unknown as Record<
    string,
    { fad: SeriesPoint[]; dff: SeriesPoint[] }
  >;
  return series[`${category}-${country}`] ?? null;
}

/* ------------------------- date / month helpers ------------------------- */

export const isCurrent = (cutoff: Cutoff) => cutoff === "C";

/** True when a visa bulletin cutoff value means "no numbers available this month". */
export const isUnavailableVisaValue = (value: string): boolean => value === "U";

/**
 * True when the value is a parseable ISO cutoff date (not "C", not "U", not invalid).
 * Use before passing a cutoff to new Date(), differenceInYears, or sort comparisons.
 */
export function isValidVisaDate(value: string): boolean {
  if (value === "C" || value === "U") return false;
  const parts = value.split("-").map(Number);
  return parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1]);
}

/** "2026-06" or "2013-09-01" → months since year 0 (day adds a fraction). */
export function monthIndex(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return y * 12 + (m - 1) + (d ? (d - 1) / 30 : 0);
}

const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatCutoff(cutoff: Cutoff): string {
  if (isCurrent(cutoff)) return "Current";
  if (cutoff === "U") return "Unavailable";
  const [y, m, d] = cutoff.split("-").map(Number);
  return d ? `${MONTHS_ABBR[m - 1]} ${d}, ${y}` : `${MONTHS_ABBR[m - 1]} ${y}`;
}

export function formatMonths(months: number): string {
  if (months < 12) return `${Math.round(months)} months`;
  const years = months / 12;
  return years >= 10 ? `${Math.round(years)} years` : `${years.toFixed(1)} years`;
}

/* ----------------------------- velocity math ---------------------------- */

/**
 * Average advancement of a cutoff series in cutoff-months per calendar month
 * over the trailing window. Uses the step-function value at the window edges,
 * so holds count as zero movement and retrogressions count as negative.
 * Returns null when the series is empty or Current inside the window.
 */
export function velocity(
  points: SeriesPoint[],
  trailingMonths = 30,
  asOf = bulletin.month
): number | null {
  if (!points.length) return null;
  const end = monthIndex(asOf);
  const start = end - trailingMonths;

  const valueAt = (mi: number): Cutoff | null => {
    let v: Cutoff | null = null;
    for (const [ym, cutoff] of points) {
      if (monthIndex(ym) > mi) break;
      v = cutoff;
    }
    return v;
  };

  const b = valueAt(end);
  if (!b || isCurrent(b) || isUnavailableVisaValue(b)) return null;

  let a = valueAt(start) ?? points[0][1];
  let anchor = Math.max(start, monthIndex(points[0][0]));
  if (isCurrent(a) || isUnavailableVisaValue(a)) {
    // Series was Current/Unavailable at the window start — anchor at the first
    // valid dated cutoff inside the window instead.
    const firstDated = points.find(
      ([ym, cutoff]) => monthIndex(ym) >= start && isValidVisaDate(cutoff)
    );
    if (!firstDated) return null;
    a = firstDated[1];
    anchor = monthIndex(firstDated[0]);
  }

  const elapsed = end - anchor;
  if (elapsed <= 0) return null;
  return (monthIndex(b) - monthIndex(a)) / elapsed;
}

/** True when the cutoff moved backwards within the trailing 12 months. */
export function isRetrogressing(points: SeriesPoint[]): boolean {
  const v = velocity(points, 12);
  return v !== null && v < -0.01;
}

/* ------------------------------ estimation ------------------------------ */

export type EstimateStatus =
  | "current" // priority date is before the FAD — final action is possible now
  | "estimate" // normal case: a projected range applies
  | "stalled" // cutoff barely moving — no meaningful projection
  | "retrogressing" // cutoff moved backwards recently
  | "unavailable" // FAD is "U" — no visa numbers available this month
  | "no-data"; // not enough history to project

export interface WaitEstimate {
  status: EstimateStatus;
  category: EbCategory;
  country: BulletinCountry;
  fad: Cutoff;
  dff: Cutoff;
  /** Months the priority date is behind the current Final Action Date. */
  monthsBehind: number;
  /** Whether an I-485 could be filed now under Dates for Filing. */
  canFileI485: boolean;
  /** Avg cutoff advancement, cutoff-months per calendar month (trailing ~30mo). */
  velocityPerMonth: number | null;
  /** Projected wait range in months from today (optimistic, pessimistic). */
  optimisticMonths: number | null;
  pessimisticMonths: number | null;
  /** Pessimistic bound hit the display cap (">25 years at current pace"). */
  capped: boolean;
}

/** Pessimistic projections beyond this are shown as "25+ years". */
export const ESTIMATE_CAP_MONTHS = 300;

/** Velocity below this (months of movement per month) counts as stalled. */
const STALLED_VELOCITY = 0.12;

export function estimateWait(
  priorityDate: string,
  category: EbCategory,
  country: BulletinCountry
): WaitEstimate {
  const { fad, dff } = getCutoffs(category, country);
  const base: WaitEstimate = {
    status: "no-data",
    category,
    country,
    fad,
    dff,
    monthsBehind: 0,
    canFileI485: false,
    velocityPerMonth: null,
    optimisticMonths: null,
    pessimisticMonths: null,
    capped: false,
  };

  // Category/country has no visa numbers this month.
  if (fad === "U") {
    return { ...base, status: "unavailable" };
  }

  // Filing eligibility under Dates for Filing (when USCIS accepts that chart).
  base.canFileI485 =
    dff !== "U" && (isCurrent(dff) || monthIndex(priorityDate) < monthIndex(dff));

  if (isCurrent(fad) || monthIndex(priorityDate) < monthIndex(fad)) {
    return { ...base, status: "current" };
  }

  base.monthsBehind = monthIndex(priorityDate) - monthIndex(fad);

  const series = getSeries(category, country);
  if (!series || !series.fad.length) return base;

  if (isRetrogressing(series.fad)) {
    return {
      ...base,
      status: "retrogressing",
      velocityPerMonth: velocity(series.fad, 12),
    };
  }

  const v = velocity(series.fad, 30);
  base.velocityPerMonth = v;
  if (v === null) return base;
  if (v < STALLED_VELOCITY) return { ...base, status: "stalled" };

  // Range: assume future movement between 0.75× and 1.5× the trailing average.
  const optimistic = base.monthsBehind / (v * 1.5);
  const pessimistic = base.monthsBehind / (v * 0.75);
  return {
    ...base,
    status: "estimate",
    optimisticMonths: optimistic,
    pessimisticMonths: Math.min(pessimistic, ESTIMATE_CAP_MONTHS),
    capped: pessimistic > ESTIMATE_CAP_MONTHS,
  };
}

/* ------------------------------ chart data ------------------------------ */

/**
 * Expand a sparse change-point series into one value per month for charting.
 * "C" months and months before the first point are returned as null.
 */
export function expandSeries(
  points: SeriesPoint[],
  from?: string,
  to = bulletin.month
): { month: string; value: number | null }[] {
  if (!points.length) return [];
  const start = monthIndex(from ?? points[0][0]);
  const end = monthIndex(to);
  const out: { month: string; value: number | null }[] = [];
  for (let mi = Math.floor(start); mi <= end; mi++) {
    const month = `${Math.floor(mi / 12)}-${String((mi % 12) + 1).padStart(2, "0")}`;
    let v: Cutoff | null = null;
    for (const [ym, cutoff] of points) {
      if (monthIndex(ym) > mi) break;
      v = cutoff;
    }
    out.push({ month, value: v && isValidVisaDate(v) ? monthIndex(v) : null });
  }
  return out;
}

/* --------------------- month label + applicable chart -------------------- */

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Human label for a "YYYY-MM" bulletin month, e.g. "July 2026". */
export function formatBulletinMonth(ym: string = bulletin.month): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS_FULL[m - 1]} ${y}`;
}

/** The current bulletin month label, e.g. "July 2026". */
export function getBulletinLabel(): string {
  return formatBulletinMonth(bulletin.month);
}

export type AdjustmentChart = "final-action" | "dates-for-filing";

export interface ApplicableChart {
  chart: AdjustmentChart;
  /** Short label, e.g. "Final Action Dates". */
  label: string;
  /** True when USCIS is accepting Dates for Filing (Table B) for AOS this month. */
  usingDatesForFiling: boolean;
}

/**
 * Which USCIS Adjustment of Status filing chart applies this month. Single
 * source of truth: `adjustmentOfStatusChart` in current.json. USCIS announces
 * this each month at uscis.gov/visabulletininfo; update the JSON alongside the
 * cutoff data. Defaults to Final Action Dates when the field is absent.
 */
export function getApplicableChart(): ApplicableChart {
  const chart =
    (currentData as { adjustmentOfStatusChart?: AdjustmentChart })
      .adjustmentOfStatusChart ?? "final-action";
  return {
    chart,
    label:
      chart === "dates-for-filing" ? "Dates for Filing" : "Final Action Dates",
    usingDatesForFiling: chart === "dates-for-filing",
  };
}

/** Official U.S. Department of State Visa Bulletin landing page. */
export const DOS_VISA_BULLETIN_URL =
  "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html";

/** Official USCIS Adjustment of Status Filing Charts page. */
export const USCIS_FILING_CHART_URL =
  "https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin";

/* --------------------------- month-over-month ---------------------------- */

/** Step-function value of a change-point series at a given month index. */
function seriesValueAt(points: SeriesPoint[], mi: number): Cutoff | null {
  let v: Cutoff | null = null;
  for (const [ym, cutoff] of points) {
    if (monthIndex(ym) > mi) break;
    v = cutoff;
  }
  return v;
}

export type MovementStatus =
  | "current" // FAD is "C" — no backlog
  | "unavailable" // FAD is "U" — no visa numbers this month
  | "advanced" // cutoff moved forward vs. last month
  | "no-movement" // cutoff held (moved less than ~1 day)
  | "retrogressed" // cutoff moved backward vs. last month
  | "unknown"; // no comparable prior-month data

export interface CategoryMovement {
  status: MovementStatus;
  category: EbCategory;
  country: BulletinCountry;
  /** Current-month Final Action Date (raw cutoff). */
  currentFad: Cutoff;
  /** Current-month Dates for Filing (raw cutoff). */
  currentDff: Cutoff;
  /** Prior-month Final Action Date, or null when unknown. */
  priorFad: Cutoff | null;
  /** Whole months the FAD moved (+ forward, − backward). Null when N/A. */
  monthsMoved: number | null;
  currentMonthLabel: string;
  priorMonthLabel: string;
}

/**
 * Month-over-month movement of a category's Final Action Date, computed from the
 * centralized history series — never a hand-written note, so every page shows
 * the same movement. "C"/"U" values are classified as current/unavailable rather
 * than run through date math (movement is meaningless for those states).
 */
export function getMovement(
  category: EbCategory,
  country: BulletinCountry
): CategoryMovement {
  const { fad, dff } = getCutoffs(category, country);
  const currentMi = monthIndex(bulletin.month);
  const priorMi = currentMi - 1;
  const priorMonthYm = `${Math.floor(priorMi / 12)}-${String(
    (priorMi % 12) + 1
  ).padStart(2, "0")}`;

  const base: CategoryMovement = {
    status: "unknown",
    category,
    country,
    currentFad: fad,
    currentDff: dff,
    priorFad: null,
    monthsMoved: null,
    currentMonthLabel: formatBulletinMonth(bulletin.month),
    priorMonthLabel: formatBulletinMonth(priorMonthYm),
  };

  if (isCurrent(fad)) return { ...base, status: "current" };
  if (isUnavailableVisaValue(fad)) return { ...base, status: "unavailable" };

  const series = getSeries(category, country);
  const prior = series ? seriesValueAt(series.fad, priorMi) : null;
  base.priorFad = prior;

  if (!prior || !isValidVisaDate(prior)) {
    // Prior month was Current, Unavailable, or has no data. If it was
    // Unavailable and there is now a dated cutoff, numbers returned (forward);
    // if it was Current and there is now a cutoff, the category retrogressed.
    if (prior === "U") return { ...base, status: "advanced" };
    if (prior === "C") return { ...base, status: "retrogressed" };
    return { ...base, status: "unknown" };
  }

  const moved = monthIndex(fad) - monthIndex(prior);
  base.monthsMoved = moved;
  if (moved > 0.03) return { ...base, status: "advanced" };
  if (moved < -0.03) return { ...base, status: "retrogressed" };
  return { ...base, status: "no-movement" };
}

/* ==========================================================================
 * EXTENDED CATEGORIES — full matrix (employment "Other Workers"/EB-4, all
 * five family-sponsored categories, Mexico/Philippines) added for the Green
 * Card Queue Tracker rebuild, backed by the 2021-08–2026-07 re-verified
 * dataset (see data/visa-bulletin/_verified-backfill/). Kept as new,
 * separate types/functions rather than widening EbCategory/BulletinCountry
 * above — those are relied on by ~12 existing pages/components with
 * non-nullable Cutoff assumptions that don't hold for the newer, sparser
 * data (some cells are genuinely unverified, not just "C"/"U").
 * ========================================================================== */

export type ExtendedCategory =
  | EbCategory
  | "eb3Other"
  | "eb4"
  | "f1"
  | "f2a"
  | "f2b"
  | "f3"
  | "f4";

export type ExtendedCountry = BulletinCountry | "mexico" | "philippines";

/** A cutoff that may be genuinely unverified — render as "—", never guess. */
export type MaybeCutoff = Cutoff | null;

export interface ExtendedCutoffs {
  fad: MaybeCutoff;
  dff: MaybeCutoff;
}

const EMPLOYMENT_EXTENDED = new Set<ExtendedCategory>([
  "eb1",
  "eb2",
  "eb3",
  "eb3Other",
  "eb4",
  "eb5",
]);

export const isEmploymentCategory = (category: ExtendedCategory): boolean =>
  EMPLOYMENT_EXTENDED.has(category);

export const EXTENDED_CATEGORY_SHORT: Record<ExtendedCategory, string> = {
  eb1: "EB-1",
  eb2: "EB-2",
  eb3: "EB-3",
  eb3Other: "EB-3 (Other Workers)",
  eb4: "EB-4",
  eb5: "EB-5",
  f1: "F-1",
  f2a: "F-2A",
  f2b: "F-2B",
  f3: "F-3",
  f4: "F-4",
};

export const EXTENDED_CATEGORY_LABELS: Record<ExtendedCategory, string> = {
  eb1: "EB-1 (extraordinary ability / multinational managers)",
  eb2: "EB-2 (advanced degree / exceptional ability)",
  eb3: "EB-3 (skilled workers / professionals)",
  eb3Other: "EB-3 Other Workers (unskilled, less than 2 yrs training)",
  eb4: "EB-4 (special immigrants, incl. certain religious workers)",
  eb5: "EB-5 (investors, unreserved)",
  f1: "F-1 (unmarried sons/daughters, 21+, of U.S. citizens)",
  f2a: "F-2A (spouses & minor children of green card holders)",
  f2b: "F-2B (unmarried adult sons/daughters of green card holders)",
  f3: "F-3 (married sons/daughters of U.S. citizens)",
  f4: "F-4 (siblings of adult U.S. citizens)",
};

export const EXTENDED_COUNTRY_LABELS: Record<ExtendedCountry, string> = {
  india: "India",
  china: "China (mainland)",
  mexico: "Mexico",
  philippines: "Philippines",
  row: "All other countries",
};

export const EXTENDED_CATEGORIES: ExtendedCategory[] = [
  "eb1",
  "eb2",
  "eb3",
  "eb3Other",
  "eb4",
  "eb5",
  "f1",
  "f2a",
  "f2b",
  "f3",
  "f4",
];

export const EXTENDED_COUNTRIES: ExtendedCountry[] = [
  "india",
  "china",
  "mexico",
  "philippines",
  "row",
];

interface ExtendedCurrentData {
  categories: Record<string, Record<string, ExtendedCutoffs>>;
  family: Record<string, Record<string, ExtendedCutoffs>>;
}

/** Current-month cutoffs for the full category x country matrix. `null` = not verified — render "—", never guess. */
export function getExtendedCutoffs(
  category: ExtendedCategory,
  country: ExtendedCountry
): ExtendedCutoffs {
  const data = currentData as unknown as ExtendedCurrentData;
  const bucket = isEmploymentCategory(category) ? data.categories : data.family;
  return bucket?.[category]?.[country] ?? { fad: null, dff: null };
}

/** Historical change-point series for the full category x country matrix. Same sparse-point shape/semantics as getSeries(). */
export function getExtendedSeries(
  category: ExtendedCategory,
  country: ExtendedCountry
): { fad: SeriesPoint[]; dff: SeriesPoint[] } | null {
  const series = historyData.series as unknown as Record<
    string,
    { fad: SeriesPoint[]; dff: SeriesPoint[] }
  >;
  return series[`${category}-${country}`] ?? null;
}

/** Which chart (Final Action Dates or Dates for Filing) a computation should use as its basis. */
export type ChartKind = "fad" | "dff";

export interface ExtendedWaitEstimate {
  status: EstimateStatus;
  category: ExtendedCategory;
  country: ExtendedCountry;
  chart: ChartKind;
  cutoff: MaybeCutoff;
  fad: MaybeCutoff;
  dff: MaybeCutoff;
  monthsBehind: number;
  canFileI485: boolean;
  velocityPerMonth: number | null;
  optimisticMonths: number | null;
  pessimisticMonths: number | null;
  capped: boolean;
}

/** Same methodology as estimateWait(), generalized to the full category/country matrix, either chart, and honest about unverified data. */
export function extendedEstimateWait(
  priorityDate: string,
  category: ExtendedCategory,
  country: ExtendedCountry,
  chart: ChartKind = "fad",
  trailingMonths = 30
): ExtendedWaitEstimate {
  const { fad, dff } = getExtendedCutoffs(category, country);
  const cutoff = chart === "fad" ? fad : dff;
  const base: ExtendedWaitEstimate = {
    status: "no-data",
    category,
    country,
    chart,
    cutoff,
    fad,
    dff,
    monthsBehind: 0,
    canFileI485: false,
    velocityPerMonth: null,
    optimisticMonths: null,
    pessimisticMonths: null,
    capped: false,
  };

  if (cutoff === null) return base; // unverified for this cell — "no-data", never guessed
  if (cutoff === "U") return { ...base, status: "unavailable" };

  base.canFileI485 =
    dff !== null &&
    dff !== "U" &&
    (isCurrent(dff) || monthIndex(priorityDate) < monthIndex(dff));

  if (isCurrent(cutoff) || monthIndex(priorityDate) < monthIndex(cutoff)) {
    return { ...base, status: "current" };
  }

  base.monthsBehind = monthIndex(priorityDate) - monthIndex(cutoff);

  const series = getExtendedSeries(category, country);
  const points = series ? series[chart] : null;
  if (!points || !points.length) return base;

  if (isRetrogressing(points)) {
    return {
      ...base,
      status: "retrogressing",
      velocityPerMonth: velocity(points, 12),
    };
  }

  const v = velocity(points, trailingMonths);
  base.velocityPerMonth = v;
  if (v === null) return base;
  if (v < STALLED_VELOCITY) return { ...base, status: "stalled" };

  const optimistic = base.monthsBehind / (v * 1.5);
  const pessimistic = base.monthsBehind / (v * 0.75);
  return {
    ...base,
    status: "estimate",
    optimisticMonths: optimistic,
    pessimisticMonths: Math.min(pessimistic, ESTIMATE_CAP_MONTHS),
    capped: pessimistic > ESTIMATE_CAP_MONTHS,
  };
}

/**
 * Project a wait using an explicit pace (cutoff-months advanced per calendar
 * month) rather than the auto-selected trailing window — powers the pace
 * scenario buttons (recent / long-run / 1.5x / 0.4x). Returns null months
 * when the pace is zero or negative (no honest forward projection).
 */
export function projectWithPace(
  monthsBehind: number,
  paceMonthsPerMonth: number
): { months: number | null; capped: boolean } {
  if (monthsBehind <= 0 || paceMonthsPerMonth <= 0) return { months: null, capped: false };
  const months = monthsBehind / paceMonthsPerMonth;
  return { months: Math.min(months, ESTIMATE_CAP_MONTHS), capped: months > ESTIMATE_CAP_MONTHS };
}

/** Count how many of the trailing N bulletin months were a retrogression for this category/country/chart. */
export function countRetrogressionMonths(
  category: ExtendedCategory,
  country: ExtendedCountry,
  chart: ChartKind = "fad",
  trailingMonths = 60
): number {
  const series = getExtendedSeries(category, country);
  const points = series ? series[chart] : null;
  if (!points || !points.length) return 0;
  const end = monthIndex(bulletin.month);
  let count = 0;
  for (let i = 1; i <= trailingMonths; i++) {
    const mi = end - i + 1;
    const prev = seriesValueAt(points, mi - 1);
    const cur = seriesValueAt(points, mi);
    if (!prev || !cur || !isValidVisaDate(prev) || !isValidVisaDate(cur)) continue;
    if (monthIndex(cur) - monthIndex(prev) < -0.03) count++;
  }
  return count;
}

/** Trailing-window pace (cutoff-months advanced per calendar month) for a category/country/chart — feeds the pace scenario buttons. */
export function getExtendedVelocity(
  category: ExtendedCategory,
  country: ExtendedCountry,
  chart: ChartKind = "fad",
  trailingMonths = 12
): number | null {
  const series = getExtendedSeries(category, country);
  const points = series ? series[chart] : null;
  if (!points || !points.length) return null;
  return velocity(points, trailingMonths);
}

/**
 * The most recent month with a real dated cutoff (not "C"/"U", never null)
 * for a category/country/chart — lets pace/gap stats fall back to "as of the
 * last available month" instead of going blank when the current month is
 * frozen ("U"), which does happen for real (e.g. EB-2 India, July 2026).
 */
export function findLastDatedPoint(
  category: ExtendedCategory,
  country: ExtendedCountry,
  chart: ChartKind = "fad"
): SeriesPoint | null {
  const series = getExtendedSeries(category, country);
  const points = series ? series[chart] : null;
  if (!points || !points.length) return null;
  for (let i = points.length - 1; i >= 0; i--) {
    const [, value] = points[i];
    if (isValidVisaDate(value)) return points[i];
  }
  return null;
}

/** Pace as of an explicit month (not necessarily the current bulletin) — powers the "as of the last dated month" fallback. */
export function getExtendedVelocityAsOf(
  category: ExtendedCategory,
  country: ExtendedCountry,
  chart: ChartKind,
  asOf: string,
  trailingMonths = 12
): number | null {
  const series = getExtendedSeries(category, country);
  const points = series ? series[chart] : null;
  if (!points || !points.length) return null;
  return velocity(points, trailingMonths, asOf);
}

export interface ExtendedMovement {
  status: MovementStatus;
  currentCutoff: MaybeCutoff;
  priorCutoff: MaybeCutoff;
  monthsMoved: number | null;
}

/** Same methodology as getMovement(), generalized to the full matrix and either chart. */
export function extendedGetMovement(
  category: ExtendedCategory,
  country: ExtendedCountry,
  chart: ChartKind = "fad"
): ExtendedMovement {
  const { fad, dff } = getExtendedCutoffs(category, country);
  const cutoff = chart === "fad" ? fad : dff;
  const priorMi = monthIndex(bulletin.month) - 1;
  const base: ExtendedMovement = {
    status: "unknown",
    currentCutoff: cutoff,
    priorCutoff: null,
    monthsMoved: null,
  };
  if (cutoff === null) return base;
  if (isCurrent(cutoff)) return { ...base, status: "current" };
  if (isUnavailableVisaValue(cutoff)) return { ...base, status: "unavailable" };

  const series = getExtendedSeries(category, country);
  const points = series ? series[chart] : null;
  const prior = points ? seriesValueAt(points, priorMi) : null;
  base.priorCutoff = prior;

  if (!prior || !isValidVisaDate(prior)) {
    if (prior === "U") return { ...base, status: "advanced" };
    if (prior === "C") return { ...base, status: "retrogressed" };
    return { ...base, status: "unknown" };
  }

  const moved = monthIndex(cutoff) - monthIndex(prior);
  base.monthsMoved = moved;
  if (moved > 0.03) return { ...base, status: "advanced" };
  if (moved < -0.03) return { ...base, status: "retrogressed" };
  return { ...base, status: "no-movement" };
}

/**
 * True when the stored bulletin month is older than the current calendar month.
 *
 * The cutoff data in data/visa-bulletin/current.json is MANUALLY MAINTAINED and
 * has to be updated when each new bulletin is published (around the 8th-10th).
 * If that update is missed, the site would otherwise keep presenting last
 * month's cutoffs as though they were current. Callers should surface a visible
 * warning when this returns true rather than showing the result as authoritative.
 *
 * A bulletin for a FUTURE month is not stale — bulletins are published ahead of
 * the month they govern.
 */
export function isBulletinStale(ym: string = bulletin.month): boolean {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return true;
  const now = new Date();
  return y * 12 + (m - 1) < now.getFullYear() * 12 + now.getMonth();
}
