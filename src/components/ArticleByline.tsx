import Link from "next/link";
import type { Article } from "@/types";
import { author as owner, authorInitials as ownerInitials } from "@/lib/author";
import { resolveByline } from "@/lib/byline";
import { formatDate } from "@/lib/format";

/**
 * Author byline + reviewer box rendered at the top of every article.
 *
 * - In-house articles are attributed to and reviewed by Deepak Middha.
 * - Guest contributor articles show "By <Contributor>" (linked to their author
 *   profile) plus their role, with Deepak shown as the editorial reviewer.
 *
 * Every article — in-house or guest — surfaces the same strengthened reviewer
 * card (full name + credentials, one-line bio, last-reviewed date, a
 * "Sources verified" badge, and a "View full profile" link) for E-E-A-T.
 *
 * Bylines resolve from lib/byline, so this stays consistent everywhere.
 */
export default function ArticleByline({ article }: { article: Article }) {
  const by = resolveByline(article);
  const date = article.updated ?? article.date;

  return (
    <div className="mt-6">
      {/* Primary attribution line */}
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

      {/* Strengthened reviewer box — shown on every article */}
      <div className="mt-4 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
            {ownerInitials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-900">
              Reviewed by {owner.byline}
            </p>
            <p className="mt-0.5 text-sm leading-[1.5] text-ink-500">
              {owner.reviewerBio}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="text-ink-400">
                Last reviewed: {formatDate(date)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                <span aria-hidden>✓</span> Sources verified
              </span>
              <Link
                href={owner.url}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                View full profile <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
