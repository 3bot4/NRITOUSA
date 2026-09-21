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
import {
  I864_TABLES,
  I864P,
  I864_OBLIGATION_END,
  I864_OBLIGATION_NOT_END,
} from "@/data/affidavitOfSupportData";

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

/* ══════════ C. The three location tables, compared ══════════ */

/**
 * Alaska and Hawaii are not a footnote — at a household of four the Alaska
 * requirement is thousands of dollars above the contiguous one, and a sponsor
 * who read the wrong column files short. Drawn from the same official tables
 * the calculator uses.
 */
export function LocationComparisonChart() {
  const sizes = [2, 3, 4, 5, 6, 7, 8];
  const locations: { key: I864Location; label: string; fill: string }[] = [
    { key: "contiguous", label: "48 states, DC & territories", fill: "#4338ca" },
    { key: "alaska", label: "Alaska", fill: "#0284c7" },
    { key: "hawaii", label: "Hawaii", fill: "#059669" },
  ];

  const series = locations.map((loc) => ({
    ...loc,
    values: sizes.map((n) => thresholdSeries(loc.key, false).find((p) => p.size === n)?.required ?? 0),
  }));

  const max = Math.max(...series.flatMap((s) => s.values)) * 1.1;

  const W = 720;
  const H = 300;
  const m = { top: 30, right: 16, bottom: 62, left: 54 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;
  const groupW = plotW / sizes.length;
  const barW = (groupW - 16) / locations.length;

  const y = (v: number) => m.top + plotH - (v / max) * plotH;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Grouped bar chart comparing the 125 percent income requirement across the 48 contiguous states, Alaska and Hawaii, for household sizes 2 to 8. Written out below."
        className="h-auto w-full"
      >
        <text x="8" y="18" fontSize="13.5" fontWeight="700" fill="#0f172a">
          The same household size, three different requirements
        </text>

        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const v = max * t;
          return (
            <g key={t}>
              <line x1={m.left} y1={y(v)} x2={W - m.right} y2={y(v)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={m.left - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
                {usdK(v)}
              </text>
            </g>
          );
        })}

        {sizes.map((n, gi) => (
          <g key={n}>
            {series.map((s, si) => {
              const v = s.values[gi];
              const x = m.left + gi * groupW + 8 + si * barW;
              return (
                <rect
                  key={s.key}
                  x={x}
                  y={y(v)}
                  width={barW - 2}
                  height={Math.max(2, m.top + plotH - y(v))}
                  rx={2}
                  fill={s.fill}
                />
              );
            })}
            <text
              x={m.left + gi * groupW + groupW / 2}
              y={m.top + plotH + 18}
              textAnchor="middle"
              fontSize="12"
              fill="#475569"
            >
              {n}
            </text>
          </g>
        ))}

        <text
          x={m.left + plotW / 2}
          y={m.top + plotH + 36}
          textAnchor="middle"
          fontSize="11.5"
          fill="#94a3b8"
        >
          Household size
        </text>

        {series.map((s, i) => (
          <g key={s.key}>
            <rect x={m.left + i * 210} y={H - 18} width={11} height={11} rx={2} fill={s.fill} />
            <text x={m.left + i * 210 + 16} y={H - 8} fontSize="11.5" fill="#475569">
              {s.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs text-ink-400">
        125% of the Federal Poverty Guidelines by household size and location.
        At a household of four the Alaska figure is{" "}
        {usd0(
          (thresholdSeries("alaska", false).find((p) => p.size === 4)?.required ?? 0) -
            (thresholdSeries("contiguous", false).find((p) => p.size === 4)?.required ?? 0)
        )}{" "}
        above the contiguous one — a sponsor who reads the wrong column files
        short. Source: Form I-864P, effective {I864P.effective}.
      </figcaption>
    </figure>
  );
}

/* ══════════ D. How long the obligation lasts ══════════ */

export function ObligationTimelineDiagram() {
  const W = 720;
  const endH = 44;
  const top = 96;
  const H = top + I864_OBLIGATION_END.length * (endH + 8) + 116;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Diagram of the four events that end an I-864 obligation, and the five things that do not. Written out below."
        className="h-auto w-full"
      >
        <rect x={8} y={8} width={W - 16} height={54} rx={10} fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x={28} y={32} fontSize="15" fontWeight="700" fill="#0f172a">
          You sign. The obligation starts when the immigrant becomes a permanent resident.
        </text>
        <text x={28} y={52} fontSize="12.5" fill="#475569">
          It is enforceable by the immigrant, and by any agency that pays them a means-tested benefit.
        </text>

        <text x={8} y={86} fontSize="13" fontWeight="700" fill="#047857">
          It ends on exactly four events
        </text>

        {I864_OBLIGATION_END.map((e, i) => {
          const y = top + i * (endH + 8);
          return (
            <g key={e.event}>
              <rect x={8} y={y} width={344} height={endH} rx={8} fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
              <text x={24} y={y + 20} fontSize="12.5" fontWeight="700" fill="#0f172a">
                {e.event}
              </text>
              <text x={24} y={y + 36} fontSize="11.5" fill="#475569">
                {e.detail.length > 52 ? `${e.detail.slice(0, 51)}…` : e.detail}
              </text>
            </g>
          );
        })}

        <text x={376} y={86} fontSize="13" fontWeight="700" fill="#b91c1c">
          It does not end on any of these
        </text>
        {I864_OBLIGATION_NOT_END.map((t, i) => {
          const y = top + i * 30;
          return (
            <g key={t}>
              <text x={376} y={y + 16} fontSize="12" fill="#7f1d1d">
                ✕
              </text>
              <text x={394} y={y + 16} fontSize="12" fill="#475569">
                {t.split(".")[0]}
              </text>
            </g>
          );
        })}

        <rect x={8} y={H - 60} width={W - 16} height={50} rx={10} fill="#fff7ed" stroke="#fdba74" strokeWidth="1.5" />
        <text x={28} y={H - 36} fontSize="13" fontWeight="700" fill="#9a3412">
          The one people are most often wrong about: divorce.
        </text>
        <text x={28} y={H - 18} fontSize="12" fill="#7c2d12">
          The affidavit is a contract with the US government, not a term of the marriage.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong> the
        obligation begins when the immigrant becomes a permanent resident and
        ends on one of exactly four events —{" "}
        {I864_OBLIGATION_END.map((e) => `${e.event.toLowerCase()} (${e.detail})`).join("; ")}.
        It does not end on any of the following:{" "}
        {I864_OBLIGATION_NOT_END.join(" ")} Source: 8 CFR 213a.2 and USCIS
        Policy Manual Vol. 8, Pt. G.
      </figcaption>
    </figure>
  );
}
