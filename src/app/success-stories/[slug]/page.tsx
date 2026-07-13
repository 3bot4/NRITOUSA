import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import ContributorAvatar from "@/components/success-stories/ContributorAvatar";
import StoryTimeline from "@/components/success-stories/StoryTimeline";
import StoryInterview from "@/components/success-stories/StoryInterview";
import {
  StoryGuideCta,
  TrackedResourceLink,
  TrackedLinkedinLink,
} from "@/components/success-stories/TrackedLinks";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
  successStoryArticleJsonLd,
} from "@/lib/seo";
import { formatDate } from "@/lib/format";
import {
  getPublishableStory,
  getPublishedStories,
  getStoryContributor,
  personId,
  storyPath,
} from "@/lib/successStories";

/** Only PUBLISHED stories get routes — drafts/stubs are never reachable. */
export function generateStaticParams() {
  return getPublishedStories().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const story = getPublishableStory(params.slug);
  if (!story) return { title: "Story not found", robots: { index: false } };
  return pageMetadata({
    title: story.seoTitle,
    description: story.metaDescription,
    path: storyPath(story.slug),
    type: "article",
    socialTitle: story.title,
    socialDescription: story.metaDescription,
    openGraph: {
      publishedTime: story.publicationDate,
      modifiedTime: story.modifiedDate,
      authors: [story.byline.writtenBy],
    },
  });
}

