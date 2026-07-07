import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import IndiaVisaDecisionGuide from "@/components/tools/IndiaVisaDecisionGuide";
import IndiaVisaSummaryTables from "@/components/tools/IndiaVisaSummaryTables";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  indiaVisaArticleJsonLd,
  indiaVisaWebPageJsonLd,
  otherIndiaVisaLinks,
} from "@/lib/indiaVisaCluster";
import {
  indiaVisaConfig as C,
  indiaVisaSourceLinks,
  indiaVisaRelatedLinks,
  visaComparisonRows,
  hubPickCards,
  commonSearches,
  commonMistakes,
  eVisaDocuments,
  hubFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-visa-from-usa";
const TITLE = "India Visa from the USA: Types, Fees & Timelines";
const DESC =
  "Compare India eVisa, tourist, business, entry and medical visas plus OCI for U.S. citizens and NRI families: fees, timelines, documents and how to apply.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "Do U.S. Citizens Need a Visa to Visit India?",
    body: "Yes. U.S. citizens generally need a visa to enter India. Most short trips for tourism, short business, conferences, or medical treatment can use an India eVisa if you're eligible. Some cases — longer stays, certain family situations, study, or work — need a regular paper visa or an Entry Visa. Indian-origin U.S. citizens may prefer OCI instead of a visa.",
  },
  {
    h: "Understanding the Different Types of India Visas",
    body: "The main options are the eVisa (e-Tourist, e-Business, e-Medical) applied for online; regular tourist and business visas processed through VFS or the consulate; the Entry (X) Visa often used by Indian-origin families and non-Indian spouses; student and employment visas for study or work; and OCI, a lifelong facility for people of Indian origin that isn't technically a visa. Pick by purpose, stay length, entries needed, and your family background.",
  },
  {
    h: "Which India Visa Do I Need?",
    body: "Short sightseeing or a wedding? An e-Tourist Visa usually fits. Meetings or a conference? An e-Business or regular Business Visa. Treatment at a recognized hospital? An e-Medical Visa. Indian-origin and traveling often? OCI is usually more convenient. Non-Indian spouse or U.S.-born child visiting family? An Entry Visa (or OCI, if eligible). Use the guide below to narrow it down, then confirm with VFS/consulate.",
  },
  {
    h: "Documents Required for India Visa from USA",
    body: "For most applications you'll need a passport valid at least 6 months with blank pages, a compliant passport-style photo, a completed application, and purpose-of-travel documents (itinerary, invitation letter, or hospital letter). Business, medical, Entry, and student visas add category-specific documents. See the eVisa checklist below and each supporting page for details.",
  },
  {
    h: "Is There a Visa on Arrival for U.S. Citizens in India?",
    body: (
      <>
        <span className="block">U.S. citizens generally cannot just land in India and get a tourist visa at an airport counter without applying in advance. For most eligible U.S. travelers, the closest practical option is the India eVisa, which must be completed online before travel. If you are not eligible for an eVisa, you may need a regular visa through VFS Global or the appropriate Indian Consulate.</span>
        <span className="mt-3 block">The phrase &lsquo;visa on arrival for Indians&rsquo; is often searched with mixed intent. Indian citizens do not need an India visa to enter India, but they may need visas for other countries. This guide is focused on U.S.-based travelers applying for permission to enter India.</span>
      </>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    faqJsonLd(hubFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="india-visa-from-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "India Visa from USA" },
        ]}
        icon="🇮🇳"
        category="India Travel & Visas"
        title="India Visa from USA: Which Visa Do You Need, How Long It Takes & What It Costs"
        hook="U.S. citizen, Indian-origin family, non-Indian spouse, or U.S.-born child? See which India visa or OCI fits your trip — with estimated fees, timelines, documents, and how to apply."
        accent="from-orange-500 to-rose-600"
        headerExtra={
          <a href="#which-india-visa" className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700">Find My Visa Type →</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. Fees, costs, and processing times are estimates for planning only and can change.</>}
        disclaimerExtra={<p>{C.approvalNote}</p>}
      >
        {/* Fast answer */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Which India visa do U.S. citizens need?"
              answerLabel="Most short trips"
              answer="India eVisa (if eligible)"
              accent="amber"
              rows={[
                { label: "Short tourism / family visit", value: "e-Tourist Visa", note: "~$54 all-in · 3–5 business days.", highlight: true },
                { label: "Business / conference", value: "e-Business Visa", note: "~$95 all-in · 3–5 business days." },
                { label: "Indian-origin, frequent travel", value: "OCI", note: "~$334 all-in · 8–12 weeks." },
                { label: "Non-Indian spouse / U.S.-born child", value: "Entry Visa", note: "~$176 all-in · 2–3 weeks." },
              ]}
              badges={["All-in estimates", "Photo + shipping included", "No approval guaranteed"]}
              lastVerified={INDIA_VISA_UPDATED}
              disclaimer={C.approvalNote}
              ctaText="Find my India visa type"
              ctaHref="#which-india-visa"
            />
          </Container>
        </section>

        {/* Quick pick cards */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">Quick pick: the best India visa for your trip</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {hubPickCards.map((c) => (
                  <Link key={c.title} href={c.href} className="group rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-orange-400">
                    <span className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-orange-700">{c.badge}</span>
                    <p className="mt-2 text-sm font-bold text-ink-900 group-hover:text-orange-700">{c.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{c.body}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Master comparison table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-xl font-bold text-ink-900">India Visa & OCI Comparison</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">A quick scan of visa/status types, who each suits, and estimated all-in cost and time. Figures are estimates for planning and can change.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {visaComparisonRows.map((r) => (
                  <div key={r.type} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.type}</p>
                    <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Best for:</span> {r.bestFor}</p>
                    <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Time:</span> {r.processing}</p>
                    <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Fee:</span> {r.fee}</p>
                    <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Where:</span> {r.where}</p>
                    <p className="mt-1 text-xs text-ink-500">{r.notes}</p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Visa / Status</th>
                      <th className="p-3 font-semibold">Best for</th>
                      <th className="p-3 font-semibold">Est. processing</th>
                      <th className="p-3 font-semibold">Est. gov fee</th>
                      <th className="p-3 font-semibold">Where to apply</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {visaComparisonRows.map((r) => (
                      <tr key={r.type} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.type}</td>
                        <td className="p-3 text-ink-600">{r.bestFor}</td>
                        <td className="p-3 text-ink-600">{r.processing}</td>
                        <td className="p-3 font-medium text-orange-700">{r.fee}</td>
                        <td className="p-3 text-ink-600">{r.where}</td>
                        <td className="p-3 text-ink-500">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Decision guide tool */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <IndiaVisaDecisionGuide />
            </div>
          </Container>
        </section>

        {/* Total cost + total time summary tables */}
        <section className="py-10 sm:py-12">
          <Container>
            <h2 className="mx-auto max-w-4xl text-xl font-bold text-ink-900">India Visa Total Cost &amp; Time by Category</h2>
            <p className="mx-auto mt-1.5 max-w-4xl text-sm leading-relaxed text-ink-600">Estimated all-in cost (government fee + service + photo + shipping) and processing time for each India visa and OCI category.</p>
            <div className="mt-4">
              <IndiaVisaSummaryTables accent="orange" disclaimer="Estimated costs and processing times are for planning only. Always verify current fees, timelines, and requirements with the official Indian visa portal, VFS Global, or the relevant Indian Consulate before applying." />
            </div>
            <div className="mx-auto mt-5 max-w-4xl">
              <Link href="/india-visa-fees-usa" className="text-sm font-semibold text-orange-700 hover:underline">See the full fee breakdown →</Link>
              <span className="px-2 text-ink-300">·</span>
              <Link href="/india-visa-processing-time-usa" className="text-sm font-semibold text-orange-700 hover:underline">See detailed timelines →</Link>
            </div>
          </Container>
        </section>

        {/* How to apply */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How to Apply for India Visa from USA</h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <li><strong className="text-ink-900">1. Confirm your category.</strong> Tourism, business, medical, family visit, study, work — or OCI if you're Indian-origin. Use the guide above.</li>
                <li><strong className="text-ink-900">2. Check eligibility & passport validity.</strong> India generally expects 6+ months of validity and blank pages. Renew first if you're close.</li>
                <li><strong className="text-ink-900">3. Apply on the right channel.</strong> The eVisa is applied for online; regular, Entry, student, employment visas and OCI go through VFS Global USA or the consulate. Official links are at the bottom of this page.</li>
                <li><strong className="text-ink-900">4. Upload documents & pay.</strong> Follow the exact photo/scan specs. Keep purpose-of-travel documents ready.</li>
                <li><strong className="text-ink-900">5. Track and travel.</strong> Check status, avoid non-refundable bookings until approved, and carry the printed authorization where required.</li>
              </ol>
            </div>
          </Container>
        </section>

        {/* Documents checklist */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Common documents (eVisa)</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {eVisaDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-orange-600">✓</span>{d}</li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Detailed sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              {SECTIONS.map((s) => (
                <div key={s.h}>
                  <h2 className="text-lg font-bold text-ink-900">{s.h}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.body}</p>
                </div>
              ))}
              <div>
                <h2 className="text-lg font-bold text-ink-900">India Visa vs OCI: Which Is Better for Indian-Origin U.S. Citizens?</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">If you're eligible and travel to India often, the <Link href="/oci" className="text-orange-700 underline">OCI card</Link> is usually more convenient long-term because it's a lifelong multiple-entry facility. A visa (often an eVisa) can be better for a single short trip or urgent travel, since OCI takes longer to obtain. See the full <Link href="/oci-vs-india-visa" className="text-orange-700 underline">OCI vs India visa comparison</Link>. Before any application, make sure your passport is current — see <Link href="/indian-passport-renewal-usa" className="text-orange-700 underline">Indian passport renewal in the USA</Link>.</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Common mistakes */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Common Mistakes That Delay India Visa Applications</h2>
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

        {/* Frequently searched India visa questions (glossary) */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Frequently Searched India Visa Questions</h2>
              <div className="mt-4 space-y-3">
                {commonSearches.map((s) => (
                  <div key={s.term} className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <h3 className="text-sm font-bold text-ink-900">
                      {s.href ? (
                        <Link href={s.href} className="text-orange-700 hover:underline">{s.term}</Link>
                      ) : (
                        s.term
                      )}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox
              title="Where to apply for your India visa"
              intro="When you're ready, apply and check status on the official portals — the eVisa portal for eVisas, VFS Global for regular visas & OCI:"
              links={indiaVisaSourceLinks}
            />
          </Container>
        </section>

        {/* Related pages */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="India visa guides in this cluster" links={otherIndiaVisaLinks(PATH)} />
            <div className="mt-8">
              <PermClusterLinks title="Related NRI & travel guides" links={indiaVisaRelatedLinks} />
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={hubFaqs} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={INDIA_VISA_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
