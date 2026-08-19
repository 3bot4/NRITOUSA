"use client";

import { useId, useMemo, useState } from "react";
import {
  getSeries,
  monthIndex,
  formatCutoff,
  formatBulletinMonth,
  type Cutoff,
  type SeriesPoint,
} from "@/lib/visa-bulletin";

/**
 * EB-2 India Final Action Date, plotted from the October 2023 bulletin (the
 * FY2024 reset) through the predicted October 2026 bulletin (the FY2027 reset).
 *
 * Every published value resolves from data/visa-bulletin/history.json +
 * current.json via getSeries() step carry-forward — there are no hand-written
 * historical dates in this component, so the chart re-draws itself on each
 * monthly data refresh. The single forward-looking value is the `prediction`
 * prop, which is drawn dashed and hollow and labelled "predicted" everywhere
 * it appears (line, marker, tooltip, aria description).
 *
 * The chart is an enhancement, never the only way to read the numbers: the
 * page renders the same series as a table below it.
 */

/** Two dates are the same cutoff → the FAD is a step function, so we draw steps. */
type Month = { ym: string; cutoff: Cutoff | null };

const PLOT = { w: 760, h: 340, l: 68, r: 28, t: 22, b: 40 };

const C = {
  line: "#1e40f5", // brand-600
  grid: "#e5e7eb",
  axis: "#6b7280", // ink-400
  ink: "#0b1120", // ink-900
  surface: "#ffffff",
};

function ymLabel(ym: string) {
  const [y, m] = ym.split("-");
  return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(m) - 1]} '${y.slice(2)}`;
}

function addMonths(ym: string, n: number) {
  const mi = Math.round(monthIndex(ym)) + n;
  return `${Math.floor(mi / 12)}-${String((mi % 12) + 1).padStart(2, "0")}`;
}

/** Step carry-forward: the cutoff in force for `ym`. */
function cutoffAt(points: SeriesPoint[], ym: string): Cutoff | null {
  const target = monthIndex(ym);
  let v: Cutoff | null = null;
  for (const [month, cutoff] of points) {
    if (monthIndex(month) > target) break;
    v = cutoff;
  }
  return v;
}

