"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  toolCatalog,
  searchHaystack,
  CHIP_CATEGORIES,
  type ChipCategory,
  type CatalogKind,
} from "@/lib/toolCatalog";

/**
 * Client-side search + filter over the full tool/calculator catalog.
 *
 * Crawlability: every catalog item is rendered as a real <a href> in the
 * initial server-rendered HTML (the default state shows everything), so search
 * engines and no-JS users get the complete, linkable list. The search box and
 * filter chips only *hide* non-matching cards on the client for UX — they never
 * gate the links behind JavaScript.
 */

const KIND_BADGE: Record<CatalogKind, string> = {
  Tool: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Calculator: "bg-violet-50 text-violet-700 ring-violet-600/20",
  Checklist: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Hub: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const KIND_CTA: Record<CatalogKind, string> = {
  Tool: "Open Tool",
  Calculator: "Open Calculator",
  Checklist: "Open Checklist",
  Hub: "Explore Hub",
};

type Filter = "All" | ChipCategory;

export default function ToolsExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    return toolCatalog.filter((item) => {
      const matchesFilter =
        filter === "All" || item.categories.includes(filter);
      if (!matchesFilter) return false;
      if (!q) return true;
      return searchHaystack(item).includes(q);
    });
  }, [q, filter]);

  const chips: Filter[] = ["All", ...CHIP_CATEGORIES];

  return (
    <section aria-labelledby="tools-explorer-h" className="scroll-mt-24">
      <h2 id="tools-explorer-h" className="sr-only">
        Search all tools
      </h2>

      {/* Search box */}
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
        >
          🔎
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tools — green card, FBAR, 401(k), property sale…"
          aria-label="Search all tools by name, description, or category"
          className="w-full rounded-2xl border border-ink-900/10 bg-white py-3.5 pl-11 pr-4 text-sm text-ink-900 shadow-card outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      {/* Filter chips */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter tools by category">
        {chips.map((chip) => {
          const active = filter === chip;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(chip)}
              className={[
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-ink-600 ring-1 ring-inset ring-ink-900/10 hover:bg-brand-50 hover:text-brand-700",
              ].join(" ")}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p className="mt-4 text-xs font-medium text-ink-400" aria-live="polite">
        Showing {results.length} of {toolCatalog.length} tools
        {filter !== "All" && <> in {filter}</>}
        {q && <> matching “{query.trim()}”</>}
      </p>

      {/* Results grid — all links present in source for crawlers */}
      {results.length > 0 ? (
        <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  aria-hidden
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${item.accent} text-lg shadow-sm`}
                >
                  {item.icon}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider ring-1 ring-inset ${KIND_BADGE[item.kind]}`}
                >
                  {item.kind}
                </span>
              </div>
              <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                {item.label}
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                {item.description}
              </p>
              <span className="mt-2.5 text-xs font-semibold text-brand-600">
                {KIND_CTA[item.kind]}{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-ink-900/15 bg-white p-8 text-center">
          <p className="text-sm text-ink-500">
            No tools match your search. Try a different term or{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("All");
              }}
              className="font-semibold text-brand-600 underline-offset-2 hover:underline"
            >
              clear the filters
            </button>
            .
          </p>
        </div>
      )}
    </section>
  );
}
