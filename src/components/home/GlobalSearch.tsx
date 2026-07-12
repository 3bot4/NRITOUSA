"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  searchSite,
  topSearched,
  type SearchType,
  type SearchItem,
} from "@/lib/searchIndex";

/**
 * Global site search for the homepage ("Search NRI to USA").
 *
 * Searches the whole content index — tools, calculators, checklists, guides,
 * articles, hub pages and PDF lead magnets — and renders each result with a
 * content-type badge, title, short description and URL. The empty state shows
 * the highest-value pages as real crawlable links, so nothing important is
 * hidden behind JavaScript (every destination is also reachable from the hubs
 * and /tools).
 */

/** Badge palette per content type. */
const TYPE_STYLES: Record<SearchType, string> = {
  Tool: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Calculator: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  Checklist: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Guide: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Article: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Hub: "bg-violet-50 text-violet-700 ring-violet-600/20",
  PDF: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

function TypeBadge({ type }: { type: SearchType }) {
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${TYPE_STYLES[type]}`}
    >
      {type}
    </span>
  );
}

function ResultRow({ item }: { item: SearchItem }) {
  return (
    <li className="min-w-0">
      <Link
        href={item.href}
        className="group flex min-w-0 flex-col gap-1 rounded-xl border border-ink-900/5 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
      >
        <div className="flex min-w-0 items-center gap-2">
          <TypeBadge type={item.type} />
          <h3 className="min-w-0 flex-1 truncate text-sm font-bold text-ink-900 group-hover:text-brand-700">
            {item.title}
          </h3>
          <span aria-hidden className="flex-none text-brand-600">
            →
          </span>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-ink-500">
          {item.description}
        </p>
        <span className="block min-w-0 max-w-full truncate text-[0.6875rem] font-medium text-ink-400">
          nritousa.com{item.href}
        </span>
      </Link>
    </li>
  );
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const q = query.trim();

  // Empty state shows the actual most-viewed pages (analytics); typing runs a
  // live search across the whole site index.
  const results = useMemo(
    () => (q ? searchSite(q, 12) : topSearched),
    [q],
  );

  return (
    <section
      id="site-search"
      aria-labelledby="site-search-h"
      className="scroll-mt-24 py-8 sm:py-10"
    >
      <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/70 to-indigo-50/50 p-5 sm:p-7">
        <div className="max-w-2xl">
          <h2
            id="site-search-h"
            className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl"
          >
            Search NRI to USA
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Find calculators, immigration guides, tax checklists,
            return-to-India tools, and wealth planning resources.
          </p>
        </div>

        {/* Search box */}
        <div className="relative mt-4">
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
            placeholder="Try “FBAR”, “green card wait”, “401k return to India”, “Trump Account”…"
            aria-label="Search the whole site"
            className="w-full rounded-2xl border border-ink-900/10 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        {/* Results */}
        {q && results.length === 0 ? (
          <p className="mt-4 text-sm text-ink-500">
            No match for “{q}” — try a broader term, or{" "}
            <Link
              href="/tools"
              className="font-semibold text-brand-600 hover:underline"
            >
              browse all tools
            </Link>
            .
          </p>
        ) : (
          <>
            {!q && (
              <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                Most searched
              </p>
            )}
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {results.map((item) => (
                <ResultRow key={item.href} item={item} />
              ))}
            </ul>
          </>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
          <Link
            href="/tools"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            All tools &amp; calculators →
          </Link>
          <Link
            href="/education/articles"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            All guides &amp; articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
