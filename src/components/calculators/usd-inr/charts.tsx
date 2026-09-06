/**
 * Inline-SVG charts for the USD/INR send-now-or-wait calculator.
 *
 * No charting library, deliberately. The site's CSP allows scripts only from
 * self plus a short analytics allowlist (see next.config.mjs), so a CDN copy of
 * Chart.js would be blocked in production — silently. These follow the same
 * hand-rolled pattern as CutoffChart/QueueHistoryChart.
 *
 * Every chart is a viewBox + `h-auto w-full`, which gives the browser an
 * intrinsic aspect ratio and therefore zero layout shift while the page
 * hydrates. Colours come from the scenario data so a series is the same colour
 * in all four charts.
 */

import type { BankForecast, FxScenario, RupeeDriver } from "@/data/usdInrForecastData";
import { projectRate } from "@/lib/calc/usdInrTiming";

const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Chart A starts at the month FX_USDINR was quoted: September 2026. */
const START_MONTH = 8; // zero-based → September
const START_YEAR = 2026;

function monthLabel(offset: number, short = true): string {
  const abs = START_MONTH + offset;
  const year = START_YEAR + Math.floor(abs / 12);
  const m = ((abs % 12) + 12) % 12;
  return short
    ? `${MONTHS_ABBR[m]} '${String(year).slice(2)}`
    : `${MONTHS_ABBR[m]} ${year}`;
}

/** Rounds a bound out to a tidy tick so gridlines land on readable numbers. */
function niceBounds(min: number, max: number, step: number) {
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  return { lo, hi: hi === lo ? lo + step : hi };
}

/* ══════════════════ A. Scenario projection, Sep 2026 – Dec 2028 ══════════════════ */

export function ScenarioProjectionChart({
  spot,
  scenarios,
  activeKey,
  waitMonths,
}: {
  spot: number;
  scenarios: FxScenario[];
  activeKey: string;
  waitMonths: number;
}) {
  const W = 760;
  const H = 340;
  const m = { top: 20, right: 16, bottom: 34, left: 52 };
  const MONTHS = 27; // Sep 2026 → Dec 2028

  const series = scenarios.map((s) => ({
    scenario: s,
    points: Array.from({ length: MONTHS + 1 }, (_, i) =>
      projectRate(spot, s.driftPct, i)
    ),
  }));

  const all: number[] = [];
  for (let i = 0; i < series.length; i++) {
    for (let j = 0; j < series[i].points.length; j++) all.push(series[i].points[j]);
  }
  const { lo, hi } = niceBounds(Math.min.apply(null, all), Math.max.apply(null, all), 5);

  const x = (i: number) => m.left + (i / MONTHS) * (W - m.left - m.right);
  const y = (v: number) =>
    H - m.bottom - ((v - lo) / (hi - lo)) * (H - m.top - m.bottom);

  const yTicks: number[] = [];
  for (let v = lo; v <= hi + 0.001; v += 5) yTicks.push(v);

  const xTickIdx = [0, 4, 10, 16, 22, 27];
  const active = scenarios.filter((s) => s.key === activeKey)[0] || scenarios[0];
  const markerX = x(Math.min(MONTHS, Math.max(0, waitMonths)));
  const markerRate = projectRate(spot, active.driftPct, waitMonths);

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Projected USD to INR rate from September 2026 to December 2028 under four scenarios, starting at ${spot.toFixed(
          2
        )}. The ${active.label} scenario reaches ${markerRate.toFixed(
          2
        )} after ${waitMonths} months.`}
        className="h-auto w-full"
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              x2={W - m.right}
              y1={y(t)}
              y2={y(t)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={m.left - 8}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#6b7280"
            >
              ₹{t}
            </text>
          </g>
        ))}

        {xTickIdx.map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 12}
            // Anchor the end labels inward — centred, they'd be clipped by the
            // viewBox at both edges of the plot area.
            textAnchor={i === 0 ? "start" : i === MONTHS ? "end" : "middle"}
            fontSize="11"
            fill="#6b7280"
          >
            {monthLabel(i)}
          </text>
        ))}

        {/* Today's rate — the line every scenario fans out from. */}
        <line
          x1={m.left}
          x2={W - m.right}
          y1={y(spot)}
          y2={y(spot)}
          stroke="#9ca3af"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Chosen wait month. */}
        <line
          x1={markerX}
          x2={markerX}
          y1={m.top}
          y2={H - m.bottom}
          stroke="#0b1120"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <rect
          x={Math.min(markerX + 6, W - m.right - 96)}
          y={m.top + 2}
          width="92"
          height="34"
          rx="6"
          fill="#0b1120"
        />
        <text
          x={Math.min(markerX + 12, W - m.right - 90)}
          y={m.top + 15}
          fontSize="10"
          fill="#9ca3af"
        >
          {waitMonths === 0 ? "Today" : `In ${waitMonths} mo`}
        </text>
        <text
          x={Math.min(markerX + 12, W - m.right - 90)}
          y={m.top + 29}
          fontSize="13"
          fontWeight="700"
          fill="#ffffff"
        >
          ₹{markerRate.toFixed(2)}
        </text>

        {series.map(({ scenario, points }) => {
          const on = scenario.key === activeKey;
          return (
            <polyline
              key={scenario.key}
              points={points
                .map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`)
                .join(" ")}
              fill="none"
              stroke={scenario.color}
              strokeWidth={on ? 3 : 1.5}
              strokeOpacity={on ? 1 : 0.32}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* Dot where the active scenario meets the chosen month. */}
        <circle cx={markerX} cy={y(markerRate)} r="5" fill={active.color} />
        <circle cx={markerX} cy={y(markerRate)} r="5" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>

      <figcaption className="mt-2 text-xs text-ink-400">
        Scenario paths compound the annual drift monthly from ₹{spot.toFixed(2)}.
        These are illustrations of a rate of change, not predictions.
      </figcaption>
    </figure>
  );
}

