/**
 * H-1B Employer Explorer — server-only aggregation over the LCA rollup.
 *
 * `sponsors.ts` answers one question: "who sponsors <role> in <state>?". This
 * module answers the browse question the tool page opens with — "show me the
 * companies", with any combination of filters and none required. It rolls the
 * (employer, soc_code, state) rows up to one row per employer, and computes the
 * summary + occupation/state facets in the same single pass so one request
 * fills the whole page.
 *
 * Data source is whatever `loadAllRows()` resolves to (Postgres or the CSV
 * fallback) — see sponsors.ts.
 */

import "server-only";
import { loadAllRows, type SponsorRow, type WageLevels } from "@/lib/h1b/sponsors";
import { stateName } from "@/lib/h1b/states";

export type EmployerSort = "filings" | "positions" | "wage" | "employer";
export type SortDir = "asc" | "desc";

export interface EmployerRow {
  employer: string;
  /** Certified H-1B LCAs filed across every occupation + state in the filter. */
  lca_count: number;
  worker_positions: number;
  /** LCA-weighted median of the per-(role, state) medians. */
  median_wage: number | null;
  wage_levels: WageLevels;
  top_role: string;
  role_count: number;
  top_state: string;
  /** Up to 4 busiest state codes, most filings first. */
  states: string[];
  state_count: number;
  last_filed: string | null;
}

export interface ExplorerSummary {
  filings: number;
  positions: number;
  employers: number;
  occupations: number;
  states: number;
  medianWage: number | null;
}

export interface FacetRole {
  soc_title: string;
  lca_count: number;
  employers: number;
  median_wage: number | null;
}

export interface FacetState {
  code: string;
  name: string;
  lca_count: number;
  employers: number;
}

export interface ExplorerFilters {
  /** Employer name substring (case-insensitive). */
  q?: string;
  /** 2-letter state code, or "" for every state. */
  state?: string;
  /** Occupation title substring (case-insensitive). */
  role?: string;
  /** Bounds on the filing's median annual wage, in USD. */
  wageMin?: number;
  wageMax?: number;
  /** Drop employers below this total filing count, applied after rollup. */
  minFilings?: number;
  sort?: EmployerSort;
  dir?: SortDir;
  page?: number;
  pageSize?: number;
}

