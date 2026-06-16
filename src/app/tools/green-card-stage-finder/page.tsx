import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolHero from "@/components/tools/ToolHero";
import ToolFaq from "@/components/tools/ToolFaq";
import ToolDisclaimer from "@/components/tools/ToolDisclaimer";
import GreenCardStageFinder from "@/components/tools/GreenCardStageFinder";
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

const tool = getTool("green-card-stage-finder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/green-card-stage-finder",
});

const faq: FaqItem[] = [
  {
    question: "What information do I need to use this tool?",
    answer:
      "Your current visa/status, EB green card category (EB-1/EB-2/EB-3), country of birth, whether PERM has been filed and approved, whether I-140 has been filed and approved, whether I-485 has been filed, whether you have EAD/Advance Parole, and optionally your priority date (month and year only). No receipt numbers, A-numbers, passport numbers, or dates of birth are collected.",
  },
  {
    question: "What is a priority date and why does it matter?",
    answer:
      "Your priority date is the date your PERM labor certification was filed with the Department of Labor (for EB-2/EB-3), or the date your I-140 was filed (for EB-1). It determines your place in the green card queue. For Indian-born applicants in EB-2 and EB-3, the wait is often measured in years or decades because the per-country 7% cap limits how many visas India can use per year.",
  },
  {
    question: "Why do you say to check the official visa bulletin and not show real-time data?",
    answer:
      "The State Department updates the visa bulletin monthly and the cutoff dates can move forward or backward (retrogress). A static website cannot reliably show live cutoff dates — showing outdated data could cause someone to file I-485 prematurely or miss a filing window. Always check the current bulletin at travel.state.gov for the authoritative Final Action Date and Dates for Filing for your EB category and country.",
  },
  {
    question: "Can I file I-485 before my priority date is current?",
    answer:
      "You can file I-485 if either the Final Action Date (Part A of the visa bulletin) is current for your category, OR if USCIS has authorized use of the Dates for Filing (Part B) chart. USCIS announces in its monthly Visa Bulletin Acceptance memo whether Part B can be used that month. Filing under Part B does not mean your green card will be approved — it means USCIS will accept the application and process it until your Final Action Date becomes current.",
  },
  {
    question: "What happens to my I-485 if my priority date retrogresses after filing?",
    answer:
      "If your priority date retrogresses (moves backward in the visa bulletin) after I-485 filing, your case is put on hold — but it is not denied. Your EAD and Advance Parole remain renewable while I-485 is pending. You do not need to refile. When your priority date becomes current again, USCIS will resume adjudication.",
  },
  {
    question: "I have an approved I-140 — can I change employers?",
    answer:
      "Yes, under the AC21 portability rule (INA 204(j)), if your I-485 has been pending for 180 or more days, you may change to a same-or-similar job without affecting your green card case. If I-485 has not been filed yet, your approved I-140 remains valid and the priority date is preserved — but you will need a new employer to file a new PERM and I-140 to continue the process. Consult your immigration attorney before any job change.",
  },
  {
    question: "My child is approaching age 21 — do they age out of my green card case?",
    answer:
      "Potentially. The Child Status Protection Act (CSPA) may protect your child by subtracting the time the I-140 was pending from their age. However, for Indian applicants with long backlogs, CSPA may not provide enough protection. Your child must also take affirmative action to seek the visa within one year of visa availability. Discuss CSPA with your immigration attorney now — do not wait until your child is close to 21.",
  },
  {
    question: "What is the difference between EB-2 and EB-3 for Indian applicants?",
    answer:
      "EB-2 requires an advanced degree (master's or higher, or bachelor's plus 5 years of progressive experience). EB-3 requires a bachelor's degree or at least 2 years of experience. For Indian-born applicants, both EB-2 and EB-3 have significant backlogs, but the relative cutoff dates fluctuate monthly. Some applicants file for both categories simultaneously or file an EB-3 downgrade from EB-2. The right strategy depends on your priority date and current visa bulletin movement.",
  },
];

export default function GreenCardStageFinderPage() {
  const url = absoluteUrl("/tools/green-card-stage-finder");
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
      { name: tool.label, url: "/tools/green-card-stage-finder" },
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
          <Link href="/green-card"
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
            Full green card guide →
          </Link>
          <Link href="/green-card/priority-date"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/20">
            Priority date explained
          </Link>
        </div>
      </ToolHero>

      {/* disclaimer strip */}
      <section className="border-b border-ink-900/5 bg-amber-50/40">
        <Container className="py-3">
          <p className="text-center text-xs text-ink-600">
            <strong className="font-semibold text-ink-800">Not legal advice.</strong> This tool gives an educational stage assessment only. Priority date availability depends on the current official visa bulletin — check{" "}
            <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="underline">travel.state.gov</a>{" "}
            and confirm your situation with your immigration attorney.
          </p>
        </Container>
      </section>

      {/* tool */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <GreenCardStageFinder />
          </div>
        </Container>
      </section>

      {/* related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">Related green card guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/green-card", label: "Green Card Guide Hub", desc: "Complete green card process for Indian workers" },
                { href: "/green-card/perm", label: "PERM Labor Certification", desc: "DOL process, timeline, audit risk, priority date" },
                { href: "/green-card/priority-date", label: "Priority Date Explained", desc: "Visa bulletin, Final Action Date, Part A vs Part B" },
                { href: "/green-card/green-card-backlog-india", label: "India Green Card Backlog", desc: "Per-country cap, wait times, planning strategies" },
                { href: "/green-card/i-485", label: "I-485 Adjustment of Status", desc: "Filing package, biometrics, interview, travel rules" },
                { href: "/green-card/ac21", label: "AC21 Portability", desc: "Changing jobs after I-140 or while I-485 is pending" },
              ].map((g) => (
                <Link key={g.href} href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-green-500 hover:shadow-sm">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-green-700">{g.label}</p>
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
