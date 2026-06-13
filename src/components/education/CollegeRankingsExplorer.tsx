"use client";

import { useMemo, useState } from "react";
import { usd } from "@/components/calculators/ui";
import {
  colleges,
  type College,
  type CollegeTag,
} from "@/lib/education-data";

type SortKey = "rank" | "acceptance" | "inState" | "outState";
type TypeFilter = "all" | "Public" | "Private";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "rank", label: "Ranking" },
  { key: "acceptance", label: "Acceptance rate" },
  { key: "inState", label: "In-state tuition" },
  { key: "outState", label: "Out-of-state tuition" },
];

const TAG_FILTERS: { value: "all" | CollegeTag; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "cs", label: "Computer Science" },
  { value: "engineering", label: "Engineering" },
  { value: "business", label: "Business" },
  { value: "affordable-public", label: "Affordable public" },
  { value: "value", label: "Best value" },
  { value: "ivy", label: "Ivy League" },
];

const states = Array.from(new Set(colleges.map((c) => c.state))).sort();

export default function CollegeRankingsExplorer() {
  const [sort, setSort] = useState<SortKey>("rank");
  const [type, setType] = useState<TypeFilter>("all");
  const [tag, setTag] = useState<"all" | CollegeTag>("all");
  const [state, setState] = useState<string>("all");

  const rows = useMemo(() => {
    let r: College[] = [...colleges];
    if (type !== "all") r = r.filter((c) => c.type === type);
    if (tag !== "all") r = r.filter((c) => c.tags.includes(tag));
    if (state !== "all") r = r.filter((c) => c.state === state);
    r.sort((a, b) => a[sort] - b[sort]);
    return r;
  }, [sort, type, tag, state]);

  const selectCls =
    "rounded-xl border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
        <label className="flex flex-col gap-1 text-xs font-semibold text-ink-500">
          Sort by
          <select
            className={selectCls}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-ink-500">
          Category
          <select
            className={selectCls}
            value={tag}
            onChange={(e) => setTag(e.target.value as "all" | CollegeTag)}
          >
            {TAG_FILTERS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-ink-500">
          Type
          <select
            className={selectCls}
            value={type}
            onChange={(e) => setType(e.target.value as TypeFilter)}
          >
            <option value="all">Public & Private</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-ink-500">
          State
          <select
            className={selectCls}
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="all">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto flex items-end text-xs text-ink-400">
          {rows.length} school{rows.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 bg-slate-50 text-xs uppercase tracking-wider text-ink-400">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">University</th>
              <th className="px-4 py-3 font-semibold">State</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 text-right font-semibold">Accept.</th>
              <th className="px-4 py-3 text-right font-semibold">Avg SAT</th>
              <th className="px-4 py-3 text-right font-semibold">In-state</th>
              <th className="px-4 py-3 text-right font-semibold">Out-of-state</th>
              <th className="px-4 py-3 font-semibold">Notable for</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.name}
                className="border-b border-ink-900/5 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-3 font-bold text-ink-400">{c.rank}</td>
                <td className="px-4 py-3 font-semibold text-ink-900">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-ink-500">{c.state}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.type === "Public"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-violet-50 text-violet-700"
                    }`}
                  >
                    {c.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                  {c.acceptance}%
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                  {c.avgSat}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                  {usd(c.inState)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                  {usd(c.outState)}
                </td>
                <td className="px-4 py-3 text-xs text-ink-500">{c.notableFor}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-ink-400">
                  No schools match these filters. Try widening them.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-relaxed text-ink-400">
        Rankings, acceptance rates, and tuition are approximate 2024–25 figures
        compiled from US News, QS, and published cost of attendance. Out-of-state
        rates apply to most immigrant families in their first year; see the
        residency rules in our cost guide. Always verify on the school&apos;s
        official website.
      </p>
    </div>
  );
}
