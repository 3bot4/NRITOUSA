/**
 * Session score chart and the naturalisation-path diagram for the civics
 * practice test. Inline SVG, no library — the production CSP allows scripts
 * from self plus analytics only.
 */

import type { CategoryScore } from "@/lib/citizenshipTest";
import { CIVICS, listCategories } from "@/lib/citizenshipTest";

export function CategoryScoreChart({ rows }: { rows: CategoryScore[] }) {
  if (rows.length === 0) return null;

  const W = 700;
  const rowH = 46;
  const m = { top: 10, right: 60, bottom: 10, left: 8 };
  const H = rows.length * rowH + m.top + m.bottom;
  const barX = 240;
  const barMax = W - barX - m.right;

  const colour = (p: number) =>
    p >= 80 ? "#059669" : p >= 60 ? "#d97706" : "#e11d48";

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Your score by topic this session: ${rows
          .map((r) => `${r.label} ${r.correct} of ${r.asked}`)
          .join("; ")}.`}
        className="h-auto w-full"
      >
        {rows.map((r, i) => {
          const y = m.top + i * rowH;
          const w = Math.max(3, (r.percent / 100) * barMax);
          const label = r.label.length > 32 ? `${r.label.slice(0, 30)}…` : r.label;
          return (
            <g key={r.id}>
              <text x={m.left} y={y + 26} fontSize="14" fill="#334155">
                {label}
              </text>
              <rect
                x={barX}
                y={y + 12}
                width={barMax}
                height={20}
                rx="5"
                fill="#e2e8f0"
              />
              <rect
                x={barX}
                y={y + 12}
                width={w}
                height={20}
                rx="5"
                fill={colour(r.percent)}
              />
              <text
                x={barX + barMax + 8}
                y={y + 27}
                fontSize="14"
                fontWeight="700"
                fill="#0f172a"
              >
                {r.correct}/{r.asked}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs text-ink-400">
        This session only, weakest topic first. Nothing is saved — reload the
        page and it is gone.
      </figcaption>
    </figure>
  );
}

/* ══════════════ Naturalisation path diagram ══════════════ */

const STEPS = [
  { t: "File Form N-400", d: "Online or on paper, once you meet the residence requirement." },
  { t: "Biometrics", d: "Fingerprints and photo at an application support centre." },
  {
    t: "Interview: English + civics",
    d: `Reading one of three sentences, writing one of three, speaking assessed through the interview, and ${CIVICS.format.questionsAsked} civics questions — ${CIVICS.format.correctToPass} correct to pass.`,
  },
  { t: "Decision", d: "Granted, continued for more evidence or a re-test, or denied." },
  { t: "Oath of Allegiance", d: "You are a US citizen from the moment you take the oath." },
];

export function NaturalisationPathDiagram() {
  const W = 700;
  const rowH = 64;
  const gap = 16;
  const retestH = 96;
  const H = STEPS.length * (rowH + gap) + retestH + 16;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="The naturalisation path from filing Form N-400 to the oath ceremony, including the re-test branch. Written out below the diagram."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="nat-arrow"
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
          const y = 8 + i * (rowH + gap);
          const isTest = i === 2;
          const isEnd = i === STEPS.length - 1;
          return (
            <g key={s.t}>
              <rect
                x="8"
                y={y}
                width={W - 16}
                height={rowH}
                rx="10"
                fill={isEnd ? "#ecfdf5" : isTest ? "#eef2ff" : "#f8fafc"}
                stroke={isEnd ? "#6ee7b7" : isTest ? "#a5b4fc" : "#e2e8f0"}
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
                {s.t}
              </text>
              <text x="58" y={y + 47} fontSize="13.5" fill="#475569">
                {s.d.length > 96 ? `${s.d.slice(0, 94)}…` : s.d}
              </text>
              {!isEnd && (
                <path
                  d={`M 34 ${y + rowH} L 34 ${y + rowH + gap - 2}`}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#nat-arrow)"
                />
              )}
            </g>
          );
        })}

        <g>
          <rect
            x="8"
            y={STEPS.length * (rowH + gap) + 12}
            width={W - 16}
            height={retestH - 20}
            rx="10"
            fill="#fffbeb"
            stroke="#fcd34d"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x="28"
            y={STEPS.length * (rowH + gap) + 38}
            fontSize="16"
            fontWeight="700"
            fill="#92400e"
          >
            Branch — if you fail a portion
          </text>
          <text x="28" y={STEPS.length * (rowH + gap) + 59} fontSize="13.5" fill="#78350f">
            You get {CIVICS.interview.attempts} attempts. You are re-tested only on the part you
            failed,
          </text>
          <text x="28" y={STEPS.length * (rowH + gap) + 76} fontSize="13.5" fill="#78350f">
            between {CIVICS.interview.retestWindowDays[0]} and{" "}
            {CIVICS.interview.retestWindowDays[1]} days after the first interview.
          </text>
        </g>
      </svg>

      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">The same path in words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {STEPS.map((s) => (
            <li key={s.t}>
              <strong className="font-semibold text-ink-700">{s.t}.</strong> {s.d}
            </li>
          ))}
          <li>
            <strong className="font-semibold text-ink-700">
              If you fail a portion:
            </strong>{" "}
            you get {CIVICS.interview.attempts} attempts in total, and you are
            re-tested only on the part you failed, between{" "}
            {CIVICS.interview.retestWindowDays[0]} and{" "}
            {CIVICS.interview.retestWindowDays[1]} days after the first interview.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}

/* ══════════ C. What the 128 questions actually cover ══════════ */

/**
 * A study-weighting chart, not a decoration. The 20 questions you are asked are
 * drawn from the pool, so the pool's own shape tells you where your revision
 * time should go — and it is far more lopsided than people expect. Built by
 * walking the question bank, so a new USCIS edition cannot leave it stale.
 */
export function PoolCompositionChart() {
  const cats = listCategories();
  const sections: { name: string; count: number; fill: string }[] = [];
  for (const c of cats) {
    const found = sections.filter((s) => s.name === c.section)[0];
    if (found) found.count += c.count;
    else
      sections.push({
        name: c.section,
        count: c.count,
        fill: ["#4338ca", "#0284c7", "#059669"][sections.length % 3],
      });
  }

  const total = CIVICS.format.poolSize as number;
  const asked = CIVICS.format.questionsAsked as number;

  const W = 720;
  const barY = 56;
  const barH = 40;
  const plotX = 8;
  const plotW = W - 16;
  const rowTop = 136;
  const rowH = 30;
  const H = rowTop + cats.length * rowH + 44;
  const maxCat = Math.max(...cats.map((c) => c.count));

  let cursor = 0;

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Composition of the ${total}-question civics pool by section and category. Written out in full below.`}
        className="h-auto w-full"
      >
        <text x="8" y="20" fontSize="14" fontWeight="700" fill="#0f172a">
          Where the {total} questions actually are
        </text>
        <text x="8" y="37" fontSize="12" fill="#64748b">
          Your {asked} questions are drawn from this pool, so this is also where
          your study time should go.
        </text>

        {sections.map((s) => {
          const w = (s.count / total) * plotW;
          const x = plotX + cursor;
          cursor += w;
          return (
            <g key={s.name}>
              <rect x={x} y={barY} width={w} height={barH} rx={4} fill={s.fill} />
              <text
                x={x + w / 2}
                y={barY + 18}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="700"
                fill="#ffffff"
              >
                {s.count}
              </text>
              <text
                x={x + w / 2}
                y={barY + 33}
                textAnchor="middle"
                fontSize="10.5"
                fill="#ffffff"
                opacity={0.9}
              >
                {Math.round((s.count / total) * 100)}%
              </text>
              <text
                x={x + w / 2}
                y={barY + barH + 16}
                textAnchor="middle"
                fontSize="11"
                fill="#475569"
              >
                {s.name.length > 22 ? `${s.name.slice(0, 21)}…` : s.name}
              </text>
            </g>
          );
        })}

        <text x="8" y={rowTop - 10} fontSize="12.5" fontWeight="700" fill="#0f172a">
          Broken down by topic
        </text>

        {cats.map((c, i) => {
          const y = rowTop + i * rowH;
          const w = (c.count / maxCat) * 300;
          const fill = sections.filter((s) => s.name === c.section)[0]?.fill ?? "#4338ca";
          return (
            <g key={c.id}>
              <text x={8} y={y + 16} fontSize="11.5" fill="#475569">
                {c.label.length > 46 ? `${c.label.slice(0, 45)}…` : c.label}
              </text>
              <rect x={368} y={y + 4} width={Math.max(2, w)} height={16} rx={3} fill={fill} />
              <text x={368 + w + 7} y={y + 17} fontSize="11.5" fontWeight="700" fill="#0f172a">
                {c.count}
              </text>
            </g>
          );
        })}

        <text x="8" y={H - 12} fontSize="11.5" fill="#64748b">
          Source: USCIS {CIVICS.sourceEdition}, counted from the question bank.
          Verified {CIVICS.lastVerified}.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>{" "}
        {sections
          .map(
            (s) =>
              `${s.name}: ${s.count} questions (${Math.round(
                (s.count / total) * 100
              )}%)`
          )
          .join("; ")}
        . By topic:{" "}
        {cats.map((c) => `${c.label} — ${c.count}`).join("; ")}. The practical
        reading: {sections[0]?.name.toLowerCase()} is more than half the pool, so
        a study plan that gives each topic equal time is spending it in the
        wrong places.
      </figcaption>
    </figure>
  );
}
