import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByTopic } from "@/lib/articles";
import { getCalculator } from "@/lib/calculators";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
} from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/send-money-to-india";
const PAGE_TITLE = "Send Money to India";
const title = "Send Money to India: Compare Costs, TCS & Hidden Fees";
const description =
  "Compare India–USA transfer costs, understand TCS on outward remittances, and avoid hidden exchange-rate fees — with a true-cost calculator and in-depth guides for NRIs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PATH },
  openGraph: { type: "website", url: PATH, title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function SendMoneyToIndiaPage() {
  const remittance = getCalculator("remittance-tcs-cost");
  const guides = getArticlesByTopic("money-transfer");

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
        itemListElement: [
          ...(remittance
            ? [
                {
                  url: absoluteUrl(`/calculators/${remittance.slug}`),
                  name: remittance.title,
                },
              ]
            : []),
          ...guides.map((a) => ({ url: articleUrl(a.slug), name: a.title })),
        ].map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: item.url,
          name: item.name,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: PAGE_TITLE, url: PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-blue-700 to-teal-600">
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-12 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{PAGE_TITLE}</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              💸
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Send Money to India
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            Compare transfer costs, understand TCS, and avoid hidden fees.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {remittance && (
              <Link
                href={`/calculators/${remittance.slug}`}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
              >
                Estimate your transfer cost
              </Link>
            )}
            <Link
              href="#guides"
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              Browse all transfer guides
            </Link>
          </div>
        </Container>
      </section>

      {/* Tools — the Remittance & TCS calculator, featured prominently */}
      {remittance && (
        <section className="bg-white py-10 sm:py-12">
          <Container>
            <SectionHeading
              eyebrow="Calculator"
              title="Start with the true cost of your transfer"
              description="Most transfers lose money to the exchange-rate margin, not the upfront fee. See the net amount that actually lands in India after fees, spread, and TCS."
              action={{ label: "All calculators", href: "/calculators" }}
            />
            <Link
              href={`/calculators/${remittance.slug}`}
              className="group block rounded-2xl border border-ink-900/5 bg-gradient-to-br from-cyan-50 to-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:p-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${remittance.accent} text-2xl shadow-sm`}
                  >
                    {remittance.icon}
                  </span>
                  <div>
                    <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                      Featured calculator
                    </span>
                    <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 group-hover:text-brand-600">
                      {remittance.label}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-500">
                      {remittance.description}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-xl bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-700">
                  Open calculator <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* Guides — the money-transfer topic articles */}
      <section id="guides" className="scroll-mt-20 bg-slate-50/60 py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Guides"
            title="Sending money, explained"
            description="The cheapest services, the exchange-rate spread, NRE/NRO accounts, TCS, and how to move money tax-smart in both directions."
            action={{ label: "All transfer guides", href: "/topics/money-transfer" }}
          />
          {guides.length > 0 && (
            <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {guides.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="dense" />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="bg-white pb-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 text-sm leading-relaxed text-ink-500">
            <strong className="font-semibold text-ink-700">Disclaimer:</strong>{" "}
            Content on {site.name} is for educational purposes only and is not
            financial, legal, tax, immigration, or investment advice. {site.name}{" "}
            is owned by {site.owner}. Transfer fees, exchange rates, and TCS
            rules differ between providers and change over time. Please confirm
            current costs with your provider and consult a qualified
            professional for your situation. See our{" "}
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
