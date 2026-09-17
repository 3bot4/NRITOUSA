/**
 * Charts and the "which chart applies to you" diagram for a monthly visa
 * bulletin page. Inline SVG, no library — same constraint as everywhere else
 * on the site (the production CSP allows scripts from self plus analytics).
 *
 * The movement chart reads data/visa-bulletin/history.json through the
 * existing helpers in src/lib/visa-bulletin.ts. There is deliberately no second
 * parser and no second copy of the cutoffs.
 */

import { expandSeries, getSeries, monthIndex } from "@/lib/visa-bulletin";
import { monthLabel } from "@/lib/visaBulletinMonths";

const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Months-since-year-0 back to a readable "Jan 2014". */
function fromMonthIndex(mi: number): string {
  const y = Math.floor(mi / 12);
  const m = Math.min(11, Math.max(0, Math.round(mi % 12)));
  return `${MONTHS_ABBR[m]} ${y}`;
}

const SERIES = [
  { category: "eb1" as const, label: "EB-1 India", colour: "#0891b2" },
  { category: "eb2" as const, label: "EB-2 India", colour: "#4338ca" },
  { category: "eb3" as const, label: "EB-3 India", colour: "#b45309" },
];

/**
 * India EB-1/EB-2/EB-3 Final Action Dates over the trailing `window` bulletins.
 *
 * A gap in a line is a month the category was Unavailable or Current — those
 * are states, not dates, and drawing through them would invent a cutoff that
 * did not exist. The caption says so rather than leaving the reader to guess.
 */
