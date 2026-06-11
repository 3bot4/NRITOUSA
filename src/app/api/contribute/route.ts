import { NextResponse } from "next/server";

/**
 * Contributor submission endpoint.
 *
 * Emails the submission to CONTRIBUTE_EMAIL_TO using Brevo's transactional
 * email API (https://developers.brevo.com/reference/sendtransacemail) — no SDK
 * dependency, just fetch. Configure (see .env.local.example):
 *   BREVO_API_KEY              - Brevo API key (the normal API key, not MCP)
 *   CONTRIBUTE_EMAIL_TO        - where submissions are delivered
 *   CONTRIBUTE_EMAIL_FROM      - verified Brevo sender email
 *   CONTRIBUTE_EMAIL_FROM_NAME - sender display name (optional)
 *   CONTRIBUTE_REPLY_TO        - fallback reply-to (optional; the submitter's
 *                                email is used as reply-to when present)
 */

export const runtime = "nodejs";

interface Payload {
  name?: string;
  email?: string;
  linkedin?: string;
  role?: string;
  topic?: string;
  story?: string;
  agree?: boolean;
  /** Honeypot — must stay empty. Bots fill it; humans never see it. */
  company?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const escapeHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const linkedin = (body.linkedin ?? "").trim();
  const role = (body.role ?? "").trim();
  const topic = (body.topic ?? "").trim();
  const story = (body.story ?? "").trim();

  const errors: string[] = [];
  if (!name) errors.push("Name is required.");
  if (!isEmail(email)) errors.push("A valid email is required.");
  if (!/^https?:\/\/.+/.test(linkedin))
    errors.push("A valid LinkedIn URL is required.");
  if (!topic) errors.push("A proposed title or topic is required.");
  if (story.length < 30)
    errors.push("Please share a bit more about your story.");
  if (!body.agree) errors.push("Please agree to the contributor guidelines.");

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 422 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.CONTRIBUTE_EMAIL_TO;
  const fromEmail = process.env.CONTRIBUTE_EMAIL_FROM;
  const fromName = process.env.CONTRIBUTE_EMAIL_FROM_NAME ?? "NRI to USA";
  const fallbackReplyTo = process.env.CONTRIBUTE_REPLY_TO;

  if (!apiKey || !to || !fromEmail) {
    // Misconfiguration is an operator problem, not the visitor's fault.
    console.error(
      "Contribute form: BREVO_API_KEY, CONTRIBUTE_EMAIL_TO, and/or CONTRIBUTE_EMAIL_FROM are not set."
    );
    return NextResponse.json(
      { error: "Submissions are temporarily unavailable. Please email us." },
      { status: 503 }
    );
  }

  const html = `
    <h2>New contributor submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>LinkedIn:</strong> ${escapeHtml(linkedin)}</p>
    <p><strong>Role/Title:</strong> ${escapeHtml(role) || "—"}</p>
    <p><strong>Proposed title/topic:</strong> ${escapeHtml(topic)}</p>
    <p><strong>Story:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(story)}</p>
  `;

  const replyToEmail = email || fallbackReplyTo;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: to }],
        ...(replyToEmail ? { replyTo: { email: replyToEmail, name } } : {}),
        subject: `New contributor: ${name} — ${topic}`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Brevo error:", res.status, detail);
      return NextResponse.json(
        { error: "Could not send your submission. Please try again shortly." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Brevo request failed:", err);
    return NextResponse.json(
      { error: "Could not send your submission. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
