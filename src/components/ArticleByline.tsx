import Link from "next/link";
import type { Article } from "@/types";
import { author as owner, authorInitials as ownerInitials } from "@/lib/author";
import { resolveByline } from "@/lib/byline";
import { formatDate } from "@/lib/format";

/**
 * Author byline rendered under the title of every article.
 *
 * ONE block, deliberately. This used to render an attribution line *and* a
 * separate reviewer card beneath it. On an in-house article — which is nearly
 * all of them — both opened with the identical string "Reviewed by Deepak
 * Middha, CA, Series 65", so every article led with the same sentence twice,
 * and repeated the date ("Updated …" then "Last reviewed …") while the meta
 * row above the H1 was already showing the date and reading time a third time.
 *
 * The E-E-A-T signals that card carried are all kept, just inline: full name
 * with credentials, the review date, the sources-verified badge, and a link to
 * the full profile. Articles that want the long-form bio and expertise tags
 * render AuthorBioBox at the foot instead, where a full card belongs.
 *
 * Guest contributor articles are the one case with two names, because there
 * genuinely are two people: "By <Contributor>" plus Deepak as reviewer. That is
 * attribution, not repetition.
 *
 * Bylines resolve from lib/byline, so this stays consistent everywhere.
 */
export default function ArticleByline({ article }: { article: Article }) {
  const by = resolveByline(article);
  const date = article.updated ?? article.date;

  return (
    <div className="mt-5 flex items-center gap-3">
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
        {by.isContributor ? by.initials : ownerInitials}
      </span>

      <div className="min-w-0 text-sm">
        <p className="font-semibold text-ink-800">
          {by.isContributor ? "By " : "Reviewed by "}
          <Link href={by.url} className="text-brand-600 hover:text-brand-700">
            {by.isContributor ? by.name : owner.byline}
          </Link>
          {by.isContributor && (
            <span className="font-normal text-ink-400"> · {by.role}</span>
          )}
        </p>

        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-400">
          {by.isContributor && (
            <>
              <span>
                Reviewed by{" "}
                <Link
                  href={owner.url}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  {owner.byline}
                </Link>
              </span>
              <span aria-hidden>·</span>
            </>
          )}
          <span>Last reviewed {formatDate(date)}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
            <span aria-hidden>✓</span> Sources verified
          </span>
          {!by.isContributor && (
            <>
              <span aria-hidden>·</span>
              <Link
                href={owner.url}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Full profile <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