export function IndiaMovementChart({
  bulletinMonth,
  window = 24,
}: {
  bulletinMonth: string;
  window?: number;
}) {
  const series = SERIES.map((s) => {
    const raw = getSeries(s.category, "india");
    const full = raw ? expandSeries(raw.fad, undefined, bulletinMonth) : [];
    return { ...s, points: full.slice(Math.max(0, full.length - window)) };
  }).filter((s) => s.points.length > 1);

  const months = series.length > 0 ? series[0].points.map((p) => p.month) : [];
  const values = series
    .flatMap((s) => s.points)
    .map((p) => p.value)
    .filter((v): v is number => v !== null);

  if (values.length < 2 || months.length < 2) {
    return (
      <p className="mt-4 text-sm text-ink-400">
        Not enough verified history to chart this window yet.
      </p>
    );
  }

  const W = 760;
  const H = 320;
  const m = { top: 18, right: 120, bottom: 40, left: 62 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const yMin = Math.min.apply(null, values);
  const yMax = Math.max.apply(null, values);
  const span = yMax - yMin || 12;

  const x = (i: number) => m.left + (i / (months.length - 1)) * plotW;
  const y = (v: number) => m.top + plotH - ((v - yMin) / span) * plotH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * span);
  const xTickIdx = [0, Math.floor((months.length - 1) / 2), months.length - 1];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Line chart of India EB-1, EB-2 and EB-3 final action dates across the ${months.length} bulletins ending ${monthLabel(
          bulletinMonth
        )}. A break in a line is a month the category was unavailable or current.`}
        className="h-auto w-full"
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={m.left} y1={y(v)} x2={W - m.right} y2={y(v)} stroke="#e2e8f0" />
            <text x={m.left - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#64748b">
              {fromMonthIndex(v)}
            </text>
          </g>
        ))}

        {xTickIdx.map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - m.bottom + 20}
            textAnchor={i === 0 ? "start" : i === months.length - 1 ? "end" : "middle"}
            fontSize="12"
            fill="#64748b"
          >
            {monthLabel(months[i])}
          </text>
        ))}

        {series.map((s) => {
          // Split into unbroken runs so a gap is a gap, not a straight line
          // through months where the category had no cutoff date at all.
          const runs: { i: number; v: number }[][] = [];
          let run: { i: number; v: number }[] = [];
          s.points.forEach((p, i) => {
            if (p.value === null) {
              if (run.length > 0) runs.push(run);
              run = [];
            } else {
              run.push({ i, v: p.value });
            }
          });
          if (run.length > 0) runs.push(run);

          return (
            <g key={s.category}>
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
                    strokeLinejoin="round"
                  />
                )
              )}
            </g>
          );
        })}

        {series.map((s, i) => (
          <g key={`legend-${s.category}`}>
            <line
              x1={W - m.right + 12}
              y1={m.top + 12 + i * 22}
              x2={W - m.right + 34}
              y2={m.top + 12 + i * 22}
              stroke={s.colour}
              strokeWidth="3"
            />
            <text
              x={W - m.right + 40}
              y={m.top + 16 + i * 22}
              fontSize="13"
              fill="#334155"
            >
              {s.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs text-ink-400">
        India final action dates across the last {months.length} bulletins, up to{" "}
        {monthLabel(bulletinMonth)}. The vertical axis is the cutoff date itself,
        so a rising line means the queue is moving forward. A break in a line is
        a month the category was Unavailable or Current — neither is a date, and
        drawing through it would invent one. Source:
        data/visa-bulletin/history.json, built from the official Department of
        State bulletins.
      </figcaption>
    </figure>
  );
}

/* ══════════════ "Which chart applies to you?" diagram ══════════════ */

export function WhichChartDiagram({
  chartInUse,
  chartStatus,
  chartMonthLabel,
}: {
  chartInUse: string;
  chartStatus: string;
  chartMonthLabel: string;
}) {
  const W = 700;
  const H = 360;
  const usingFinalAction = chartInUse === "final-action";

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Which visa bulletin chart applies to you: the two charts, what each one lets you do, and which one USCIS is accepting. Written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="vb-arrow"
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

        <rect x="8" y="8" width={W - 16} height="58" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="28" y="34" fontSize="16" fontWeight="700" fill="#0f172a">
          Your priority date — the day your PERM or I-140 was filed
        </text>
        <text x="28" y="55" fontSize="13.5" fill="#475569">
          Compare it against one of two charts. They do different things.
        </text>

        <path d={`M ${W / 4} 66 L ${W / 4} 92`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#vb-arrow)" />
        <path d={`M ${(W * 3) / 4} 66 L ${(W * 3) / 4} 92`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#vb-arrow)" />

        {/* Dates for filing */}
        <rect
          x="16"
          y="96"
          width={W / 2 - 28}
          height="128"
          rx="10"
          fill={usingFinalAction ? "#f8fafc" : "#eef2ff"}
          stroke={usingFinalAction ? "#e2e8f0" : "#a5b4fc"}
          strokeWidth={usingFinalAction ? "1.5" : "2.5"}
        />
        <text x="36" y="124" fontSize="16" fontWeight="700" fill="#0f172a">
          Dates for Filing
        </text>
        <text x="36" y="148" fontSize="13.5" fill="#475569">
          The earlier chart. If your date is before it,
        </text>
        <text x="36" y="167" fontSize="13.5" fill="#475569">
          you may SUBMIT the I-485 — and with it the
        </text>
        <text x="36" y="186" fontSize="13.5" fill="#475569">
          EAD and advance parole.
        </text>
        <text x="36" y="210" fontSize="13" fontWeight="600" fill="#4338ca">
          You cannot be approved on this chart.
        </text>

        {/* Final action */}
        <rect
          x={W / 2 + 12}
          y="96"
          width={W / 2 - 28}
          height="128"
          rx="10"
          fill={usingFinalAction ? "#ecfdf5" : "#f8fafc"}
          stroke={usingFinalAction ? "#6ee7b7" : "#e2e8f0"}
          strokeWidth={usingFinalAction ? "2.5" : "1.5"}
        />
        <text x={W / 2 + 32} y="124" fontSize="16" fontWeight="700" fill="#0f172a">
          Final Action Dates
        </text>
        <text x={W / 2 + 32} y="148" fontSize="13.5" fill="#475569">
          The later chart. If your date is before it,
        </text>
        <text x={W / 2 + 32} y="167" fontSize="13.5" fill="#475569">
          a green card can actually be APPROVED
        </text>
        <text x={W / 2 + 32} y="186" fontSize="13.5" fill="#475569">
          and a visa number issued.
        </text>
        <text x={W / 2 + 32} y="210" fontSize="13" fontWeight="600" fill="#047857">
          This is the one that ends the wait.
        </text>

        <path d={`M ${W / 2} 224 L ${W / 2} 252`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#vb-arrow)" />

        <rect x="16" y="256" width={W - 32} height="60" rx="10" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
        <text x="36" y="282" fontSize="15.5" fontWeight="700" fill="#92400e">
          USCIS decides which chart it accepts for filing, month by month
        </text>
        <text x="36" y="303" fontSize="13.5" fill="#78350f">
          {chartStatus === "posted"
            ? `For ${chartMonthLabel}: employment filings use the ${usingFinalAction ? "Final Action Dates" : "Dates for Filing"} chart.`
            : `Not yet posted for this month — the latest determination covers ${chartMonthLabel}.`}
        </text>

        <rect x="16" y="322" width={W - 32} height="30" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="36" y="342" fontSize="13.5" fill="#475569">
          &ldquo;C&rdquo; means current — no backlog. &ldquo;U&rdquo; means unavailable — no numbers at all this month.
        </text>
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            Start with your priority date — the day your PERM, or your I-140
            where no PERM was needed, was filed.
          </li>
          <li>
            <strong className="font-semibold text-ink-700">Dates for Filing</strong>{" "}
            is the earlier of the two charts. If your priority date falls before
            it, you may submit the I-485, and with it the EAD and advance parole
            applications. You cannot be approved on this chart.
          </li>
          <li>
            <strong className="font-semibold text-ink-700">Final Action Dates</strong>{" "}
            is the later chart. If your priority date falls before it, a visa
            number is available and the green card can actually be approved.
          </li>
          <li>
            USCIS decides each month which chart it will accept for filing.{" "}
            {chartStatus === "posted"
              ? `For ${chartMonthLabel}, employment-based filings use the ${usingFinalAction ? "Final Action Dates" : "Dates for Filing"} chart.`
              : `It has not yet posted a determination for this month; the latest one covers ${chartMonthLabel}.`}
          </li>
          <li>
            &ldquo;C&rdquo; means current — no backlog, file and be approved.
            &ldquo;U&rdquo; means unavailable — no visa numbers at all that
            month, whatever your priority date is.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
