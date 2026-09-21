/**
 * Old rule vs current rule, keyed on the one date that decides it: when USCIS
 * received the renewal. Inline SVG, no library.
 */

import { REPEAL_DATE, OLD_EXTENSION_DAYS } from "@/lib/calc/eadAutoExtension";

export default function OldVsNewRuleDiagram() {
  const W = 720;
  const H = 330;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Two paths depending on whether USCIS received your EAD renewal before or on/after ${REPEAL_DATE}. Written out below the diagram.`}
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="ead-arrow"
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

        <rect x="8" y="8" width={W - 16} height="58" rx="10" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="2" />
        <text x="28" y="34" fontSize="16" fontWeight="700" fill="#0f172a">
          When did USCIS RECEIVE your renewal?
        </text>
        <text x="28" y="55" fontSize="13" fill="#475569">
          The receipt date on your I-797C — not the day you posted it.
        </text>

        <path d={`M ${W * 0.27} 66 L ${W * 0.27} 92`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ead-arrow)" />
        <path d={`M ${W * 0.73} 66 L ${W * 0.73} 92`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ead-arrow)" />
        <text x={W * 0.27 - 58} y="85" fontSize="13" fontWeight="700" fill="#047857">
          BEFORE {REPEAL_DATE}
        </text>
        <text x={W * 0.73 - 30} y="85" fontSize="13" fontWeight="700" fill="#be123c">
          ON / AFTER
        </text>

        <rect x="16" y="96" width={W / 2 - 28} height="112" rx="10" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="2" />
        <text x="36" y="124" fontSize="15.5" fontWeight="700" fill="#0f172a">
          Old rule — 8 CFR 274a.13(d)
        </text>
        <text x="36" y="148" fontSize="13" fill="#475569">
          Up to {OLD_EXTENSION_DAYS} days past your card&apos;s
        </text>
        <text x="36" y="166" fontSize="13" fill="#475569">
          expiry. The expired card plus the
        </text>
        <text x="36" y="184" fontSize="13" fill="#475569">
          I-797C is acceptable I-9 evidence.
        </text>

        <rect x={W / 2 + 12} y="96" width={W / 2 - 28} height="112" rx="10" fill="#fff1f2" stroke="#fda4af" strokeWidth="2" />
        <text x={W / 2 + 32} y="124" fontSize="15.5" fontWeight="700" fill="#0f172a">
          Current rule — § 274a.13(e)
        </text>
        <text x={W / 2 + 32} y="148" fontSize="13" fill="#475569">
          No extension at all. Authorisation
        </text>
        <text x={W / 2 + 32} y="166" fontSize="13" fill="#475569">
          ends on the card&apos;s expiry date, and
        </text>
        <text x={W / 2 + 32} y="184" fontSize="13" fontWeight="600" fill="#be123c">
          the receipt notice does not help.
        </text>

        <path d={`M ${W / 2} 208 L ${W / 2} 232`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ead-arrow)" />

        <rect x="16" y="236" width={W - 32} height="82" rx="10" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="36" y="262" fontSize="15.5" fontWeight="700" fill="#92400e">
          Two things the repeal did NOT touch
        </text>
        <text x="36" y="284" fontSize="13" fill="#78350f">
          • A timely-filed STEM OPT extension — 8 CFR 274a.12(b)(6)(iv), up to 180 days.
        </text>
        <text x="36" y="304" fontSize="13" fill="#78350f">
          • E and L dependent spouses, authorised incident to status — they need no EAD.
        </text>
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            The question is when USCIS <em>received</em> your renewal — the
            receipt date on the I-797C, not the day you posted it.
          </li>
          <li>
            Received before {REPEAL_DATE}: the old rule at 8 CFR 274a.13(d)
            applies and the card is extended up to {OLD_EXTENSION_DAYS} days past
            its expiry, with the expired card plus the receipt notice acceptable
            as Form I-9 evidence.
          </li>
          <li>
            Received on or after that date: § 274a.13(e) applies, there is no
            automatic extension, authorisation ends on the expiry date printed on
            the card, and the receipt notice does not help.
          </li>
          <li>
            Two things the repeal did not touch: a timely-filed STEM OPT
            extension, which authorises work for up to 180 days past expiry under
            a separate provision; and E and L dependent spouses, who are
            employment authorised incident to status and do not need an EAD at
            all.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