export interface ExplorerResult {
  rows: EmployerRow[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  summary: ExplorerSummary;
  topRoles: FacetRole[];
  topStates: FacetState[];
}

export const PAGE_SIZES = [25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;
/** Hard ceiling on one response so a request can't stream the whole dataset.
    The CSV export asks for exactly this many rows, so the two must not diverge —
    a lower page cap would silently truncate the export. */
export const MAX_EXPORT_ROWS = 2000;
export const MAX_PAGE_SIZE = MAX_EXPORT_ROWS;

const FACET_LIMIT = 12;
const ROMAN: (keyof WageLevels)[] = ["I", "II", "III", "IV"];

/* ------------------------------- internals ------------------------------- */

/**
 * Weighted median of (value, weight) pairs — the wage a filing picked at random
 * from this group would sit at. Rows carry a median wage and an LCA count, not
 * the underlying wages, so this is an approximation of the true median and is
 * labelled as such in the UI.
 */
function weightedMedian(pairs: [number, number][]): number | null {
  if (!pairs.length) return null;
  const sorted = [...pairs].sort((a, b) => a[0] - b[0]);
  const total = sorted.reduce((s, p) => s + p[1], 0);
  if (total <= 0) return null;
  let seen = 0;
  for (const [value, weight] of sorted) {
    seen += weight;
    if (seen >= total / 2) return Math.round(value);
  }
  return Math.round(sorted[sorted.length - 1][0]);
}

/** Mutable accumulator; converted to an EmployerRow once the pass is done. */
interface Acc {
  employer: string;
  lca_count: number;
  worker_positions: number;
  wages: [number, number][];
  levels: WageLevels;
  roles: Map<string, number>;
  states: Map<string, number>;
  last_filed: string | null;
}

function laterDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

function topKey(m: Map<string, number>): string {
  let best = "";
  let bestN = -1;
  m.forEach((n, k) => {
    if (n > bestN) {
      best = k;
      bestN = n;
    }
  });
  return best;
}

/** Map -> [key, value][] without relying on downlevel iteration of iterators. */
function entriesOf<V>(m: Map<string, V>): [string, V][] {
  const out: [string, V][] = [];
  m.forEach((v, k) => out.push([k, v]));
  return out;
}

function comparator(sort: EmployerSort, dir: SortDir) {
  const sign = dir === "asc" ? 1 : -1;
  return (a: EmployerRow, b: EmployerRow): number => {
    switch (sort) {
      case "employer":
        return sign * a.employer.localeCompare(b.employer);
      case "positions":
        return sign * (a.worker_positions - b.worker_positions) ||
          b.lca_count - a.lca_count;
      case "wage": {
        // Employers with no disclosed wage sort last in both directions rather
        // than clumping at the top of an ascending sort.
        const av = a.median_wage;
        const bv = b.median_wage;
        if (av == null && bv == null) return b.lca_count - a.lca_count;
        if (av == null) return 1;
        if (bv == null) return -1;
        return sign * (av - bv) || b.lca_count - a.lca_count;
      }
      case "filings":
      default:
        return (
          sign * (a.lca_count - b.lca_count) ||
          b.worker_positions - a.worker_positions
        );
    }
  };
}

const norm = (s: string | undefined) => (s ?? "").trim().toLowerCase();

/* ------------------------------ public API ------------------------------- */

/**
 * One pass over the rollup: filter rows, roll them up by employer, and build
 * the summary + occupation/state facets for the same filtered set.
 */
export async function getEmployerExplorer(
  filters: ExplorerFilters = {}
): Promise<ExplorerResult> {
  const all = await loadAllRows();

  const q = norm(filters.q);
  const role = norm(filters.role);
  const state = (filters.state ?? "").trim().toUpperCase();
  const wageMin = Number.isFinite(filters.wageMin) ? Number(filters.wageMin) : null;
  const wageMax = Number.isFinite(filters.wageMax) ? Number(filters.wageMax) : null;
  const minFilings = Math.max(0, Math.floor(filters.minFilings ?? 0));

  const byEmployer = new Map<string, Acc>();
  const roleFacet = new Map<string, { lca: number; employers: Set<string>; wages: [number, number][] }>();
  const stateFacet = new Map<string, { lca: number; employers: Set<string> }>();
  const summaryWages: [number, number][] = [];
  let filings = 0;
  let positions = 0;

  for (const r of all) {
    if (state && r.state !== state) continue;
    if (q && !r.employer.toLowerCase().includes(q)) continue;
    if (role && !r.soc_title.toLowerCase().includes(role)) continue;
    if (wageMin != null && (r.median_wage == null || r.median_wage < wageMin)) continue;
    if (wageMax != null && (r.median_wage == null || r.median_wage > wageMax)) continue;

    filings += r.lca_count;
    positions += r.worker_positions;
    if (r.median_wage != null) summaryWages.push([r.median_wage, r.lca_count]);

    let acc = byEmployer.get(r.employer);
    if (!acc) {
      acc = {
        employer: r.employer,
        lca_count: 0,
        worker_positions: 0,
        wages: [],
        levels: {},
        roles: new Map(),
        states: new Map(),
        last_filed: null,
      };
      byEmployer.set(r.employer, acc);
    }
    acc.lca_count += r.lca_count;
    acc.worker_positions += r.worker_positions;
    if (r.median_wage != null) acc.wages.push([r.median_wage, r.lca_count]);
    for (const k of ROMAN) {
      const n = r.wage_levels[k];
      if (n) acc.levels[k] = (acc.levels[k] ?? 0) + n;
    }
    acc.roles.set(r.soc_title, (acc.roles.get(r.soc_title) ?? 0) + r.lca_count);
    acc.states.set(r.state, (acc.states.get(r.state) ?? 0) + r.lca_count);
    acc.last_filed = laterDate(acc.last_filed, r.last_filed);

    if (r.soc_title) {
      let rf = roleFacet.get(r.soc_title);
      if (!rf) {
        rf = { lca: 0, employers: new Set(), wages: [] };
        roleFacet.set(r.soc_title, rf);
      }
      rf.lca += r.lca_count;
      rf.employers.add(r.employer);
      if (r.median_wage != null) rf.wages.push([r.median_wage, r.lca_count]);
    }
    if (r.state) {
      let sf = stateFacet.get(r.state);
      if (!sf) {
        sf = { lca: 0, employers: new Set() };
        stateFacet.set(r.state, sf);
      }
      sf.lca += r.lca_count;
      sf.employers.add(r.employer);
    }
  }

  let rows: EmployerRow[] = [];
  entriesOf(byEmployer).forEach(([, acc]) => {
    if (acc.lca_count < minFilings) return;
    const states = entriesOf(acc.states)
      .sort((a, b) => b[1] - a[1])
      .map(([code]) => code);
    rows.push({
      employer: acc.employer,
      lca_count: acc.lca_count,
      worker_positions: acc.worker_positions,
      median_wage: weightedMedian(acc.wages),
      wage_levels: acc.levels,
      top_role: topKey(acc.roles),
      role_count: acc.roles.size,
      top_state: states[0] ?? "",
      states: states.slice(0, 4),
      state_count: states.length,
      last_filed: acc.last_filed,
    });
  });

  const sort: EmployerSort = filters.sort ?? "filings";
  const dir: SortDir = filters.dir ?? (sort === "employer" ? "asc" : "desc");
  rows.sort(comparator(sort, dir));

  const total = rows.length;
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.floor(filters.pageSize ?? DEFAULT_PAGE_SIZE))
  );
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pageCount, Math.max(1, Math.floor(filters.page ?? 1)));
  rows = rows.slice((page - 1) * pageSize, page * pageSize);

  const topRoles: FacetRole[] = entriesOf(roleFacet)
    .sort((a, b) => b[1].lca - a[1].lca)
    .slice(0, FACET_LIMIT)
    .map(([soc_title, v]) => ({
      soc_title,
      lca_count: v.lca,
      employers: v.employers.size,
      median_wage: weightedMedian(v.wages),
    }));

  const topStates: FacetState[] = entriesOf(stateFacet)
    .sort((a, b) => b[1].lca - a[1].lca)
    .slice(0, FACET_LIMIT)
    .map(([code, v]) => ({
      code,
      name: stateName(code),
      lca_count: v.lca,
      employers: v.employers.size,
    }));

  return {
    rows,
    total,
    page,
    pageSize,
    pageCount,
    summary: {
      filings,
      positions,
      employers: total,
      occupations: roleFacet.size,
      states: stateFacet.size,
      medianWage: weightedMedian(summaryWages),
    },
    topRoles,
    topStates,
  };
}

