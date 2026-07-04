import { formatDate } from "@/lib/format";
import { siteWideUpdatePolicy } from "@/data/siteWideVerifiedNumbers";

/**
 * "Last verified" + official-source + disclaimer footer shown under every
 * number/table on the site. Keeps the honest-sourcing pattern consistent:
 * a verified date, one or more official links (new tab), a monthly-update note,
 * and the site-wide "things can change" disclaimer.
 */
export default function OfficialSourceNote({
  sources = [],
  lastVerified,
  updateFrequency = siteWideUpdatePolicy.updateFrequency,
  disclaimer = siteWideUpdatePolicy.disclaimer,
  className = "",
}: {
  sources?: { label: string; href: string }[];
  /** ISO date or human string; ISO is formatted nicely. */
  lastVerified?: string;
  updateFrequency?: string;
  disclaimer?: string;
  className?: string;
}) {
  const verifiedHuman =
    lastVerified && /^\d{4}-\d{2}-\d{2}/.test(lastVerified) ? formatDate(lastVerified) : lastVerified;

  return (
    <div className={`rounded-xl border border-ink-900/10 bg-white/70 p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {verifiedHuman && (
          <span className="font-semibold text-ink-700">
            Last verified: <span className="text-ink-900">{verifiedHuman}</span>
          </span>
        )}
        {updateFrequency && (
          <span className="text-ink-500">· Verification cadence: {updateFrequency}</span>
        )}
      </div>

      {sources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {sources.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
      )}

      {disclaimer && <p className="mt-2 text-xs leading-relaxed text-ink-500">{disclaimer}</p>}
    </div>
  );
}
