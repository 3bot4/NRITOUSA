import Link from "next/link";
import { author, authorInitials } from "@/lib/author";
import { formatDate } from "@/lib/format";

/**
 * Compact byline row for non-article pages (cluster pages, tool pages,
 * standalone guides): "Reviewed by Deepak Middha, CA, Series 65 ·
 * Updated {date} · ✓ {year} verified". The date is wired to the page's
 * actual updated/date value — never hardcode it at the call site.
 */
export default function ReviewedByline({
  date,
  className = "",
}: {
  /** ISO date (page.updated ?? page.date) — rendered human-readable. */
  date: string;
  className?: string;
}) {
  const year = date.slice(0, 4);
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-500 ${className}`}
    >
      <span className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-[0.625rem] font-bold text-brand-700">
          {authorInitials}
        </span>
        <span>
          Reviewed by{" "}
          <Link
            href={author.url}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            {author.byline}
          </Link>
        </span>
      </span>
      <span aria-hidden>·</span>
      <span>Updated {formatDate(date)}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
        <span aria-hidden>✓</span> {year} verified
      </span>
    </div>
  );
}
