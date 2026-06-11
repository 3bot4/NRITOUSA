import Link from "next/link";
import type { Article } from "@/types";
import { getTopic } from "@/lib/topics";
import { formatDate } from "@/lib/format";
import { resolveByline } from "@/lib/byline";

export default function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "default" | "compact";
}) {
  const topic = getTopic(article.topic);
  const by = resolveByline(article);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/articles/${article.slug}`} className="flex h-full flex-col">
        {/* Gradient cover stands in for a hero image */}
        <div
          className={`relative aspect-[16/9] w-full bg-gradient-to-br ${
            topic?.accent ?? "from-brand-500 to-brand-700"
          }`}
        >
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-800 backdrop-blur">
            {topic?.label ?? "Guide"}
          </span>
          <span className="absolute bottom-3 left-4 text-4xl opacity-90">
            {topic?.icon}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3
            className={`font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600 ${
              variant === "compact" ? "text-base" : "text-lg"
            }`}
          >
            {article.title}
          </h3>
          {variant !== "compact" && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
              {article.excerpt}
            </p>
          )}

          <div className="mt-auto flex items-center gap-3 pt-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
              {by.initials}
            </span>
            <div className="text-xs text-ink-400">
              <span className="font-medium text-ink-600">{by.name}</span>
              <span className="mx-1.5">·</span>
              <span>{formatDate(article.date)}</span>
              <span className="mx-1.5">·</span>
              <span>{article.readingTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
