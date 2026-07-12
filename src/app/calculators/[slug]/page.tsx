import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import LeadMagnet from "@/components/calculators/LeadMagnet";
import ReturnToIndiaLeadMagnetCard from "@/components/ReturnToIndiaLeadMagnetCard";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import RelatedHubs from "@/components/RelatedHubs";
import { calculators, getCalculator } from "@/lib/calculators";
import { getCalculatorContent } from "@/lib/calculatorContent";
import { getArticle } from "@/lib/articles";
import {
  CalculatorIntro,
  CalculatorDeepDive,
} from "@/components/calculators/CalculatorHub";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
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

/** Calculators whose intent is U.S.→India relocation — these surface the
 *  Return-to-India Playbook lead-magnet card beneath the tool output. */
const RETURN_TO_INDIA_CALCS = new Set([
  "rnor-tax-residency",
  "india-property-capital-gains",
  "401k-return-to-india",
  "remittance-tcs-cost",
  "dtaa-foreign-tax-credit",
  "fcnr-vs-hysa",
]);

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

  const content = getCalculatorContent(calc.slug);

  const related = calc.related
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const url = absoluteUrl(`/calculators/${calc.slug}`);
  const jsonLd = jsonLdGraph(
    // Valid SoftwareApplication node: applicationCategory + operatingSystem +
    // a free `offers` object (price "0"). No unsupported fields.
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: calc.title,
      description: calc.seoDescription,
      url,
      applicationCategory: content?.appCategory ?? "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Calculators", url: "/calculators" },
      { name: calc.label, url: `/calculators/${calc.slug}` },
    ]),
    // FAQPage — only when page-specific FAQs are actually rendered below.
    ...(content
      ? [
          faqJsonLd(
            content.faqs.map((f) => ({ question: f.question, answer: f.answer }))
          ),
        ]
      : [])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug={calc.slug}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: calc.label },
        ]}
        icon={calc.icon}
        category={calc.category}
        title={calc.title}
        hook={calc.description}
        accent={calc.accent}
        sourceNote={
          <>
            Source: {calc.officialSource} · data last checked{" "}
            <time dateTime={calc.dataChecked}>{calc.dataChecked}</time>. Verify
            before making decisions.
          </>
        }
        disclaimerExtra={
          <p>
            This calculator provides general estimates and is not financial,
            tax, legal, or immigration advice. Rules change and vary by state,
            visa status, and individual circumstance. Consult a qualified
            professional before acting.
          </p>
        }
      >
      {/* Calculator */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          {/* Static SEO context above the tool (quick answer, who it's for,
              key inputs, decision window) — only on expanded hub pages. */}
          {content && (
            <div className="mb-8">
              <CalculatorIntro
                content={content}
                quickSummary={calc.quickSummary}
                audience={calc.audience}
              />
            </div>
          )}

          <Calculator />

          {RETURN_TO_INDIA_CALCS.has(calc.slug) && (
            <div className="mt-8">
              <ReturnToIndiaLeadMagnetCard />
            </div>
          )}

          <div className="mt-8">
            <LeadMagnet
              heading={calc.leadMagnet.heading}
              body={calc.leadMagnet.body}
              cta={calc.leadMagnet.cta}
              tag={calc.title}
            />
          </div>

          {content ? (
            <>
              {/* Full SEO hub content below the tool */}
              <div className="mt-12 sm:mt-14">
                <CalculatorDeepDive content={content} />
              </div>

              {/* Data provenance footnote */}
              <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-ink-900/10 bg-slate-50/70 px-5 py-4 text-xs text-ink-500">
                <p>
                  Reviewed for 2026 · data last checked{" "}
                  <time dateTime={calc.dataChecked}>{calc.dataChecked}</time>.
                  Source: {calc.officialSource}. Figures are estimates and may
                  change — verify before acting.
                </p>
              </div>
            </>
          ) : (
            /* Compact quick-answer fallback for calculators without expanded content. */
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-brand-200 bg-white px-6 py-5">
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
          )}
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

      {/* Related hubs */}
      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["tax", "taxRoadmap", "wealth", "wealthCheckup"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
