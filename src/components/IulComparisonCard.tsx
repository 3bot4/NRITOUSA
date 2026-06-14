import Link from "next/link";

/**
 * Card for the in-article IUL vs 401(k) vs Taxable comparison. It lives at its
 * article URL (not /calculators), so it can't be a CalculatorCard — but it
 * mirrors that card's exact style so it sits cleanly in the tool grids.
 */
export default function IulComparisonCard() {
  return (
    <Link
      href="/articles/iul-vs-401k-honest-comparison"
      className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-lg shadow-sm"
        >
          ⚖️
        </span>
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
          Calculator
        </span>
      </div>
      <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
        IUL vs 401(k) vs Taxable
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
        Side-by-side projection of indexed universal life against a 401(k) and a
        taxable brokerage — caps, floors, fees, death benefit, and a bad-market
        scenario toggle.
      </p>
      <span className="mt-2.5 text-xs font-semibold text-brand-600">
        Open comparison{" "}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  );
}
