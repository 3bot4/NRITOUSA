"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchSite, type SearchItem, type SearchType } from "@/lib/searchIndex";

/**
 * Compact hero search bar for the homepage.
 *
 * Same index as the old boxed "Search NRI to USA" section (tools, calculators,
 * checklists, guides, articles, hubs and PDFs) — restyled as a single inline
 * bar so the hero reads as one unit. Results only appear once the visitor
 * types; the crawlable entry points live in the chips beneath it and in the
 * card sections further down, so nothing important hides behind JavaScript.
 */

const TYPE_STYLES: Record<SearchType, string> = {
  Tool: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Calculator: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Checklist: "bg-teal-50 text-teal-700 ring-teal-600/20",
  Guide: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Article: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Hub: "bg-violet-50 text-violet-700 ring-violet-600/20",
  PDF: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

/** High-intent shortcuts — real links, so crawlers follow them. */
const CHIPS: { label: string; href: string }[] = [
  { label: "FBAR", href: "/tools/fbar-fatca-checker" },
  { label: "green card wait", href: "/tools/green-card-tracker" },
  { label: "priority date", href: "/tools/priority-date-checker" },
  { label: "401k return to India", href: "/calculators/401k-return-to-india" },
  { label: "H-1B lottery", href: "/h1b-lottery-results" },
  { label: "OCI card", href: "/oci" },
  { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
  { label: "passport renewal", href: "/indian-passport-renewal-usa" },
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const q = query.trim();
  const results = useMemo(() => (q ? searchSite(q, 8) : []), [q]);

  return (
    <div className="mt-7">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex max-w-xl items-center gap-2 rounded-2xl border border-ink-900/15 bg-white p-2 pl-4 shadow-card transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100"
      >
        <span aria-hidden className="flex-none text-ink-400">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, guides, and calculators…"
          aria-label="Search NRI to USA"
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-ink-900 outline-none placeholder:text-ink-400"
        />
        <span className="flex-none rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
          Search
        </span>
      </form>

      {/* Popular shortcuts */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 font-mono text-xs font-medium text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-700"
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Live results — only rendered once something is typed */}
      {q && (
        <div className="mt-4 max-w-xl rounded-2xl border border-ink-900/10 bg-white p-2 shadow-card">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-ink-500">
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
            <ul>
              {results.map((item: SearchItem) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50"
                  >
                    <span
                      className={`inline-flex flex-none items-center rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${TYPE_STYLES[item.type]}`}
                    >
                      {item.type}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                      {item.title}
                    </span>
                    <span aria-hidden className="flex-none text-brand-600">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
