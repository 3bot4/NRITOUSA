/**
 * H-1B Sponsor Finder — server-only data access.
 *
 * Production reads a Postgres `sponsors` table (see data/h1b/schema.sql) via the
 * `pg` client using process.env.DATABASE_URL. For local dev, when DATABASE_URL
 * is unset, it falls back to parsing data/h1b/sponsors.csv so the UI works
 * immediately without a database. The database is NEVER imported on the client:
 * every export here is async and called only from route handlers / server
 * components.
 *
 * Data refresh + the ETL that builds sponsors.csv: data/h1b/README.md.
 */

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { socSlug } from "@/lib/h1b/socSlug";

export { socSlug };

export type Trend = "up" | "down" | "flat";

export interface WageLevels {
  I?: number;
  II?: number;
  III?: number;
  IV?: number;
}

export interface SponsorRow {
  employer: string;
  soc_code: string;
  soc_title: string;
  state: string;
  lca_count: number;
  worker_positions: number;
  median_wage: number | null;
  wage_levels: WageLevels;
  prev_year_count: number;
  trend: Trend | null;
  /** ISO date (YYYY-MM-DD) or null. */
  last_filed: string | null;
}

export interface RoleOption {
  soc_code: string;
  soc_title: string;
}

const SPONSOR_LIMIT = 25;
const ROLE_LIMIT = 10;

const usingDatabase = () => Boolean(process.env.DATABASE_URL);

/* ----------------------------- shared helpers ---------------------------- */

const ROMAN: (keyof WageLevels)[] = ["I", "II", "III", "IV"];

/** Coerce an arbitrary jsonb value into a clean {I,II,III,IV} object. */
function normalizeWageLevels(raw: unknown): WageLevels {
  const out: WageLevels = {};
  if (!raw || typeof raw !== "object") return out;
  const obj = raw as Record<string, unknown>;
  for (const k of ROMAN) {
    const n = Number(obj[k]);
    if (Number.isFinite(n) && n > 0) out[k] = n;
  }
  return out;
}

const intOrZero = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : 0;
};

const intOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
};

const asTrend = (v: unknown): Trend | null =>
  v === "up" || v === "down" || v === "flat" ? v : null;

/** Rank: recent volume first, then worker positions — mirrors the SQL ORDER BY. */
function rankSponsors(a: SponsorRow, b: SponsorRow): number {
  return b.lca_count - a.lca_count || b.worker_positions - a.worker_positions;
}

/* -------------------------------- Postgres ------------------------------- */

// Cache the pool across hot reloads / invocations on the same lambda.
let poolPromise: Promise<import("pg").Pool> | null = null;

async function getPool(): Promise<import("pg").Pool> {
  if (!poolPromise) {
    poolPromise = import("pg").then(({ Pool }) => {
      const ssl =
        process.env.PGSSL === "disable"
          ? undefined
          : { rejectUnauthorized: false };
      return new Pool({ connectionString: process.env.DATABASE_URL, ssl });
    });
  }
  return poolPromise;
}

function mapDbRow(r: Record<string, unknown>): SponsorRow {
  const lastFiled = r.last_filed;
  return {
    employer: String(r.employer ?? ""),
    soc_code: String(r.soc_code ?? ""),
    soc_title: String(r.soc_title ?? ""),
    state: String(r.state ?? ""),
    lca_count: intOrZero(r.lca_count),
    worker_positions: intOrZero(r.worker_positions),
    median_wage: intOrNull(r.median_wage),
    wage_levels: normalizeWageLevels(r.wage_levels),
    prev_year_count: intOrZero(r.prev_year_count),
    trend: asTrend(r.trend),
    last_filed:
      lastFiled instanceof Date
        ? lastFiled.toISOString().slice(0, 10)
        : lastFiled
          ? String(lastFiled).slice(0, 10)
          : null,
  };
}

/* ---------------------------------- CSV ---------------------------------- */

const CSV_PATH = path.join(process.cwd(), "data", "h1b", "sponsors.csv");
let csvCache: Promise<SponsorRow[]> | null = null;

/** Minimal RFC-4180 line splitter — handles quoted fields and "" escapes. */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      out.push(field);
      field = "";
    } else {
      field += c;
    }
  }
  out.push(field);
  return out;
}

async function loadCsv(): Promise<SponsorRow[]> {
  if (!csvCache) {
    csvCache = (async () => {
      const text = await fs.readFile(CSV_PATH, "utf8");
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
      if (lines.length < 2) return [];
      const header = splitCsvLine(lines[0]);
      const idx = (name: string) => header.indexOf(name);
      const iEmployer = idx("employer");
      const iSoc = idx("soc_code");
      const iSocTitle = idx("soc_title");
      const iState = idx("state");
      const iLca = idx("lca_count");
      const iWorkers = idx("worker_positions");
      const iWage = idx("median_wage");
      const iLevels = idx("wage_levels");
      const iPrev = idx("prev_year_count");
      const iTrend = idx("trend");
      const iLast = idx("last_filed");

      const rows: SponsorRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const c = splitCsvLine(lines[i]);
        let levels: WageLevels = {};
        try {
          levels = normalizeWageLevels(JSON.parse(c[iLevels] || "{}"));
        } catch {
          levels = {};
        }
        rows.push({
          employer: (c[iEmployer] ?? "").trim(),
          soc_code: (c[iSoc] ?? "").trim(),
          soc_title: (c[iSocTitle] ?? "").trim(),
          state: (c[iState] ?? "").trim().toUpperCase(),
          lca_count: intOrZero(c[iLca]),
          worker_positions: intOrZero(c[iWorkers]),
          median_wage: intOrNull(c[iWage]),
          wage_levels: levels,
          prev_year_count: intOrZero(c[iPrev]),
          trend: asTrend((c[iTrend] ?? "").trim()),
          last_filed: (c[iLast] ?? "").trim() || null,
        });
      }
      return rows;
    })();
  }
  return csvCache;
}

