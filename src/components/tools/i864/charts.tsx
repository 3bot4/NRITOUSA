/**
 * Inline-SVG charts and the decision diagram for the I-864 page.
 *
 * No charting library, deliberately — the production CSP (next.config.mjs)
 * allows scripts from self plus analytics only, so a CDN chart build would be
 * blocked silently. Same hand-rolled approach as usd-inr/charts.tsx.
 *
 * Every figure is a viewBox + `h-auto w-full`, which gives the browser an
 * intrinsic aspect ratio and therefore no layout shift, and each carries a
 * caption plus a text equivalent for screen readers and answer engines.
 */

import { thresholdSeries } from "@/lib/calc/i864Income";
import type { I864Location } from "@/data/affidavitOfSupportData";
import { I864_TABLES, I864P } from "@/data/affidavitOfSupportData";

const usd0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const usdK = (n: number) => `$${Math.round(n / 1000)}k`;

/* ══════════════ A. Your income vs the requirement ══════════════ */

export function IncomeVsRequirementChart({
  income,
  required,
  meets,
}: {
  income: number;
  required: number;
  meets: boolean;
}) {
  const W = 620;
  const H = 210;
  const m = { top: 28, right: 20, bottom: 40, left: 20 };
  const top = Math.max(income, required, 1) * 1.15;
  const plotH = H - m.top - m.bottom;
  const barW = 150;
  const gap = 90;
  const startX = (W - (barW * 2 + gap)) / 2;

  const h = (v: number) => Math.max(2, (v / top) * plotH);
  const yOf = (v: number) => H - m.bottom - h(v);

  const bars = [
    { label: "Your income", value: income, x: startX, fill: meets ? "#059669" : "#e11d48" },
    { label: "Required", value: required, x: startX + barW + gap, fill: "#4338ca" },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart. Your income ${usd0(income)} against the required ${usd0(
          required
        )}. You ${meets ? "meet" : "do not meet"} the requirement.`}
        className="h-auto w-full"
      >
        <line
          x1={m.left}
          y1={H - m.bottom}
          x2={W - m.right}
          y2={H - m.bottom}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {/* the requirement line, drawn across both bars so the gap is visible */}
        <line
          x1={m.left}
          y1={yOf(required)}
          x2={W - m.right}
          y2={yOf(required)}
          stroke="#4338ca"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        {bars.map((b) => (
          <g key={b.label}>
            <rect
              x={b.x}
              y={yOf(b.value)}
              width={barW}
              height={h(b.value)}
              rx="5"
              fill={b.fill}
            />
            <text
              x={b.x + barW / 2}
              y={yOf(b.value) - 9}
              textAnchor="middle"
              fontSize="17"
              fontWeight="700"
              fill="#0f172a"
            >
              {usd0(b.value)}
            </text>
            <text
              x={b.x + barW / 2}
              y={H - m.bottom + 22}
              textAnchor="middle"
              fontSize="13"
              fill="#475569"
            >
              {b.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs text-ink-400">
        Your most recent total income against 125% of the Federal Poverty
        Guidelines for your household size and location. Source: Form I-864P,
        effective {I864P.effective}.
      </figcaption>
    </figure>
  );
}

/* ══════════════ B. Threshold by household size ══════════════ */

export function ThresholdBySizeChart({
  location,
  military = false,
  highlightSize,
}: {
  location: I864Location;
  military?: boolean;
  highlightSize?: number;
}) {
  const series = thresholdSeries(location, military);
  const W = 720;
  const H = 300;
  const m = { top: 24, right: 18, bottom: 52, left: 62 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const max = Math.ceil((series[series.length - 1].required * 1.08) / 10_000) * 10_000;
  const step = plotW / series.length;
  const barW = step * 0.6;

  const y = (v: number) => m.top + plotH - (v / max) * plotH;

  const ticks: number[] = [];
  for (let v = 0; v <= max; v += 20_000) ticks.push(v);

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart of the minimum sponsor income by household size, ${
          I864_TABLES[location].shortLabel
        }: ${series.map((p) => `${p.size} people ${usd0(p.required)}`).join("; ")}.`}
        className="h-auto w-full"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              y1={y(t)}
              x2={W - m.right}
              y2={y(t)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text x={m.left - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#64748b">
              {usdK(t)}
            </text>
          </g>
        ))}

        {series.map((p, i) => {
          const x = m.left + i * step + (step - barW) / 2;
          const on = highlightSize === p.size;
          return (
            <g key={p.size}>
              <rect
                x={x}
                y={y(p.required)}
                width={barW}
                height={m.top + plotH - y(p.required)}
                rx="4"
                fill={on ? "#4338ca" : "#a5b4fc"}
              />
              <text
                x={x + barW / 2}
                y={y(p.required) - 7}
                textAnchor="middle"
                fontSize="12"
                fontWeight={on ? "700" : "600"}
                fill={on ? "#312e81" : "#475569"}
              >
                {usdK(p.required)}
              </text>
              <text
                x={x + barW / 2}
                y={H - m.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight={on ? "700" : "400"}
                fill="#475569"
              >
                {p.size}
              </text>
            </g>
          );
        })}

        <text
          x={m.left + plotW / 2}
          y={H - 10}
          textAnchor="middle"
          fontSize="12"
          fill="#64748b"
        >
          People in the household (including everyone you are sponsoring)
        </text>
      </svg>
      <figcaption className="mt-2 text-xs text-ink-400">
        Minimum income a sponsor must show — {military ? "100%" : "125%"} of the
        Federal Poverty Guidelines, {I864_TABLES[location].shortLabel}. Source:
        Form I-864P, effective {I864P.effective}.
      </figcaption>
    </figure>
  );
}

