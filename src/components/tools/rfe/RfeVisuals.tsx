/**
 * Two more RFE visuals for the depth pass.
 *
 * A. RfeResponseWindowChart — the response periods as a bar, because "84 days,
 *    30 for two forms, plus 3 if mailed, and no extensions" is four rules that
 *    a reader has to hold in their head at once. Every number comes from
 *    RFE_RULES, which comes from the Policy Manual.
 *
 * B. RfeOrNotDiagram — what an officer may do INSTEAD of issuing an RFE, after
 *    the 5 August 2026 policy change. The whole point of the change is that the
 *    RFE branch is no longer guaranteed, and that is a shape, not a sentence.
 *
 * Inline SVG only: the production CSP blocks CDN chart libraries.
 */

import { RFE_RULES } from "@/data/rfeData";

/* ═════════════════ A. The response windows ═════════════════ */

export function RfeResponseWindowChart() {
  const rows = [
    {
      label: "Most forms",
      sub: "The standard maximum response period",
      base: RFE_RULES.maxDays,
      mail: RFE_RULES.mailGraceDays,
      fill: "#4338ca",
    },
    {
      label: RFE_RULES.shortForms.join(" and "),
      sub: "The short-period forms",
      base: RFE_RULES.shortFormDays,
      mail: RFE_RULES.mailGraceDays,
      fill: "#0284c7",
    },
  ];

  const W = 720;
  const H = 230;
  const labelW = 150;
  const plotX = labelW + 12;
  const plotW = W - plotX - 96;
  const max = RFE_RULES.maxDays + RFE_RULES.mailGraceDays;
  const x = (d: number) => (d / max) * plotW;

  const ticks = [0, 30, 60, 87];

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart of USCIS RFE response periods. Most forms get ${RFE_RULES.maxDays} days, rising to ${
          RFE_RULES.maxDays + RFE_RULES.mailGraceDays
        } when the notice is mailed. ${RFE_RULES.shortForms.join(
          " and "
        )} get ${RFE_RULES.shortFormDays} days. Written out below.`}
        className="h-auto w-full"
      >
        <text x="8" y="20" fontSize="14" fontWeight="700" fill="#0f172a">
          How long you actually have
        </text>
        <text x="8" y="37" fontSize="12" fill="#64748b">
          Measured from the date printed on the notice — never from the day it
          arrived.
        </text>

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={plotX + x(t)}
              y1={52}
              x2={plotX + x(t)}
              y2={H - 46}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={plotX + x(t)}
              y={H - 30}
              textAnchor="middle"
              fontSize="11.5"
              fill="#94a3b8"
            >
              {t}d
            </text>
          </g>
        ))}

        {rows.map((r, i) => {
          const y = 62 + i * 64;
          const barH = 26;
          return (
            <g key={r.label}>
              <text x={8} y={y + 16} fontSize="12.5" fontWeight="700" fill="#0f172a">
                {r.label}
              </text>
              <text x={8} y={y + 32} fontSize="11" fill="#64748b">
                {r.sub}
              </text>
              <rect
                x={plotX}
                y={y}
                width={x(r.base)}
                height={barH}
                rx={4}
                fill={r.fill}
              />
              <rect
                x={plotX + x(r.base)}
                y={y}
                width={x(r.mail)}
                height={barH}
                rx={2}
                fill="#f59e0b"
              />
              <text
                x={plotX + x(r.base + r.mail) + 8}
                y={y + 18}
                fontSize="12.5"
                fontWeight="700"
                fill="#0f172a"
              >
                {r.base + r.mail}d
              </text>
              <text
                x={plotX + 8}
                y={y + 18}
                fontSize="12"
                fontWeight="700"
                fill="#ffffff"
              >
                {r.base} days
              </text>
            </g>
          );
        })}

        <rect x={plotX} y={H - 20} width={12} height={12} rx={2} fill="#f59e0b" />
        <text x={plotX + 18} y={H - 10} fontSize="11.5" fill="#475569">
          + {RFE_RULES.mailGraceDays} days, added only when USCIS serves the
          notice by mail. No addition for electronic or in-person service.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong> most
        forms get {RFE_RULES.maxLabel}, which becomes{" "}
        {RFE_RULES.maxDays + RFE_RULES.mailGraceDays} days when the notice is
        mailed inside the United States. {RFE_RULES.shortForms.join(" and ")} get{" "}
        {RFE_RULES.shortFormDays} days instead. Officers are prohibited by
        regulation from granting more time, so there is no extension to ask for —
        and the deadline printed on your own notice always controls. Source:
        USCIS Policy Manual, Vol. 1, Pt. E, Ch. 6, read{" "}
        {RFE_RULES.lastVerified}.
      </figcaption>
    </figure>
  );
}

/* ═════════ B. What an officer may do instead of issuing an RFE ═════════ */

export function RfeOrNotDiagram() {
  const W = 720;
  const H = 300;

  const branches = [
    {
      x: 8,
      title: "Approve",
      body: "The record establishes eligibility. Nothing further is needed.",
      fill: "#ecfdf5",
      stroke: "#6ee7b7",
    },
    {
      x: 188,
      title: "Issue an RFE",
      body: "Something specific is missing and the officer asks for it.",
      fill: "#eef2ff",
      stroke: "#a5b4fc",
    },
    {
      x: 368,
      title: "Issue a NOID",
      body: "The officer intends to deny and gives you a chance to rebut. Usually a shorter window.",
      fill: "#fef3c7",
      stroke: "#fcd34d",
    },
    {
      x: 548,
      title: "Deny outright",
      body: "No RFE, no NOID. Restored as full discretion on 5 August 2026.",
      fill: "#fef2f2",
      stroke: "#fca5a5",
    },
  ];

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Diagram of the four things a USCIS officer may do with a filing: approve, issue an RFE, issue a NOID, or deny outright. Written out below."
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="rfe2-arrow"
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

        <rect x={186} y={8} width={348} height={52} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x={360} y={32} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f172a">
          An officer picks up your filing
        </text>
        <text x={360} y={50} textAnchor="middle" fontSize="12" fill="#475569">
          Four things can happen. Only one of them is an RFE.
        </text>

        {branches.map((b) => (
          <g key={b.title}>
            <line
              x1={360}
              y1={60}
              x2={b.x + 82}
              y2={100}
              stroke="#94a3b8"
              strokeWidth="1.5"
              markerEnd="url(#rfe2-arrow)"
            />
            <rect
              x={b.x}
              y={104}
              width={164}
              height={106}
              rx={10}
              fill={b.fill}
              stroke={b.stroke}
              strokeWidth="1.5"
            />
            <text x={b.x + 82} y={130} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
              {b.title}
            </text>
            {b.body.split(" ").reduce<string[][]>((lines, word) => {
              const last = lines[lines.length - 1];
              if (!last || last.join(" ").length + word.length > 24) lines.push([word]);
              else last.push(word);
              return lines;
            }, []).map((line, li) => (
              <text
                key={li}
                x={b.x + 82}
                y={150 + li * 15}
                textAnchor="middle"
                fontSize="11.5"
                fill="#475569"
              >
                {line.join(" ")}
              </text>
            ))}
          </g>
        ))}

        <rect x={8} y={228} width={W - 16} height={56} rx={10} fill="#fff7ed" stroke="#fdba74" strokeWidth="1.5" />
        <text x={24} y={252} fontSize="13.5" fontWeight="700" fill="#9a3412">
          What changed on {RFE_RULES.discretionPolicy.effective}
        </text>
        <text x={24} y={272} fontSize="12" fill="#7c2d12">
          The fourth branch is no longer the exception. An RFE is not a second chance you can count on.
        </text>
      </svg>
      <figcaption className="mt-3 text-xs text-ink-500">
        <strong className="font-semibold text-ink-700">In words:</strong>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {branches.map((b) => (
            <li key={b.title}>
              <strong className="font-semibold text-ink-700">{b.title}.</strong>{" "}
              {b.body}
            </li>
          ))}
          <li>
            {RFE_RULES.discretionPolicy.summary}{" "}
            {RFE_RULES.discretionPolicy.consequence}
          </li>
        </ol>
        Source: USCIS Policy Manual, Vol. 1, Pt. E, Ch. 6 and the{" "}
        {RFE_RULES.discretionPolicy.effective} evidentiary standards policy
        alert.
      </figcaption>
    </figure>
  );
}
