"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const SUCCESS_MESSAGE =
  "Check your inbox for the download link. We'll also send occasional NRItoUSA guides on immigration, taxes, money, and investing.";

export default function LeadMagnetForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [pdf, setPdf] = useState("");

  // Fire a single page-view event when the form (and so the page) mounts.
  useEffect(() => {
    trackEvent("lead_magnet_page_view");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    trackEvent("lead_magnet_submit");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage(SUCCESS_MESSAGE);
        setPdf(typeof data.pdf === "string" ? data.pdf : "");
        setEmail("");
        setFirstName("");
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

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-500 text-white"
          >
            ✓
          </span>
          <div>
            <h3 className="text-base font-bold text-ink-900">You&apos;re all set</h3>
            <p role="status" className="mt-1 text-sm leading-relaxed text-ink-600">
              {message}
            </p>
          </div>
        </div>
        {pdf && (
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("lead_magnet_download_click")}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:w-auto"
          >
            Download PDF
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="lm-first-name"
          className="block text-sm font-semibold text-ink-800"
        >
          First name
        </label>
        <input
          id="lm-first-name"
          name="firstName"
          type="text"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Priya"
          className="mt-1.5 w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div>
        <label
          htmlFor="lm-email"
          className="block text-sm font-semibold text-ink-800"
        >
          Email address
        </label>
        <input
          id="lm-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "lm-error" : undefined}
          className="mt-1.5 w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      {/* Honeypot: hidden from real users, off the tab order. */}
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
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send me the free guide"}
      </button>

      {status === "error" && message && (
        <p id="lm-error" role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}

      <p className="text-xs leading-relaxed text-ink-400">
        By submitting, you agree to receive emails from NRItoUSA. You can
        unsubscribe anytime. See our{" "}
        <Link href="/privacy-policy" className="underline hover:text-brand-600">
          Privacy Policy
        </Link>
        . Educational only. Not investment, tax, or legal advice. No strategy
        guarantees income or returns.
      </p>
    </form>
  );
}
