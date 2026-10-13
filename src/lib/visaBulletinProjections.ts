/**
 * Projected visa-bulletin month pages.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ONE RULE, RESTATED
 *
 * visaBulletinMonths.ts says a month page exists only for a bulletin the State
 * Department has actually published. That rule is unchanged. This module adds a
 * second, clearly-separated kind of page: a PROJECTED month, at the permanent
 * clean URL (/visa-bulletin/november-2026), labelled as projected everywhere it
 * shows a number, which becomes the official page by a DATA EDIT ALONE once the
 * bulletin is released.
 *
 * Flipping a month to official is three steps and no code:
 *   1. Add data/visa-bulletin/snapshots/<YYYY-MM>.json (the existing
 *      build-visa-bulletin-data script writes it).
 *   2. Import that snapshot in visaBulletinMonths.ts's SNAPSHOTS map and add
 *      the month to PUBLISHED_MONTHS.
 *   3. Remove the month from PROJECTED_MONTHS below.
 * The URL does not change, the sitemap entry does not change, and
 * projections.test.ts fails if a month is listed in both places.
 *
 * NO FORECAST WORD IN THE URL. The slug is the month. "Projected" is a status,
 * carried in this file and rendered as a banner and a badge — never in the path,
 * so the page never has to move.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE METHOD
 *
 * Every projected figure is DERIVED from the snapshot archive already on disk.
 * Nothing is typed in. That matters for two reasons: a hand-typed forecast rots
 * silently, and a derived one can state its own basis.
 *
 *  1. Trailing window. For each category and country, month-over-month change
 *     in the cutoff across the last `WINDOW` published bulletins.
 *
 *  2. C and U are EXCLUDED. They are states, not dates. Treating "U" as an old
 *     date is how a movement tracker produces a confident "retrogressed 4,000
 *     days" — the same trap describeMovement() already guards in
 *     visaBulletinMonths.ts. A transition into or out of C or U contributes
 *     nothing to the statistics, and is reported separately as volatility.
 *
 *  3. A RANGE, never a point. Low bound is no movement, because "no movement"
 *     is the single most common outcome in the archive. High bound is the 75th
 *     percentile of observed positive advances. A category that retrogressed or
 *     went unavailable inside the window carries an explicit downside note
 *     instead of a prettier number.
 *
 *  4. No supply anchor. DOS has not published the FY2027 employment-based
 *     limit — visaAnnualLimitsData records it as `awaiting-dos` — so the
 *     projection does not claim one. The statutory 140,000 floor is the only
 *     figure with backing and it is a floor, not a forecast.
 *
 *  5. USCIS chart choice is never projected. The tracked determination covers
 *     one month; a projected page names that month rather than asserting a
 *     chart for a month USCIS has not ruled on.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import history from "../../data/visa-bulletin/history.json";
import index from "../../data/visa-bulletin/index.json";
import {
  EB_LABELS,
  FAMILY_LABELS,
  MONTH_NAMES,
  monthLabel,
  monthSlug,
  previousMonth,
  slugToMonth,
  type Cutoff,
} from "@/lib/visaBulletinMonths";

/* ══════════════════════ status ══════════════════════════════════════════ */

/**
 * Bulletin months with a PROJECTED page, newest first.
 *
 * ⚠️ A month listed here must NOT also be in PUBLISHED_MONTHS. Remove it from
 * here in the same change that adds it there.
 *
 * As of 2026-10-13 the latest published bulletin is October 2026, the first of
 * FY2027. November 2026 has not been released: travel.state.gov shows October
 * as current with "Upcoming Visa Bulletin — Coming Soon" next to it, and
 * data/visa-bulletin/index.json agrees (`current: "2026-10"`). DOS normally
 * publishes in the second or third week of the preceding month, so November is
 * expected imminently.
 */
export const PROJECTED_MONTHS: string[] = ["2026-11", "2026-12", "2027-01"];

export type MonthStatus = "official" | "projected" | "none";

export function isProjectedMonth(bulletinMonth: string): boolean {
  return PROJECTED_MONTHS.indexOf(bulletinMonth) !== -1;
}

export function projectedMonthSlugs(): string[] {
  return PROJECTED_MONTHS.slice().sort().reverse().map(monthSlug);
}

/** "november-2026" → "2026-11" when that slug has a projected page. */
export function projectedMonthForSlug(slug: string): string | null {
  const month = slugToMonth(slug);
  return month && isProjectedMonth(month) ? month : null;
}

