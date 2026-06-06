import Link from "next/link";
import type { CalculatorMeta } from "@/lib/calculators";

export default function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  return (
    <Link
      href={`/calculators/${calc.slug}`}
      className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${calc.accent} text-2xl shadow-sm`}
      >
        {calc.icon}
      </span>
      <h3 className="mt-4 text-lg font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
        {calc.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
        {calc.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        Open calculator
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
