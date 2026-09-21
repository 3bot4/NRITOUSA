/**
 * Interview-day flow, including the separate-interview branch.
 * Inline SVG, no library; vertical stack for 360px legibility.
 */

import { INTERVIEW_DAY } from "@/data/marriageInterviewData";

const OUTCOMES = [
  { t: "Approved", fill: "#ecfdf5", stroke: "#6ee7b7", tone: "#059669" },
  { t: "RFE", fill: "#fffbeb", stroke: "#fcd34d", tone: "#b45309" },
  { t: "Continued", fill: "#fffbeb", stroke: "#fcd34d", tone: "#b45309" },
  { t: "Denied", fill: "#fff1f2", stroke: "#fda4af", tone: "#be123c" },
];

export default function InterviewDayDiagram() {
  const steps = INTERVIEW_DAY.slice(0, 5);
  const W = 720;
  const rowH = 58;
  const gap = 13;
  const outY = steps.length * (rowH + gap) + 16;
  const H = outY + 92;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="What happens on the day of a marriage green card interview, including the separate-interview branch and the four possible outcomes. Written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="mi-arrow"
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

        {steps.map((s, i) => {
          const y = 6 + i * (rowH + gap);
          const isBranch = i === 4;
          return (
            <g key={s.t}>
              <rect
                x="8"
                y={y}
                width={W - 16}
                height={rowH}
                rx="10"
                fill={isBranch ? "#fffbeb" : "#f8fafc"}
                stroke={isBranch ? "#fcd34d" : "#e2e8f0"}
                strokeWidth="1.5"
                strokeDasharray={isBranch ? "6 4" : undefined}
              />
              <circle cx="32" cy={y + rowH / 2} r="12" fill={isBranch ? "#b45309" : "#4338ca"} />
              <text
                x="32"
                y={y + rowH / 2 + 4}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#ffffff"
              >
                {i + 1}
              </text>
              <text x="54" y={y + 24} fontSize="15.5" fontWeight="700" fill="#0f172a">
                {s.t}
              </text>
              <text x="54" y={y + 43} fontSize="13" fill="#475569">
                {s.d.length > 98 ? `${s.d.slice(0, 96)}…` : s.d}
              </text>
              <path
                d={`M 32 ${y + rowH} L 32 ${y + rowH + gap - 1}`}
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#mi-arrow)"
              />
            </g>
          );
        })}

        <text x="8" y={outY + 2} fontSize="14" fontWeight="700" fill="#475569">
          Four possible outcomes
        </text>
        {OUTCOMES.map((o, i) => {
          const w = (W - 16 - 3 * 10) / 4;
          const x = 8 + i * (w + 10);
          return (
            <g key={o.t}>
              <rect
                x={x}
                y={outY + 16}
                width={w}
                height="50"
                rx="10"
                fill={o.fill}
                stroke={o.stroke}
                strokeWidth="1.5"
              />
              <text
                x={x + w / 2}
                y={outY + 46}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill={o.tone}
              >
                {o.t}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {steps.map((s) => (
            <li key={s.t}>
              <strong className="font-semibold text-ink-700">{s.t}.</strong> {s.d}
            </li>
          ))}
          <li>
            <strong className="font-semibold text-ink-700">Then one of four outcomes:</strong>{" "}
            approved on the day; a request for more evidence; the case continued
            while the officer reviews or verifies something; or a denial.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