export default function SuccessStoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const story = getPublishableStory(params.slug);
  if (!story) notFound();

  const contributor = getStoryContributor(story);
  const authorIsSubject = story.byline.writtenBy === contributor.fullName;

  const jsonLd = jsonLdGraph(
    successStoryArticleJsonLd({
      slug: story.slug,
      title: story.title,
      description: story.metaDescription,
      datePublished: story.publicationDate,
      dateModified: story.modifiedDate,
      authorIsSubject,
      subject: {
        personId: personId(contributor),
        name: contributor.fullName,
        profileUrl: contributor.authorPageUrl,
        jobTitle: contributor.currentTitle,
        sameAs: [
          contributor.linkedinUrl,
          contributor.personalWebsite,
        ].filter((x): x is string => Boolean(x)),
      },
    }),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Success Stories", url: "/success-stories" },
      { name: contributor.fullName, url: storyPath(story.slug) },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Hero */}
        <header className="border-b border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-sm text-ink-400"
              >
                <Link href="/" className="hover:text-brand-600">
                  Home
                </Link>
                <span aria-hidden>/</span>
                <Link href="/success-stories" className="hover:text-brand-600">
                  Success Stories
                </Link>
                <span aria-hidden>/</span>
                <span className="text-ink-500">{contributor.fullName}</span>
              </nav>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 uppercase tracking-wider text-brand-700">
                  {story.category}
                </span>
                <span className="rounded-full bg-accent-100 px-2.5 py-1 uppercase tracking-wider text-accent-700">
                  Meet the founder
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
                {story.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                {story.subtitle}
              </p>

              {/* Byline + meta */}
              <div className="mt-6 flex flex-col gap-4 border-t border-ink-900/5 pt-6 sm:flex-row sm:items-center sm:gap-5">
                <ContributorAvatar contributor={contributor} size={56} />
                <div className="text-sm">
                  <p className="text-ink-700">
                    <span className="font-semibold text-ink-900">
                      Interview with {contributor.fullName}
                    </span>{" "}
                    · {contributor.currentTitle}
                  </p>
                  <p className="mt-0.5 text-ink-500">
                    Written &amp; edited by {story.byline.writtenBy} · Reviewed by{" "}
                    {story.byline.reviewedBy}
                  </p>
                  <p className="mt-0.5 text-ink-400">
                    Published {formatDate(story.publicationDate)} · Last reviewed{" "}
                    {formatDate(story.verificationDate)} · {story.readingTime} min
                    read
                  </p>
                </div>
              </div>

              {/* Founder disclosure */}
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-ink-700">
                {story.disclosure}
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <div className="mx-auto max-w-3xl py-12 sm:py-16">
            {/* Opening scene */}
            <div className="space-y-5 text-lg leading-8 text-ink-800">
              {story.openingScene.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Key takeaways */}
            <section
              aria-labelledby="takeaways-heading"
              className="mt-12 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 sm:p-7"
            >
              <h2
                id="takeaways-heading"
                className="text-lg font-bold tracking-tight text-ink-900"
              >
                Key takeaways
              </h2>
              <ul className="mt-4 space-y-3">
                {story.takeaways.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-ink-700">
                    <span
                      aria-hidden
                      className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
                    >
                      ✓
                    </span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Timeline */}
            <section aria-labelledby="timeline-heading" className="mt-14">
              <h2
                id="timeline-heading"
                className="text-2xl font-bold tracking-tight text-ink-900"
              >
                Career &amp; immigration timeline
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Each milestone is drawn from Deepak&apos;s published writing and
                author biography.
              </p>
              <div className="mt-8">
                <StoryTimeline milestones={story.timeline} />
              </div>
            </section>

            {/* Mid-article lead-magnet CTA */}
            <StoryGuideCta
              location="mid-article"
              storySlug={story.slug}
              subjectName={contributor.fullName}
              label="The full playbook, free"
              sublabel="This story draws from Deepak's Immigrant Wealth Guide — the money traps and an investment checklist for new immigrants. Emailed as a free PDF."
            />

            {/* Interview */}
            <section aria-labelledby="interview-heading" className="mt-14">
              <h2
                id="interview-heading"
                className="text-2xl font-bold tracking-tight text-ink-900"
              >
                In his words
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Adapted and condensed from Deepak&apos;s book and bio; quotations
                are his own words.
              </p>
              <div className="mt-8">
                <StoryInterview exchanges={story.interview} />
              </div>
            </section>

            {/* Reader checklist */}
            <section
              aria-labelledby="checklist-heading"
              className="mt-14 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card sm:p-7"
            >
              <h2
                id="checklist-heading"
                className="text-xl font-bold tracking-tight text-ink-900"
              >
                A practical checklist from Deepak&apos;s journey
              </h2>
              <ul className="mt-4 space-y-3">
                {story.checklist.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink-700">
                    <span
                      aria-hidden
                      className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700"
                    >
                      ✓
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-ink-500">
                {story.checklist.disclaimer}
              </p>
            </section>

            {/* Book / guide callout */}
            {story.bookCallout && (
              <section className="mt-14 rounded-2xl border border-ink-900/10 bg-ink-900 p-7 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
                  From the author
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {story.bookCallout.title}
                </h2>
                <p className="mt-3 leading-relaxed text-white/80">
                  {story.bookCallout.description}
                </p>
                <TrackedResourceLink
                  href={story.bookCallout.url}
                  event={{
                    story_slug: story.slug,
                    subject_name: contributor.fullName,
                    resource_name: "book-callout",
                  }}
                  className="mt-5 inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 hover:bg-white/90"
                >
                  Read the free guide →
                </TrackedResourceLink>
                <p className="mt-3 text-xs text-white/50">
                  {story.bookCallout.note}
                </p>
              </section>
            )}

            {/* Keep exploring — internal links */}
            <section aria-labelledby="explore-heading" className="mt-14">
              <h2
                id="explore-heading"
                className="text-xl font-bold tracking-tight text-ink-900"
              >
                Keep exploring
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {story.internalLinks.map((link) => (
                  <TrackedResourceLink
                    key={link.href}
                    href={link.href}
                    event={{
                      story_slug: story.slug,
                      subject_name: contributor.fullName,
                      resource_name: link.label,
                    }}
                    className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <span className="font-bold text-ink-900 group-hover:text-brand-700">
                      {link.label}
                    </span>
                    <span className="mt-1.5 text-sm leading-relaxed text-ink-500">
                      {link.context}
                    </span>
                  </TrackedResourceLink>
                ))}
              </div>
            </section>

            {/* End lead-magnet CTA */}
            <StoryGuideCta
              location="end-article"
              storySlug={story.slug}
              subjectName={contributor.fullName}
              label="Start where Deepak wishes he had"
              sublabel="Get the Free Immigrant Wealth Guide — the mindset traps, the currency-risk math, and a step-by-step investment checklist for new immigrants."
            />

            {/* Connect */}
            <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-ink-900">
                  More about {contributor.fullName}
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  His full founder profile, credentials, and the tools he&apos;s
                  built.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={contributor.authorPageUrl}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  View profile
                </Link>
                {contributor.linkedinUrl && (
                  <TrackedLinkedinLink
                    href={contributor.linkedinUrl}
                    event={{
                      story_slug: story.slug,
                      subject_name: contributor.fullName,
                    }}
                    className="rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
                  >
                    LinkedIn ↗
                  </TrackedLinkedinLink>
                )}
              </div>
            </div>

            {/* Related / back to hub */}
            <div className="mt-10 border-t border-ink-900/5 pt-8">
              <p className="text-sm text-ink-500">
                More journeys are on the way. In the meantime, browse the{" "}
                <Link
                  href="/free-immigrant-wealth-guide"
                  className="font-semibold text-brand-600 underline"
                >
                  Immigrant Wealth Guide
                </Link>{" "}
                or explore{" "}
                <Link
                  href="/long-term-nri-wealth"
                  className="font-semibold text-brand-600 underline"
                >
                  long-term NRI wealth
                </Link>
                .
              </p>
              <Link
                href="/success-stories"
                className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                ← All NRI Success Stories
              </Link>
            </div>
          </div>
        </Container>
      </article>

      <Newsletter />
    </>
  );
}
