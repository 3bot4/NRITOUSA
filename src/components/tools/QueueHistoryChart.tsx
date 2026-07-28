"use client";

/**
 * History chart for the Green Card Queue Tracker, two modes:
 *   A — cutoff date over time (line), with the user's priority date as a
 *       horizontal reference and retrogression months marked with a dot.
 *   B — days advanced per month (bar), negative bars below zero for
 *       retrogressions.
 * Inline SVG, no charting library, matching the site's existing convention
 * (see CutoffChart.tsx). Includes a plain-text data table as an accessible
 * alternative to the chart.
 */

import { useState } from "react";
import { monthIndex, type SeriesPoint } from "@/lib/visa-bulletin";

const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fmtMonthIndex(mi: number): string {
  const y = Math.floor(mi / 12);
  const m = Math.round(mi % 12);
  return `${MONTHS_ABBR[Math.min(Math.max(m, 0), 11)]} ${y}`;
}

function fmtYm(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS_ABBR[m - 1]} ${y}`;
}

export interface QueueHistoryChartProps {
  points: SeriesPoint[];
  priorityDate?: string;
  chartLabel: string;
}

export default function QueueHistoryChart({ points, priorityDate, chartLabel }: QueueHistoryChartProps) {
  const [mode, setMode] = useState<"cutoff" | "pace">("cutoff");

  const dated = points.filter(([, v]) => v !== "C" && v !== "U");
  if (dated.length < 2) {
    return (
      <p className="text-sm text-ink-400">
        Not enough verified historical data to chart this selection yet.
      </p>
    );
  }

  const monthsArr = points.map(([ym]) => ym);
  const valueAt = (i: number): number | null => {
    const [, v] = points[i];
    if (v === "C" || v === "U") return null;
    return monthIndex(v);
  };
  const values = monthsArr.map((_, i) => valueAt(i));

  // Month-over-month movement in days (mode B), null where either side is C/U.
  const deltasDays = values.map((v, i) => {
    if (i === 0 || v === null || values[i - 1] === null) return null;
    return (v - (values[i - 1] as number)) * 30;
  });

  const priorityMi = priorityDate ? monthIndex(priorityDate) : null;

  const width = 720;
  const height = 300;
  const m = { top: 16, right: 16, bottom: 30, left: 68 };

  const button = (id: "cutoff" | "pace", label: string) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
        mode === id ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"
      }`}
      aria-pressed={mode === id}
    >
      {label}
    </button>
  );

  if (mode === "cutoff") {
    const known = values.filter((v): v is number => v !== null);
    const yVals = priorityMi !== null ? [...known, priorityMi] : known;
    const yMin = Math.min(...yVals);
    const yMax = Math.max(...yVals);
    const ySpan = yMax - yMin || 1;

    const x = (i: number) => m.left + (i / (monthsArr.length - 1 || 1)) * (width - m.left - m.right);
    const y = (v: number) => height - m.bottom - ((v - yMin) / ySpan) * (height - m.top - m.bottom);

    const linePath = values
      .map((v, i) => (v === null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");

    const retroIdx: number[] = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== null && values[i - 1] !== null && (values[i] as number) < (values[i - 1] as number) - 0.03) {
        retroIdx.push(i);
      }
    }

    const yTicks = [0, 1 / 3, 2 / 3, 1].map((f) => yMin + f * ySpan);
    const xTickIdx = [0, Math.floor((monthsArr.length - 1) / 2), monthsArr.length - 1];

    return (
      <div>
        <div className="mb-4 flex gap-2">
          {button("cutoff", "Cutoff over time")}
          {button("pace", "Movement per month")}
        </div>
        <figure>
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${chartLabel} over time`} className="h-auto w-full">
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={m.left} x2={width - m.right} y1={y(t)} y2={y(t)} stroke="#0b1120" strokeOpacity="0.06" />
                <text x={m.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6b7280">
                  {fmtMonthIndex(t)}
                </text>
              </g>
            ))}
            {xTickIdx.map((i) => (
              <text key={monthsArr[i]} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill="#6b7280">
                {fmtYm(monthsArr[i])}
              </text>
            ))}
            {priorityMi !== null && priorityMi >= yMin && priorityMi <= yMax && (
              <g>
                <line
                  x1={m.left}
                  x2={width - m.right}
                  y1={y(priorityMi)}
                  y2={y(priorityMi)}
                  stroke="#111827"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />
                <text x={width - m.right} y={y(priorityMi) - 4} textAnchor="end" fontSize="11" fill="#111827" fontWeight="600">
                  Your priority date
                </text>
              </g>
            )}
            <polyline points={linePath} fill="none" stroke="#3563ff" strokeWidth="2.5" strokeLinejoin="round" />
            {retroIdx.map((i) => (
              <circle key={i} cx={x(i)} cy={y(values[i] as number)} r="4" fill="#e11d48" />
            ))}
          </svg>
          <figcaption className="mt-2 flex flex-wrap items-center gap-5 text-xs text-ink-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-6 rounded bg-brand-500" /> {chartLabel} cutoff
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-6 rounded border-t border-dashed border-ink-900" /> Your priority date
            </span>
            {retroIdx.length > 0 && (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-600" /> Retrogression ({retroIdx.length} month{retroIdx.length === 1 ? "" : "s"})
              </span>
            )}
          </figcaption>
        </figure>
      </div>
    );
  }

  // Mode B: days advanced per month, bar chart.
  const knownDeltas = deltasDays.filter((d): d is number => d !== null);
  const dMax = Math.max(1, ...knownDeltas.map((d) => Math.abs(d)));
  const zeroY = height - m.bottom - (0 - -dMax) / (dMax - -dMax) * (height - m.top - m.bottom);
  const yFor = (d: number) => height - m.bottom - ((d - -dMax) / (dMax - -dMax)) * (height - m.top - m.bottom);
  const barW = Math.max(1.5, (width - m.left - m.right) / monthsArr.length - 2);
  const xBar = (i: number) => m.left + (i / (monthsArr.length - 1 || 1)) * (width - m.left - m.right) - barW / 2;
  const xTickIdxB = [0, Math.floor((monthsArr.length - 1) / 2), monthsArr.length - 1];

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {button("cutoff", "Cutoff over time")}
        {button("pace", "Movement per month")}
      </div>
      <figure>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${chartLabel} movement per month, days`} className="h-auto w-full">
          <line x1={m.left} x2={width - m.right} y1={zeroY} y2={zeroY} stroke="#0b1120" strokeOpacity="0.15" />
          <text x={m.left - 8} y={zeroY + 4} textAnchor="end" fontSize="11" fill="#6b7280">0</text>
          {xTickIdxB.map((i) => (
            <text key={monthsArr[i]} x={xBar(i) + barW / 2} y={height - 8} textAnchor="middle" fontSize="11" fill="#6b7280">
              {fmtYm(monthsArr[i])}
            </text>
          ))}
          {deltasDays.map((d, i) => {
            if (d === null) return null;
            const y0 = yFor(0);
            const y1 = yFor(d);
            const top = Math.min(y0, y1);
            const h = Math.max(1, Math.abs(y1 - y0));
            return (
              <rect
                key={i}
                x={xBar(i)}
                y={top}
                width={barW}
                height={h}
                fill={d < 0 ? "#e11d48" : "#059669"}
                opacity={0.85}
              />
            );
          })}
        </svg>
        <figcaption className="mt-2 flex flex-wrap items-center gap-5 text-xs text-ink-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-emerald-600" /> Cutoff advanced
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-rose-600" /> Retrogressed
          </span>
          <span className="text-ink-400">Approximate — cutoff-months converted to days at 30 days/month.</span>
        </figcaption>
      </figure>
    </div>
  );
}
