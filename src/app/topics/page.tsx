import type { Metadata } from "next";
import Container from "@/components/Container";
import TopicCard from "@/components/TopicCard";
import Newsletter from "@/components/Newsletter";
import { topics } from "@/lib/topics";
import { getArticlesByTopic } from "@/lib/articles";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

const title = "All Guides for NRIs & Immigrants in the USA";
const description =
  "Browse every NRI to USA guide — finance, taxes, credit, housing, cars, investing, 401(k), Roth IRA, India-USA transfers, community, and immigrant stories.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/topics" },
  openGraph: { type: "website", url: "/topics", title, description },
  twitter: { title, description },
};

export default function TopicsPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Guides", url: "/topics" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-20">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Explore
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            All topics
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-500">
            {topics.length} tracks covering the money and life decisions every
            NRI and new immigrant faces in the US. Pick one and start reading.
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topics.map((topic) => (
              <TopicCard
                key={topic.slug}
                topic={topic}
                count={getArticlesByTopic(topic.slug).length}
              />
            ))}
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
