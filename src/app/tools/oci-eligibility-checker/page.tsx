import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OciEligibilityChecker from "@/components/tools/OciEligibilityChecker";
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
import { OCI_BASE, OCI_TOOLS, VERIFY_SOURCES } from "@/lib/oci/config";

const tool = getTool("oci-eligibility-checker")!;
const PATH = OCI_TOOLS.eligibility.path;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Who is eligible for an OCI card?",
    answer:
      "Broadly, a foreign national who was an Indian citizen, or whose parent, grandparent, or great-grandparent was an Indian citizen, is eligible — as is the foreign spouse of an Indian citizen or OCI holder where the marriage has been registered and subsisting for at least two years. You must be a foreign national: current Indian citizens cannot hold OCI.",
  },
  {
    question: "Can a current Indian citizen get OCI?",
    answer:
      "No. OCI is only for foreign nationals of Indian origin. India does not allow dual citizenship, so you would first surrender your Indian passport after acquiring another citizenship and then apply for OCI.",
  },
  {
    question: "Are people with Pakistan or Bangladesh links eligible?",
    answer:
      "No. Anyone who is, or whose parents, grandparents, or great-grandparents were, citizens of Pakistan or Bangladesh is excluded from OCI under the current rules, regardless of other Indian-origin links.",
  },
  {
    question: "Can my US-born child get OCI through me?",
    answer:
      "Yes. A minor child generally qualifies through an Indian-origin parent. Minor applications require both parents' consent and signatures and a different document set — use the document checklist generator for the exact list.",
  },
  {
    question: "Does this checker decide my application?",
    answer:
      "No. It's an educational screening based on the broad eligibility rules and your answers. The final decision always rests with the Indian government via VFS Global and the consulate. Always confirm borderline cases with your consulate.",
  },
];

export default function OciEligibilityCheckerPage() {
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
        toolSlug="oci-eligibility-checker"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "OCI Center", href: OCI_BASE },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category="OCI Center"
        title={tool.title}
        hook="Born in India, or have Indian parents or grandparents? Find out in about a minute whether you qualify for an OCI card."
        accent={tool.accent}
        sourceNote={
          <>
            Based on the broad OCI eligibility rules. Verify your case on{" "}
            <a
              href={VERIFY_SOURCES.ociServices.href}
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              VFS Global
            </a>{" "}
            and with your Indian consulate.
          </>
        }
        disclaimerExtra={
          <p>
            This eligibility checker is educational only and is not legal or
            immigration advice. OCI rules have exclusions and edge cases this
            tool cannot fully capture. Always confirm with VFS Global and your
            Indian consulate before applying.
          </p>
        }
      >
        <section className="pb-12 pt-6 sm:pb-16">
          <Container>
            <OciEligibilityChecker />
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50/60 p-5 text-sm">
              <strong className="font-semibold text-ink-900">Eligible?</strong>{" "}
              <span className="text-ink-600">
                Build your exact paperwork with the{" "}
                <Link
                  href={OCI_TOOLS.checklist.path}
                  className="font-semibold text-brand-700 underline"
                >
                  Document Checklist Generator
                </Link>
                , then estimate your{" "}
                <Link
                  href={OCI_TOOLS.cost.path}
                  className="font-semibold text-brand-700 underline"
                >
                  cost
                </Link>{" "}
                and{" "}
                <Link
                  href={OCI_TOOLS.timeline.path}
                  className="font-semibold text-brand-700 underline"
                >
                  timeline
                </Link>
                . New to OCI? Start at the{" "}
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