/**
 * The banner text. One string, used by the page, the metadata description and
 * the FAQ, so the three cannot disagree about what the page is.
 */
export const PROJECTED_BANNER =
  "Projected — the official bulletin has not been published yet. We will update this page on release.";

export const PROJECTED_BADGE = "PROJECTED";

/* ══════════════════════ the archive ═════════════════════════════════════ */

interface HistoryPoint {
  month: string;
  fad: Cutoff;
  dff: Cutoff;
}

/**
 * history.json keeps each category/country series as a SPARSE list of
 * [bulletinMonth, cutoff] change-points, under a flat key like "eb2-india" or
 * "f2a-india". The cutoff carries forward as a step function until the next
 * point. The existing `expandSeries` in src/lib/visa-bulletin.ts expands the
 * same data but converts to a numeric month index, which collapses "C" and "U"
 * to the same null — and this module's whole correctness rests on telling those
 * two apart from a date. So it expands the raw Cutoff strings itself rather
 * than re-deriving them from numbers that have already lost the distinction.
 */
type ChangePoint = [string, Cutoff];
interface RawSeries {
  fad: ChangePoint[];
  dff: ChangePoint[];
}

function daysBetween(from: Cutoff, to: Cutoff): number | null {
  const a = parseIso(from);
  const b = parseIso(to);
  if (a === null || b === null) return null;
  return Math.round((b - a) / 86_400_000);
}

function parseIso(value: Cutoff): number | null {
  if (!value || value === "C" || value === "U") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** Step forward one bulletin month. */
function nextMonth(bulletinMonth: string): string {
  const [y, m] = bulletinMonth.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}

/**
 * Expand one category/country series into one Cutoff per bulletin month, from
 * the first change-point up to and including `upToMonth`.
 *
 * `table` is accepted for symmetry with the rest of the module; history.json
 * keys employment and family series in the same flat namespace, so it does not
 * change the lookup.
 */
export function readSeries(
  category: string,
  country: string,
  _table: "categories" | "family",
  upToMonth: string,
): HistoryPoint[] {
  // The JSON import infers `string[][]`, which is not assignable to a tuple
  // type, so this widens through unknown. The shape is asserted by the test.
  const series = (history as unknown as { series?: Record<string, RawSeries> })
    .series;
  const raw = series ? series[`${category}-${country}`] : undefined;
  if (!raw) return [];

  const fadPoints = raw.fad ?? [];
  const dffPoints = raw.dff ?? [];
  if (fadPoints.length === 0 && dffPoints.length === 0) return [];

  const firsts = [fadPoints[0]?.[0], dffPoints[0]?.[0]].filter(
    (m): m is string => typeof m === "string",
  );
  let month = firsts.sort()[0];
  if (!month || month > upToMonth) return [];

  const out: HistoryPoint[] = [];
  // Guard against a malformed series producing an unbounded walk.
  for (let guard = 0; guard < 600 && month <= upToMonth; guard += 1) {
    out.push({
      month,
      fad: valueAt(fadPoints, month),
      dff: valueAt(dffPoints, month),
    });
    month = nextMonth(month);
  }
  return out;
}

/** The last change-point at or before `month` — the step-function read. */
function valueAt(points: ChangePoint[], month: string): Cutoff {
  let value: Cutoff = "";
  for (const [pointMonth, cutoff] of points) {
    if (pointMonth > month) break;
    value = cutoff;
  }
  return value;
}

/* ══════════════════════ projection ══════════════════════════════════════ */

export const WINDOW = 12;

export type Chart = "fad" | "dff";

export interface Projection {
  category: string;
  categoryLabel: string
  country: string;
  chart: Chart;
  /** The last published cutoff this projection starts from. */
  basis: Cutoff;
  basisMonth: string;
  /** Low bound of the projected range — always the basis (no movement). */
  low: Cutoff;
  /** High bound: basis advanced by the 75th-percentile observed advance. */
  high: Cutoff;
  /** Days of advance at the high bound. Zero when the archive shows no advance. */
  highAdvanceDays: number;
  /** 75th-percentile advance per bulletin, before the horizon is applied. */
  perMonthAdvance: number;
  /** Bulletins ahead of the last published one. */
  horizon: number;
  /** True when the high bound hit the bulletin month and could mean Current. */
  reachesCurrent: boolean;
  /** Observed month-over-month advances in the window, in days. */
  observedAdvances: number[];
  /** Months in the window where the cutoff did not move at all. */
  staticMonths: number;
  /** Months in the window where the cutoff went backwards. */
  retrogressedMonths: number;
  /** Months in the window that were C or U, so excluded from the arithmetic. */
  excludedMonths: number;
  /** Set when the category is currently C or U, where a date projection makes no sense. */
  stateOnly: "C" | "U" | null;
  /** How many comparable month-over-month pairs the arithmetic rests on. */
  sampleSize: number;
  confidence: "none" | "low" | "moderate";
  /** The range as display text, e.g. "1 Nov 2013 – 15 Dec 2013". */
  rangeLabel: string;
  /** One sentence of method, specific to this row. */
  method: string;
  /** Downside note, present only when the window contains a reversal. */
  downside?: string;
}

const fmtCutoff = (v: Cutoff): string => {
  if (v === "C") return "Current";
  if (v === "U") return "Unavailable";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
  if (!m) return "—";
  return `${Number(m[3])} ${MONTH_NAMES[Number(m[2]) - 1].slice(0, 3)} ${m[1]}`;
};

const addDays = (value: Cutoff, days: number): Cutoff => {
  const t = parseIso(value);
  if (t === null) return value;
  return new Date(t + days * 86_400_000).toISOString().slice(0, 10);
};

/**
 * Hold a projected cutoff at the bulletin's own month. Returns whether the cap
 * bound, so the caller can say "or Current" instead of printing a date that
 * would mean there is no queue left.
 */
function clampToCeiling(value: Cutoff, ceiling: string): { value: Cutoff; clamped: boolean } {
  const v = parseIso(value);
  const c = parseIso(ceiling);
  if (v === null || c === null || v <= c) return { value, clamped: false };
  return { value: ceiling, clamped: true };
}

/** 75th percentile of a sorted-ascending numeric array, nearest-rank. */
function percentile75(sortedAsc: number[]): number {
  if (sortedAsc.length === 0) return 0;
  const idx = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil(0.75 * sortedAsc.length) - 1),
  );
  return sortedAsc[idx];
}

