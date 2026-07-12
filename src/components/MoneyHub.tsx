import Link from "next/link";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import SectionHeading from "@/components/SectionHeading";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import ReturnToIndiaLeadMagnetCard from "@/components/ReturnToIndiaLeadMagnetCard";
import { getArticle } from "@/lib/articles";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

/**
 * Shared template for the wealth / tax / India-money planning hubs linked from
 * the homepage repositioning section (NriWealthPlanning). Each hub is a curated
 * landing page over EXISTING articles, calculators, and tools — no duplicate
 * content is authored here. Visual language matches /long-term-nri-wealth:
 * gradient hero, a "what's covered" checklist, featured article cards, a related
 * tools strip, disclaimer, and the newsletter.
 */

export type HubTool = { label: string; href: string; kind: string };

export type MoneyHubConfig = {
  path: string;
  breadcrumb: string;
  icon: string;
  accent: string; // hero gradient e.g. "from-brand-600 to-indigo-700"
  title: string;
  intro: string;
  /** Bullet list of what the hub covers. */
  covers: string[];
  /** Article slugs surfaced as cards (filtered to those that exist). */
  articleSlugs: string[];
  /** Calculators / tools surfaced as a related strip. */
  tools: HubTool[];
  /** Primary in-hero CTA. */
  primaryCta: { label: string; href: string };
  /** Optional "Fast Answer" numbers snapshot shown under the hero. */
  snapshot?: {
    title: string;
    rows: { label: string; value: string; note?: string; highlight?: boolean }[];
    badges?: string[];
    lastVerified: string;
    sources: { label: string; href: string }[];
    disclaimer: string;
    ctaText?: string;
    ctaHref?: string;
  };
  /** Show the Return-to-India Playbook lead-magnet card under the hero. */
  showReturnToIndiaLeadMagnet?: boolean;
};

export default function MoneyHub({ config }: { config: MoneyHubConfig }) {
  const articles = config.articleSlugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  // Additive structured data: a CollectionPage over the hub's curated links
  // (articles + tools) plus a Home > hub BreadcrumbList. Mirrors the visual
  // breadcrumb; no layout/content is changed. #website resolves against the
  // site-wide node emitted in the root layout.
  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(config.path)}#collection`,
      url: absoluteUrl(config.path),
      name: config.title,
      description: config.intro,
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          ...articles.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: articleUrl(a.slug),
            name: a.title,
          })),
          ...config.tools.map((t, i) => ({
            "@type": "ListItem",
            position: articles.length + i + 1,
            url: absoluteUrl(t.href),
            name: t.label,
          })),
        ],
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: config.breadcrumb, url: config.path },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section
        className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${config.accent}`}
      >
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-16 sm:py-24">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{config.breadcrumb}</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              {config.icon}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              {config.title}
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            {config.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={config.primaryCta.href}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
            >
              {config.primaryCta.label}
            </Link>
            <Link
              href="/nri-wealth-checkup"
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              NRI Wealth Checkup
            </Link>
          </div>
        </Container>
      </section>

      {/* Fast Answer snapshot (opt-in) */}
      {config.snapshot && (
        <section className="bg-ink-50/40 py-8">
          <Container>
            <FastAnswerSnapshot
              title={config.snapshot.title}
              accent="emerald"
              rows={config.snapshot.rows}
              badges={config.snapshot.badges}
              lastVerified={config.snapshot.lastVerified}
              sources={config.snapshot.sources}
              disclaimer={config.snapshot.disclaimer}
              ctaText={config.snapshot.ctaText}
              ctaHref={config.snapshot.ctaHref}
            />
          </Container>
        </section>
      )}

      {/* Return-to-India Playbook lead magnet (opt-in) */}
      {config.showReturnToIndiaLeadMagnet && (
        <section className="bg-white pt-10 sm:pt-14">
          <Container>
            <ReturnToIndiaLeadMagnetCard />
          </Container>
        </section>
      )}

      {/* What's covered */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What this covers" title="In this hub" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.covers.map((c) => (
              <div
                key={c}
                className="flex gap-3 rounded-2xl border border-ink-900/5 bg-slate-50/60 p-5"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                >
                  ✓
                </span>
                <p className="text-ink-700">{c}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured guides */}
      {articles.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Start here"
              title="Guides for this topic"
              description="Plain-English walkthroughs of the rules, trade-offs, and numbers that matter."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Related tools & calculators */}
      {config.tools.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Run the numbers"
              title="Tools & calculators"
              description="Free, no-signup calculators and checkers for this topic."
            />
            <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {config.tools.map((t) => (
                <Link
                  key={`${t.href}-${t.label}`}
                  href={t.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                      {t.label}
                    </span>
                    <span className="mt-0.5 block text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                      {t.kind}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-brand-600 transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Disclaimer */}
      <section className="bg-white pb-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 text-sm leading-relaxed text-ink-500">
            <strong className="font-semibold text-ink-700">Disclaimer:</strong>{" "}
            Content on {site.name} is for educational purposes only and is not
            financial, legal, tax, immigration, or investment advice. {site.name}{" "}
            is owned by {site.owner}. Cross-border rules differ between the USA
            and India, vary by state and by individual situation, and change over
            time. Please consult a qualified CPA, attorney, financial advisor,
            tax professional, or India-based professional for your situation. See
            our{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              full disclaimer
            </Link>
            .
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
