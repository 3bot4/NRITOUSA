/**
 * Partner education card for OptionLeo (Wealth Building Academy LLC), shown in
 * the "US Investing" grids on the home page and /tools.
 *
 * This is an external, clearly-labeled *partner education* card — not one of
 * NRItoUSA's own tools. It mirrors the CalculatorCard / IulComparisonCard shell
 * so it sits cleanly in the grid, but is intentionally toned down (neutral
 * accent, "Partner education" label, on-card risk disclaimer) so the page stays
 * trust-first. Educational only — never framed as investment advice or income.
 *
 * The outbound link is marked rel="sponsored noopener noreferrer" and opens in a
 * new tab, matching the project's external-link convention.
 */
export default function OptionLeoCard() {
  return (
    <a
      href="https://www.optionleo.com"
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 text-lg shadow-sm"
        >
          📈
        </span>
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
          Partner education · Options involve risk
        </span>
      </div>
      <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
        OptionLeo Options Education
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
        Learn covered calls, cash-secured puts, wheel strategy, premium yield,
        and options risk management with educational tools and coaching.
      </p>
      <span className="mt-2.5 text-xs font-semibold text-brand-600">
        Explore OptionLeo{" "}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
      <p className="mt-2.5 border-t border-ink-900/5 pt-2.5 text-[0.625rem] leading-relaxed text-ink-400">
        Educational only. Not investment advice. Options involve substantial
        risk and may not be suitable for all investors. No strategy, calculator,
        or coaching program guarantees income or returns.
      </p>
    </a>
  );
}
