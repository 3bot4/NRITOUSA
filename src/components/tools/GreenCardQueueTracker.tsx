"use client";

/**
 * Green Card Queue Tracker — signature dashboard for /tools/green-card-tracker.
 * Controls (category, country, priority date, chart type) drive a hero band,
 * a stat strip, four pace scenarios, and a two-mode history chart, all backed
 * by the re-verified 2021-08–2026-07 visa bulletin dataset. See
 * src/lib/visa-bulletin.ts's "EXTENDED CATEGORIES" section for the data layer
 * this reads from.
 */

import { useEffect, useMemo, useState } from "react";
import QueueHeroBand from "@/components/tools/QueueHeroBand";
import QueueHistoryChart from "@/components/tools/QueueHistoryChart";
import {
  EXTENDED_CATEGORIES,
  EXTENDED_CATEGORY_SHORT,
  EXTENDED_COUNTRIES,
  EXTENDED_COUNTRY_LABELS,
  bulletin,
  countRetrogressionMonths,
  extendedEstimateWait,
  extendedGetMovement,
  findLastDatedPoint,
  formatBulletinMonth,
  formatCutoff,
  formatMonths,
  getExtendedCutoffs,
  getExtendedVelocity,
  getExtendedVelocityAsOf,
  getExtendedSeries,
  monthIndex,
  projectWithPace,
  type ChartKind,
  type ExtendedCategory,
  type ExtendedCountry,
} from "@/lib/visa-bulletin";

type PaceScenario = "recent12" | "longrun60" | "fast" | "slow";

const selectClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

/** Exact calendar days between two "YYYY-MM-DD" dates (UTC, no DST/timezone drift). */
function exactDaysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86_400_000);
}

function daysToYearsDays(days: number): string {
  const years = Math.floor(days / 365.25);
  const rest = Math.round(days - years * 365.25);
  if (years === 0) return `${rest} days`;
  if (rest <= 0) return `${years} yr`;
  return `${years} yr, ${rest} days`;
}