/**
 * The newest bulletin the archive actually holds. Every projection's window
 * ends here rather than at `previousMonth(targetMonth)`.
 *
 * That distinction is not cosmetic. Walking the window up to the month before
 * the target silently extends the series with carry-forward copies of the last
 * real figure, which pads the sample with fake "no movement" months and shifts
 * genuine history out of the window — so the December projection came out
 * different from the November one on data that had not changed. The window is
 * a property of the archive; the horizon is a property of the target month.
 */
export const LAST_PUBLISHED_MONTH: string =
  (index as { current?: string }).current ?? "2026-10";

/** Whole bulletin months from `from` to `to`. Zero when `to` is not later. */
export function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return Math.max(0, (ty - fy) * 12 + (tm - fm));
}

export function projectCutoff(
  category: string,
  country: string,
  chart: Chart,
  targetMonth: string,
  table: "categories" | "family" = "categories",
): Projection {
  const labels = table === "family" ? FAMILY_LABELS : EB_LABELS;
  const series = readSeries(category, country, table, LAST_PUBLISHED_MONTH);
  const window = series.slice(Math.max(0, series.length - (WINDOW + 1)));
  // How many bulletins ahead of the last published one the target sits. A
  // projection three months out compounds three months of possible movement,
  // and a range that did not widen with distance would be claiming more
  // precision the further out it reached.
  const horizon = Math.max(1, monthsBetween(LAST_PUBLISHED_MONTH, targetMonth));

  const last = window.length > 0 ? window[window.length - 1] : null;
  const basis: Cutoff = last ? last[chart] : "";
  const basisMonth = last ? last.month : "";

  const advances: number[] = [];
  let staticMonths = 0;
  let retrogressedMonths = 0;
  let excludedMonths = 0;

  for (let i = 1; i < window.length; i += 1) {
    const from = window[i - 1][chart];
    const to = window[i][chart];
    // C and U are states, not dates. A transition either way is excluded.
    if (from === "C" || from === "U" || to === "C" || to === "U" || !from || !to) {
      excludedMonths += 1;
      continue;
    }
    const delta = daysBetween(from, to);
    if (delta === null) {
      excludedMonths += 1;
      continue;
    }
    if (delta > 0) advances.push(delta);
    else if (delta < 0) retrogressedMonths += 1;
    else staticMonths += 1;
  }

  const sampleSize = advances.length + staticMonths + retrogressedMonths;
  const stateOnly = basis === "C" ? "C" : basis === "U" ? "U" : null;

  const sorted = advances.slice().sort((a, b) => a - b);
  const perMonthAdvance = stateOnly ? 0 : percentile75(sorted);
  const highAdvanceDays = perMonthAdvance * horizon;

  const low: Cutoff = basis;
  // A cutoff cannot sensibly run past the bulletin's own month: a category
  // whose cutoff reaches the present has no backlog, which the bulletin prints
  // as "C" rather than as a future date. Without this clamp a large one-off
  // advance in the window, compounded over a three-month horizon, produced
  // projected cutoffs years in the future — arithmetically consistent and
  // obviously wrong. When the clamp bites, the page says "or Current" rather
  // than pretending to a date.
  const ceiling = `${targetMonth}-01`;
  const uncapped = stateOnly ? basis : addDays(basis, highAdvanceDays);
  const capped = clampToCeiling(uncapped, ceiling);
  const high: Cutoff = capped.value;
  const reachesCurrent = capped.clamped;

  const confidence: Projection["confidence"] =
    sampleSize === 0 ? "none" : sampleSize < 6 ? "low" : "moderate";

  const rangeLabel = stateOnly
    ? fmtCutoff(basis)
    : highAdvanceDays === 0
      ? fmtCutoff(basis)
      : reachesCurrent
        ? `${fmtCutoff(low)} – ${fmtCutoff(high)}, or Current`
        : `${fmtCutoff(low)} – ${fmtCutoff(high)}`;

  let method: string;
  if (stateOnly === "U") {
    method = `The last published figure is Unavailable, which is a state and not a date. No date can be projected from it: a cutoff returns when visa numbers become available again, which in the archive has most often been at the start of a fiscal year rather than on a trend.`;
  } else if (stateOnly === "C") {
    method = `The last published figure is Current, meaning no backlog. There is no cutoff to advance. The projectable question is whether a cutoff gets imposed, which happens when demand exceeds the year's numbers, not on a trend.`;
  } else if (sampleSize === 0) {
    method = `There are no comparable month-over-month pairs in the trailing ${WINDOW} bulletins for this row — every month was Current, Unavailable or missing — so no range is projected.`;
  } else if (highAdvanceDays === 0) {
    method = `Across ${sampleSize} comparable month-over-month pairs in the trailing ${WINDOW} bulletins, this cutoff did not advance at all${retrogressedMonths > 0 ? ` and went backwards in ${retrogressedMonths}` : ""}. The projection is therefore no movement, which is the most common outcome in the archive and not a placeholder.`;
  } else {
    method = `Built from ${sampleSize} comparable month-over-month pairs in the trailing ${WINDOW} bulletins: ${advances.length} advanced, ${staticMonths} did not move${retrogressedMonths > 0 ? `, ${retrogressedMonths} went backwards` : ""}${excludedMonths > 0 ? `, and ${excludedMonths} were Current or Unavailable and so excluded from the arithmetic` : ""}. The low bound is no movement; the high bound applies the 75th-percentile observed advance of ${perMonthAdvance} days per bulletin across ${horizon} bulletin${horizon === 1 ? "" : "s"} from the published ${monthLabel(LAST_PUBLISHED_MONTH)} cutoff of ${fmtCutoff(basis)}.`;
  }

  const downside =
    retrogressedMonths > 0 || excludedMonths > 0
      ? `This row has moved backwards or become unavailable inside the trailing ${WINDOW} bulletins${retrogressedMonths > 0 ? ` (${retrogressedMonths} month${retrogressedMonths === 1 ? "" : "s"} of retrogression)` : ""}${excludedMonths > 0 ? `${retrogressedMonths > 0 ? " and" : ""} (${excludedMonths} month${excludedMonths === 1 ? "" : "s"} Current or Unavailable)` : ""}. A range with a floor of "no movement" does not capture that. Retrogression and a category going Unavailable are both live possibilities, and neither is forecastable from a trend.`
      : undefined;

  return {
    category,
    categoryLabel: labels[category] ?? category,
    country,
    chart,
    basis,
    basisMonth,
    low,
    high,
    highAdvanceDays,
    perMonthAdvance,
    horizon,
    reachesCurrent,
    observedAdvances: advances,
    staticMonths,
    retrogressedMonths,
    excludedMonths,
    stateOnly,
    sampleSize,
    confidence,
    rangeLabel,
    method,
    downside,
  };
}

