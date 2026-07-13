import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import StoryTimeline from "@/components/success-stories/StoryTimeline";
import StoryInterview from "@/components/success-stories/StoryInterview";
import StoryMeta from "@/components/success-stories/StoryMeta";
import JourneyAtAGlance from "@/components/success-stories/JourneyAtAGlance";
import SourcesVerification from "@/components/success-stories/SourcesVerification";
import StoryProfileCard from "@/components/success-stories/StoryProfileCard";
import {
  EditorialDisclosure,
  KeyLessons,
  StoryToc,
} from "@/components/success-stories/StoryBlocks";
import {
  StoryGuideCta,
  TrackedResourceLink,
} from "@/components/success-stories/TrackedLinks";
import { renderInline } from "@/components/success-stories/prose";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
  successStoryArticleJsonLd,
} from "@/lib/seo";
import {
  getPublishableStory,
  getPublishedStories,
  getStoryContributor,
  personId,
  resolveAttribution,
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
  const attribution = resolveAttribution(story, contributor);

  const jsonLd = jsonLdGraph(
    successStoryArticleJsonLd({
      slug: story.slug,
      title: story.title,
      description: story.metaDescription,
      datePublished: story.publicationDate,
      dateModified: story.modifiedDate,
      authorIsSubject: attribution.authorIsSubject,
      subject: {
        personId: personId(contributor),
        name: contributor.fullName,
        profileUrl: contributor.authorPageUrl,
        jobTitle: contributor.currentTitle,
        sameAs: [contributor.linkedinUrl, contributor.personalWebsite].filter(
          (x): x is string => Boolean(x),
        ),
      },
    }),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Success Stories", url: "/success-stories" },
      { name: contributor.fullName, url: storyPath(story.slug) },
    ]),
  );

  const toc = [
    { id: "glance", label: "Journey at a glance" },
    { id: "lessons", label: "Key lessons" },
    { id: "journey", label: "The journey" },
    { id: "timeline", label: "Career & immigration timeline" },
    { id: "takeaways", label: "Practical takeaways" },
    { id: "sources", label: "Sources & verification" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* 1–7. Hero: breadcrumbs, classification, H1, summary, authorship, disclosure */}
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
                <span className="rounded-full bg-accent-100 px-2.5 py-1 uppercase tracking-wider text-accent-700">
                  {attribution.classificationLabel}
                </span>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 uppercase tracking-wider text-brand-700">
                  {story.category}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
                {story.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">
                {story.subtitle}
              </p>

              <StoryMeta
                story={story}
                contributor={contributor}
                attribution={attribution}
              />

              <div className="mt-6">
                <EditorialDisclosure story={story} />
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <div className="mx-auto max-w-3xl py-12 sm:py-16">
            {/* 8. Journey at a glance */}
            <div id="glance" className="scroll-mt-24">
              <JourneyAtAGlance data={story.journeyAtAGlance} />
            </div>

            {/* 9. Key lessons */}
            <div id="lessons" className="mt-12 scroll-mt-24">
              <KeyLessons lessons={story.keyLessons} />
            </div>

            {/* 10. Table of contents */}
            <div className="mt-12">
              <StoryToc items={toc} />
            </div>

            {/* 11–19. The journey (opening + Q&A body) */}
            <section id="journey" className="mt-14 scroll-mt-24">
              <div className="space-y-5 text-lg leading-8 text-ink-800">
                {story.openingScene.map((p, i) => (
                  <p key={i}>{renderInline(p, `open-${i}`)}</p>
                ))}
              </div>

              {/* One contextual, in-story link to the email-gated guide (lead-gen #1) */}
              <p className="mt-6 leading-8 text-ink-700">
                Deepak later distilled these lessons into a free{" "}
                <StoryGuideCta
                  variant="inline"
                  location="mid-article"
                  storySlug={story.slug}
                  subjectName={contributor.fullName}
                  label="Immigrant Wealth Guide"
                />{" "}
                — the version below is his story in his own words, adapted from
                that writing.
              </p>

              {story.financialFraming && (
                <p className="mt-6 rounded-2xl border border-ink-900/10 bg-slate-50/70 p-4 text-sm leading-relaxed text-ink-600">
                  {story.financialFraming}
                </p>
              )}

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                The journey, in Deepak&apos;s words
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Questions developed by the Editorial Team; answers adapted and
                condensed from Deepak&apos;s published book. Quotations are his
                own words.
              </p>
              <div className="mt-8">
                <StoryInterview exchanges={story.interview} />
              </div>
            </section>

            {/* 20. Career & immigration timeline */}
            <section id="timeline" className="mt-14 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Career &amp; immigration timeline
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Each milestone is drawn from Deepak&apos;s published writing and
                approved biography.
              </p>
              <div className="mt-8">
                <StoryTimeline milestones={story.timeline} />
              </div>
            </section>

            {/* 21. Actionable takeaways */}
            <section
              id="takeaways"
              aria-labelledby="takeaways-heading"
              className="mt-14 scroll-mt-24 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 sm:p-7"
            >
              <h2
                id="takeaways-heading"
                className="text-xl font-bold tracking-tight text-ink-900"
              >
                Practical takeaways
              </h2>
              <ul className="mt-4 space-y-3">
                {story.takeaways.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink-700">
                    <span
                      aria-hidden
                      className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
                    >
                      ✓
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl bg-white/70 p-4 text-xs leading-relaxed text-ink-500">
                {story.takeaways.disclaimer}
              </p>
            </section>

            {/* 22. Sources & verification */}
            <div id="sources" className="mt-14 scroll-mt-24">
              <SourcesVerification
                sources={story.sources}
                verificationNote="Professional information was drawn from Deepak's own published book and his approved founder biography, and reviewed by Deepak for factual accuracy. Personal outcomes he describes are his own experience, not independently verified investment results."
              />
            </div>

            {/* 23. Featured-person profile */}
            <div className="mt-14">
              <StoryProfileCard story={story} contributor={contributor} />
            </div>

            {/* 24. Related NRItoUSA guides (educational internal links) */}
            <section aria-labelledby="explore-heading" className="mt-14">
              <h2
                id="explore-heading"
                className="text-xl font-bold tracking-tight text-ink-900"
              >
                Related NRI to USA guides
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

            {/* 25. Related success stories */}
            <section className="mt-14">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">
                More NRI success stories
              </h2>
              <p className="mt-3 text-ink-600">
                We publish new immigrant journeys regularly.{" "}
                <Link
                  href="/success-stories"
                  className="font-semibold text-brand-600 underline"
                >
                  Browse the Success Stories hub
                </Link>{" "}
                to see what&apos;s next.
              </p>
            </section>

            {/* 26. Final CTA (lead-gen #2, after related resources) */}
            <StoryGuideCta
              location="end-article"
              storySlug={story.slug}
              subjectName={contributor.fullName}
              label="Get Deepak's Free Immigrant Wealth Guide"
              sublabel="The mindset traps, the currency-risk math, and a step-by-step investment checklist for new immigrants — emailed as a free PDF."
            />

            {/* 27–28. Disclaimer + corrections link */}
            <div className="mt-12 border-t border-ink-900/5 pt-6 text-xs leading-relaxed text-ink-400">
              <p>
                This profile is educational and reflects Deepak&apos;s personal
                experience and published writing. It is not individualized
                financial, tax, legal, investment, or immigration advice, and
                personal outcomes are not a promise of future results.
              </p>
              <p className="mt-2">
                <Link
                  href="/success-stories/editorial-methodology"
                  className="font-semibold text-brand-600 underline"
                >
                  Corrections &amp; editorial policy
                </Link>{" "}
                ·{" "}
                <Link
                  href="/success-stories"
                  className="font-semibold text-brand-600 underline"
                >
                  All NRI Success Stories
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </article>

      <Newsletter />
    </>
  );
}
