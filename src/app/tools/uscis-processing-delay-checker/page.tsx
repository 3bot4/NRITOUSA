import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import UscisProcessingDelayChecker from "@/components/tools/UscisProcessingDelayChecker";
import { getTool } from "@/lib/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("uscis-processing-delay-checker")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-processing-delay-checker",
});

const faq: FaqItem[] = [
  {
    question: "What information do I need to use this tool?",
    answer:
      "Just your form type (e.g., I-129, I-485, I-765), current case status from egov.uscis.gov, and optionally your receipt month and year. You do NOT need to enter your receipt number, A-number, or any personal information.",
  },
  {
    question: "How do I know if my case is actually delayed?",
    answer:
      "The official benchmark is uscis.gov/check-processing-times. If your receipt date is earlier than the date USCIS is currently processing for your form and service center, your case may be outside the normal window. This tool gives an educational assessment — verify against the official USCIS tool.",
  },
  {
    question: "What should I do if my case is outside the normal processing window?",
    answer:
      "First verify against uscis.gov/check-processing-times. If confirmed, you can submit a case inquiry through your myUSCIS account or at egov.uscis.gov. For employer-filed petitions (H1B, I-140), contact your employer's immigration attorney rather than USCIS directly.",
  },
  {
    question: "Does premium processing guarantee my H1B will be approved quickly?",
    answer:
      "Premium processing guarantees USCIS will take action — an approval, denial, Request for Evidence (RFE), or Notice of Intent to Deny — within 15 business days of accepting the premium upgrade. It does not guarantee approval, and an RFE restarts the 15-day clock after your response is received.",
  },
  {
    question: "My I-485 has been pending over a year — is that normal for Indians?",
    answer:
      "For many Indian EB applicants, I-485 processing time is directly tied to visa bulletin priority date availability, not just USCIS workload. If your priority date retrogressed after you filed, USCIS may put your case on hold until the date becomes current again. Check the monthly visa bulletin at travel.state.gov alongside USCIS processing times.",
  },
  {
    question: "Can I contact USCIS directly about my H1B delay?",
    answer:
      "You can, but for employer-sponsored petitions, your employer's immigration attorney is generally a more effective contact point. Attorneys can submit formal case inquiries, escalate to USCIS liaisons, and track petition-specific issues that an individual inquiry may not resolve. Inform HR at your company first.",
  },
  {
    question: "I have an RFE — what now?",
    answer:
      "Contact your immigration attorney immediately — the same day. The deadline printed on the RFE notice controls (standard max ~84 days, ≈87 with US mailing time; some forms 30 days), and USCIS must receive your response by it. Missing it is serious — USCIS may deny the case as abandoned or decide it on the existing record. Your attorney will review the RFE, identify required evidence, and prepare a complete response.",
  },
];

export default function UscisProcessingDelayCheckerPage() {
  const url = absoluteUrl("/tools/uscis-processing-delay-checker");
  const jsonLd = jsonLdGraph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: tool.seoDescription,
      url,
      applicationCategory: "UtilityApplication",
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
      { name: tool.label, url: "/tools/uscis-processing-delay-checker" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-processing-delay-checker"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Is your H1B, I-140, I-485, or EAD case delayed? Select your form and status for an educational delay assessment — no receipt number needed."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/processing-times"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Full processing times guide →
            </Link>
            <Link
              href="/tools/uscis-case-status-meaning"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              Case Status Meaning Tool
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            Always verify at{" "}
            <a
              href="https://www.uscis.gov/check-processing-times"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov/check-processing-times
            </a>{" "}
            and consult a licensed immigration attorney for your situation.
          </p>
        }
      >
      {/* tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <UscisProcessingDelayChecker />
          </div>
        </Container>
      </section>

      {/* related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Related USCIS guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/uscis/processing-times", label: "Processing Times Explained", desc: "Full guide: H1B, I-140, I-485, EAD, premium processing" },
                { href: "/tools/uscis-case-status-meaning", label: "Case Status Meaning Tool", desc: "What does your current USCIS status mean?" },
                { href: "/uscis/case-status", label: "USCIS Case Status Guide", desc: "Every status message explained for Indian applicants" },
                { href: "/uscis/request-for-evidence-rfe", label: "RFE Guide", desc: "RFE received? What to do and how long you have" },
                { href: "/tools/uscis-receipt-number-decoder", label: "Receipt Prefix Decoder", desc: "What IOE, LIN, SRC, EAC, WAC, MSC mean" },
                { href: "/uscis", label: "USCIS Hub", desc: "Full USCIS overview for NRIs and Indian applicants" },
              ].map((g) => (
                <Link key={g.href} href={g.href} className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{g.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ + disclaimer */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
