import { NextResponse } from "next/server";

/**
 * Anonymous NRI life-decision poll endpoint.
 *
 * Receives voluntary, anonymous submissions from the USCIS Life Decision
 * Checklist tool and sends them as a digest email via Brevo. No personal
 * immigration identifiers are accepted (no receipt numbers, A-numbers, DOB,
 * passport, employer name, or exact address).
 *
 * Configure (see .env.local.example):
 *   BREVO_API_KEY            - Brevo API key
 *   POLL_EMAIL_TO            - destination email for poll digest (defaults to
 *                              CONTRIBUTE_EMAIL_TO if set, else site owner)
 *   POLL_EMAIL_FROM          - verified Brevo sender email
 *   POLL_EMAIL_FROM_NAME     - sender name (optional)
 *
 * TODO (backend integration):
 *   - Replace email-based logging with a Supabase table insert:
 *       supabase.from('nri_poll_responses').insert({ ...payload })
 *   - Add a GET /api/poll/aggregated route for the community page
 *   - Rate-limit by IP (1 submission per hour) using upstash/ratelimit
 *   - Add a cron job to send weekly digest emails from aggregated data
 */

export const runtime = "nodejs";

interface PollPayload {
  city?: string;
  visaCategory?: string;
  decisionType?: string;
  biggestConcern?: string;
  email?: string;
  /** Honeypot */
  company?: string;
}

const ALLOWED_CONCERNS = new Set([
  "job-security", "priority-date", "travel", "family-income",
  "house-stability", "children", "business", "attorney-access", "other",
]);

const ALLOWED_DECISIONS = new Set([
  "change-job", "buy-house", "travel-india", "side-business", "move-state",
  "renew-h1b", "h4-ead", "file-i485", "kids-aging-out", "other", "",
]);

const ALLOWED_STATUSES = new Set([
  "h1b", "h4", "h4-ead", "f1-opt", "i485-pending",
  "ead-ap", "green-card", "other", "",
]);

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (v: unknown): string =>
  typeof v === "string" ? v.trim().slice(0, 100) : "";
const escHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(request: Request) {
  let body: PollPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const city = clean(body.city);
  const decisionType = ALLOWED_DECISIONS.has(clean(body.decisionType))
    ? clean(body.decisionType)
    : "unknown";
  const visaCategory = ALLOWED_STATUSES.has(clean(body.visaCategory))
    ? clean(body.visaCategory)
    : "unknown";
  const biggestConcern = ALLOWED_CONCERNS.has(clean(body.biggestConcern))
    ? clean(body.biggestConcern)
    : "";
  const email = clean(body.email);
  const emailValid = email && isEmail(email);

  // TODO: database insert here
  // await db.insert('nri_poll_responses', {
  //   city, decision_type: decisionType, visa_category: visaCategory,
  //   biggest_concern: biggestConcern,
  //   email: emailValid ? email : null,
  //   submitted_at: new Date().toISOString(),
  // });

  // Email-based logging via Brevo (same pattern as contribute/newsletter routes)
  const apiKey = process.env.BREVO_API_KEY;
  const emailTo = process.env.POLL_EMAIL_TO ?? process.env.CONTRIBUTE_EMAIL_TO;
  const emailFrom = process.env.POLL_EMAIL_FROM ?? process.env.CONTRIBUTE_EMAIL_FROM;

  if (apiKey && emailTo && emailFrom) {
    const html = `
      <h2>New NRI Life Decision Poll Submission</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Decision</strong></td><td>${escHtml(decisionType)}</td></tr>
        <tr><td><strong>Visa status</strong></td><td>${escHtml(visaCategory)}</td></tr>
        <tr><td><strong>Biggest concern</strong></td><td>${escHtml(biggestConcern)}</td></tr>
        <tr><td><strong>City (opt)</strong></td><td>${escHtml(city || "—")}</td></tr>
        <tr><td><strong>Email (opt)</strong></td><td>${escHtml(emailValid ? email : "—")}</td></tr>
      </table>
    `.trim();

    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: process.env.POLL_EMAIL_FROM_NAME ?? "NRItoUSA Polls",
            email: emailFrom,
          },
          to: [{ email: emailTo }],
          subject: `[NRI Poll] ${decisionType} | ${visaCategory}`,
          htmlContent: html,
        }),
      });
    } catch {
      // Email failure is non-fatal — submission still accepted
    }

    // If submitter left email and wants updates, add to Brevo list
    if (emailValid && process.env.BREVO_POLL_LIST_ID) {
      try {
        await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify({
            email,
            listIds: [Number(process.env.BREVO_POLL_LIST_ID)],
            updateEnabled: true,
            attributes: {
              VISA_STATUS: visaCategory,
              DECISION_TYPE: decisionType,
            },
          }),
        });
      } catch {
        // Non-fatal
      }
    }
  }

  return NextResponse.json({ ok: true });
}
