/**
 * Divorce by immigration stage. Inline SVG, no library.
 *
 * Ordered by how much a divorce actually disturbs the status, least first, so
 * the reader can find their own row fast — and so the page does not open with
 * the worst case for someone whose status is not affected at all.
 */

const ROWS = [
  {
    stage: "Naturalised US citizen",
    effect: "Unaffected",
    detail: "Citizenship is held in your own right.",
    tone: "#059669",
    fill: "#ecfdf5",
    stroke: "#6ee7b7",
  },
  {
    stage: "10-year green card",
    effect: "Unaffected",
    detail: "Residence is yours. Divorce is not a ground of removability.",
    tone: "#059669",
    fill: "#ecfdf5",
    stroke: "#6ee7b7",
  },
  {
    stage: "Conditional 2-year card",
    effect: "Waiver route",
    detail: "File I-751 alone, requesting a waiver. No 90-day window applies.",
    tone: "#b45309",
    fill: "#fffbeb",
    stroke: "#fcd34d",
  },
  {
    stage: "I-485 pending",
    effect: "At risk",
    detail: "Ending the marriage can remove the basis for the application.",
    tone: "#be123c",
    fill: "#fff1f2",
    stroke: "#fda4af",
  },
  {
    stage: "I-130 pending",
    effect: "At risk",
    detail: "The qualifying relationship is the petition. Take advice before anyone files.",
    tone: "#be123c",
    fill: "#fff1f2",
    stroke: "#fda4af",
  },
  {
    stage: "H-4, L-2, F-2 dependent",
    effect: "At risk",
    detail: "Derivative status rests on the marriage, not on the date on your I-94.",
    tone: "#be123c",
    fill: "#fff1f2",
    stroke: "#fda4af",
  },
];

export default function DivorceByStageDiagram() {
  const W = 720;
  const rowH = 56;
  const gap = 10;
  const H = ROWS.length * (rowH + gap) + 44;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="What a divorce does at each immigration stage, from unaffected to at risk. Written out below the diagram."
        className="h-auto w-full"
      >
        <text x="8" y="18" fontSize="13.5" fontWeight="700" fill="#475569">
          Least disturbed at the top
        </text>

        {ROWS.map((r, i) => {
          const y = 30 + i * (rowH + gap);
          return (
            <g key={r.stage}>
              <rect
                x="8"
                y={y}
                width={W - 16}
                height={rowH}
                rx="10"
                fill={r.fill}
                stroke={r.stroke}
                strokeWidth="1.5"
              />
              <text x="28" y={y + 24} fontSize="15.5" fontWeight="700" fill="#0f172a">
                {r.stage}
              </text>
              <text x="28" y={y + 43} fontSize="13" fill="#475569">
                {r.detail}
              </text>
              <text
                x={W - 28}
                y={y + 33}
                textAnchor="end"
                fontSize="14"
                fontWeight="700"
                fill={r.tone}
              >
                {r.effect}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {ROWS.map((r) => (
            <li key={r.stage}>
              <strong className="font-semibold text-ink-700">{r.stage} — {r.effect}.</strong>{" "}
              {r.detail}
            </li>
          ))}
        </ul>
        <p className="mt-2">
          The ordering is the point: a divorce does not cost you a green card you
          already hold in your own right. What it disturbs is status that depends
          on the marriage continuing, and petitions that have not yet concluded.
        </p>
      </figcaption>
    </figure>
  );
}
