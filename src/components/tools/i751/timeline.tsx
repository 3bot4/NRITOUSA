/**
 * I-751 timeline diagram — inline SVG, no library (the production CSP blocks
 * external script hosts, see next.config.mjs).
 *
 * Laid out as a vertical stack rather than a wide flowchart so the labels stay
 * legible on a 360px phone: the smallest type here is 14px inside a 720-wide
 * viewBox, which is roughly 7px at 360px CSS width, and the caption carries the
 * full text equivalent for screen readers and answer engines.
 */

import { I751_FACTS } from "@/data/i751Data";

const MAIN = [
  {
    t: "Conditional card issued",
    d: `Valid ${I751_FACTS.conditionalYears} years from the day you became a conditional resident.`,
  },
  {
    t: "21 months of ordinary life",
    d: "The two years of documents an officer will later read are being created now — joint accounts, a shared lease, tax returns filed together.",
  },
  {
    t: `Filing window opens — ${I751_FACTS.windowDays} days before expiry`,
    d: "File earlier and USCIS rejects the petition outright.",
  },
  {
    t: "File Form I-751",
    d: `Online (${I751_FACTS.onlineFee}) or on paper (${I751_FACTS.paperFee}).`,
  },
  {
    t: `Receipt notice extends status ${I751_FACTS.extensionMonths} months`,
    d: "Form I-797C with the expired card is your evidence of status and work authorisation.",
  },
  { t: "Biometrics appointment", d: "Fingerprints and photo at an application support centre." },
  { t: "Interview — only if USCIS asks for one", d: "It is not automatic." },
  { t: "10-year green card", d: "Conditions removed. The card is now renewable on Form I-90." },
];

export function I751TimelineDiagram() {
  const W = 720;
  const rowH = 62;
  const gap = 14;
  const branchH = 110;
  const H = MAIN.length * (rowH + gap) + branchH + 28;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Timeline from a conditional green card to a ten-year green card, with a branch for filing without a spouse. The same sequence is written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="i751-arrow"
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

        {MAIN.map((n, i) => {
          const y = 8 + i * (rowH + gap);
          const isFile = i === 3;
          const isEnd = i === MAIN.length - 1;
          return (
            <g key={n.t}>
              <rect
                x="8"
                y={y}
                width={W - 16}
                height={rowH}
                rx="10"
                fill={isEnd ? "#ecfdf5" : isFile ? "#eef2ff" : "#f8fafc"}
                stroke={isEnd ? "#6ee7b7" : isFile ? "#a5b4fc" : "#e2e8f0"}
                strokeWidth="1.5"
              />
              <circle cx="34" cy={y + rowH / 2} r="13" fill={isEnd ? "#059669" : "#4338ca"} />
              <text
                x="34"
                y={y + rowH / 2 + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill="#ffffff"
              >
                {i + 1}
              </text>
              <text x="58" y={y + 26} fontSize="16" fontWeight="700" fill="#0f172a">
                {n.t}
              </text>
              <text x="58" y={y + 46} fontSize="14" fill="#475569">
                {n.d.length > 92 ? `${n.d.slice(0, 90)}…` : n.d}
              </text>
              {!isEnd && (
                <path
                  d={`M 34 ${y + rowH} L 34 ${y + rowH + gap - 2}`}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#i751-arrow)"
                />
              )}
            </g>
          );
        })}

        {/* Waiver branch, hanging off the filing step */}
        <g>
          <rect
            x="8"
            y={MAIN.length * (rowH + gap) + 14}
            width={W - 16}
            height={branchH - 22}
            rx="10"
            fill="#fffbeb"
            stroke="#fcd34d"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x="28"
            y={MAIN.length * (rowH + gap) + 40}
            fontSize="16"
            fontWeight="700"
            fill="#92400e"
          >
            Branch — filing without your spouse (waiver)
          </text>
          <text x="28" y={MAIN.length * (rowH + gap) + 62} fontSize="14" fill="#78350f">
            Divorce, annulment, the death of your spouse, or battery or extreme cruelty.
          </text>
          <text x="28" y={MAIN.length * (rowH + gap) + 80} fontSize="14" fill="#78350f">
            The 90-day window does not apply — you may file at any time before a final removal order.
          </text>
        </g>
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">The same path in words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {MAIN.map((n) => (
            <li key={n.t}>
              <strong className="font-semibold text-ink-700">{n.t}.</strong> {n.d}
            </li>
          ))}
          <li>
            <strong className="font-semibold text-ink-700">
              Branch — filing without your spouse.
            </strong>{" "}
            If the marriage ended in divorce or annulment, your spouse died, or
            you or your child suffered battery or extreme cruelty, you file the
            same form requesting a waiver of the joint filing requirement. The
            90-day window does not restrict a waiver filing.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
