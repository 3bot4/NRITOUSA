import { NextResponse } from "next/server";
import { searchRoles } from "@/lib/h1b/sponsors";
import { searchRoleTitles } from "@/lib/h1b/explorer";

/**
 * GET /api/roles?q=<text>
 *
 * Distinct {soc_code, soc_title} where soc_title ILIKE %q% (limit 10) — powers
 * the role autocomplete in the H-1B Sponsor Finder. Reads Postgres when
 * DATABASE_URL is set, otherwise data/h1b/sponsors.csv.
 *
 * With ?titles=1 it returns distinct occupation *titles* ranked by filing
 * volume instead. The explorer filters on title (the DOL data carries one
 * occupation under several dirty SOC codes), so a code-keyed list would repeat
 * the same title several times and bury the busy occupations alphabetically.
 */

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ q, roles: [], titles: [] });
  }

  try {
    if (searchParams.get("titles") === "1") {
      const titles = await searchRoleTitles(q);
      return NextResponse.json({ q, titles });
    }
    const roles = await searchRoles(q);
    return NextResponse.json({ q, roles });
  } catch (err) {
    console.error("[/api/roles]", err);
    return NextResponse.json(
      { error: "Could not load role data." },
      { status: 500 }
    );
  }
}
