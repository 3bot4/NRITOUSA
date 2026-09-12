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
  category: "immigration",
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/processing-times",
});

const faq: FaqItem[] = [
  {
    question: "How long does an H-1B extension or transfer take in 2026?",
    answer:
      "This page does not print a figure, because USCIS publishes processing times per form, per subtype and per office, and they change monthly — a single range copied onto a web page is wrong for most readers almost immediately. Look up I-129 for your H-1B subtype and your service center on the official USCIS processing-times tool. Premium processing is a separate question: for I-129 classifications USCIS guarantees adjudicative action within 15 business days, which means an approval, denial, notice of intent to deny or request for evidence — not an approval.",
  },
  {
    question: "What is the H-1B visa stamping wait at Indian consulates?",
    answer:
      "Appointment waits change constantly and differ by post and visa class, so no figure is printed here. The Department of State publishes live appointment wait times by post — check those on the day you plan. Note separately that H-1B and H-4 lost interview-waiver (dropbox) eligibility under the rule effective 1 October 2025, so plan for an in-person interview for every applicant.",
  },
  {
    question: "What does the number USCIS shows actually mean?",
    answer:
      "USCIS's displayed processing time for a form and office generally represents the time within which 80% of adjudicated cases were completed over the relevant recent period. It is a descriptive statistic about cases already decided — not a target, not a queue position, and not a promise about your case. Separately, the tool returns a case inquiry date, and that date is what determines whether you can submit an outside-normal-processing-time inquiry.",
  },
  {
    question: "What is premium processing and does it guarantee approval?",
    answer:
      "It is an optional paid service under Form I-907 for certain forms. USCIS guarantees adjudicative action within the applicable period or refunds the premium fee — action meaning an approval notice, denial notice, notice of intent to deny, or request for evidence, or the opening of a fraud investigation. It does not guarantee approval and does not shorten interview or visa bulletin waits. The period is not always 15 business days: it is 15 for most classifications, 30 for Form I-765 and for I-539 change-of-status requests to F, M or J status, and 45 for Form I-140 E13 multinational executive and manager and E21 national interest waiver classifications.",
  },
  {
    question: "Does every I-140 get 15 business days under premium processing?",
    answer:
      "No. Most I-140 classifications do — E11, E12, E31, E32, EW3 and E21 without a national interest waiver. But E13 multinational executive and manager, and E21 with a national interest waiver, carry a 45-business-day premium period. The waiver is what changes it: an E21 petition without a NIW is a 15-day classification and the same petition seeking a NIW is a 45-day one.",
  },
  {
    question: "Is premium processing available for an EAD?",
    answer:
      "Yes, for eligible Form I-765 requests, with a 30-business-day premium period rather than 15. F-1 students seeking OPT and STEM OPT extensions have been eligible for all pending and initial I-765 filings since 3 April 2023. Check current eligibility for your specific category on the USCIS premium processing page before filing.",
  },
  {
    question: "What happens to the premium processing clock if I get an RFE?",
    answer:
      "The premium period stops and resets. A new premium processing period begins when USCIS receives your response to the request for evidence or notice of intent to deny. Your deadline to respond is the exact date printed on the notice itself — do not work from a generic figure, because response windows vary by notice and a date computed from a blog post is not one USCIS recognises.",
  },
  {
    question: "Does a case transfer reset my processing time?",
    answer:
      "No. Your receipt date does not change and your case does not start over from the transfer date. The original receipt date continues to govern your place in the queue and your case inquiry date. After a transfer, look up the processing time and inquiry date for the office now handling the case, but keep using your original receipt date when you compare.",
  },
  {
    question: "My case was transferred to the National Benefits Center. Does that mean an interview?",
    answer:
      "Not reliably. Cases move between offices for workload and routing reasons, and a destination office is not a signal about what happens next. Read the transfer notice itself rather than inferring a meaning from where the case went.",
  },
  {
    question: "Can I check processing times for my specific case?",
    answer:
      "Not precisely. USCIS publishes aggregate figures by form, subtype and office — it does not publish individual case timelines. The usable test is the case inquiry date: compare your receipt date against it on the official tool. Individual cases vary from the aggregate because of complexity, requests for evidence, background checks and workload.",
  },
  {
    question: "Do EAD renewals still get an automatic extension?",
    answer:
      "It depends when you filed. A qualifying renewal Form I-765 filed before 30 October 2025 may retain the automatic extension treatment that applied at the time of filing. A renewal filed on or after that date generally does not receive an automatic extension, following the Federal Register rule published that day, unless another law, regulation or notice provides one. Check your own filing date against the rule rather than relying on anything written earlier.",
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
        hook="Where a wait is tied to a dated official source we show it; where it is not, we send you to the official tool rather than print an estimate. Plus a delay checker built on your own USCIS case inquiry date."
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
              as the authoritative source for processing time estimates. USCIS updates these times monthly. NRItoUSA does not predict or guarantee processing times, and publishes a figure only where it is tied to a dated, service-specific official source — otherwise this page links to that source instead. Educational only.{" "}
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