export interface ProjectionRow {
  category: string;
  categoryLabel: string;
  country: string;
  countryLabel: string;
  fad: Projection;
  dff: Projection;
}

export const EB_PROJECT_ORDER = ["eb1", "eb2", "eb3", "eb3Other", "eb4", "eb5"];
export const FAMILY_PROJECT_ORDER = ["f1", "f2a", "f2b", "f3", "f4"];

export function projectionTable(
  targetMonth: string,
  table: "categories" | "family",
  countries: string[],
): ProjectionRow[] {
  const order = table === "family" ? FAMILY_PROJECT_ORDER : EB_PROJECT_ORDER;
  const labels = table === "family" ? FAMILY_LABELS : EB_LABELS;
  const COUNTRY_LABELS: Record<string, string> = {
    india: "India",
    china: "China (mainland)",
    mexico: "Mexico",
    philippines: "Philippines",
    row: "All other countries",
  };

  const rows: ProjectionRow[] = [];
  for (const category of order) {
    for (const country of countries) {
      const fad = projectCutoff(category, country, "fad", targetMonth, table);
      const dff = projectCutoff(category, country, "dff", targetMonth, table);
      // Skip pairs the archive knows nothing about rather than printing an
      // empty row that looks like a figure we failed to fetch.
      if (!fad.basis && !dff.basis) continue;
      rows.push({
        category,
        categoryLabel: labels[category] ?? category,
        country,
        countryLabel: COUNTRY_LABELS[country] ?? country,
        fad,
        dff,
      });
    }
  }
  return rows;
}

