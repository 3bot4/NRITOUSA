import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import IndiaVisaPageFooter from "@/components/tools/IndiaVisaPageFooter";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  indiaVisaArticleJsonLd,
  indiaVisaWebPageJsonLd,
} from "@/lib/indiaVisaCluster";
import {
  indiaVisaConfig as C,
  indiaVisaSources as SRC,
  commonMistakes,
  ociFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/oci-vs-india-visa";
const TITLE = "OCI vs India Visa: Which Is Better for Indian-Origin U.S. Citizens?";
const DESC =
  "Compare OCI, India eVisa, Entry Visa and regular India visa for Indian-origin U.S. citizens, spouses and children. See best use cases, timelines, documents and limitations.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const COMPARE = [
  { row: "What it is", oci: "Lifelong multiple-entry facility (not a visa)", visa: "Time-limited permit for a specific purpose" },
  { row: "Best for", oci: "Indian-origin, frequent / long-term travel", visa: "Single or short trips, urgent travel" },
  { row: "Processing time", oci: "8–12 weeks", visa: "eVisa 3–5 days; regular 5–10 days" },
  { row: "Cost (all-in)", oci: "~$334 one-time", visa: "~$54 eVisa / ~$216 regular per trip" },
  { row: "Entries", oci: "Multiple, lifelong", visa: "eVisa & 10-yr visa are multiple entry" },
  { row: "Urgent travel", oci: "Not a solution if not held", visa: "eVisa is the faster route (3–5 days)" },
];

const WHO = [
  { who: "Indian-origin U.S. citizen", pick: "OCI is usually better for frequent travel; use an eVisa for a single upcoming trip.", href: "/india-evisa-for-us-citizens" },
  { who: "Non-Indian spouse", pick: "Entry Visa for a quick trip; OCI if eligible and you travel often.", href: "/entry-visa-india-from-usa" },
  { who: "U.S.-born child (Indian origin)", pick: "Entry Visa for a single trip; OCI for long-term convenience. Apply early.", href: "/entry-visa-india-from-usa" },
];

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "What Is OCI?", body: "OCI (Overseas Citizen of India) is a lifelong facility for eligible people of Indian origin that allows multiple-entry travel to India and long-term residence benefits. It is issued by the Government of India through VFS in the USA." },
  { h: "Is OCI a Visa?", body: "No. OCI is not a visa and not Indian citizenship. It removes the need for a visa for most travel to India once you hold it, but it does not grant voting rights, certain offices, or the right to buy certain agricultural property." },
  { h: "OCI vs India eVisa", body: "An eVisa is a short-term permit with limited validity and entries; OCI is a lifelong multiple-entry facility. For a one-off short trip the eVisa is faster; for frequent travel OCI is more convenient if you're eligible." },
  { h: "OCI vs Entry Visa", body: "An Entry Visa is issued for a specific period and purpose (often family-based), while OCI is permanent. Non-Indian spouses and children sometimes use an Entry Visa first, then pursue OCI later if eligible." },
  { h: "OCI vs Regular Tourist Visa", body: "A regular tourist visa suits a defined trip; OCI suits repeat, long-term travel. If you'll visit India regularly and qualify, OCI usually saves repeated applications." },
  { h: "Timeline Comparison", body: "OCI generally takes longer than a visa. If you must travel soon and don't already hold OCI, apply for a visa (often an eVisa) and consider OCI for the future." },
  { h: "Fee/Cost Comparison", body: `OCI has a government fee plus a separate VFS service fee and is a one-time facility, while a visa fee is per application. ${C.feeDisclaimer}` },
  { h: "Documents Comparison", body: "OCI applications require proof of Indian origin and supporting documents (and, for former citizens, surrender/renunciation records). Visas require passport, photo, application, and purpose-of-travel documents." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    faqJsonLd(ociFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: "/india-visa-from-usa" },
      { name: "OCI vs India Visa", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="oci-vs-india-visa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Visa from USA", href: "/india-visa-from-usa" },
          { label: "OCI vs Visa" },
        ]}
        icon="🪪"
        category="India Travel & Visas"
        title="OCI vs India Visa: Which Is Better for Indian-Origin U.S. Citizens?"
        hook="OCI or a visa? See how OCI compares to the eVisa, Entry Visa, and regular tourist visa for Indian-origin U.S. citizens, non-Indian spouses, and U.S.-born children."
        accent="from-amber-500 to-orange-600"
        headerExtra={
          <a href={SRC.ociVfs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-700">Apply for OCI (VFS) ↗</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.feeDisclaimer} {C.timelineDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="OCI or India visa — which is better?"
              answerLabel="Frequent, long-term travel"
              answer="OCI (if eligible)"
              accent="amber"
              rows={[
                { label: "Indian-origin, frequent travel", value: "OCI", note: "Lifelong facility — plan ahead.", highlight: true },
                { label: "Single / short trip", value: "eVisa or visa", note: "Faster than OCI." },
                { label: "Urgent travel (no OCI yet)", value: "Visa (eVisa)", note: "OCI is not an urgent-travel fix." },
                { label: "OCI is citizenship?", value: "No", note: "Not a visa and not citizenship." },
              ]}
              badges={["OCI ~$334, 8–12 weeks", "eVisa ~$54, 3–5 days", "All-in estimates"]}
              lastVerified={INDIA_VISA_UPDATED}
              sources={[
                { label: "OCI services (Govt of India)", href: SRC.ociServices },
                { label: "OCI via VFS", href: SRC.ociVfs },
              ]}
              disclaimer={C.approvalNote}
              ctaText="See the OCI vs visa table"
              ctaHref="#oci-table"
            />
          </Container>
        </section>

        {/* Comparison table */}
        <section id="oci-table" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">OCI vs India Visa: side by side</h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold"> </th>
                      <th className="p-3 font-semibold">OCI</th>
                      <th className="p-3 font-semibold">India Visa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {COMPARE.map((r) => (
                      <tr key={r.row} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.row}</td>
                        <td className="p-3 text-ink-600">{r.oci}</td>
                        <td className="p-3 text-ink-600">{r.visa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Who should pick what */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Which Is Better — By Who You Are</h2>
              <div className="mt-4 space-y-3">
                {WHO.map((w) => (
                  <Link key={w.who} href={w.href} className="block rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-amber-400">
                    <p className="text-sm font-bold text-ink-900">{w.who}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{w.pick}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              {SECTIONS.map((s) => (
                <div key={s.h}>
                  <h2 className="text-lg font-bold text-ink-900">{s.h}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.body}</p>
                </div>
              ))}
              <p className="text-sm text-ink-600">Ready to dig into OCI itself? Visit the <Link href="/oci" className="text-amber-700 underline">OCI Resource Center</Link>. Need a visa now? See the <Link href="/india-visa-from-usa" className="text-amber-700 underline">India visa hub</Link>.</p>
            </div>
          </Container>
        </section>

        {/* Common mistakes */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Common Mistakes</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {commonMistakes.map((m) => (
                  <div key={m.title} className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <p className="text-sm font-bold text-ink-900">{m.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{m.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <IndiaVisaPageFooter currentPath={PATH} faqs={ociFaqs} />
      </ToolFirstLayout>
    </>
  );
}
