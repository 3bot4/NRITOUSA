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
  if (!b || isCurrent(b)) return null;

  let a = valueAt(start) ?? points[0][1];
  let anchor = Math.max(start, monthIndex(points[0][0]));
  if (isCurrent(a)) {
    // Series was Current at the window start (it later retrogressed into a
    // backlog) — anchor at the first dated cutoff inside the window instead.
    const firstDated = points.find(
      ([ym, cutoff]) => monthIndex(ym) >= start && !isCurrent(cutoff)
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

  // Filing eligibility under Dates for Filing (when USCIS accepts that chart).
  base.canFileI485 =
    isCurrent(dff) || monthIndex(priorityDate) < monthIndex(dff);

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
    out.push({ month, value: v && !isCurrent(v) ? monthIndex(v) : null });
  }
  return out;
}