/* ------------------------------ public API ------------------------------- */

/**
 * Resolve free-text role input to one or more SOC codes via soc_title ILIKE.
 * Returns [] when nothing matches.
 */
export async function resolveRoleCodes(role: string): Promise<string[]> {
  const q = role.trim();
  if (!q) return [];

  if (usingDatabase()) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `select distinct soc_code from sponsors where soc_title ilike '%' || $1 || '%'`,
      [q]
    );
    return rows.map((r) => String(r.soc_code));
  }

  const needle = q.toLowerCase();
  const all = await loadCsv();
  const codes = new Set<string>();
  for (const r of all) {
    if (r.soc_title.toLowerCase().includes(needle)) codes.add(r.soc_code);
  }
  return Array.from(codes);
}

/** Distinct {soc_code, soc_title} where soc_title ILIKE %q% — for autocomplete. */
export async function searchRoles(
  q: string,
  limit = ROLE_LIMIT
): Promise<RoleOption[]> {
  const term = q.trim();
  if (!term) return [];

  if (usingDatabase()) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `select distinct soc_code, soc_title
         from sponsors
        where soc_title ilike '%' || $1 || '%'
        order by soc_title
        limit $2`,
      [term, limit]
    );
    return rows.map((r) => ({
      soc_code: String(r.soc_code),
      soc_title: String(r.soc_title ?? ""),
    }));
  }

  const needle = term.toLowerCase();
  const all = await loadCsv();
  const seen = new Map<string, RoleOption>();
  for (const r of all) {
    if (!r.soc_title) continue;
    if (!r.soc_title.toLowerCase().includes(needle)) continue;
    const key = `${r.soc_code}|${r.soc_title}`;
    if (!seen.has(key)) seen.set(key, { soc_code: r.soc_code, soc_title: r.soc_title });
  }
  return Array.from(seen.values())
    .sort((a, b) => a.soc_title.localeCompare(b.soc_title))
    .slice(0, limit);
}

/**
 * Ranked sponsor list for a role (free text or already-resolved soc_codes) in a
 * state. Order: lca_count desc, worker_positions desc, limit 25.
 */
export async function getSponsors(opts: {
  role?: string;
  socCodes?: string[];
  state: string;
  limit?: number;
}): Promise<SponsorRow[]> {
  const state = opts.state.trim().toUpperCase();
  if (!state) return [];
  const limit = opts.limit ?? SPONSOR_LIMIT;

  const codes =
    opts.socCodes && opts.socCodes.length
      ? opts.socCodes
      : opts.role
        ? await resolveRoleCodes(opts.role)
        : [];
  if (!codes.length) return [];

  if (usingDatabase()) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `select employer, soc_code, soc_title, state, lca_count, worker_positions,
              median_wage, wage_levels, prev_year_count, trend, last_filed
         from sponsors
        where soc_code = any($1) and state = $2
        order by lca_count desc, worker_positions desc
        limit $3`,
      [codes, state, limit]
    );
    return rows.map(mapDbRow);
  }

  const codeSet = new Set(codes);
  const all = await loadCsv();
  return all
    .filter((r) => codeSet.has(r.soc_code) && r.state === state)
    .sort(rankSponsors)
    .slice(0, limit);
}

/** Look up the canonical {soc_code, soc_title} for a socSlug, or null. */
export async function roleForSlug(slug: string): Promise<RoleOption | null> {
  const target = slug.toLowerCase();

  if (usingDatabase()) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `select distinct soc_code, soc_title from sponsors where soc_title is not null`
    );
    const match = rows.find((r) => socSlug(String(r.soc_title)) === target);
    return match
      ? { soc_code: String(match.soc_code), soc_title: String(match.soc_title) }
      : null;
  }

  const all = await loadCsv();
  const match = all.find((r) => r.soc_title && socSlug(r.soc_title) === target);
  return match ? { soc_code: match.soc_code, soc_title: match.soc_title } : null;
}

/**
 * (role, state) combinations that actually have certified filings — powers
 * generateStaticParams for the programmatic SEO routes. Capped to keep the
 * static build bounded; busiest combinations first.
 */
export async function topRoleStatePairs(
  limit = 500
): Promise<{ socSlug: string; soc_title: string; state: string }[]> {
  type Agg = { soc_title: string; state: string; total: number };
  const agg = new Map<string, Agg>();

  const add = (soc_title: string, state: string, lca: number) => {
    if (!soc_title || !state) return;
    const key = `${socSlug(soc_title)}|${state}`;
    const cur = agg.get(key);
    if (cur) cur.total += lca;
    else agg.set(key, { soc_title, state, total: lca });
  };

  if (usingDatabase()) {
    const pool = await getPool();
    const { rows } = await pool.query(
      `select soc_title, state, sum(lca_count)::int as total
         from sponsors
        where soc_title is not null and lca_count > 0
        group by soc_title, state
        order by total desc
        limit $1`,
      [limit]
    );
    for (const r of rows) add(String(r.soc_title), String(r.state), intOrZero(r.total));
  } else {
    const all = await loadCsv();
    for (const r of all) {
      if (r.lca_count > 0) add(r.soc_title, r.state, r.lca_count);
    }
  }

  return Array.from(agg.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map((a) => ({ socSlug: socSlug(a.soc_title), soc_title: a.soc_title, state: a.state }));
}
