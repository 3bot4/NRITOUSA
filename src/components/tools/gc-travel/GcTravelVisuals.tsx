/**
 * Charts and diagrams for /green-card/travel-rules. Inline SVG, no library.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE DETENTION CHART IS THE SENSITIVE ONE.
 *
 * ICE_ADP_BY_FY is ICE's own published average daily population. Three things
 * have to stay true of how it is presented:
 *
 *  1. FY2026 is a TEN-MONTH average, not a year. The bar is drawn differently
 *     and the caption says so. Comparing a partial year to full years without
 *     the note would overstate the change.
 *  2. The figures are everyone in ICE custody. ICE does not publish the
 *     population by immigration status, so the chart cannot be read as a risk
 *     measure for a returning permanent resident, and the caption says that
 *     too — in the chart, not only in the body copy.
 *  3. No projection, no trend line, no editorial adjective. The series is the
 *     claim.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  ABSENCE_TIERS,
  ICE_ADP_BY_FY,
  ICE_ADP_FY2026_MONTHLY,
  ICE_ADP_SOURCE,
  SEEKING_ADMISSION,
  GC_TRAVEL_VERIFIED,
  type RiskTier,
} from "@/data/greenCardTravelData";

const num = (n: number) => n.toLocaleString("en-US");
const k = (n: number) => `${Math.round(n / 1000)}k`;

/* ═══════════════ 1. ICE detention population by fiscal year ═══════════ */

