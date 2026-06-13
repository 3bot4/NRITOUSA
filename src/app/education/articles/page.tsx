import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { eduArticleSlugs, eduCalcs } from "@/lib/education";
import { getArticle } from "@/lib/articles";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "US Education Guides for Immigrant Families | nritousa.com",
  description:
    "In-depth, regularly updated guides on the US education system for immigrant and NRI families — college costs, K-12 enrollment, the SAT and ACT, and the best universities for Indian students.",
  alternates: { canonical: "/education/articles" },
  openGraph: {
    type: "website",
    url: "/education/articles",
    title: "US Education Guides for Immigrant Families",
    description:
      "Long-form guides on US college costs, the K-12 school system, the digital SAT, and the best universities for immigrant students.",
  },
};

export default function EducationArticlesPage() {
  const url = absoluteUrl("/education/articles");
  const articles = eduArticleSlugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${url}#collection`,
      name: "US Education Guides for Immigrant Families",
      description: metadata.description,
      url,
      isPartOf: { "@id": `${site.url}/#website` },
      inLanguage: "en-US",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: articles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: articleUrl(a.slug),
          name: a.title,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Education", url: "/education" },
      { name: "Guides", url: "/education/articles" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-ink-900/5 bg-gradient-to-br from-indigo-600 to-blue-600">
        <div className="relative">
          <Container className="py-14 sm:py-16">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href="/education" className="hover:text-white">
                Education
              </Link>
              <span aria-hidden>/</span>
              <span className="text-white">Guides</span>
            </nav>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              US Education Guides
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
              In-depth, regularly updated explainers for immigrant and NRI
              families navigating American schools and colleges.
            </p>
          </Container>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  {a.readingTime} min read
                </span>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                  {a.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
                  {a.excerpt}
                </p>
                <span className="mt-5 text-sm font-semibold text-brand-600">
                  Read guide{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Try the tools"
            title="Education calculators"
            action={{ label: "Back to hub", href: "/education" }}
          />
          <div className="flex flex-wrap gap-3">
            {eduCalcs.map((c) => (
              <Link
                key={c.slug}
                href={`/education/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 shadow-card transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                <span aria-hidden>{c.icon}</span>
                {c.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
