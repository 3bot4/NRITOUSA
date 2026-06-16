import Link from "next/link";
import { premiumProcessing } from "@/lib/premiumProcessing";

/**
 * Full premium processing fee table. Server component — reads from the central
 * premiumProcessing data object in lib/premiumProcessing.ts.
 *
 * Use on: /uscis/processing-times, /tools/processing-times, /h1b,
 *          /h1b/premium-processing, /uscis/forms/i-907-premium-processing
 */
export default function PremiumProcessingFeeTable() {
  const { items, lastVerified, officialSourceName, officialSourceUrl, warning, effectiveDate } =
    premiumProcessing;

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
      {/* header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink-900">
            USCIS Premium Processing Fees (Form I-907)
          </h3>
          <p className="mt-0.5 text-xs text-ink-500">
            Effective {effectiveDate} · Last verified: {lastVerified}
          </p>
        </div>
        <Link
          href={officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Verify at USCIS →
        </Link>
      </div>

      {/* table — scrollable on mobile */}
      <div className="overflow-x-auto rounded-xl border border-blue-200/60 bg-white">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/60">
              <th className="px-4 py-2.5 text-left font-semibold text-ink-700">Form</th>
              <th className="px-4 py-2.5 text-left font-semibold text-ink-700">Category</th>
              <th className="px-4 py-2.5 text-right font-semibold text-ink-700">Fee</th>
              <th className="px-4 py-2.5 text-left font-semibold text-ink-700 hidden sm:table-cell">
                Timeline
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {items.map((item, i) => (
              <tr key={i} className={item.eligible ? "" : "opacity-60"}>
                <td className="px-4 py-3 font-mono font-semibold text-ink-800">
                  {item.form}
                </td>
                <td className="px-4 py-3 text-ink-600 max-w-[200px]">
                  <span>{item.category}</span>
                  {item.note && (
                    <span className="mt-0.5 block text-[10px] leading-snug text-ink-400">
                      {item.note}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {item.eligible ? (
                    <span className="font-bold text-ink-900">{item.feeDisplay}</span>
                  ) : (
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold text-ink-500">
                      Not eligible
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-500 hidden sm:table-cell">
                  {item.timelineDisplay}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* warning */}
      <p className="mt-3 text-[11px] leading-relaxed text-ink-500">
        ⚠️ {warning}{" "}
        <Link
          href={officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-700 underline"
        >
          {officialSourceName}
        </Link>
        .
      </p>
    </div>
  );
}

/**
 * Compact inline fee note — use near H-1B/I-129 premium processing mentions
 * on article pages and tool outputs.
 */
export function PremiumProcessingFeeNote({
  form = "I-129",
  showI140 = false,
}: {
  form?: string;
  showI140?: boolean;
}) {
  const { items, lastVerified, officialSourceUrl, warning } = premiumProcessing;

  const h1bItem = items.find((i) => i.form === "I-129" && i.eligible);
  const i140Item = items.find((i) => i.form === "I-140");
  const target = form === "I-140" ? i140Item : h1bItem;

  if (!target?.eligible) return null;

  return (
    <div className="my-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
      <span className="font-semibold">
        Current common {form} premium processing fee: {target.feeDisplay}
        {showI140 && i140Item && form !== "I-140" && (
          <> · I-140: {i140Item.feeDisplay}</>
        )}
      </span>
      {" "}for many eligible categories (as of {lastVerified}).{" "}
      {warning}{" "}
      <Link
        href={officialSourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline"
      >
        USCIS I-907 page
      </Link>
      .
    </div>
  );
}
