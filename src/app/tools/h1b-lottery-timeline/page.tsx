import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import H1bLotteryTimeline from "@/components/tools/H1bLotteryTimeline";
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

const tool = getTool("h1b-lottery-timeline")!;
const content = getToolHubContent("h1b-lottery-timeline")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h1b-lottery-timeline",
});

export default function H1bLotteryTimelinePage() {
  const url = absoluteUrl("/tools/h1b-lottery-timeline");
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
      { name: tool.label, url: "/tools/h1b-lottery-timeline" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="h1b-lottery-timeline"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Where are you in H-1B cap season? Enter your cycle and stage to see your registration, selection, filing, and start-date milestones with a live countdown."
        accent={tool.accent}
        sourceNote={
          <>
            Data source:{" "}
            <a
              href="https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations-and-fashion-models/h-1b-cap-season"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium underline"
            >
              USCIS H-1B Cap Season
            </a>{" "}
            · updated June 2026.
          </>
        }
        disclaimerExtra={
          <p>
            NRItoUSA is not affiliated with USCIS or DHS. H-1B cap dates and
            rules can change each season — verify against official USCIS
            announcements.
          </p>
        }
      >
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>

          <H1bLotteryTimeline />
        </Container>
      </section>

      {/* Full SEO hub content: explainer, process, timeline, fees,
          mistakes, related links, and FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} />

          {/* Internal links */}
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">Related guides and tools</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/h1b", label: "H-1B Guide for Indians", desc: "Cap, lottery, transfer, extensions, and AC21" },
                { href: "/uscis", label: "USCIS Hub", desc: "Case status, processing times, receipt numbers" },
                { href: "/tools/h1b-transfer-risk-checklist", label: "H-1B Transfer Risk Checklist", desc: "Layoff grace period, AC21 portability, travel risk" },
                { href: "/tools/h1b-salaries", label: "H-1B Salary Explorer", desc: "DOL LCA salary data by job title and city" },
                { href: "/tools/processing-times", label: "USCIS Processing Times", desc: "H-1B extension and transfer timelines" },
                { href: "/tools/visa-green-card", label: "All Visa & Green Card Tools", desc: "Every immigration tool on NRItoUSA" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="group flex flex-col gap-0.5 rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm">
                  <span className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{l.label}</span>
                  <span className="text-xs text-ink-500">{l.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
