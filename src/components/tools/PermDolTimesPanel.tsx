import {
  permProcessingData as D,
  displayValue,
  displayDays,
  isPending,
  isPendingDays,
  NOT_PUBLISHED,
  DOL_DATA_NOTE,
} from "@/data/permProcessingData";

interface Row {
  label: string;
  value: string;
  /** Missing from OUR data — warn, it is our backlog. */
  pending: boolean;
  /** DOL publishes no such figure — state it plainly, do not warn. */
  unavailable?: boolean;
}

/**
 * "Current DOL PERM processing times" panel. Reads the editable monthly config
 * and renders each queue value, falling back to "Update from DOL FLAG" for any
 * value not yet confirmed. Shared by the calculator, /dol-processing-times and
 * /pwd-processing-time.
 *
 * Two kinds of "no number" are shown differently on purpose: a value we have
 * not copied yet gets an amber warning, while a value DOL does not publish is
 * shown as neutral muted text. Rendering the second as a warning told readers
 * the page was out of date when nothing about it could ever be updated.
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
    { label: "Average PERM analyst review", value: displayDays(D.averagePermAnalystReviewDays), pending: isPendingDays(D.averagePermAnalystReviewDays), unavailable: D.averagePermAnalystReviewDays === NOT_PUBLISHED },
    { label: "Average PERM audit review", value: displayDays(D.averagePermAuditReviewDays), pending: isPendingDays(D.averagePermAuditReviewDays), unavailable: D.averagePermAuditReviewDays === NOT_PUBLISHED },
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
              ) : r.unavailable ? (
                <span className="text-xs font-medium italic text-ink-400">{r.value}</span>
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
