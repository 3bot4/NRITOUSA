import Link from "next/link";
import {
  bulletin,
  getCutoffs,
  getMovement,
  getApplicableChart,
  formatCutoff,
  getBulletinLabel,
  formatMonths,
  CATEGORY_SHORT,
  COUNTRY_LABELS,
  DOS_VISA_BULLETIN_URL,
  USCIS_FILING_CHART_URL,
  type EbCategory,
  type BulletinCountry,
  type MovementStatus,
} from "@/lib/visa-bulletin";
import { formatDate } from "@/lib/format";

/**
 * Reusable, data-driven "current status" card for one employment-based category
 * (EB-1/EB-2/EB-3) and country. Every value — Final Action Date, Dates for
 * Filing, prior-month cutoff, month-over-month movement, the applicable USCIS
 * filing chart, and the verification date — comes from the single source of
 * truth in data/visa-bulletin/current.json + history.json via
 * src/lib/visa-bulletin.ts. No cutoff dates are hand-written here, so the hub,
 * category pages, checker, and tracker can never disagree for the same month.
 *
 * Status is communicated by an icon + text label (not colour alone) for
 * accessibility, and each status carries a plain-language explanation.
 */

const STATUS_META: Record<
  MovementStatus,
  { label: string; icon: string; tone: string; badge: string }
> = {
  current: {
    label: "Current",
    icon: "✓",
    tone: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
  },
  advanced: {
    label: "Advanced",
    icon: "▲",
    tone: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
  },
  "no-movement": {
    label: "No movement",
    icon: "▬",
    tone: "border-amber-200 bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
  },
  retrogressed: {
    label: "Retrogressed",
    icon: "▼",
    tone: "border-rose-200 bg-rose-50",
    badge: "bg-rose-100 text-rose-800",
  },
  unavailable: {
    label: "Unavailable",
    icon: "✕",
    tone: "border-rose-200 bg-rose-50",
    badge: "bg-rose-100 text-rose-800",
  },
  unknown: {
    label: "See bulletin",
    icon: "•",
    tone: "border-ink-900/10 bg-white",
    badge: "bg-ink-100 text-ink-700",
  },
};

function movementSentence(
  m: ReturnType<typeof getMovement>,
  label: string
): string {
  const moved =
    m.monthsMoved != null ? formatMonths(Math.abs(m.monthsMoved)) : null;
  const from = m.priorFad ? formatCutoff(m.priorFad) : null;
  const to = formatCutoff(m.currentFad);
  switch (m.status) {
    case "current":
      return `${label} is Current — there is no backlog this month, so every priority date in the category qualifies for final action.`;
    case "unavailable":
      return `${label} is Unavailable in the ${m.currentMonthLabel} bulletin — no immigrant visa numbers are authorized this month, so no case can receive final approval regardless of priority date.`;
    case "advanced":
      return from
        ? `The ${label} Final Action Date advanced${
            moved ? ` about ${moved}` : ""
          } — from ${from} (${m.priorMonthLabel}) to ${to} (${m.currentMonthLabel}).`
        : `The ${label} Final Action Date moved forward to ${to} this month.`;
    case "retrogressed":
      return from
        ? `The ${label} Final Action Date retrogressed${
            moved ? ` about ${moved}` : ""
          } — moving backward from ${from} (${m.priorMonthLabel}) to ${to} (${m.currentMonthLabel}).`
        : `The ${label} Final Action Date moved backward to ${to} this month.`;
    case "no-movement":
      return `The ${label} Final Action Date held at ${to} — no change from ${m.priorMonthLabel}.`;
    default:
      return `Compare the ${label} cutoff against the official bulletin below.`;
  }
}

export default function VisaBulletinCategoryStatus({
  category,
  country = "india",
  className = "",
}: {
  category: EbCategory;
  country?: BulletinCountry;
  className?: string;
}) {
  const { fad, dff } = getCutoffs(category, country);
  const movement = getMovement(category, country);
  const chart = getApplicableChart();
  const label = `${CATEGORY_SHORT[category]} ${COUNTRY_LABELS[country]}`;
  const meta = STATUS_META[movement.status];

  const tiles: { term: string; value: string; note?: string }[] = [
    { term: "Final Action Date", value: formatCutoff(fad), note: "Approval cutoff (Table A)" },
    { term: "Dates for Filing", value: formatCutoff(dff), note: "Earliest I-485 filing (Table B)" },
    {
      term: `Prior month (${movement.priorMonthLabel})`,
      value: movement.priorFad ? formatCutoff(movement.priorFad) : "—",
      note: "Final Action Date last month",
    },
    {
      term: "Month-over-month",
      value: meta.label,
      note:
        movement.monthsMoved != null && Math.abs(movement.monthsMoved) >= 0.03
          ? `${movement.monthsMoved > 0 ? "+" : "−"}${formatMonths(
              Math.abs(movement.monthsMoved)
            )}`
          : undefined,
    },
  ];

  return (
    <section
      aria-label={`${label} current visa bulletin status`}
      className={`rounded-2xl border ${meta.tone} p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
            {getBulletinLabel()} visa bulletin
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-ink-900">
            {label} — current status
          </h2>
        </div>
        <span
          role="status"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${meta.badge}`}
        >
          <span aria-hidden>{meta.icon}</span> {meta.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        {movementSentence(movement, label)}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div
            key={t.term}
            className="rounded-xl border border-ink-900/5 bg-white p-3"
          >
            <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink-400">
              {t.term}
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-ink-900">{t.value}</dd>
            {t.note && <p className="mt-0.5 text-[0.7rem] text-ink-400">{t.note}</p>}
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500">
        <span>
          <strong className="font-semibold text-ink-700">
            USCIS filing chart this month:
          </strong>{" "}
          {chart.label}
        </span>
        <span aria-hidden>·</span>
        <span>Data verified {formatDate(bulletin.lastUpdated)}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <a
          href={bulletin.source || DOS_VISA_BULLETIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 underline"
        >
          Official Department of State bulletin ↗
        </a>
        <a
          href={USCIS_FILING_CHART_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 underline"
        >
          USCIS filing chart ↗
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/tools/priority-date-checker"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Check my priority date →
        </Link>
        <Link
          href="/tools/green-card-tracker"
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-900/30"
        >
          Estimate my wait
        </Link>
      </div>

      <p className="mt-4 border-t border-ink-900/5 pt-3 text-[0.7rem] leading-relaxed text-ink-400">
        Official data is from the U.S. Department of State and USCIS. NRITOUSA
        estimates are educational scenarios based on published data and
        assumptions — they are not official government projections or legal
        advice.
      </p>
    </section>
  );
}
