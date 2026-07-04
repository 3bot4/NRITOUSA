import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OciTimelineCalculator from "@/components/tools/OciTimelineCalculator";
import { getTool } from "@/lib/tools";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  OCI_BASE,
  OCI_TOOLS,
  OCI_DATA_AS_OF,
  totalWeeksLabel,
  VERIFY_SOURCES,
  ociSnapshotRows,
  OCI_SNAPSHOT_SOURCES,
  OCI_SNAPSHOT_DISCLAIMER,
} from "@/lib/oci/config";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const tool = getTool("oci-timeline-calculator")!;
const PATH = OCI_TOOLS.timeline.path;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "How long does OCI take to process in the USA?",
    answer: `Typical end-to-end processing runs about ${totalWeeksLabel()} from VFS submission to delivery, covering VFS document check, consulate processing, Ministry of Home Affairs (MHA) clearance in India, printing, and dispatch. MHA clearance is usually the longest and most variable stage. Individual cases vary widely.`,
  },
  {
    question: "Why does OCI take longer than a passport renewal?",
    answer:
      "OCI requires a two-stage government clearance — the consulate processes the application and forwards it to the Ministry of Home Affairs in India for background clearance before the card is granted and printed. That extra India-side step is why OCI runs weeks longer than a passport re-issue.",
  },
  {
    question: "Can I track my OCI status?",
    answer:
      "Yes. You can track status on the Government of India OCI portal using your application reference, and VFS offers optional SMS updates. The timeline above is an estimate to plan around, not a guarantee.",
  },
  {
    question: "When should I start if I need OCI for travel?",
    answer:
      "Because MHA clearance is variable, start well before any planned India travel — several months ahead is prudent. Never book non-refundable travel assuming a fixed OCI delivery date.",
  },
];

export default function OciTimelineCalculatorPage() {
  const url = absoluteUrl(PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "OCI Center", url: OCI_BASE },
      { name: tool.label, url: PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="oci-timeline-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "OCI Center", href: OCI_BASE },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category="OCI Center"
        title={tool.title}
        hook="Submitting soon? See a stage-by-stage OCI timeline and an estimated delivery window from your application date."
        accent={tool.accent}
        sourceNote={
          <>
            Estimated ranges summarised as of{" "}
            <time dateTime={OCI_DATA_AS_OF}>{OCI_DATA_AS_OF}</time>. Track live
            status on the{" "}
            <a
              href={VERIFY_SOURCES.ociPortal.href}
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              OCI portal
            </a>
            .
          </>
        }
        disclaimerExtra={
          <p>
            OCI processing times vary widely by case and consulate and can change
            without notice. This timeline is an educational estimate for planning
            only — never book non-refundable travel against it.
          </p>
        }
      >
        {/* Fast Answer: OCI timeline */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="OCI processing time — at a glance"
              answerLabel="Fresh OCI end-to-end (USA)"
              answer={totalWeeksLabel()}
              accent="amber"
              rows={ociSnapshotRows()}
              badges={[`Processing ${totalWeeksLabel()}`, "Govt fee $275"]}
              lastVerified={OCI_DATA_AS_OF}
              sources={OCI_SNAPSHOT_SOURCES}
              disclaimer={OCI_SNAPSHOT_DISCLAIMER}
              ctaText="Estimate my OCI dates"
              ctaHref="#oci-timeline-tool"
            />
          </Container>
        </section>

        <section id="oci-timeline-tool" className="scroll-mt-24 pb-12 pt-10 sm:pb-16">
          <Container>
            <OciTimelineCalculator />
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50/60 p-5 text-sm">
              <strong className="font-semibold text-ink-900">Next:</strong>{" "}
              <span className="text-ink-600">
                Estimate your{" "}
                <Link
                  href={OCI_TOOLS.cost.path}
                  className="font-semibold text-brand-700 underline"
                >
                  total cost
                </Link>{" "}
                or return to the{" "}
                <Link href={OCI_BASE} className="font-semibold text-brand-700 underline">
                  OCI Center
                </Link>
                .
              </span>
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
