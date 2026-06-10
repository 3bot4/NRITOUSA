import Link from "next/link";
import type { ToolMeta } from "@/lib/tools";

/** Hub card for a tool — mirrors the FeaturedTopics / CalculatorCard style. */
export default function ToolCard({ tool }: { tool: ToolMeta }) {
  const comingSoon = tool.status === "coming-soon";
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="mb-4 flex items-start justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.accent} text-2xl shadow-sm`}
        >
          {tool.icon}
        </span>
        {comingSoon && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="text-base font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
        {tool.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
        {tool.description}
      </p>
      <span className="mt-4 text-sm font-semibold text-brand-600">
        {comingSoon ? "Preview" : "Open tool"}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
