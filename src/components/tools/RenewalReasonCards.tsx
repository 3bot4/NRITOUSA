import type { RenewalReason } from "@/data/greenCardRenewalData";

/**
 * "Which renewal situation applies to you?" — renders each scenario as a card
 * (mobile) and a table row (sm+) with the likely form, a quick answer, and a
 * warning. Conditional-card and lost/stolen rows are visually highlighted.
 */
export default function RenewalReasonCards({
  title = "Which Green Card Renewal Situation Applies to You?",
  intro,
  reasons,
}: {
  title?: string;
  intro?: string;
  reasons: RenewalReason[];
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      {intro && <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{intro}</p>}

      {/* Mobile: cards */}
      <div className="mt-4 space-y-3 sm:hidden">
        {reasons.map((r) => (
          <div
            key={r.reason}
            className={`rounded-2xl border p-4 shadow-card ${
              r.highlight ? "border-amber-300 bg-amber-50/60" : "border-ink-900/10 bg-white"
            }`}
          >
            <p className="text-sm font-bold text-ink-900">{r.reason}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-700">{r.likelyForm}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{r.quickAnswer}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">Warning:</span> {r.warning}
            </p>
          </div>
        ))}
      </div>

      {/* sm+: table */}
      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              <th className="p-3 font-semibold">Situation</th>
              <th className="p-3 font-semibold">Likely form</th>
              <th className="p-3 font-semibold">Quick answer</th>
              <th className="p-3 font-semibold">Warning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5 bg-white">
            {reasons.map((r) => (
              <tr key={r.reason} className={`align-top ${r.highlight ? "bg-amber-50/60" : ""}`}>
                <td className="p-3 font-semibold text-ink-900">{r.reason}</td>
                <td className="p-3 font-medium text-emerald-700">{r.likelyForm}</td>
                <td className="p-3 text-ink-600">{r.quickAnswer}</td>
                <td className="p-3 text-amber-800">{r.warning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
