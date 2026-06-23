"use client";

import { useState } from "react";

/*
 * Mobile-first view of the processing-times data. Filter chips narrow the list;
 * on phones each row renders as a stacked card (no horizontal scroll), while
 * sm+ keeps the familiar table. Pure presentation — the numbers, sources, and
 * dates come straight from data/processing-times.json and are never modified.
 */

export interface TimeItem {
  item: string;
  typical: string;
  premium: string | null;
  source: string;
  sourceLabel: string;
  lastUpdated: string;
  todo?: boolean;
}

export interface TimeGroup {
  title: string;
  items: TimeItem[];
}

type Matcher = (item: TimeItem, group: TimeGroup) => boolean;

const CHIPS: { id: string; label: string; match: Matcher }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "h1b", label: "H-1B", match: (i) => /H-1B|H-4/i.test(i.item) },
  { id: "i140", label: "I-140", match: (i) => /I-140/i.test(i.item) },
  { id: "i485", label: "I-485", match: (i) => /I-485/i.test(i.item) },
  {
    id: "eadap",
    label: "EAD/AP",
    match: (i) => /I-765|EAD|I-131|Advance Parole/i.test(i.item),
  },
  { id: "oci", label: "OCI", match: (i) => /OCI/i.test(i.item) },
  { id: "passport", label: "Passport", match: (i) => /passport/i.test(i.item) },
  {
    id: "visa",
    label: "Visa stamping",
    match: (i, g) =>
      /visa stamping/i.test(g.title) || /consulate|embassy/i.test(i.item),
  },
];

function SourceLink({ row }: { row: TimeItem }) {
  return (
    <>
      <a
        href={row.source}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-brand-600 underline decoration-brand-200 underline-offset-2 hover:text-brand-700"
      >
        {row.sourceLabel}
      </a>
      <span className="mt-0.5 block text-[11px] text-ink-400">
        as of {row.lastUpdated}
      </span>
    </>
  );
}

export default function ProcessingTimesExplorer({
  groups,
}: {
  groups: TimeGroup[];
}) {
  const [active, setActive] = useState("all");
  const matcher = CHIPS.find((c) => c.id === active)?.match ?? (() => true);

  const visibleGroups = groups
    .map((g) => ({ ...g, items: g.items.filter((it) => matcher(it, g)) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      {/* Filter chips */}
      <div
        className="-mx-1 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter processing times"
      >
        {CHIPS.map((chip) => {
          const isActive = chip.id === active;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(chip.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                isActive
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-10">
        {visibleGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              {group.title}
            </h2>

            {/* Mobile: stacked cards — no horizontal scroll */}
            <div className="mt-4 space-y-3 sm:hidden">
              {group.items.map((row) => (
                <div
                  key={row.item}
                  className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card"
                >
                  <p className="font-semibold text-ink-900">{row.item}</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink-400">Typical range</dt>
                      <dd className="text-right font-medium text-ink-800">
                        {row.typical}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-ink-400">Source</dt>
                      <dd className="text-right">
                        <SourceLink row={row} />
                      </dd>
                    </div>
                  </dl>
                  {row.premium && (
                    <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs leading-relaxed text-emerald-700">
                      <span className="font-semibold">Note:</span> ⚡{" "}
                      {row.premium}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="mt-4 hidden rounded-2xl border border-ink-900/5 bg-white shadow-card sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-900/5 bg-[#fafafa] text-left text-xs font-bold uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-3.5">Item</th>
                    <th className="px-5 py-3.5">Typical range</th>
                    <th className="px-5 py-3.5">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((row) => (
                    <tr
                      key={row.item}
                      className="border-b border-ink-900/5 align-top last:border-0"
                    >
                      <td className="px-5 py-4 font-semibold text-ink-900">
                        {row.item}
                      </td>
                      <td className="px-5 py-4 text-ink-700">
                        {row.typical}
                        {row.premium && (
                          <span className="mt-1 block text-xs text-emerald-600">
                            ⚡ {row.premium}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <SourceLink row={row} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {visibleGroups.length === 0 && (
          <p className="rounded-2xl border border-ink-900/5 bg-white p-6 text-center text-sm text-ink-500">
            No items match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
