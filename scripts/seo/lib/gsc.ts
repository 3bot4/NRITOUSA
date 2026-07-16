/**
 * Search Console CSV import.
 *
 * Reads the ZIP-export CSVs that Search Console produces ("Export → CSV" on the
 * Performance report unzips to Queries.csv / Pages.csv / Countries.csv /
 * Devices.csv / Dates.csv, plus "Filters.csv"). No API credentials are needed
 * or wanted: the repo has no approved Google integration, and an OAuth flow is
 * a much larger surface than a folder of CSVs.
 *
 * Raw exports stay OUT of git and OUT of the deployed bundle (see .gitignore
 * and .vercelignore). Only the normalized, aggregate report is written to
 * reports/, and nothing under reports/ is imported by src/.
 *
 * Search Console localizes CSV headers and varies them by report, so columns
 * are matched by fuzzy alias rather than exact string. Missing columns are
 * tolerated — a Pages.csv with no "Position" column still imports, with
 * position left null rather than zero (0 would score as rank #1, which is the
 * kind of silent lie that poisons a prioritization list).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";

/* ------------------------------------------------------------------ *
 * CSV parsing (RFC 4180: quoted fields, embedded commas/newlines)
 * ------------------------------------------------------------------ */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  // Strip UTF-8 BOM — Search Console exports carry one and it corrupts the
  // first header cell ("﻿Query" never matches the "query" alias).
  const s = text.replace(/^﻿/, "");

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

/* ------------------------------------------------------------------ *
 * Column resolution
 * ------------------------------------------------------------------ */

const ALIASES: Record<string, string[]> = {
  query: ["query", "queries", "search query", "top queries"],
  page: ["page", "pages", "url", "landing page", "top pages"],
  country: ["country", "countries"],
  device: ["device", "devices"],
  date: ["date", "dates"],
  clicks: ["clicks", "url clicks"],
  impressions: ["impressions", "impr", "impr."],
  ctr: ["ctr", "click through rate", "site ctr", "url ctr"],
  position: ["position", "avg. position", "average position", "avg position"],
};

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

function resolveColumns(header: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  header.forEach((h, i) => {
    const n = norm(h);
    for (const [key, aliases] of Object.entries(ALIASES)) {
      if (key in map) continue;
      if (aliases.includes(n)) map[key] = i;
    }
  });
  return map;
}

/** "1.83%" → 0.0183 · "0.9" → 0.009 when it is clearly a percent string. */
function parseCtr(raw: string): number | null {
  if (!raw) return null;
  const isPct = raw.includes("%");
  const n = Number(raw.replace(/[%\s,]/g, ""));
  if (!Number.isFinite(n)) return null;
  return isPct ? n / 100 : n;
}

function parseNum(raw: string): number | null {
  if (raw == null || raw.trim() === "") return null;
  const n = Number(raw.replace(/[,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/* ------------------------------------------------------------------ *
 * Rows
 * ------------------------------------------------------------------ */

export interface GscRow {
  /** Which CSV this came from ("queries" | "pages" | "devices" | ...). */
  dimension: string;
  query: string | null;
  /** Root-relative path when the URL is on-site; raw value otherwise. */
  page: string | null;
  country: string | null;
  device: string | null;
  date: string | null;
  clicks: number;
  impressions: number;
  /** Fraction (0.0183 = 1.83%). Recomputed when absent and derivable. */
  ctr: number | null;
  position: number | null;
}

/** Absolute on-site URL → path. Leaves off-site/odd values untouched. */
export function toPath(url: string, siteUrl: string): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    const host = new URL(siteUrl).host.replace(/^www\./, "");
    if (u.host.replace(/^www\./, "") !== host) return url;
    // Trailing slash is normalized away so "/foo/" and "/foo" aggregate
    // together; "/" itself is preserved.
    const p = u.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  } catch {
    return url;
  }
}

/** Infer the dimension from the export's filename. */
function dimensionOf(file: string): string {
  const n = norm(basename(file, extname(file)));
  if (n.includes("quer")) return "queries";
  if (n.includes("page") || n.includes("url")) return "pages";
  if (n.includes("countr")) return "countries";
  if (n.includes("device")) return "devices";
  if (n.includes("date")) return "dates";
  if (n.includes("filter")) return "filters";
  return n;
}

export interface ImportResult {
  rows: GscRow[];
  files: { file: string; dimension: string; rows: number; skipped: number }[];
  warnings: string[];
}

export function importDir(dir: string, siteUrl: string): ImportResult {
  if (!existsSync(dir)) {
    throw new Error(
      `No such directory: ${dir}\n` +
        `Put the unzipped Search Console CSVs there, e.g.\n` +
        `  seo-data/gsc/2026-07-16/{Queries,Pages,Devices,Countries,Dates}.csv`,
    );
  }

  const csvs = readdirSync(dir).filter((f) => extname(f).toLowerCase() === ".csv");
  const rows: GscRow[] = [];
  const files: ImportResult["files"] = [];
  const warnings: string[] = [];

  if (csvs.length === 0) warnings.push(`No .csv files found in ${dir}`);

  for (const name of csvs.sort()) {
    const dimension = dimensionOf(name);
    if (dimension === "filters") continue; // metadata, not measurements

    const table = parseCsv(readFileSync(join(dir, name), "utf8"));
    if (table.length < 2) {
      warnings.push(`${name}: no data rows`);
      continue;
    }

    const cols = resolveColumns(table[0]);
    if (cols.clicks == null && cols.impressions == null) {
      warnings.push(
        `${name}: no clicks/impressions column (header: ${table[0].join(" | ")}) — skipped`,
      );
      continue;
    }
    for (const need of ["ctr", "position"]) {
      if (cols[need] == null) {
        warnings.push(`${name}: no "${need}" column — left null for these rows`);
      }
    }

    let kept = 0;
    let skipped = 0;
    for (const r of table.slice(1)) {
      const cell = (k: string) => (cols[k] == null ? "" : (r[cols[k]] ?? ""));
      const clicks = parseNum(cell("clicks")) ?? 0;
      const impressions = parseNum(cell("impressions")) ?? 0;
      if (clicks === 0 && impressions === 0) {
        skipped++;
        continue;
      }
      const rawPage = cell("page");
      const ctr = parseCtr(cell("ctr"));
      rows.push({
        dimension,
        query: cell("query") || null,
        page: rawPage ? toPath(rawPage, siteUrl) : null,
        country: cell("country") || null,
        device: cell("device")?.toLowerCase() || null,
        date: cell("date") || null,
        clicks,
        impressions,
        ctr: ctr ?? (impressions > 0 ? clicks / impressions : null),
        position: parseNum(cell("position")),
      });
      kept++;
    }
    files.push({ file: name, dimension, rows: kept, skipped });
  }

  return { rows, files, warnings };
}

/* ------------------------------------------------------------------ *
 * Period comparison
 * ------------------------------------------------------------------ */

export interface Delta {
  current: number;
  previous: number | null;
  change: number | null;
  changePct: number | null;
}

export function delta(current: number, previous: number | null): Delta {
  if (previous == null) {
    return { current, previous: null, change: null, changePct: null };
  }
  const change = current - previous;
  return {
    current,
    previous,
    change,
    // Growth from zero is undefined, not infinite — leave it null so the
    // scorer can't rank a 0→1 click page above everything else.
    changePct: previous === 0 ? null : (change / previous) * 100,
  };
}
