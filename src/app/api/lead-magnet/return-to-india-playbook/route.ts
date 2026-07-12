import { NextResponse } from "next/server";

/**
 * Return-to-India Playbook lead-magnet endpoint.
 *
 * On a valid submission it:
 *   1. Upserts the contact in Brevo (https://developers.brevo.com/reference/createcontact),
 *      adding it to the Return-to-India list plus the general newsletter list.
 *   2. Sends the subscriber a transactional email with the PDF download link
 *      (https://developers.brevo.com/reference/sendtransacemail).
 *   3. Returns the public PDF path so the client can reveal a download button.
 *
 * The PDF link is never exposed before a valid submission. Fetch-only, no SDK —
 * same pattern as /api/lead-magnet and /api/newsletter.
 *
 * Configure (see .env.local.example):
 *   BREVO_API_KEY                   - Brevo API key (the normal API key, not MCP)
 *   BREVO_RETURN_TO_INDIA_LIST_ID   - numeric Brevo list id for this magnet
 *                                     (falls back to BREVO_LEAD_MAGNET_LIST_ID)
 *   BREVO_NEWSLETTER_LIST_ID        - general newsletter list id (defaults to 5)
 *   BREVO_SENDER_EMAIL              - verified Brevo sender email
 *                                     (falls back to CONTRIBUTE_EMAIL_FROM)
 *   BREVO_SENDER_NAME              - sender display name
 *                                     (falls back to CONTRIBUTE_EMAIL_FROM_NAME)
 */

export const runtime = "nodejs";

/** Public path to the playbook PDF in /public (exact file name). */
const PLAYBOOK_PDF_PATH = "/The_Ultimate_Return_to_India_Playbook_2026.pdf";
const PLAYBOOK_PDF_URL = "https://www.nritousa.com" + PLAYBOOK_PDF_PATH;
const HUB_URL = "https://www.nritousa.com/return-to-india";
const LEAD_MAGNET = "return_to_india_playbook_2026";

interface Payload {
  email?: string;
  firstName?: string;
  sourcePath?: string;
  leadMagnet?: string;
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

/** Send the PDF email. Non-fatal: a delivery hiccup must not fail the signup
 *  (the contact is already stored and the client shows the download link). */
async function sendPlaybookEmail(apiKey: string, email: string, firstName: string) {
  const fromEmail =
    process.env.BREVO_SENDER_EMAIL ??
    process.env.CONTRIBUTE_EMAIL_FROM ??
    // Verified NRItoUSA sender in Brevo — safe default so the PDF email works
    // even before BREVO_SENDER_EMAIL is set. Override via env any time.
    "team@nritousa.com";
  const fromName =
    process.env.BREVO_SENDER_NAME ??
    process.env.CONTRIBUTE_EMAIL_FROM_NAME ??
    "NRI to USA";

  if (!fromEmail) {
    console.error(
      "Return-to-India playbook: no sender configured (BREVO_SENDER_EMAIL / CONTRIBUTE_EMAIL_FROM). Skipping email."
    );
    return;
  }

  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
  const html = `
    <p>${greeting}</p>
    <p>Here is your free 2026 Return-to-India Playbook:</p>
    <p><a href="${PLAYBOOK_PDF_URL}" style="display:inline-block;background:#1e40f5;color:#ffffff;padding:12px 20px;border-radius:10px;font-weight:600;text-decoration:none">Download the PDF checklist</a></p>
    <p>Or copy this link: <a href="${PLAYBOOK_PDF_URL}">${PLAYBOOK_PDF_URL}</a></p>
    <p>Inside, you&rsquo;ll find a personal, financial, tax, banking, 401(k), RNOR, property, repatriation, immigration, and first-90-days checklist for NRIs moving back to India.</p>
    <p>Start the full Return-to-India hub here:<br><a href="${HUB_URL}">${HUB_URL}</a></p>
    <hr>
    <p style="font-size:12px;color:#6b7280">Educational information only &mdash; not tax, legal, immigration, financial, or investment advice.</p>
    <p style="font-size:12px;color:#6b7280">NRItoUSA.com</p>
  `;

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
        to: [{ email, ...(firstName ? { name: firstName } : {}) }],
        subject: "Your 2026 Return-to-India Playbook PDF",
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("Return-to-India playbook email error:", res.status, detail);
    }
  } catch (err) {
    console.error("Return-to-India playbook email request failed:", err);
  }
}

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
  const sourcePath = (body.sourcePath ?? "").trim().slice(0, 200);

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("Return-to-India playbook: BREVO_API_KEY is not set.");
    return NextResponse.json(
      { error: "Downloads are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  // Dedicated "Brevo_Return_TO_India_List_ID" list (id 23) is the default so the
  // magnet works out of the box; override via BREVO_RETURN_TO_INDIA_LIST_ID.
  const returnListId = Number(
    process.env.BREVO_RETURN_TO_INDIA_LIST_ID ??
      process.env.BREVO_LEAD_MAGNET_LIST_ID ??
      23
  );
  // This is a shared multi-brand Brevo account, so we DON'T dump these leads
  // into the generic newsletter list by default — only add a second list when
  // one is explicitly configured for NRItoUSA.
  const newsletterListId = Number(process.env.BREVO_NEWSLETTER_LIST_ID ?? 0);
  const listIds = [returnListId, ...(newsletterListId ? [newsletterListId] : [])]
    .filter((id) => Number.isFinite(id) && id > 0);

  // Segmentation attributes. Unknown attributes are ignored by Brevo, so this
  // stays safe whether or not the account has them defined.
  const attributes: Record<string, string> = {
    LEAD_MAGNET: LEAD_MAGNET,
    WEBSITE: "nritousa",
  };
  if (firstName) attributes.FIRSTNAME = firstName;
  if (sourcePath) attributes.SOURCE = sourcePath;

  let contactStored = false;
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

    if (res.ok) {
      contactStored = true;
    } else {
      // Existing contacts sometimes come back as 400 "duplicate_parameter" even
      // with updateEnabled — treat that as success (they still get the PDF).
      const detail = await res.json().catch(() => null);
      const code = detail?.code as string | undefined;
      if (code === "duplicate_parameter") {
        contactStored = true;
      } else {
        console.error("Brevo return-to-india contact error:", res.status, detail);
        return NextResponse.json(
          { error: "Could not process your request right now. Please try again shortly." },
          { status: 502 }
        );
      }
    }
  } catch (err) {
    console.error("Brevo return-to-india request failed:", err);
    return NextResponse.json(
      { error: "Could not process your request right now. Please try again shortly." },
      { status: 502 }
    );
  }

  if (contactStored) {
    // Non-fatal — the signup already succeeded even if delivery hiccups.
    await sendPlaybookEmail(apiKey, email, firstName);
  }

  return NextResponse.json({ ok: true, pdf: PLAYBOOK_PDF_PATH });
}
