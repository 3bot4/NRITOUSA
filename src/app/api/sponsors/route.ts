import { NextResponse } from "next/server";
import { getSponsors } from "@/lib/h1b/sponsors";

/**
 * GET /api/sponsors?role=<text>&state=<XX>
 *
 * Resolves the role text to SOC code(s) via soc_title ILIKE, then returns the
 * ranked sponsor list for that role in the given state (lca_count desc,
 * worker_positions desc, limit 25). Reads Postgres when DATABASE_URL is set,
 * otherwise data/h1b/sponsors.csv. The DB is never reachable from the client.
 */

export const runtime = "nodejs";
// Sponsor data refreshes ~quarterly; cache aggressively, revalidate hourly.
export const revalidate = 3600;

const STATE_RE = /^[A-Za-z]{2}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = (searchParams.get("role") ?? "").trim();
  const state = (searchParams.get("state") ?? "").trim().toUpperCase();

  if (!role) {
    return NextResponse.json(
      { error: "Missing required ?role= parameter." },
      { status: 400 }
    );
  }
  if (!STATE_RE.test(state)) {
    return NextResponse.json(
      { error: "?state= must be a 2-letter US state code (e.g. CA)." },
      { status: 400 }
    );
  }

  try {
    const sponsors = await getSponsors({ role, state });
    return NextResponse.json({ role, state, count: sponsors.length, sponsors });
  } catch (err) {
    console.error("[/api/sponsors]", err);
    return NextResponse.json(
      { error: "Could not load sponsor data." },
      { status: 500 }
    );
  }
}
