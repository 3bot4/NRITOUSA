import type { TimelineRow, SourceLink } from "@/data/immigrationTimelineData";

/**
 * Static "timeline estimate by stage" table shown near the TOP of the PERM,
 * I-485 and NVC pages — before the personalized calculator/tool. Answers search
 * intent immediately with planning ranges, then a CTA jumps to the tool.
 *
 * Mobile-friendly: renders stacked cards on small screens and a table on
 * sm+ screens (rows flagged `highlight` are visually emphasised in both).
 * Data lives in src/data/immigrationTimelineData.ts so ranges are editable
 * monthly.
 */
export default function ImmigrationTimelineTable({
  title,
  intro,
  rows,
  stepHeader = "Step",
  badges = [],
  sourceNote,
  sourceLinks = [],
  ctaText,
  ctaHref,
  accentBtn = "bg-blue-700 hover:bg-blue-800",
}: {
  title: string;
  intro: string;
  rows: TimelineRow[];
  /** Header for the first column ("Step" or "NVC stage"). */
  stepHeader?: string;
  badges?: string[];
  sourceNote?: string;
  sourceLinks?: SourceLink[];
  ctaText: string;
  ctaHref: string;
  /** Tailwind classes for the CTA button background. */
  accentBtn?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{intro}</p>

      {badges.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <li
              key={b}
              className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-blue-700"
            >
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Mobile: stacked cards */}
      <div className="mt-4 space-y-3 sm:hidden">
        {rows.map((r) => (
          <div
            key={r.step}
            className={`rounded-2xl border p-4 shadow-card ${
              r.highlight ? "border-blue-300 bg-blue-50/60" : "border-ink-900/10 bg-white"
            }`}
          >
            <p className="text-sm font-bold text-ink-900">{r.step}</p>
            <dl className="mt-2 space-y-1.5 text-xs">
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 font-semibold text-ink-500">Estimated time</dt>
                <dd className="text-ink-700">{r.estimatedTime}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 font-semibold text-ink-500">Faster path?</dt>
                <dd className="text-ink-700">{r.fasterPath}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 font-semibold text-ink-500">What to check</dt>
                <dd className="text-ink-700">{r.whatToCheck}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* sm+: horizontally scrollable table */}
      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              <th className="p-3 font-semibold">{stepHeader}</th>
              <th className="p-3 font-semibold">Estimated time</th>
              <th className="p-3 font-semibold">Faster path?</th>
              <th className="p-3 font-semibold">What to check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5 bg-white">
            {rows.map((r) => (
              <tr key={r.step} className={`align-top ${r.highlight ? "bg-blue-50/60" : ""}`}>
                <td className={`p-3 font-semibold ${r.highlight ? "text-blue-800" : "text-ink-900"}`}>{r.step}</td>
                <td className="p-3 font-medium text-ink-700">{r.estimatedTime}</td>
                <td className="p-3 text-ink-600">{r.fasterPath}</td>
                <td className="p-3 text-ink-600">{r.whatToCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA to the personalized tool */}
      <div className="mt-5">
        <a
          href={ctaHref}
          className={`inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition ${accentBtn}`}
        >
          {ctaText} →
        </a>
      </div>

      {/* Source note + official links */}
      {(sourceNote || sourceLinks.length > 0) && (
        <div className="mt-5 rounded-xl border border-ink-900/10 bg-ink-50/50 p-4">
          {sourceNote && <p className="text-xs leading-relaxed text-ink-600">{sourceNote}</p>}
          {sourceLinks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {sourceLinks.map((l) => (
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
