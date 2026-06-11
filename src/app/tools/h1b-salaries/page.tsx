import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import H1bSalaryExplorer from "@/components/tools/H1bSalaryExplorer";
import { getTool } from "@/lib/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("h1b-salaries")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: "/tools/h1b-salaries" },
  openGraph: {
    type: "website",
    url: "/tools/h1b-salaries",
    title: tool.seoTitle,
    description: tool.seoDescription,
  },
  twitter: { title: tool.seoTitle, description: tool.seoDescription },
};

const faq: FaqItem[] = [
  {
    question: "What is the average H-1B salary by job title?",
    answer:
      "It varies enormously by title, metro, and seniority. As a rough guide from DOL filings, median H-1B base pay for a Software Engineer runs $115k–$155k depending on the city, Senior Software Engineers $135k–$190k, and Data Scientists $110k–$150k. Use the explorer above to filter your exact title, metro, and wage level.",
  },
  {
    question: "Where does this H-1B salary data come from?",
    answer:
      "From the US Department of Labor's quarterly LCA (Labor Condition Application) disclosure files — the official wage data employers must file for every H-1B position. We pre-aggregate millions of rows into medians and percentiles by title, metro, and wage level; no individual filing data is shown.",
  },
  {
    question: "What do wage levels I–IV mean on an H-1B?",
    answer:
      "The DOL prevailing-wage system assigns each position a level: I (entry), II (qualified), III (experienced), and IV (fully competent/senior). It's a useful experience proxy when comparing salaries — a Level II Software Engineer and a Level IV one are very different jobs at very different pay.",
  },
  {
    question: "Is LCA salary data the same as total compensation?",
    answer:
      "No. LCA filings report base salary only. Stock grants, bonuses, and benefits — often 20–50% of total compensation at large tech companies — are not included, so real take-home packages can be substantially higher than the numbers shown here.",
  },
];

export default function H1bSalariesPage() {
  const url = absoluteUrl("/tools/h1b-salaries");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/h1b-salaries" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      <section className="py-12 sm:py-16">
        <Container>
          <H1bSalaryExplorer />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Methodology"
            title="How these numbers are built"
          />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                Official DOL filings
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Every H-1B job requires a certified Labor Condition Application
                stating the offered base wage. The DOL publishes these
                quarterly — that disclosure file is our only input.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                Aggregates, not records
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                We group certified H-1B filings by occupation (SOC title),
                metro, and DOL wage level, then publish only percentiles
                (p10–p90), the median prevailing-wage floor, and a coarse
                distribution. Thin selections fall back to a broader aggregate
                and are flagged.
              </p>
            </div>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
              <h3 className="text-base font-bold text-ink-900">
                Base salary only
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                LCA wages exclude stock and bonus. Treat these numbers as the
                floor of a real offer at large tech employers, and as close to
                total comp at most services companies.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>
    </>
  );
}
