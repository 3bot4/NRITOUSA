import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import StoryCard from "@/components/success-stories/StoryCard";
import StoryFilterGrid, {
  type StoryCardData,
} from "@/components/success-stories/StoryFilterGrid";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
  successStoriesCollectionJsonLd,
} from "@/lib/seo";
import {
  getFeaturedStory,
  getPublishedStories,
  getStoryContributor,
  storyPath,
} from "@/lib/successStories";

const PATH = "/success-stories";

export const metadata: Metadata = pageMetadata({
  title: "NRI Success Stories | Indian Immigrant Journeys",
  description:
    "Original interviews with Indian immigrant professionals, physicians, executives and founders sharing career, money and life lessons from America.",
  path: PATH,
});

/** Journeys we cover — an honest taxonomy of what this section is building toward. */
const coverageTopics = [
  "Technology",
  "Medicine",
  "Entrepreneurship",
  "Finance",
  "Consulting",
  "Leadership",
  "Education",
  "Career Transitions",
  "Women Leaders",
  "Community Impact",
  "Return to India",
];

/** Genuinely useful resources for a reader's own journey (three, not spammed). */
const resources = [
  {
    href: "/free-immigrant-wealth-guide",
    title: "Free Immigrant Wealth Guide",
    blurb: "The money traps to avoid and an investment checklist for new immigrants.",
  },
  {
    href: "/return-to-india",
    title: "Return to India planning",
    blurb: "Tax, accounts, and logistics for immigrants weighing a move back.",
  },
  {
    href: "/immigration",
    title: "Immigration hub",
    blurb: "H-1B, green card, USCIS, and priority-date guides in one place.",
  },
];

export default function SuccessStoriesHubPage() {
  const published = getPublishedStories();
  const featured = getFeaturedStory();

  const items: StoryCardData[] = published.map((story) => ({
    story,
    contributor: getStoryContributor(story),
  }));

  // Featured is shown in its own hero card; the grid holds the remainder.
  const gridItems = items.filter((it) => it.story.slug !== featured?.slug);

  const jsonLd = jsonLdGraph(
    successStoriesCollectionJsonLd(
      published.map((s) => ({ url: absoluteUrl(storyPath(s.slug)), name: s.title })),
    ),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Success Stories", url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-ink-900/5 bg-gradient-to-b from-brand-50/60 to-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              NRI Success Stories
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Real Indian immigrant journeys
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              First-hand stories from Indian immigrant professionals, physicians,
              executives, and founders — built from interviews and first-person
              contributions, and reviewed by the people who lived them. The wins,
              but also the setbacks, the money mistakes, and the adaptation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/success-stories/editorial-methodology"
                className="rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                How these stories are made
              </Link>
              <Link
                href="/contributors"
                className="rounded-xl border border-ink-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Meet the contributors
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 leading-8 text-ink-700">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Why immigrant journeys are worth reading
            </h2>
            <p>
              When you move to a new country, the most valuable guidance rarely
              comes from a textbook. It comes from someone who was recently in your
              shoes — who figured out the first apartment, the first tax return, the
              first job change, the decision to invest, or the choice to move back
              to India. These are the details search engines can&apos;t fabricate,
              and they&apos;re why first-hand experience matters.
            </p>
            <p>
              This section collects real journeys of Indian immigrants and NRIs
              across technology, medicine, finance, entrepreneurship, consulting,
              and leadership — as well as career transitions and return-to-India
              decisions. Some subjects arrived as students; others on work visas or
              through sponsorship. What they share is the experience of adapting
              professionally and financially in America.
            </p>
            <p>
              We&apos;re deliberate about trust. Every published story is built from
              a direct interview or a first-person contribution, checked against
              approved source material, and reviewed by the subject for accuracy.
              Accomplishments don&apos;t erase the hard parts — the setbacks, the
              mistakes, the family obligations, the years of immigration uncertainty
              — and the best stories keep both in view. Read our{" "}
              <Link
                href="/success-stories/editorial-methodology"
                className="font-semibold text-brand-600 underline"
              >
                editorial methodology
              </Link>{" "}
              to see exactly how.
            </p>
          </div>
        </Container>
      </section>

      {/* Featured story */}
      {featured && (
        <section className="border-t border-ink-900/5 bg-slate-50/60 py-14 sm:py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Featured story
            </h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                  Meet the founder
                </p>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                  <Link
                    href={storyPath(featured.slug)}
                    className="hover:text-brand-700"
                  >
                    {featured.title}
                  </Link>
                </h3>
                <p className="mt-4 leading-8 text-ink-600">{featured.teaser}</p>
                <blockquote className="mt-5 border-l-4 border-brand-500 pl-4 text-lg font-medium italic text-ink-800">
                  “{featured.pullQuote}”
                </blockquote>
                <Link
                  href={storyPath(featured.slug)}
                  className="mt-6 inline-flex items-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                >
                  Read the story →
                </Link>
              </div>
              <div className="mx-auto w-full max-w-sm">
                <StoryCard
                  story={featured}
                  contributor={getStoryContributor(featured)}
                  position={1}
                  featured
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* More stories */}
      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            {gridItems.length > 0 ? "More journeys" : "More journeys coming soon"}
          </h2>
          {gridItems.length === 0 ? (
            <p className="mt-3 max-w-2xl text-ink-600">
              We&apos;re interviewing more immigrant professionals now. New stories
              are published regularly — subscribe below to get them, or explore the
              practical guides while you wait.
            </p>
          ) : (
            <div className="mt-8">
              <StoryFilterGrid items={gridItems} />
            </div>
          )}
        </Container>
      </section>

      {/* Journeys we cover (honest taxonomy) */}
      <section className="border-t border-ink-900/5 bg-slate-50/60 py-14 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Journeys we cover
            </h2>
            <p className="mt-3 text-ink-600">
              The kinds of immigrant experiences this section is building toward.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {coverageTopics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink-900/10 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-600"
              >
                {t}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust block */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-7 shadow-card sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              How these stories are produced
            </h2>
            <ul className="mt-4 space-y-2.5 text-ink-700">
              {[
                "Built from direct interviews or first-person submissions",
                "Identity, role, and career details verified against approved sources",
                "Reviewed by the subject for factual accuracy before publishing",
                "Edited independently — inclusion is never sold and implies no endorsement",
                "Corrections welcomed and made promptly",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                  >
                    ✓
                  </span>
                  <span className="text-[0.95rem] leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/success-stories/editorial-methodology"
              className="mt-5 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Read the full editorial methodology →
            </Link>
          </div>
        </Container>
      </section>

      {/* Practical resources */}
      <section className="border-t border-ink-900/5 bg-slate-50/60 py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            Practical resources for your own journey
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {resources.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="font-bold text-ink-900 group-hover:text-brand-700">
                  {r.title}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-ink-500">
                  {r.blurb}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
