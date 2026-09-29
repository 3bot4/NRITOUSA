import Link from "next/link";

/** Anchor id the compact top disclaimer scroll-links to. */
export const FULL_DISCLAIMER_ID = "full-disclaimer";

/*
 * Kept deliberately short. The previous version ran ~130 words of intro plus
 * seven bullets that restated it ("not legal advice", "not tax advice", "not
 * financial advice", "not immigration advice"), and it renders on ~116 tool
 * pages — enough identical text to make unrelated calculators read as
 * near-duplicates of each other. Substance is unchanged: educational only,
 * things change, verify, get advice.
 */
const DEFAULT_INTRO =
  "Educational and planning use only. This is not legal, tax, financial, or immigration advice, and it does not replace a CPA, an attorney, or the relevant agency.";

const POINTS = [
  "Numbers, forms, fees, dates, rules, and limits change at any time.",
  "Verify with the official source before you file, pay, or invest.",
  "Consult a CPA, attorney, financial advisor, or the relevant agency (USCIS, IRS, State Department) when it matters to your situation.",
];

/**
 * Full disclaimer rendered low on every tool/calculator page, after the tool,
 * results, explanation, sources, and FAQs. Native <details> so it is collapsed
 * by default (mobile + desktop), needs no JS, and causes no layout shift.
 *
 * - `intro` overrides the default intro paragraph.
 * - `points` overrides the default bullet list (e.g. a tax-only tool that must
 *   not reference USCIS / State Department immigration agencies).
 * - `children` carries any tool-specific disclaimer/assumptions/source copy so
 *   existing wording is preserved (moved here, never deleted).
 * - `defaultOpen` lets desktop-heavy pages expand it if their design prefers.
 */
export default function BottomDisclaimer({
  intro,
  points = POINTS,
  children,
  defaultOpen = false,
  className = "",
}: {
  intro?: React.ReactNode;
  points?: string[];
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
          {points.map((p) => (
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
