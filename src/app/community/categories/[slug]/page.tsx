import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import PostRow from "@/components/community/PostRow";
import CommunityDisclaimer from "@/components/community/Disclaimer";
import Newsletter from "@/components/Newsletter";
import { getCategoryBySlug, getPosts, type SortKey } from "@/lib/community";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  absoluteUrl,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category not found" };
  const title = `${category.name} — NRI Community`;
  const description =
    category.description ??
    `Community discussions about ${category.name} for NRIs in the USA.`;
  const path = `/community/categories/${category.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

const FILTERS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recent" },
  { key: "popular", label: "Popular" },
  { key: "unanswered", label: "Unanswered" },
  { key: "pinned", label: "Pinned" },
];

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const sort = (FILTERS.find((f) => f.key === searchParams.sort)?.key ??
    "recent") as SortKey;
  const posts = await getPosts({ categoryId: category.id, sort, limit: 50 });

  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(`/community/categories/${category.slug}`)}#collection`,
      name: category.name,
      description: category.description ?? undefined,
      url: absoluteUrl(`/community/categories/${category.slug}`),
      inLanguage: "en-US",
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Community", url: "/community" },
      { name: category.name, url: `/community/categories/${category.slug}` },
    ])
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-ink-900/5 bg-white py-12 sm:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/community" className="hover:text-brand-600">Community</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-600">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
              {category.icon ?? "💬"}
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-1 max-w-2xl text-ink-500">{category.description}</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Link
                  key={f.key}
                  href={`/community/categories/${category.slug}?sort=${f.key}`}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    sort === f.key
                      ? "bg-brand-600 text-white"
                      : "border border-ink-900/10 text-ink-600 hover:bg-ink-900/[0.04]"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
            <Link href={`/community/new?category=${category.slug}`} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Start a discussion
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="mb-6"><CommunityDisclaimer compact /></div>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-ink-800">No discussions here yet</p>
            <p className="mt-2 text-ink-500">Be the first to start one.</p>
            <Link href={`/community/new?category=${category.slug}`} className="mt-5 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
              Start a discussion
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((p) => <PostRow key={p.id} post={p} />)}
          </div>
        )}
      </Container>

      <Newsletter />
    </>
  );
}
