/**
 * Comparison matrix and the India EB-1 vs EB-2 wait chart.
 * Inline SVG, no library. The wait chart reuses the same
 * data/visa-bulletin/history.json series the monthly bulletin pages use —
 * no second dataset.
 */

import { expandSeries, getSeries } from "@/lib/visa-bulletin";
import { monthLabel } from "@/lib/visaBulletinMonths";
import { MATRIX_ROWS, ROUTES, type RouteId } from "@/data/eb1NiwData";

const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fromMonthIndex(mi: number): string {
  const y = Math.floor(mi / 12);
  const m = Math.min(11, Math.max(0, Math.round(mi % 12)));
  return `${MONTHS_ABBR[m]} ${y}`;
}

/* ══════════════ Comparison matrix ══════════════ */

export function ComparisonMatrix() {
  const cols: RouteId[] = ["eb1a", "eb1b", "eb1c", "niw"];
  const W = 720;
  const headH = 52;
  const rowH = 44;
  const labelW = 190;
  const colW = (W - labelW - 16) / cols.length;
  const H = headH + MATRIX_ROWS.length * rowH + 16;

  const tone = (v: string) =>
    v === "Yes" ? "#047857" : v === "No" ? "#be123c" : "#334155";

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Comparison of EB-1A, EB-1B, EB-1C and EB-2 NIW across ${MATRIX_ROWS.length} dimensions. The same table is written out below.`}
        className="h-auto w-full"
      >
        {cols.map((id, i) => {
          const x = labelW + i * colW;
          const r = ROUTES.filter((rt) => rt.id === id)[0];
          return (
            <g key={id}>
              <rect
                x={x + 3}
                y={8}
                width={colW - 6}
                height={headH - 12}
                rx="8"
                fill={r.preference === "EB-1" ? "#eef2ff" : "#ecfdf5"}
                stroke={r.preference === "EB-1" ? "#a5b4fc" : "#6ee7b7"}
                strokeWidth="1.5"
              />
              <text
                x={x + colW / 2}
                y={30}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="#0f172a"
              >
                {r.short}
              </text>
            </g>
          );
        })}

        {MATRIX_ROWS.map((row, ri) => {
          const y = headH + ri * rowH;
          return (
            <g key={row.label}>
              {ri % 2 === 0 && (
                <rect x="8" y={y} width={W - 16} height={rowH} rx="6" fill="#f8fafc" />
              )}
              <text x="20" y={y + rowH / 2 + 5} fontSize="14" fontWeight="600" fill="#334155">
                {row.label}
              </text>
              {cols.map((id, i) => (
                <text
                  key={id}
                  x={labelW + i * colW + colW / 2}
                  y={y + rowH / 2 + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={tone(row.values[id])}
                >
                  {row.values[id]}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">The same comparison in words:</strong>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {ROUTES.map((r) => (
            <li key={r.id}>
              <strong className="font-semibold text-ink-700">{r.short}</strong> —{" "}
              {r.preference}. Self-petition: {r.selfPetition ? "yes" : "no"}. Job
              offer: {r.jobOffer ? "required" : "not required"}. PERM labour
              certification: {r.perm ? "required" : "not required"}.
            </li>
          ))}
          <li>
            None of the four requires PERM. That is the thing they have in
            common, and it is why they are compared against each other rather
            than against the ordinary EB-2 and EB-3 route.
          </li>
        </ul>
      </figcaption>
    </figure>
  );
}

/* ══════════════ India EB-1 vs EB-2 wait ══════════════ */

/**
 * The chart that makes this an India page rather than a generic comparison:
 * the same person, choosing between two preference categories, is choosing
 * between two very different queues.
 */
export function IndiaEb1VsEb2Chart({ bulletinMonth }: { bulletinMonth: string }) {
  const SERIES = [
    { category: "eb1" as const, label: "EB-1 India", colour: "#0891b2" },
    { category: "eb2" as const, label: "EB-2 India", colour: "#4338ca" },
  ];

  const series = SERIES.map((s) => {
    const raw = getSeries(s.category, "india");
    const full = raw ? expandSeries(raw.fad, undefined, bulletinMonth) : [];
    return { ...s, points: full.slice(Math.max(0, full.length - 36)) };
  }).filter((s) => s.points.length > 1);

  const months = series.length > 0 ? series[0].points.map((p) => p.month) : [];
  const values = series
    .flatMap((s) => s.points)
    .map((p) => p.value)
    .filter((v): v is number => v !== null);

  if (values.length < 2 || months.length < 2) {
    return (
      <p className="mt-4 text-sm text-ink-400">
        Not enough verified bulletin history to chart this comparison yet.
      </p>
    );
  }

  const W = 760;
  const H = 300;
  const m = { top: 18, right: 112, bottom: 40, left: 62 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;

  const yMin = Math.min.apply(null, values);
  const yMax = Math.max.apply(null, values);
  const span = yMax - yMin || 12;

  const x = (i: number) => m.left + (i / (months.length - 1)) * plotW;
  const y = (v: number) => m.top + plotH - ((v - yMin) / span) * plotH;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * span);

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Line chart comparing India EB-1 and EB-2 final action dates over the last ${months.length} bulletins. A break in a line is a month the category was unavailable or current.`}
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

        {[0, Math.floor((months.length - 1) / 2), months.length - 1].map((i) => (
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
          <g key={`lg-${s.category}`}>
            <line
              x1={W - m.right + 10}
              y1={m.top + 12 + i * 22}
              x2={W - m.right + 32}
              y2={m.top + 12 + i * 22}
              stroke={s.colour}
              strokeWidth="3"
            />
            <text x={W - m.right + 38} y={m.top + 16 + i * 22} fontSize="13" fill="#334155">
              {s.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        India final action dates for EB-1 and EB-2 across the last {months.length}{" "}
        bulletins, to {monthLabel(bulletinMonth)}. The vertical axis is the cutoff
        date itself, so a higher line means a shorter queue. A break in a line is
        a month the category was Unavailable or Current — neither is a date, and
        joining through it would invent one. Source:
        data/visa-bulletin/history.json, built from the official Department of
        State bulletins.
      </figcaption>
    </figure>
  );
}
