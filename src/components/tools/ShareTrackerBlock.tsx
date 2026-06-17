"use client";

import { useState } from "react";

/**
 * Compact share block: WhatsApp, Facebook, X/Twitter + native copy-link.
 * Used on the Immigration Tracker (near the email capture and at page bottom).
 */
export default function ShareTrackerBlock({
  url,
  title = "Was this tracker helpful?",
  description = "If this NRI Immigration Tracker helped you understand visa bulletin movement, USCIS processing times, or green card delays, share it with friends and family who may be waiting too.",
  shareText = "NRI Immigration Tracker: Track EB1/EB2/EB3 India dates, USCIS processing times, I-485 backlog, H1B lottery odds, and green card updates in one place.",
}: {
  url: string;
  title?: string;
  description?: string;
  shareText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);
  const encodedTextAndUrl = encodeURIComponent(`${shareText} ${url}`);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTextAndUrl}`,
      className: "bg-[#25D366] hover:bg-[#1ebe57] text-white",
      icon: "💬",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-[#1877F2] hover:bg-[#1466d1] text-white",
      icon: "📘",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      className: "bg-ink-900 hover:bg-black text-white",
      icon: "𝕏",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* no-op */
      }
      document.body.removeChild(ta);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-base font-bold tracking-tight text-ink-900 sm:text-lg">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-500">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold shadow-sm transition-colors ${l.className}`}
          >
            <span aria-hidden>{l.icon}</span>
            Share on {l.label}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 shadow-sm transition-colors hover:bg-ink-50"
        >
          <span aria-hidden>{copied ? "✅" : "🔗"}</span>
          {copied ? "Link copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