/** Add whole months to a "YYYY-MM-DD" or "YYYY-MM" date, returning "Month YYYY". */
function projectedMonthLabelFromToday(months: number): string {
  const now = new Date();
  const total = now.getUTCFullYear() * 12 + now.getUTCMonth() + Math.round(months);
  const y = Math.floor(total / 12);
  const m = total % 12;
  const MONTHS_FULL = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${MONTHS_FULL[m]} ${y}`;
}

export default function GreenCardQueueTracker() {
  const [category, setCategory] = useState<ExtendedCategory>("eb2");
  const [country, setCountry] = useState<ExtendedCountry>("india");
  const [priorityDate, setPriorityDate] = useState("2019-06-01");
  const [chart, setChart] = useState<ChartKind>("fad");
  const [pace, setPace] = useState<PaceScenario>("recent12");

  // Shareable URL state, mirroring GreenCardEstimator's pattern.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("qcat");
    const co = sp.get("qcountry");
    const pd = sp.get("qpd");
    const ch = sp.get("qchart");
    if (c && (EXTENDED_CATEGORIES as string[]).includes(c)) setCategory(c as ExtendedCategory);
    if (co && (EXTENDED_COUNTRIES as string[]).includes(co)) setCountry(co as ExtendedCountry);
    if (pd && /^\d{4}-\d{2}-\d{2}$/.test(pd)) setPriorityDate(pd);
    if (ch === "fad" || ch === "dff") setChart(ch);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (category !== "eb2") sp.set("qcat", category);
      if (country !== "india") sp.set("qcountry", country);
      if (priorityDate !== "2019-06-01") sp.set("qpd", priorityDate);
      if (chart !== "fad") sp.set("qchart", chart);
      const qs = sp.toString();
      window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
    }, 400);
    return () => clearTimeout(t);
  }, [category, country, priorityDate, chart]);

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(priorityDate);

  const cutoffs = useMemo(() => getExtendedCutoffs(category, country), [category, country]);
  const cutoff = chart === "fad" ? cutoffs.fad : cutoffs.dff;

  const estimate = useMemo(
    () => (validDate ? extendedEstimateWait(priorityDate, category, country, chart) : null),
    [validDate, priorityDate, category, country, chart]
  );

  const movement = useMemo(() => extendedGetMovement(category, country, chart), [category, country, chart]);

  const pace12 = useMemo(() => getExtendedVelocity(category, country, chart, 12), [category, country, chart]);
  const pace60 = useMemo(() => getExtendedVelocity(category, country, chart, 60), [category, country, chart]);
  const retro60 = useMemo(() => countRetrogressionMonths(category, country, chart, 60), [category, country, chart]);

  // When the current month is frozen ("U"), fall back to the last dated
  // month for pace/gap context instead of going blank — the historical trend
  // is still real and useful even though there's no live projection target
  // this month. Clearly labeled "as of <month>" wherever shown.
  const lastDatedPoint = useMemo(
    () => (cutoff === "U" ? findLastDatedPoint(category, country, chart) : null),
    [cutoff, category, country, chart]
  );
  const usingFallback = lastDatedPoint !== null;
  const effectivePace12 =
    pace12 ?? (lastDatedPoint ? getExtendedVelocityAsOf(category, country, chart, lastDatedPoint[0], 12) : null);
  const effectivePace60 =
    pace60 ?? (lastDatedPoint ? getExtendedVelocityAsOf(category, country, chart, lastDatedPoint[0], 60) : null);

  const paceValues: Record<PaceScenario, number | null> = {
    recent12: effectivePace12,
    longrun60: effectivePace60,
    fast: effectivePace60 !== null ? effectivePace60 * 1.5 : null,
    slow: effectivePace60 !== null ? effectivePace60 * 0.4 : null,
  };
  const selectedPaceValue = paceValues[pace];

  const monthsBehindExact =
    cutoff && cutoff !== "C" && cutoff !== "U" && validDate ? monthIndex(priorityDate) - monthIndex(cutoff) : 0;

  const daysBehindExact =
    cutoff && cutoff !== "C" && cutoff !== "U" && validDate
      ? exactDaysBetween(cutoff, priorityDate)
      : lastDatedPoint && validDate
        ? exactDaysBetween(lastDatedPoint[1], priorityDate)
        : 0;

  const projection =
    estimate && estimate.status === "estimate" && selectedPaceValue !== null
      ? projectWithPace(monthsBehindExact, selectedPaceValue)
      : { months: null, capped: false };

  const projectedMonthLabel =
    projection.months !== null
      ? `${projection.capped ? "beyond " : ""}${projectedMonthLabelFromToday(projection.months)}`
      : null;

  const paceLabel = (v: number | null) => (v === null ? "n/a" : `${Math.round(v * 30)} days/month`);
  const lastDatedMonthLabel = lastDatedPoint ? formatBulletinMonth(lastDatedPoint[0]) : null;
  const asOfSuffix = usingFallback && lastDatedMonthLabel ? ` as of ${lastDatedMonthLabel}, before this freeze` : "";

  const paceAssumptionLabel = (() => {
    switch (pace) {
      case "recent12":
        return `the trailing 12-month pace (${paceLabel(effectivePace12)})${asOfSuffix}`;
      case "longrun60":
        return `the trailing 60-month pace (${paceLabel(effectivePace60)})${asOfSuffix}`;
      case "fast":
        return `1.5x the trailing 60-month pace (${paceLabel(paceValues.fast)})${asOfSuffix}`;
      case "slow":
        return `0.4x the trailing 60-month pace (${paceLabel(paceValues.slow)})${asOfSuffix}`;
    }
  })();

  const series = useMemo(() => getExtendedSeries(category, country), [category, country]);
  const chartPoints = series ? series[chart] : null;

  const cutoffMonthLabel = (() => {
    const [y, m] = bulletin.month.split("-").map(Number);
    const MONTHS_ABBR = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${MONTHS_ABBR[m - 1]} ${y}`;
  })();

  return (
    <div>
      {/* Controls */}
      <div className="grid gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:grid-cols-4 sm:p-6">
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExtendedCategory)}
            className={`mt-1 ${selectClass}`}
          >
            {EXTENDED_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EXTENDED_CATEGORY_SHORT[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">Country of birth</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as ExtendedCountry)}
            className={`mt-1 ${selectClass}`}
          >
            {EXTENDED_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {EXTENDED_COUNTRY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-800">Your priority date</span>
          <input
            type="date"
            value={priorityDate}
            onChange={(e) => setPriorityDate(e.target.value)}
            className={`mt-1 ${selectClass}`}
          />
        </label>
        <div className="block">
          <span className="text-xs font-semibold text-ink-800">Chart</span>
          <div className="mt-1 grid grid-cols-2 gap-1 rounded-xl border border-ink-900/10 bg-ink-50 p-1">
            <button
              type="button"
              onClick={() => setChart("fad")}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                chart === "fad" ? "bg-white text-brand-700 shadow-sm" : "text-ink-500"
              }`}
              aria-pressed={chart === "fad"}
            >
              Final Action
            </button>
            <button
              type="button"
              onClick={() => setChart("dff")}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                chart === "dff" ? "bg-white text-brand-700 shadow-sm" : "text-ink-500"
              }`}
              aria-pressed={chart === "dff"}
            >
              Dates for Filing
            </button>
          </div>
        </div>
      </div>

      {/* Hero band */}
      <div className="mt-6">
        {estimate ? (
          <QueueHeroBand
            status={estimate.status}
            cutoff={cutoff}
            cutoffMonthLabel={cutoffMonthLabel}
            priorityDate={priorityDate}
            chart={chart}
            monthsBehind={monthsBehindExact}
            projectedMonths={projection.months}
            projectedMonthsCapped={projection.capped}
            paceAssumptionLabel={paceAssumptionLabel}
            projectedMonthLabel={projectedMonthLabel}
            historicalPaceNote={
              usingFallback && effectivePace12 !== null && lastDatedPoint
                ? `${paceLabel(effectivePace12)} (as of ${lastDatedMonthLabel})`
                : null
            }
          />
        ) : (
          <p className="text-sm text-ink-500">Enter a valid priority date to see your queue position.</p>
        )}
      </div>

      {/* Stat strip */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-ink-900/5 bg-[#fafafa] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Gap to close</p>
          <p className="mt-1 text-lg font-bold text-ink-900">
            {estimate?.status === "current"
              ? "None — current"
              : cutoff && cutoff !== "C" && cutoff !== "U" && daysBehindExact > 0
                ? daysToYearsDays(daysBehindExact)
                : usingFallback && lastDatedPoint && daysBehindExact > 0
                  ? daysToYearsDays(daysBehindExact)
                  : "—"}
          </p>
          {usingFallback && lastDatedPoint && daysBehindExact > 0 && (
            <p className="mt-1 text-[10px] text-ink-400">as of {lastDatedMonthLabel}, before this freeze</p>
          )}
        </div>
        <div className="rounded-xl border border-ink-900/5 bg-[#fafafa] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Latest bulletin movement</p>
          <p className="mt-1 text-lg font-bold text-ink-900">
            {movement.status === "current"
              ? "Current"
              : movement.status === "unavailable"
                ? "Unavailable"
                : movement.monthsMoved !== null
                  ? `${movement.monthsMoved > 0 ? "+" : ""}${Math.round(movement.monthsMoved * 30)} days`
                  : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-ink-900/5 bg-[#fafafa] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">12-month avg pace</p>
          <p className="mt-1 text-lg font-bold text-ink-900">{paceLabel(effectivePace12)}</p>
          {usingFallback && effectivePace12 !== null && lastDatedPoint && (
            <p className="mt-1 text-[10px] text-ink-400">as of {lastDatedMonthLabel}, before this freeze</p>
          )}
        </div>
        <div className="rounded-xl border border-ink-900/5 bg-[#fafafa] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Retrogressions (60 mo)</p>
          <p className="mt-1 text-lg font-bold text-ink-900">{retro60}</p>
        </div>
        <div className="rounded-xl border border-ink-900/5 bg-[#fafafa] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Projected current month</p>
          <p className="mt-1 text-lg font-bold text-ink-900">{projectedMonthLabel ?? "—"}</p>
        </div>
      </div>

      {/* Pace scenarios */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-400">Pace scenario</p>
        <div className="flex flex-wrap gap-2">
          {([
            ["recent12", "Recent pace (12mo)"],
            ["longrun60", "Long-run pace (60mo)"],
            ["fast", "1.5x long-run"],
            ["slow", "0.4x long-run"],
          ] as [PaceScenario, string][]).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPace(id)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                pace === id
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-ink-900/10 bg-white text-ink-600 hover:bg-ink-50"
              }`}
              aria-pressed={pace === id}
            >
              {label}
              <span className="ml-1.5 font-normal text-ink-400">({paceLabel(paceValues[id])})</span>
            </button>
          ))}
        </div>
      </div>

      {/* History chart */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">History</p>
        {chartPoints && chartPoints.length ? (
          <QueueHistoryChart
            points={chartPoints}
            priorityDate={validDate ? priorityDate : undefined}
            chartLabel={chart === "fad" ? "Final Action Date" : "Dates for Filing"}
          />
        ) : (
          <p className="text-sm text-ink-400">No verified historical data for this selection yet.</p>
        )}
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-ink-400">
        <strong className="font-semibold text-ink-500">Every figure above is a projection, not a promise.</strong>{" "}
        Cutoff movement is driven by demand, per-country limits, and quota
        spillover — it is not a trend and can go backwards. This tool is
        informational only and is not legal advice.
      </p>
    </div>
  );
}
