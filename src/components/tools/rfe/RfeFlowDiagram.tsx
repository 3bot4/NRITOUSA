/**
 * RFE flow: issued → gather → respond → "Response Received" → one of three
 * endings. Inline SVG, no library, vertical stack for 360px legibility, full
 * text equivalent in the caption.
 */

import { RFE_RULES } from "@/data/rfeData";

const STEPS = [
  {
    t: "RFE issued",
    d: `The clock starts on the NOTICE date, not the day it reaches you. Mailed service adds ${RFE_RULES.mailGraceDays} days to the period.`,
  },
  {
    t: "Read the notice in full",
    d: "It names the specific legal requirement not yet met, lists the evidence that would meet it, and prints your response period.",
  },
  {
    t: "Gather the evidence",
    d: "Answer every item, including the ones you think you already sent. Send it once, complete.",
  },
  {
    t: "Respond — online or by mail",
    d: "USCIS counts RECEIPT, not postmark. There is no extension to ask for.",
  },
  {
    t: '"Response To USCIS’ Request For Evidence Was Received"',
    d: "A receipt confirmation only. It says nothing about whether the evidence was sufficient.",
  },
];

const ENDINGS = [
  { t: "Approved", tone: "#059669", fill: "#ecfdf5", stroke: "#6ee7b7" },
  { t: "Second RFE", tone: "#b45309", fill: "#fffbeb", stroke: "#fcd34d" },
  { t: "NOID", tone: "#b45309", fill: "#fffbeb", stroke: "#fcd34d" },
  { t: "Denied", tone: "#be123c", fill: "#fff1f2", stroke: "#fda4af" },
];

export default function RfeFlowDiagram() {
  const W = 720;
  const rowH = 60;
  const gap = 14;
  const endBlockY = STEPS.length * (rowH + gap) + 16;
  const H = endBlockY + 96;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="How a Request for Evidence runs, from issue to one of four outcomes. Written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="rfe-arrow"
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

        {STEPS.map((s, i) => {
          const y = 6 + i * (rowH + gap);
          const isRespond = i === 3;
          return (
            <g key={s.t}>
              <rect
                x="8"
                y={y}
                width={W - 16}
                height={rowH}
                rx="10"
                fill={isRespond ? "#eef2ff" : "#f8fafc"}
                stroke={isRespond ? "#a5b4fc" : "#e2e8f0"}
                strokeWidth="1.5"
              />
              <circle cx="32" cy={y + rowH / 2} r="12" fill="#4338ca" />
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
              <text x="54" y={y + 25} fontSize="15.5" fontWeight="700" fill="#0f172a">
                {s.t}
              </text>
              <text x="54" y={y + 45} fontSize="13" fill="#475569">
                {s.d.length > 98 ? `${s.d.slice(0, 96)}…` : s.d}
              </text>
              <path
                d={`M 32 ${y + rowH} L 32 ${y + rowH + gap - 1}`}
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#rfe-arrow)"
              />
            </g>
          );
        })}

        <text x="8" y={endBlockY + 4} fontSize="14" fontWeight="700" fill="#475569">
          One of four endings
        </text>
        {ENDINGS.map((e, i) => {
          const w = (W - 16 - 3 * 10) / 4;
          const x = 8 + i * (w + 10);
          return (
            <g key={e.t}>
              <rect
                x={x}
                y={endBlockY + 18}
                width={w}
                height="52"
                rx="10"
                fill={e.fill}
                stroke={e.stroke}
                strokeWidth="1.5"
              />
              <text
                x={x + w / 2}
                y={endBlockY + 50}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill={e.tone}
              >
                {e.t}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {STEPS.map((s) => (
            <li key={s.t}>
              <strong className="font-semibold text-ink-700">{s.t}.</strong> {s.d}
            </li>
          ))}
          <li>
            <strong className="font-semibold text-ink-700">Then one of four endings:</strong>{" "}
            approved; a second Request for Evidence, when your response opened a
            new question; a Notice of Intent to Deny, meaning the officer is
            minded to refuse and is giving you a final chance to answer; or a
            denial.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
