/**
 * The consular path from an approved I-130 to a green card in the mail.
 * Inline SVG, no library. Vertical stack so the labels stay readable at 360px,
 * with a full text equivalent in the caption.
 */

const STEPS = [
  { t: "I-130 approved", d: "USCIS issues the I-797 approval notice. Nothing else happens yet." },
  { t: "Case sent to NVC", d: "The physical handoff from USCIS to the National Visa Center." },
  { t: "Welcome letter", d: "Your NVC case number and invoice ID arrive by email or post. This is when you can first log in to CEAC." },
  { t: "Fees paid", d: "The affidavit-of-support fee and the immigrant visa application fee, through CEAC. Allow about ten days to clear." },
  { t: "DS-260 filed", d: "The immigrant visa application, one per applicant." },
  { t: "Civil documents + I-864", d: "Birth and marriage certificates, police certificates, translations, and the affidavit of support with tax returns." },
  { t: "Documentarily qualified", d: "NVC has accepted everything. The case joins the interview queue." },
  { t: "Interview scheduled", d: "NVC books the appointment. For India this is the immigrant visa unit at the US Consulate General in Mumbai." },
  { t: "Consular interview + medical", d: "The panel physician exam happens before the interview; the visa decision at it." },
  { t: "Visa issued → entry → green card", d: "The passport comes back with the visa, you enter the US, and the card is mailed to your US address." },
];

export default function ConsularPathDiagram() {
  const W = 720;
  const rowH = 58;
  const gap = 12;
  const H = STEPS.length * (rowH + gap) + 12;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Ten stages from an approved I-130 petition to a green card arriving in the mail. Written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="nvc-arrow"
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
          const isDq = i === 6;
          const isEnd = i === STEPS.length - 1;
          const youAct = i >= 3 && i <= 5;
          return (
            <g key={s.t}>
              <rect
                x="8"
                y={y}
                width={W - 16}
                height={rowH}
                rx="10"
                fill={isEnd ? "#ecfdf5" : isDq ? "#eef2ff" : youAct ? "#fffbeb" : "#f8fafc"}
                stroke={isEnd ? "#6ee7b7" : isDq ? "#a5b4fc" : youAct ? "#fcd34d" : "#e2e8f0"}
                strokeWidth="1.5"
              />
              <circle cx="32" cy={y + rowH / 2} r="12" fill={isEnd ? "#059669" : youAct ? "#b45309" : "#4338ca"} />
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
                {s.d.length > 96 ? `${s.d.slice(0, 94)}…` : s.d}
              </text>
              {!isEnd && (
                <path
                  d={`M 32 ${y + rowH} L 32 ${y + rowH + gap - 1}`}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#nvc-arrow)"
                />
              )}
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        Amber stages are the ones that move at <em>your</em> pace, not NVC&apos;s.
        <strong className="mt-2 block font-semibold text-ink-700">
          The same path in words:
        </strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {STEPS.map((s) => (
            <li key={s.t}>
              <strong className="font-semibold text-ink-700">{s.t}.</strong> {s.d}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
