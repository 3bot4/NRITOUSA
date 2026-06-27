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
import { OCI_BASE, OCI_TOOLS } from "@/lib/oci/config";
import { ociGuides, ociGuidePath, type OciGuide } from "@/lib/ociGuides";
import OciApostilleChecker from "@/components/tools/OciApostilleChecker";

/**
 * Renders one OCI pillar guide: dense article body + breadcrumb/FAQ schema,
 * cross-navigation to the other guides, and the three OCI tools. Mirrors the
 * no-hero, 720px ClusterPage layout used across the site.
 */

const HUB_TITLE = "OCI Center";

const TOOL_CARDS = [
  { ...OCI_TOOLS.eligibility, icon: "🪪", desc: "Confirm you qualify in 60 seconds." },
  { ...OCI_TOOLS.cost, icon: "💵", desc: "Line-by-line fee estimate." },
  { ...OCI_TOOLS.timeline, icon: "⏱️", desc: "Stage-by-stage delivery dates." },
];

function guideArticleJsonLd(guide: OciGuide) {
  const url = absoluteUrl(ociGuidePath(guide.slug));
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.date,
    dateModified: guide.updated ?? guide.date,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

export default function OciGuidePage({ guide }: { guide: OciGuide }) {
  const faqs = extractFaq(guide.content);
  const others = ociGuides.filter((g) => g.slug !== guide.slug);
  const isApostille = guide.slug === "apostille";

  const crumbs = [
    { name: "Home", url: "/" },
    { name: HUB_TITLE, url: OCI_BASE },
    { name: guide.navLabel, url: ociGuidePath(guide.slug) },
  ];

  const jsonLd = jsonLdGraph(
    guideArticleJsonLd(guide),
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
                  href={OCI_BASE}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🪪</span>
                  OCI Center
                </Link>
                <span>{guide.readingTime} min read</span>
                <span aria-hidden>·</span>
                <span>{formatDate(guide.updated ?? guide.date)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                {guide.title}
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                {guide.excerpt}
              </p>
            </div>
          </Container>
        </header>

        {isApostille && (
          <section className="border-b border-ink-900/5 bg-slate-50/60 py-8 sm:py-10">
            <Container>
              <div className="mb-5 flex items-start gap-3">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-xl text-white shadow-sm"
                >
                  📜
                </span>
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-600">
                    Free tool · no signup
                  </p>
                  <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                    OCI Apostille Need Checker
                  </h2>
                  <p className="mt-1 text-sm text-ink-500">
                    Answer four quick questions to see whether your document
                    likely needs apostille or attestation — and who handles it.
                  </p>
                </div>
              </div>
              <OciApostilleChecker />
            </Container>
          </section>
        )}

        <div className="py-8 sm:py-10">
          <Container>
            <ArticleBody content={guide.content} />

            <div className="mx-auto mt-10 max-w-[720px] rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
              <strong className="font-semibold text-ink-700">A quick note:</strong>{" "}
              This guide is educational and reflects general information, not
              personalized legal or immigration advice. OCI rules, fees, and VFS
              details change — always confirm on the official{" "}
              <a
                href="https://visa.vfsglobal.com/usa"
                className="text-brand-600 underline"
                rel="nofollow noopener"
                target="_blank"
              >
                VFS Global
              </a>{" "}
              and{" "}
              <a
                href="https://ociservices.gov.in"
                className="text-brand-600 underline"
                rel="nofollow noopener"
                target="_blank"
              >
                Government of India OCI
              </a>{" "}
              portals before applying.
            </div>

            <div className="mx-auto mt-6 max-w-[720px] text-sm">
              <Link
                href={OCI_BASE}
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                ← Back to the OCI Center
              </Link>
            </div>
          </Container>
        </div>
      </article>

      {/* OCI tools */}
      <section className="bg-white py-12 sm:py-14">
        <Container>
          <SectionHeading eyebrow="Do it now" title="OCI tools" />
          <div className="grid gap-4 sm:grid-cols-3">
            {TOOL_CARDS.map((t) => (
              <Link
                key={t.path}
                href={t.path}
                className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
              >
                <span aria-hidden className="text-2xl">
                  {t.icon}
                </span>
                <h3 className="mt-2 font-semibold text-ink-900 group-hover:text-brand-700">
                  {t.label}
                </h3>
                <p className="mt-1 text-sm text-ink-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Other guides */}
      <section className="py-12 sm:py-14">
        <Container>
          <SectionHeading eyebrow="Keep reading" title="More OCI guides" />
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((g) => (
              <Link
                key={g.slug}
                href={ociGuidePath(g.slug)}
                className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Guide
                </span>
                <h3 className="mt-1 font-semibold text-ink-900 group-hover:text-brand-700">
                  {g.navLabel}
                </h3>
                <p className="mt-1.5 text-sm text-ink-500">{g.hook}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
