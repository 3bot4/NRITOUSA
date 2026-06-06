"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Contextual conversion box shown beneath each calculator's results.
 * No backend is configured, so submitting composes a pre-filled email
 * (consistent with the site's ContactForm) to request the resource.
 */
export default function LeadMagnet({
  heading,
  body,
  cta,
  tag,
}: {
  heading: string;
  body: string;
  cta: string;
  tag: string;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Resource request: ${tag}`);
    const bodyText = encodeURIComponent(
      `Please send me: ${tag}\n\nMy email: ${email}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${bodyText}`;
    setSent(true);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-900 p-6 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
          Free resource
        </p>
        <h3 className="mt-1.5 text-lg font-bold text-white">{heading}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">{body}</p>

        {sent ? (
          <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white">
            Thanks! Your email app should open — send the message and we&apos;ll
            reply with the resource.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-ink-500 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
            >
              {cta}
            </button>
          </form>
        )}
        <p className="mt-2 text-xs text-ink-500">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
