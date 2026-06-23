import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import H1bTransferRiskChecklist from "@/components/tools/H1bTransferRiskChecklist";
import { getTool } from "@/lib/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("h1b-transfer-risk-checklist")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/h1b-transfer-risk-checklist",
});

const faq: FaqItem[] = [
  {
    question: "What information do I need to use this tool?",
    answer:
      "Just your current employment status (employed, laid off, etc.), whether a new H1B petition has been filed, whether you have a receipt notice, I-94 validity, and whether you have travel plans or an RFE. No personal information is collected — no receipt number, A-number, or passport information.",
  },
  {
    question: "Can I start working for a new employer after the H1B petition is filed?",
    answer:
      "Under AC21 portability, you may be able to start working once the new employer's H1B petition is filed and a receipt notice is issued — but only if you were in valid H1B status at the time of filing, your I-94 has not expired, and you have not violated your H1B terms. Confirm with your immigration attorney before starting work.",
  },
  {
    question: "How long is the H1B 60-day grace period?",
    answer:
      "The grace period is 60 days from your last day of H1B employment — or until your I-94 expires, whichever is shorter. During this period you can remain in the US and pursue options, but you cannot work without valid authorization.",
  },
  {
    question: "Should I use premium processing for an H1B transfer after layoff?",
    answer:
      "In most layoff situations, premium processing is strongly advisable. Regular H1B processing can take 3–6 months — which is much longer than the 60-day grace period. Premium processing guarantees USCIS will act within 15 business days. It does not guarantee approval.",
  },
  {
    question: "I received an RFE on my H1B transfer. What should I do?",
    answer:
      "Contact your employer's immigration attorney immediately — the same day. The RFE has a hard response deadline, typically 87 days from the notice date. Missing this deadline results in automatic denial. Your attorney must lead the response.",
  },
  {
    question: "Can I travel to India while my H1B transfer petition is pending?",
    answer:
      "This carries significant risk. You may need a new visa stamp to re-enter the US, especially if your current stamp expired or shows a previous employer. The stamping process at Indian consulates carries 221(g) administrative processing risk that can delay your return by weeks or months. Consult your attorney before booking any international travel while a petition is pending.",
  },
  {
    question: "Many H1B transfer situations depend on what factors?",
    answer:
      "Many H1B transfer situations depend on timing (when employment ended, when the petition was filed), filing method (premium vs. regular), receipt notice status, I-94 validity, whether AC21 portability conditions are met, and your employer attorney's guidance. This tool gives educational guidance — always confirm your specific situation with your immigration attorney.",
  },
];

export default function H1bTransferRiskChecklistPage() {
  const url = absoluteUrl("/tools/h1b-transfer-risk-checklist");
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

      {/* FAQ + disclaimer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
