/**
 * Inline-SVG line chart of Final Action Date vs Dates for Filing movement
 * for one EB category + country. No charting library — two polylines, a few
 * gridlines, and year labels on both axes.
 */
const MONTHS_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type Pt = { month: string; value: number | null };

function fmtMonthIndex(mi: number): string {
  const y = Math.floor(mi / 12);
  const m = Math.round(mi % 12);
  return `${MONTHS_ABBR[Math.min(m, 11)]} ${y}`;
}

export default function CutoffChart({
  fad,
  dff,
  title,
}: {
  fad: Pt[];
  dff: Pt[];
  title: string;
}) {
  const width = 720;
  const height = 280;
  const m = { top: 16, right: 16, bottom: 28, left: 64 };

  const all = [...fad, ...dff].filter(
    (p): p is { month: string; value: number } => p.value !== null
  );
  if (all.length < 2) {
    return (
      <p className="text-sm text-ink-400">
        Not enough historical data to chart this category yet.
      </p>
    );
  }

  const months = fad.map((p) => p.month);
  const xMin = 0;
  const xMax = months.length - 1;
  const yMin = Math.min(...all.map((p) => p.value));
  const yMax = Math.max(...all.map((p) => p.value));
  const ySpan = yMax - yMin || 1;

  const x = (i: number) =>
    m.left + ((i - xMin) / (xMax - xMin || 1)) * (width - m.left - m.right);
  const y = (v: number) =>
    height - m.bottom - ((v - yMin) / ySpan) * (height - m.top - m.bottom);

  const linePath = (pts: Pt[]) =>
    pts
      .map((p, i) =>
        p.value === null ? null : `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`
      )
      .filter(Boolean)
      .join(" ");

  // ~4 horizontal gridlines labeled with the cutoff year.
  const yTicks = [0, 1 / 3, 2 / 3, 1].map((f) => yMin + f * ySpan);
  // X labels: first, middle, last bulletin month.
  const xTickIdx = [0, Math.floor(months.length / 2), months.length - 1];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title}
        className="h-auto w-full"
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              x2={width - m.right}
              y1={y(t)}
              y2={y(t)}
              stroke="#0b1120"
              strokeOpacity="0.06"
            />
            <text
              x={m.left - 8}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#6b7280"
            >
              {fmtMonthIndex(t)}
            </text>
          </g>
        ))}
        {xTickIdx.map((i) => {
          const [yy, mm] = months[i].split("-");
          return (
            <text
              key={months[i]}
              x={x(i)}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {MONTHS_ABBR[Number(mm) - 1]} {yy}
            </text>
          );
        })}
        <polyline
          points={linePath(dff)}
          fill="none"
          stroke="#598dff"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinejoin="round"
        />
        <polyline
          points={linePath(fad)}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-5 text-xs text-ink-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 rounded bg-emerald-500" /> Final Action
          Date (approval cutoff)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 rounded border-t-2 border-dashed border-brand-400" />{" "}
          Dates for Filing (I-485 filing cutoff)
        </span>
      </figcaption>
    </figure>
  );
}
