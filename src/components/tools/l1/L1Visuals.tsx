/**
 * Charts and diagrams for /l1-visa. Inline SVG, no library — see the note at
 * the top of src/components/tools/o1/O1Visuals.tsx for why.
 */

import {
  L1_ADMISSIONS_BY_YEAR,
  L1_ADMISSIONS_BY_COUNTRY_FY2024,
  L1_INDIA_FY2024,
  L1_STATS_NOTE,
  L2S_SPLIT_NOTE,
  L1_VERIFIED,
  L1_CAP_MONTHS_NOTE,
} from "@/data/l1VisaData";

const SOURCE_LINE =
  "Source: DHS Office of Homeland Security Statistics, Yearbook of Immigration Statistics FY2024 — Table 26 and Nonimmigrant Supplemental Table 1. Counts are rounded to the nearest 10 by OHSS.";

const num = (n: number) => n.toLocaleString("en-US");
const k = (n: number) => `${Math.round(n / 1000)}k`;

/* ═══════════════ 1. L-1 admissions by fiscal year ══════════════════════ */

export function L1AdmissionsChart() {
  const data = L1_ADMISSIONS_BY_YEAR;
  const W = 760;
  const H = 300;
  const m = { top: 20, right: 18, bottom: 46, left: 58 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const max = Math.max.apply(null, data.map((d) => d.l1));
  const top = Math.ceil(max / 100000) * 100000;
  const barW = plotW / data.length;

  const y = (v: number) => m.top + plotH - (v / top) * plotH;
  const x = (i: number) => m.left + i * barW;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * top);

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart of L-1 admissions by fiscal year. ${data
          .map((d) => `FY${d.fy}: ${num(d.l1)}`)
          .join("; ")}. FY2024 is still below the FY2018 peak.`}
        className="h-auto w-full"
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={m.left} y1={y(v)} x2={W - m.right} y2={y(v)} stroke="#e2e8f0" />
            <text x={m.left - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#64748b">
              {v === 0 ? "0" : k(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const pandemic = d.fy === 2020 || d.fy === 2021;
          return (
            <g key={d.fy}>
              <rect
                x={x(i) + barW * 0.16}
                y={y(d.l1)}
                width={barW * 0.68}
                height={Math.max(1, m.top + plotH - y(d.l1))}
                rx="3"
                fill={pandemic ? "#cbd5e1" : "#0891b2"}
              />
              <text
                x={x(i) + barW / 2}
                y={y(d.l1) - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#0f172a"
              >
                {k(d.l1)}
              </text>
              <text
                x={x(i) + barW / 2}
                y={H - m.bottom + 18}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {`'${String(d.fy).slice(2)}`}
              </text>
            </g>
          );
        })}
        <text x={m.left} y={H - 8} fontSize="11" fill="#94a3b8">
          Fiscal year · grey bars are the pandemic years
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        Unlike O-1, L-1 admissions in FY2024 had still not returned to the
        FY2018 peak of {num(703_100)}. {SOURCE_LINE} As of {L1_VERIFIED}.{" "}
        {L1_STATS_NOTE}
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 2. The L-2 → L-2S transition in the data ══════════════ */

/**
 * The policy change made visible. L-2 collapses to almost nothing from FY2022
 * as spouses move to the L-2S code and children to L-2Y. This is the cleanest
 * official evidence that spouses are now employment-authorised incident to
 * status, and no competitor page has it.
 */
