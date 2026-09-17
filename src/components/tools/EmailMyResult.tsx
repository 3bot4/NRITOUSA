"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * "Email me this result" — shared across the estimators added in the
 * September 2026 build (I-864 income check, I-751 window, NVC timeline).
 *
 * Follows the same pattern as LeadMagnet and ContactForm: no backend call and
 * no third-party script, so nothing the user typed leaves the browser until
 * they choose to send the message themselves. The result lines are composed
 * into a mailto body, which also means the user keeps a copy in their own
 * sent items — useful for something they will want to re-read months later.
 *
 * Deliberately NOT posting to /api/newsletter: these results contain a
 * person's household size, income band or card dates, and that belongs in
 * their mailbox rather than in a marketing contact record.
 */
export interface ResultLine {
  label: string;
  value: string;
}

export default function EmailMyResult({
  subject,
  intro,
  lines,
  footnote,
  heading = "Email this result to yourself",
  blurb = "We do not store it. Your email app opens with the numbers already filled in, so you have a copy to compare against later.",
}: {
  subject: string;
  intro: string;
  lines: ResultLine[];
  footnote?: string;
  heading?: string;
  blurb?: string;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      intro,
      "",
      ...lines.map((l) => `${l.label}: ${l.value}`),
      "",
      footnote ?? "",
      "",
      `Worked out on ${site.url} — general information, not legal advice.`,
    ]
      .filter((l) => l !== null && l !== undefined)
      .join("\n");

    const href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  };

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 sm:p-6">
      <h3 className="text-sm font-bold text-ink-900">{heading}</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-500">{blurb}</p>

      {sent ? (
        <p className="mt-3 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-ink-700">
          Your email app should have opened with the result filled in. If nothing
          happened, your browser may block <code>mailto:</code> links — copy the
          numbers above instead.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="email-my-result">
            Your email address
          </label>
          <input
            id="email-my-result"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-base text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Email it to me
          </button>
        </form>
      )}
    </div>
  );
}
