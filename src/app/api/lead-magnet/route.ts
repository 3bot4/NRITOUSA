import { NextResponse } from "next/server";

/**
 * Lead-magnet signup endpoint (Free Immigrant Wealth Guide).
 *
 * Adds the submitted email to a Brevo contact list via the REST API
 * (https://developers.brevo.com/reference/createcontact) — the same fetch-only
 * pattern as /api/newsletter, plus a first name and a "lead-magnet" source tag.
 * On success it returns the public PDF path so the client can show a download
 * button. The PDF link is never exposed before a valid submission.
 *
 * Configure (see .env.local.example):
 *   BREVO_API_KEY            - Brevo API key (the normal API key, not the MCP key)
 *   BREVO_NEWSLETTER_LIST_ID - numeric Brevo list id (defaults to 5)
 *   BREVO_LEAD_MAGNET_LIST_ID - optional extra list id for lead-magnet signups
 */

export const runtime = "nodejs";

/** Public path to the guide PDF in /public. */
const GUIDE_PDF_PATH = "/free-immigrant-wealth-guide.pdf";

interface Payload {
  email?: string;
  firstName?: string;
  /** Honeypot — must stay empty. Bots fill it; humans never see it. */
  company?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn anything (no PDF path).
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 }
    );
  }
  const firstName = (body.firstName ?? "").trim().slice(0, 80);

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("Lead magnet: BREVO_API_KEY is not set.");
    return NextResponse.json(
      { error: "Downloads are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID ?? 5);
  const leadMagnetListId = Number(process.env.BREVO_LEAD_MAGNET_LIST_ID ?? 0);
  const listIds = leadMagnetListId ? [listId, leadMagnetListId] : [listId];

  // Segmentation attributes. If they don't exist on the Brevo account they're
  // ignored, so this is safe whether or not segmentation is configured.
  const attributes: Record<string, string> = { SOURCE: "lead-magnet" };
  if (firstName) attributes.FIRSTNAME = firstName;

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        listIds,
        updateEnabled: true,
        attributes,
      }),
    });

    // Brevo returns 400 "duplicate_parameter" for already-known contacts even
    // with updateEnabled on some accounts — treat that as success (they still
    // get the guide).
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      const code = detail?.code as string | undefined;
      if (code === "duplicate_parameter") {
        return NextResponse.json({ ok: true, pdf: GUIDE_PDF_PATH });
      }
      console.error("Brevo lead-magnet error:", res.status, detail);
      return NextResponse.json(
        { error: "Could not process your request right now. Please try again shortly." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Brevo lead-magnet request failed:", err);
    return NextResponse.json(
      { error: "Could not process your request right now. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, pdf: GUIDE_PDF_PATH });
}
