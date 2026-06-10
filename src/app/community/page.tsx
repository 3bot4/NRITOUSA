import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";
import SearchBar from "@/components/community/SearchBar";
import CategoryCard from "@/components/community/CategoryCard";
import PostRow from "@/components/community/PostRow";
import CommunityDisclaimer from "@/components/community/Disclaimer";
import {
  getCategories,
  getPinnedPosts,
  getRecentPosts,
  getPopularPosts,
  getPosts,
  searchPosts,
} from "@/lib/community";
import { COMMUNITY_RULES } from "@/lib/community-utils";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

const title = "NRI Community Discussions";
const description =
  "Join NRI to USA community discussions about finance, housing, cars, taxes, investing, India-USA money, retirement, and immigrant life.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/community" },
  openGraph: { type: "website", url: "/community", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default async function CommunityHome({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();

  const [categories, pinned, recent, popular] = await Promise.all([
    getCategories(),
    getPinnedPosts(4),
    getRecentPosts(8),
    getPopularPosts(6),
  ]);

  // Per-category counts for the cards
  const countsArr = await Promise.all(
    categories.map((c) => getPosts({ categoryId: c.id, limit: 100 }))
  );
  const counts = new Map(categories.map((c, i) => [c.id, countsArr[i].length]));

  const searchResults = q ? await searchPosts(q) : null;

  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Community", url: "/community" },
    ])
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-brand-700 to-emerald-700">
        <div className="absolute inset-0 bg-ink-900/30" />
        <Container className="relative py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            NRI to USA Community
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Real experiences from NRIs building a life in America
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Ask questions, share what worked, and learn from others navigating money
            and life across India and the USA — banking, taxes, housing, investing,
            retirement, and the long NRI journey.
          </p>
          <div className="mt-6">
            <SearchBar initial={q ?? ""} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/community/new" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90">
              Start a discussion
            </Link>
            <Link href="/signup" className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25">
              Join the community
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <CommunityDisclaimer />
      </Container>

      {/* Search results */}
      {searchResults && (
        <Container className="pb-8">
          <SectionHeading eyebrow="Search" title={`Results for “${q}”`} />
          {searchResults.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-8 text-center text-ink-500">
              No discussions matched. Try different keywords, or{" "}
              <Link href="/community/new" className="text-brand-600 underline">start a new discussion</Link>.
            </p>
          ) : (
            <div className="grid gap-4">
              {searchResults.map((p) => <PostRow key={p.id} post={p} />)}
            </div>
          )}
        </Container>
      )}

      {/* Categories */}
      {!searchResults && (
        <>
          <Container className="pb-12">
            <SectionHeading eyebrow="Browse" title="Categories" />
            {categories.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => (
                  <CategoryCard key={c.id} category={c} count={counts.get(c.id)} />
                ))}
              </div>
            )}
          </Container>

          {/* Pinned */}
          {pinned.length > 0 && (
            <Container className="pb-12">
              <SectionHeading eyebrow="From the team" title="Pinned discussions" />
              <div className="grid gap-4">
                {pinned.map((p) => <PostRow key={p.id} post={p} />)}
              </div>
            </Container>
          )}

          <div className="grid gap-10 lg:grid-cols-2">
            <Container className="pb-4">
              <SectionHeading eyebrow="Fresh" title="Recent discussions" />
              <div className="grid gap-4">
                {recent.length ? recent.map((p) => <PostRow key={p.id} post={p} />) : <EmptyState />}
              </div>
            </Container>
            <Container className="pb-4">
              <SectionHeading eyebrow="Most read" title="Popular discussions" />
              <div className="grid gap-4">
                {popular.length ? popular.map((p) => <PostRow key={p.id} post={p} />) : <EmptyState />}
              </div>
            </Container>
          </div>
        </>
      )}

      {/* Rules preview + CTA */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Community rules" title="A respectful, honest space" />
              <ul className="space-y-3">
                {COMMUNITY_RULES.slice(0, 5).map((r) => (
                  <li key={r.title} className="flex gap-3">
                    <span aria-hidden className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">✓</span>
                    <span className="text-ink-700"><strong className="font-semibold text-ink-900">{r.title}.</strong> {r.body}</span>
                  </li>
                ))}
              </ul>
              <Link href="/community/rules" className="mt-5 inline-block font-semibold text-brand-600 hover:text-brand-700">
                Read all community rules →
              </Link>
            </div>
            <div className="flex flex-col justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-600 p-8 text-white">
              <h3 className="text-2xl font-bold tracking-tight">Have a question?</h3>
              <p className="mt-2 text-white/90">
                Start a discussion and tap into the experience of NRIs who&apos;ve been where you are.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/community/new" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-white/90">
                  Start a discussion
                </Link>
                <Link href="/signup" className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/25">
                  Join the community
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-10 text-center">
      <p className="text-lg font-semibold text-ink-800">Discussions are loading soon</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
        If you&apos;re the admin and this looks empty, make sure Supabase is configured and
        the schema + seed SQL have been run. See SUPABASE_SETUP.md.
      </p>
    </div>
  );
}
