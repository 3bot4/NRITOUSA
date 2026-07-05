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
  entryVisaDocuments,
  commonMistakes,
  entryFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/entry-visa-india-from-usa";
const TITLE = "Entry Visa India from USA: Guide for Indian-Origin Families, Spouses & Children";
const DESC =
  "Understand when Entry Visa India may be needed for Indian-origin U.S. citizens, non-Indian spouses, minor children and family visits. See documents, fees, timelines and OCI comparison.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "What Is India Entry Visa?", body: "The Entry (X) Visa is a category often used for people of Indian origin, non-Indian spouses of Indian citizens/OCI holders, and minor children — situations focused on family and living with relatives in India rather than tourism or business." },
  { h: "Entry Visa vs Tourist Visa", body: "A tourist visa is for sightseeing and short visits. An Entry Visa suits family-based travel and longer stays with relatives, and is common for Indian-origin families and their non-Indian spouses and children." },
  { h: "Entry Visa vs OCI", body: "OCI is a lifelong multiple-entry facility and usually more convenient for frequent travel if you're eligible, but it takes longer to obtain. An Entry Visa can be faster for a specific trip or when OCI isn't available yet." },
  { h: "Entry Visa for Non-Indian Spouse", body: "A non-Indian spouse of an Indian citizen or OCI holder often uses an Entry Visa, typically requiring the marriage certificate and the spouse's Indian/OCI documents. Some spouses may also qualify for OCI." },
  { h: "Entry Visa for U.S.-Born Children", body: "U.S.-born children of Indian-origin parents usually need their own status — commonly an Entry Visa or OCI, with the child's birth certificate and parents' documents. Apply early, as minor cases can take longer." },
  { h: "Indian Entry Visa Processing Time", body: `Entry Visas can take longer than tourist visas because origin and family documents may need extra review. ${C.timelineDisclaimer}` },
  { h: "Entry Visa India Fees", body: `Fees vary by case and validity. Check the current government fee and any VFS service fee for your category. ${C.feeDisclaimer}` },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    faqJsonLd(entryFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: "/india-visa-from-usa" },
      { name: "Entry Visa India from USA", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="entry-visa-india-from-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Visa from USA", href: "/india-visa-from-usa" },
          { label: "Entry Visa" },
        ]}
        icon="👨‍👩‍👧"
        category="India Travel & Visas"
        title="Entry Visa India from USA: Guide for Indian-Origin Families, Spouses & Children"
        hook="Indian-origin U.S. citizen, non-Indian spouse, or U.S.-born child visiting family in India? See when an Entry Visa fits, its documents, timelines, and how it compares to OCI."
        accent="from-rose-500 to-pink-600"
        headerExtra={
          <a href="#entry-docs" className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700">See Entry Visa documents →</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.feeDisclaimer} {C.timelineDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Who may need an Entry Visa India?"
              answerLabel="Typically"
              answer="Indian-origin families & non-Indian relatives"
              accent="amber"
              rows={[
                { label: "Entry Visa (all-in)", value: "~$176", note: "$120 gov + $19 VFS + $12 photo + $25 courier.", highlight: true },
                { label: "Processing time", value: "2–3 weeks", note: "Origin/family documents reviewed." },
                { label: "Non-Indian spouse / child", value: "Entry Visa or OCI", note: "OCI ~$334 if eligible, 8–12 weeks." },
                { label: "Frequent travel", value: "Consider OCI", note: "Lifelong facility — plan ahead." },
              ]}
              badges={["All-in estimate", "Photo + shipping included", "No approval guaranteed"]}
              lastVerified={INDIA_VISA_UPDATED}
              disclaimer={C.approvalNote}
              ctaText="See Entry Visa documents"
              ctaHref="#entry-docs"
            />
          </Container>
        </section>

        {/* Clarification block */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Clarification: Visa Requirements for Indian Citizens vs U.S. Citizens</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">If you are an <strong>Indian citizen</strong>, this page is not about getting a U.S. visa. This guide is for <strong>U.S.-based travelers applying for a visa to India</strong>. Indian citizens generally do not need an India visa to enter India, but may need visas for other countries.</p>
            </div>
          </Container>
        </section>

        {/* Documents */}
        <section id="entry-docs" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Documents Required for Entry Visa India</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {entryVisaDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-rose-600">✓</span>{d}</li>
                ))}
              </ul>
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
              <p className="text-sm text-ink-600">Deciding between paths? See <Link href="/oci-vs-india-visa" className="text-rose-700 underline">OCI vs India visa</Link> and the <Link href="/oci" className="text-rose-700 underline">OCI card resource center</Link> — for eligible families the OCI card often beats repeated visas. Renewing a passport first? See <Link href="/indian-passport-renewal-usa" className="text-rose-700 underline">Indian passport renewal in the USA</Link>, or start at the <Link href="/india-visa-from-usa" className="text-rose-700 underline">India visa hub</Link>.</p>
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

        <IndiaVisaPageFooter currentPath={PATH} faqs={entryFaqs} />
      </ToolFirstLayout>
    </>
  );
}
