"use client";

/**
 * Signature visual for the Green Card Queue Tracker: a horizontal band with
 * two pins — the current cutoff and the user's priority date — and a dashed
 * projection extending from the priority date out to the month the cutoff is
 * projected to reach it. Not a literal calendar axis: distances are
 * proportional to "months of gap" (solid) and "months of projected wait"
 * (dashed) on a shared scale, so the two segments are visually comparable.
 * Animates position changes via CSS transition; disabled under
 * prefers-reduced-motion via the motion-reduce: variant.
 */

import { formatCutoff, formatMonths, type ChartKind } from "@/lib/visa-bulletin";

export interface QueueHeroBandProps {
  status: "current" | "estimate" | "stalled" | "retrogressing" | "unavailable" | "no-data";
  cutoff: string | null;
  cutoffMonthLabel: string;
  priorityDate: string;
  chart: ChartKind;
  monthsBehind: number;
  /** Projected wait in months under the currently-selected pace scenario, or null if none applies. */
  projectedMonths: number | null;
  /** True when projectedMonths hit the display ceiling — the real wait is longer, not exactly this figure. */
  projectedMonthsCapped?: boolean;
  /** Human label of the pace assumption driving projectedMonths, e.g. "recent 12-month pace (2.1 mo/mo)". */
  paceAssumptionLabel: string;
  projectedMonthLabel: string | null;
}

function monthsToLabel(m: number, capped?: boolean): string {
  const total = Math.round(m);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const suffix = capped ? "+" : "";
  if (years === 0) return `${months} mo${suffix}`;
  if (months === 0) return `${years} yr${suffix}`;
  return `${years} yr ${months} mo${suffix}`;
}

export default function QueueHeroBand({
  status,
  cutoff,
  cutoffMonthLabel,
  priorityDate,
  chart,
  monthsBehind,
  projectedMonths,
  projectedMonthsCapped,
  paceAssumptionLabel,
  projectedMonthLabel,
}: QueueHeroBandProps) {
  const chartLabel = chart === "fad" ? "Final Action Date" : "Dates for Filing";
  const priorityLabel = formatCutoff(priorityDate);

  if (status === "current") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 text-center sm:p-8">
        <p className="text-2xl font-extrabold tracking-tight text-emerald-700 sm:text-3xl">
          Your date is current
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-emerald-800">
          Your priority date ({priorityLabel}) is already before the current{" "}
          {chartLabel} ({cutoffMonthLabel}: {formatCutoff(cutoff ?? "C")}). No
          queue is ahead of you in this category/country under this chart.
        </p>
      </div>
    );
  }

  if (status === "unavailable" || status === "no-data") {
    return (
      <div className="rounded-3xl border border-ink-900/10 bg-[#fafafa] p-6 text-center sm:p-8">
        <p className="text-xl font-bold text-ink-900 sm:text-2xl">
          {status === "unavailable" ? "No visa numbers this month" : "Not enough verified data to show a queue band"}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-500">
          {status === "unavailable"
            ? `${chartLabel} is Unavailable ("U") for this category and country this month, regardless of priority date — this is an official Department of State status, not a data gap.`
            : "This category/country/chart cell could not be verified against the official Visa Bulletin archive, so we show nothing rather than a guess."}
        </p>
      </div>
    );
  }

  // monthsBehind is the solid span; projectedMonths (if any) is the dashed span.
  const solidSpan = Math.max(monthsBehind, 1);
  const dashedSpan = projectedMonths ?? 0;
  const totalSpan = solidSpan + dashedSpan || 1;
  const pin2Pct = Math.min(98, (solidSpan / totalSpan) * 100);
  const endPct = projectedMonths !== null ? 100 : pin2Pct;

  const verdict =
    status === "stalled"
      ? "Movement has stalled — no reliable projection"
      : status === "retrogressing"
        ? "Currently retrogressing — no reliable projection"
        : projectedMonths !== null
          ? `About ${monthsToLabel(projectedMonths, projectedMonthsCapped)} to go`
          : "Not enough pace data for a projection";

  const verdictColor =
    status === "stalled"
      ? "text-amber-600"
      : status === "retrogressing"
        ? "text-rose-600"
        : "text-ink-900";

  return (
    <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      <p className={`text-center text-2xl font-extrabold tracking-tight sm:text-3xl ${verdictColor}`}>
        {verdict}
      </p>
      <p className="mx-auto mt-1 max-w-xl text-center text-xs text-ink-400">
        Projection, not a promise — assumes {paceAssumptionLabel}.
      </p>

      <div className="relative mx-auto mt-10 h-2 max-w-3xl rounded-full bg-ink-900/5 motion-reduce:transition-none">
        {/* solid span: queue ahead */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-500 transition-all duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${pin2Pct}%` }}
        />
        {/* dashed span: projected forward wait */}
        {projectedMonths !== null && (
          <div
            className="absolute inset-y-0 border-t-2 border-dashed border-brand-300 transition-all duration-700 ease-out motion-reduce:transition-none"
            style={{ left: `${pin2Pct}%`, right: `${100 - endPct}%`, top: "-1px" }}
          />
        )}

        {/* Pin 1: current cutoff */}
        <div
          className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center transition-all duration-700 ease-out motion-reduce:transition-none"
          style={{ left: "0%" }}
        >
          <span className="h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-brand-600 shadow" />
          <span className="mt-1.5 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-ink-700">
            Cutoff: {cutoffMonthLabel}
          </span>
        </div>

        {/* Pin 2: user's priority date */}
        <div
          className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center transition-all duration-700 ease-out motion-reduce:transition-none"
          style={{ left: `${pin2Pct}%` }}
        >
          <span className="h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-ink-900 shadow" />
          <span className="mt-1.5 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-ink-700">
            You: {priorityLabel}
          </span>
        </div>

        {/* End marker: projected reach month */}
        {projectedMonths !== null && projectedMonthLabel && (
          <div
            className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center transition-all duration-700 ease-out motion-reduce:transition-none"
            style={{ left: `${endPct}%` }}
          >
            <span className="h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-emerald-500 shadow" />
            <span className="mt-1.5 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-emerald-700">
              {projectedMonthLabel.startsWith("beyond") ? "" : "~"}{projectedMonthLabel}
            </span>
          </div>
        )}
      </div>

      <p className="sr-only">
        Text alternative: current {chartLabel} cutoff is {cutoffMonthLabel}
        {cutoff ? ` (${formatCutoff(cutoff)})` : ""}. Your priority date is{" "}
        {priorityLabel}, {formatMonths(monthsBehind)} behind the cutoff.{" "}
        {projectedMonths !== null && projectedMonthLabel
          ? `Projected to be reached around ${projectedMonthLabel}, assuming ${paceAssumptionLabel}.`
          : "No reliable forward projection is available."}
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-600" /> Current cutoff
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-900" /> Your priority date
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-brand-500" /> Queue ahead of you
        </span>
        {projectedMonths !== null && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded border-t-2 border-dashed border-brand-300" /> Projected additional wait
          </span>
        )}
      </div>
    </div>
  );
}
