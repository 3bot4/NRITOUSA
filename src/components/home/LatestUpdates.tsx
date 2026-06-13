import Link from "next/link";
import { getRecentArticles } from "@/lib/articles";
import { topics } from "@/lib/topics";

/**
 * "Latest updates" — a dense, Investopedia-style list pulled from the existing
 * guide library (newest first). Compact divided rows, not cards: small leading
 * icon, tight headline, one-line dek, and a small tag · date · read-time meta.
 */

const topicOf = (slug: string) => topics.find((t) => t.slug === slug);

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default function LatestUpdates() {
  const items = getRecentArticles(8);
  if (!items.length) return null;

  return (
    <section aria-labelledby="latest-updates-h" className="mt-10">
      <div className="mb-1 flex items-baseline justify-between">
        <h2
          id="latest-updates-h"
          className="text-sm font-bold uppercase tracking-wide text-ink-500"
        >
          Latest updates
        </h2>
        <Link
          href="/tools"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          All tools →
        </Link>
      </div>

      <ul>
        {items.map((a) => {
          const t = topicOf(a.topic);
          return (
            <li key={a.slug} className="border-b border-gray-200 last:border-0">
              <Link
                href={`/articles/${a.slug}`}
                className="group flex items-start gap-3 py-3"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-base leading-none"
                  aria-hidden
                >
                  {t?.icon ?? "📄"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold leading-snug text-ink-900 group-hover:text-brand-700">
                    {a.title}
                  </span>
                  {a.excerpt && (
                    <span className="mt-0.5 block truncate text-xs text-ink-500">
                      {a.excerpt}
                    </span>
                  )}
                  <span className="mt-0.5 block text-[11px] text-ink-400">
                    {t?.label ?? "Guide"} · {fmtDate(a.date)} · {a.readingTime}{" "}
                    min read
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
