import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { topicHeroImage } from "@/lib/stockImages";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { topics, getTopic } from "@/lib/topics";
import { getArticlesByTopic } from "@/lib/articles";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
  topicCollectionJsonLd,
  topicPath,
} from "@/lib/seo";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const topic = getTopic(params.slug);
  if (!topic) return { title: "Topic not found" };
  return pageMetadata({
    title: topic.seoTitle ?? topic.title,
    description: topic.seoDescription ?? topic.description,
    path: topicPath(topic.slug),
  });
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) notFound();

  const articles = getArticlesByTopic(topic.slug);
  const hero = topicHeroImage(topic.slug);

  const jsonLd = jsonLdGraph(
    topicCollectionJsonLd(topic, articles),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Guides", url: "/topics" },
      { name: topic.title, url: topicPath(topic.slug) },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${topic.accent}`}
      >
        {hero && (
          <Image
            src={hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-80 mix-blend-multiply ${topic.accent}`}
        />
        <div className="absolute inset-0 bg-ink-900/50" />
        <Container className="relative py-16 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/topics" className="hover:text-white">
              Guides
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{topic.label}</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              {topic.icon}
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {topic.title}
              </h1>
              <p className="mt-1 text-sm font-medium text-white/80">
                {articles.length} guide{articles.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            {topic.description}
          </p>
        </Container>
      </section>

      {topic.slug === "taxes" && (
        <section className="border-b border-ink-900/5 bg-gradient-to-br from-brand-50 to-indigo-50 py-6">
          <Container>
            <Link
              href="/nri-wealth-checkup"
              className="group flex flex-col gap-2 rounded-2xl border border-brand-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Free Tool
                </p>
                <h2 className="mt-1 text-base font-bold tracking-tight text-ink-900">
                  NRI Wealth Checkup — FBAR, FATCA &amp; India Tax Organizer
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  Add your U.S. and India assets, income, NRE/NRO accounts, and TDS to get an
                  educational FBAR, FATCA, PFIC, and CPA/CA checklist. Free, private, no account.
                </p>
              </div>
              <span className="flex-none text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                Start Wealth Checkup{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          </Container>
        </section>
      )}

      <section className="py-10 sm:py-12">
        <Container>
          {articles.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="dense" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-ink-800">
                Guides coming soon
              </p>
              <p className="mt-2 text-ink-500">
                We&apos;re writing in-depth articles for this topic. Subscribe
                below to get notified.
              </p>
              <Link
                href="/topics"
                className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
              >
                Browse other topics
              </Link>
            </div>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
