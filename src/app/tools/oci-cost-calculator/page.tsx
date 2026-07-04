import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OciCostCalculator from "@/components/tools/OciCostCalculator";
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
import { OCI_BASE, OCI_TOOLS, OCI_DATA_AS_OF, VERIFY_SOURCES, totalWeeksLabel, ociSnapshotRows, OCI_SNAPSHOT_SOURCES, OCI_SNAPSHOT_DISCLAIMER } from "@/lib/oci/config";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const tool = getTool("oci-cost-calculator")!;
const PATH = OCI_TOOLS.cost.path;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "How much does an OCI card cost in the USA?",
    answer:
      "A typical fresh adult OCI runs the government service fee plus the VFS Global service charge and a small ICWF contribution, before optional add-ons like return courier, SMS updates, or a premium lounge. Use the calculator above for a line-by-line total for your service type. All figures are estimates — confirm live amounts on VFS before paying.",
  },
  {
    question: "What is the VFS service charge?",
    answer:
      "VFS Global handles OCI applications on behalf of the Indian consulates and charges its own per-application service fee on top of the government fee. A small Indian Community Welfare Fund (ICWF) contribution is also collected on consular services.",
  },
  {
    question: "Which fees are optional?",
    answer:
      "Return courier, SMS status updates, and premium lounge / assisted service are optional add-ons. Most applicants choose the secure return courier so their passport and OCI are mailed back with tracking, but you can opt out of any of them.",
  },
  {
    question: "Why don't the amounts match what I see on VFS?",
    answer:
      "Fees change, vary by consulate jurisdiction, and are revised without notice. This tool uses centrally maintained estimates stamped with an 'as of' date. Always treat the official VFS payment screen as the source of truth.",
  },
];

export default function OciCostCalculatorPage() {
  const url = absoluteUrl(PATH);
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "FinanceApplication",
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
        toolSlug="oci-cost-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "OCI Center", href: OCI_BASE },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category="OCI Center"
        title={tool.title}
        hook="Government fee, VFS service charge, courier, SMS, lounge — see the full OCI bill before you start the application."
        accent={tool.accent}
        sourceNote={
          <>
            Estimates summarised as of{" "}
            <time dateTime={OCI_DATA_AS_OF}>{OCI_DATA_AS_OF}</time>. Confirm live
            fees on{" "}
            <a
              href={VERIFY_SOURCES.ociServices.href}
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              VFS Global
            </a>
            .
          </>
        }
        disclaimerExtra={
          <p>
            OCI fees change frequently and vary by consulate jurisdiction. This
            calculator gives an educational estimate only. The official VFS
            payment screen is always the source of truth.
          </p>
        }
      >
        {/* Fast Answer: OCI fees */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="OCI cost — fee snapshot"
              answerLabel="Fresh OCI government fee (USA)"
              answer="$275"
              accent="amber"
              rows={ociSnapshotRows()}
              badges={["Govt fee $275", `Processing ${totalWeeksLabel()}`]}
              lastVerified={OCI_DATA_AS_OF}
              sources={OCI_SNAPSHOT_SOURCES}
              disclaimer={OCI_SNAPSHOT_DISCLAIMER}
              ctaText="Calculate my exact cost"
              ctaHref="#oci-cost-tool"
            />
          </Container>
        </section>

        <section id="oci-cost-tool" className="scroll-mt-24 pb-12 pt-10 sm:pb-16">
          <Container>
            <OciCostCalculator />
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50/60 p-5 text-sm">
              <strong className="font-semibold text-ink-900">Next:</strong>{" "}
              <span className="text-ink-600">
                See how long it takes with the{" "}
                <Link
                  href={OCI_TOOLS.timeline.path}
                  className="font-semibold text-brand-700 underline"
                >
                  OCI Timeline Calculator
                </Link>{" "}
                or check you qualify with the{" "}
                <Link
                  href={OCI_TOOLS.eligibility.path}
                  className="font-semibold text-brand-700 underline"
                >
                  Eligibility Checker
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
