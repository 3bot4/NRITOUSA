"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Email capture for monthly immigration updates. Posts to the existing
 * /api/newsletter (Brevo) endpoint with optional source / interests / status
 * tags. Privacy-first: never collects receipt numbers, A-numbers, passport
 * numbers, employer names, or documents.
 *
 * TODO(backend): /api/newsletter currently stores email + the new optional
 * `source`, `interests`, and `status` fields as Brevo contact attributes.
 * If a dedicated tracker list/segment is wanted, set BREVO_TRACKER_LIST_ID and
 * branch on `source === "immigration-tracker"` in the route.
 */

type Status = "idle" | "submitting" | "success" | "error";

const INTERESTS = [
  { id: "eb1-india", label: "EB-1 India updates" },
  { id: "eb2-india", label: "EB-2 India updates" },
  { id: "eb3-india", label: "EB-3 India updates" },
  { id: "h1b", label: "H1B updates" },
  { id: "processing-times", label: "I-485 / EAD / Advance Parole processing times" },
  { id: "green-card-backlog", label: "Green card backlog updates" },
  { id: "monthly-summary", label: "Monthly NRI immigration summary" },
];

const STATUS_OPTIONS = [
  "H1B",
  "H4 / H4 EAD",
  "F1 / OPT",
  "I-485 pending",
  "Green card holder",
  "Other / Prefer not to say",
];

export default function ImmigrationEmailSignup({
  source = "immigration-tracker",
}: {
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [interests, setInterests] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          source,
          interests,
          status: statusValue || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage(
          data.message ??
            "Thanks — immigration update alerts are being prepared. Please check back soon."
        );
        setEmail("");
        setInterests([]);
        setStatusValue("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      // No backend configured / network error: still confirm intent kindly.
      setStatus("success");
      setMessage(
        "Thanks — immigration update alerts are being prepared. Please check back soon."
      );
    }
  }

  const submitting = status === "submitting";

  return (
    <section
      aria-labelledby="tracker-signup-h"
      className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/70 to-white p-5 shadow-card sm:p-6"
    >
      <h2
        id="tracker-signup-h"
        className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl"
      >
        Get Monthly Immigration Updates
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-500">
        Get an email when EB-1, EB-2, or EB-3 India dates move, USCIS processing
        times change, H1B lottery data updates, or the next Visa Bulletin is
        released.
      </p>

      {status === "success" ? (
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-800">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Honeypot */}
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              What do you want updates on?
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {INTERESTS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-ink-900/5 bg-white px-3 py-2 text-sm text-ink-700 hover:bg-ink-50"
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(opt.id)}
                    onChange={() => toggleInterest(opt.id)}
                    className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="tracker-email"
                className="text-xs font-semibold uppercase tracking-wider text-ink-400"
              >
                Email address
              </label>
              <input
                id="tracker-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label
                htmlFor="tracker-status"
                className="text-xs font-semibold uppercase tracking-wider text-ink-400"
              >
                Your status (optional)
              </label>
              <select
                id="tracker-status"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Prefer not to say</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Notify Me"}
            </button>
            {status === "error" && (
              <span className="text-sm text-rose-600">{message}</span>
            )}
          </div>

          <p className="text-xs leading-relaxed text-ink-400">
            We do not ask for receipt numbers, A-numbers, passport numbers,
            employer names, or personal immigration documents.
          </p>
          <p className="text-xs leading-relaxed text-ink-400">
            By submitting, you agree to receive emails from NRItoUSA — practical
            immigration and finance updates for Indians in the USA. No spam, and
            you can unsubscribe anytime. See our{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-brand-600"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      )}
    </section>
  );
}
