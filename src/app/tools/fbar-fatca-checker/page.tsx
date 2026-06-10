import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import ComingSoon from "@/components/tools/ComingSoon";
import fbarData from "../../../../data/fbar-fatca.json";
import { getTool } from "@/lib/tools";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("fbar-fatca-checker")!;

export const metadata: Metadata = {
  title: tool.seoTitle,
  description: tool.seoDescription,
  alternates: { canonical: "/tools/fbar-fatca-checker" },
  openGraph: {
    type: "website",
    url: "/tools/fbar-fatca-checker",
    title: tool.seoTitle,
    description: tool.seoDescription,
  },
  twitter: { title: tool.seoTitle, description: tool.seoDescription },
};

const faq: FaqItem[] = [
  {
    question: "Do NRE and NRO accounts need to be reported on FBAR?",
    answer:
      "Yes. If the combined maximum value of all your foreign financial accounts — NRE, NRO, fixed deposits, Indian mutual funds, PPF/EPF, LIC policies with cash value, and demat accounts — exceeded $10,000 at any point in the year, you must file FinCEN Form 114 (FBAR). The threshold applies to the total across accounts, not each one.",
  },
  {
    question: "What is the difference between FBAR and FATCA (Form 8938)?",
    answer:
      "FBAR (FinCEN Form 114) is filed separately online with a flat $10,000 aggregate threshold. FATCA's Form 8938 is filed with your tax return and has higher thresholds — starting at $50,000 year-end ($100,000 married filing jointly) for US residents. Many NRIs must file both for the same accounts; the penalties for skipping either are severe.",
  },
];

export default function FbarFatcaCheckerPage() {
  const jsonLd = jsonLdGraph(
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/fbar-fatca-checker" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool} />

      <ComingSoon
        planned={[
          "Answer a few questions about your Indian accounts and balances",
          "Instant verdict: FBAR required, Form 8938 required, both, or neither",
          "Per-account-type guidance (NRE/NRO, mutual funds, PPF/EPF, LIC, demat)",
          "PFIC warning for Indian mutual funds and the forms it triggers",
        ]}
        lastUpdated={fbarData.lastUpdated}
        source={fbarData.source}
        sourceLabel={fbarData.sourceLabel}
      />

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>
    </>
  );
}
