/**
 * I-94 travel-history day counter.
 *
 * Takes arrival/departure pairs as they appear in a CBP travel history and
 * produces three things:
 *
 *   1. Days physically present in the United States, per calendar year.
 *   2. A Substantial Presence Test estimate on the 26 U.S.C. 7701(b)(3)
 *      formula: current-year days + 1/3 of the first preceding year + 1/6 of
 *      the second preceding year, against 183, with the separate 31-day
 *      current-year minimum.
 *   3. Flags on any single trip at the two thresholds in 8 CFR 316.5(c)(1):
 *      181+ days (continuous residence disrupted unless rebutted) and 365+
 *      days (disrupted, N-470 aside).
 *
 * DAY-COUNTING CONVENTIONS, chosen explicitly because they change answers:
 *
 *  • A day on which you were present in the US at any point counts as a day of
 *    presence. Both the arrival day and the departure day therefore count.
 *    This is the IRS convention for the substantial presence test and it is
 *    the conservative one for an overstay question.
 *  • A trip's LENGTH, for the 8 CFR 316.5 thresholds, is the time spent
 *    ABROAD — departure to the next arrival. That is the opposite measurement
 *    from presence and the two must not be conflated: "absence from the United
 *    States for a continuous period" is what the regulation thresholds.
 *  • A trip abroad spanning a year boundary attributes its days to the years
 *    they fall in, not to the year of departure.
 *  • An open final stay (a departure with no matching return, or a return with
 *    no later departure) is counted to `asOf`.
 *
 * WHAT THIS IS NOT. It is not a residency determination and it is not an
 * overstay opinion. Exempt-individual years for F and J holders, the
 * closer-connection exception, the India-US treaty tie-breakers, and first-year
 * and dual-status elections all change a tax answer and none of them is a day
 * count. The CBP history is also incomplete by CBP's own account — ten years
 * only, most land crossings missing, and expressly not an official record — so
 * the input is an estimate before the arithmetic starts.
 */

export interface TripSegment {
  /** ISO date (YYYY-MM-DD) of arrival in the US. */
  arrival?: string;
  /** ISO date (YYYY-MM-DD) of departure from the US. */
  departure?: string;
}

export interface YearCount {
  year: number;
  days: number;
}

export interface AbsenceFlag {
  from: string;
  to: string;
  days: number;
  level: "rebuttable" | "breaks";
  label: string;
}

export interface SptEstimate {
  taxYear: number;
  currentYearDays: number;
  priorYearDays: number;
  secondPriorYearDays: number;
  weightedDays: number;
  meets31Day: boolean;
  meets183Day: boolean;
  /** Both tests satisfied on the day count alone. */
  meetsOnDaysAlone: boolean;
  verdict: string;
}

export interface I94DayCountResult {
  valid: boolean;
  error?: string;
  /** Days present per calendar year, ascending. */
  byYear: YearCount[];
  totalDays: number;
  /** Continuous absences at or over the 8 CFR 316.5 thresholds. */
  absenceFlags: AbsenceFlag[];
  longestAbsenceDays: number;
  spt?: SptEstimate;
  notes: string[];
}

export const SPT_THRESHOLD = 183;
export const SPT_MIN_CURRENT_YEAR = 31;
export const ABSENCE_REBUTTABLE_DAYS = 181;
export const ABSENCE_BREAKS_DAYS = 365;