/* ══════════════ C. Decision flow diagram ══════════════ */

/**
 * "Can you sponsor?" decision flow. Authored at 360px-readable font sizes —
 * the smallest text here is 13px in a 760-wide viewBox, which is ~6px at
 * 360px CSS width, so the diagram is deliberately a vertical stack rather
 * than a wide flowchart, and each node spans most of the width.
 */
export function SponsorDecisionDiagram() {
  const W = 700;
  const rowH = 78;
  const gap = 26;
  const rows = 5;
  const H = rows * rowH + (rows - 1) * gap + 24;

  const nodes = [
    {
      title: "1. Are you eligible to sponsor at all?",
      body: "US citizen or permanent resident, 18 or older, domiciled in the US.",
      fill: "#eef2ff",
      stroke: "#c7d2fe",
    },
    {
      title: "2. Count the household",
      body: "You + spouse + children under 21 + tax dependents + everyone on this affidavit + anyone still covered by an earlier I-864.",
      fill: "#eef2ff",
      stroke: "#c7d2fe",
    },
    {
      title: "3. Is your income at least 125% of the guideline for that size?",
      body: "100% instead if you are on active duty and sponsoring your own spouse or child.",
      fill: "#ecfdf5",
      stroke: "#a7f3d0",
    },
    {
      title: "Yes → file the I-864 with your most recent tax return",
      body: "Transcript or a full copy, with W-2s or 1099s.",
      fill: "#ecfdf5",
      stroke: "#6ee7b7",
    },
    {
      title: "No → close the gap one of three ways",
      body: "Household member income (Form I-864A) · net assets worth 3x, 5x or 1x the shortfall · a joint sponsor who meets the requirement on their own.",
      fill: "#fffbeb",
      stroke: "#fcd34d",
    },
  ];

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Decision flow for sponsoring on Form I-864, described in the numbered list below the diagram."
        className="h-auto w-full"
      >
        {nodes.map((n, i) => {
          const y = 8 + i * (rowH + gap);
          return (
            <g key={n.title}>
              <rect
                x="8"
                y={y}
                width={W - 16}
                height={rowH}
                rx="12"
                fill={n.fill}
                stroke={n.stroke}
                strokeWidth="1.5"
              />
              <text x="26" y={y + 29} fontSize="17" fontWeight="700" fill="#0f172a">
                {n.title}
              </text>
              <text x="26" y={y + 54} fontSize="14" fill="#475569">
                {n.body.length > 88 ? `${n.body.slice(0, 86)}…` : n.body}
              </text>
              {i < nodes.length - 1 && (
                <path
                  d={`M ${W / 2} ${y + rowH} L ${W / 2} ${y + rowH + gap - 6}`}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#i864-arrow)"
                />
              )}
            </g>
          );
        })}
        <defs>
          <marker
            id="i864-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">
          The same flow in words:
        </strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            Check you can sponsor at all — a US citizen or permanent resident,
            at least 18, and domiciled in the United States.
          </li>
          <li>
            Count the household: yourself, your spouse, your unmarried children
            under 21, anyone else you claimed as a dependent, everyone you are
            sponsoring on this affidavit, and anyone still covered by an I-864
            you signed previously.
          </li>
          <li>
            Compare your total income from your most recent federal tax return
            against 125% of the poverty guideline for that household size — or
            100% if you are on active duty in the armed forces and sponsoring
            your own spouse or child.
          </li>
          <li>
            If you meet it, file the I-864 with that tax return (a transcript or
            a complete copy, with the W-2s or 1099s).
          </li>
          <li>
            If you do not, close the gap with a household member&apos;s income on
            Form I-864A, with net assets worth three, five or one times the
            shortfall depending on the case, or with a joint sponsor who meets
            the requirement on their own income.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
