/**
 * The NVC pipeline drawn to scale.
 *
 * Deliberately NOT a trend chart. The September build documented why there is
 * no trend line here: two current figures from the Department of State are not
 * a series, and inventing one would be worse than having none.
 *
 * What this draws instead is the thing the page already publishes in a table —
 * the planning ranges in `nvcProcessingData` — laid end to end so the reader
 * can see where the time actually goes. Every bar is a RANGE, drawn as a range,
 * because the honest shape of this data is a spread and not a number.
 *
 * Inline SVG: the production CSP blocks CDN chart libraries.
 */

import { nvcProcessingData as D, NVC_DATA_NOTE } from "@/data/nvcData";

interface Band {
  label: string;
  lowWeeks: number;
  highWeeks: number;
  /** Who is holding the clock during this band. */
  owner: "nvc" | "you" | "post";
}

const OWNER_FILL: Record<Band["owner"], string> = {
  nvc: "#4338ca",
  you: "#f59e0b",
  post: "#0284c7",
};

const OWNER_LABEL: Record<Band["owner"], string> = {
  nvc: "NVC's queue",
  you: "Yours to move",
  post: "Embassy capacity",
};

export default function NvcStageChart() {
  const bands: Band[] = [
    {
      label: "USCIS approval → NVC case created",
      lowWeeks: D.caseCreationWeeksLow,
      highWeeks: D.caseCreationWeeksHigh,
      owner: "nvc",
    },
    {
      label: "Pay fees, file DS-260, gather documents",
      lowWeeks: 2,
      highWeeks: 16,
      owner: "you",
    },
    {
      label: "NVC reviews the package",
      lowWeeks: D.docReviewWeeksLow,
      highWeeks: D.docReviewWeeksHigh,
      owner: "nvc",
    },
    {
      label: "Documentarily qualified → interview",
      lowWeeks: D.dqToInterviewMonthsLow * 4.35,
      highWeeks: D.dqToInterviewMonthsHigh * 4.35,
      owner: "post",
    },
  ];

  /* Cumulative start points, best case and worst case. */
  let lowCursor = 0;
  let highCursor = 0;
  const rows = bands.map((b) => {
    const row = {
      ...b,
      lowStart: lowCursor,
      highStart: highCursor,
      lowEnd: lowCursor + b.lowWeeks,
      highEnd: highCursor + b.highWeeks,
    };
    lowCursor += b.lowWeeks;
    highCursor += b.highWeeks;
    return row;
  });

  const totalLow = Math.round(lowCursor);
  const totalHigh = Math.round(highCursor);

  const W = 720;
  const rowH = 58;
  const top = 74;
  const H = top + rows.length * rowH + 96;
  const labelW = 210;
  const plotX = labelW + 10;
  const plotW = W - plotX - 60;
  const x = (weeks: number) => plotX + (weeks / highCursor) * plotW;

  const monthTicks = [0, 3, 6, 9, 12].filter((m) => m * 4.35 <= highCursor);

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Range chart of the four NVC stages laid end to end. Best case about ${totalLow} weeks, worst case about ${totalHigh} weeks. Written out in full below.`}
        className="h-auto w-full"
      >
        <text x="8" y="20" fontSize="14" fontWeight="700" fill="#0f172a">
          Where the time actually goes
        </text>
        <text x="8" y="37" fontSize="12" fill="#64748b">
          Each bar spans best case to worst case, placed where that stage starts.
        </text>
        <text x="8" y="54" fontSize="12" fill="#64748b">
          Planning ranges, not guarantees — and not a prediction for your case.
        </text>

        {monthTicks.map((m) => (
          <g key={m}>
            <line
              x1={x(m * 4.35)}
              y1={top - 10}
              x2={x(m * 4.35)}
              y2={top + rows.length * rowH - 8}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={x(m * 4.35)}
              y={top + rows.length * rowH + 10}
              textAnchor="middle"
              fontSize="11.5"
              fill="#94a3b8"
            >
              {m === 0 ? "start" : `${m} mo`}
            </text>
          </g>
        ))}

        {rows.map((r, i) => {
          const y = top + i * rowH;
          const barY = y + 8;
          const barH = 22;
          const xLow = x(r.lowStart);
          const xHigh = x(r.highEnd);
          return (
            <g key={r.label}>
              {r.label.split(" ").reduce<string[][]>((lines, word) => {
                const last = lines[lines.length - 1];
                if (!last || last.join(" ").length + word.length > 30) lines.push([word]);
                else last.push(word);
                return lines;
              }, []).map((line, li) => (
                <text key={li} x={8} y={barY + 14 + li * 14} fontSize="12" fill="#0f172a">
                  {line.join(" ")}
                </text>
              ))}

              {/* the full spread, faint */}
              <rect
                x={xLow}
                y={barY}
                width={Math.max(3, xHigh - xLow)}
                height={barH}
                rx={4}
                fill={OWNER_FILL[r.owner]}
                opacity={0.18}
              />
              {/* the best-case duration, solid, at the left of the spread */}
              <rect
                x={xLow}
                y={barY}
                width={Math.max(3, x(r.lowEnd) - xLow)}
                height={barH}
                rx={4}
                fill={OWNER_FILL[r.owner]}
              />
              <text
                x={xHigh + 6}
                y={barY + 16}
                fontSize="11.5"
                fontWeight="600"
                fill="#475569"
              >
                {Math.round(r.lowWeeks)}–{Math.round(r.highWeeks)}w
              </text>
            </g>
          );
        })}

        <line
          x1={plotX}
          y1={top + rows.length * rowH - 4}
          x2={plotX + plotW}
          y2={top + rows.length * rowH - 4}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {(Object.keys(OWNER_FILL) as Band["owner"][]).map((k, i) => (
          <g key={k}>
            <rect
              x={8 + i * 175}
              y={H - 62}
              width={12}
              height={12}
              rx={2}
              fill={OWNER_FILL[k]}
            />
            <text x={26 + i * 175} y={H - 52} fontSize="11.5" fill="#475569">
              {OWNER_LABEL[k]}
            </text>
          </g>
        ))}
        <text x="8" y={H - 30} fontSize="12" fontWeight="700" fill="#0f172a">
          End to end: roughly {totalLow} weeks at best, {totalHigh} weeks at worst.
        </text>
        <text x="8" y={H - 12} fontSize="11.5" fill="#64748b">
          The amber band is the one families underestimate — and the only one they can shorten.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {rows.map((r) => (
            <li key={r.label}>
              {r.label}: about {Math.round(r.lowWeeks)} to{" "}
              {Math.round(r.highWeeks)} weeks ({OWNER_LABEL[r.owner].toLowerCase()}).
            </li>
          ))}
          <li>
            Laid end to end that is roughly {totalLow} weeks in the best case and{" "}
            {totalHigh} in the worst — but the stages do not add up cleanly,
            because a package sent back for a missing document restarts the
            review band rather than extending it.
          </li>
        </ol>
        {NVC_DATA_NOTE}
      </figcaption>
    </figure>
  );
}