/* ══════════════════════ B. 20 years of USD/INR history ══════════════════════ */

export function HistoryChart({
  data,
  cagrPct,
}: {
  data: { year: number; rate: number; partial?: boolean }[];
  cagrPct: number;
}) {
  const W = 760;
  const H = 320;
  const m = { top: 20, right: 16, bottom: 34, left: 52 };

  const rates = data.map((d) => d.rate);
  const { lo, hi } = niceBounds(Math.min.apply(null, rates), Math.max.apply(null, rates), 10);
  const first = data[0];
  const last = data[data.length - 1];

  const x = (year: number) =>
    m.left + ((year - first.year) / (last.year - first.year)) * (W - m.left - m.right);
  const y = (v: number) =>
    H - m.bottom - ((v - lo) / (hi - lo)) * (H - m.top - m.bottom);

  const yTicks: number[] = [];
  for (let v = lo; v <= hi + 0.001; v += 10) yTicks.push(v);

  const actual = data
    .map((d) => `${x(d.year).toFixed(1)},${y(d.rate).toFixed(1)}`)
    .join(" ");

  // Trend line: the same start point compounding at the measured CAGR.
  const trend = data
    .map((d) => {
      const v = first.rate * Math.pow(1 + cagrPct / 100, d.year - first.year);
      return `${x(d.year).toFixed(1)},${y(v).toFixed(1)}`;
    })
    .join(" ");

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`USD to INR year-end rates from ${first.year} to ${last.year}, rising from ${first.rate} to ${last.rate}, an average of ${cagrPct.toFixed(
          1
        )} percent a year.`}
        className="h-auto w-full"
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={m.left} x2={W - m.right} y1={y(t)} y2={y(t)} stroke="#e5e7eb" />
            <text x={m.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6b7280">
              ₹{t}
            </text>
          </g>
        ))}

        {data
          .filter((d) => d.year % 4 === 2 || d.year === last.year)
          .map((d) => (
            <text
              key={d.year}
              x={x(d.year)}
              y={H - 12}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {d.year}
            </text>
          ))}

        <polyline
          points={trend}
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
        <polyline
          points={actual}
          fill="none"
          stroke="#1e40f5"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {data.map((d) => (
          <circle
            key={d.year}
            cx={x(d.year)}
            cy={y(d.rate)}
            r={d.partial ? 5 : 2.5}
            fill={d.partial ? "#f59e0b" : "#1e40f5"}
          />
        ))}

        <g transform={`translate(${m.left + 10}, ${m.top + 6})`}>
          <line x1="0" y1="0" x2="22" y2="0" stroke="#1e40f5" strokeWidth="2.5" />
          <text x="28" y="4" fontSize="11" fill="#374151">
            Actual year-end rate
          </text>
          <line x1="0" y1="16" x2="22" y2="16" stroke="#9ca3af" strokeWidth="2" strokeDasharray="6 5" />
          <text x="28" y="20" fontSize="11" fill="#374151">
            Steady {cagrPct.toFixed(1)}%/yr trend
          </text>
        </g>
      </svg>

      <figcaption className="mt-2 text-xs text-ink-400">
        The amber dot is today&rsquo;s live rate, not a year-end close.
      </figcaption>
    </figure>
  );
}

