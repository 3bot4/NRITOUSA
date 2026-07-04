import {
  permProcessingData as D,
  displayValue,
  displayDays,
  isPending,
  DOL_DATA_NOTE,
} from "@/data/permProcessingData";

interface Row {
  label: string;
  value: string;
  pending: boolean;
}

/**
 * "Current DOL PERM processing times" panel. Reads the editable monthly config
 * and renders each queue value, falling back to "Update from DOL FLAG" for any
 * value not yet confirmed. Shared by the calculator, /dol-processing-times and
 * /pwd-processing-time.
 */
export default function PermDolTimesPanel({
  variant = "full",
}: {
  /** "full" = all queues; "pwd" = prevailing-wage rows only. */
  variant?: "full" | "pwd";
}) {
  const permRows: Row[] = [
    { label: "PERM analyst review queue", value: displayValue(D.permAnalystReviewPriorityDate), pending: isPending(D.permAnalystReviewPriorityDate) },
    { label: "PERM audit review queue", value: displayValue(D.permAuditReviewPriorityDate), pending: isPending(D.permAuditReviewPriorityDate) },
    { label: "PERM reconsideration queue", value: displayValue(D.permReconsiderationDate), pending: isPending(D.permReconsiderationDate) },
    { label: "Average PERM analyst review", value: displayDays(D.averagePermAnalystReviewDays), pending: D.averagePermAnalystReviewDays == null },
    { label: "Average PERM audit review", value: displayDays(D.averagePermAuditReviewDays), pending: D.averagePermAuditReviewDays == null },
  ];
  const pwdRows: Row[] = [
    { label: "PWD for PERM — OEWS wage source", value: displayValue(D.pwdPermOewsReceiptMonth), pending: isPending(D.pwdPermOewsReceiptMonth) },
    { label: "PWD for PERM — non-OEWS wage source", value: displayValue(D.pwdPermNonOewsReceiptMonth), pending: isPending(D.pwdPermNonOewsReceiptMonth) },
  ];

  const rows = variant === "pwd" ? pwdRows : [...pwdRows, ...permRows];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-ink-900">
          {variant === "pwd" ? "Current PWD processing times" : "Current DOL PERM processing times"}
        </h2>
        <span className="text-xs text-ink-400">Last updated: {D.lastUpdated}</span>
      </div>

      <dl className="mt-4 divide-y divide-ink-900/5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-sm text-ink-600">{r.label}</dt>
            <dd className={`text-sm font-semibold ${r.pending ? "text-amber-600" : "text-ink-900"}`}>
              {r.pending ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {r.value}
                </span>
              ) : (
                r.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        DOL processing times change monthly. We update this page based on the official{" "}
        <a href={D.dolSourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline">
          FLAG processing times
        </a>{" "}
        page. {DOL_DATA_NOTE}
      </p>
    </div>
  );
}
