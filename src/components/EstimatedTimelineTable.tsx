import OfficialSourceNote from "@/components/OfficialSourceNote";

/**
 * Stage-by-stage estimated timeline table (with optional fee + "faster path"
 * columns). Shown after the FastAnswerSnapshot and before long explanations on
 * processing-time / timeline pages. Only the columns you supply data for are
 * rendered, so the same component serves fee-heavy and time-heavy pages.
 *
 * Desktop → table; mobile → stacked cards (no horizontal scroll). The
 * `estimatedTime` and `fee` columns are visually emphasized; `highlight` rows
 * are tinted.
 */
export interface TimelineRow {
  stage: string;
  estimatedTime?: string;
  fee?: string;
  fasterPath?: string;
  whatToCheck?: string;
  notes?: string;
  highlight?: boolean;
}

const COLUMNS: { key: keyof TimelineRow; label: string; emphasize?: boolean }[] = [
  { key: "estimatedTime", label: "Estimated time", emphasize: true },
  { key: "fee", label: "Fee", emphasize: true },
  { key: "fasterPath", label: "Faster path" },
  { key: "whatToCheck", label: "What to check" },
  { key: "notes", label: "Notes" },
];

export default function EstimatedTimelineTable({
  title,
  intro,
  rows,
  lastUpdated,
  sourceLinks = [],
  disclaimer,
  ctaText,
  ctaHref,
}: {
  title: string;
  intro?: string;
  rows: TimelineRow[];
  lastUpdated?: string;
  sourceLinks?: { label: string; href: string }[];
  disclaimer?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  // Only render columns that at least one row populates.
  const activeCols = COLUMNS.filter((c) => rows.some((r) => r[c.key]));

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      {intro && <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{intro}</p>}

      {/* Mobile: stacked cards */}
      <div className="mt-4 space-y-3 sm:hidden">
        {rows.map((r, i) => (
          <div
            key={r.stage || i}
            className={`rounded-2xl border p-4 shadow-card ${r.highlight ? "border-emerald-300 bg-emerald-50/60" : "border-ink-900/10 bg-white"}`}
          >
            <p className="text-sm font-bold text-ink-900">{r.stage}</p>
            <dl className="mt-2 space-y-1.5 text-xs">
              {activeCols.map((c) =>
                r[c.key] ? (
                  <div key={c.key} className="flex gap-2">
                    <dt className="w-28 shrink-0 font-semibold text-ink-500">{c.label}</dt>
                    <dd className={c.emphasize ? "font-semibold text-emerald-700" : "text-ink-700"}>
                      {r[c.key] as string}
                    </dd>
                  </div>
                ) : null,
              )}
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              <th className="p-3 font-semibold">Stage</th>
              {activeCols.map((c) => (
                <th key={c.key} className="p-3 font-semibold">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5 bg-white">
            {rows.map((r, i) => (
              <tr key={r.stage || i} className={`align-top ${r.highlight ? "bg-emerald-50/60" : ""}`}>
                <td className={`p-3 font-semibold ${r.highlight ? "text-emerald-800" : "text-ink-900"}`}>{r.stage}</td>
                {activeCols.map((c) => (
                  <td key={c.key} className={`p-3 ${c.emphasize ? "font-semibold text-emerald-700" : "text-ink-600"}`}>
                    {(r[c.key] as string) || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ctaText && ctaHref && (
        <div className="mt-5">
          <a href={ctaHref} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">
            {ctaText} →
          </a>
        </div>
      )}

      <OfficialSourceNote className="mt-5" lastVerified={lastUpdated} sources={sourceLinks} disclaimer={disclaimer} />
    </div>
  );
}
