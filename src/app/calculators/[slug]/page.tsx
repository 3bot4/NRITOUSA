import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import LeadMagnet from "@/components/calculators/LeadMagnet";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import { calculators, getCalculator } from "@/lib/calculators";
import { getArticle } from "@/lib/articles";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";

import RnorCalculator from "@/components/calculators/RnorCalculator";
import PropertyGainsCalculator from "@/components/calculators/PropertyGainsCalculator";
import Retire401kCalculator from "@/components/calculators/Retire401kCalculator";
import BackdoorRothCalculator from "@/components/calculators/BackdoorRothCalculator";
import RentVsBuyCalculator from "@/components/calculators/RentVsBuyCalculator";
import RentVsBuyImmigrantCalculator from "@/components/calculators/RentVsBuyImmigrantCalculator";
import RemittanceCalculator from "@/components/calculators/RemittanceCalculator";
import DtaaReliefCalculator from "@/components/calculators/DtaaReliefCalculator";
import FcnrVsHysaCalculator from "@/components/calculators/FcnrVsHysaCalculator";

const REGISTRY: Record<string, React.ComponentType> = {
  "rnor-tax-residency": RnorCalculator,
  "india-property-capital-gains": PropertyGainsCalculator,
  "401k-return-to-india": Retire401kCalculator,
  "backdoor-roth-eligibility": BackdoorRothCalculator,
  "rent-vs-buy-visa": RentVsBuyCalculator,
  "rent-vs-buy-immigrant": RentVsBuyImmigrantCalculator,
  "remittance-tcs-cost": RemittanceCalculator,
  "dtaa-foreign-tax-credit": DtaaReliefCalculator,
  "fcnr-vs-hysa": FcnrVsHysaCalculator,
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
  return pageMetadata({
    title: calc.seoTitle,
    description: calc.seoDescription,
    path: `/calculators/${calc.slug}`,
  });
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

      {/* Quick Summary — AI-friendly snapshot of what this calculator does */}
      <section className="border-b border-ink-900/5 bg-slate-50/70 py-7 sm:py-8">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-brand-200 bg-white px-6 py-5">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-700">
                Quick answer
              </h2>
              <p className="text-sm leading-relaxed text-ink-700">{calc.quickSummary}</p>
              <dl className="mt-4 grid gap-2 sm:grid-cols-2 text-xs">
                <div>
                  <dt className="font-semibold text-ink-500">Who this is for</dt>
                  <dd className="mt-0.5 text-ink-700">{calc.audience}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-500">Data last checked</dt>
                  <dd className="mt-0.5 text-ink-700">
                    <time dateTime={calc.dataChecked}>{calc.dataChecked}</time>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-ink-500">Official source</dt>
                  <dd className="mt-0.5 text-ink-700">{calc.officialSource}</dd>
                </div>
              </dl>
            </div>
          </div>
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

      {/* Related guides — compact text cards */}
      {related.length > 0 && (
        <section className="bg-white py-10 sm:py-12">
          <Container>
            <SectionHeading eyebrow="Learn more" title="Related guides" />
            <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <h3 className="text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                    {a.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
                    {a.excerpt}
                  </p>
                  <span className="mt-2.5 text-[0.6875rem] font-semibold text-brand-600">
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
      )}

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="bg-slate-50/60 py-14 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref={`/calculators/${calc.slug}`} />
        </Container>
      </section>
    </>
  );
}
