/**
 * Expedite decision tree. Inline SVG, no library.
 *
 * The premium-processing question comes first because it decides most cases:
 * where premium is available, USCIS will not consider an expedite request at
 * all (unless the petitioner is an IRS-designated nonprofit).
 */

export default function ExpediteDecisionTree() {
  const W = 720;
  const H = 430;

  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    stroke: string
  ) => ({ x, y, width: w, height: h, rx: 10, fill, stroke, strokeWidth: 1.5 });

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Decision tree: whether to use premium processing or a criteria-based expedite request. Written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="ex-arrow"
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

        <rect {...box(8, 8, W - 16, 56, "#eef2ff", "#a5b4fc")} />
        <text x="28" y="34" fontSize="16" fontWeight="700" fill="#0f172a">
          Is premium processing available for this form and category?
        </text>
        <text x="28" y="54" fontSize="13" fill="#475569">
          Ask this first — it settles most cases before any criterion matters.
        </text>

        <path d={`M ${W * 0.27} 64 L ${W * 0.27} 92`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ex-arrow)" />
        <path d={`M ${W * 0.73} 64 L ${W * 0.73} 92`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ex-arrow)" />
        <text x={W * 0.27 - 26} y="84" fontSize="13" fontWeight="700" fill="#b45309">
          YES
        </text>
        <text x={W * 0.73 + 10} y="84" fontSize="13" fontWeight="700" fill="#047857">
          NO
        </text>

        <rect {...box(16, 96, W / 2 - 28, 108, "#fffbeb", "#fcd34d")} />
        <text x="36" y="122" fontSize="15.5" fontWeight="700" fill="#0f172a">
          Use premium processing
        </text>
        <text x="36" y="144" fontSize="13" fill="#475569">
          USCIS will NOT consider an expedite
        </text>
        <text x="36" y="162" fontSize="13" fill="#475569">
          request where premium exists.
        </text>
        <text x="36" y="186" fontSize="12.5" fontWeight="600" fill="#92400e">
          Exception: IRS-designated nonprofits.
        </text>

        <rect {...box(W / 2 + 12, 96, W / 2 - 28, 108, "#ecfdf5", "#6ee7b7")} />
        <text x={W / 2 + 32} y="122" fontSize="15.5" fontWeight="700" fill="#0f172a">
          An expedite request is open to you
        </text>
        <text x={W / 2 + 32} y="144" fontSize="13" fill="#475569">
          Now check whether one of the five
        </text>
        <text x={W / 2 + 32} y="162" fontSize="13" fill="#475569">
          criteria actually applies.
        </text>
        <text x={W / 2 + 32} y="186" fontSize="12.5" fontWeight="600" fill="#047857">
          Evidence decides it, not the story.
        </text>

        <path d={`M ${W * 0.73} 204 L ${W * 0.73} 230`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ex-arrow)" />

        <rect {...box(16, 234, W - 32, 96, "#f8fafc", "#e2e8f0")} />
        <text x="36" y="260" fontSize="15.5" fontWeight="700" fill="#0f172a">
          The five criteria
        </text>
        {[
          "Severe financial loss to a company or person",
          "Emergencies and urgent humanitarian situations",
          "Nonprofit furthering US cultural or social interests",
          "US government interests",
          "Clear USCIS error",
        ].map((c, i) => (
          <text key={c} x={36} y={280 + i * 15} fontSize="12.5" fill="#475569">
            • {c}
          </text>
        ))}

        <path d={`M ${W / 2} 330 L ${W / 2} 354`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#ex-arrow)" />

        <rect {...box(16, 358, W - 32, 60, "#eef2ff", "#a5b4fc")} />
        <text x="36" y="384" fontSize="15.5" fontWeight="700" fill="#0f172a">
          Submit with the document that proves it
        </text>
        <text x="36" y="405" fontSize="13" fill="#475569">
          Online account · Contact Center · Ask Emma · field office for some case types
        </text>
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            Ask first whether premium processing exists for your form and
            category.
          </li>
          <li>
            If it does, USCIS will not consider an expedite request at all —
            pay for premium instead. The only exception is an IRS-designated
            nonprofit petitioner.
          </li>
          <li>
            If it does not, an expedite request is open to you, and the question
            becomes whether one of the five criteria applies: severe financial
            loss to a company or person; an emergency or urgent humanitarian
            situation; a nonprofit furthering US cultural or social interests;
            US government interests; or clear USCIS error.
          </li>
          <li>
            Submit through your USCIS online account, the Contact Center, Ask
            Emma, or a field office appointment for the case types that require
            one — and attach the document that proves the urgency rather than
            describing it.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
