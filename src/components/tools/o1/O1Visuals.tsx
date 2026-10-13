/**
 * Charts and diagrams for /o1-visa.
 *
 * Inline SVG, no charting library — the production CSP in next.config.mjs
 * allows scripts from self plus analytics only, so a CDN chart build would be
 * blocked silently in production and work fine in dev. Same constraint, and the
 * same approach, as src/components/tools/i864/charts.tsx and
 * src/components/visa-bulletin/MonthCharts.tsx.
 *
 * Every figure is a viewBox plus `h-auto w-full`, which gives the browser an
 * intrinsic aspect ratio and therefore no layout shift, carries a `role="img"`
 * with a text equivalent for screen readers and answer engines, and carries a
 * visible figcaption with its source and an "as of" date.
 *
 * Charts live inside an `overflow-x-auto` wrapper with a `min-w` on the inner
 * element at the call site, so a dense axis scrolls sideways on a phone rather
 * than squashing.
 */

import {
  O1_ADMISSIONS_BY_YEAR,
  O1_ADMISSIONS_BY_COUNTRY_FY2024,
  O1_VS_H1B_INDIA_FY2024,
  O1_STATS_NOTE,
  O1A_CRITERIA,
  O1_VERIFIED,
} from "@/data/o1VisaData";

const SOURCE_LINE =
  "Source: DHS Office of Homeland Security Statistics, Yearbook of Immigration Statistics FY2024 — Table 26 and Nonimmigrant Supplemental Table 1. Counts are rounded to the nearest 10 by OHSS.";

const num = (n: number) => n.toLocaleString("en-US");
const k = (n: number) => `${Math.round(n / 1000)}k`;

/* ═══════════════ 1. O-1 admissions by fiscal year ═══════════════════════ */

