"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Contributor, SuccessStory } from "@/lib/successStories";
import StoryCard from "./StoryCard";
import { trackStoryFilterUsed } from "./analytics";

export interface StoryCardData {
  story: SuccessStory;
  contributor: Contributor;
}

/**
 * Grid of story cards with category filtering. The filter bar only appears once
 * there are at least two categories to choose between — so the launch view (one
 * story) never shows a lonely, pointless filter. Filtering is client-side over
 * an already-rendered list (no network, no heavy JS), which keeps it fast and
 * accessible. When the grid is empty it shows an honest empty state instead of
 * fabricating cards.
 */
export default function StoryFilterGrid({ items }: { items: StoryCardData[] }) {
  const categories = useMemo(() => {
    const set = new Set(items.map((it) => it.story.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? items
      : items.filter((it) => it.story.category === active);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-8 text-center">
        <p className="text-ink-600">
          More journeys are on the way. In the meantime, explore practical guides
          built for your own move.
        </p>
        <Link
          href="/topics"
          className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Browse the guides →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {categories.length > 2 && (
        <div
          role="group"
          aria-label="Filter stories by category"
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActive(c);
                  if (c !== "All") trackStoryFilterUsed(c);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "border border-ink-900/10 bg-white text-ink-600 hover:bg-ink-900/[0.03]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((it, i) => (
          <StoryCard
            key={it.story.slug}
            story={it.story}
            contributor={it.contributor}
            position={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