/* ═════════════════════ C. Bank forecast ranges vs today ═════════════════════ */

export function BankForecastChart({
  forecasts,
  spot,
}: {
  forecasts: BankForecast[];
  spot: number;
}) {
  const rowH = 42;
  const W = 760;
  const m = { top: 34, right: 20, bottom: 30, left: 116 };
  const H = m.top + forecasts.length * rowH + m.bottom;

  const values: number[] = [spot];
  for (let i = 0; i < forecasts.length; i++) {
    const f = forecasts[i];
    if (f.end2026 !== null) values.push(f.end2026);
    if (f.mid2027 !== null) values.push(f.mid2027);
    if (f.end2027 !== null) values.push(f.end2027);
  }
  const { lo, hi } = niceBounds(Math.min.apply(null, values) - 1, Math.max.apply(null, values) + 1, 2);

  const x = (v: number) => m.left + ((v - lo) / (hi - lo)) * (W - m.left - m.right);

  const xTicks: number[] = [];
  for (let v = lo; v <= hi + 0.001; v += 2) xTicks.push(v);

  const horizons: { key: "end2026" | "mid2027" | "end2027"; label: string; fill: string }[] = [
    { key: "end2026", label: "End 2026", fill: "#1e40f5" },
    { key: "mid2027", label: "Mid 2027", fill: "#598dff" },
    { key: "end2027", label: "End 2027", fill: "#8eb6ff" },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Published bank forecasts for USD to INR compared with today's rate of ${spot.toFixed(
          2
        )}. Full figures are in the table below this chart.`}
        className="h-auto w-full"
      >
        {xTicks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={m.top - 8} y2={H - m.bottom} stroke="#e5e7eb" />
            <text x={x(t)} y={H - m.bottom + 16} textAnchor="middle" fontSize="11" fill="#6b7280">
              ₹{t}
            </text>
          </g>
        ))}

        {/* Today — the reference every forecast is judged against. */}
        <line
          x1={x(spot)}
          x2={x(spot)}
          y1={m.top - 20}
          y2={H - m.bottom}
          stroke="#0b1120"
          strokeWidth="2"
        />
        <text x={x(spot)} y={m.top - 24} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b1120">
          Today ₹{spot.toFixed(2)}
        </text>

        {forecasts.map((f, i) => {
          const cy = m.top + i * rowH + rowH / 2;
          const pts = horizons
            .map((h) => ({ h, v: f[h.key] }))
            .filter((p): p is { h: typeof horizons[0]; v: number } => p.v !== null);
          const xs = pts.map((p) => x(p.v));

          return (
            <g key={f.bank}>
              <text x={m.left - 10} y={cy + 4} textAnchor="end" fontSize="12" fontWeight="600" fill="#1f2937">
                {f.bank}
              </text>
              {xs.length > 1 && (
                <line
                  x1={Math.min.apply(null, xs)}
                  x2={Math.max.apply(null, xs)}
                  y1={cy}
                  y2={cy}
                  stroke="#bcd3ff"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )}
              {pts.map((p) => (
                <g key={p.h.key}>
                  <circle cx={x(p.v)} cy={cy} r="7" fill={p.h.fill} />
                  <text
                    x={x(p.v)}
                    y={cy - 12}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#4b5563"
                  >
                    {p.v}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {horizons.map((h) => (
          <span key={h.key} className="flex items-center gap-1.5 text-xs text-ink-500">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: h.fill }}
            />
            {h.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ════════════════════ D. What waiting costs, live ════════════════════ */

export function WaitingCostChart({
  grid,
  scenarios,
  activeKey,
  currency,
}: {
  grid: { scenarioKey: string; cells: { months: number; advantage: number }[] }[];
  scenarios: FxScenario[];
  activeKey: string;
  currency: "INR" | "USD";
}) {
  const W = 760;
  const H = 320;
  const m = { top: 24, right: 16, bottom: 46, left: 74 };

  const horizons = grid.length ? grid[0].cells.map((c) => c.months) : [];
  const all: number[] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].cells.length; j++) all.push(grid[i].cells[j].advantage);
  }
  const peak = Math.max(1, Math.max.apply(null, all.map(Math.abs)));

  const bandW = (W - m.left - m.right) / Math.max(1, horizons.length);
  const barW = Math.min(26, (bandW - 16) / Math.max(1, grid.length));
  const zeroY = m.top + (H - m.top - m.bottom) / 2;
  const y = (v: number) => zeroY - (v / peak) * ((H - m.top - m.bottom) / 2);

  const sym = currency === "USD" ? "$" : "₹";
  const compact = (v: number) => {
    const a = Math.abs(v);
    if (currency === "USD") return `${sym}${Math.round(a).toLocaleString("en-US")}`;
    if (a >= 100000) return `${sym}${(a / 100000).toFixed(1)}L`;
    if (a >= 1000) return `${sym}${(a / 1000).toFixed(0)}k`;
    return `${sym}${Math.round(a)}`;
  };

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`How much waiting gains or costs at 3, 6, 12 and 24 months under each scenario, in ${currency}. Bars above the line mean waiting comes out ahead.`}
        className="h-auto w-full"
      >
        <text x={m.left - 8} y={y(peak) + 4} textAnchor="end" fontSize="11" fill="#059669">
          +{compact(peak)}
        </text>
        <text x={m.left - 8} y={y(-peak) + 4} textAnchor="end" fontSize="11" fill="#e11d48">
          −{compact(peak)}
        </text>
        <text x={m.left - 8} y={zeroY + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#4b5563">
          Break even
        </text>

        <line x1={m.left} x2={W - m.right} y1={zeroY} y2={zeroY} stroke="#9ca3af" strokeWidth="1.5" />

        {horizons.map((months, hi) => {
          const bandX = m.left + hi * bandW;
          const groupW = barW * grid.length + 4 * (grid.length - 1);
          const startX = bandX + (bandW - groupW) / 2;
          return (
            <g key={months}>
              {grid.map((s, si) => {
                const cell = s.cells[hi];
                const sc = scenarios.filter((x2) => x2.key === s.scenarioKey)[0];
                const on = s.scenarioKey === activeKey;
                const bx = startX + si * (barW + 4);
                const top = cell.advantage >= 0 ? y(cell.advantage) : zeroY;
                const h = Math.max(1, Math.abs(y(cell.advantage) - zeroY));
                return (
                  <rect
                    key={s.scenarioKey}
                    x={bx}
                    y={top}
                    width={barW}
                    height={h}
                    rx="3"
                    fill={sc ? sc.color : "#9ca3af"}
                    fillOpacity={on ? 1 : 0.3}
                  >
                    {/* Must be a single string: React cannot reconcile a
                        <title> with multiple children, and splitting it into
                        text + expression nodes breaks hydration. */}
                    <title>{`${sc ? sc.label : s.scenarioKey}, ${months} months: ${
                      cell.advantage >= 0 ? "waiting gains" : "waiting costs"
                    } ${compact(cell.advantage)}`}</title>
                  </rect>
                );
              })}
              <text
                x={bandX + bandW / 2}
                y={H - 22}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#374151"
              >
                {months} mo
              </text>
            </g>
          );
        })}

        <text x={m.left} y={H - 6} fontSize="10" fill="#6b7280">
          Above the line = waiting wins · below = sending today wins
        </text>
      </svg>

      {/* Without this the faded bars are unattributable — the SVG <title>
          tooltips only help a mouse user. */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {scenarios.map((sc) => (
          <span
            key={sc.key}
            className={`flex items-center gap-1.5 text-xs ${
              sc.key === activeKey ? "font-semibold text-ink-700" : "text-ink-500"
            }`}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{
                backgroundColor: sc.color,
                opacity: sc.key === activeKey ? 1 : 0.35,
              }}
            />
            {sc.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ═══════════════════ Diagram: what moves the rupee ═══════════════════ */

export function RupeeDriversDiagram({ drivers }: { drivers: RupeeDriver[] }) {
  const W = 760;
  const H = 330;

  const weakens = drivers.filter((d) => d.effect === "weakens");
  const supports = drivers.filter((d) => d.effect === "supports");

  // 196 wide, not 176: "Services exports & remittances" overflowed the
  // narrower box at this font size.
  const boxW = 196;
  const boxH = 46;
  const leftX = 16;
  const rightX = W - boxW - 16;
  const hubX = W / 2 - 62;
  const hubY = H / 2 - 34;

  const yFor = (i: number, n: number) => 46 + i * ((H - 130) / Math.max(1, n - 1 || 1));

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Diagram: oil imports, the gap between Fed and RBI interest rates, and foreign investor outflows all push demand for dollars up, which weakens the rupee. Services exports, NRI remittances and RBI dollar sales push the other way and slow the fall."
        className="h-auto w-full"
      >
        <defs>
          <marker id="arrow-weak" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#e11d48" />
          </marker>
          <marker id="arrow-support" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
          </marker>
        </defs>

        <text x={leftX} y="24" fontSize="12" fontWeight="700" fill="#e11d48">
          PUSHES THE RUPEE DOWN
        </text>
        <text x={rightX + boxW} y="24" textAnchor="end" fontSize="12" fontWeight="700" fill="#059669">
          HOLDS THE RUPEE UP
        </text>

        {weakens.map((d, i) => {
          const cy = yFor(i, weakens.length);
          return (
            <g key={d.key}>
              <rect x={leftX} y={cy} width={boxW} height={boxH} rx="10" fill="#fff1f2" stroke="#fecdd3" />
              <text x={leftX + boxW / 2} y={cy + 28} textAnchor="middle" fontSize="12" fontWeight="600" fill="#9f1239">
                {d.label}
              </text>
              <line
                x1={leftX + boxW + 4}
                y1={cy + boxH / 2}
                x2={hubX - 8}
                y2={hubY + 34}
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeOpacity="0.55"
                markerEnd="url(#arrow-weak)"
              />
            </g>
          );
        })}

        {supports.map((d, i) => {
          const cy = yFor(i, supports.length) + 30;
          return (
            <g key={d.key}>
              <rect x={rightX} y={cy} width={boxW} height={boxH} rx="10" fill="#ecfdf5" stroke="#a7f3d0" />
              <text x={rightX + boxW / 2} y={cy + 28} textAnchor="middle" fontSize="12" fontWeight="600" fill="#065f46">
                {d.label}
              </text>
              <line
                x1={rightX - 4}
                y1={cy + boxH / 2}
                x2={hubX + 128}
                y2={hubY + 34}
                stroke="#059669"
                strokeWidth="1.5"
                strokeOpacity="0.55"
                markerEnd="url(#arrow-support)"
              />
            </g>
          );
        })}

        {/* The hub: everything above is really one thing — demand for dollars. */}
        <rect x={hubX} y={hubY} width="124" height="68" rx="12" fill="#0b1120" />
        <text x={hubX + 62} y={hubY + 27} textAnchor="middle" fontSize="11" fill="#9ca3af">
          Net demand for
        </text>
        <text x={hubX + 62} y={hubY + 46} textAnchor="middle" fontSize="16" fontWeight="700" fill="#ffffff">
          US dollars
        </text>

        <line
          x1={hubX + 62}
          y1={hubY + 74}
          x2={hubX + 62}
          y2={H - 46}
          stroke="#0b1120"
          strokeWidth="2"
          markerEnd="url(#arrow-weak)"
        />
        <text x={hubX + 62} y={H - 26} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0b1120">
          USD/INR moves
        </text>
        <text x={hubX + 62} y={H - 10} textAnchor="middle" fontSize="11" fill="#6b7280">
          more dollar demand → more rupees per dollar
        </text>
      </svg>
    </figure>
  );
}
