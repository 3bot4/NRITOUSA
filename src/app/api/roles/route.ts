import { NextResponse } from "next/server";
import { searchRoles } from "@/lib/h1b/sponsors";

/**
 * GET /api/roles?q=<text>
 *
 * Distinct {soc_code, soc_title} where soc_title ILIKE %q% (limit 10) — powers
 * the role autocomplete in the H-1B Sponsor Finder. Reads Postgres when
 * DATABASE_URL is set, otherwise data/h1b/sponsors.csv.
 */

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ q, roles: [] });
  }

  try {
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
