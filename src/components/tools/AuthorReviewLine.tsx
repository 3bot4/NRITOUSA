import Link from "next/link";
import { author } from "@/lib/author";
import NumbersChecked from "@/components/NumbersChecked";

/**
 * Compact "Written / reviewed by" credibility line for the PERM cluster pages.
 * Links to the author's bio page (E-E-A-T). Rendered near the foot of each page.
 */
export default function AuthorReviewLine({
  lastUpdated,
  className = "",
  hideCredentials = false,
  path,
}: {
  /**
   * The page's own path. When given, a logged weekly numbers check
   * (data/page-checks.json) renders beside "Last updated".
   */
  path?: string;
  /** Optional "Last updated" stamp shown alongside the byline. */
  lastUpdated?: string;
  className?: string;
  /**
   * Suppress the finance credentials line.
   *
   * WHY: "CA, Series 65" are accountancy and investment-adviser credentials.
   * Printing them under "Written / reviewed by" on an immigration page implies
   * the content carries professional immigration review, which it does not —
   * no licensed immigration attorney reviewed it. On immigration pages we show
   * authorship only, and say plainly that it is not legal review.
   */
  hideCredentials?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex max-w-3xl flex-col gap-1.5 rounded-2xl border border-ink-900/10 bg-white px-5 py-4 text-sm text-ink-600 shadow-card sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p>
        Written / reviewed by{" "}
        <Link
          href="/about-deepak"
          className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700"
        >
          Deepak Middha
        </Link>
        {!hideCredentials && (
          <span className="text-ink-400"> · {author.credentials}</span>
        )}
      </p>
      {hideCredentials && (
        <p className="text-xs text-ink-400">
          Author and editorial review. Not reviewed by a licensed immigration
          attorney, and not legal advice.
        </p>
      )}
      {lastUpdated && (
        <p className="text-xs text-ink-400">
          Last updated: {lastUpdated}
          {path && <NumbersChecked path={path} className="block" />}
        </p>
      )}
    </div>
  );
}
