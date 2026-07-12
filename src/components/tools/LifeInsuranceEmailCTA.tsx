"use client";

/**
 * Email-capture CTA shown AFTER the term-life needs calculator result.
 *
 * Privacy-first, and honest about what happens:
 *   - "Download my results + agent checklist" builds a text file IN THE BROWSER
 *     from the numbers you already see. Nothing you typed is sent to a server,
 *     stored, or shared — this matches the calculator's stated privacy.
 *   - The optional email field reuses the existing /api/newsletter (Brevo)
 *     flow — the same backend used elsewhere on the site — and sends ONLY your
 *     email (tagged with a source), never your calculator inputs.
 *
 * We deliberately do NOT claim the server emails your numbers back, because it
 * doesn't. TODO(backend): if a transactional "email me my results" flow is ever
 * wanted, add a Brevo transactional template + a dedicated route and pass the
 * summary there on submit; until then the download covers the "get a copy" need
 * without sending sensitive figures anywhere.
 */
import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function LifeInsuranceEmailCTA({
  resultsText,
  source = "life-insurance-needs-calculator",
}: {
  /** Plain-text copy of the on-screen results + agent checklist, for download. */
  resultsText: string;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function downloadResults() {
    const blob = new Blob([resultsText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "term-life-insurance-needs-estimate.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only the email + a source tag — never the calculator inputs.
        body: JSON.stringify({ email, company, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage(
          data.message ??
            "You're subscribed. We'll send occasional planning resources — your calculator numbers stayed in your browser.",
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  const submitting = status === "submitting";

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-card sm:p-8">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-500">Keep a copy</span>
      <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
        Email me these results and the agent checklist
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        Get a copy of your estimated coverage gap and a checklist of questions to review with a licensed insurance
        professional.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={downloadResults}
          className="inline-flex flex-none items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Download my results + checklist ↓
        </button>

        <form onSubmit={handleSubmit} className="flex-1" noValidate>
          {status === "success" ? (
            <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
              {message}
            </p>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="li-calc-email">
                Email address (optional)
              </label>
              <input
                id="li-calc-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@email.com (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
              />
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex flex-none items-center justify-center rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Email me planning resources"}
              </button>
            </div>
          )}
          {status === "error" && message && (
            <p role="alert" className="mt-1.5 text-xs text-red-600">
              {message}
            </p>
          )}
        </form>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        The download is generated in your browser — your figures are not sent to us or stored. The email field is
        optional and reuses our standard newsletter signup; we use it only to send planning resources, never your
        calculator inputs. Educational only — not insurance, tax, or financial advice.
      </p>
    </div>
  );
}
