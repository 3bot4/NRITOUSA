import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import ToolFaq from "@/components/tools/ToolFaq";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import NriTdsRefundChecklist from "@/components/tools/NriTdsRefundChecklist";
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

const tool = getTool("nri-tds-refund-checklist")!;
const content = getToolHubContent("nri-tds-refund-checklist")!;
const LAST_UPDATED = "2026-06-22";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/nri-tds-refund-checklist",
});

const faq: FaqItem[] = [
  {
    question: "Is this a tax calculator?",
    answer:
      "No. This is an educational checklist, not a calculator — it never computes a tax or refund amount. It maps your income type and a few situational answers to a tailored document checklist, the likely next review step, and questions to take to a CA. Your actual tax and refund depend on figures only you and your CA can compute for the current financial year.",
  },
  {
    question: "Can an NRI in the USA get an Indian TDS refund?",
    answer:
      "Yes, if the TDS deducted on your Indian income (NRO interest, property sale, rent, dividends, or capital gains) is more than your actual Indian tax liability. You claim the excess by filing an Indian income-tax return for the assessment year and having it refunded to a pre-validated NRO account. Confirm specifics with a CA.",
  },
  {
    question: "Why is TDS on NRO interest and property sales so high?",
    answer:
      "NRO interest is taxed at higher, NRI-specific TDS rates plus surcharge and cess, often from the first rupee. On a property sale, TDS is generally deducted on the entire sale price, not just your gain. Both are worst-case withholdings, not your final tax — the excess over your real liability is refundable when you file.",
  },
  {
    question: "What documents do I need for a TDS refund?",
    answer:
      "At minimum: PAN; Form 26AS, AIS, and TIS; NRO/NRE statements; and the TDS certificate (Form 16A for interest/fees, Form 16B for a property sale). Property sales also need the sale agreement, purchase deed, and a capital-gains computation. If you're claiming a DTAA treaty rate, add Form 10F and a Tax Residency Certificate.",
  },
  {
    question: "What is Form 13 and when should I use it?",
    answer:
      "Form 13 is an application for a certificate authorising a lower or nil rate of TDS on a specific payment, obtained before the income is paid. NRIs use it most for property sales, where default TDS on the full sale price dwarfs the tax on the actual gain — it reduces the withholding at closing instead of locking up your money until a refund.",
  },
  {
    question: "What if my bank's TDS doesn't match Form 26AS?",
    answer:
      "You can only claim a refund for TDS that the department actually shows against your PAN in Form 26AS. If the bank or buyer deducted TDS but it hasn't appeared — because of a late deposit, wrong PAN, or wrong quarter — ask the deductor to correct their TDS return so the credit reflects, then file. Filing against a credit that isn't in 26AS invites a notice.",
  },
];

export default function NriTdsRefundChecklistPage() {
  const url = absoluteUrl("/tools/nri-tds-refund-checklist");
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
      { name: tool.label, url: "/tools/nri-tds-refund-checklist" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="nri-tds-refund-checklist"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Too much TDS deducted on your Indian income? Map your refund: get the documents to collect, the next step, and questions for your CA."
        accent={tool.accent}
        sourceNote={
          <>
            General educational checklist · last updated{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>. Verify against
            current Income Tax Department guidance for the relevant year.
          </>
        }
        disclaimerExtra={
          <p>
            This TDS refund checklist is for educational purposes only and does
            not compute any tax or refund amount. Indian TDS rates, surcharge,
            cess, thresholds, and forms change every financial year — always
            verify current rates and forms on the official{" "}
            <a
              href="https://www.incometax.gov.in"
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              Income Tax portal
            </a>{" "}
            and consult a qualified Chartered Accountant (CA) for your situation.
          </p>
        }
      >
      {/* Checklist */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mb-8">
            <ToolIntro content={content} />
          </div>

          <NriTdsRefundChecklist />

          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            General educational checklist; verify against current Income Tax
            Department guidance for the relevant financial / assessment year.
          </p>
        </Container>
      </section>

      {/* Full SEO hub content: what result means, explainer, process,
          documents, mistakes, example, related links (FAQ kept below) */}
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
              "nre-nro-accounts-explained",
              "repatriate-india-property-sale-usa",
              "double-taxation-dtaa-india-usa",
              "selling-indian-shares-us-resident-tax",
              "indian-income-us-tax-return",
            ]}
            extras={[
              {
                href: "/india-tax-compliance/nri-tds-refund-usa",
                title: "NRI TDS Refund from USA (full guide)",
                description:
                  "The pillar guide: NRO interest, property-sale TDS, DTAA paperwork, Form 13, refunds, and CA questions.",
              },
              {
                href: "/india-tax-compliance/form-13-lower-tds-certificate-nri",
                title: "Form 13 Lower/Nil TDS Certificate for NRIs",
                description:
                  "How to get TDS reduced before a large payment like a property sale, instead of reclaiming it later.",
              },
            ]}
          />
        </Container>
      </section>

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/nri-tds-refund-checklist" />
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
