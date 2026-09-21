/**
 * The escalation ladder — what to do when no expedite criterion applies.
 *
 * Two visuals, both inline SVG with a viewBox and `h-auto w-full` (the
 * production CSP blocks CDN chart libraries, and a pixel width on the <svg>
 * would beat the class and overflow a 360px phone).
 *
 * A. EscalationLadderDiagram — the four rungs, in unlock order, with the
 *    prerequisite that gates each one and the exit at every level.
 * B. PremiumCostSpeedChart — premium processing fee against the guaranteed
 *    business days, by form, so the "is premium worth it" question has a
 *    picture. Forms with no premium option are drawn as an absence, because
 *    that absence is the whole reason the ladder exists.
 */

import {
  ESCALATION_FACTS,
  ESCALATION_RUNGS,
} from "@/data/expediteData";
import { premiumProcessing } from "@/lib/premiumProcessing";

/* ══════════════════ A. The ladder ══════════════════ */

const RUNG_FILL = ["#eef2ff", "#e0f2fe", "#ecfdf5", "#fef3c7"];
const RUNG_STROKE = ["#a5b4fc", "#7dd3fc", "#6ee7b7", "#fcd34d"];

export function EscalationLadderDiagram() {
  const W = 720;
  const rungH = 82;
  const gapY = 22;
  const top = 58;
  const H = top + ESCALATION_RUNGS.length * (rungH + gapY) + 40;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="The four escalation rungs for a delayed USCIS case, in the order they unlock. Written out in full below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="esc-arrow"
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

        <text x="8" y="22" fontSize="15" fontWeight="700" fill="#0f172a">
          No expedite criterion applies. The case is just slow.
        </text>
        <text x="8" y="42" fontSize="13" fill="#475569">
          Work down the ladder. Stop at the rung that answers you.
        </text>

        {ESCALATION_RUNGS.map((r, i) => {
          const y = top + i * (rungH + gapY);
          const isLast = i === ESCALATION_RUNGS.length - 1;
          return (
            <g key={r.id}>
              <rect
                x={8}
                y={y}
                width={W - 130}
                height={rungH}
                rx={10}
                fill={RUNG_FILL[i]}
                stroke={RUNG_STROKE[i]}
                strokeWidth={1.5}
              />
              <circle cx={38} cy={y + rungH / 2} r={16} fill="#0f172a" />
              <text
                x={38}
                y={y + rungH / 2 + 6}
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="#ffffff"
              >
                {r.step}
              </text>
              <text x={68} y={y + 26} fontSize="15" fontWeight="700" fill="#0f172a">
                {r.name}
              </text>
              <text x={68} y={y + 47} fontSize="12.5" fill="#475569">
                Decided by: {r.decider}
              </text>
              <text x={68} y={y + 66} fontSize="12.5" fill="#475569">
                Cost: {r.cost}
              </text>

              {/* the exit at every rung */}
              <line
                x1={W - 122}
                y1={y + rungH / 2}
                x2={W - 86}
                y2={y + rungH / 2}
                stroke="#94a3b8"
                strokeWidth="1.5"
                markerEnd="url(#esc-arrow)"
              />
              <text
                x={W - 80}
                y={y + rungH / 2 - 2}
                fontSize="12"
                fontWeight="600"
                fill="#047857"
              >
                Answered?
              </text>
              <text x={W - 80} y={y + rungH / 2 + 14} fontSize="12" fill="#475569">
                Stop here.
              </text>

              {!isLast && (
                <line
                  x1={38}
                  y1={y + rungH}
                  x2={38}
                  y2={y + rungH + gapY}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  markerEnd="url(#esc-arrow)"
                />
              )}
            </g>
          );
        })}

        <text x="8" y={H - 14} fontSize="12.5" fill="#b45309">
          None of the four is an expedite. None of them reorders the queue.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {ESCALATION_RUNGS.map((r) => (
            <li key={r.id}>
              <strong className="font-semibold text-ink-700">{r.name}.</strong>{" "}
              {r.prerequisite} Decided by {r.decider.toLowerCase()}. Cost:{" "}
              {r.cost.toLowerCase()}.
            </li>
          ))}
          <li>
            Stop at whichever rung produces an answer. Each one has a real
            prerequisite, so they are not interchangeable and they are not a
            queue you join four times.
          </li>
        </ol>
        Sources: USCIS Policy Manual Vol. 1 Pt. A Ch. 4, DHS CIS Ombudsman case
        assistance, 5 U.S.C. § 552a, 28 U.S.C. § 1361 and § 1914. Verified{" "}
        {ESCALATION_FACTS.lastVerified}.
      </figcaption>
    </figure>
  );
}

