/**
 * Charts for a PROJECTED visa-bulletin month page.
 *
 * Inline SVG, no library, same constraint as MonthCharts.tsx.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE DRAWING RULES THAT KEEP THIS HONEST
 *
 * 1. Published history is a SOLID line. The projected range is a shaded band
 *    with a dashed boundary, and it starts at the last published point. A
 *    reader who looks only at the picture must be able to see where the data
 *    stops and the arithmetic starts.
 * 2. A month the category was Current or Unavailable is a GAP in the line, not
 *    a point. Drawing through it would invent a cutoff that never existed —
 *    the same trap describeMovement() guards in visaBulletinMonths.ts.
 * 3. The band's floor is the last published cutoff, because "no movement" is
 *    the most common outcome in the archive. It is not a pessimistic
 *    assumption; it is the modal one.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  LAST_PUBLISHED_MONTH,
  WINDOW,
  projectCutoff,
  readSeries,
  sameMonthHistory,
  type Chart,
} from "@/lib/visaBulletinProjections";
import { monthLabel } from "@/lib/visaBulletinMonths";

const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2014-07-15" → 2014.54, so a cutoff can be plotted on a year axis. */
function toYearFraction(value: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!m) return null;
  return Number(m[1]) + (Number(m[2]) - 1) / 12 + (Number(m[3]) - 1) / 372;
}

function fromYearFraction(v: number): string {
  const y = Math.floor(v);
  const mi = Math.min(11, Math.max(0, Math.floor((v - y) * 12)));
  return `${MONTHS_ABBR[mi]} ${y}`;
}

function shortMonth(bulletinMonth: string): string {
  const [y, m] = bulletinMonth.split("-");
  return `${MONTHS_ABBR[Number(m) - 1]} '${y.slice(2)}`;
}

const SERIES = [
  { category: "eb1", label: "EB-1 India", colour: "#0891b2" },
  { category: "eb2", label: "EB-2 India", colour: "#4338ca" },
  { category: "eb3", label: "EB-3 India", colour: "#b45309" },
];

/**
 * India EB-1/EB-2/EB-3 across the trailing window, with the projected range
 * for `targetMonth` drawn as a band beyond the last published bulletin.
 */
