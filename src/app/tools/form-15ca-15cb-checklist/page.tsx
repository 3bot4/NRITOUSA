import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import RelatedGuides from "@/components/tools/RelatedGuides";
import RelatedToolsStrip from "@/components/RelatedToolsStrip";
import Form15Checklist from "@/components/tools/Form15Checklist";
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

const tool = getTool("form-15ca-15cb-checklist")!;
const LAST_UPDATED = "2026-06-22";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/form-15ca-15cb-checklist",
});

const faq: FaqItem[] = [
  {
    question: "Is this a tax calculator or legal advice?",
    answer:
      "Neither. It's an educational checklist that never decides which Form 15CA part applies, whether a Form 15CB is required, or any tax amount. It maps your source of funds and a few answers to the documents to collect and whether a CA review is strongly recommended. The correct 15CA part and 15CB requirement must be confirmed with your CA and bank.",
  },
  {
    question: "What is the difference between Form 15CA and Form 15CB?",
    answer:
      "Form 15CA is an online self-declaration filed by the person sending money abroad, given to the bank. Form 15CB is a certificate signed by a Chartered Accountant certifying the taxability, rate, TDS, and treaty position of the remittance, and is commonly required before filing the 15CA part used for larger taxable remittances.",
  },
  {
    question: "When do NRIs need a Form 15CB?",
    answer:
      "It is commonly required for taxable remittances above the specified financial-year threshold (often cited around ₹5 lakh), the route that pairs with Part C of Form 15CA. Some remittances need only a part of Form 15CA, and some are exempt. Whether yours needs a 15CB depends on the amount and taxability — confirm with your CA.",
  },
  {
    question: "What documents do banks ask for to send money from India to the USA?",
    answer:
      "Typically PAN and passport/OCI, the NRO account statement, source-of-funds proof, tax/TDS proof, Form 26AS/AIS, a Form 15CB if applicable, the Form 15CA acknowledgement, and the bank's repatriation request form. Property sales also need the sale and purchase deeds; inheritances need succession proof. The exact list varies by bank.",
  },
  {
    question: "Is there a limit on repatriating money from an NRO account?",
    answer:
      "Yes. Repatriation from NRO is subject to a FEMA limit, widely cited as up to USD 1 million per financial year, with documentation requirements. This is a FEMA/RBI rule, separate from the tax forms. Verify the current limit and conditions with your authorised-dealer bank.",
  },
  {
    question: "Do I have to report this money on my US taxes?",
    answer:
      "If you are a US tax resident, the income behind the money is generally reportable on your US return, and the underlying Indian accounts may trigger FBAR and FATCA. A large gift from family abroad can raise Form 3520 questions. Keep your repatriation records and coordinate with a CPA.",
  },
];

export default function Form15ChecklistPage() {
  const url = absoluteUrl("/tools/form-15ca-15cb-checklist");
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
      { name: tool.label, url: "/tools/form-15ca-15cb-checklist" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="form-15ca-15cb-checklist"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Moving money from India to the USA? Answer a few questions to get your tailored 15CA/15CB document checklist — and whether a CA review is needed."
        accent={tool.accent}
        disclaimerExtra={
          <p>
            This Form 15CA / 15CB checklist is for educational purposes only. It
            does not decide which Form 15CA part applies, whether a Form 15CB is
            required, or any tax amount. The forms, thresholds, and repatriation
            limits change over time and depend on your facts — always confirm
            with a qualified Chartered Accountant (CA) and your authorised-dealer
            bank.
          </p>
        }
      >
      {/* Checklist */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <Form15Checklist />

          <p className="mx-auto mt-6 max-w-3xl text-xs text-ink-400">
            Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            General educational checklist; verify against current Income Tax
            Department and RBI/FEMA guidance and your bank&apos;s requirements.
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
              "nre-nro-accounts-explained",
              "repatriate-india-property-sale-usa",
              "double-taxation-dtaa-india-usa",
              "gifting-money-india-tax-implications",
              "fbar-fatca-nri-guide",
            ]}
            extras={[
              {
                href: "/india-tax-compliance/form-15ca-15cb-nri-repatriation",
                title: "Form 15CA & 15CB for NRIs (full guide)",
                description:
                  "The pillar guide: what each form is, when banks ask, the document checklist, the four 15CA parts, and the before-you-wire workflow.",
              },
              {
                href: "/india-tax-compliance/nro-to-usa-transfer-documents",
                title: "NRO-to-USA Transfer Documents",
                description:
                  "The exact document checklist banks ask NRIs for when moving money from an NRO account to the USA.",
              },
            ]}
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-6 text-sm leading-relaxed text-ink-500 shadow-card">
            <strong className="font-semibold text-ink-700">
              Educational only — not tax, legal, or FEMA advice.
            </strong>{" "}
            {site.name} is not a tax or legal firm. The forms, thresholds, the
            Form 15CA Part A/B/C/D split, and repatriation limits change over
            time and vary by situation. Always confirm with a qualified
            Chartered Accountant (CA) and your authorised-dealer bank, and verify
            on the official{" "}
            <a
              href="https://www.incometax.gov.in"
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              Income Tax portal
            </a>{" "}
            and with the{" "}
            <a
              href="https://www.rbi.org.in"
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              RBI
            </a>
            .
          </div>
        </Container>
      </section>

      {/* Related tax & compliance tools (5 interlinks → hub) */}
      <section className="bg-slate-50/60 py-12 sm:py-16">
        <Container>
          <RelatedToolsStrip currentHref="/tools/form-15ca-15cb-checklist" />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
