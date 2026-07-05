import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import UscisStatusTool from "@/components/tools/UscisStatusTool";
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

const tool = getTool("uscis-case-status-meaning")!;
const content = getToolHubContent("uscis-case-status-meaning")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-case-status-meaning",
});

export default function UscisStatusMeaningPage() {
  const url = absoluteUrl("/tools/uscis-case-status-meaning");
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
      { name: tool.label, url: "/tools/uscis-case-status-meaning" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-case-status-meaning"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="What does your USCIS status actually mean? Select your form and status for a plain-English explanation and next steps — no receipt number needed."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/case-status"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Full case status guide →
            </Link>
            <Link
              href="/uscis/receipt-number"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              What is a receipt number?
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            Always verify at{" "}
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov
            </a>{" "}
            and consult a licensed immigration attorney for your situation.
          </p>
        }
      >
      {/* Tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <ToolIntro content={content} />
          </div>

          <div className="mx-auto max-w-3xl">
            <UscisStatusTool />
          </div>
        </Container>
      </section>

      {/* Related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">
              Related USCIS guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/uscis/case-status",
                  label: "USCIS Case Status Explained",
                  desc: "Full guide to every status message for H1B, I-140, I-485, EAD",
                },
                {
                  href: "/uscis/receipt-number",
                  label: "USCIS Receipt Number Guide",
                  desc: "IOE, LIN, SRC, EAC, WAC, MSC prefix codes explained",
                },
                {
                  href: "/uscis/request-for-evidence-rfe",
                  label: "RFE Guide",
                  desc: "What to do when USCIS sends a Request for Evidence",
                },
                {
                  href: "/uscis/case-approved-what-next",
                  label: "Case Approved — What Next",
                  desc: "Post-approval steps for H1B, I-140, I-485, EAD, N-400",
                },
                {
                  href: "/tools/green-card-tracker",
                  label: "Green Card Stage Finder",
                  desc: "Track your EB green card stage and estimated wait",
                },
                {
                  href: "/tools/processing-times",
                  label: "Processing Times",
                  desc: "Current USCIS processing time estimates by form",
                },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                    {g.label}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: status table, process, mistakes,
          related links, and FAQ */}
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
