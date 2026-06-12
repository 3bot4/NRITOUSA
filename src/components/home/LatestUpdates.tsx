import Link from "next/link";
import { getFeaturedArticles, getRecentArticles } from "@/lib/articles";
import { topics } from "@/lib/topics";
import type { Article } from "@/types";

/**
 * "Latest updates" — one featured headline + three secondary links, pulled from
 * the existing guide library. Falls back gracefully if no article is flagged
 * featured. Investopedia-style: dense, link-forward, low chrome.
 */

const topicLabel = (slug: string) =>
  topics.find((t) => t.slug === slug)?.label ?? "Guide";

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default function LatestUpdates() {
  const featured: Article | undefined = getFeaturedArticles()[0];
  // Three most-recent guides that aren't the featured one.
  const secondary = getRecentArticles(6)
    .filter((a) => a.slug !== featured?.slug)
    .slice(0, 3);

  if (!featured) return null;

  return (
    <section aria-labelledby="latest-updates-h">
      <div className="mb-3 flex items-baseline justify-between">
        <h2
          id="latest-updates-h"
          className="text-sm font-bold uppercase tracking-wide text-ink-500"
        >
          Latest updates
        </h2>
        <Link
          href="/topics"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          All guides →
        </Link>
      </div>

      {/* Featured */}
      <Link
        href={`/articles/${featured.slug}`}
        className="group block rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:p-6"
      >
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700">
            {topicLabel(featured.topic)}
          </span>
          <span className="text-ink-400">{fmtDate(featured.date)}</span>
        </div>
        <h3 className="mt-3 text-xl font-extrabold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700 sm:text-2xl">
          {featured.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {featured.excerpt}
        </p>
      </Link>

      {/* Secondary links */}
      <ul className="mt-3 divide-y divide-ink-900/5 rounded-2xl border border-ink-900/5 bg-white">
        {secondary.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/articles/${a.slug}`}
              className="group flex items-start gap-3 p-4 transition-colors hover:bg-ink-900/[0.02]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug text-ink-800 group-hover:text-brand-700">
                  {a.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-400">
                  {topicLabel(a.topic)} · {fmtDate(a.date)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
