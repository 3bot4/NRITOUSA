import Link from "next/link";

/** Anchor id the compact top disclaimer scroll-links to. */
export const FULL_DISCLAIMER_ID = "full-disclaimer";

const DEFAULT_INTRO =
  "This tool is for general education and planning only. It does not replace advice from a CPA, attorney, financial advisor, USCIS, IRS, State Department, or other official source. Rules, limits, forms, fees, dates, and government processing information may change. Always verify before filing, investing, or making immigration, tax, or financial decisions.";

const POINTS = [
  "For educational use only — not legal advice.",
  "Not tax advice.",
  "Not financial advice.",
  "Not immigration advice.",
  "Numbers, forms, fees, dates, rules, and limits may change at any time.",
  "Always verify with official sources before acting.",
  "Consult a CPA, attorney, financial advisor, or the relevant official agency (USCIS, IRS, State Department) when it matters to your situation.",
];

/**
 * Full disclaimer rendered low on every tool/calculator page, after the tool,
 * results, explanation, sources, and FAQs. Native <details> so it is collapsed
 * by default (mobile + desktop), needs no JS, and causes no layout shift.
 *
 * - `intro` overrides the default intro paragraph.
 * - `children` carries any tool-specific disclaimer/assumptions/source copy so
 *   existing wording is preserved (moved here, never deleted).
 * - `defaultOpen` lets desktop-heavy pages expand it if their design prefers.
 */
export default function BottomDisclaimer({
  intro,
  children,
  defaultOpen = false,
  className = "",
}: {
  intro?: React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      id={FULL_DISCLAIMER_ID}
      open={defaultOpen}
      className={`group mx-auto max-w-3xl scroll-mt-24 rounded-2xl border border-ink-900/10 bg-white shadow-card ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink-800 marker:hidden [&::-webkit-details-marker]:hidden">
        Disclaimer, assumptions &amp; sources
        <span
          aria-hidden
          className="text-ink-400 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="space-y-4 border-t border-ink-900/5 px-5 py-5 text-sm leading-relaxed text-ink-500">
        <p>{intro ?? DEFAULT_INTRO}</p>
        <ul className="list-disc space-y-1.5 pl-5">
          {POINTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {children ? <div className="space-y-2 text-ink-600">{children}</div> : null}
        <p className="text-xs text-ink-400">
          See our{" "}
          <Link href="/disclaimer" className="text-brand-600 underline">
            full site disclaimer
          </Link>{" "}
          for complete terms.
        </p>
      </div>
    </details>
  );
}
