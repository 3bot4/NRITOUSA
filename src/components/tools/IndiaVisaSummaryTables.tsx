import {
  totalCostByCategory,
  totalTimeByCategory,
  usd,
  INDIA_VISA_ESTIMATE_DISCLAIMER,
} from "@/data/indiaVisaData";

/**
 * Two compact summary tables for the India Visa cluster:
 *   • Total estimated cost by visa category
 *   • Total estimated time by visa category
 * Both derive from feeByCategory (single source), and carry one small
 * "estimates may change" disclaimer + last-checked date.
 */
export default function IndiaVisaSummaryTables({
  accent = "orange",
  showCost = true,
  showTime = true,
}: {
  accent?: "orange" | "emerald" | "sky" | "amber" | "indigo" | "rose";
  showCost?: boolean;
  showTime?: boolean;
}) {
  const strong = {
    orange: "text-orange-700",
    emerald: "text-emerald-700",
    sky: "text-sky-700",
    amber: "text-amber-700",
    indigo: "text-indigo-700",
    rose: "text-rose-700",
  }[accent];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        {showCost && (
          <div>
            <h3 className="text-base font-bold text-ink-900">Total estimated cost by visa category</h3>
            <div className="mt-3 overflow-hidden rounded-2xl border border-ink-900/10 shadow-card">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Total (est.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5 bg-white">
                  {totalCostByCategory.map((r) => (
                    <tr key={r.type} className="align-top">
                      <td className="p-3">
                        <span className="font-semibold text-ink-900">{r.type}</span>
                        <span className="block text-[0.6875rem] text-ink-400">{r.breakdown}</span>
                      </td>
                      <td className={`whitespace-nowrap p-3 font-bold ${strong}`}>{usd(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showTime && (
          <div>
            <h3 className="text-base font-bold text-ink-900">Total estimated time by visa category</h3>
            <div className="mt-3 overflow-hidden rounded-2xl border border-ink-900/10 shadow-card">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Time (est.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5 bg-white">
                  {totalTimeByCategory.map((r) => (
                    <tr key={r.type} className="align-top">
                      <td className="p-3">
                        <span className="font-semibold text-ink-900">{r.type}</span>
                        <span className="block text-[0.6875rem] text-ink-400">{r.validity}</span>
                      </td>
                      <td className={`whitespace-nowrap p-3 font-bold ${strong}`}>{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-ink-400">{INDIA_VISA_ESTIMATE_DISCLAIMER}</p>
    </div>
  );
}