export default function Eb2OctoberOutlook({
  from = "2023-10",
  to = "2026-09",
  predictionMonth = "2026-10",
  prediction = "2014-07-15",
  className = "",
}: {
  from?: string;
  to?: string;
  predictionMonth?: string;
  /** The one forward-looking value on the chart — always drawn as a prediction. */
  prediction?: Cutoff;
  className?: string;
}) {
  const uid = useId();
  const [hover, setHover] = useState<number | null>(null);

  const series = getSeries("eb2", "india");

  const months = useMemo<Month[]>(() => {
    if (!series) return [];
    const out: Month[] = [];
    const start = Math.round(monthIndex(from));
    const end = Math.round(monthIndex(to));
    for (let mi = start; mi <= end; mi++) {
      const ym = `${Math.floor(mi / 12)}-${String((mi % 12) + 1).padStart(2, "0")}`;
      out.push({ ym, cutoff: cutoffAt(series.fad, ym) });
    }
    return out;
  }, [series, from, to]);

  if (!series || !months.length) return null;

  const dated = months.filter(
    (m): m is { ym: string; cutoff: string } =>
      !!m.cutoff && m.cutoff !== "U" && m.cutoff !== "C"
  );
  if (!dated.length) return null;

  /* ---- scales ---------------------------------------------------------- */
  const x0 = monthIndex(from) - 0.5;
  const x1 = monthIndex(predictionMonth) + 0.5;
  const yVals = [...dated.map((d) => monthIndex(d.cutoff)), monthIndex(prediction)];
  // Asymmetric padding: the peak and the predicted point sit at the same height,
  // so the top needs room for their direct labels without either colliding with
  // the plateau line that runs between them.
  const y0 = Math.min(...yVals) - 3;
  const y1 = Math.max(...yVals) + 10;

  const X = (ym: string) =>
    PLOT.l + ((monthIndex(ym) - x0) / (x1 - x0)) * (PLOT.w - PLOT.l - PLOT.r);
  const Y = (v: Cutoff) =>
    PLOT.h -
    PLOT.b -
    ((monthIndex(v) - y0) / (y1 - y0)) * (PLOT.h - PLOT.t - PLOT.b);

  /* ---- y gridlines: Jan of each year in range -------------------------- */
  const yTicks: string[] = [];
  for (let yr = Math.ceil(y0 / 12); yr <= Math.floor(y1 / 12); yr++) {
    yTicks.push(`${yr}-01-01`);
  }

  /* ---- x labels: each October + the FY2026 peak ------------------------ */
  const xTicks = months
    .map((m) => m.ym)
    .concat(predictionMonth)
    .filter((ym) => ym.endsWith("-10") || ym.endsWith("-04"));

  /* ---- step path across published, dated months ------------------------ */
  // The FAD holds flat within a month and jumps between them, so a step path
  // (horizontal to the next month, then vertical) is the truthful shape — a
  // straight diagonal would imply smooth daily movement that never happened.
  const runs: { ym: string; cutoff: string }[][] = [];
  let run: { ym: string; cutoff: string }[] = [];
  for (const m of months) {
    if (m.cutoff && m.cutoff !== "U" && m.cutoff !== "C") {
      run.push({ ym: m.ym, cutoff: m.cutoff });
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  }
  if (run.length) runs.push(run);

  const stepPath = (pts: { ym: string; cutoff: string }[]) => {
    let d = "";
    pts.forEach((p, i) => {
      const px = X(p.ym);
      const py = Y(p.cutoff);
      if (i === 0) d += `M ${px} ${py}`;
      else d += ` L ${px} ${Y(pts[i - 1].cutoff)} L ${px} ${py}`;
    });
    // hold the last value to the end of its month
    const last = pts[pts.length - 1];
    d += ` L ${X(addMonths(last.ym, 1))} ${Y(last.cutoff)}`;
    return d;
  };

  /* ---- unavailable band ------------------------------------------------ */
  const unavailable = months.filter((m) => m.cutoff === "U").map((m) => m.ym);
  const band =
    unavailable.length > 0
      ? {
          x: X(unavailable[0]),
          w: X(addMonths(unavailable[unavailable.length - 1], 1)) - X(unavailable[0]),
          label: `${ymLabel(unavailable[0])}–${ymLabel(unavailable[unavailable.length - 1])}`,
        }
      : null;

  /* ---- hover targets --------------------------------------------------- */
  const targets = [
    ...months.map((m) => ({ ym: m.ym, cutoff: m.cutoff, predicted: false })),
    { ym: predictionMonth, cutoff: prediction, predicted: true },
  ];
  const active = hover != null ? targets[hover] : null;

  const lastDated = dated[dated.length - 1];
  const peak = dated.reduce((a, b) =>
    monthIndex(b.cutoff) > monthIndex(a.cutoff) ? b : a
  );

  const bandW = (PLOT.w - PLOT.l - PLOT.r) / (targets.length || 1);

  const ariaLabel =
    `Line chart: EB-2 India Final Action Date by visa bulletin month, ` +
    `${formatBulletinMonth(from)} to ${formatBulletinMonth(predictionMonth)}. ` +
    `It advances from ${formatCutoff(dated[0].cutoff)} to a FY2026 high of ` +
    `${formatCutoff(peak.cutoff)}, retrogresses to ${formatCutoff(lastDated.cutoff)}, ` +
    `is Unavailable ${band ? band.label : ""}, and is predicted by NRItoUSA to return to ` +
    `${formatCutoff(prediction)} in the ${formatBulletinMonth(predictionMonth)} bulletin. ` +
    `The same values are listed in the table below this chart.`;

  return (
    <figure className={`mx-auto max-w-[860px] ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="border-b border-ink-900/5 px-4 py-3">
          <h3 className="text-sm font-bold text-ink-900">
            EB-2 India Final Action Date — three fiscal-year resets
          </h3>
          <p className="mt-0.5 text-xs text-ink-400">
            Published cutoffs from the Department of State bulletin, plus our
            October 2026 estimate.
          </p>
        </div>

        <div className="relative px-2 pb-1 pt-2">
          <svg
            viewBox={`0 0 ${PLOT.w} ${PLOT.h}`}
            className="block h-auto w-full touch-pan-y"
            role="img"
            aria-label={ariaLabel}
            onMouseLeave={() => setHover(null)}
          >
            {/* y grid + labels */}
            {yTicks.map((t) => (
              <g key={t}>
                <line
                  x1={PLOT.l}
                  y1={Y(t)}
                  x2={PLOT.w - PLOT.r}
                  y2={Y(t)}
                  stroke={C.grid}
                  strokeWidth={1}
                />
                <text
                  x={PLOT.l - 10}
                  y={Y(t) + 4}
                  textAnchor="end"
                  fontSize={11.5}
                  fill={C.axis}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  Jan {t.slice(0, 4)}
                </text>
              </g>
            ))}

            {/* unavailable band */}
            {band && (
              <>
                <rect
                  x={band.x}
                  y={PLOT.t}
                  width={band.w}
                  height={PLOT.h - PLOT.t - PLOT.b}
                  fill={C.axis}
                  opacity={0.09}
                />
                {/* Sits at the foot of the band — the only part of that column
                    with no line running through it. */}
                <text
                  x={band.x + band.w / 2}
                  y={PLOT.h - PLOT.b - 12}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontWeight={700}
                  fill={C.axis}
                >
                  UNAVAILABLE
                </text>
              </>
            )}

            {/* x labels */}
            {xTicks.map((ym) => (
              <text
                key={ym}
                x={X(ym)}
                y={PLOT.h - PLOT.b + 20}
                textAnchor="middle"
                fontSize={11.5}
                fill={C.axis}
              >
                {ymLabel(ym)}
              </text>
            ))}

            {/* published step line */}
            {runs.map((r, i) => (
              <path
                key={i}
                d={stepPath(r)}
                fill="none"
                stroke={C.line}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* dashed bridge to the predicted point */}
            <path
              d={`M ${X(lastDated.ym)} ${Y(lastDated.cutoff)} L ${X(predictionMonth)} ${Y(prediction)}`}
              fill="none"
              stroke={C.line}
              strokeWidth={2}
              strokeDasharray="3 6"
              strokeLinecap="round"
              opacity={0.85}
            />

            {/* selective direct labels: the FY2026 peak and the prediction */}
            {/* The peak and the prediction are the same date, so labelling both
                with it just prints the value twice. The peak carries the
                context instead; the prediction carries the date. */}
            <text
              x={X(peak.ym) - 10}
              y={Y(peak.cutoff) + 4}
              textAnchor="end"
              fontSize={11.5}
              fontWeight={700}
              fill={C.ink}
            >
              FY2026 high
            </text>
            <text
              x={X(predictionMonth) + 8}
              y={Y(prediction) - 15}
              textAnchor="end"
              fontSize={11.5}
              fontWeight={700}
              fill={C.line}
            >
              Predicted {formatCutoff(prediction)}
            </text>

            {/* peak marker */}
            <circle
              cx={X(peak.ym)}
              cy={Y(peak.cutoff)}
              r={4}
              fill={C.line}
              stroke={C.surface}
              strokeWidth={2}
            />
            {/* prediction marker — hollow, matching the dashed line */}
            <circle
              cx={X(predictionMonth)}
              cy={Y(prediction)}
              r={5}
              fill={C.surface}
              stroke={C.line}
              strokeWidth={2.5}
            />

            {/* hover crosshair + marker */}
            {active && active.cutoff && active.cutoff !== "U" && active.cutoff !== "C" && (
              <>
                <line
                  x1={X(active.ym)}
                  y1={PLOT.t}
                  x2={X(active.ym)}
                  y2={PLOT.h - PLOT.b}
                  stroke={C.axis}
                  strokeWidth={1}
                  opacity={0.45}
                />
                <circle
                  cx={X(active.ym)}
                  cy={Y(active.cutoff)}
                  r={5}
                  fill={active.predicted ? C.surface : C.line}
                  stroke={active.predicted ? C.line : C.surface}
                  strokeWidth={2.5}
                />
              </>
            )}

            {/* generous invisible hit bands — one per month */}
            {targets.map((t, i) => (
              <rect
                key={`${uid}-hit-${t.ym}`}
                x={X(t.ym) - bandW / 2}
                y={PLOT.t}
                width={bandW}
                height={PLOT.h - PLOT.t - PLOT.b}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onTouchStart={() => setHover(i)}
              />
            ))}
          </svg>

          {/* tooltip */}
          {active && (
            <div
              className="pointer-events-none absolute z-10 w-max max-w-[220px] rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-xs leading-relaxed shadow-lg"
              style={{
                left: `calc(${(X(active.ym) / PLOT.w) * 100}% ${
                  X(active.ym) > PLOT.w * 0.58 ? "- 232px" : "+ 12px"
                })`,
                top: `${(PLOT.t / PLOT.h) * 100 + 4}%`,
              }}
            >
              <div className="font-bold text-ink-900">
                {formatBulletinMonth(active.ym)} bulletin
              </div>
              <div className="mt-0.5 text-ink-600">
                Final Action:{" "}
                <span className="font-semibold text-ink-900">
                  {active.predicted ? "predicted " : ""}
                  {active.cutoff ? formatCutoff(active.cutoff) : "—"}
                </span>
              </div>
              {active.predicted && (
                <div className="mt-1 text-[0.6875rem] text-ink-400">
                  NRItoUSA estimate — not a published date.
                </div>
              )}
              {active.cutoff === "U" && (
                <div className="mt-1 text-[0.6875rem] text-ink-400">
                  India&rsquo;s FY2026 EB-2 limit was reached.
                </div>
              )}
            </div>
          )}
        </div>

        {/* legend — three states, not three identities */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink-900/5 px-4 py-2.5 text-[0.6875rem] text-ink-500">
          <span className="flex items-center gap-1.5">
            <svg width="18" height="8" aria-hidden>
              <line x1="0" y1="4" x2="18" y2="4" stroke={C.line} strokeWidth="2" />
            </svg>
            Published by DOS
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="8" aria-hidden>
              <line
                x1="0"
                y1="4"
                x2="18"
                y2="4"
                stroke={C.line}
                strokeWidth="2"
                strokeDasharray="3 4"
              />
            </svg>
            NRItoUSA prediction
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 rounded-sm bg-ink-400/25" />
            Category Unavailable
          </span>
        </div>
      </div>

      <figcaption className="mt-2 px-1 text-xs leading-relaxed text-ink-400">
        Final Action Dates for EB-2 India, by bulletin month. The line steps
        because a cutoff holds all month and then jumps. Published values:{" "}
        <a
          href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
          className="underline hover:text-brand-600"
          rel="nofollow noopener"
          target="_blank"
        >
          U.S. Department of State Visa Bulletin
        </a>
        . The October 2026 point is our estimate, not a published date — every
        value also appears in the table below.
      </figcaption>
    </figure>
  );
}
