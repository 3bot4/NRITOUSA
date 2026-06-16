import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import UscisFormFinder from "@/components/tools/UscisFormFinder";
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

const tool = getTool("uscis-form-finder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-form-finder",
});

const faq: FaqItem[] = [
  {
    question: "What is the difference between I-129 and I-140?",
    answer:
      "I-129 is the nonimmigrant work petition — your employer files it for your H-1B or L-1 work visa. I-140 is the immigrant petition — your employer files it to start your employment-based green card process. I-129 keeps you in nonimmigrant status; I-140 begins the path to permanent residence.",
  },
  {
    question: "Which form does my H-4 spouse need to work?",
    answer:
      "Your H-4 spouse needs Form I-765 (EAD) to get work authorization. To qualify for H-4 EAD, your I-140 must be approved (priority date does not need to be current). She also files I-539 to extend her H-4 status alongside your I-129 renewal. These are separate forms with separate processing timelines.",
  },
  {
    question: "Do I need to file any form when I change jobs on H-1B?",
    answer:
      "Not personally — your new employer files a new I-129 H-1B transfer petition. Under AC21 portability, you can start the new job as soon as the new I-129 is filed with USCIS (not when approved) if you have been in H-1B status for at least one year and the new job is in the same or similar specialty occupation.",
  },
  {
    question: "What forms do I file when my priority date becomes current?",
    answer:
      "When your India EB priority date becomes current in the State Department visa bulletin, you file: I-485 (adjustment of status), I-765 (EAD), and I-131 (Advance Parole) — all at the same time. USCIS usually issues a combo EAD+AP card before adjudicating the I-485 itself.",
  },
  {
    question: "I changed my home address — do I need to file anything?",
    answer:
      "Yes. Federal law requires all non-citizens to file AR-11 (Alien's Change of Address) within 10 days of moving. File it free online at my.uscis.gov. USCIS mails all critical notices — RFEs, interview notices, approvals — to the address on file. Missing a notice because you didn't file AR-11 can have serious consequences.",
  },
  {
    question: "Is premium processing (I-907) worth it?",
    answer:
      "It depends on timing and urgency. At $2,805, premium processing is worth it when: your H-1B is expiring and a new approval is time-sensitive, an employer needs an approved I-140 before your 6-year H-1B cap expires, or your offer letter timing depends on an approved petition. It guarantees 15 business day USCIS action — not approval. It is not available for I-485, I-131, or I-539.",
  },
];

export default function UscisFormFinderPage() {
  const url = absoluteUrl("/tools/uscis-form-finder");
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
      { name: tool.label, url: "/tools/uscis-form-finder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolHero tool={tool}>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/uscis/forms"
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            USCIS Forms explained →
          </Link>
          <Link
            href="/tools/uscis-notice-decoder"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20"
          >
            Decode a USCIS notice
          </Link>
        </div>
      </ToolHero>

      {/* Disclaimer strip */}
      <section className="border-b border-ink-900/5 bg-amber-50/40">
        <Container className="py-3">
          <p className="text-center text-xs text-ink-600">
            <strong className="font-semibold text-ink-800">Educational only — not legal advice.</strong>{" "}
            No personal data collected. Verify at{" "}
            <a
              href="https://www.uscis.gov/forms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov/forms
            </a>{" "}
            and consult a licensed immigration attorney.
          </p>
        </Container>
      </section>

      {/* Tool */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <UscisFormFinder />
          </div>
        </Container>
      </section>

      {/* Related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">
              USCIS form guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/uscis/forms/i-129", label: "I-129 Work Visa Petition", desc: "H-1B, L-1, O-1 — your employer files it" },
                { href: "/uscis/forms/i-140", label: "I-140 Green Card Petition", desc: "Sets your priority date — the most important date in the EB queue" },
                { href: "/uscis/forms/i-485", label: "I-485 Adjustment of Status", desc: "Green card application when priority date is current" },
                { href: "/uscis/forms/i-765", label: "I-765 EAD Work Permit", desc: "H-4 EAD, I-485 EAD, OPT, and other work authorization" },
                { href: "/uscis/forms/i-131", label: "I-131 Advance Parole", desc: "Travel document — required while I-485 is pending" },
                { href: "/uscis/forms/i-539", label: "I-539 Extend/Change Status", desc: "H-4 extension, B-2 extension, status changes" },
                { href: "/uscis/forms/i-907-premium-processing", label: "I-907 Premium Processing", desc: "15 business day USCIS action for eligible petitions" },
                { href: "/uscis/forms/ar-11-change-address", label: "AR-11 Change of Address", desc: "Required within 10 days of any move" },
                { href: "/uscis/forms/n-400", label: "N-400 Naturalization", desc: "US citizenship application after 5 years as PR" },
                { href: "/uscis/forms", label: "All USCIS Forms Guide", desc: "Full guide to every form for Indians in the USA" },
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
          <div className="mx-auto mt-10 max-w-3xl">
            <ToolDisclaimer />
          </div>
        </Container>
      </section>
    </>
  );
}
