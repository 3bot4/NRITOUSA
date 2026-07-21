import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import UscisNoticeDecoder from "@/components/tools/UscisNoticeDecoder";
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

const tool = getTool("uscis-notice-decoder")!;
const content = getToolHubContent("uscis-notice-decoder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-notice-decoder",
});

export default function UscisNoticeDecoderPage() {
  const url = absoluteUrl("/tools/uscis-notice-decoder");
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
      { name: tool.label, url: "/tools/uscis-notice-decoder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-notice-decoder"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Got a USCIS notice and not sure what it means? Select the notice type for a plain-English explanation, deadline warnings, and what to check."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/myuscis-account"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              myUSCIS account guide →
            </Link>
            <Link
              href="/uscis/i-797-notice"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              I-797 notice types explained
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            No personal data collected. Always verify at{" "}
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov
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
            <UscisNoticeDecoder />
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
                  href: "/uscis/myuscis-account",
                  label: "myUSCIS Account Guide",
                  desc: "Online account number, access code, adding paper cases, privacy tips",
                },
                {
                  href: "/uscis/i-797-notice",
                  label: "I-797 Notice Types Explained",
                  desc: "I-797A, I-797B, I-797C, I-797D — what each means for H1B and green card",
                },
                {
                  href: "/uscis/rfe-notice",
                  label: "RFE Notice Guide",
                  desc: "What to do when USCIS sends a Request for Evidence — decode the notice & its deadline",
                },
                {
                  href: "/uscis/biometrics-notice",
                  label: "Biometrics Appointment Guide",
                  desc: "What to bring, rescheduling, and what happens at the ASC",
                },
                {
                  href: "/uscis/approval-notice",
                  label: "Approval Notice Guide",
                  desc: "I-140 priority date, H1B I-94, EAD — what to check after approval",
                },
                {
                  href: "/tools/uscis-case-status-meaning",
                  label: "USCIS Case Status Decoder",
                  desc: "Plain-English meaning of every USCIS online status message",
                },
                {
                  href: "/tools/uscis-processing-delay-checker",
                  label: "Processing Delay Checker",
                  desc: "Is your H1B, I-485, or EAD case outside normal processing time?",
                },
                {
                  href: "/uscis",
                  label: "USCIS Hub",
                  desc: "Case status, receipt numbers, H1B, green card, and more",
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

      {/* Full SEO hub content: notice types, process, mistakes,
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
