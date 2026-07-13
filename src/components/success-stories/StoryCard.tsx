"use client";

import Link from "next/link";
import type { Contributor, SuccessStory } from "@/lib/successStories";
import { storyPath } from "@/lib/successStories";
import { formatDate } from "@/lib/format";
import ContributorAvatar from "./ContributorAvatar";
import { trackStoryCardClick } from "./analytics";

/**
 * A single story card for the hub grid. Fully keyboard-accessible: the whole
 * card is an <article> with a single anchor covering the headline; the outer
 * ring/focus styles come from `focus-within`. Emits success_story_card_click.
 */
export default function StoryCard({
  story,
  contributor,
  position,
  featured = false,
}: {
  story: SuccessStory;
  contributor: Contributor;
  position: number;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover focus-within:ring-2 focus-within:ring-brand-500/40 ${
        featured ? "sm:p-8" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-brand-50 px-2.5 py-1 uppercase tracking-wider text-brand-700">
          {story.category}
        </span>
        {featured && (
          <span className="rounded-full bg-accent-100 px-2.5 py-1 uppercase tracking-wider text-accent-700">
            Featured
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <ContributorAvatar contributor={contributor} size={56} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink-900">
            {contributor.fullName}
          </p>
          <p className="truncate text-xs text-ink-500">
            {contributor.currentTitle}
          </p>
        </div>
      </div>

      <h3
        className={`mt-5 font-bold leading-snug text-ink-900 ${
          featured ? "text-xl sm:text-2xl" : "text-lg"
        }`}
      >
        <Link
          href={storyPath(story.slug)}
          onClick={() =>
            trackStoryCardClick({
              story_slug: story.slug,
              subject_name: contributor.fullName,
              card_position: position,
              category: story.category,
            })
          }
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {story.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
        {story.teaser}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
        {story.countries.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <span aria-hidden>📍</span>
            {story.countries.join(" → ")}
          </span>
        )}
        <time dateTime={story.publicationDate}>
          {formatDate(story.publicationDate)}
        </time>
        <span aria-hidden>·</span>
        <span>{story.readingTime} min read</span>
      </div>
    </article>
  );
}
