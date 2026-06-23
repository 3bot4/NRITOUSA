import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import UscisReceiptDecoder from "@/components/tools/UscisReceiptDecoder";
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

const tool = getTool("uscis-receipt-number-decoder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-receipt-number-decoder",
});

const faq: FaqItem[] = [
  {
    question: "What does the prefix on my USCIS receipt number mean?",
    answer:
      "The first three letters often indicate the initial USCIS system, service center, or intake location: IOE = filed online via myUSCIS, LIN = Nebraska Service Center, SRC = Texas Service Center, EAC = Vermont Service Center, WAC = California Service Center, MSC/NBC = National Benefits Center. However, USCIS may transfer or route cases internally, so the prefix does not always prove where your case is currently being processed. The prefix does NOT tell you how long your case will take, whether it will be approved, or where you are in the queue.",
  },
  {
    question: "Do I need to enter my full receipt number to use this tool?",
    answer:
      "No — and you should not. This tool only asks for the first 3 letters (the prefix) and optionally your form type. There is no reason to enter your full receipt number anywhere except the official USCIS case status portal at egov.uscis.gov.",
  },
  {
    question: "My receipt number starts with IOE — is that different from LIN, SRC, etc.?",
    answer:
      "IOE receipt numbers are issued when you file online through the USCIS website (myUSCIS). They work exactly the same way for case status tracking at egov.uscis.gov. USCIS routes your IOE case to an appropriate service center for adjudication — you may never see a physical service center prefix on that application.",
  },
  {
    question: "My I-485 receipt prefix changed from LIN to MSC — what happened?",
    answer:
      "Your case was transferred from the Nebraska Service Center to the National Benefits Center (NBC), which uses the MSC prefix. This is standard procedure for I-485 adjustment of status cases — the NBC routes them to local field offices for interview scheduling. It does not restart your processing or affect your priority date.",
  },
  {
    question: "Can I check case status with just the prefix?",
    answer:
      "No — you need the full 13-character receipt number to check status on the USCIS portal. The prefix alone identifies the service center, not your specific case. Enter the full receipt number from your I-797 at egov.uscis.gov/casestatus.",
  },
  {
    question: "Why should I never share my full receipt number publicly?",
    answer:
      "Your receipt number is linked to your immigration record. Anyone with your receipt number can look up your case status and see your application type, filing date, and current status. Never post it on Reddit, Facebook, WhatsApp groups, Discord, or any public forum. Share only with your employer, immigration attorney, or USCIS directly.",
  },
  {
    question: "Once I know my status, how do I understand what it means?",
    answer:
      "Use the USCIS Case Status Meaning Tool at /tools/uscis-case-status-meaning. Select your form type and status message to get a plain-English explanation, typical next steps, and guidance on when to contact your attorney.",
  },
];

export default function UscisReceiptNumberDecoderPage() {
  const url = absoluteUrl("/tools/uscis-receipt-number-decoder");
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
      { name: tool.label, url: "/tools/uscis-receipt-number-decoder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-receipt-number-decoder"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="What does your USCIS receipt prefix mean? Select IOE, LIN, SRC, EAC, WAC, or MSC to see which service center has your case — no full number needed."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/receipt-number"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Full receipt number guide →
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
            <UscisReceiptDecoder />
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
                  href: "/uscis/receipt-number",
                  label: "Receipt Number Explained",
                  desc: "Full guide: what it is, where to find it, what each prefix means",
                },
                {
                  href: "/tools/uscis-case-status-meaning",
                  label: "Case Status Meaning Tool",
                  desc: "Decode your USCIS status message — H1B, I-140, I-485, EAD",
                },
                {
                  href: "/uscis/case-status",
                  label: "USCIS Case Status Guide",
                  desc: "Every status message explained for Indian applicants",
                },
                {
                  href: "/uscis/request-for-evidence-rfe",
                  label: "RFE Guide",
                  desc: "What to do when USCIS sends a Request for Evidence",
                },
                {
                  href: "/uscis",
                  label: "USCIS Hub",
                  desc: "Full USCIS overview for NRIs and Indian applicants",
                },
                {
                  href: "/uscis/case-approved-what-next",
                  label: "Case Approved — What Next",
                  desc: "Post-approval steps for H1B, I-140, I-485, EAD, N-400",
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
      </ToolFirstLayout>
    </>
  );
}
