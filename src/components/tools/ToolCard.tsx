import Link from "next/link";
import type { ToolMeta } from "@/lib/tools";

/** Compact hub card for a tool — mirrors the CalculatorCard style. */
export default function ToolCard({ tool }: { tool: ToolMeta }) {
  const comingSoon = tool.status === "coming-soon";
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${tool.accent} text-lg shadow-sm`}
          >
            {tool.icon}
          </span>
          <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
            Tool
          </span>
        </div>
        {comingSoon && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.625rem] font-semibold text-amber-700">
            Soon
          </span>
        )}
      </div>
      <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
        {tool.label}
      </h3>
      <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-ink-500">
        {tool.description}
      </p>
      <span className="mt-2.5 text-xs font-semibold text-brand-600">
        {comingSoon ? "Preview" : "Open tool"}{" "}
        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
