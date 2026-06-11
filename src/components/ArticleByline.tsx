import Link from "next/link";
import { author, authorInitials } from "@/lib/author";
import { formatDate } from "@/lib/format";

/**
 * Author byline rendered at the top of every article. Shows the single real
 * author (linked to the bio page) plus a short "Reviewed by" credibility line,
 * the last-updated date, and the read time. Bylines are never per-article, so
 * this stays consistent across the whole site.
 */
export default function ArticleByline({
  date,
  readingTime,
}: {
  /** ISO date — last update if available, otherwise publish date. */
  date: string;
  readingTime: number;
}) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
        {authorInitials}
      </span>
      <div className="text-sm">
        <p className="font-semibold text-ink-800">
          Reviewed by{" "}
          <Link href={author.url} className="text-brand-600 hover:text-brand-700">
            {author.byline}
          </Link>
        </p>
        <p className="text-ink-400">
          Updated {formatDate(date)} · {readingTime} min read
        </p>
      </div>
    </div>
  );
}
