import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import H1bSalaryExplorer from "@/components/tools/H1bSalaryExplorer";
import { getTool } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("h1b-salaries")!;
const content = getToolHubContent("h1b-salaries")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h1b-salaries",
});

export default function H1bSalariesPage() {
  const url = absoluteUrl("/tools/h1b-salaries");
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: content.description,
      url,
      applicationCategory: content.appCategory,
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(content.faqs),
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

      <ToolFirstLayout
        toolSlug="h1b-salaries"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="What do H-1B roles actually pay? Change position, city, and experience to watch the charts update — and drop in your offer to see your percentile."
        accent={tool.accent}
        sourceNote={
          <>
            Built from official DOL LCA disclosure filings. Figures are gross
            base salaries, not total compensation.
          </>
        }
      >
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>

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

      {/* Full SEO hub content: explainer, process, example, mistakes,
          related links, and FAQ */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
