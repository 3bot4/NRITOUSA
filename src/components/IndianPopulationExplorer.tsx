"use client";

import { useMemo, useState } from "react";
import {
  states,
  explorerCategories,
  explorerDisclaimer,
  intensityMeta,
  type Intensity,
} from "@/data/indianPopulationData";

/**
 * "Indian Population in USA Explorer" — a client-side interactive that pairs a
 * state selector + category filter with a heat-map-style grid of states.
 *
 * No external chart/map library (the project ships none). The map is a
 * responsive grid of state tiles coloured by relative Indian-origin
 * concentration. Everything degrades to plain, crawlable text; the detail
 * panel mirrors the underlying data so there is no hidden content.
 */

const LEGEND: Intensity[] = ["veryHigh", "high", "growing", "moderate"];

export default function IndianPopulationExplorer() {
  const [selected, setSelected] = useState<string>("CA");
  const [category, setCategory] =
    useState<(typeof explorerCategories)[number]["key"]>("population");

  const active = useMemo(
    () => states.find((s) => s.code === selected) ?? states[0],
    [selected],
  );

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
            Indian Population in USA Explorer
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Pick a state and a category to see relative concentration and
            community notes.
          </p>
        </div>

        {/* State selector */}
        <label className="flex flex-col text-xs font-semibold text-ink-500">
          <span className="mb-1">State</span>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            aria-label="Select a U.S. state"
            className="rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm font-medium text-ink-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {[...states]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
          </select>
        </label>
      </div>

      {/* Category filter buttons */}
      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Category filter"
      >
        {explorerCategories.map((c) => {
          const on = c.key === category;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              aria-pressed={on}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                on
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-ink-900/10 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Heat-map grid */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-ink-500">
            <span className="font-semibold text-ink-600">
              Relative Indian-origin concentration:
            </span>
            {LEGEND.map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-3 w-3 rounded-sm ${intensityMeta[k].dot}`}
                  aria-hidden
                />
                {intensityMeta[k].label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {states.map((s) => {
              const on = s.code === selected;
              return (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => setSelected(s.code)}
                  title={s.tooltip}
                  aria-label={`${s.name}: ${intensityMeta[s.intensity].label} Indian-origin concentration`}
                  aria-pressed={on}
                  className={`group flex flex-col items-start rounded-xl border px-2.5 py-2 text-left transition ${
                    intensityMeta[s.intensity].cell
                  } ${on ? "ring-2 ring-ink-900 ring-offset-1" : "hover:opacity-90"}`}
                >
                  <span className="text-sm font-bold leading-none">
                    {s.code}
                  </span>
                  <span className="mt-1 text-[10px] font-medium leading-tight opacity-90">
                    {intensityMeta[s.intensity].label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
            {explorerDisclaimer}
          </p>
        </div>

        {/* Detail panel */}
        <div className="rounded-2xl border border-ink-900/10 bg-ink-50/40 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-ink-900">{active.name}</h4>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${intensityMeta[active.intensity].cell}`}
            >
              {intensityMeta[active.intensity].label}
            </span>
          </div>

          <dl className="mt-3 space-y-2.5 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Major metros
              </dt>
              <dd className="text-ink-700">{active.metros}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Main community drivers
              </dt>
              <dd className="text-ink-700">{active.drivers}</dd>
            </div>
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                {explorerCategories.find((c) => c.key === category)?.label}
              </dt>
              <dd className="mt-0.5 leading-relaxed text-ink-800">
                {active[category]}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
