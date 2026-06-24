import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import RelatedHubs from "@/components/RelatedHubs";
import ToolFaq from "@/components/tools/ToolFaq";
import UscisStatusTool from "@/components/tools/UscisStatusTool";
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

const tool = getTool("uscis-case-status-meaning")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-case-status-meaning",
});

const faq: FaqItem[] = [
  {
    question: "What information do I need to use this tool?",
    answer:
      "Just your form type (e.g., I-129, I-485, I-765) and the current status message from the USCIS case status portal. You do NOT need to enter your receipt number, A-number, passport number, or any personal information.",
  },
  {
    question: "How do I find my current USCIS status?",
    answer:
      "Go to egov.uscis.gov/casestatus and enter your receipt number — the 13-character code on your I-797 Notice of Action. Your receipt number looks like LIN2412345678 or IOE0123456789. Note the exact status message shown and enter it in this tool.",
  },
  {
    question: "My status says \"Case Is Being Actively Reviewed\" for months — is that normal?",
    answer:
      "Yes, this is common. \"Actively Reviewed\" can last from a few days to many months depending on the form, service center, and current workload. Compare your wait against the published processing times at uscis.gov for your specific form and service center. Only submit an inquiry if you are outside the published window.",
  },
  {
    question: "What should I do when I get an RFE?",
    answer:
      "Contact your immigration attorney immediately — the same day if possible. The deadline on the RFE notice (usually 87 days from the notice date, not the date you received it) is a hard cut-off. A missed RFE deadline typically results in automatic denial. Your attorney will help you gather the required evidence and prepare a complete response.",
  },
  {
    question: "I-140 was approved but I can't file I-485 yet — what do I do?",
    answer:
      "For Indian EB applicants, I-140 approval is just the beginning. Your priority date must become current in the State Department's visa bulletin before you can file I-485 or proceed to consular processing. Monitor the visa bulletin monthly at travel.state.gov. In the meantime, keep your H1B status valid (the I-140 approval supports H1B extensions beyond 6 years) and consult your attorney about AC21 portability if you plan to change jobs.",
  },
  {
    question: "Can I travel while my I-485 is pending?",
    answer:
      "For many I-485 applicants, leaving the United States without Advance Parole (Form I-131) can risk abandonment of the adjustment application. Some H/L visa holders may have exceptions if they maintain valid status and re-enter properly, but travel rules are fact-specific. Never travel internationally while I-485 is pending without consulting your immigration attorney and without physically holding an approved Advance Parole document.",
  },
  {
    question: "My case was denied — what are my options?",
    answer:
      "You generally have several options: Motion to Reopen (MTR) or Motion to Reconsider (MTC) — must be filed within 33 days of the denial date; AAO appeal for certain form types; refiling with improved evidence; or federal court challenge in rare cases. Contact your immigration attorney the same day you receive a denial. The deadlines are short and missing them forecloses options.",
  },
];

export default function UscisStatusMeaningPage() {
  const url = absoluteUrl("/tools/uscis-case-status-meaning");
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
      { name: tool.label, url: "/tools/uscis-case-status-meaning" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-case-status-meaning"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="What does your USCIS status actually mean? Select your form and status for a plain-English explanation and next steps — no receipt number needed."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/case-status"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Full case status guide →
            </Link>
            <Link
              href="/uscis/receipt-number"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              What is a receipt number?
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            Always verify at{" "}
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov
            </a>{" "}
            and consult a licensed immigration attorney for your situation.
          </p>
        }
      >
      {/* Tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <UscisStatusTool />
          </div>
        </Container>
      </section>

      {/* Related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">
              Related USCIS guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/uscis/case-status",
                  label: "USCIS Case Status Explained",
                  desc: "Full guide to every status message for H1B, I-140, I-485, EAD",
                },
                {
                  href: "/uscis/receipt-number",
                  label: "USCIS Receipt Number Guide",
                  desc: "IOE, LIN, SRC, EAC, WAC, MSC prefix codes explained",
                },
                {
                  href: "/uscis/request-for-evidence-rfe",
                  label: "RFE Guide",
                  desc: "What to do when USCIS sends a Request for Evidence",
                },
                {
                  href: "/uscis/case-approved-what-next",
                  label: "Case Approved — What Next",
                  desc: "Post-approval steps for H1B, I-140, I-485, EAD, N-400",
                },
                {
                  href: "/tools/green-card-tracker",
                  label: "Green Card Stage Finder",
                  desc: "Track your EB green card stage and estimated wait",
                },
                {
                  href: "/tools/processing-times",
                  label: "Processing Times",
                  desc: "Current USCIS processing time estimates by form",
                },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                    {g.label}
                  </p>
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
      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["immigration", "uscis", "tax", "wealth"]} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
