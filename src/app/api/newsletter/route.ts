import { NextResponse } from "next/server";

/**
 * Newsletter signup endpoint.
 *
 * Adds the submitted email to a Brevo contact list via the REST API
 * (https://developers.brevo.com/reference/createcontact) — no SDK, just fetch.
 * Configure (see .env.local.example):
 *   BREVO_API_KEY         - Brevo API key (the normal API key, not the MCP key)
 *   BREVO_NEWSLETTER_LIST_ID - numeric Brevo list id (defaults to 5,
 *                              "Newsletter Subscribers")
 */

export const runtime = "nodejs";

interface Payload {
  email?: string;
  /** Honeypot — must stay empty. Bots fill it; humans never see it. */
  company?: string;
  /** Optional provenance tag, e.g. "immigration-tracker". */
  source?: string;
  /** Optional list of interest ids the user opted into. */
  interests?: string[];
  /** Optional self-reported immigration status (free choice from a fixed list). */
  status?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn anything.
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

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("Newsletter: BREVO_API_KEY is not set.");
    return NextResponse.json(
      { error: "Signups are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID ?? 5);

  // Optional segmentation tags. These map to Brevo contact attributes; if the
  // attributes don't exist in the Brevo account they are simply ignored, so
  // this stays safe whether or not segmentation is configured.
  // TODO(backend): create SOURCE / INTERESTS / IMMIGRATION_STATUS attributes in
  // Brevo (and optionally a tracker list via BREVO_TRACKER_LIST_ID) to persist
  // and segment these. Until then, email signup still works.
  const attributes: Record<string, string> = {};
  if (typeof body.source === "string" && body.source.trim()) {
    attributes.SOURCE = body.source.trim().slice(0, 100);
  }
  if (Array.isArray(body.interests) && body.interests.length) {
    attributes.INTERESTS = body.interests.join(",").slice(0, 255);
  }
  if (typeof body.status === "string" && body.status.trim()) {
    attributes.IMMIGRATION_STATUS = body.status.trim().slice(0, 100);
  }

  const trackerListId = Number(process.env.BREVO_TRACKER_LIST_ID ?? 0);
  const listIds =
    body.source === "immigration-tracker" && trackerListId
      ? [listId, trackerListId]
      : [listId];

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
        ...(Object.keys(attributes).length ? { attributes } : {}),
      }),
    });

    // 201 = created, 204 = updated existing contact. Brevo also returns
    // 400 "Contact already exist" for some accounts even with updateEnabled —
    // treat an existing contact as success, not an error.
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      const code = detail?.code as string | undefined;
      if (code === "duplicate_parameter") {
        return NextResponse.json({ ok: true, message: "You're already subscribed." });
      }
      console.error("Brevo newsletter error:", res.status, detail);
      return NextResponse.json(
        { error: "Could not subscribe you right now. Please try again shortly." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Brevo newsletter request failed:", err);
    return NextResponse.json(
      { error: "Could not subscribe you right now. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: "You're subscribed — welcome!" });
}