export function IceDetentionChart() {
  const data = ICE_ADP_BY_FY;
  const W = 740;
  const H = 300;
  const m = { top: 24, right: 20, bottom: 58, left: 54 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const max = Math.max.apply(null, data.map((d) => d.adp));
  const top = Math.ceil(max / 20000) * 20000;
  const barW = plotW / data.length;

  const y = (v: number) => m.top + plotH - (v / top) * plotH;
  const x = (i: number) => m.left + i * barW;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * top);

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart of the average daily population in ICE detention by fiscal year, from ICE's own published statistics. ${data
          .map((d) => `FY${d.fy}: ${num(d.adp)}${d.partial ? " (ten months only)" : ""}`)
          .join("; ")}. These are totals for everyone in ICE custody and are not broken down by immigration status.`}
        className="h-auto w-full"
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={m.left} y1={y(v)} x2={W - m.right} y2={y(v)} stroke="#e2e8f0" />
            <text x={m.left - 8} y={y(v) + 4} textAnchor="end" fontSize="11.5" fill="#64748b">
              {v === 0 ? "0" : k(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <g key={d.fy}>
            <rect
              x={x(i) + barW * 0.18}
              y={y(d.adp)}
              width={barW * 0.64}
              height={Math.max(2, m.top + plotH - y(d.adp))}
              rx="4"
              fill={d.partial ? "#ffffff" : "#64748b"}
              stroke={d.partial ? "#64748b" : "none"}
              strokeWidth={d.partial ? 2 : 0}
              strokeDasharray={d.partial ? "5 3" : undefined}
            />
            <text x={x(i) + barW / 2} y={y(d.adp) - 7} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0f172a">
              {k(d.adp)}
            </text>
            <text x={x(i) + barW / 2} y={H - m.bottom + 19} textAnchor="middle" fontSize="11.5" fill="#475569">
              FY{String(d.fy).slice(2)}
            </text>
            {d.partial && (
              <text x={x(i) + barW / 2} y={H - m.bottom + 34} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
                10 months
              </text>
            )}
          </g>
        ))}
        <text x={m.left} y={H - 8} fontSize="10.5" fill="#94a3b8">
          Average daily population, all ICE detention facility types. Dashed bar is a partial year.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        Source: {ICE_ADP_SOURCE.label} ({ICE_ADP_SOURCE.href}). {ICE_ADP_SOURCE.asOf}.
        As of {GC_TRAVEL_VERIFIED}. {ICE_ADP_SOURCE.note}
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 2. The FY2026 month-by-month shape ══════════════════ */

export function IceMonthlyChart() {
  const data = ICE_ADP_FY2026_MONTHLY;
  const W = 740;
  const H = 260;
  const m = { top: 24, right: 24, bottom: 52, left: 54 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const values = data.map((d) => d.adp);
  const lo = Math.floor(Math.min.apply(null, values) / 5000) * 5000;
  const hi = Math.ceil(Math.max.apply(null, values) / 5000) * 5000;
  const span = hi - lo || 1;

  const x = (i: number) => m.left + (i / (data.length - 1)) * plotW;
  const y = (v: number) => m.top + plotH - ((v - lo) / span) * plotH;

  const points = data.map((d, i) => `${x(i)},${y(d.adp)}`).join(" ");
  const ticks = [lo, lo + span / 2, hi];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Line chart of the average daily ICE detention population month by month across fiscal year 2026. ${data
          .map((d) => `${d.month}: ${num(d.adp)}`)
          .join("; ")}. It peaks in January 2026 and falls to a low in May before rising again.`}
        className="h-auto w-full"
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={m.left} y1={y(v)} x2={W - m.right} y2={y(v)} stroke="#e2e8f0" />
            <text x={m.left - 8} y={y(v) + 4} textAnchor="end" fontSize="11.5" fill="#64748b">
              {k(v)}
            </text>
          </g>
        ))}
        <polyline points={points} fill="none" stroke="#64748b" strokeWidth="2.5" />
        {data.map((d, i) => (
          <g key={d.month}>
            <circle cx={x(i)} cy={y(d.adp)} r="4" fill="#64748b" />
            <text
              x={x(i)}
              y={H - m.bottom + 18}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {d.month.split(" ")[0]}
            </text>
          </g>
        ))}
        <text x={x(3)} y={y(data[3].adp) - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
          {num(data[3].adp)}
        </text>
        <text x={x(7)} y={y(data[7].adp) + 20} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
          {num(data[7].adp)}
        </text>
        <text x={m.left} y={H - 8} fontSize="10.5" fill="#94a3b8">
          FY2026, October 2025 to July 2026. Months 11 and 12 had not occurred when the workbook was published.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The same series inside one year, which is worth seeing because an annual
        average hides a swing of about fourteen thousand between the January peak
        and the May low. Source: {ICE_ADP_SOURCE.label}. {ICE_ADP_SOURCE.asOf}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 3. Absence risk tiers ═══════════════════════════════ */

const TIER_COLOUR: Record<RiskTier, { fill: string; stroke: string; text: string }> = {
  routine: { fill: "#f0fdf4", stroke: "#86efac", text: "#166534" },
  attention: { fill: "#fffbeb", stroke: "#fcd34d", text: "#92400e" },
  serious: { fill: "#fff7ed", stroke: "#fdba74", text: "#9a3412" },
  critical: { fill: "#fff1f2", stroke: "#fda4af", text: "#9f1239" },
};

/**
 * The two regimes as two tracks, not one verdict. A six-month trip breaks
 * nothing on the top track and raises a presumption on the bottom one, and
 * drawing them as one bar is exactly the error this figure exists to prevent.
 */
export function AbsenceTierChart() {
  const W = 760;
  const H = 300;
  const m = { left: 20, right: 20, top: 56 };
  const plotW = W - m.left - m.right;

  // 0 to 18 months across the width.
  const MAX_MONTHS = 18;
  const px = (months: number) => m.left + (months / MAX_MONTHS) * plotW;

  const monthTicks = [0, 3, 6, 9, 12, 15, 18];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Diagram of two separate regimes against the length of an absence. Top track: the green card is a valid entry document up to one year, after which a reentry permit is needed. Bottom track: continuous residence for naturalisation is intact up to six months, rebuttable from six months to one year, and broken at one year. The thresholds are different, which is why a seven-month trip keeps the card valid while raising the naturalisation presumption."
        className="h-auto w-full"
      >
        {/* Month axis */}
        {monthTicks.map((t) => (
          <g key={t}>
            <line x1={px(t)} y1={40} x2={px(t)} y2={H - 44} stroke="#f1f5f9" />
            <text x={px(t)} y={32} textAnchor="middle" fontSize="11" fill="#64748b">
              {t} mo
            </text>
          </g>
        ))}

        {/* Track A: entry document */}
        <text x={m.left} y={64} fontSize="12" fontWeight="800" fill="#0f172a">
          Is the card still your entry document? — 8 CFR 211.1(a)(2), 211.3
        </text>
        <rect x={px(0)} y={74} width={px(12) - px(0)} height={38} rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
        <text x={(px(0) + px(12)) / 2} y={98} textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">
          Yes — the card works
        </text>
        <rect x={px(12)} y={74} width={px(MAX_MONTHS) - px(12)} height={38} rx="6" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
        <text x={(px(12) + px(MAX_MONTHS)) / 2} y={92} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">
          No — reentry permit,
        </text>
        <text x={(px(12) + px(MAX_MONTHS)) / 2} y={105} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">
          or SB-1 at a consulate
        </text>

        {/* Track B: continuous residence */}
        <text x={m.left} y={158} fontSize="12" fontWeight="800" fill="#0f172a">
          Is continuous residence for naturalisation intact? — 8 CFR 316.5(c)(1)
        </text>
        <rect x={px(0)} y={168} width={px(6) - px(0)} height={38} rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
        <text x={(px(0) + px(6)) / 2} y={192} textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">
          Intact
        </text>
        <rect x={px(6)} y={168} width={px(12) - px(6)} height={38} rx="6" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
        <text x={(px(6) + px(12)) / 2} y={186} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">
          Disrupted unless
        </text>
        <text x={(px(6) + px(12)) / 2} y={199} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">
          you rebut it
        </text>
        <rect x={px(12)} y={168} width={px(MAX_MONTHS) - px(12)} height={38} rx="6" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
        <text x={(px(12) + px(MAX_MONTHS)) / 2} y={186} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">
          Broken. N-470 only,
        </text>
        <text x={(px(12) + px(MAX_MONTHS)) / 2} y={199} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">
          and only if filed before 12 mo
        </text>

        {/* Track C: the statute */}
        <text x={m.left} y={246} fontSize="12" fontWeight="800" fill="#0f172a">
          Are you treated as seeking admission? — INA 101(a)(13)(C)(ii)
        </text>
        <rect x={px(0)} y={254} width={px(6) - px(0)} height={28} rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x={(px(0) + px(6)) / 2} y={272} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#475569">
          No, on length
        </text>
        <rect x={px(6)} y={254} width={px(MAX_MONTHS) - px(6)} height={28} rx="6" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x={(px(6) + px(MAX_MONTHS)) / 2} y={272} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#312e81">
          Yes — past 180 continuous days
        </text>

        {/* The 6 and 12 month lines, drawn across all three tracks */}
        <line x1={px(6)} y1={40} x2={px(6)} y2={H - 44} stroke="#b45309" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1={px(12)} y1={40} x2={px(12)} y2={H - 44} stroke="#e11d48" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x={px(6)} y={H - 28} textAnchor="middle" fontSize="11" fontWeight="800" fill="#b45309">
          6 months
        </text>
        <text x={px(12)} y={H - 28} textAnchor="middle" fontSize="11" fontWeight="800" fill="#e11d48">
          1 year
        </text>
        <text x={m.left} y={H - 8} fontSize="10.5" fill="#94a3b8">
          Three questions, three different thresholds, one trip. Reading them as one rule is the commonest error in this area.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The one-year line on the top track is measured to the moment you BOARD,
        not the moment you land — 8 CFR 211.3. Sources: 8 CFR 211.1, 211.3,
        316.5(c)(1), and INA 101(a)(13)(C). As of {GC_TRAVEL_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 4. The seeking-admission decision flow ══════════════ */

/**
 * The statute, drawn. Every competitor page starts from "how long can I be
 * away"; INA 101(a)(13)(C) starts from a different question, and the whole page
 * is downstream of which side of this line a trip falls on.
 */
export function SeekingAdmissionFlow() {
  const W = 780;
  const H = 400;

  const conditions = SEEKING_ADMISSION.conditions;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Decision diagram from INA 101(a)(13)(C). A returning lawful permanent resident is not regarded as seeking admission unless one of six conditions applies: ${conditions
          .map((c) => `${c.n} ${c.text}`)
          .join(" ")} If none applies, you are a resident coming home and the grounds of inadmissibility in INA 212(a) are not applied. If one applies, you are treated as seeking admission and the whole of INA 212(a) becomes available to the officer.`}
        className="h-auto w-full"
      >
        <defs>
          <marker id="gcarrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Start */}
        <rect x={270} y={10} width={240} height={46} rx="10" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="2" />
        <text x={390} y={32} textAnchor="middle" fontSize="13" fontWeight="800" fill="#312e81">
          A permanent resident returns
        </text>
        <text x={390} y={47} textAnchor="middle" fontSize="10.5" fill="#64748b">
          INA 101(a)(13)(C)
        </text>
        <line x1={390} y1={56} x2={390} y2={80} stroke="#94a3b8" strokeWidth="1.6" markerEnd="url(#gcarrow)" />

        {/* The six conditions */}
        <rect x={24} y={82} width={732} height={190} rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
        <text x={40} y={104} fontSize="12.5" fontWeight="800" fill="#92400e">
          Does ANY of these six apply?
        </text>
        {conditions.map((c, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 40 + col * 364;
          const y = 118 + row * 50;
          return (
            <g key={c.n}>
              <text x={x} y={y + 12} fontSize="11" fontWeight="800" fill="#b45309">
                {c.n}
              </text>
              <foreignObject x={x + 24} y={y} width={330} height={46}>
                <div
                  // @ts-expect-error — xmlns is valid inside foreignObject
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{ fontSize: "10.5px", lineHeight: 1.3, color: "#475569", fontFamily: "inherit" }}
                >
                  {c.text.replace(/,$/, "")}
                </div>
              </foreignObject>
            </g>
          );
        })}

        <line x1={200} y1={272} x2={200} y2={300} stroke="#94a3b8" strokeWidth="1.6" markerEnd="url(#gcarrow)" />
        <line x1={580} y1={272} x2={580} y2={300} stroke="#94a3b8" strokeWidth="1.6" markerEnd="url(#gcarrow)" />
        <text x={212} y={290} fontSize="12" fontWeight="800" fill="#166534">
          NO
        </text>
        <text x={592} y={290} fontSize="12" fontWeight="800" fill="#9f1239">
          YES
        </text>

        {/* Outcomes */}
        <rect x={40} y={302} width={320} height={82} rx="10" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
        <text x={56} y={326} fontSize="13" fontWeight="800" fill="#166534">
          Not an applicant for admission
        </text>
        <foreignObject x={54} y={332} width={292} height={48}>
          <div
            // @ts-expect-error — xmlns is valid inside foreignObject
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ fontSize: "10.5px", lineHeight: 1.35, color: "#166534", fontFamily: "inherit" }}
          >
            A resident coming home. The grounds of inadmissibility in INA 212(a) are not applied to you.
          </div>
        </foreignObject>

        <rect x={420} y={302} width={320} height={82} rx="10" fill="#fff1f2" stroke="#fda4af" strokeWidth="2" />
        <text x={436} y={326} fontSize="13" fontWeight="800" fill="#9f1239">
          Treated as seeking admission
        </text>
        <foreignObject x={434} y={332} width={292} height={48}>
          <div
            // @ts-expect-error — xmlns is valid inside foreignObject
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ fontSize: "10.5px", lineHeight: 1.35, color: "#9f1239", fontFamily: "inherit" }}
          >
            The whole of INA 212(a) becomes available to the officer. It does not mean refusal — it means the inspection is a real inspection.
          </div>
        </foreignObject>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        INA 101(a)(13)(C) / 8 U.S.C. 1101(a)(13)(C), read on {GC_TRAVEL_VERIFIED}.
        Abandonment under condition (i) is ultimately decided by an immigration
        judge, not conclusively by an officer at the port of entry.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 5. The three instruments, side by side ═════════════ */

export function InstrumentComparisonChart() {
  const W = 760;
  const H = 250;
  const colW = 236;

  const cols = [
    {
      x: 16,
      t: "Reentry permit",
      form: "Form I-131 · $630",
      protects: "Re-entry after a year or more",
      notProtects: "The naturalisation clock",
      deadline: "File while you are still in the US",
      fill: "#eef2ff",
      stroke: "#a5b4fc",
    },
    {
      x: 262,
      t: "N-470",
      form: "Form N-470 · $420",
      protects: "Continuous residence for naturalisation",
      notProtects: "Your entry document",
      deadline: "Before the absence hits 12 months",
      fill: "#f0fdf4",
      stroke: "#86efac",
      lead: true,
    },
    {
      x: 508,
      t: "Returning resident visa",
      form: "Form DS-117 · SB-1",
      protects: "Getting back at all, when nothing else covers you",
      notProtects: "Anything automatically — it is an application you have to win",
      deadline: "Months before travel",
      fill: "#fff1f2",
      stroke: "#fda4af",
    },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Comparison of three instruments. A reentry permit, Form I-131 at 630 dollars, protects re-entry after an absence of a year or more but does not protect the naturalisation clock, and must be filed while you are still in the United States. Form N-470 at 420 dollars protects continuous residence for naturalisation but not your entry document, and must be filed before the absence reaches twelve months. An SB-1 returning resident visa on Form DS-117 is for getting back at all when nothing else covers you, protects nothing automatically, and takes months."
        className="h-auto w-full"
      >
        {cols.map((c) => (
          <g key={c.t}>
            <rect
              x={c.x}
              y={c.lead ? 8 : 18}
              width={colW}
              height={c.lead ? 206 : 190}
              rx="12"
              fill={c.fill}
              stroke={c.stroke}
              strokeWidth={c.lead ? 2.5 : 1.5}
            />
            <text x={c.x + 16} y={c.lead ? 34 : 44} fontSize="13.5" fontWeight="800" fill="#0f172a">
              {c.t}
            </text>
            <text x={c.x + 16} y={c.lead ? 50 : 60} fontSize="10.5" fill="#64748b">
              {c.form}
            </text>
            <text x={c.x + 16} y={c.lead ? 76 : 86} fontSize="9.5" fontWeight="800" fill="#059669">
              PROTECTS
            </text>
            <foreignObject x={c.x + 14} y={c.lead ? 80 : 90} width={colW - 28} height={40}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: "10.5px", lineHeight: 1.3, color: "#334155", fontFamily: "inherit" }}
              >
                {c.protects}
              </div>
            </foreignObject>
            <text x={c.x + 16} y={c.lead ? 130 : 140} fontSize="9.5" fontWeight="800" fill="#e11d48">
              DOES NOT PROTECT
            </text>
            <foreignObject x={c.x + 14} y={c.lead ? 134 : 144} width={colW - 28} height={40}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: "10.5px", lineHeight: 1.3, color: "#334155", fontFamily: "inherit" }}
              >
                {c.notProtects}
              </div>
            </foreignObject>
            <line x1={c.x + 14} y1={c.lead ? 176 : 180} x2={c.x + colW - 14} y2={c.lead ? 176 : 180} stroke={c.stroke} />
            <foreignObject x={c.x + 14} y={c.lead ? 182 : 186} width={colW - 28} height={30}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: "10.5px", lineHeight: 1.3, color: "#64748b", fontWeight: 700, fontFamily: "inherit" }}
              >
                Deadline: {c.deadline}
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        N-470 is highlighted because it is the instrument nobody writes about and
        the only one with a hard cliff: 8 CFR 316.5(d)(1)(i) requires it to be
        filed before the absence reaches one continuous year, after which the
        route has closed. Fees from Form G-1055, edition 10/07/26.
      </figcaption>
    </figure>
  );
}

/** Tier colours, exported so the page's tier table matches the chart. */
export { TIER_COLOUR };
export const TIER_LABELS: Record<RiskTier, string> = {
  routine: "Routine",
  attention: "Prepare",
  serious: "Get advice",
  critical: "Do not travel yet",
};

export const ABSENCE_TIER_IDS = ABSENCE_TIERS.map((t) => t.id);
