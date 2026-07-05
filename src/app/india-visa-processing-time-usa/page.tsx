import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import IndiaVisaPageFooter from "@/components/tools/IndiaVisaPageFooter";
import IndiaVisaSummaryTables from "@/components/tools/IndiaVisaSummaryTables";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  indiaVisaArticleJsonLd,
  indiaVisaWebPageJsonLd,
} from "@/lib/indiaVisaCluster";
import {
  indiaVisaConfig as C,
  processingCards,
  commonMistakes,
  processingFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-visa-processing-time-usa";
const TITLE = "India Visa Processing Time from USA: eVisa, Regular Visa, VFS & Consulate Timeline";
const DESC =
  "See estimated India visa processing times from USA for eVisa, tourist visa, business visa, entry visa, VFS applications and urgent travel situations.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "India eVisa Processing Time", body: `${C.eVisaProcessingNote}` },
  { h: "Regular India Visa Processing Time", body: `${C.regularVisaProcessingNote}` },
  { h: "Tourist Visa Processing Time", body: "eTourist visas are often approved within a few business days; regular tourist visas follow the minimum-3-working-days rule after receipt and are frequently longer once VFS handling and mailing are included." },
  { h: "Business Visa Processing Time", body: "eBusiness visas are often approved within a few business days; regular business visas require a minimum of 3 working days after receipt and are often longer. Apply early for fixed-date conferences." },
  { h: "Entry Visa Processing Time", body: "Entry Visas can take longer than tourist visas because origin and family documents may need extra review. Keep documentation complete and consistent to avoid back-and-forth." },
  { h: "VFS and Consulate Timeline", body: "For regular visas, VFS intake, consular processing, and return mailing all add to the timeline beyond the stated minimum. Build in a buffer, especially around holidays." },
  { h: "Why India Visa Applications Get Delayed", body: "Common causes include incomplete or inconsistent documents, name mismatches, passport-validity issues, old-Indian-passport/surrender questions, minor-child cases, high consulate workload, and holidays." },
  { h: "When to Apply Before Travel", body: "Apply as early as your dates allow — several weeks ahead when possible, and earlier for Entry Visa, minors, name changes, or OCI. Don't leave it to the last week." },
  { h: "Emergency or Urgent Travel Notes", body: "Genuine emergencies (serious family illness or bereavement) are handled case by case — contact the Indian Consulate or VFS directly. Do not rely on OCI for urgent travel if it isn't already approved." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    faqJsonLd(processingFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: "/india-visa-from-usa" },
      { name: "India Visa Processing Time from USA", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="india-visa-processing-time-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Visa from USA", href: "/india-visa-from-usa" },
          { label: "Processing Time" },
        ]}
        icon="⏱️"
        category="India Travel & Visas"
        title="India Visa Processing Time from USA: eVisa, Regular Visa, VFS & Consulate Timeline"
        hook="How long does an India visa take from the USA? See estimated timelines for eVisa, tourist, business, and Entry visas, why applications get delayed, and when to apply."
        accent="from-sky-600 to-blue-600"
        headerExtra={
          <a href="#timelines" className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700">See detailed timelines →</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.timelineDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="How long does an India visa take from USA?"
              answerLabel="eVisa (typical)"
              answer="Often a few business days"
              accent="sky"
              rows={processingCards.map((p, i) => ({
                label: p.label,
                value: p.estimate,
                note: p.note,
                highlight: i === 0,
              }))}
              badges={["Estimates only", "Apply early", "No approval guaranteed"]}
              lastVerified={INDIA_VISA_UPDATED}
              disclaimer={C.timelineDisclaimer}
              ctaText="See detailed timelines"
              ctaHref="#timelines"
            />
          </Container>
        </section>

        {/* Timeline cards */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">India visa timeline at a glance</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {processingCards.map((p) => (
                  <div key={p.label} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{p.label}</p>
                    <p className="mt-1 text-sm font-semibold text-sky-700">{p.estimate}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{p.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <p className="text-sm text-amber-800"><strong>Don't wait until the last week</strong> if you have passport issues, a name mismatch, old Indian passport / surrender questions, a minor child application, or family/emergency travel.</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Total time + cost by category */}
        <section className="py-10 sm:py-12">
          <Container>
            <h2 className="mx-auto max-w-4xl text-xl font-bold text-ink-900">Total India visa time &amp; cost by category</h2>
            <p className="mx-auto mt-1.5 max-w-4xl text-sm leading-relaxed text-ink-600">Estimated processing time and all-in cost for each India visa and OCI category.</p>
            <div className="mt-4">
              <IndiaVisaSummaryTables accent="sky" />
            </div>
          </Container>
        </section>

        {/* Sections */}
        <section id="timelines" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              {SECTIONS.map((s) => (
                <div key={s.h}>
                  <h2 className="text-lg font-bold text-ink-900">{s.h}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.body}</p>
                </div>
              ))}
              <p className="text-sm text-ink-600">Planning cost too? See <Link href="/india-visa-fees-usa" className="text-sky-700 underline">India visa fees</Link>, or start at the <Link href="/india-visa-from-usa" className="text-sky-700 underline">India visa hub</Link>.</p>
            </div>
          </Container>
        </section>

        {/* Common mistakes */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Delays to avoid</h2>
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

        <IndiaVisaPageFooter currentPath={PATH} faqs={processingFaqs} />
      </ToolFirstLayout>
    </>
  );
}
