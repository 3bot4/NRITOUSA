"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toolCatalog, searchHaystack } from "@/lib/toolCatalog";

/**
 * Compact homepage "Find the right tool" finder.
 *
 * Empty state renders a curated set of the most-used tools as real <a href>
 * links (crawlable, in the server HTML). Typing searches the full catalog on
 * the client for quick navigation — those same destinations are all crawlable
 * from /tools, so no important link is hidden behind JavaScript.
 */

/** Curated quick picks shown before the user types anything. */
const QUICK_PICKS: { label: string; href: string; icon: string }[] = [
  { label: "NRI Wealth Checkup", href: "/nri-wealth-checkup", icon: "🧮" },
  { label: "FBAR/FATCA Checker", href: "/tools/fbar-fatca-checker", icon: "🧾" },
  { label: "DIY NRI Tax Filing Roadmap", href: "/tools/nri-tax-filing-roadmap", icon: "🧭" },
  { label: "Immigration Tracker", href: "/immigration-tracker", icon: "🛂" },
  { label: "Priority Date Checker", href: "/tools/priority-date-checker", icon: "📅" },
  { label: "Green Card Stage Finder", href: "/tools/green-card-stage-finder", icon: "🟢" },
  { label: "India Property Sale Calculator", href: "/calculators/india-property-capital-gains", icon: "🏘️" },
  { label: "401(k) Cash Out vs Keep", href: "/calculators/401k-return-to-india", icon: "🏦" },
  { label: "Rent vs Buy (Visa)", href: "/calculators/rent-vs-buy-visa", icon: "🔑" },
];

export default function HomeToolFinder() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    return toolCatalog
      .filter((item) => searchHaystack(item).includes(q))
      .slice(0, 8);
  }, [q]);

  return (
    <section aria-labelledby="home-tool-finder-h" className="py-8 sm:py-10">
      <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/70 to-indigo-50/50 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2
              id="home-tool-finder-h"
              className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl"
            >
              Find the right tool
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Search 25+ free calculators and checklists, or jump straight to a
              popular one below.
            </p>
          </div>
          <Link
            href="/tools"
            className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Browse all tools <span aria-hidden>→</span>
          </Link>
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
            placeholder="Try “green card”, “FBAR”, “401k”, “property sale”…"
            aria-label="Search tools and calculators"
            className="w-full rounded-2xl border border-ink-900/10 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        {/* Live search results */}
        {q ? (
          results.length > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl border border-ink-900/5 bg-white px-3.5 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <span aria-hidden className="text-lg">
                      {item.icon}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink-800 group-hover:text-brand-700">
                      {item.label}
                    </span>
                    <span aria-hidden className="text-brand-600">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-500">
              No match — try a broader term, or{" "}
              <Link href="/tools" className="font-semibold text-brand-600 hover:underline">
                browse all tools
              </Link>
              .
            </p>
          )
        ) : (
          /* Curated quick picks — crawlable links in the server HTML */
          <ul className="mt-4 flex flex-wrap gap-2">
            {QUICK_PICKS.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <span aria-hidden>{p.icon}</span>
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
