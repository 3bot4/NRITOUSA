import Link from "next/link";
import type { Article } from "@/types";
import { author as owner } from "@/lib/author";
import { resolveByline } from "@/lib/byline";
import { formatDate } from "@/lib/format";

/**
 * Author byline rendered at the top of every article.
 *
 * - In-house articles show "Reviewed by Deepak Middha, CA, Series 65".
 * - Guest contributor articles show "By <Contributor>" (linked to their author
 *   profile) plus their role, and a separate "Reviewed by Deepak Middha, CA"
 *   editorial line for E-E-A-T.
 *
 * Bylines resolve from lib/byline, so this stays consistent everywhere.
 */
export default function ArticleByline({ article }: { article: Article }) {
  const by = resolveByline(article);
  const date = article.updated ?? article.date;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
          {by.initials}
        </span>
        <div className="text-sm">
          <p className="font-semibold text-ink-800">
            {by.isContributor ? "By " : "Reviewed by "}
            <Link href={by.url} className="text-brand-600 hover:text-brand-700">
              {by.isContributor ? by.name : owner.byline}
            </Link>
          </p>
          <p className="text-ink-400">
            {by.isContributor ? `${by.role} · ` : ""}
            Updated {formatDate(date)} · {article.readingTime} min read
          </p>
        </div>
      </div>

      {by.isContributor && (
        <p className="mt-3 text-xs text-ink-400">
          Reviewed by{" "}
          <Link href={owner.url} className="text-brand-600 hover:text-brand-700">
            {owner.reviewerByline}
          </Link>
        </p>
      )}
    </div>
  );
}
