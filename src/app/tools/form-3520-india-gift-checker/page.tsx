import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import DisclaimerBox from "@/components/tools/DisclaimerBox";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import Form3520IndiaGiftChecker from "@/components/tools/Form3520IndiaGiftChecker";
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

const tool = getTool("form-3520-india-gift-checker")!;
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

      <ToolHero tool={tool} />

      {/* Top disclaimer + checker */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl">
            <DisclaimerBox title="Important">
              This Form 3520 checker is for educational purposes only and is not
              tax, legal, or financial advice. It does not compute any tax,
              penalty, or threshold amount. Form 3520 thresholds, PFIC rules,
              and FBAR/FATCA thresholds change over time and depend on your
              facts — always verify current rules with the IRS and consult a
              qualified cross-border CPA (US side) and a Chartered Accountant
              (CA) (India side).
            </DisclaimerBox>
          </div>

          <Form3520IndiaGiftChecker />

          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            General educational checker; verify against current IRS guidance and
            India Income Tax Department rules for the relevant tax year.
          </p>
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
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-6 text-sm leading-relaxed text-ink-500 shadow-card">
            <strong className="font-semibold text-ink-700">
              Educational only — not tax advice.
            </strong>{" "}
            {site.name} is not a tax firm and does not provide tax, legal, or
            financial advice. Form 3520, FBAR/FATCA, and PFIC rules and
            thresholds change over time and vary by individual situation. Always
            verify current rules with the official{" "}
            <a
              href="https://www.irs.gov"
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              IRS
            </a>{" "}
            and consult a qualified cross-border CPA and a Chartered Accountant
            (CA) for your situation.
          </div>
        </Container>
      </section>

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/form-3520-india-gift-checker" />
        </Container>
      </section>
    </>
  );
}
