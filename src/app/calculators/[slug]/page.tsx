import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import SectionHeading from "@/components/SectionHeading";
import LeadMagnet from "@/components/calculators/LeadMagnet";
import { calculators, getCalculator } from "@/lib/calculators";
import { getArticle } from "@/lib/articles";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
} from "@/lib/seo";
import { site } from "@/lib/site";

import RnorCalculator from "@/components/calculators/RnorCalculator";
import PropertyGainsCalculator from "@/components/calculators/PropertyGainsCalculator";
import Retire401kCalculator from "@/components/calculators/Retire401kCalculator";
import BackdoorRothCalculator from "@/components/calculators/BackdoorRothCalculator";
import RentVsBuyCalculator from "@/components/calculators/RentVsBuyCalculator";
import RemittanceCalculator from "@/components/calculators/RemittanceCalculator";

const REGISTRY: Record<string, React.ComponentType> = {
  "rnor-tax-residency": RnorCalculator,
  "india-property-capital-gains": PropertyGainsCalculator,
  "401k-return-to-india": Retire401kCalculator,
  "backdoor-roth-eligibility": BackdoorRothCalculator,
  "rent-vs-buy-visa": RentVsBuyCalculator,
  "remittance-tcs-cost": RemittanceCalculator,
};

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const calc = getCalculator(params.slug);
  if (!calc) return { title: "Calculator not found" };
  const title = calc.seoTitle;
  const description = calc.seoDescription;
  return {
    title,
    description,
    alternates: { canonical: `/calculators/${calc.slug}` },
    openGraph: {
      type: "website",
      url: `/calculators/${calc.slug}`,
      title,
      description,
    },
    twitter: { title, description },
  };
}

export default function CalculatorPage({
  params,
}: {
  params: { slug: string };
}) {
  const calc = getCalculator(params.slug);
  if (!calc) notFound();

  const Calculator = REGISTRY[calc.slug];
  if (!Calculator) notFound();

  const related = calc.related
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const url = absoluteUrl(`/calculators/${calc.slug}`);
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: calc.title,
      description: calc.seoDescription,
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Calculators", url: "/calculators" },
      { name: calc.label, url: `/calculators/${calc.slug}` },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section
        className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${calc.accent}`}
      >
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-14 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/calculators" className="hover:text-white">
              Calculators
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{calc.label}</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              {calc.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {calc.category}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {calc.title}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            {calc.description}
          </p>
        </Container>
      </section>

      {/* Calculator */}
      <section className="py-12 sm:py-16">
        <Container>
          <Calculator />

          <div className="mt-8">
            <LeadMagnet
              heading={calc.leadMagnet.heading}
              body={calc.leadMagnet.body}
              cta={calc.leadMagnet.cta}
              tag={calc.title}
            />
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
            <strong className="font-semibold text-ink-700">
              Educational estimate only.
            </strong>{" "}
            This calculator provides general estimates and is not financial,
            tax, legal, or immigration advice. Rules change and vary by state,
            visa status, and individual circumstance. Consult a qualified
            professional before acting. See our{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              full disclaimer
            </Link>
            .
          </div>
        </Container>
      </section>

      {/* Related guides */}
      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Learn more" title="Related guides" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
