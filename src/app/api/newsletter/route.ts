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
        listIds: [listId],
        updateEnabled: true,
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