/** India EB rows, which every projected page leads on. */
export function indiaEbProjections(targetMonth: string): ProjectionRow[] {
  return projectionTable(targetMonth, "categories", ["india"]);
}

/* ══════════════════════ page copy ══════════════════════════════════════ */

/**
 * How far into FY2027 the target month sits, and what the archive says about
 * that stage of a fiscal year. Stated as observed history, not prediction.
 */
export function fiscalStage(bulletinMonth: string): {
  fy: number;
  monthOfFy: number;
  label: string;
  note: string;
} {
  const [y, m] = bulletinMonth.split("-").map(Number);
  const fy = m >= 10 ? y + 1 : y;
  const monthOfFy = m >= 10 ? m - 9 : m + 3;
  const label = `month ${monthOfFy} of FY${fy}`;
  let note: string;
  if (monthOfFy <= 4) {
    note =
      "Early in a fiscal year the year's visa numbers are newly available, and the archive shows this is when categories that went Unavailable late in the prior year get a cutoff date back. It is also the stage at which advances have historically been largest — which cuts the other way too, because an early advance is the weakest possible evidence of a trend.";
  } else if (monthOfFy <= 8) {
    note =
      "The middle of a fiscal year is where the archive is steadiest: movement is usually smaller and more regular than at either end.";
  } else {
    note =
      "Late in a fiscal year the archive shows movement slowing, cutoffs retrogressing, and categories going Unavailable as per-country limits are reached. India EB-2 did exactly this in FY2026, going Unavailable from July through September.";
  }
  return { fy, monthOfFy, label, note };
}

export function projectedMonthDescription(bulletinMonth: string): string {
  const label = monthLabel(bulletinMonth);
  const india = indiaEbProjections(bulletinMonth);
  const eb2 = india.filter((r) => r.category === "eb2")[0];
  const eb3 = india.filter((r) => r.category === "eb3")[0];
  return `${label} visa bulletin projection for India EB-1, EB-2 and EB-3. The official bulletin is not published yet. Projected EB-2 India final action ${
    eb2 ? eb2.fad.rangeLabel : "see table"
  }, EB-3 ${
    eb3 ? eb3.fad.rangeLabel : "see table"
  } — ranges, not dates, with the method stated and the 12-month movement history behind them.`;
}

/**
 * The date the projected month pages were first published. Deliberately a
 * committed constant and never the build clock — latestUpdates.test.ts forbids
 * clock-derived page dates site-wide, and a forecast page that restamps itself
 * on every deploy is exactly the signal that test exists to stop.
 *
 * Bump this when the projection method changes, not when a deploy happens.
 */
export const VB_PROJECTION_PUBLISHED = "2026-10-13";