const DAY_MS = 86_400_000;

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse an ISO date to a UTC timestamp, or null. */
function parseDate(value: string | undefined): number | null {
  if (!value) return null;
  const m = ISO.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const t = Date.UTC(y, mo - 1, d);
  // Reject a rolled-over date like 2026-02-31.
  const back = new Date(t);
  if (back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return t;
}

const fmt = (t: number): string => new Date(t).toISOString().slice(0, 10);

/**
 * Add the days of one inclusive present-in-the-US interval into a per-year map.
 * Inclusive at both ends: the arrival day and the departure day both count.
 */
function addInterval(map: Map<number, number>, startT: number, endT: number): void {
  if (endT < startT) return;
  let cursor = startT;
  while (cursor <= endT) {
    const year = new Date(cursor).getUTCFullYear();
    // The last instant of this calendar year, or the interval end.
    const yearEnd = Date.UTC(year, 11, 31);
    const segmentEnd = Math.min(endT, yearEnd);
    const days = Math.round((segmentEnd - cursor) / DAY_MS) + 1;
    map.set(year, (map.get(year) ?? 0) + days);
    cursor = segmentEnd + DAY_MS;
  }
}

export function countI94Days(
  segments: TripSegment[],
  options: { asOf: string; taxYear?: number },
): I94DayCountResult {
  const asOfT = parseDate(options.asOf);
  if (asOfT === null) {
    return {
      valid: false,
      error: "The as-of date is not a valid YYYY-MM-DD date.",
      byYear: [],
      totalDays: 0,
      absenceFlags: [],
      longestAbsenceDays: 0,
      notes: [],
    };
  }

  // Normalise: keep rows with at least one usable date, in chronological order
  // of whichever date they have.
  type Row = { arrival: number | null; departure: number | null };
  const rows: Row[] = [];
  for (const s of segments) {
    const a = parseDate(s.arrival);
    const d = parseDate(s.departure);
    if (a === null && d === null) continue;
    if (a !== null && d !== null && d < a) {
      return {
        valid: false,
        error: `A departure (${fmt(d)}) falls before its arrival (${fmt(a)}).`,
        byYear: [],
        totalDays: 0,
        absenceFlags: [],
        longestAbsenceDays: 0,
        notes: [],
      };
    }
    rows.push({ arrival: a, departure: d });
  }

  if (rows.length === 0) {
    return {
      valid: false,
      error: "Add at least one arrival or departure date.",
      byYear: [],
      totalDays: 0,
      absenceFlags: [],
      longestAbsenceDays: 0,
      notes: [],
    };
  }

  rows.sort((x, y) => (x.arrival ?? x.departure!) - (y.arrival ?? y.departure!));

  const byYearMap = new Map<number, number>();
  const absenceFlags: AbsenceFlag[] = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const start = row.arrival;
    // Presence interval: arrival → departure, or arrival → asOf when still here.
    if (start !== null) {
      const end = row.departure ?? asOfT;
      addInterval(byYearMap, start, Math.min(end, asOfT));
    }

    // Absence interval: this departure → the next arrival.
    const dep = row.departure;
    const nextArrival = rows[i + 1]?.arrival ?? null;
    if (dep !== null && nextArrival !== null && nextArrival > dep) {
      // Days abroad, exclusive of both the departure and the arrival day,
      // because both of those are days of US presence.
      const abroadDays = Math.round((nextArrival - dep) / DAY_MS) - 1;
      if (abroadDays >= ABSENCE_BREAKS_DAYS) {
        absenceFlags.push({
          from: fmt(dep),
          to: fmt(nextArrival),
          days: abroadDays,
          level: "breaks",
          label: `${abroadDays} days abroad — one year or more`,
        });
      } else if (abroadDays >= ABSENCE_REBUTTABLE_DAYS) {
        absenceFlags.push({
          from: fmt(dep),
          to: fmt(nextArrival),
          days: abroadDays,
          level: "rebuttable",
          label: `${abroadDays} days abroad — over six months`,
        });
      }
    }
  }

  // tsconfig targets ES5, so spreading a Map iterator does not compile.
  const byYear: YearCount[] = [];
  byYearMap.forEach((days, year) => {
    byYear.push({ year, days: Math.min(days, isLeap(year) ? 366 : 365) });
  });
  byYear.sort((a, b) => a.year - b.year);

  const totalDays = byYear.reduce((sum, y) => sum + y.days, 0);
  const longestAbsenceDays = absenceFlags.reduce((m, f) => Math.max(m, f.days), 0);

  const taxYear = options.taxYear ?? new Date(asOfT).getUTCFullYear();
  const dayIn = (y: number) => byYear.find((r) => r.year === y)?.days ?? 0;

  const currentYearDays = dayIn(taxYear);
  const priorYearDays = dayIn(taxYear - 1);
  const secondPriorYearDays = dayIn(taxYear - 2);
  const weightedDays =
    currentYearDays + priorYearDays / 3 + secondPriorYearDays / 6;
  const meets31Day = currentYearDays >= SPT_MIN_CURRENT_YEAR;
  const meets183Day = weightedDays >= SPT_THRESHOLD;

  const spt: SptEstimate = {
    taxYear,
    currentYearDays,
    priorYearDays,
    secondPriorYearDays,
    weightedDays,
    meets31Day,
    meets183Day,
    meetsOnDaysAlone: meets31Day && meets183Day,
    verdict:
      meets31Day && meets183Day
        ? `On these days alone the ${taxYear} substantial presence test is met: ${currentYearDays} days in ${taxYear}, which clears the 31-day minimum, and ${Math.floor(weightedDays)} weighted days, which clears 183. A day count is not a residency determination — exempt-individual years, the closer-connection exception and the India-US treaty can all change the answer.`
        : !meets31Day
          ? `Not met on these days: ${currentYearDays} days in ${taxYear} is below the separate 31-day minimum, so the weighted total does not matter. Weighted days come to ${Math.floor(weightedDays)}.`
          : `Not met on these days: ${Math.floor(weightedDays)} weighted days against the 183 needed (${currentYearDays} from ${taxYear}, ${priorYearDays} from ${taxYear - 1} at one third, ${secondPriorYearDays} from ${taxYear - 2} at one sixth).`,
  };

  const notes: string[] = [];
  notes.push(
    "The arrival day and the departure day each count as a day of presence, which is the IRS convention for the substantial presence test.",
  );
  notes.push(
    "A trip's length, for the continuous-residence thresholds, is measured as time ABROAD — departure to the next arrival. That is the opposite measurement from presence, and the two get conflated constantly.",
  );
  if (rows.some((r) => r.arrival !== null && r.departure === null)) {
    notes.push(
      `One stay has no departure date, so it is counted through ${fmt(asOfT)}.`,
    );
  }
  if (absenceFlags.length === 0) {
    notes.push(
      "No single absence reaches six months on these dates. Most land-border crossings are missing from a CBP travel history, so an unrecorded departure can make a short trip look like a long one — or hide one.",
    );
  }

  return {
    valid: true,
    byYear,
    totalDays,
    absenceFlags,
    longestAbsenceDays,
    spt,
    notes,
  };
}

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/**
 * Parse pasted CBP travel-history text into segments.
 *
 * CBP's travel history exports one ROW PER CROSSING with a type, not paired
 * trips, so this pairs them up: an arrival opens a stay, the next departure
 * closes it. Lines it cannot read are reported rather than silently dropped —
 * a day counter that quietly ignores half the input is worse than one that
 * refuses.
 */
