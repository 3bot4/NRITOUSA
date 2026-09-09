import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import DataStamp from "@/components/tools/DataStamp";
import ProcessingTimesExplorer, {
  type TimeGroup,
} from "@/components/tools/ProcessingTimesExplorer";
import PremiumProcessingFeeTable from "@/components/tools/PremiumProcessingFeeTable";
import UscisProcessingTimesGuide from "@/components/tools/UscisProcessingTimesGuide";
import processingData from "../../../../data/processing-times.json";
import { getTool } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
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
const content = getToolHubContent("processing-times")!;

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
      "Interview appointment waits at Mumbai, Delhi, Hyderabad, Chennai, and Kolkata have ranged from a few weeks to a few months. Note that H-1B and H-4 lost dropbox (interview waiver) eligibility under the Department of State rule effective 1 October 2025, so plan for an in-person interview for every applicant. Waits move constantly — always check the State Department's global visa wait times page for this week's numbers before booking travel.",
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
  /* ── Migrated from /uscis/processing-times (now 301'd here). Two of that
        page's ten FAQs were dropped as exact duplicates of entries above:
        "Are USCIS processing times guarantees?" (see "Are these processing
        times guaranteed?") and "When should I contact USCIS about a delayed
        case?" (see the delay question directly above). ───────────────────── */
  {
    question: "What does USCIS processing time mean?",
    answer:
      "USCIS processing time is the range of days it currently takes USCIS to complete a specific form type at a specific service center. The dates shown on egov.uscis.gov/processing-times represent the receipt dates of cases USCIS is currently completing — not how long your case will take from today.",
  },
  {
    question: "Where do I check official USCIS processing times?",
    answer:
      "At egov.uscis.gov/processing-times. Select your form type and the service center shown on your I-797 receipt notice. If your receipt date is earlier than the date shown, your case may be outside the normal processing window for that center.",
  },
  {
    question: "What is premium processing and does it guarantee approval?",
    answer:
      "Premium processing is an optional service that allows petitioners to pay USCIS for expedited action on certain forms, primarily I-129 and I-140. USCIS guarantees action — meaning an approval, denial, Request for Evidence (RFE), or Notice of Intent to Deny — within 15 business days of accepting the premium upgrade. Premium processing does NOT guarantee approval and does not shorten interview or visa bulletin waits. Fees and eligible form types can change; always verify the current fee and eligibility on the official USCIS Form I-907 premium processing page before filing.",
  },
  {
    question: "My H1B transfer has been pending for 4 months — is that normal?",
    answer:
      "It depends on the service center and current workload. Regular processing for I-129 H1B petitions has historically ranged from 3–8 months. Compare your receipt date against the current published time at egov.uscis.gov/processing-times for your specific service center and H1B classification. If you are outside the published window, ask your employer's attorney about a case inquiry or premium processing upgrade.",
  },
  {
    question: "What is the processing time for I-140 for Indian applicants?",
    answer:
      "Regular I-140 processing currently runs approximately 6–12+ months depending on service center and petition type. Premium processing upgrades I-140 to a 15 business day action window. Critically for Indian EB applicants — your priority date is set at I-140 receipt, not approval. Monitor uscis.gov and travel.state.gov for the visa bulletin.",
  },
  {
    question: "How long does an EAD (I-765) take to process?",
    answer:
      "EAD processing times vary by service center and category. Most EADs currently process in 3–7 months, though this fluctuates. File EAD renewals at least 180 days (6 months) before expiration to avoid gaps. An automatic extension of up to 540 days applies in many cases if you file on time before expiration — verify with uscis.gov and your attorney.",
  },
  {
    question: "Does a case transfer reset my processing time?",
    answer:
      "Functionally, yes — your case joins the new service center's queue from the transfer date. Your original receipt date and priority date remain unchanged. Check the published processing time for the new center after a transfer.",
  },
  {
    question: "Can I check processing times for my specific case?",
    answer:
      "Not precisely. USCIS publishes aggregate estimates by form type and service center — it does not publish individual case timelines. The best measure is to compare your receipt date to what USCIS shows on their processing times tool. Individual cases can vary from the aggregate due to complexity, RFEs, background checks, or workload spikes.",
  },
];

export default function ProcessingTimesPage() {
  const url = absoluteUrl("/tools/processing-times");
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

          {/* Static SEO context — renders BELOW the tool so the
              first interactive element clears the fold on a phone. */}
          <div className="mt-10 sm:mt-12">
            <ToolIntro content={content} />
          </div>
          <DataStamp
            className="mt-6"
            lastUpdated={processingData.lastUpdated}
            source={processingData.source}
            sourceLabel={processingData.sourceLabel}
          />
        </Container>
      </section>

      {/* Full SEO hub content: what results mean, form table, process,
          mistakes, related links (existing FAQ kept below) */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} hideFaq />
        </Container>
      </section>

      {/* Long-form explainer migrated from /uscis/processing-times */}
      <UscisProcessingTimesGuide />

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
                { href: "/uscis/case-status", label: "USCIS Case Status Guide", desc: "What every status message means for H1B, I-140, I-485, EAD" },
                { href: "/uscis/request-for-evidence-rfe", label: "RFE Guide", desc: "What to do when USCIS sends a Request for Evidence" },
                { href: "/tools/uscis-processing-delay-checker", label: "Processing Delay Checker", desc: "Is your H-1B, I-140, or I-485 case delayed?" },
                { href: "/tools/uscis-case-status-meaning", label: "USCIS Case Status Decoder", desc: "Plain-English meaning for every USCIS status message" },
                { href: "/tools/uscis-receipt-number-decoder", label: "Receipt Prefix Decoder", desc: "What IOE, LIN, SRC, EAC, WAC, MSC mean" },
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

      {/* Official USCIS reminder (migrated from /uscis/processing-times) */}
      <section className="border-t border-ink-900/5 bg-white py-8">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-ink-500">
            <p>
              <strong className="font-semibold text-ink-700">Official USCIS reminder:</strong>{" "}
              Always use{" "}
              <a href="https://egov.uscis.gov/processing-times" target="_blank" rel="noopener noreferrer" className="font-medium underline">
                egov.uscis.gov/processing-times
              </a>{" "}
              as the authoritative source for processing time estimates. USCIS updates these times monthly. NRItoUSA does not publish, predict, or guarantee processing times — this page is educational only.{" "}
              <strong className="font-semibold text-ink-700">NRItoUSA is not USCIS, not a law firm, and not your attorney.</strong>{" "}
              Consult a licensed immigration attorney for guidance on your specific case.
            </p>
          </div>
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