export function L2sTransitionChart() {
  const data = L1_ADMISSIONS_BY_YEAR.filter((d) => d.fy >= 2019);
  const W = 760;
  const H = 290;
  const m = { top: 24, right: 18, bottom: 64, left: 58 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const totals = data.map((d) => d.l2 + (d.l2s ?? 0) + (d.l2y ?? 0));
  const top = Math.ceil(Math.max.apply(null, totals) / 100000) * 100000;
  const barW = plotW / data.length;

  const scale = (v: number) => (v / top) * plotH;
  const x = (i: number) => m.left + i * barW;
  const ticks = [0, 0.5, 1].map((f) => f * top);

  const segments = [
    { key: "l2" as const, label: "L-2 (old code)", fill: "#94a3b8" },
    { key: "l2s" as const, label: "L-2S — spouse, work-authorised", fill: "#059669" },
    { key: "l2y" as const, label: "L-2Y — child", fill: "#4338ca" },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Stacked bar chart of L-2 dependent admissions by fiscal year and class of admission. The plain L-2 code falls from ${num(
          289_040,
        )} in FY2019 to ${num(
          70,
        )} in FY2024 while L-2S and L-2Y appear from FY2022, reflecting the change that made L-2 spouses employment-authorised incident to status.`}
        className="h-auto w-full"
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={m.left} y1={m.top + plotH - scale(v)} x2={W - m.right} y2={m.top + plotH - scale(v)} stroke="#e2e8f0" />
            <text x={m.left - 8} y={m.top + plotH - scale(v) + 4} textAnchor="end" fontSize="12" fill="#64748b">
              {v === 0 ? "0" : k(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          let cursor = m.top + plotH;
          return (
            <g key={d.fy}>
              {segments.map((s) => {
                const v = s.key === "l2" ? d.l2 : (d[s.key] ?? 0);
                if (!v) return null;
                const h = Math.max(1, scale(v));
                cursor -= h;
                return (
                  <rect
                    key={s.key}
                    x={x(i) + barW * 0.18}
                    y={cursor}
                    width={barW * 0.64}
                    height={h}
                    fill={s.fill}
                  />
                );
              })}
              <text
                x={x(i) + barW / 2}
                y={H - m.bottom + 18}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
              >
                {`FY${String(d.fy).slice(2)}`}
              </text>
            </g>
          );
        })}
        {segments.map((s, i) => (
          <g key={s.label}>
            <rect x={m.left + i * 230} y={H - 28} width={11} height={11} rx="2" fill={s.fill} />
            <text x={m.left + i * 230 + 17} y={H - 19} fontSize="11" fill="#475569">
              {s.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        {L2S_SPLIT_NOTE} {SOURCE_LINE} As of {L1_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 3. L-1 by country ════════════════════════════════════ */

export function L1ByCountryChart() {
  const data = L1_ADMISSIONS_BY_COUNTRY_FY2024;
  const W = 720;
  const rowH = 30;
  const m = { top: 16, right: 76, bottom: 34, left: 128 };
  const H = m.top + data.length * rowH + m.bottom;
  const plotW = W - m.left - m.right;
  const max = Math.max.apply(null, data.map((d) => d.l1));

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Horizontal bar chart of L-1 admissions by country of citizenship in fiscal year 2024. ${data
          .map((d) => `${d.country}: ${num(d.l1)}`)
          .join("; ")}. India is second behind Canada.`}
        className="h-auto w-full"
      >
        {data.map((d, i) => {
          const isIndia = d.country === "India";
          const w = Math.max(2, (d.l1 / max) * plotW);
          const yTop = m.top + i * rowH;
          return (
            <g key={d.country}>
              <text
                x={m.left - 10}
                y={yTop + rowH / 2 + 4}
                textAnchor="end"
                fontSize="12.5"
                fontWeight={isIndia ? 700 : 400}
                fill={isIndia ? "#0f172a" : "#475569"}
              >
                {d.country}
              </text>
              <rect
                x={m.left}
                y={yTop + 5}
                width={w}
                height={rowH - 12}
                rx="3"
                fill={isIndia ? "#b45309" : "#94a3b8"}
              />
              <text x={m.left + w + 8} y={yTop + rowH / 2 + 4} fontSize="12" fontWeight={isIndia ? 700 : 500} fill="#0f172a">
                {num(d.l1)}
              </text>
            </g>
          );
        })}
        <text x={m.left} y={H - 12} fontSize="11" fill="#94a3b8">
          L-1 admissions, FY2024 · India highlighted
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        India is {((L1_INDIA_FY2024.l1India / L1_INDIA_FY2024.l1Total) * 100).toFixed(1)}%
        of L-1 admissions against{" "}
        {((L1_INDIA_FY2024.h1bIndia / L1_INDIA_FY2024.h1bTotal) * 100).toFixed(1)}% of
        H-1B admissions — the second-largest Indian work route, and an order of
        magnitude smaller than the first. {SOURCE_LINE} As of {L1_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 4. The combined L and H clock ════════════════════════ */

/**
 * The single most consequential rule on the page, drawn. 8 CFR 214.2(l)(12)(i)
 * caps time in the United States "under section 101(a)(15)(L) and/or (H)" —
 * one clock, two statuses. Three worked scenarios against the same caps.
 */
export function CombinedClockDiagram() {
  const W = 780;
  const rowH = 76;
  const scenarios = [
    { label: "No prior US time", h: 0, l: 0 },
    { label: "4 years on H-1B first", h: 48, l: 0 },
    { label: "6 years H-1B, then L-1A", h: 72, l: 0 },
  ];
  const H = 108 + scenarios.length * rowH;

  const m = { left: 180, right: 30 };
  const plotW = W - m.left - m.right;
  const CAP = 84; // L-1A months, the longer of the two caps
  const px = (months: number) => (months / CAP) * plotW;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Diagram of the combined L and H stay clock. With no prior US time an L-1A holder has the full seven years. After four years on an H-1B, three years of L-1A remain and one year of L-1B. After six years on an H-1B, one year of L-1A remains and no L-1B time at all."
        className="h-auto w-full"
      >
        {/* Cap markers */}
        <line x1={m.left + px(60)} y1={46} x2={m.left + px(60)} y2={H - 44} stroke="#b45309" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={m.left + px(60)} y={38} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#b45309">
          L-1B cap · 5 yrs
        </text>
        <line x1={m.left + px(84)} y1={46} x2={m.left + px(84)} y2={H - 44} stroke="#4338ca" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={m.left + px(84)} y={38} textAnchor="end" fontSize="11.5" fontWeight="700" fill="#4338ca">
          L-1A cap · 7 yrs
        </text>

        {scenarios.map((s, i) => {
          const yTop = 58 + i * rowH;
          const used = s.h + s.l;
          const l1aLeft = Math.max(0, 84 - used);
          const l1bLeft = Math.max(0, 60 - used);
          return (
            <g key={s.label}>
              <text x={16} y={yTop + 20} fontSize="12.5" fontWeight="700" fill="#0f172a">
                {s.label}
              </text>
              <text x={16} y={yTop + 38} fontSize="11" fill="#64748b">
                {l1aLeft} mo L-1A left
              </text>
              <text x={16} y={yTop + 53} fontSize="11" fill="#64748b">
                {l1bLeft} mo L-1B left
              </text>

              {/* Used (H) */}
              {s.h > 0 && (
                <>
                  <rect x={m.left} y={yTop + 8} width={px(s.h)} height={26} rx="4" fill="#64748b" />
                  <text x={m.left + px(s.h) / 2} y={yTop + 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">
                    H-1B {s.h / 12} yr{s.h / 12 === 1 ? "" : "s"}
                  </text>
                </>
              )}
              {/* Remaining */}
              <rect
                x={m.left + px(used)}
                y={yTop + 8}
                width={Math.max(2, px(l1aLeft))}
                height={26}
                rx="4"
                fill="#c7d2fe"
              />
              {l1aLeft > 0 && (
                <text
                  x={m.left + px(used) + px(l1aLeft) / 2}
                  y={yTop + 26}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#312e81"
                >
                  L-1A available
                </text>
              )}
            </g>
          );
        })}
        <text x={16} y={H - 14} fontSize="11" fill="#94a3b8">
          Grey is time already used in the United States. 8 CFR 214.2(l)(12)(i).
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        {L1_CAP_MONTHS_NOTE}
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 5. Blanket L vs individual petition ══════════════════ */

export function BlanketVsIndividualDiagram() {
  const W = 780;
  const H = 300;

  const boxes = [
    { x: 290, y: 14, w: 200, h: 50, t: "Which route?", s: "Your employer usually decides, but the risk is yours", accent: true },
    { x: 20, y: 102, w: 230, h: 70, t: "Blanket L (Form I-129S)", s: "No USCIS filing. Adjudicated at the consulate. Managers, executives and specialized-knowledge PROFESSIONALS only" },
    { x: 530, y: 102, w: 230, h: 70, t: "Individual petition (I-129)", s: "USCIS adjudicates first. Available to any qualifying L-1A or L-1B" },
    { x: 20, y: 208, w: 230, h: 70, t: "Consular denial is FINAL", s: "No appeal. 8 CFR 214.2(l)(5)(ii)(F). Employer must then file an individual petition from scratch", warn: true },
    { x: 530, y: 208, w: 230, h: 70, t: "RFE and appeal available", s: "A denial can be responded to and appealed under 8 CFR part 103" },
  ];

  const arrows = [
    { from: [330, 64], to: [160, 102] },
    { from: [450, 64], to: [630, 102] },
    { from: [135, 172], to: [135, 208] },
    { from: [645, 172], to: [645, 208] },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Decision diagram comparing the blanket L route and an individual L-1 petition. The blanket route skips a USCIS filing but is adjudicated at the consulate, covers only managers, executives and specialized-knowledge professionals, and a consular denial under a blanket is final with no appeal. An individual petition is adjudicated by USCIS first, is open to any qualifying L-1A or L-1B, and a denial can be answered and appealed."
        className="h-auto w-full"
      >
        <defs>
          <marker id="l1arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
        {arrows.map((a, i) => (
          <line key={i} x1={a.from[0]} y1={a.from[1]} x2={a.to[0]} y2={a.to[1]} stroke="#94a3b8" strokeWidth="1.6" markerEnd="url(#l1arrow)" />
        ))}
        {boxes.map((b) => (
          <g key={b.t}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="10"
              fill={b.warn ? "#fff1f2" : b.accent ? "#eef2ff" : "#ffffff"}
              stroke={b.warn ? "#fda4af" : b.accent ? "#a5b4fc" : "#e2e8f0"}
              strokeWidth="1.5"
            />
            <text x={b.x + 14} y={b.y + 22} fontSize="13" fontWeight="700" fill="#0f172a">
              {b.t}
            </text>
            <foreignObject x={b.x + 12} y={b.y + 28} width={b.w - 24} height={b.h - 30}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: "10.5px", lineHeight: 1.35, color: "#64748b", fontFamily: "inherit" }}
              >
                {b.s}
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The asymmetry in the bottom row is the point, and it is absent from every
        L-1 guide we checked. A blanket is faster because the consulate decides
        instead of USCIS — which also means a borderline specialized-knowledge
        case gets one decision, from an officer who may only grant L
        classification in clearly approvable applications, with no appeal.
      </figcaption>
    </figure>
  );
}
