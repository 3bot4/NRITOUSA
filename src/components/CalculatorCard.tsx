import Link from "next/link";
import type { CalculatorMeta } from "@/lib/calculators";

export default function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  return (
    <Link
      href={`/calculators/${calc.slug}`}
      className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${calc.accent} text-lg shadow-sm`}
        >
          {calc.icon}
        </span>
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
          Calculator
        </span>
      </div>
      <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
        {calc.label}
      </h3>
      <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-ink-500">
        {calc.description}
      </p>
      <span className="mt-2.5 text-xs font-semibold text-brand-600">
        Open calculator{" "}
        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
