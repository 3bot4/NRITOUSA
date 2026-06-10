"use client";

import { useEffect, useMemo, useState } from "react";
import DataStamp from "@/components/tools/DataStamp";

interface SummaryRow {
  title: string;
  metro: string;
  level: number;
  year: number;
  p25: number;
  p50: number;
  p75: number;
  n: number;
}

interface Summary {
  lastUpdated: string;
  source: string;
  sourceLabel: string;
  reportingPeriod?: string;
  sample: boolean;
  years: number[];
  rows: SummaryRow[];
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Level I (entry)",
  2: "Level II (qualified)",
  3: "Level III (experienced)",
  4: "Level IV (very senior)",
};

const ROMAN: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const inputClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export default function H1bSalaryExplorer() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [metro, setMetro] = useState("all");
  const [level, setLevel] = useState("all");
  const [year, setYear] = useState("all");
  // Mobile-only: keep the (long) results list inside a short scroll box by
  // default so the page doesn't run off-screen. Desktop is unaffected.
  const [showAllMobile, setShowAllMobile] = useState(false);

  useEffect(() => {
    fetch("/data/h1b/summary.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const metros = useMemo(
    () =>
      data ? Array.from(new Set(data.rows.map((r) => r.metro))).sort() : [],
    [data]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.rows
      .filter(
        (r) =>
          (!q || r.title.toLowerCase().includes(q)) &&
          (metro === "all" || r.metro === metro) &&
          (level === "all" || r.level === Number(level)) &&
          (year === "all" || r.year === Number(year))
      )
      .sort((a, b) => b.n - a.n)
      .slice(0, 100);
  }, [data, search, metro, level, year]);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-sm text-ink-700">
        Could not load the salary data file. Please refresh the page.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-ink-900/5 bg-white p-10 text-center text-sm text-ink-400 shadow-card">
        Loading salary data…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      {data.sample ? (
        <p className="mb-5 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 px-5 py-3 text-sm font-medium text-ink-700">
          ⚠️ Preview figures — realistic placeholders shown while the official
          DOL file loads. Not real filings yet; run the importer to replace them
          (see methodology below).
        </p>
      ) : (
        <p className="mb-5 rounded-xl border-l-4 border-emerald-400 bg-emerald-50/60 px-5 py-3 text-sm text-ink-700">
          Base salaries reported on employer H-1B LCA filings (attested wage,
          skewed toward large sponsors) — not a universal market salary.
          {data.reportingPeriod ? (
            <>
              {" "}
              Source: US DOL OFLC, {data.reportingPeriod}.
            </>
          ) : null}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">Job title</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Software Engineer"
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            City / metro
          </span>
          <select
            value={metro}
            onChange={(e) => setMetro(e.target.value)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="all">All metros</option>
            {metros.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">
            Wage level (experience proxy)
          </span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="all">All levels</option>
            {[1, 2, 3, 4].map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">Year</span>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="all">All years</option>
            {data.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-xs text-ink-400 sm:hidden">
        {filtered.length} {filtered.length === 1 ? "result" : "results"} —
        scroll inside the box, or tap “Show all” to expand.
      </p>
      <div
        className={`mt-2 overflow-auto sm:mt-6 sm:max-h-none ${
          showAllMobile ? "max-h-[75vh]" : "max-h-[24rem]"
        }`}
      >
        <table className="w-full min-w-[640px] text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-ink-900/5 text-left text-xs font-bold uppercase tracking-wider text-ink-400">
              <th className="py-3 pr-4">Job title</th>
              <th className="py-3 pr-4">Metro</th>
              <th className="py-3 pr-4">Level</th>
              <th className="py-3 pr-4 text-right">Median base</th>
              <th className="py-3 pr-4 text-right">P25 – P75</th>
              <th className="py-3 text-right">Filings</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={`${r.title}|${r.metro}|${r.level}|${r.year}`}
                className="border-b border-ink-900/5 last:border-0"
              >
                <td className="py-3 pr-4 font-semibold text-ink-900">
                  {r.title}
                </td>
                <td className="py-3 pr-4 text-ink-600">{r.metro}</td>
                <td className="py-3 pr-4 text-ink-600">{ROMAN[r.level]}</td>
                <td className="py-3 pr-4 text-right font-bold text-brand-700">
                  {usd(r.p50)}
                </td>
                <td className="py-3 pr-4 text-right text-ink-600">
                  {usd(r.p25)} – {usd(r.p75)}
                </td>
                <td className="py-3 text-right text-ink-400">
                  {r.n.toLocaleString("en-US")}
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-ink-400">
                  No matches — try a broader title or clear a filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAllMobile((v) => !v)}
          className="mt-3 w-full rounded-xl border border-ink-900/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/25 sm:hidden"
        >
          {showAllMobile ? "Collapse list" : `Show all ${filtered.length}`}
        </button>
      )}
      {filtered.length === 100 && (
        <p className="mt-2 text-xs text-ink-400">
          Showing the 100 most-filed matches — narrow your search to see more
          specific roles.
        </p>
      )}

      <DataStamp
        className="mt-5 border-t border-ink-900/5 pt-4"
        lastUpdated={data.lastUpdated}
        source={data.source}
        sourceLabel={data.sourceLabel}
      />
    </div>
  );
}