export function O1AdmissionsChart() {
  const data = O1_ADMISSIONS_BY_YEAR;
  const W = 760;
  const H = 300;
  const m = { top: 20, right: 18, bottom: 46, left: 58 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const max = Math.max.apply(
    null,
    data.map((d) => d.o1),
  );
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
        aria-label={`Bar chart of O-1 admissions to the United States by fiscal year. ${data
          .map((d) => `FY${d.fy}: ${num(d.o1)}`)
          .join("; ")}. The collapse in FY2020 and FY2021 is the pandemic, not a policy change.`}
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
                y={y(d.o1)}
                width={barW * 0.68}
                height={Math.max(1, m.top + plotH - y(d.o1))}
                rx="3"
                fill={pandemic ? "#cbd5e1" : "#4338ca"}
              />
              <text
                x={x(i) + barW / 2}
                y={y(d.o1) - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#0f172a"
              >
                {k(d.o1)}
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
        <text
          x={m.left}
          y={H - 8}
          fontSize="11"
          fill="#94a3b8"
        >
          Fiscal year · grey bars are the pandemic years
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        O-1 admissions recovered past their pre-pandemic peak by FY2024.{" "}
        {SOURCE_LINE} As of {O1_VERIFIED}. {O1_STATS_NOTE}
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 2. O-1 by country of citizenship ══════════════════════ */

export function O1ByCountryChart() {
  const data = O1_ADMISSIONS_BY_COUNTRY_FY2024;
  const W = 720;
  const rowH = 30;
  const m = { top: 16, right: 70, bottom: 34, left: 128 };
  const H = m.top + data.length * rowH + m.bottom;
  const plotW = W - m.left - m.right;

  const max = Math.max.apply(
    null,
    data.map((d) => d.o1),
  );

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Horizontal bar chart of O-1 admissions by country of citizenship in fiscal year 2024. ${data
          .map((d) => `${d.country}: ${num(d.o1)}`)
          .join("; ")}. India is fourth, well behind Canada.`}
        className="h-auto w-full"
      >
        {data.map((d, i) => {
          const isIndia = d.country === "India";
          const w = Math.max(2, (d.o1 / max) * plotW);
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
              <text
                x={m.left + w + 8}
                y={yTop + rowH / 2 + 4}
                fontSize="12"
                fontWeight={isIndia ? 700 : 500}
                fill="#0f172a"
              >
                {num(d.o1)}
              </text>
            </g>
          );
        })}
        <text x={m.left} y={H - 12} fontSize="11" fill="#94a3b8">
          O-1 admissions, FY2024 · India highlighted
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        {SOURCE_LINE} As of {O1_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 3. The share comparison — the page's thesis ═══════════ */

export function O1VsH1bShareChart() {
  const d = O1_VS_H1B_INDIA_FY2024;
  const o1Share = (d.o1India / d.o1Total) * 100;
  const h1bShare = (d.h1bIndia / d.h1bTotal) * 100;

  const W = 640;
  const H = 230;
  const m = { top: 30, right: 20, bottom: 56, left: 20 };
  const plotH = H - m.top - m.bottom;
  const barW = 150;
  const gap = 120;
  const startX = (W - (barW * 2 + gap)) / 2;

  const h = (pct: number) => Math.max(3, (pct / 100) * plotH);
  const yOf = (pct: number) => H - m.bottom - h(pct);

  const bars = [
    { label: "O-1", share: o1Share, fill: "#b45309", count: d.o1India, total: d.o1Total },
    { label: "H-1B", share: h1bShare, fill: "#4338ca", count: d.h1bIndia, total: d.h1bTotal },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart comparing India's share of admissions in two classifications in fiscal year 2024. India is ${o1Share.toFixed(
          1,
        )} percent of O-1 admissions (${num(d.o1India)} of ${num(
          d.o1Total,
        )}) and ${h1bShare.toFixed(1)} percent of H-1B admissions (${num(
          d.h1bIndia,
        )} of ${num(d.h1bTotal)}).`}
        className="h-auto w-full"
      >
        <line
          x1={m.left}
          y1={H - m.bottom}
          x2={W - m.right}
          y2={H - m.bottom}
          stroke="#cbd5e1"
        />
        {bars.map((b) => (
          <g key={b.label}>
            <rect
              x={b.label === "O-1" ? startX : startX + barW + gap}
              y={yOf(b.share)}
              width={barW}
              height={h(b.share)}
              rx="5"
              fill={b.fill}
            />
            <text
              x={(b.label === "O-1" ? startX : startX + barW + gap) + barW / 2}
              y={yOf(b.share) - 10}
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fill="#0f172a"
            >
              {b.share.toFixed(1)}%
            </text>
            <text
              x={(b.label === "O-1" ? startX : startX + barW + gap) + barW / 2}
              y={H - m.bottom + 20}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="#334155"
            >
              {b.label}
            </text>
            <text
              x={(b.label === "O-1" ? startX : startX + barW + gap) + barW / 2}
              y={H - m.bottom + 38}
              textAnchor="middle"
              fontSize="11.5"
              fill="#64748b"
            >
              {num(b.count)} of {num(b.total)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        India&rsquo;s share of admissions in each classification, FY2024. The same
        population that fills more than half of all H-1B admissions takes about
        one twenty-fifth of O-1 admissions. {SOURCE_LINE} As of {O1_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 4. The decision flow ══════════════════════════════════ */

/**
 * The O-1 route, as a step diagram. Deliberately drawn rather than written:
 * the mandatory advisory opinion sits outside the applicant's control and is
 * the commonest source of a surprise delay, and a diagram puts it in the path
 * where a bulleted list buries it.
 */
export function O1RouteDiagram() {
  const W = 780;
  const H = 320;

  const boxes = [
    { x: 20, y: 18, w: 200, h: 62, t: "Which classification?", s: "O-1A, O-1B arts, or O-1B motion picture/TV — three different standards" },
    { x: 20, y: 110, w: 200, h: 62, t: "Define the event", s: "A business project or an academic year counts — 8 CFR 214.2(o)(3)(ii)" },
    { x: 20, y: 202, w: 200, h: 62, t: "Evidence, per criterion", s: "3 of 8, or comparable evidence under (o)(3)(iii)(C)" },
    { x: 290, y: 110, w: 200, h: 62, t: "Advisory opinion", s: "Mandatory. A peer group, labor and/or management organisation", accent: true },
    { x: 560, y: 56, w: 200, h: 62, t: "Form I-129 + fees", s: "One beneficiary per O-1 petition" },
    { x: 560, y: 164, w: 200, h: 62, t: "Approval on I-797", s: "Validity up to 3 years" },
    { x: 560, y: 252, w: 200, h: 54, t: "Visa, or change of status", s: "No interview waiver for O-1" },
  ];

  const arrows = [
    { from: [120, 80], to: [120, 110] },
    { from: [120, 172], to: [120, 202] },
    { from: [220, 141], to: [290, 141] },
    { from: [490, 130], to: [560, 95] },
    { from: [660, 118], to: [660, 164] },
    { from: [660, 226], to: [660, 252] },
  ];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Step diagram of the O-1 route: choose the classification, define the event, assemble evidence against named criteria, obtain the mandatory advisory opinion, file Form I-129 with the fees, receive the I-797 approval valid up to three years, then apply for the visa or request a change of status."
        className="h-auto w-full"
      >
        <defs>
          <marker id="o1arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
        {arrows.map((a, i) => (
          <line
            key={i}
            x1={a.from[0]}
            y1={a.from[1]}
            x2={a.to[0]}
            y2={a.to[1]}
            stroke="#94a3b8"
            strokeWidth="1.6"
            markerEnd="url(#o1arrow)"
          />
        ))}
        {boxes.map((b) => (
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
            <text x={b.x + 14} y={b.y + 23} fontSize="13.5" fontWeight="700" fill="#0f172a">
              {b.t}
            </text>
            <foreignObject x={b.x + 12} y={b.y + 29} width={b.w - 24} height={b.h - 32}>
              <div
                // @ts-expect-error — xmlns is valid inside foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontSize: "10.5px",
                  lineHeight: 1.35,
                  color: "#64748b",
                  fontFamily: "inherit",
                }}
              >
                {b.s}
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The advisory opinion is highlighted because it is the one step outside
        your control and your employer&rsquo;s: it has to come from a peer group,
        labor or management organisation, and it is mandatory before approval
        under 8 CFR 214.2(o)(5)(i)(A). Build the lead time in.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 5. Criteria reachability visual ═══════════════════════ */

/**
 * The eight criteria, split by whether an ordinary industry career tends to
 * produce them or whether they have to be built deliberately. A planning aid,
 * not a legal weighting — USCIS weighs the record as a whole and the caption
 * says so.
 */
export function CriteriaReachChart() {
  const buildable = O1A_CRITERIA.filter((c) => c.reach === "buildable");
  const structural = O1A_CRITERIA.filter((c) => c.reach === "structural");

  const columns = [
    {
      title: "Built deliberately",
      sub: "Commonly within reach inside 12–24 months",
      items: buildable,
      fill: "#059669",
      bg: "#ecfdf5",
    },
    {
      title: "In your record, or not",
      sub: "Either the history exists or it does not",
      items: structural,
      fill: "#4338ca",
      bg: "#eef2ff",
    },
  ];

  const W = 740;
  const rowH = 44;
  const maxRows = Math.max(buildable.length, structural.length);
  const H = 92 + maxRows * rowH;
  const colW = 340;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`The eight O-1A criteria split into two groups. Commonly built deliberately: ${buildable
          .map((c) => c.plain.split(".")[0])
          .join("; ")}. Either in your record or not: ${structural
          .map((c) => c.plain.split(".")[0])
          .join("; ")}.`}
        className="h-auto w-full"
      >
        {columns.map((col, ci) => {
          const x = 16 + ci * (colW + 28);
          return (
            <g key={col.title}>
              <rect x={x} y={14} width={colW} height={H - 44} rx="12" fill={col.bg} />
              <text x={x + 16} y={40} fontSize="13.5" fontWeight="800" fill="#0f172a">
                {col.title}
              </text>
              <text x={x + 16} y={57} fontSize="11" fill="#64748b">
                {col.sub}
              </text>
              {col.items.map((c, i) => (
                <g key={c.id}>
                  <circle cx={x + 24} cy={80 + i * rowH + 8} r="11" fill={col.fill} />
                  <text
                    x={x + 24}
                    y={80 + i * rowH + 12}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {c.ref.replace(/[()]/g, "")}
                  </text>
                  <foreignObject x={x + 44} y={80 + i * rowH - 6} width={colW - 60} height={rowH}>
                    <div
                      // @ts-expect-error — xmlns is valid inside foreignObject
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        fontSize: "11px",
                        lineHeight: 1.3,
                        color: "#334155",
                        fontFamily: "inherit",
                      }}
                    >
                      {c.plain.split(".")[0]}
                    </div>
                  </foreignObject>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        A planning split, not a legal one. The regulation does not rank the
        eight criteria in 8 CFR 214.2(o)(3)(iii)(B), and USCIS weighs the record
        as a whole rather than counting boxes — but knowing which criteria a
        career produces by itself, and which have to be built, is where the next
        twelve months of effort go. Numbers are the regulation&rsquo;s own.
      </figcaption>
    </figure>
  );
}
