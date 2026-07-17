import type { DataCol, DataRow } from "@/data/governmentBenefitsData";

/**
 * The "Benefits by immigration status" comparison, rendered two ways from ONE
 * data source (`statusTableCols` + `statusTableRows`):
 *
 *   >= lg (1024px) : the 11-column table, inside a hard-contained horizontal
 *                    scroll region with a sticky first column.
 *   <  lg          : one <details> accordion per immigration status, showing the
 *                    same cells as label/value rows.
 *
 * The legal labels are never re-authored here — every string is read straight
 * out of the data module, so the two presentations cannot drift apart.
 *
 * WHY NOT the shared TrumpAccountUI <DataTable>: its wrapper is
 * `overflow-x-auto ... sm:overflow-visible`, which switches the clip OFF at
 * >=640px. With 11 columns the table's natural width is 1216px, so it painted
 * outside its container and pushed the document to 1217px at a 768px viewport
 * (measured: +449px of horizontal overflow). The wrapper here never disables
 * overflow, so the scroll is always contained.
 *
 * Accessibility notes:
 *  - Exactly one representation is displayed at a time (`hidden` = display:none),
 *    so screen readers never encounter both copies.
 *  - <details>/<summary> gives native expanded/collapsed semantics AND works
 *    with JavaScript disabled, which a button+aria-expanded implementation would
 *    not. This matches the existing ToolFaq / ProgramCard pattern on the site.
 *  - The scroll region is keyboard focusable (tabIndex=0) with an accessible
 *    name, so keyboard users can reach and pan it.
 */
export default function StatusMatrix({
  columns,
  rows,
  caption,
  emphasise = [],
}: {
  columns: DataCol[];
  rows: DataRow[];
  caption?: string;
  /** Row values (first column) to visually emphasise. */
  emphasise?: string[];
}) {
  const statusKey = columns[0].key;
  const programCols = columns.slice(1);
  const isKey = (r: DataRow) => emphasise.includes(r[statusKey]);

  return (
    <div data-status-matrix>
      {caption && (
        <p className="mb-3 text-sm leading-relaxed text-ink-600">{caption}</p>
      )}

      {/* ---------------- >= lg : contained scroll table ---------------- */}
      <div className="hidden lg:block">
        <p className="mb-2 text-xs font-semibold text-ink-500">
          <span aria-hidden>↔</span> Scroll horizontally to compare all programs
        </p>
        <div
          // NOTE: no `sm:overflow-visible`. The clip must never be switched off.
          className="overflow-x-auto overscroll-x-contain rounded-2xl border border-ink-900/10 bg-white"
          tabIndex={0}
          role="region"
          aria-label="Benefits by immigration status — scrollable table"
        >
          {/* min-w tuned by measurement, not taste: at 1180px the ten program
              columns get ~100px each, which wraps labels like "Work-history
              dependent" onto three lines and made rows ~250px tall. 1300px gives
              ~113px and roughly halves row height, at the cost of ~120px more
              horizontal scroll. */}
          <table className="w-full min-w-[1300px] border-collapse text-left align-top">
            <caption className="sr-only">
              Benefits by immigration status. The first column lists immigration
              status; the remaining columns show how each benefit program
              generally treats that status.
            </caption>
            <thead>
              <tr className="bg-ink-50 text-[0.6875rem] uppercase tracking-wide text-ink-500">
                <th
                  scope="col"
                  className="sticky left-0 z-20 w-[168px] min-w-[168px] border-b border-r border-ink-900/10 bg-ink-50 p-2.5 font-semibold"
                >
                  {columns[0].label}
                </th>
                {programCols.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={`border-b border-ink-900/10 p-2.5 font-semibold ${
                      c.highlight ? "text-brand-700" : ""
                    }`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r[statusKey]}
                  className={isKey(r) ? "bg-amber-50/40" : "odd:bg-white even:bg-ink-50/30"}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 w-[168px] min-w-[168px] border-b border-r border-ink-900/10 p-2.5 text-xs font-bold text-ink-900 ${
                      // Sticky cells need an opaque background or the scrolling
                      // content shows through them.
                      isKey(r) ? "bg-[#fefaf0]" : "bg-white"
                    }`}
                  >
                    {r[statusKey]}
                  </th>
                  {programCols.map((c) => (
                    <td
                      key={c.key}
                      className="border-b border-ink-900/10 p-2.5 align-top text-xs leading-snug text-ink-700"
                    >
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- < lg : accordions, same data ---------------- */}
      <div className="space-y-2 lg:hidden">
        <p className="text-xs font-semibold text-ink-500">
          Tap a status to see how each program treats it.
        </p>
        {rows.map((r, i) => (
          <details
            key={r[statusKey]}
            // Only the first is open initially — the rest stay collapsed.
            open={i === 0}
            className={`group overflow-hidden rounded-2xl border bg-white ${
              isKey(r) ? "border-amber-300" : "border-ink-900/10"
            }`}
          >
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-3 text-sm font-bold text-ink-900 marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">{r[statusKey]}</span>
              <span
                aria-hidden
                className="flex-none text-ink-400 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <dl className="border-t border-ink-900/10">
              {programCols.map((c) => (
                <div
                  key={c.key}
                  className="flex flex-col gap-0.5 border-b border-ink-900/5 px-3 py-2 last:border-b-0 sm:flex-row sm:gap-3"
                >
                  <dt
                    className={`text-xs font-semibold sm:w-[38%] sm:flex-none ${
                      c.highlight ? "text-brand-700" : "text-ink-500"
                    }`}
                  >
                    {c.label}
                  </dt>
                  <dd className="min-w-0 text-sm leading-snug text-ink-800">{r[c.key]}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>
    </div>
  );
}
