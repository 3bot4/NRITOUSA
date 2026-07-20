import Link from "next/link";
import { author, authorInitials } from "@/lib/author";

/**
 * Author bio box for the foot of rebuilt SEO pages: Deepak Middha with
 * page-relevant expertise tags plus the standard editorial disclosure.
 * Pass `tags` relevant to the page topic (e.g. ["Indian passport & VFS",
 * "US immigration timelines"]).
 */
export default function AuthorBioBox({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[720px] rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
          {authorInitials}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink-900">
            {author.byline}
            <span className="ml-2 font-normal text-ink-400">
              {author.jobTitle}
            </span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            {author.reviewerBio}{" "}
            <Link
              href={author.url}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              View full profile →
            </Link>
          </p>
          {tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-ink-900/10 bg-slate-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-600"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-ink-400">
            Educational content, not personalized tax, legal, immigration, or
            financial advice. Rules, fees, and processing times change —
            always verify with the official source before acting.
          </p>
        </div>
      </div>
    </div>
  );
}
