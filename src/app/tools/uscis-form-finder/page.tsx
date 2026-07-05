import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import UscisFormFinder from "@/components/tools/UscisFormFinder";
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

const tool = getTool("uscis-form-finder")!;
const content = getToolHubContent("uscis-form-finder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-form-finder",
});

export default function UscisFormFinderPage() {
  const url = absoluteUrl("/tools/uscis-form-finder");
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
      { name: tool.label, url: "/tools/uscis-form-finder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-form-finder"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Not sure which USCIS form applies? Select your scenario and status to instantly find the right form — I-129, I-140, I-485, I-765, and more."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/forms"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              USCIS Forms explained →
            </Link>
            <Link
              href="/tools/uscis-notice-decoder"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              Decode a USCIS notice
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            No personal data collected. Verify at{" "}
            <a
              href="https://www.uscis.gov/forms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov/forms
            </a>{" "}
            and consult a licensed immigration attorney.
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
            <UscisFormFinder />
          </div>
        </Container>
      </section>

      {/* Related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">
              USCIS form guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/uscis/forms/i-129", label: "I-129 Work Visa Petition", desc: "H-1B, L-1, O-1 — your employer files it" },
                { href: "/uscis/forms/i-140", label: "I-140 Green Card Petition", desc: "Sets your priority date — the most important date in the EB queue" },
                { href: "/uscis/forms/i-485", label: "I-485 Adjustment of Status", desc: "Green card application when priority date is current" },
                { href: "/uscis/forms/i-765", label: "I-765 EAD Work Permit", desc: "H-4 EAD, I-485 EAD, OPT, and other work authorization" },
                { href: "/uscis/forms/i-131", label: "I-131 Advance Parole", desc: "Travel document — required while I-485 is pending" },
                { href: "/uscis/forms/i-539", label: "I-539 Extend/Change Status", desc: "H-4 extension, B-2 extension, status changes" },
                { href: "/uscis/forms/i-907-premium-processing", label: "I-907 Premium Processing", desc: "15 business day USCIS action for eligible petitions" },
                { href: "/uscis/forms/ar-11-change-address", label: "AR-11 Change of Address", desc: "Required within 10 days of any move" },
                { href: "/uscis/forms/n-400", label: "N-400 Naturalization", desc: "US citizenship application after 5 years as PR" },
                { href: "/uscis/forms", label: "All USCIS Forms Guide", desc: "Full guide to every form for Indians in the USA" },
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

      {/* Full SEO hub content: goal→form table, process, mistakes,
          related links, and FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