/* ══════════════════ B. Premium: fee against guaranteed days ══════════════ */

/** Parse the guaranteed business days out of the published timeline string. */
function guaranteedDays(timeline: string): number | null {
  const m = timeline.match(/(\d+)\s*business days/);
  return m ? Number(m[1]) : null;
}

/** Parse the fee out of the published fee string. */
function feeDollars(fee: string): number | null {
  const m = fee.match(/\$([\d,]+)/);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

export function PremiumCostSpeedChart() {
  const rows = premiumProcessing.items
    .map((it) => ({
      form: it.form,
      category: it.category,
      fee: it.eligible ? feeDollars(it.feeDisplay) : null,
      days: it.eligible ? guaranteedDays(it.timelineDisplay) : null,
      eligible: it.eligible,
    }))
    .filter((r) => !r.eligible || (r.fee !== null && r.days !== null));

  const W = 720;
  const rowH = 54;
  const top = 44;
  const H = top + rows.length * rowH + 52;
  const labelW = 178;
  const plotX = labelW + 14;
  const plotW = W - plotX - 118;
  const maxFee = Math.max(...rows.map((r) => r.fee ?? 0), 1);

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Horizontal bar chart of USCIS premium processing fees by form, each annotated with the guaranteed number of business days. Forms with no premium option are shown with no bar."
        className="h-auto w-full"
      >
        <text x="8" y="20" fontSize="14" fontWeight="700" fill="#0f172a">
          Premium processing: what it costs, and what it guarantees
        </text>
        <text x="8" y="37" fontSize="12" fill="#64748b">
          Fee schedule effective {premiumProcessing.effectiveDate}. The guarantee
          is USCIS action, never approval.
        </text>

        {rows.map((r, i) => {
          const y = top + i * rowH;
          const barY = y + 14;
          const barH = 22;
          const w = r.fee ? Math.max(3, (r.fee / maxFee) * plotW) : 0;
          return (
            <g key={`${r.form}-${i}`}>
              <text x={8} y={barY + 15} fontSize="12.5" fontWeight="700" fill="#0f172a">
                {r.form}
              </text>
              <text x={54} y={barY + 15} fontSize="11.5" fill="#475569">
                {r.category.length > 34
                  ? `${r.category.slice(0, 33)}…`
                  : r.category}
              </text>
              {r.eligible ? (
                <>
                  <rect
                    x={plotX}
                    y={barY}
                    width={w}
                    height={barH}
                    rx={4}
                    fill={r.days && r.days <= 15 ? "#4338ca" : "#0284c7"}
                  />
                  <text
                    x={plotX + w + 8}
                    y={barY + 16}
                    fontSize="12.5"
                    fontWeight="700"
                    fill="#0f172a"
                  >
                    ${r.fee?.toLocaleString("en-US")}
                  </text>
                  <text
                    x={plotX + w + 8}
                    y={barY + 32}
                    fontSize="11.5"
                    fill="#64748b"
                  >
                    {r.days} business days
                  </text>
                </>
              ) : (
                <>
                  <line
                    x1={plotX}
                    y1={barY + barH / 2}
                    x2={plotX + 58}
                    y2={barY + barH / 2}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />
                  <text
                    x={plotX + 66}
                    y={barY + 16}
                    fontSize="12.5"
                    fontWeight="700"
                    fill="#b45309"
                  >
                    No premium option
                  </text>
                  <text x={plotX + 66} y={barY + 32} fontSize="11.5" fill="#64748b">
                    Expedite, then the ladder
                  </text>
                </>
              )}
            </g>
          );
        })}

        <line
          x1={plotX}
          y1={top - 6}
          x2={plotX}
          y2={H - 40}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        <text x="8" y={H - 16} fontSize="11.5" fill="#64748b">
          Darker bars are the 15-business-day guarantee; lighter bars are 30.
          Source: USCIS Form I-907. Verified {premiumProcessing.lastVerified}.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>{" "}
        {rows
          .map((r) =>
            r.eligible
              ? `${r.form} (${r.category}): $${r.fee?.toLocaleString(
                  "en-US"
                )} for a ${r.days}-business-day guarantee`
              : `${r.form} (${r.category}): no premium processing option exists`
          )
          .join("; ")}
        . The guarantee is that USCIS acts — issues an approval, a denial, a
        request for evidence or a notice of intent to deny — within the window,
        not that it approves. Source: USCIS Form I-907, fee schedule effective{" "}
        {premiumProcessing.effectiveDate}.
      </figcaption>
    </figure>
  );
}
