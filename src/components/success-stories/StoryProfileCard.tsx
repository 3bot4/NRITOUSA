import Link from "next/link";
import type { Contributor, SuccessStory } from "@/lib/successStories";
import ContributorAvatar from "./ContributorAvatar";
import { TrackedLinkedinLink } from "./TrackedLinks";

/**
 * Featured-person / contributor identity card shown near the end of a story.
 * Links to the person's internal profile and their approved LinkedIn (used in
 * Person `sameAs` schema too). LinkedIn is external + tracked; no LinkedIn image
 * is ever hotlinked.
 */
export default function StoryProfileCard({
  story,
  contributor,
}: {
  story: SuccessStory;
  contributor: Contributor;
}) {
  return (
    <section
      aria-labelledby="profile-heading"
      className="rounded-2xl border border-ink-900/10 bg-slate-50/60 p-6 sm:p-7"
    >
      <h2 id="profile-heading" className="sr-only">
        About {contributor.fullName}
      </h2>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <ContributorAvatar contributor={contributor} size={72} />
        <div className="flex-1">
          <p className="text-lg font-bold text-ink-900">
            {contributor.fullName}
          </p>
          <p className="text-sm font-medium text-brand-700">
            {contributor.currentTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            {contributor.approvedBio}
          </p>
          {contributor.areasOfExperience.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {contributor.areasOfExperience.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-ink-900/10 bg-white px-2.5 py-0.5 text-xs font-medium text-ink-600"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
            <Link
              href={contributor.authorPageUrl}
              className="text-brand-600 hover:text-brand-700"
            >
              Full profile →
            </Link>
            {contributor.linkedinUrl && (
              <TrackedLinkedinLink
                href={contributor.linkedinUrl}
                event={{
                  story_slug: story.slug,
                  subject_name: contributor.fullName,
                }}
                className="text-brand-600 hover:text-brand-700"
              >
                LinkedIn ↗
              </TrackedLinkedinLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
