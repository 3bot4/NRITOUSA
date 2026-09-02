import { NextResponse } from "next/server";
import {
  getEmployerExplorer,
  rowsToCsv,
  DEFAULT_PAGE_SIZE,
  MAX_EXPORT_ROWS,
  type EmployerSort,
  type SortDir,
} from "@/lib/h1b/explorer";

/**
 * GET /api/h1b-employers
 *
 * Browse the H-1B employer rollup. Every filter is optional — with no params it
 * returns the national leaderboard, which is what the tool page opens on.
 *
 *   q=<employer substring>  state=<XX>  role=<occupation substring>
 *   wageMin=<usd>  wageMax=<usd>  minFilings=<n>
 *   sort=filings|positions|wage|employer  dir=asc|desc
 *   page=<n>  pageSize=<n>
 *   format=csv  → the filtered leaderboard as a CSV download (capped)
 *
 * Reads Postgres when DATABASE_URL is set, otherwise data/h1b/sponsors.csv.
 */

export const runtime = "nodejs";
// Sponsor data refreshes ~quarterly; cache aggressively, revalidate hourly.
export const revalidate = 3600;

const SORTS: EmployerSort[] = ["filings", "positions", "wage", "employer"];
const STATE_RE = /^[A-Za-z]{2}$/;

const num = (v: string | null): number | undefined => {
  if (v == null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isCsv = searchParams.get("format") === "csv";

  const stateRaw = (searchParams.get("state") ?? "").trim();
  const sortRaw = (searchParams.get("sort") ?? "") as EmployerSort;
  const dirRaw = (searchParams.get("dir") ?? "").trim();

  const filters = {
    q: (searchParams.get("q") ?? "").trim().slice(0, 120),
    state: STATE_RE.test(stateRaw) ? stateRaw.toUpperCase() : "",
    role: (searchParams.get("role") ?? "").trim().slice(0, 120),
    wageMin: num(searchParams.get("wageMin")),
    wageMax: num(searchParams.get("wageMax")),
    minFilings: num(searchParams.get("minFilings")),
    sort: SORTS.indexOf(sortRaw) >= 0 ? sortRaw : ("filings" as EmployerSort),
    dir: (dirRaw === "asc" || dirRaw === "desc" ? dirRaw : undefined) as
      | SortDir
      | undefined,
    page: isCsv ? 1 : num(searchParams.get("page")),
    pageSize: isCsv ? MAX_EXPORT_ROWS : num(searchParams.get("pageSize")) ?? DEFAULT_PAGE_SIZE,
  };

  try {
    const result = await getEmployerExplorer(filters);

    if (isCsv) {
      const csv = rowsToCsv(result.rows);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="h1b-sponsors.csv"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/h1b-employers]", err);
    return NextResponse.json(
      { error: "Could not load employer data." },
      { status: 500 }
    );
  }
}
