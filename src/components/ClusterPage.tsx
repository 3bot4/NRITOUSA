import Link from "next/link";
import Container from "@/components/Container";
import ArticleBody from "@/components/ArticleBody";
import Newsletter from "@/components/Newsletter";
import SectionHeading from "@/components/SectionHeading";
import { formatDate } from "@/lib/format";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  extractFaq,
  faqJsonLd,
  jsonLdGraph,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  CLUSTER_BASE,
  clusterChildren,
  clusterHub,
  clusterPath,
  type ClusterPage as ClusterPageData,
} from "@/lib/passportCluster";

/**
 * Renders one page of the passport-renewal topic cluster (hub or child).
 * Mirrors the dense, no-hero article layout (see app/articles/[slug]) but
 * lives at top-level URLs (/indian-passport-renewal-usa/...) and swaps the
 * "related articles" block for cluster navigation — the hub lists every
 * child; each child links back to the hub and across to its siblings.
 */

const HUB_TITLE = "Indian Passport Renewal";

/** Minimal Article schema with the correct top-level cluster URL. */
function clusterArticleJsonLd(page: ClusterPageData) {
  const url = absoluteUrl(clusterPath(page.slug));
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.title,
    description: page.excerpt,
    datePublished: page.date,
    dateModified: page.updated ?? page.date,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export default function ClusterPage({ page }: { page: ClusterPageData }) {
  const isHub = page.kind === "hub";
  const faqs = extractFaq(page.content);

  // Cluster navigation: hub shows all children; a child shows the hub + siblings.
  const navPages = isHub
    ? clusterChildren
    : [clusterHub, ...clusterChildren.filter((c) => c.slug !== page.slug)];

  const crumbs = isHub
    ? [
        { name: "Home", url: "/" },
        { name: HUB_TITLE, url: CLUSTER_BASE },
      ]
    : [
        { name: "Home", url: "/" },
        { name: HUB_TITLE, url: CLUSTER_BASE },
        { name: page.navLabel, url: clusterPath(page.slug) },
      ];

  const jsonLd = jsonLdGraph(
    clusterArticleJsonLd(page),
    breadcrumbJsonLd(crumbs),
    ...(faqs.length ? [faqJsonLd(faqs)] : [])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <nav
                aria-label="Breadcrumb"
                className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400"
              >
                {crumbs.map((c, i) => (
                  <span key={c.url} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.url} className="hover:text-brand-600">
                        {c.name}
                      </Link>
                    ) : (
                      <span className="text-ink-500">{c.name}</span>
                    )}
                  </span>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link
                  href={CLUSTER_BASE}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🛂</span>
                  Passport
                </Link>
                <span>{page.readingTime} min read</span>
                <span aria-hidden>·</span>
                <span>{formatDate(page.updated ?? page.date)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                {page.title}
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                {page.excerpt}
              </p>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto">
              <ArticleBody content={page.content} />

              <div className="mx-auto mt-10 max-w-[720px] rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">
                  A quick note:
                </strong>{" "}
                This guide is educational and reflects general information, not
                personalized legal or immigration advice. Consular rules, fees,
                and VFS center details change — always confirm on the official{" "}
                <a
                  href="https://passportindia.gov.in"
                  className="text-brand-600 underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  Passport Seva
                </a>{" "}
                and{" "}
                <a
                  href="https://visa.vfsglobal.com/usa"
                  className="text-brand-600 underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  VFS Global
                </a>{" "}
                sites before applying.
              </div>

              {!isHub && (
                <div className="mx-auto mt-6 max-w-[720px] text-sm">
                  <Link
                    href={CLUSTER_BASE}
                    className="font-medium text-brand-600 hover:text-brand-700"
                  >
                    ← Back to the full passport renewal guide
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      </article>

      {/* Cluster navigation */}
      {navPages.length > 0 && (
        <section className="bg-white py-12 sm:py-14">
          <Container>
            <SectionHeading
              eyebrow="Keep reading"
              title={isHub ? "Explore this guide" : "More in this guide"}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {navPages.map((p) => (
                <Link
                  key={p.slug || "hub"}
                  href={clusterPath(p.slug)}
                  className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {p.kind === "city"
                      ? "City"
                      : p.kind === "hub"
                      ? "Overview"
                      : "Guide"}
                  </span>
                  <h3 className="mt-1 font-semibold text-ink-900 group-hover:text-brand-700">
                    {p.navLabel}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Newsletter />
    </>
  );
}
