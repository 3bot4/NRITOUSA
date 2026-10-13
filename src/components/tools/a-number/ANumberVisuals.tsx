/**
 * Visuals for /uscis/a-number. Inline SVG, no library.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NO REAL IDENTIFIERS, EVER.
 *
 * The card mocks below print invented numbers, taken from the example fields in
 * src/data/aNumberData.ts, which are deliberately shaped so they cannot be a
 * live record. They are schematic drawings with labels — not reproductions, not
 * to scale, and carrying none of a real card's security features. The point is
 * to show WHERE on each document the number sits, which is what readers of this
 * page are actually looking for and what prose directions do badly.
 *
 * If you edit these, do not substitute a number from a real document, and do
 * not make the drawings more faithful. A convincing facsimile of a green card is
 * not a thing this site should publish.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  A_NUMBER_BASICS,
  NUMBER_TYPES,
  REGISTRATION,
  A_NUMBER_VERIFIED,
} from "@/data/aNumberData";

const EXAMPLE_A = A_NUMBER_BASICS.examples[0]; // "A000123456", invented
const EXAMPLE_DIGITS = EXAMPLE_A.replace(/^A/, "");

/* ═══════════════ 1. Where the number sits on each document ════════════ */

export function CardLocationDiagram() {
  const W = 760;
  const H = 440;

  const cardW = 320;
  const cardH = 196;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Schematic drawings of three documents showing where the A-number appears. On a Permanent Resident Card and on an Employment Authorization Document it is labelled USCIS #, in the block of text beside the photograph. On an immigrant visa foil it is labelled Registration Number in the upper portion. A nonimmigrant visa foil is shown for contrast: it carries a visa control number, which is not an A-number. The example number ${EXAMPLE_A} is invented.`}
        className="h-auto w-full"
      >
        {/* ── Green card ── */}
        <g>
          <rect x={20} y={28} width={cardW} height={cardH} rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
          <text x={34} y={18} fontSize="12.5" fontWeight="800" fill="#166534">
            Permanent Resident Card (Form I-551)
          </text>
          <rect x={34} y={44} width={66} height={84} rx="5" fill="#d1fae5" stroke="#86efac" />
          <text x={67} y={90} textAnchor="middle" fontSize="9" fill="#047857">
            photo
          </text>
          <text x={112} y={56} fontSize="8.5" fill="#64748b">SURNAME, Given name</text>
          <rect x={112} y={62} width={120} height={7} rx="2" fill="#cbd5e1" />
          <text x={112} y={86} fontSize="9" fontWeight="800" fill="#047857">
            USCIS #
          </text>
          <text x={112} y={101} fontSize="14" fontWeight="800" fill="#0f172a" fontFamily="ui-monospace, monospace">
            {EXAMPLE_DIGITS}
          </text>
          <rect x={108} y={76} width={150} height={30} rx="5" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="5 3" />
          <text x={112} y={122} fontSize="8.5" fill="#64748b">Category · Country of birth</text>
          <rect x={34} y={140} width={cardW - 28} height={10} rx="2" fill="#dcfce7" />
          <rect x={34} y={154} width={cardW - 28} height={10} rx="2" fill="#dcfce7" />
          <text x={34} y={192} fontSize="9" fill="#64748b">
            The digits also appear in the machine-readable zone on the back.
          </text>
        </g>

        {/* ── EAD ── */}
        <g>
          <rect x={400} y={28} width={cardW} height={cardH} rx="12" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
          <text x={414} y={18} fontSize="12.5" fontWeight="800" fill="#1d4ed8">
            Employment Authorization Document
          </text>
          <rect x={414} y={44} width={66} height={84} rx="5" fill="#dbeafe" stroke="#93c5fd" />
          <text x={447} y={90} textAnchor="middle" fontSize="9" fill="#1d4ed8">
            photo
          </text>
          <text x={492} y={56} fontSize="8.5" fill="#64748b">SURNAME, Given name</text>
          <rect x={492} y={62} width={120} height={7} rx="2" fill="#cbd5e1" />
          <text x={492} y={86} fontSize="9" fontWeight="800" fill="#1d4ed8">
            USCIS #
          </text>
          <text x={492} y={101} fontSize="14" fontWeight="800" fill="#0f172a" fontFamily="ui-monospace, monospace">
            {EXAMPLE_DIGITS}
          </text>
          <rect x={488} y={76} width={150} height={30} rx="5" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="5 3" />
          <text x={492} y={122} fontSize="8.5" fill="#64748b">Category · Valid from / until</text>
          <text x={414} y={192} fontSize="9" fill="#64748b">
            Same label, same place. Same number as on the green card.
          </text>
        </g>

        {/* ── Immigrant visa foil ── */}
        <g>
          <rect x={20} y={254} width={cardW} height={cardH - 36} rx="8" fill="#fefce8" stroke="#fde047" strokeWidth="2" />
          <text x={34} y={244} fontSize="12.5" fontWeight="800" fill="#a16207">
            Immigrant visa foil — in your passport
          </text>
          <text x={34} y={278} fontSize="8.5" fill="#64748b">IMMIGRANT VISA · Issuing post</text>
          <text x={34} y={302} fontSize="9" fontWeight="800" fill="#a16207">
            Registration Number
          </text>
          <text x={34} y={318} fontSize="14" fontWeight="800" fill="#0f172a" fontFamily="ui-monospace, monospace">
            {EXAMPLE_A}
          </text>
          <rect x={30} y={292} width={170} height={32} rx="5" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="5 3" />
          <text x={34} y={344} fontSize="8.5" fill="#64748b">Category · Entries · Expiry</text>
          <text x={34} y={386} fontSize="9" fontWeight="700" fill="#a16207">
            This Registration Number IS your A-number.
          </text>
        </g>

        {/* ── Nonimmigrant visa foil, for contrast ── */}
        <g>
          <rect x={400} y={254} width={cardW} height={cardH - 36} rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
          <text x={414} y={244} fontSize="12.5" fontWeight="800" fill="#b91c1c">
            Nonimmigrant visa foil — for contrast
          </text>
          <text x={414} y={278} fontSize="8.5" fill="#64748b">H-1B / L-1 / F-1 / B-1-B-2</text>
          <text x={414} y={302} fontSize="9" fontWeight="800" fill="#b91c1c">
            Control number
          </text>
          <text x={414} y={318} fontSize="14" fontWeight="800" fill="#0f172a" fontFamily="ui-monospace, monospace">
            00012345
          </text>
          <text x={414} y={346} fontSize="8.5" fill="#64748b">Annotation · Entries · Expiry</text>
          <text x={414} y={378} fontSize="9" fontWeight="700" fill="#b91c1c">
            No A-number here. The red number identifies the
          </text>
          <text x={414} y={391} fontSize="9" fontWeight="700" fill="#b91c1c">
            sticker, not you — and it is not interchangeable.
          </text>
        </g>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        Schematic drawings, not reproductions: not to scale, with none of a real
        document&rsquo;s security features, and every number invented. The dashed
        boxes mark where to look. The fourth panel is there because handing over
        a nonimmigrant visa control number when a form asks for an A-number is
        the single most common version of this mistake. As of {A_NUMBER_VERIFIED}.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 2. Six numbers, mapped ═══════════════════════════════ */

/**
 * The six identifiers arranged by what they identify — a person, a case, an
 * admission, a login, a document. Four of them appear somewhere in the organic
 * results for this keyword; all six together appear nowhere.
 */
export function NumberMapDiagram() {
  const W = 760;
  const H = 330;

  const groups = [
    {
      title: "Identifies YOU",
      sub: "Permanent. One per person, for life.",
      x: 20,
      w: 230,
      fill: "#eef2ff",
      stroke: "#a5b4fc",
      ids: ["a-number"],
    },
    {
      title: "Identifies a CASE or an EVENT",
      sub: "New number every time.",
      x: 268,
      w: 230,
      fill: "#f0fdf4",
      stroke: "#86efac",
      ids: ["receipt-number", "i94-number", "sevis-id"],
    },
    {
      title: "Identifies a LOGIN or a DOCUMENT",
      sub: "Not an immigration identifier at all.",
      x: 516,
      w: 230,
      fill: "#fefce8",
      stroke: "#fde047",
      ids: ["online-account", "visa-control"],
    },
  ];

  const byId = (id: string) => NUMBER_TYPES.filter((t) => t.id === id)[0];

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Diagram grouping six identifiers by what they identify. ${groups
          .map(
            (g) =>
              `${g.title}: ${g.ids.map((i) => `${byId(i).name}, shaped ${byId(i).shape}`).join("; ")}`,
          )
          .join(". ")}.`}
        className="h-auto w-full"
      >
        {groups.map((g) => (
          <g key={g.title}>
            <rect x={g.x} y={16} width={g.w} height={H - 54} rx="12" fill={g.fill} stroke={g.stroke} strokeWidth="1.5" />
            <text x={g.x + 14} y={40} fontSize="12" fontWeight="800" fill="#0f172a">
              {g.title}
            </text>
            <text x={g.x + 14} y={56} fontSize="10" fill="#64748b">
              {g.sub}
            </text>
            {g.ids.map((id, i) => {
              const t = byId(id);
              const yTop = 72 + i * 78;
              return (
                <g key={id}>
                  <rect x={g.x + 12} y={yTop} width={g.w - 24} height={66} rx="8" fill="#ffffff" stroke="#e2e8f0" />
                  <foreignObject x={g.x + 20} y={yTop + 6} width={g.w - 40} height={30}>
                    <div
                      // @ts-expect-error — xmlns is valid inside foreignObject
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{ fontSize: "11px", fontWeight: 700, lineHeight: 1.25, color: "#0f172a", fontFamily: "inherit" }}
                    >
                      {t.name}
                    </div>
                  </foreignObject>
                  <text x={g.x + 20} y={yTop + 48} fontSize="10.5" fill="#475569" fontFamily="ui-monospace, monospace">
                    {t.shape}
                  </text>
                  <text x={g.x + 20} y={yTop + 60} fontSize="9.5" fill="#94a3b8">
                    {t.example}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
        <text x={20} y={H - 14} fontSize="10.5" fill="#94a3b8">
          Every example number is invented. Only the left-hand column is a number that follows you.
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        The grouping is the useful part. People do not confuse these numbers
        because they look alike — they confuse them because nothing explains that
        one of the six identifies a human being and the rest identify
        transactions and pieces of paper.
      </figcaption>
    </figure>
  );
}

/* ═══════════════ 3. The registration rule, as a timeline ══════════════ */

export function RegistrationTimelineChart() {
  const events = REGISTRATION.ruleHistory;
  const W = 760;
  const H = 230;
  const m = { left: 40, right: 40, top: 70 };
  const plotW = W - m.left - m.right;
  const step = plotW / Math.max(1, events.length - 1);

  const fmt = (iso: string) => {
    const [y, mo, d] = iso.split("-");
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}`;
  };

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Timeline of the federal alien registration rule. ${events
          .map((e) => `${fmt(e.date)}: ${e.what}`)
          .join(" ")}`}
        className="h-auto w-full"
      >
        <line x1={m.left} y1={m.top} x2={W - m.right} y2={m.top} stroke="#cbd5e1" strokeWidth="2" />
        {events.map((e, i) => {
          const x = m.left + i * step;
          const above = i % 2 === 0;
          return (
            <g key={e.date}>
              <circle cx={x} cy={m.top} r="7" fill={i === events.length - 1 ? "#b45309" : "#4338ca"} />
              <text
                x={x}
                y={above ? m.top - 18 : m.top + 26}
                textAnchor={i === 0 ? "start" : i === events.length - 1 ? "end" : "middle"}
                fontSize="12"
                fontWeight="700"
                fill="#0f172a"
              >
                {fmt(e.date)}
              </text>
              <foreignObject
                x={Math.max(4, x - 110)}
                y={above ? m.top - 74 : m.top + 34}
                width={220}
                height={56}
              >
                <div
                  // @ts-expect-error — xmlns is valid inside foreignObject
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.3,
                    color: "#64748b",
                    fontFamily: "inherit",
                    textAlign: i === 0 ? "left" : "center",
                  }}
                >
                  {e.what.slice(0, 190)}
                </div>
              </foreignObject>
            </g>
          );
        })}
        <text x={m.left} y={H - 8} fontSize="10.5" fill="#94a3b8">
          8 CFR 264.1 · Form G-325R · verified {A_NUMBER_VERIFIED}
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-400">
        Source: USCIS, Alien Registration Requirement, and the Federal Register
        documents it links. As of {A_NUMBER_VERIFIED}. Most readers of this page
        are already registered and have nothing to file — the decision table
        above the timeline is the part that applies to you.
      </figcaption>
    </figure>
  );
}
