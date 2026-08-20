"use client";

import { useState } from "react";

/**
 * WhatsApp-first share block with a tagline underneath.
 *
 * This audience shares in WhatsApp group chats — admit groups, university
 * cohorts, family threads — far more than on public social. So WhatsApp is
 * the primary, full-width action and everything else is secondary, and the
 * `tagline` sits directly under it to give the sharer a reason and a
 * recipient ("send this to the friend who…").
 *
 * The share text is passed in rather than derived from the page title,
 * because a title is a poor WhatsApp message. Each page supplies copy that
 * still makes sense pasted into a chat with no other context (see
 * lib/studentCluster.ts `shareCopy`).
 *
 * Nothing is sent anywhere — every action is a link or a clipboard write.
 */
export default function ShareWithTagline({
  shareText,
  tagline,
  path,
  heading = "Know someone who needs this?",
  compact = false,
}: {
  /** Message body prefilled into the share. The URL is appended. */
  shareText: string;
  /** One line under the WhatsApp button telling the reader who to send it to. */
  tagline: string;
  /** Site-relative path, used when the component renders before hydration. */
  path: string;
  heading?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  // Prefer the live URL (keeps calculator state in the query string); fall
  // back to the canonical path during SSR and before hydration.
  const url = () =>
    typeof window === "undefined"
      ? `https://www.nritousa.com${path}`
      : window.location.href;

  const whatsappHref = () =>
    `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url()}`)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the WhatsApp and X links still work */
    }
  };

  const nativeShare = async () => {
    const nav = navigator as Navigator & {
      share?: (d: { text?: string; url?: string }) => Promise<void>;
    };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ text: shareText, url: url() });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copyLink();
  };

  return (
    <section
      className={`rounded-2xl border border-ink-900/5 bg-white shadow-card ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <h2 className="text-base font-bold tracking-tight text-ink-900 sm:text-lg">
        {heading}
      </h2>

      {/* Primary action — full width on mobile, where WhatsApp actually is. */}
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1ebe57] sm:w-auto sm:px-5"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5 flex-none fill-current"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        Share on WhatsApp
      </a>

      {/* The tagline the brief asked for — sits directly under WhatsApp. */}
      <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{tagline}</p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-900/5 pt-4">
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-900/25 hover:text-ink-900"
        >
          <span aria-hidden>{copied ? "✅" : "🔗"}</span>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-900/25 hover:text-ink-900"
        >
          <span aria-hidden>𝕏</span>
          Post
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.nritousa.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-900/25 hover:text-ink-900"
        >
          <span aria-hidden>in</span>
          LinkedIn
        </a>
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-900/25 hover:text-ink-900 sm:hidden"
        >
          <span aria-hidden>📤</span>
          More…
        </button>
      </div>
    </section>
  );
}
