import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { topics, getTopic } from "@/lib/topics";
import { getArticlesByTopic } from "@/lib/articles";

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
  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical: `/topics/${topic.slug}` },
    openGraph: {
      title: `${topic.title} · NRITOUSA`,
      description: topic.description,
    },
  };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug);
  if (!topic) notFound();

  const articles = getArticlesByTopic(topic.slug);

  return (
    <>
      <section
        className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${topic.accent}`}
      >
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-16 sm:py-20">
          <Link
            href="/topics"
            className="text-sm font-medium text-white/80 hover:text-white"
          >
            ← All topics
          </Link>
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

      <section className="py-16 sm:py-20">
        <Container>
          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
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