export function ProjectedMovementChart({
  targetMonth,
  chart = "fad",
}: {
  targetMonth: string;
  chart?: Chart;
}) {
  const series = SERIES.map((s) => {
    const full = readSeries(s.category, "india", "categories", LAST_PUBLISHED_MONTH);
    const points = full.slice(Math.max(0, full.length - WINDOW));
    const projection = projectCutoff(s.category, "india", chart, targetMonth);
    return { ...s, points, projection };
  }).filter((s) => s.points.length > 1);

  if (series.length === 0) {
    return (
      <p className="mt-4 text-sm text-ink-400">
        Not enough verified history to chart this window yet.
      </p>
    );
  }

  const months = series[0].points.map((p) => p.month);
  // One extra slot on the x-axis for the projected month.
  const slots = months.length + 1;

  const values: number[] = [];
  for (const s of series) {
    for (const p of s.points) {
      const v = toYearFraction(p[chart]);
      if (v !== null) values.push(v);
    }
    const hi = toYearFraction(s.projection.high);
    const lo = toYearFraction(s.projection.low);
    if (hi !== null) values.push(hi);
    if (lo !== null) values.push(lo);
  }

  if (values.length < 2) {
    return (
      <p className="mt-4 text-sm text-ink-400">
        This window is mostly Current or Unavailable, so there is nothing to
        chart as a date.
      </p>
    );
  }

  const W = 780;
  const H = 340;
  const m = { top: 20, right: 128, bottom: 52, left: 68 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const yMin = Math.min.apply(null, values);
  const yMax = Math.max.apply(null, values);
  const span = yMax - yMin || 1;

  const x = (i: number) => m.left + (i / (slots - 1)) * plotW;
  const y = (v: number) => m.top + plotH - ((v - yMin) / span) * plotH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * span);
  const xTickIdx = [0, Math.floor((months.length - 1) / 2), months.length - 1, slots - 1];
  const boundaryX = x(months.length - 1);

  const chartLabel = chart === "fad" ? "final action" : "dates for filing";

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Line chart of India EB-1, EB-2 and EB-3 ${chartLabel} cutoffs across the ${
          months.length
        } bulletins ending ${monthLabel(
          LAST_PUBLISHED_MONTH,
        )}, with the projected range for ${monthLabel(
          targetMonth,
        )} shown as a shaded band beyond the last published point. ${series
          .map(
            (s) =>
              `${s.label}: last published ${s.projection.basis || "not a date"}, projected range ${s.projection.rangeLabel}`,
          )
          .join(". ")}. A break in a line is a month the category was Current or Unavailable.`}
        className="h-auto w-full"
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={m.left} y1={y(v)} x2={W - m.right} y2={y(v)} stroke="#e2e8f0" />
            <text x={m.left - 8} y={y(v) + 4} textAnchor="end" fontSize="11.5" fill="#64748b">
              {fromYearFraction(v)}
            </text>
          </g>
        ))}

        {/* The boundary between published data and projection */}
        <rect
          x={boundaryX}
          y={m.top}
          width={W - m.right - boundaryX}
          height={plotH}
          fill="#f8fafc"
        />
        <line
          x1={boundaryX}
          y1={m.top}
          x2={boundaryX}
          y2={m.top + plotH}
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x={boundaryX + 6}
          y={m.top + 12}
          fontSize="10"
          fontWeight="700"
          fill="#94a3b8"
        >
          projected
        </text>

        {series.map((s) => {
          // Split into unbroken runs so a Current or Unavailable month is a gap.
          const runs: { i: number; v: number }[][] = [];
          let run: { i: number; v: number }[] = [];
          s.points.forEach((p, i) => {
            const v = toYearFraction(p[chart]);
            if (v === null) {
              if (run.length > 0) runs.push(run);
              run = [];
            } else {
              run.push({ i, v });
            }
          });
          if (run.length > 0) runs.push(run);

          const lo = toYearFraction(s.projection.low);
          const hi = toYearFraction(s.projection.high);
          const lastI = months.length - 1;
          const projI = slots - 1;

          return (
            <g key={s.category}>
              {/* Published history */}
              {runs.map((r, ri) =>
                r.length === 1 ? (
                  <circle key={ri} cx={x(r[0].i)} cy={y(r[0].v)} r="3" fill={s.colour} />
                ) : (
                  <polyline
                    key={ri}
                    points={r.map((p) => `${x(p.i)},${y(p.v)}`).join(" ")}
                    fill="none"
                    stroke={s.colour}
                    strokeWidth="2.5"
                  />
                ),
              )}

              {/* Projected range band */}
              {lo !== null && hi !== null && (
                <>
                  <polygon
                    points={`${x(lastI)},${y(lo)} ${x(projI)},${y(lo)} ${x(projI)},${y(hi)} ${x(lastI)},${y(lo)}`}
                    fill={s.colour}
                    opacity="0.16"
                  />
                  <line
                    x1={x(lastI)}
                    y1={y(lo)}
                    x2={x(projI)}
                    y2={y(hi)}
                    stroke={s.colour}
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />
                  <line
                    x1={x(lastI)}
                    y1={y(lo)}
                    x2={x(projI)}
                    y2={y(lo)}
                    stroke={s.colour}
                    strokeWidth="1.5"
                    strokeDasharray="2 3"
                  />
                </>
              )}

              {/* Legend */}
              <text
                x={W - m.right + 10}
                y={y(hi ?? lo ?? yMin) + 4}
                fontSize="11.5"
                fontWeight="700"
                fill={s.colour}
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {xTickIdx.map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - m.bottom + 20}
            textAnchor={i === 0 ? "start" : i === slots - 1 ? "end" : "middle"}
            fontSize="11"
            fontWeight={i === slots - 1 ? 700 : 400}
            fill={i === slots - 1 ? "#0f172a" : "#64748b"}
          >
            {i === slots - 1 ? shortMonth(targetMonth) : shortMonth(months[i])}
          </text>
        ))}
        <text x={m.left} y={H - 10} fontSize="10.5" fill="#94a3b8">
          Solid = published. Shaded band = projected range, floor is no movement. A gap is a month that was Current or Unavailable.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        India EB {chartLabel} cutoffs across the {months.length} bulletins ending{" "}
        {monthLabel(LAST_PUBLISHED_MONTH)}, built from the snapshot archive in{" "}
        <code>data/visa-bulletin/</code>, which is derived from the official
        Department of State bulletins. The band to the right of the dashed line
        is this site&rsquo;s projection, not a published figure.
      </figcaption>
    </figure>
  );
}

/**
 * The method, drawn: how a published cutoff plus observed movement produces a
 * range rather than a date.
 */
export function ProjectionMethodDiagram({ targetMonth }: { targetMonth: string }) {
  const p = projectCutoff("eb2", "india", "fad", targetMonth);

  const W = 760;
  const H = 230;

  const boxes = [
    {
      x: 16,
      y: 54,
      w: 200,
      h: 76,
      t: "Trailing 12 bulletins",
      s: "Month-over-month change for this category and country, from the snapshot archive",
    },
    {
      x: 248,
      y: 54,
      w: 200,
      h: 76,
      t: "Drop C and U",
      s: "They are states, not dates. A transition either way contributes nothing to the arithmetic",
      accent: true,
    },
    {
      x: 480,
      y: 54,
      w: 200,
      h: 76,
      t: "75th-percentile advance",
      s: "Compounded over the horizon, then held at the bulletin's own month",
    },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Diagram of the projection method. Take month-over-month change across the trailing twelve bulletins; exclude months that were Current or Unavailable because those are states rather than dates; take the 75th-percentile observed advance and compound it over the horizon, capped at the bulletin's own month. The result is a range whose floor is no movement. For EB-2 India final action in ${monthLabel(
          targetMonth,
        )} that gives ${p.rangeLabel} from ${p.sampleSize} comparable pairs.`}
        className="h-auto w-full"
      >
        <defs>
          <marker id="pmarrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x={16} y={26} fontSize="13" fontWeight="800" fill="#0f172a">
          How a projected range is built
        </text>
        <text x={16} y={42} fontSize="10.5" fill="#64748b">
          Derived in code from the archive, not typed in. Nothing here is a published figure.
        </text>

        {boxes.map((b, i) => (
          <g key={b.t}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="10"
              fill={b.accent ? "#fffbeb" : "#ffffff"}
              stroke={b.accent ? "#fcd34d" : "#e2e8f0"}
              strokeWidth="1.5"
            />
            <text x={b.x + 14} y={b.y + 22} fontSize="12.5" fontWeight="700" fill="#0f172a">
              {b.t}
            </text>
            <foreignObject x={b.x + 12} y={b.y + 28} width={b.w - 24} height={b.h - 32}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: "10.5px", lineHeight: 1.35, color: "#64748b", fontFamily: "inherit" }}
              >
                {b.s}
              </div>
            </foreignObject>
            {i < boxes.length - 1 && (
              <line
                x1={b.x + b.w}
                y1={b.y + b.h / 2}
                x2={b.x + b.w + 30}
                y2={b.y + b.h / 2}
                stroke="#94a3b8"
                strokeWidth="1.6"
                markerEnd="url(#pmarrow)"
              />
            )}
          </g>
        ))}

        <rect x={16} y={154} width={728} height={56} rx="10" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x={32} y={176} fontSize="11.5" fontWeight="800" fill="#312e81">
          Worked example — EB-2 India final action, {monthLabel(targetMonth)}
        </text>
        <text x={32} y={196} fontSize="11" fill="#312e81">
          {p.sampleSize} comparable pairs · {p.excludedMonths} months excluded as C or U · {p.perMonthAdvance} days per bulletin · horizon {p.horizon} · range {p.rangeLabel}
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The floor of every range is &ldquo;no movement&rdquo;, because across the
        archive that is the most common single outcome rather than a pessimistic
        assumption. The ceiling is held at the bulletin&rsquo;s own month: a
        cutoff that reaches the present means there is no queue left, which the
        bulletin prints as C rather than as a future date.
      </figcaption>
    </figure>
  );
}

