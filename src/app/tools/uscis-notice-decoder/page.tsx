import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import UscisNoticeDecoder from "@/components/tools/UscisNoticeDecoder";
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

const tool = getTool("uscis-notice-decoder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-notice-decoder",
});

const faq: FaqItem[] = [
  {
    question: "Do I need to upload my USCIS notice to use this tool?",
    answer:
      "No. This tool is fully selection-based — you select your notice type, the related form, and your situation. You never upload any document, and you never enter your receipt number, A-number, date of birth, address, or any personal identifying information. Everything runs in your browser.",
  },
  {
    question: "What is an I-797 notice?",
    answer:
      "I-797 is the standard Notice of Action issued by USCIS. There are four variants: I-797A (approval with I-94 attached, usually for H1B), I-797B (approval without I-94, usually for I-140), I-797C (receipt, transfer, or rejection notices), and I-797D (benefit card). Select the specific notice type in the tool for plain-English guidance.",
  },
  {
    question: "I received an RFE — is that a denial?",
    answer:
      "No. A Request for Evidence (RFE) is USCIS asking for additional documentation before they decide your case. It is not a denial. Many cases with RFEs are ultimately approved. However, the RFE has a hard response deadline — typically 87 days from the date on the notice. Contact your immigration attorney the same day you receive an RFE.",
  },
  {
    question: "How long does it take to get an I-140 approval notice?",
    answer:
      "I-140 processing times vary by service center and filing type. Regular processing currently ranges from a few months to over a year at some centers. Premium processing (Form I-907) guarantees a 15 business day USCIS action. Check the current estimated times at uscis.gov for your specific service center and form type.",
  },
  {
    question: "I got a biometrics notice — what do I bring?",
    answer:
      "Bring the original biometrics appointment notice (not a photocopy) and a valid government-issued photo ID — your passport is ideal. USCIS staff at the Application Support Center (ASC) will take your fingerprints, photo, and sometimes signature. The appointment typically takes 15–30 minutes. If you cannot attend, reschedule before the appointment date by calling 1-800-375-5283.",
  },
  {
    question: "My I-797 approval notice shows a priority date — is that correct?",
    answer:
      "For I-140 approvals (immigrant petitions), the priority date on the notice is critical — it determines your place in line for an immigrant visa number. Verify this date exactly matches your PERM labor certification filing date (for EB-2 and EB-3). If the date is wrong, contact your attorney immediately — a correction must be filed with USCIS.",
  },
  {
    question: "I got a transfer notice — does my priority date change?",
    answer:
      "No. A transfer notice just means USCIS moved your case from one service center to another due to workload redistribution. Your receipt number stays the same, and your priority date (if applicable) is unchanged. However, your processing time estimate should be reset to the new service center's current published timeline.",
  },
  {
    question: "What is the Online Access Code notice?",
    answer:
      "If you filed a paper application (not online), USCIS mails a one-time online access code that lets you link your case to your myUSCIS dashboard at my.uscis.gov. You need both the access code and your receipt number to complete the link. Access codes expire — use it before the deadline shown on the notice.",
  },
];

export default function UscisNoticeDecoderPage() {
  const url = absoluteUrl("/tools/uscis-notice-decoder");
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
      { name: tool.label, url: "/tools/uscis-notice-decoder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-notice-decoder"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Got a USCIS notice and not sure what it means? Select the notice type for a plain-English explanation, deadline warnings, and what to check."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/myuscis-account"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              myUSCIS account guide →
            </Link>
            <Link
              href="/uscis/i-797-notice"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              I-797 notice types explained
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            No personal data collected. Always verify at{" "}
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov
            </a>{" "}
            and consult a licensed immigration attorney.
          </p>
        }
      >
      {/* Tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <UscisNoticeDecoder />
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
                  href: "/uscis/myuscis-account",
                  label: "myUSCIS Account Guide",
                  desc: "Online account number, access code, adding paper cases, privacy tips",
                },
                {
                  href: "/uscis/i-797-notice",
                  label: "I-797 Notice Types Explained",
                  desc: "I-797A, I-797B, I-797C, I-797D — what each means for H1B and green card",
                },
                {
                  href: "/uscis/rfe-notice",
                  label: "RFE Notice Guide",
                  desc: "What to do when USCIS sends a Request for Evidence — 87-day deadline",
                },
                {
                  href: "/uscis/biometrics-notice",
                  label: "Biometrics Appointment Guide",
                  desc: "What to bring, rescheduling, and what happens at the ASC",
                },
                {
                  href: "/uscis/approval-notice",
                  label: "Approval Notice Guide",
                  desc: "I-140 priority date, H1B I-94, EAD — what to check after approval",
                },
                {
                  href: "/tools/uscis-case-status-meaning",
                  label: "USCIS Case Status Decoder",
                  desc: "Plain-English meaning of every USCIS online status message",
                },
                {
                  href: "/tools/uscis-processing-delay-checker",
                  label: "Processing Delay Checker",
                  desc: "Is your H1B, I-485, or EAD case outside normal processing time?",
                },
                {
                  href: "/uscis",
                  label: "USCIS Hub",
                  desc: "Case status, receipt numbers, H1B, green card, and more",
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
