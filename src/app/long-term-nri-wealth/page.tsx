import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import SectionHeading from "@/components/SectionHeading";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  wealthReturnSnapshotRows,
  wealthReturnSources,
  WEALTH_RETURN_VERIFIED,
  WEALTH_RETURN_DISCLAIMER,
} from "@/data/siteWideVerifiedNumbers";
import HubLinkGroups from "@/components/HubLinkGroups";
import RelatedHubs from "@/components/RelatedHubs";
import CommonNriQuestions from "@/components/home/CommonNriQuestions";
import { getArticle, getArticlesByTopic } from "@/lib/articles";
import { getTopic } from "@/lib/topics";
import {
  GIFT_CLUSTER_SECTION,
  giftPath,
  giftPillar,
  giftSupportPages,
} from "@/lib/giftsCluster";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/long-term-nri-wealth";
const TOPIC = "long-term-nri-wealth";

const title = "Long-Term NRI Wealth Planning";
const description =
  "Guides for NRIs settled in the USA covering India assets, US investments, property decisions, retirement, estate planning, and cross-border wealth.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: PATH,
});

/** Pull a handful of cluster articles by slug for the curated sections. */
function pick(slugs: string[]) {
  return slugs.map((s) => getArticle(s)).filter(Boolean);
}

export default function LongTermNriWealthPage() {
  const articles = getArticlesByTopic(TOPIC);
  const topic = getTopic(TOPIC);

  const featured = pick([
    "invest-in-usa-or-india",
    "10-year-nri-wealth-checklist",
    "nri-retirement-usa-india-currency-risk",
  ]);

  const indiaVsUsa = pick([
    "invest-in-usa-or-india",
    "india-fd-vs-us-investments",
    "keeping-too-much-money-in-india",
  ]);

  const propertyInheritance = pick([
    "investment-property-usa-vs-india",
    "us-kids-india-property-problems",
    "buying-india-property-for-children",
    "sell-india-property-before-retirement-usa",
  ]);

  const retirementEstate = pick([
    "nri-retirement-usa-india-currency-risk",
    "estate-planning-usa-india-assets",
    "10-year-nri-wealth-checklist",
  ]);

  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(PATH)}#collection`,
      name: title,
      description,
      url: absoluteUrl(PATH),
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
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
      { name: "Long-Term NRI Wealth", url: PATH },
    ])
  );

  const audience = [
    "NRIs living in the USA for 5, 10, 15, or 20+ years",
    "H-1B workers, green card holders, and US citizens of Indian origin",
    "Indian families raising children in the USA",
    "NRIs with property, FDs, inheritance, or family assets in India",
    "Anyone deciding whether to build wealth in the USA or India",
    "Families thinking about retirement, estate planning, and wealth transfer",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${
          topic?.accent ?? "from-emerald-600 to-cyan-700"
        }`}
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
            <span className="text-white">Long-Term NRI Wealth</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              {topic?.icon ?? "🌉"}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Long-Term NRI Wealth Planning
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            You&apos;ve lived in the USA for years — maybe decades. Your salary,
            mortgage, and future are in dollars, but part of your wealth, your
            family, and your roots are still in India. These guides help you
            think clearly about the trade-offs: India assets vs US investments,
            property and inheritance, currency risk, retirement, and
            cross-border estate planning.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/articles/10-year-nri-wealth-checklist"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
            >
              Start with the 10-year checklist
            </Link>
            <Link
              href={`/topics/${TOPIC}`}
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              Browse all {articles.length} guides
            </Link>
          </div>
        </Container>
      </section>

      {/* Fast Answer: key wealth numbers */}
      <section className="bg-ink-50/40 py-8">
        <Container>
          <FastAnswerSnapshot
            title="Cross-border wealth — key numbers first"
            accent="emerald"
            rows={wealthReturnSnapshotRows}
            badges={["401(k) 10% early penalty", "SS 40 credits (~10 yrs)", "RNOR ~2–3 yrs"]}
            lastVerified={WEALTH_RETURN_VERIFIED}
            sources={wealthReturnSources}
            disclaimer={WEALTH_RETURN_DISCLAIMER}
          />
        </Container>
      </section>

      {/* Wealth Hub — grouped table of contents */}
      <section className="bg-white pt-14 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow="Wealth hub"
            title="Plan your cross-border money in one place"
            description="Start with the free checkup, then jump to the calculator, guide, or checklist for the decision in front of you."
          />
          <HubLinkGroups
            columns={4}
            groups={[
              {
                title: "Start here",
                links: [
                  { label: "NRI Wealth Checkup", href: "/nri-wealth-checkup" },
                  { label: "10-Year NRI Wealth Checklist", href: "/articles/10-year-nri-wealth-checklist" },
                  { label: "Free Immigrant Wealth Guide", href: "/free-immigrant-wealth-guide" },
                ],
              },
              {
                title: "Money decisions",
                links: [
                  { label: "Rent vs Buy Calculator", href: "/calculators/rent-vs-buy-immigrant" },
                  { label: "401(k) Cash Out vs Keep", href: "/calculators/401k-return-to-india" },
                  { label: "FCNR vs HYSA", href: "/calculators/fcnr-vs-hysa" },
                  { label: "India FD vs US Investments", href: "/articles/india-fd-vs-us-investments" },
                  { label: "Invest more in USA or India?", href: "/articles/invest-in-usa-or-india" },
                ],
              },
              {
                title: "Property & legacy",
                links: [
                  { label: "India Property Sale Calculator", href: "/calculators/india-property-capital-gains" },
                  { label: "Inheriting Indian assets (US tax)", href: "/articles/inheriting-indian-assets-us-tax" },
                  { label: "Estate planning checklist", href: "/articles/estate-planning-usa-india-assets" },
                  { label: "US-born kids & India property", href: "/articles/us-kids-india-property-problems" },
                ],
              },
              {
                title: "Return to India",
                links: [
                  { label: "RNOR Tax Residency Calculator", href: "/calculators/rnor-tax-residency" },
                  { label: "401(k), IRA & Social Security", href: "/articles/what-happens-to-401k-leaving-usa" },
                  { label: "Currency & retirement planning", href: "/articles/nri-retirement-usa-india-currency-risk" },
                  { label: "Tax residency planning", href: "/articles/substantial-presence-test-explained" },
                ],
              },
            ]}
          />
        </Container>
      </section>

      {/* Who this is for */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who this is for"
            title="Built for settled NRIs, not generic advice"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audience.map((a) => (
              <div
                key={a}
                className="flex gap-3 rounded-2xl border border-ink-900/5 bg-slate-50/60 p-5"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                >
                  ✓
                </span>
                <p className="text-ink-700">{a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured articles */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Start here"
            title="Featured guides"
            description="The best place to begin if you're taking stock of your cross-border financial life."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((a) => (
              <ArticleCard key={a!.slug} article={a!} />
            ))}
          </div>
        </Container>
      </section>

      {/* India assets vs USA assets */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="India vs USA"
            title="India assets vs US investments"
            description="How to compare the two honestly — in the currency you'll actually spend, after inflation and tax."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {indiaVsUsa.map((a) => (
              <ArticleCard key={a!.slug} article={a!} />
            ))}
          </div>
        </Container>
      </section>

      {/* Property and inheritance */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Property & inheritance"
            title="India property, kids, and the long view"
            description="The practical realities of owning, passing on, and managing India property from abroad."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {propertyInheritance.map((a) => (
              <ArticleCard key={a!.slug} article={a!} variant="compact" />
            ))}
          </div>
        </Container>
      </section>

      {/* Parents, Gifts, Inheritance & Form 3520 cluster */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={GIFT_CLUSTER_SECTION.eyebrow}
            title={GIFT_CLUSTER_SECTION.title}
            description={GIFT_CLUSTER_SECTION.description}
            action={{
              label: "Start the guide",
              href: giftPath(giftPillar.slug),
            }}
          />

          {/* Pillar — prominent lead card */}
          <Link
            href={giftPath(giftPillar.slug)}
            className="group flex flex-col gap-2 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${giftPillar.accent} text-2xl shadow-sm`}
              >
                {giftPillar.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Pillar guide
                </p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
                  Money from Parents in India: Gifts, Inheritance, Property &amp;
                  Form 3520
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-ink-500">
                  {giftPillar.excerpt}
                </p>
              </div>
            </div>
            <span className="flex-none text-sm font-semibold text-rose-600 group-hover:text-rose-700">
              Read the guide{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>

          {/* Supporting pages */}
          <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {giftSupportPages.map((p) => (
              <Link
                key={p.slug}
                href={giftPath(p.slug)}
                className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-lg shadow-sm`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                    Guide
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.navLabel}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                  {p.excerpt}
                </p>
                <span className="mt-2.5 text-xs font-semibold text-brand-600">
                  Open{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Retirement and estate planning */}
      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Retirement & estate"
            title="Retirement and cross-border estate planning"
            description="Planning a dollar retirement while coordinating India assets, currency risk, and your estate."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {retirementEstate.map((a) => (
              <ArticleCard key={a!.slug} article={a!} />
            ))}
          </div>
        </Container>
      </section>

      {/* All cluster articles */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Everything in this cluster"
            title={`All ${articles.length} Long-Term NRI Wealth guides`}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Container>
      </section>

      {/* Conversion-focused common-questions block (shared with the homepage). */}
      <section className="py-14 sm:py-20">
        <Container>
          <CommonNriQuestions />
        </Container>
      </section>

      {/* Related hubs */}
      <section className="pb-14">
        <Container>
          <RelatedHubs hubs={["wealthCheckup", "tax", "taxRoadmap", "immigration"]} />
        </Container>
      </section>

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
