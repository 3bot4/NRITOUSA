import Link from "next/link";
import { author } from "@/lib/author";

/**
 * Compact "Written / reviewed by" credibility line for the PERM cluster pages.
 * Links to the author's bio page (E-E-A-T). Rendered near the foot of each page.
 */
export default function AuthorReviewLine({
  lastUpdated,
  className = "",
}: {
  /** Optional "Last updated" stamp shown alongside the byline. */
  lastUpdated?: string;
  className?: string;
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
        <span className="text-ink-400"> · {author.credentials}</span>
      </p>
      {lastUpdated && (
        <p className="text-xs text-ink-400">Last updated: {lastUpdated}</p>
      )}
    </div>
  );
}
