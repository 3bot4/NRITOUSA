import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import H1bTransferRiskChecklist from "@/components/tools/H1bTransferRiskChecklist";
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

const tool = getTool("h1b-transfer-risk-checklist")!;
const content = getToolHubContent("h1b-transfer-risk-checklist")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h1b-transfer-risk-checklist",
});

export default function H1bTransferRiskChecklistPage() {
  const url = absoluteUrl("/tools/h1b-transfer-risk-checklist");
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
      { name: tool.label, url: "/tools/h1b-transfer-risk-checklist" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="h1b-transfer-risk-checklist"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Laid off or changing jobs on H1B? Answer a few questions for an educational risk assessment and the documents to collect."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/h1b"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Full H1B guide →
            </Link>
            <Link
              href="/h1b/transfer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              H1B Transfer guide
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            Many H1B transfer situations depend on timing, filing, receipt,
            status, and employer attorney guidance. Confirm with your
            immigration attorney before making work or travel decisions.
          </p>
        }
      >
      {/* tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <ToolIntro content={content} />
          </div>

          <div className="mx-auto max-w-3xl">
            <H1bTransferRiskChecklist />
          </div>
        </Container>
      </section>

      {/* related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Related H1B guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/h1b", label: "H1B Guide Hub", desc: "Complete H1B guide for Indian workers" },
                { href: "/h1b/transfer", label: "H1B Transfer Guide", desc: "AC21 portability, when work starts, RFE triggers" },
                { href: "/h1b/layoff-60-day-grace-period", label: "Layoff & 60-Day Grace Period", desc: "What you can and cannot do after layoff" },
                { href: "/h1b/transfer-after-layoff", label: "Transfer After Layoff", desc: "Day-by-day framework for the 60-day window" },
                { href: "/h1b/premium-processing", label: "Premium Processing Guide", desc: "15 business days — what it guarantees and what it does not" },
                { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker", desc: "Is your H1B case delayed? Educational assessment" },
              ].map((g) => (
                <Link key={g.href} href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{g.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: explainer, process, timeline, documents,
          mistakes, related links, and FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} />
        </Container>
      </section>
      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["immigration", "uscis", "tax", "wealth"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
