import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { getTopic } from "@/lib/topics";
import { formatDate } from "@/lib/format";
import { resolveByline } from "@/lib/byline";
import { articleImage } from "@/lib/stockImages";

export default function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "default" | "compact" | "dense";
}) {
  const topic = getTopic(article.topic);
  const by = resolveByline(article);
  const cover = articleImage(article);

  // Dense: text-only, image-free card for high-density browse grids.
  if (variant === "dense") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <span className="inline-flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
          {topic?.icon && <span aria-hidden>{topic.icon}</span>}
          {topic?.label ?? "Guide"}
        </span>
        <h3 className="mt-2 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
          {article.excerpt}
        </p>
        <span className="mt-2.5 flex items-center gap-2 text-[0.6875rem] text-ink-400">
          <span className="font-semibold text-brand-600">Read guide →</span>
          <span aria-hidden>·</span>
          <span>{article.readingTime} min</span>
        </span>
      </Link>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/articles/${article.slug}`} className="flex h-full flex-col">
        {/* Stock photo cover, tinted with the topic's brand gradient */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-tr opacity-60 mix-blend-multiply ${
              topic?.accent ?? "from-brand-500 to-brand-700"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 to-transparent" />
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur">
            {topic?.icon && <span aria-hidden>{topic.icon}</span>}
            {topic?.label ?? "Guide"}
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
