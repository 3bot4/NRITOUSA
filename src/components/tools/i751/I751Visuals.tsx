/**
 * Two more I-751 visuals for the depth pass.
 *
 * A. ExtensionCoverageChart — the two-year card against the 48-month receipt
 *    extension, drawn to scale. This is the figure the competitor gets wrong
 *    (they say 24 months) and the one that decides whether somebody can renew
 *    a driver's licence or re-enter the US while the petition is pending.
 *    Every number comes from I751_FACTS.
 *
 * B. WaiverGroundDiagram — which basis you file on, and the fact that only one
 *    branch of it is bound by the 90-day window. Filers who assume a missed
 *    window has shut them out are the reason this exists.
 *
 * Inline SVG: the production CSP blocks CDN chart libraries.
 */

import { I751_FACTS, I751_WAIVER_GROUNDS } from "@/data/i751Data";

/* ════════════ A. Card validity against the receipt extension ════════════ */

export function ExtensionCoverageChart() {
  const cardMonths = I751_FACTS.conditionalYears * 12;
  const extMonths = I751_FACTS.extensionMonths;
  const totalMonths = cardMonths + extMonths;

  const W = 720;
  const H = 258;
  const labelW = 132;
  const plotX = labelW + 8;
  const plotW = W - plotX - 30;
  const x = (m: number) => plotX + (m / totalMonths) * plotW;

  const windowStartMonths = cardMonths - I751_FACTS.windowDays / 30.44;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Timeline chart. The conditional green card is valid for ${I751_FACTS.conditionalYears} years. The I-751 receipt notice then extends that status for a further ${extMonths} months. Written out below.`}
        className="h-auto w-full"
      >
        <text x="8" y="20" fontSize="14" fontWeight="700" fill="#0f172a">
          The card runs out long before the petition is decided
        </text>
        <text x="8" y="37" fontSize="12" fill="#64748b">
          Which is why the receipt notice, with the expired card, is what
          evidences your status once you have filed.
        </text>

        {[0, 12, 24, 36, 48, 60, 72].filter((m) => m <= totalMonths).map((m) => (
          <g key={m}>
            <line x1={x(m)} y1={52} x2={x(m)} y2={196} stroke="#e2e8f0" strokeWidth="1" />
            <text x={x(m)} y={214} textAnchor="middle" fontSize="11.5" fill="#94a3b8">
              {m === 0 ? "card issued" : `yr ${m / 12}`}
            </text>
          </g>
        ))}

        {/* the card itself */}
        <text x={8} y={86} fontSize="12.5" fontWeight="700" fill="#0f172a">
          2-year card
        </text>
        <rect x={x(0)} y={68} width={x(cardMonths) - x(0)} height={26} rx={4} fill="#4338ca" />
        <text x={x(0) + 10} y={86} fontSize="12" fontWeight="700" fill="#ffffff">
          Valid — {cardMonths} months
        </text>

        {/* the filing window */}
        <text x={8} y={132} fontSize="12.5" fontWeight="700" fill="#0f172a">
          Joint-filing window
        </text>
        <text x={8} y={148} fontSize="11" fill="#64748b">
          joint petitions only
        </text>
        <rect
          x={x(windowStartMonths)}
          y={114}
          width={Math.max(4, x(cardMonths) - x(windowStartMonths))}
          height={26}
          rx={4}
          fill="#f59e0b"
        />
        <text x={x(cardMonths) + 8} y={132} fontSize="11.5" fontWeight="600" fill="#b45309">
          {I751_FACTS.windowDays} days
        </text>

        {/* the extension */}
        <text x={8} y={178} fontSize="12.5" fontWeight="700" fill="#0f172a">
          Receipt notice
        </text>
        <rect
          x={x(cardMonths)}
          y={160}
          width={x(totalMonths) - x(cardMonths)}
          height={26}
          rx={4}
          fill="#059669"
        />
        <text x={x(cardMonths) + 10} y={178} fontSize="12" fontWeight="700" fill="#ffffff">
          Extends status and work authorisation — {extMonths} months
        </text>

        <line
          x1={x(cardMonths)}
          y1={60}
          x2={x(cardMonths)}
          y2={196}
          stroke="#0f172a"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        <text x="8" y={H - 16} fontSize="11.5" fill="#64748b">
          {extMonths}-month extension, in force since {I751_FACTS.extensionSince}.
          Source: USCIS. Verified {I751_FACTS.lastVerified}.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong> the
        conditional card is valid for {I751_FACTS.conditionalYears} years. A
        joint petition must be filed in the {I751_FACTS.windowDays} days
        immediately before conditional residence expires — the amber band; that
        band does not govern an individual or waiver filing. Once USCIS accepts
        the petition it issues a receipt notice extending conditional permanent
        resident status and employment authorisation for {extMonths} months
        beyond the card&apos;s expiry date, a length in force since{" "}
        {I751_FACTS.extensionSince}. Carry the receipt notice with the expired
        card: while that extension is valid, together they are your temporary
        evidence of status for work, for travel and at the DMV. If the extension
        itself runs out before a decision, ask USCIS for current temporary proof
        of permanent resident status.
      </figcaption>
    </figure>
  );
}

/* ══════════════ B. Which basis am I filing on? ══════════════ */

export function WaiverGroundDiagram() {
  const W = 720;
  const boxW = 330;
  const groundH = 54;
  const top = 128;
  const H = top + I751_WAIVER_GROUNDS.length * (groundH + 10) + 58;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Decision diagram: joint filing versus individual filing on the four waiver grounds, and which of them the 90-day joint-filing window governs. Written out below."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="i751w-arrow"
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

        <rect x={W / 2 - 190} y={8} width={380} height={48} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x={W / 2} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">
          Are you still married, and will both of you sign?
        </text>
        <text x={W / 2} y={48} textAnchor="middle" fontSize="12" fill="#475569">
          This is the only question that sets your deadline.
        </text>

        {/* Joint branch */}
        <line x1={W / 2 - 100} y1={56} x2={180} y2={74} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#i751w-arrow)" />
        <rect x={8} y={78} width={boxW} height={groundH} rx={10} fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x={24} y={100} fontSize="13.5" fontWeight="700" fill="#0f172a">
          Yes — joint filing
        </text>
        <text x={24} y={118} fontSize="12" fill="#b45309">
          Bound by the {I751_FACTS.windowDays}-day window. Miss it and status terminates.
        </text>

        {/* Waiver branch */}
        <line x1={W / 2 + 100} y1={56} x2={W - 190} y2={74} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#i751w-arrow)" />
        <rect x={W - boxW - 8} y={78} width={boxW} height={groundH} rx={10} fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
        <text x={W - boxW + 8} y={100} fontSize="13.5" fontWeight="700" fill="#0f172a">
          No — file individually / request a waiver
        </text>
        <text x={W - boxW + 8} y={118} fontSize="12" fill="#047857">
          A different timing rule applies — see the note below.
        </text>

        {I751_WAIVER_GROUNDS.map((g, i) => {
          const y = top + 10 + i * (groundH + 10);
          return (
            <g key={g.title}>
              <line
                x1={W - boxW + 12}
                y1={i === 0 ? 132 : y - 10}
                x2={W - boxW + 12}
                y2={y + 20}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <line
                x1={W - boxW + 12}
                y1={y + 20}
                x2={W - boxW + 30}
                y2={y + 20}
                stroke="#94a3b8"
                strokeWidth="1.5"
                markerEnd="url(#i751w-arrow)"
              />
              <rect
                x={W - boxW + 36}
                y={y}
                width={boxW - 44}
                height={groundH - 14}
                rx={8}
                fill="#ffffff"
                stroke="#a7f3d0"
                strokeWidth="1.5"
              />
              <text x={W - boxW + 50} y={y + 25} fontSize="12.5" fill="#0f172a">
                {g.short}
              </text>
            </g>
          );
        })}

        <text x={8} y={H - 28} fontSize="12.5" fontWeight="700" fill="#0f172a">
          The mistake this diagram exists to stop:
        </text>
        <text x={8} y={H - 10} fontSize="12" fill="#475569">
          assuming a missed window has shut you out. It is not the rule that governs a waiver filing.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            If you are still married to the petitioner and both of you will sign,
            you file jointly — and you are bound by the{" "}
            {I751_FACTS.windowDays}-day window immediately before the card
            expires.
          </li>
          <li>
            If you are not, you may file individually, requesting a waiver of the
            joint filing requirement. The {I751_FACTS.windowDays}-day window is
            not the governing rule on that route: the Form I-751 instructions say
            an eligible petition may be filed at any time after conditional
            resident status is granted and before the person is removed from the
            United States. That is the general rule, not a finding that any
            particular petition is timely — if your status has already expired or
            you are in removal proceedings, get individualised advice from a
            qualified immigration lawyer before filing.
          </li>
          {I751_WAIVER_GROUNDS.map((g) => (
            <li key={g.title}>
              <strong className="font-semibold text-ink-700">{g.title}.</strong>{" "}
              {g.detail}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
