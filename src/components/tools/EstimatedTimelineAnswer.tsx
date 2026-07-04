import type { EstimateColumn, EstimateRow } from "@/data/greenCardRenewalTimelineData";

/**
 * "Fast answer" estimated-timeline block shown at the TOP of every immigration
 * processing-time / renewal page — BEFORE the calculator and before long
 * explanations. Search users want "how long?" first, so this answers the
 * planning range immediately, with honest source notes and official links.
 *
 * Generic by design: pass a `columns` definition + `rows` (records keyed to
 * those columns). The first column renders bold; the column flagged
 * `emphasize` renders as the visually prominent "estimated time" column; rows
 * flagged `highlight` are tinted. Mobile shows stacked cards (no horizontal
 * scroll); desktop shows a clean, not-too-wide table.
 *
 * All estimate ranges live in src/data/greenCardRenewalTimelineData.ts so they
 * stay editable without touching JSX.
 */
export default function EstimatedTimelineAnswer({
  title,
  intro,
  columns,
  rows,
  summaryTitle,
  summaryText,
  badges = [],
  sourceNote,
  officialLinks = [],
  ctaText,
  ctaHref,
  accentBtn = "bg-emerald-600 hover:bg-emerald-700",
}: {
  title: string;
  intro?: string;
  columns: EstimateColumn[];
  rows: EstimateRow[];
  summaryTitle?: string;
  summaryText?: string;
  badges?: string[];
  sourceNote?: string;
  officialLinks?: { label: string; href: string }[];
  ctaText?: string;
  ctaHref?: string;
  accentBtn?: string;
}) {
  const [firstCol, ...restCols] = columns;
  const str = (v: EstimateRow[string]) => (typeof v === "string" ? v : "");

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      {intro && <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{intro}</p>}

      {badges.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <li
              key={b}
              className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-emerald-700"
            >
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Mobile: stacked cards (no horizontal scroll) */}
      <div className="mt-4 space-y-3 sm:hidden">
        {rows.map((r, i) => (
          <div
            key={str(r[firstCol.key]) || i}
            className={`rounded-2xl border p-4 shadow-card ${
              r.highlight ? "border-emerald-300 bg-emerald-50/60" : "border-ink-900/10 bg-white"
            }`}
          >
            <p className="text-sm font-bold text-ink-900">{str(r[firstCol.key])}</p>
            <dl className="mt-2 space-y-1.5 text-xs">
              {restCols.map((c) => (
                <div key={c.key} className="flex gap-2">
                  <dt className="w-28 shrink-0 font-semibold text-ink-500">{c.label}</dt>
                  <dd className={c.emphasize ? "font-semibold text-emerald-700" : "text-ink-700"}>
                    {str(r[c.key])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop: clean table */}
      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              {columns.map((c) => (
                <th key={c.key} className="p-3 font-semibold">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5 bg-white">
            {rows.map((r, i) => (
              <tr key={str(r[firstCol.key]) || i} className={`align-top ${r.highlight ? "bg-emerald-50/60" : ""}`}>
                {columns.map((c, ci) => {
                  if (ci === 0) {
                    return (
                      <td key={c.key} className={`p-3 font-semibold ${r.highlight ? "text-emerald-800" : "text-ink-900"}`}>
                        {str(r[c.key])}
                      </td>
                    );
                  }
                  return (
                    <td
                      key={c.key}
                      className={`p-3 ${c.emphasize ? "font-semibold text-emerald-700" : "text-ink-600"}`}
                    >
                      {str(r[c.key])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Planning summary box */}
      {(summaryTitle || summaryText) && (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-card">
          {summaryTitle && <h3 className="text-base font-bold text-ink-900">{summaryTitle}</h3>}
          {summaryText && <p className="mt-2 text-sm leading-relaxed text-ink-700">{summaryText}</p>}
        </div>
      )}

      {/* CTA to the personal tool */}
      {ctaText && ctaHref && (
        <div className="mt-5">
          <a
            href={ctaHref}
            className={`inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition ${accentBtn}`}
          >
            {ctaText} →
          </a>
        </div>
      )}

      {/* Source note + official links */}
      {(sourceNote || officialLinks.length > 0) && (
        <div className="mt-5 rounded-xl border border-ink-900/10 bg-ink-50/50 p-4">
          {sourceNote && <p className="text-xs leading-relaxed text-ink-600">{sourceNote}</p>}
          {officialLinks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {officialLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
