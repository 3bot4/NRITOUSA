/**
 * GET /api/data-status
 *
 * Returns a JSON freshness report for every data source the site depends on.
 * Use this with any uptime/monitoring service (UptimeRobot, Better Uptime, etc.)
 * to get alerted when data goes stale or pipelines fail.
 *
 * Response shape:
 *   { generatedAt, overall: "ok"|"warn"|"degraded", sources: [...], recentFailures: [...] }
 *
 * Thresholds:
 *   Market data      → stale after 12 hours (automated 2x/day)
 *   Visa Bulletin    → stale after 35 days  (published ~2nd week each month)
 *   H-1B LCA data   → stale after 180 days (DOL quarterly disclosure)
 *   I-485 Inventory  → stale after 180 days (USCIS irregular)
 */

import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

type Status = "ok" | "warn" | "stale" | "missing" | "degraded";

interface SourceStatus {
  key: string;
  label: string;
  lastUpdated: string | null;
  maxAgeDays: number | null;
  ageDays: number | null;
  status: Status;
  notes?: string[];
}

interface FailedJob {
  job: string;
  dataKey: string;
  label: string;
  timestamp: string;
  error: string;
  retainedStaleValue: number | null;
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function ageDays(isoDateOrTs: string): number {
  // Accept both "YYYY-MM-DD" and full ISO timestamps.
  const ts = isoDateOrTs.length === 10
    ? Date.parse(isoDateOrTs + "T12:00:00Z")
    : Date.parse(isoDateOrTs);
  return (Date.now() - ts) / 86_400_000;
}

function ageStatus(days: number, maxDays: number): Status {
  return days <= maxDays ? "ok" : "stale";
}

function countTodos(obj: unknown): number {
  if (typeof obj !== "object" || obj === null) return 0;
  let n = 0;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (k.endsWith("Todo") && v === true) n++;
    else n += countTodos(v);
  }
  return n;
}

export async function GET() {
  const root = process.cwd();
  const sources: SourceStatus[] = [];

  // ── 1. Market data — RETIRED, intentionally not monitored ────────────────
  // The twice-daily refresh workflow was removed on 2026-07-20: no page renders
  // USD/INR, NIFTY 50, S&P 500 or gold any more. The homepage ticker carries
  // immigration figures only, and its "as of" label now derives from the visa
  // bulletin and processing-times feeds rather than the market timestamp.
  //
  // data/market.json is left in place (still imported by lib/market.ts) but is
  // deliberately absent from this report: with nothing refreshing it, a 12-hour
  // threshold would raise a stale alert every day forever and train whoever
  // watches this endpoint to ignore it. Restore this block only alongside a
  // job that actually updates the file.

  // ── 2. Visa Bulletin (monthly, threshold 35 days) ─────────────────────────
  const vb = readJson<Record<string, unknown> | null>(
    join(root, "data", "visa-bulletin", "current.json"),
    null
  );
  if (!vb) {
    sources.push({ key: "visa-bulletin", label: "Visa Bulletin", lastUpdated: null, maxAgeDays: 35, ageDays: null, status: "missing" });
  } else {
    const days = ageDays(vb.lastUpdated as string);
    const todoCount = countTodos(vb.categories);
    const notes: string[] = [];
    if (todoCount > 0) notes.push(`${todoCount} field(s) marked todo:true — must be verified against official bulletin`);
    sources.push({
      key: "visa-bulletin",
      label: `Visa Bulletin (${vb.bulletinMonth})`,
      lastUpdated: vb.lastUpdated as string,
      maxAgeDays: 35,
      ageDays: Math.round(days * 10) / 10,
      status: todoCount > 0 ? "warn" : ageStatus(days, 35),
      ...(notes.length && { notes }),
    });
  }

  // ── 3. H-1B LCA data (DOL quarterly, threshold 180 days) ─────────────────
  const h1bPath = join(root, "public", "data", "h1b", "explorer.json");
  if (!existsSync(h1bPath)) {
    sources.push({ key: "h1b-lca", label: "H-1B LCA Salary Data", lastUpdated: null, maxAgeDays: 180, ageDays: null, status: "missing" });
  } else {
    const h1b = readJson<Record<string, unknown> | null>(h1bPath, null);
    const lastUpdated = h1b?.lastUpdated as string | undefined;
    const days = lastUpdated ? ageDays(lastUpdated) : null;
    sources.push({
      key: "h1b-lca",
      label: `H-1B LCA Salary Data (${(h1b?.period as string) ?? "unknown"})`,
      lastUpdated: lastUpdated ?? null,
      maxAgeDays: 180,
      ageDays: days !== null ? Math.round(days * 10) / 10 : null,
      status: days === null ? "warn" : ageStatus(days, 180),
      notes: h1b?.recordsKept
        ? [`${(h1b.recordsKept as number).toLocaleString()} records from ${h1b.source}`]
        : undefined,
    });
  }

  // ── 4. I-485 Inventory (USCIS irregular, threshold 180 days) ─────────────
  const i485 = readJson<Record<string, unknown> | null>(
    join(root, "data", "i485-inventory", "current.json"),
    null
  );
  if (!i485) {
    sources.push({ key: "i485-inventory", label: "I-485 Pending Inventory", lastUpdated: null, maxAgeDays: 180, ageDays: null, status: "missing" });
  } else {
    const lastUpdated = i485.lastUpdated as string | undefined;
    const days = lastUpdated ? ageDays(lastUpdated) : null;
    const notes: string[] = [];
    if (i485.todo) notes.push("Marked todo:true — counts must be verified against official USCIS spreadsheet");
    sources.push({
      key: "i485-inventory",
      label: `I-485 Pending Inventory (snapshot: ${i485.snapshotDate})`,
      lastUpdated: lastUpdated ?? null,
      maxAgeDays: 180,
      ageDays: days !== null ? Math.round(days * 10) / 10 : null,
      status: i485.todo ? "warn" : days === null ? "missing" : ageStatus(days, 180),
      ...(notes.length && { notes }),
    });
  }

  // ── Recent pipeline failures ──────────────────────────────────────────────
  const recentFailures = readJson<FailedJob[]>(
    join(root, "data", "failed_jobs.json"),
    []
  ).slice(-10);

  // ── Overall status ────────────────────────────────────────────────────────
  const overall: Status =
    sources.some((s) => s.status === "stale" || s.status === "missing")
      ? "degraded"
      : sources.some((s) => s.status === "warn")
      ? "warn"
      : "ok";

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      overall,
      sources,
      recentFailures,
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
