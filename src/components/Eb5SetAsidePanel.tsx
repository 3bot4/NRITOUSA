import {
  EB5_SETASIDE_ORDER,
  EB5_SETASIDE_LABELS,
  getEb5SetAside,
  formatCutoff,
  type BulletinCountry,
} from "@/lib/visa-bulletin";

/**
 * Compact status panel for the three reserved EB-5 set-aside categories
 * (Rural, High Unemployment, Infrastructure). These are distinct from EB-5
 * Unreserved (which is Unavailable for India in July 2026) and have stayed
 * Current. Data comes from data/visa-bulletin/current.json via getEb5SetAside.
 */
export default function Eb5SetAsidePanel({
  country = "india",
  className = "",
}: {
  country?: BulletinCountry;
  className?: string;
}) {
  const rows = EB5_SETASIDE_ORDER.map((key) => ({
    key,
    label: EB5_SETASIDE_LABELS[key],
    cutoffs: getEb5SetAside(key, country),
  })).filter((r) => r.cutoffs !== null);

  if (rows.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
        EB-5 set-aside categories
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-600">
        The reserved EB-5 set-asides are separate from EB-5 Unreserved (which is
        Unavailable for India this month). A set-aside Final Action Date that
        shows <strong>Current</strong> means there is no cutoff — any priority
        date qualifies.
      </p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-emerald-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-50/60 text-left text-xs font-semibold uppercase tracking-wide text-emerald-800">
              <th className="px-4 py-2.5">Set-aside category</th>
              <th className="px-4 py-2.5">Final Action Date</th>
              <th className="px-4 py-2.5">Dates for Filing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="px-4 py-2.5 font-medium text-ink-800">
                  {r.label}
                </td>
                <td className="px-4 py-2.5 font-semibold text-emerald-700">
                  {formatCutoff(r.cutoffs!.fad)}
                </td>
                <td className="px-4 py-2.5 text-ink-600">
                  {formatCutoff(r.cutoffs!.dff)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-400">
        Set-aside availability can change monthly. Always verify with the
        official Department of State Visa Bulletin.
      </p>
    </div>
  );
}
