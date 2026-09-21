/**
 * Chart and diagram for the H-1B wage-weighted selection process.
 * Inline SVG, no library (the production CSP allows scripts from self plus
 * analytics only).
 */

import {
  compareSelectionRegimes,
  ODDS_CONFIG,
  VOLUME_SCENARIOS,
} from "@/lib/h1b/lotteryOdds";

const pct = (p: number) => `${Math.round(p * 100)}%`;

/**
 * Odds by wage level, old random draw vs the FY 2027 weighted draw.
 *
 * A MODEL, not a USCIS projection — USCIS has never published a wage-level
 * breakdown of registrations, so the assumptions are listed under the chart
 * rather than hidden inside it.
 */
export function RegimeComparisonChart({
  totalBeneficiaries = VOLUME_SCENARIOS.baseline.totalBeneficiaries,
  degreeCategory = "regular" as const,
}: {
  totalBeneficiaries?: number;
  degreeCategory?: "regular" | "masters";
}) {
  const rows = compareSelectionRegimes(totalBeneficiaries, degreeCategory);
  const W = 720;
  const H = 320;
  const m = { top: 24, right: 20, bottom: 66, left: 54 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const max = Math.max(
    0.1,
    ...rows.map((r) => Math.max(r.random, r.weighted))
  ) * 1.25;

  const group = plotW / rows.length;
  const barW = group * 0.28;
  const y = (p: number) => m.top + plotH - (p / max) * plotH;

  const ticks = [0, 0.1, 0.2, 0.3, 0.4, 0.5].filter((t) => t <= max);

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Grouped bar chart comparing modelled selection odds by wage level. Under the old random draw every level had the same ${pct(
          rows[0].random
        )} chance. Under weighted selection: ${rows
          .map((r) => `Level ${r.level} ${pct(r.weighted)}`)
          .join(", ")}.`}
        className="h-auto w-full"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.left} y1={y(t)} x2={W - m.right} y2={y(t)} stroke="#e2e8f0" />
            <text x={m.left - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#64748b">
              {pct(t)}
            </text>
          </g>
        ))}

        {rows.map((r, i) => {
          const gx = m.left + i * group;
          const cx = gx + group / 2;
          return (
            <g key={r.level}>
              <rect
                x={cx - barW - 4}
                y={y(r.random)}
                width={barW}
                height={m.top + plotH - y(r.random)}
                rx="4"
                fill="#94a3b8"
              />
              <text
                x={cx - barW / 2 - 4}
                y={y(r.random) - 7}
                textAnchor="middle"
                fontSize="12"
                fill="#475569"
              >
                {pct(r.random)}
              </text>

              <rect
                x={cx + 4}
                y={y(r.weighted)}
                width={barW}
                height={m.top + plotH - y(r.weighted)}
                rx="4"
                fill={r.weighted >= r.random ? "#059669" : "#e11d48"}
              />
              <text
                x={cx + barW / 2 + 4}
                y={y(r.weighted) - 7}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#0f172a"
              >
                {pct(r.weighted)}
              </text>

              <text x={cx} y={H - m.bottom + 22} textAnchor="middle" fontSize="13" fontWeight="600" fill="#334155">
                Level {r.level}
              </text>
              <text x={cx} y={H - m.bottom + 39} textAnchor="middle" fontSize="12" fill="#64748b">
                {r.weight} {r.weight === 1 ? "entry" : "entries"}
              </text>
            </g>
          );
        })}

        <g>
          <rect x={m.left} y={H - 20} width="14" height="12" rx="3" fill="#94a3b8" />
          <text x={m.left + 20} y={H - 10} fontSize="12" fill="#475569">
            Old random draw
          </text>
          <rect x={m.left + 150} y={H - 20} width="14" height="12" rx="3" fill="#059669" />
          <text x={m.left + 170} y={H - 10} fontSize="12" fill="#475569">
            Weighted draw (FY 2027+)
          </text>
        </g>
      </svg>

      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        <strong className="text-ink-600">A model, not a USCIS projection.</strong>{" "}
        USCIS has not published a wage-level breakdown of registrations, so this
        assumes {(totalBeneficiaries / 1000).toFixed(0)},000 unique beneficiaries
        and a wage mix of Level I {pct(ODDS_CONFIG.wageDistribution.I)}, II{" "}
        {pct(ODDS_CONFIG.wageDistribution.II)}, III{" "}
        {pct(ODDS_CONFIG.wageDistribution.III)}, IV{" "}
        {pct(ODDS_CONFIG.wageDistribution.IV)}, against the statutory{" "}
        {ODDS_CONFIG.regularCap.toLocaleString()} regular cap. Change the mix and
        every bar moves. What does not move is the shape: more entries beats
        fewer, and the same selections spread over a bigger weighted pool leave
        Level I worse off than random ever did.
      </figcaption>
    </figure>
  );
}

/* ══════════════ Registration → selection diagram ══════════════ */

export function WeightedSelectionDiagram() {
  const W = 720;
  const H = 400;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="How one H-1B registration becomes weighted entries and passes through the regular cap and then the master's cap. Written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="h1bw-arrow"
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

        <rect x="8" y="8" width={W - 16} height="56" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="28" y="34" fontSize="16" fontWeight="700" fill="#0f172a">
          1. One registration per unique beneficiary
        </text>
        <text x="28" y="54" fontSize="13" fill="#475569">
          Multiple employers registering the same person still counts once. That has not changed.
        </text>

        <path d={`M ${W / 2} 64 L ${W / 2} 86`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#h1bw-arrow)" />

        <rect x="8" y="90" width={W - 16} height="104" rx="10" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="2" />
        <text x="28" y="116" fontSize="16" fontWeight="700" fill="#0f172a">
          2. The OEWS wage level buys entries in the pool
        </text>
        {[
          { l: "Level I", n: 1 },
          { l: "Level II", n: 2 },
          { l: "Level III", n: 3 },
          { l: "Level IV", n: 4 },
        ].map((lv, i) => {
          const x = 28 + i * 168;
          return (
            <g key={lv.l}>
              <text x={x} y={144} fontSize="13.5" fontWeight="600" fill="#334155">
                {lv.l}
              </text>
              {Array.from({ length: lv.n }, (_, k) => (
                <rect
                  key={k}
                  x={x + k * 16}
                  y={154}
                  width="12"
                  height="22"
                  rx="2.5"
                  fill="#4338ca"
                />
              ))}
              <text x={x + lv.n * 16 + 6} y={171} fontSize="12.5" fill="#475569">
                {lv.n}×
              </text>
            </g>
          );
        })}

        <path d={`M ${W / 2} 194 L ${W / 2} 216`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#h1bw-arrow)" />

        <rect x="8" y="220" width={W - 16} height="62" rx="10" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
        <text x="28" y="246" fontSize="16" fontWeight="700" fill="#0f172a">
          3. The 65,000 regular cap is drawn from everyone
        </text>
        <text x="28" y="268" fontSize="13" fill="#475569">
          Master&apos;s-degree holders are in this draw too — it is not a separate queue.
        </text>

        <path d={`M ${W / 2} 282 L ${W / 2} 304`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#h1bw-arrow)" />

        <rect x="8" y="308" width={W - 16} height="62" rx="10" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
        <text x="28" y="334" fontSize="16" fontWeight="700" fill="#0f172a">
          4. Then 20,000 more, from US master&apos;s holders not yet picked
        </text>
        <text x="28" y="356" fontSize="13" fill="#475569">
          Same weighting applies. This second draw is why a US master&apos;s still helps.
        </text>

        <text x="8" y={H - 6} fontSize="12" fill="#64748b">
          Each unique beneficiary is counted once against the cap however many entries they hold.
        </text>
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            One registration per unique beneficiary. Several employers
            registering the same person still counts once — that rule predates
            the weighting and survives it.
          </li>
          <li>
            The OEWS wage level for the job determines how many entries that
            registration gets in the pool: Level I once, Level II twice, Level
            III three times, Level IV four times.
          </li>
          <li>
            The 65,000 regular cap is drawn first, from everybody — including
            people with a US master&apos;s degree.
          </li>
          <li>
            Then the 20,000 advanced-degree cap is drawn from the US
            master&apos;s holders who were not selected in the first round, with
            the same weighting applied again.
          </li>
          <li>
            Each unique beneficiary is counted once against the cap however many
            entries they held.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
