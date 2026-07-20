import {
  bulletin,
  getSeries,
  monthIndex,
  formatCutoff,
  formatBulletinMonth,
  CATEGORY_SHORT,
  COUNTRY_LABELS,
  DOS_VISA_BULLETIN_URL,
  type EbCategory,
  type BulletinCountry,
  type SeriesPoint,
  type Cutoff,
} from "@/lib/visa-bulletin";

/**
 * Data-driven movement-history table for one EB category + country: the last
 * `months` bulletin months with the Final Action Date and Dates for Filing
 * cutoffs. Every value resolves from data/visa-bulletin/history.json +
 * current.json (step-function carry-forward), so the table updates itself on
 * each monthly data refresh — no hand-written dates.
 */

/** Resolve the cutoff in force for a given bulletin month from change points. */
function cutoffAt(points: SeriesPoint[], ym: string): Cutoff | null {
  const target = monthIndex(ym);
  let v: Cutoff | null = null;
  for (const [month, cutoff] of points) {
    if (monthIndex(month) > target) break;
    v = cutoff;
  }
  return v;
}

function label(v: Cutoff | null): string {
  if (v == null) return "—";
  return formatCutoff(v);
}

export default function VisaBulletinMovementHistory({
  category,
  country = "india",
  months = 6,
  className = "",
}: {
  category: EbCategory;
  country?: BulletinCountry;
  months?: number;
  className?: string;
}) {
  const series = getSeries(category, country);
  if (!series) return null;

  const end = monthIndex(bulletin.month);
  const rows: { ym: string; fad: string; dff: string }[] = [];
  for (let mi = end - months + 1; mi <= end; mi++) {
    const ym = `${Math.floor(mi / 12)}-${String((mi % 12) + 1).padStart(2, "0")}`;
    rows.push({
      ym,
      fad: label(cutoffAt(series.fad, ym)),
      dff: label(cutoffAt(series.dff, ym)),
    });
  }
  rows.reverse(); // newest first

  return (
    <div className={`mx-auto max-w-[720px] ${className}`}>
      <div className="overflow-x-auto rounded-2xl border border-ink-900/10 shadow-sm">
        <table className="w-full min-w-[440px] border-collapse text-left text-sm">
          <caption className="bg-ink-50/70 p-3 text-left text-sm font-bold text-ink-900">
            {CATEGORY_SHORT[category]} {COUNTRY_LABELS[country]} — recent visa
            bulletin movement
          </caption>
          <thead>
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              <th className="p-3 font-semibold">Bulletin month</th>
              <th className="p-3 font-semibold">Final Action Date</th>
              <th className="p-3 font-semibold">Dates for Filing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5 bg-white">
            {rows.map((r) => (
              <tr key={r.ym}>
                <td className="p-3 font-semibold text-ink-900">
                  {formatBulletinMonth(r.ym)}
                </td>
                <td className="p-3 text-ink-700">{r.fad}</td>
                <td className="p-3 text-ink-700">{r.dff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-400">
        Source:{" "}
        <a
          href={DOS_VISA_BULLETIN_URL}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="font-medium text-brand-600"
        >
          U.S. Department of State Visa Bulletin
        </a>
        . Cutoffs shown are the values in force each bulletin month; always
        confirm the current month on the official bulletin.
      </p>
    </div>
  );
}
