"use client";

import { useMemo, useState } from "react";
import CutoffChart from "@/components/tools/CutoffChart";
import {
  CATEGORY_SHORT,
  COUNTRY_LABELS,
  expandSeries,
  getSeries,
  type BulletinCountry,
  type EbCategory,
} from "@/lib/visa-bulletin";

const CATEGORIES: EbCategory[] = ["eb1", "eb2", "eb3", "eb5"];
const COUNTRIES: Exclude<BulletinCountry, "row">[] = ["india", "china"];

/** Historical FAD vs DFF chart with category/country toggles. */
export default function TrackerCharts() {
  const [category, setCategory] = useState<EbCategory>("eb2");
  const [country, setCountry] = useState<Exclude<BulletinCountry, "row">>("india");

  const data = useMemo(() => {
    const series = getSeries(category, country);
    if (!series) return null;
    const fad = expandSeries(series.fad);
    const from = fad[0]?.month;
    return { fad, dff: expandSeries(series.dff, from) };
  }, [category, country]);

  const pill = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
      active
        ? "bg-brand-600 text-white"
        : "bg-ink-900/[0.04] text-ink-600 hover:bg-ink-900/[0.08]"
    }`;

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={pill(category === c)}
          >
            {CATEGORY_SHORT[c]}
          </button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-ink-900/10 sm:block" />
        {COUNTRIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCountry(c)}
            className={pill(country === c)}
          >
            {COUNTRY_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {data ? (
          <CutoffChart
            fad={data.fad}
            dff={data.dff}
            title={`${CATEGORY_SHORT[category]} ${COUNTRY_LABELS[country]} cutoff movement`}
          />
        ) : (
          <p className="text-sm text-ink-400">No history for this selection.</p>
        )}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Higher on the chart = a later (more recent) cutoff date = shorter
        backlog. Flat stretches are months where the bulletin didn&apos;t move;
        drops are retrogressions.
      </p>
    </div>
  );
}
