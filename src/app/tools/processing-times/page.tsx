import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import DataStamp from "@/components/tools/DataStamp";
import ProcessingTimesExplorer, {
  type TimeGroup,
} from "@/components/tools/ProcessingTimesExplorer";
import PremiumProcessingFeeTable from "@/components/tools/PremiumProcessingFeeTable";
import processingData from "../../../../data/processing-times.json";
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

const tool = getTool("processing-times")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/processing-times",
});

const faq: FaqItem[] = [
  {
    question: "How long does an H-1B extension or transfer take in 2026?",
    answer:
      "A regular I-129 H-1B extension or transfer typically takes 2–4 months. Premium processing may be available and speeds up USCIS action to 15 business days — but does not guarantee approval. Fees and eligibility can change; always verify the current amount on the official USCIS Form I-907 page. For H-1B transfers, whether you can start working before the petition is approved depends on your specific facts, timing, and valid status — confirm with your employer's immigration attorney before starting work. Extensions get an automatic 240-day work authorization cushion.",
  },
  {
    question: "How long does an OCI card take from the USA?",
    answer:
      "OCI applications filed through VFS Global in the USA typically take 6–10 weeks door to door, including the time your Indian passport-related documents spend with the consulate. Passport renewals via VFS are faster, usually 2–6 weeks.",
  },
  {
    question: "What is the H-1B visa stamping wait at Indian consulates?",
    answer:
      "Interview appointment waits at Mumbai, Delhi, Hyderabad, Chennai, and Kolkata have ranged from a few weeks to a few months, while dropbox (interview waiver) cases usually move in days to weeks. Waits move constantly — always check the State Department's global visa wait times page for this week's numbers before booking travel.",
  },
  {
    question: "Are these processing times guaranteed?",
    answer:
      "No. They are typical published ranges from USCIS, the State Department, and VFS, and individual cases routinely run faster or slower depending on service center workload, RFEs, and security checks. Use them for planning, and check your specific receipt's status on the official case tracker.",
  },
  {
    question: "How accurate are USCIS processing time estimates?",
    answer:
      "USCIS processing time estimates represent the range within which 80% of cases are completed. The remaining 20% fall outside — both faster and slower. Service centers vary significantly, and times can shift month to month based on staffing, RFE rates, and application volume. If your case is past the published timeframe for your service center, you may submit an official case inquiry through your myUSCIS account or the USCIS Contact Center.",
  },
  {
    question: "How do I check if my USCIS case is delayed beyond the published processing time?",
    answer:
      "Compare your receipt date to the USCIS processing times page for your form and service center. If your receipt date is earlier than the 'received date for inquiry' shown for your form, you may submit a case inquiry. The USCIS Processing Delay Checker at /tools/uscis-processing-delay-checker provides an educational assessment of whether your case is within normal range.",
  },
];

export default function ProcessingTimesPage() {
  const url = absoluteUrl("/tools/processing-times");
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
      { name: tool.label, url: "/tools/processing-times" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="processing-times"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Typical current waits for H-1B, I-140, I-485, EAD/AP, OCI, passport renewal, and US visa stamping — in one table."
        badges={["Always free", "No signup", "Official sources", "One-page view"]}
        accent={tool.accent}
        sourceNote={
          <>
            From official USCIS, State Department, and VFS data · last updated{" "}
            <time dateTime={processingData.lastUpdated}>
              {processingData.lastUpdated}
            </time>
            . Always check official sources before booking travel or filing.
          </>
        }
      >
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <ProcessingTimesExplorer
            groups={processingData.groups as TimeGroup[]}
          />
          <DataStamp
            className="mt-6"
            lastUpdated={processingData.lastUpdated}
            source={processingData.source}
            sourceLabel={processingData.sourceLabel}
          />
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <PremiumProcessingFeeTable />
          </div>
          <ToolFaq items={faq} />

          {/* Internal links */}
          <div className="mx-auto mt-8 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">Related guides and tools</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/uscis", label: "USCIS Hub", desc: "Case status, receipt numbers, and notices explained" },
                { href: "/uscis/processing-times", label: "USCIS Processing Times Guide", desc: "How to read USCIS processing estimates for your form" },
                { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker", desc: "Is your H-1B, I-140, or I-485 case delayed?" },
                { href: "/tools/uscis-case-status-meaning", label: "USCIS Case Status Decoder", desc: "Plain-English meaning for every USCIS status message" },
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
