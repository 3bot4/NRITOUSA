import Link from "next/link";
import {
  getCutoffs,
  formatCutoff,
  monthIndex,
  formatMonths,
  isCurrent,
  isUnavailableVisaValue,
  isValidVisaDate,
  getBulletinLabel,
  CATEGORY_SHORT,
  DOS_VISA_BULLETIN_URL,
  type EbCategory,
} from "@/lib/visa-bulletin";

/**
 * India vs "All Chargeability Areas Except Those Listed" (Rest of World), side
 * by side, for the cross-chargeability page — this is the whole point of the
 * provision, so the reader should see the size of the jump rather than be told
 * about it.
 *
 * Every value resolves from data/visa-bulletin/current.json via
 * lib/visa-bulletin, so it can never drift from the category pages or the
 * Priority Date Checker. Never hardcode a cutoff here.
 */

const CATEGORIES: EbCategory[] = ["eb1", "eb2", "eb3"];

/**
 * Human-readable size of the India→ROW gap for one category.
 * Returns null when the comparison is not meaningful (either side Current or
 * Unavailable), so the UI can fall back to words instead of a bogus number.
 */
function gapLabel(indiaFad: string, rowFad: string): string | null {
  if (isUnavailableVisaValue(indiaFad)) return null;
  if (isCurrent(indiaFad)) return null;
  if (!isValidVisaDate(indiaFad)) return null;
  if (isCurrent(rowFad)) return null; // handled as "Current" in copy
  if (!isValidVisaDate(rowFad)) return null;
  const months = monthIndex(rowFad) - monthIndex(indiaFad);
  return months > 0 ? formatMonths(months) : null;
}

export default function VisaBulletinIndiaVsRow({
  className = "",
}: {
  className?: string;
}) {
  const rows = CATEGORIES.map((cat) => {
    const india = getCutoffs(cat, "india");
    const row = getCutoffs(cat, "row");
    return { cat, india, row, gap: gapLabel(india.fad, row.fad) };
  });

  return (
    <div
      className={`rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
          India vs Rest of World — Final Action Dates
        </p>
        <p className="text-xs text-ink-400">Data: {getBulletinLabel()}</p>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              <th className="p-2.5 font-semibold">Category</th>
              <th className="p-2.5 font-semibold">India column</th>
              <th className="p-2.5 font-semibold">All other countries</th>
              <th className="p-2.5 font-semibold">What cross-charging is worth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5">
            {rows.map(({ cat, india, row, gap }) => (
              <tr key={cat} className="align-top">
                <td className="p-2.5 font-semibold text-ink-900">
                  {CATEGORY_SHORT[cat]}
                </td>
                <td
                  className={`p-2.5 font-medium ${
                    isUnavailableVisaValue(india.fad) ? "text-rose-700" : "text-ink-700"
                  }`}
                >
                  {formatCutoff(india.fad)}
                </td>
                <td
                  className={`p-2.5 font-medium ${
                    isCurrent(row.fad) ? "text-emerald-700" : "text-ink-700"
                  }`}
                >
                  {formatCutoff(row.fad)}
                </td>
                <td className="p-2.5 text-ink-600">
                  {isUnavailableVisaValue(india.fad) && isCurrent(row.fad)
                    ? "No approvals at all vs no wait — the largest possible gap"
                    : isCurrent(row.fad) && gap === null
                      ? "Rest of World is Current — no queue on that side"
                      : gap
                        ? `Roughly ${gap} of queue skipped`
                        : "Compare both rows in the current bulletin"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-500">
        Cross-chargeability moves which <em>column</em> your priority date is read
        against. It does not change the date itself. Figures are the current{" "}
        <a
          href={DOS_VISA_BULLETIN_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="underline"
        >
          Department of State Visa Bulletin
        </a>{" "}
        cutoffs and change monthly — check yours with the{" "}
        <Link href="/tools/priority-date-checker" className="font-semibold text-indigo-700 underline">
          Priority Date Checker
        </Link>
        .
      </p>
    </div>
  );
}