/** Distinct occupation titles matching `q`, busiest first — role autocomplete. */
export async function searchRoleTitles(q: string, limit = 8): Promise<string[]> {
  const needle = norm(q);
  if (needle.length < 2) return [];
  const all = await loadAllRows();
  const counts = new Map<string, number>();
  for (const r of all) {
    if (!r.soc_title || !r.soc_title.toLowerCase().includes(needle)) continue;
    counts.set(r.soc_title, (counts.get(r.soc_title) ?? 0) + r.lca_count);
  }
  return entriesOf(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([title]) => title);
}

/** RFC-4180 escaping for the CSV export. */
function csvCell(v: string | number | null): string {
  if (v == null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function rowsToCsv(rows: EmployerRow[]): string {
  const header = [
    "rank",
    "employer",
    "certified_lcas",
    "worker_positions",
    "median_annual_wage_usd",
    "top_occupation",
    "occupations",
    "top_state",
    "states",
    "last_filed",
  ];
  const lines = [header.join(",")];
  rows.forEach((r, i) => {
    lines.push(
      [
        i + 1,
        csvCell(r.employer),
        r.lca_count,
        r.worker_positions,
        r.median_wage ?? "",
        csvCell(r.top_role),
        r.role_count,
        r.top_state,
        r.state_count,
        r.last_filed ?? "",
      ].join(",")
    );
  });
  return lines.join("\n");
}

/**
 * Latest certified-filing date in the dataset, as "Month YYYY". The DOL
 * releases quarterly, so this is the honest "data through" stamp for the UI —
 * it moves when the ETL is rerun instead of drifting from a hardcoded string.
 */
export async function getDataAsOf(): Promise<string> {
  const all = await loadAllRows();
  let max: string | null = null;
  for (const r of all) {
    if (r.last_filed && (!max || r.last_filed > max)) max = r.last_filed;
  }
  if (!max) return "latest available release";
  const d = new Date(`${max}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "latest available release";
  return `filings through ${d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })}`;
}
