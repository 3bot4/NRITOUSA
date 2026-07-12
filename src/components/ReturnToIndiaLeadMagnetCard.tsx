"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Return-to-India Playbook lead-magnet card.
 *
 * A reusable email-capture card offering the free 2026 Return-to-India PDF
 * checklist. On submit it posts to /api/lead-magnet/return-to-india-playbook,
 * which stores the contact in Brevo and emails the PDF link. The public PDF
 * link is only revealed after a successful submission.
 *
 * Brand language matches the rest of the site: brand (blue) + ink (navy) on a
 * light card, consistent with LeadMagnetForm. Two layouts:
 *   - variant="full"    → headline + bullets + trust badges (default; use in
 *                          natural mid-page / end-of-page slots).
 *   - variant="compact" → tighter single-column card for dense pages/sidebars.
 */

const LEAD_MAGNET = "return_to_india_playbook_2026";
const PDF_FALLBACK = "/The_Ultimate_Return_to_India_Playbook_2026.pdf";
const SUCCESS_MESSAGE =
  "Check your inbox — we just sent the Return-to-India Playbook. You can also download it here.";

type Status = "idle" | "submitting" | "success" | "error";

const BULLETS = [
  "What to do 12 months, 6 months, 3 months, and 30 days before moving",
  "How to think about 401(k), IRA, HSA, brokerage, and U.S. bank accounts",
  "RNOR, FBAR/FATCA, DTAA, NRE/NRO, India property sale, and remittance checklist",
  "First 90 days in India setup list",
];

const BADGES = ["2026 Edition", "20 chapters", "Free PDF", "No spam"];

export default function ReturnToIndiaLeadMagnetCard({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  const pathname = usePathname();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [pdf, setPdf] = useState("");
  const viewedRef = useRef(false);

  // Fire a single view event the first time the card mounts on a page.
  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackEvent("lead_magnet_view", {
      leadMagnet: LEAD_MAGNET,
      sourcePath: pathname,
      pageType: variant,
    });
  }, [pathname, variant]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    trackEvent("lead_magnet_submit", {
      leadMagnet: LEAD_MAGNET,
      sourcePath: pathname,
      pageType: variant,
    });
    try {
      const res = await fetch("/api/lead-magnet/return-to-india-playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          company,
          sourcePath: pathname,
          leadMagnet: LEAD_MAGNET,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setMessage(SUCCESS_MESSAGE);
        setPdf(typeof data.pdf === "string" ? data.pdf : PDF_FALLBACK);
        setEmail("");
        setFirstName("");
        trackEvent("lead_magnet_success", {
          leadMagnet: LEAD_MAGNET,
          sourcePath: pathname,
          pageType: variant,
        });
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        trackEvent("lead_magnet_error", {
          leadMagnet: LEAD_MAGNET,
          sourcePath: pathname,
          pageType: variant,
        });
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
      trackEvent("lead_magnet_error", {
        leadMagnet: LEAD_MAGNET,
        sourcePath: pathname,
        pageType: variant,
      });
    }
  }

  const submitting = status === "submitting";
  const compact = variant === "compact";

  return (
    <section
      aria-labelledby="rti-lead-magnet-heading"
      className={`relative overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-card ${className}`}
    >
      {/* Navy header band with the document visual + authority line. */}
      <div className="relative overflow-hidden bg-ink-900 px-6 py-6 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span
            aria-hidden
            className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/10 text-2xl ring-1 ring-white/15 backdrop-blur"
          >
            📄
          </span>
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-300">
              Free 2026 Return-to-India PDF Checklist
            </p>
            <h2
              id="rti-lead-magnet-heading"
              className={`mt-1 font-extrabold tracking-tight text-white ${
                compact ? "text-xl" : "text-2xl sm:text-[1.75rem]"
              }`}
            >
              Planning your move back to India?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Get the free 2026 Return-to-India Playbook — a complete personal,
              financial, tax, 401(k), RNOR, property, and repatriation checklist
              for NRIs.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-7 px-6 py-6 sm:px-8 sm:py-7 ${
          compact ? "" : "lg:grid-cols-2"
        }`}
      >
        {/* Left: what's inside */}
        <div>
          <ul className="space-y-2.5">
            {BULLETS.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-[0.7rem] font-bold text-brand-700"
                >
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            20 chapters. 60+ decision points. 25+ linked calculators. Built for
            H-1B, L-1, green card, and U.S.-citizen families planning a move back
            to India.
          </p>

          <p className="mt-3 text-sm font-semibold text-ink-800">
            Written by Deepak Middha, CA, Series 65 — 2026 Edition
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[0.7rem] font-semibold text-brand-700"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right: form / success */}
        <div>
          {status === "success" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-500 text-white"
                >
                  ✓
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink-900">
                    You&apos;re all set
                  </h3>
                  <p role="status" className="mt-1 text-sm leading-relaxed text-ink-600">
                    {message}
                  </p>
                </div>
              </div>
              <a
                href={pdf || PDF_FALLBACK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("lead_magnet_download_click", {
                    leadMagnet: LEAD_MAGNET,
                    sourcePath: pathname,
                  })
                }
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                Download the PDF checklist
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <div>
                <label
                  htmlFor="rti-first-name"
                  className="block text-sm font-semibold text-ink-800"
                >
                  First name{" "}
                  <span className="font-normal text-ink-400">(optional)</span>
                </label>
                <input
                  id="rti-first-name"
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
                  htmlFor="rti-email"
                  className="block text-sm font-semibold text-ink-800"
                >
                  Email address
                </label>
                <input
                  id="rti-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "rti-error" : undefined}
                  className="mt-1.5 w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              {/* Hidden provenance fields (also sent in the JSON body). */}
              <input type="hidden" name="sourcePath" value={pathname ?? ""} />
              <input type="hidden" name="leadMagnet" value={LEAD_MAGNET} />

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
                {submitting ? "Sending…" : "Send me the free PDF checklist"}
              </button>

              {status === "error" && message && (
                <p id="rti-error" role="alert" className="text-sm text-red-600">
                  {message}
                </p>
              )}

              <p className="text-xs leading-relaxed text-ink-400">
                Educational information only. Not tax, legal, immigration, or
                investment advice. Unsubscribe anytime. See our{" "}
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
        </div>
      </div>
    </section>
  );
}