/**
 * What this CALENDAR month has actually done, across every year in the
 * archive. The figure that makes a November page about November.
 */
export function SameMonthHistoryChart({ targetMonth }: { targetMonth: string }) {
  const h = sameMonthHistory(targetMonth);
  if (h.events.length === 0) {
    return (
      <p className="mt-4 text-sm text-ink-400">
        The archive holds no comparable {h.monthName} for this row.
      </p>
    );
  }

  const W = 720;
  const rowH = 44;
  const H = 70 + h.events.length * rowH;
  const m = { left: 70, right: 24 };
  const plotW = W - m.left - m.right;
  const mid = m.left + plotW * 0.42;

  const maxAbs = Math.max(
    30,
    ...h.events.map((e) => Math.abs(e.days ?? 0)),
  );
  const scale = (days: number) => (days / maxAbs) * (plotW * 0.5);

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Chart of what the India EB-2 final action date did in every ${h.monthName} in the archive. ${h.events
          .map((e) => `${e.year}: ${e.label}`)
          .join("; ")}. ${h.summary}`}
        className="h-auto w-full"
      >
        <line x1={mid} y1={30} x2={mid} y2={H - 34} stroke="#cbd5e1" strokeWidth="1.5" />
        <text x={mid} y={22} textAnchor="middle" fontSize="10.5" fill="#94a3b8">
          no movement
        </text>
        <text x={mid - 60} y={22} textAnchor="end" fontSize="10.5" fill="#e11d48">
          ← backwards
        </text>
        <text x={mid + 60} y={22} fontSize="10.5" fill="#059669">
          forwards →
        </text>

        {h.events.map((e, i) => {
          const y = 42 + i * rowH;
          const d = e.days ?? 0;
          const w = Math.abs(scale(d));
          const forward = d > 0;
          return (
            <g key={e.month}>
              <text x={16} y={y + 18} fontSize="12.5" fontWeight="700" fill="#0f172a">
                {h.monthName.slice(0, 3)} {e.year}
              </text>
              {e.kind === "static" ? (
                <>
                  <circle cx={mid} cy={y + 13} r="5" fill="#94a3b8" />
                  <text x={mid + 14} y={y + 18} fontSize="11.5" fill="#64748b">
                    no movement
                  </text>
                </>
              ) : e.kind === "state-change" ? (
                <>
                  <rect x={mid - 4} y={y + 3} width={8} height={20} rx="2" fill="#f59e0b" />
                  <text x={mid + 14} y={y + 18} fontSize="11.5" fill="#92400e">
                    {e.label}
                  </text>
                </>
              ) : (
                <>
                  <rect
                    x={forward ? mid : mid - w}
                    y={y + 4}
                    width={Math.max(2, w)}
                    height={18}
                    rx="3"
                    fill={forward ? "#059669" : "#e11d48"}
                  />
                  <text
                    x={forward ? mid + w + 8 : mid - w - 8}
                    y={y + 18}
                    textAnchor={forward ? "start" : "end"}
                    fontSize="11.5"
                    fontWeight="700"
                    fill="#0f172a"
                  >
                    {Math.abs(d)} days
                  </text>
                </>
              )}
            </g>
          );
        })}
        <text x={16} y={H - 12} fontSize="10.5" fill="#94a3b8">
          India EB-2 final action, {h.monthName} only, one row per year in the archive.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        {h.summary} Built from the snapshot archive in{" "}
        <code>data/visa-bulletin/</code>, derived from the official Department of
        State bulletins. Months the category was Current or Unavailable are shown
        as state changes rather than as a number of days, because they are states
        and not dates.
      </figcaption>
    </figure>
  );
}
