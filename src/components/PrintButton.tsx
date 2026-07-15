"use client";

/**
 * Minimal client-side "print / save as PDF" button. Used on checklist-style
 * pages so a reader can print a clean copy (paired with `no-print` classes on
 * site chrome). No analytics, no state — just window.print().
 */
export default function PrintButton({
  label = "Print checklist",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`no-print inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${className}`}
    >
      <span aria-hidden>🖨️</span> {label}
    </button>
  );
}
