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
const LAST_UPDATED = "2026-07-15";
const TITLE = "Form 3520 India Gift and Inheritance Checker";
const SEO_TITLE = "Form 3520 Gift Checker for India | Free Tool";
const SEO_DESCRIPTION =
  "Check whether a gift or inheritance from India may trigger Form 3520, foreign-trust, FBAR/FATCA or PFIC review. No signup or personal data.";

export const metadata: Metadata = pageMetadata({
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  path: "/tools/form-3520-india-gift-checker",
});

const faq: FaqItem[] = [
  {
    question: "Is this a tax calculator?",
    answer:
      "No. This is an educational screening tool, not a calculator — it never computes any tax or penalty figure. It maps a few situational answers to a Form 3520 result (with the threshold and tax year used), FBAR/FATCA, and PFIC review flags, the documents to collect, and questions for your CPA and CA. Your actual obligations depend on facts and current-year rules only a cross-border professional can confirm.",
  },
  {
    question: "Is a gift or inheritance from India taxable in the US?",
    answer:
      "Generally no — receiving a genuine gift or inheritance from a foreign person is not taxable income to you in the US. The catch is reporting: large foreign gifts and bequests can require Form 3520 (a disclosure, not a tax), and the income the assets later earn is taxable. Covered-expatriate gifts and foreign-trust transactions can follow special rules. The checker flags the reporting side.",
  },
  {
    question: "What is the Form 3520 threshold for a gift from my parents?",
    answer:
      "Gifts and bequests from a nonresident alien individual or a foreign estate are reported on Form 3520 when the year's total exceeds US $100,000. Purported gifts from a foreign corporation or partnership use a separate, much lower threshold the IRS indexes annually — $20,573 for tax year 2026 and $20,116 for 2025. A foreign trust follows a different rule entirely. The tests are on the aggregate, and related donors can be combined.",
  },
  {
    question: "Why are foreign trusts treated differently?",
    answer:
      "A distribution from a foreign trust is reviewed under Form 3520 Part III (and possibly Form 3520-A) — not the ordinary $100,000 gift test. The checker routes a foreign-trust answer to a specialist-review result rather than applying the gift threshold.",
  },
  {
    question: "Does it matter whether the money landed in India or the USA?",
    answer:
      "For the Form 3520 test itself, not much — that turns on the gift or bequest. But money or securities held in an Indian account become FBAR/FATCA review items once they're yours, and any later remittance to the US may require bank/FEMA documentation (such as Form 15CA/15CB) depending on the source and route. The checker adds those steps when relevant, without claiming a filing is always required.",
  },
  {
    question: "Is Form 3520 a tax on the gift?",
    answer:
      "No. Form 3520 is an information return — a disclosure filed separately from Form 1040. There is generally no US tax on receiving a foreign gift or inheritance. The risk is the penalty for failing to file or filing late, which can be a percentage of the unreported amount, so the filing itself is what matters.",
  },
];

export default function Form3520IndiaGiftCheckerPage() {
  const url = absoluteUrl("/tools/form-3520-india-gift-checker");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: TITLE,
      description: SEO_DESCRIPTION,
      url,
      applicationCategory: "FinanceApplication",
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
        title={TITLE}
        hook="Money or assets from family in India? Answer a few questions to flag whether Form 3520, foreign-trust, FBAR/FATCA, or PFIC review may apply — and what to collect."
        accent={tool.accent}
        topDisclaimer={
          <>Educational screening only — not tax or legal advice, and not a filing determination.</>
        }
        disclaimerIntro="This tool is for general education and screening only. It is not tax or legal advice and does not provide a filing determination. Form 3520, PFIC, and FBAR/FATCA rules and thresholds change over time and depend on your facts."
        disclaimerPoints={[
          "For educational screening only — not a filing determination.",
          "Not tax or legal advice.",
          "Thresholds, forms, due dates, and rules can change at any time.",
          "Verify current rules with the IRS, FinCEN, the RBI, and the Indian Income Tax Department before acting.",
          "Consult a qualified cross-border CPA (US side) and a Chartered Accountant (CA) (India side) when it matters to your situation.",
        ]}
        disclaimerExtra={
          <p>
            Verify current rules with the{" "}
            <a
              href="https://www.irs.gov"
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              IRS
            </a>{" "}
            and the{" "}
            <a
              href="https://www.incometax.gov.in"
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              Indian Income Tax Department
            </a>
            , and consult a qualified cross-border CPA (US side) and a Chartered
            Accountant (CA) (India side).
          </p>
        }
      >
      {/* Checker */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro
              content={content}
              verifyNote={
                <>
                  <strong className="font-bold">Important:</strong> Tax
                  thresholds, filing instructions and remittance procedures can
                  change. Verify current requirements with the IRS, FinCEN, RBI
                  and the Indian Income Tax Department. For advice concerning
                  your facts, consult a qualified cross-border CPA and an Indian
                  Chartered Accountant. This tool provides an educational
                  screening result only. It does not determine whether you have
                  a filing obligation and is not tax, legal or financial advice.
                </>
              }
            />
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
      <section className="no-print py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} hideFaq />
        </Container>
      </section>

      {/* FAQ */}
      <section className="no-print bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>

      {/* Related guides + disclaimer */}
      <section className="no-print py-12 sm:py-16">
        <Container>
          <RelatedGuides
            slugs={[
              "inheriting-indian-assets-us-tax",
              "fbar-fatca-nri-guide",
              "pfic-indian-mutual-funds-trap",
              "repatriate-india-property-sale-usa",
            ]}
            extras={[
              {
                href: "/india-tax-compliance/foreign-gifts-inheritance-form-3520-india",
                title: "Foreign gifts & inheritance from India (pillar guide)",
                description:
                  "The overview: cash gifts, inheritance, property, Form 3520, FBAR/FATCA, PFIC, and Indian documentation.",
              },
              {
                href: "/india-tax-compliance/gift-from-parents-india-to-usa",
                title: "Gift from parents in India to the USA",
                description:
                  "Cash gifts from Indian parents to a US child, including home down payments — tax, Form 3520, LRS/TCS, and documents.",
              },
              {
                href: "/india-tax-compliance/form-3520-indian-gift-inheritance-checklist",
                title: "Form 3520 checklist for Indian gifts & inheritance",
                description:
                  "The step-by-step checklist: thresholds, donor types, deadlines, records, and CPA questions.",
              },
            ]}
          />
        </Container>
      </section>

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="no-print bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/form-3520-india-gift-checker" />
        </Container>
      </section>
      <section className="no-print py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["tax", "taxRoadmap", "fbar", "wealthCheckup"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