export function parseTravelHistory(text: string): {
  segments: TripSegment[];
  skipped: string[];
} {
  const segments: TripSegment[] = [];
  const skipped: string[] = [];
  let open: TripSegment | null = null;

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const date = extractDate(line);
    if (!date) {
      skipped.push(line);
      continue;
    }
    const lower = line.toLowerCase();
    const isDeparture = /\bdepart|\bexit|\bout\b/.test(lower);
    const isArrival = /\barriv|\bentry|\bentered|\bin\b/.test(lower);

    if (isDeparture && !isArrival) {
      if (open) {
        open.departure = date;
        segments.push(open);
        open = null;
      } else {
        segments.push({ departure: date });
      }
    } else if (isArrival && !isDeparture) {
      if (open) segments.push(open);
      open = { arrival: date };
    } else {
      skipped.push(line);
    }
  }
  if (open) segments.push(open);
  return { segments, skipped };
}

/** Pull an ISO, D-MMM-YYYY or MM/DD/YYYY date out of a line of text. */
function extractDate(line: string): string | undefined {
  const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(line);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const MONTHS: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const dmy = /(\d{1,2})[\s-]+([A-Za-z]{3})[A-Za-z]*[\s-]+(\d{4})/.exec(line);
  if (dmy) {
    const mm = MONTHS[dmy[2].toLowerCase()];
    if (mm) return `${dmy[3]}-${mm}-${dmy[1].padStart(2, "0")}`;
  }
  const mdy = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(line);
  if (mdy) {
    return `${mdy[3]}-${mdy[1].padStart(2, "0")}-${mdy[2].padStart(2, "0")}`;
  }
  return undefined;
}
