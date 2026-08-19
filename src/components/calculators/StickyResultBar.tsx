"use client";

import { useEffect, useState } from "react";

/**
 * Mobile-only sticky result bar for calculators.
 *
 * On a phone the CalcGrid results column stacks *below* every input, so a
 * visitor changing an assumption cannot see what it did to the answer. This
 * pins the single headline number to the bottom of the viewport while the
 * inputs are on screen, and gets out of the way as soon as the full results
 * block scrolls into view.
 *
 * Progressive enhancement rules this follows:
 *  - Renders nothing until mounted and nothing when inputs are invalid, so
 *    there is no layout shift and no "—" flash.
 *  - If IntersectionObserver is unavailable (old in-app webviews), the bar
 *    stays visible rather than silently never appearing.
 *  - The tap target is a plain in-page anchor to the results block, so it
 *    needs no scroll-position maths and degrades to a normal jump link.
 *  - Nothing is persisted; no storage APIs are touched (Facebook's in-app
 *    browser blocks them).
 *
 * No bottom spacer is needed: on mobile the results block always follows the
 * input card, so the final input can never be trapped underneath the bar, and
 * by the time the page bottom is reached the results are on screen and the bar
 * has already hidden itself.
 */
export default function StickyResultBar({
  label,
  value,
  sub,
  tone = "default",
  targetId,
  show = true,
}: {
  /** Short description of the number, e.g. "Keeping it invested is worth". */
  label: string;
  /** Preformatted headline figure. */
  value: string;
  /** Optional one-line qualifier under the value. */
  sub?: string;
  tone?: "default" | "good" | "warn";
  /** id of the full results block — the bar hides while that block is visible. */
  targetId: string;
  /** false while inputs are invalid, so no bar is shown at all. */
  show?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // Old webview: no observer, so never hide it rather than never show it.
      setVisible(true);
      return;
    }

    const el = document.getElementById(targetId);
    if (!el) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      // Ignore the top 72px (sticky navbar) and treat the bottom 45% of the
      // viewport as "not really visible yet", so the bar doesn't flicker off
      // the instant the first pixel of the results panel appears.
      { rootMargin: "-72px 0px -45% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  if (!show || !visible) return null;

  const valueTone =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warn"
        ? "text-amber-300"
        : "text-white";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/95 backdrop-blur supports-[backdrop-filter]:bg-ink-900/85 lg:hidden">
      <div
        className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-2.5"
        style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
            {label}
          </p>
          <p className={`truncate text-xl font-extrabold leading-tight ${valueTone}`}>
            {value}
          </p>
          {sub && (
            <p className="truncate text-[0.6875rem] leading-tight text-ink-400">
              {sub}
            </p>
          )}
        </div>
        <a
          href={`#${targetId}`}
          className="shrink-0 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-400"
        >
          Full breakdown ↓
        </a>
      </div>
    </div>
  );
}
