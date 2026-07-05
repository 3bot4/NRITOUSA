import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import ToolFaq from "@/components/tools/ToolFaq";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import Form3520IndiaGiftChecker from "@/components/tools/Form3520IndiaGiftChecker";
import { getTool } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const tool = getTool("form-3520-india-gift-checker")!;
const content = getToolHubContent("form-3520-india-gift-checker")!;
const LAST_UPDATED = "2026-06-22";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/form-3520-india-gift-checker",
});

const faq: FaqItem[] = [
  {
    question: "Is this a tax calculator?",
    answer:
      "No. This is an educational checker, not a calculator — it never computes any tax, penalty, or threshold figure. It maps a few situational answers to a Form 3520, FBAR/FATCA, and PFIC review flag, the documents to collect, and questions for your CPA and CA. Your actual obligations depend on facts and current-year rules only a cross-border professional can confirm.",
  },
  {
    question: "Is a gift or inheritance from India taxable in the US?",
    answer:
      "Generally no — receiving a gift or inheritance from a foreign person is not taxable income to you in the US. The catch is reporting: large foreign gifts and bequests can require Form 3520 (a disclosure, not a tax), and the income the assets later earn is taxable. The checker flags the reporting side.",
  },
  {
    question: "What is the Form 3520 threshold for a gift from my parents?",
    answer:
      "Gifts and bequests from a nonresident alien individual or a foreign estate are reported on Form 3520 when the year's total exceeds US $100,000. Gifts from a foreign corporation or partnership use a separate, much lower threshold the IRS adjusts annually for inflation. The tests are on the aggregate, and related donors can be combined.",
  },
  {
    question: "Why does the asset type matter?",
    answer:
      "Because it drives the other US filings. Indian mutual funds are generally PFICs (possible Form 8621 with punitive default rules), Indian financial accounts feed FBAR and FATCA, and property or shares raise cost-basis questions for a future sale. The checker raises the relevant flags based on what you received.",
  },
  {
    question: "Does it matter whether the money landed in India or the USA?",
    answer:
      "For Form 3520, not much — that test is about the gift itself. But money or securities sitting in an Indian account become FBAR/FATCA items once they're yours, and moving them to the US later needs repatriation paperwork (Form 15CA/15CB). The checker adds those steps when relevant.",
  },
  {
    question: "Is Form 3520 a tax on the gift?",
    answer:
      "No. Form 3520 is an information return — a disclosure. There is generally no US tax on receiving a foreign gift or inheritance. The risk is the penalty for failing to file or filing late, which can be a percentage of the unreported amount, so the filing itself is what matters.",
  },
];

export default function Form3520IndiaGiftCheckerPage() {
  const url = absoluteUrl("/tools/form-3520-india-gift-checker");
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
      { name: tool.label, url: "/tools/form-3520-india-gift-checker" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="form-3520-india-gift-checker"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Money or assets from family in India? Answer a few questions to flag whether Form 3520, FBAR/FATCA, or PFIC review may apply — and what to collect."
        accent={tool.accent}
        disclaimerExtra={
          <p>
            This Form 3520 checker is for educational purposes only and does not
            compute any tax, penalty, or threshold amount. Form 3520, PFIC, and
            FBAR/FATCA rules and thresholds change over time and depend on your
            facts — always verify current rules with the{" "}
            <a
              href="https://www.irs.gov"
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              IRS
            </a>{" "}
            and consult a qualified cross-border CPA (US side) and a Chartered
            Accountant (CA) (India side).
          </p>
        }
      >
      {/* Checker */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>

          <Form3520IndiaGiftChecker />

          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            General educational checker; verify against current IRS guidance and
            India Income Tax Department rules for the relevant tax year.
          </p>
        </Container>
      </section>

      {/* Full SEO hub content: what result means, explainer, process,
          mistakes, example, related links (FAQ kept below) */}
      <section className="py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} hideFaq />
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>

      {/* Related guides + disclaimer */}
      <section className="py-12 sm:py-16">
        <Container>
          <RelatedGuides
            slugs={[
              "gifting-money-india-tax-implications",
              "inheriting-indian-assets-us-tax",
              "fbar-fatca-nri-guide",
              "pfic-indian-mutual-funds-trap",
              "repatriate-india-property-sale-usa",
            ]}
            extras={[
              {
                href: "/india-tax-compliance/foreign-gifts-inheritance-form-3520-india",
                title: "Gifts, Inheritance & Form 3520 (full hub)",
                description:
                  "The pillar guide: cash gifts, inheritance, property, Form 3520, FBAR/FATCA, PFIC, and Indian documentation.",
              },
              {
                href: "/india-tax-compliance/form-3520-indian-gift-inheritance-checklist",
                title: "Form 3520 Checklist for Indian Gifts & Inheritance",
                description:
                  "When a gift or inheritance must be reported, the two thresholds, documents, deadlines, and CPA questions.",
              },
            ]}
          />
        </Container>
      </section>

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/form-3520-india-gift-checker" />
        </Container>
      </section>
      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["tax", "taxRoadmap", "fbar", "wealthCheckup"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
