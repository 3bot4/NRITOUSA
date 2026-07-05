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
  businessDocuments,
  commonMistakes,
  businessFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-business-visa-from-usa";
const TITLE = "India Business Visa from USA: Documents, Invitation Letter, Fees & Processing Time";
const DESC =
  "Learn how India business visa from USA works, including eBusiness vs regular business visa, invitation letter, company proof, estimated fees, documents and processing time.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const USE_CASES = ["Business meetings", "Conferences & seminars", "Trade shows & expos", "Company / office visits", "Vendor & client visits", "Business exploration"];

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "Who Needs India Business Visa?", body: "Travelers going to India for permitted business activities — meetings, conferences, trade shows, company visits, or business exploration. A business visa is not for employment; working for an Indian organization requires an Employment Visa." },
  { h: "India eBusiness Visa vs Regular Business Visa", body: "For short, eligible business trips, the e-Business Visa is usually simplest and applied online. Longer, repeat, or broader-scope business travel may call for a regular business visa through VFS/consulate, which typically asks for more documentation." },
  { h: "Invitation Letter Requirements", body: "Most business visas need an invitation letter from the Indian company or host stating who you are, the purpose, the duration, and the business relationship. The details should match your application exactly." },
  { h: "Business Card and Company Proof", body: "You may be asked for a business card and proof of your company (or the Indian host's business) — for example, incorporation or registration documents. Provide what the application requests to avoid delays." },
  { h: "India Business Visa Fees", body: `A regular business visa for U.S. nationals valid up to 10 years is commonly around a $160 government fee, plus a possible VFS service fee. eBusiness fees vary. ${C.feeDisclaimer}` },
  { h: "India Business Visa Processing Time", body: `eBusiness visas are often approved within a few business days; regular business visas require a minimum of 3 working days after receipt and are often longer. ${C.timelineDisclaimer} Apply early for fixed-date conferences.` },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    faqJsonLd(businessFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: "/india-visa-from-usa" },
      { name: "India Business Visa from USA", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="india-business-visa-from-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Visa from USA", href: "/india-visa-from-usa" },
          { label: "Business Visa" },
        ]}
        icon="💼"
        category="India Travel & Visas"
        title="India Business Visa from USA: Documents, Invitation Letter, Fees & Processing Time"
        hook="Meetings, a conference, or a company visit in India? See whether the e-Business Visa or a regular business visa fits — plus invitation-letter and company-proof requirements."
        accent="from-indigo-500 to-violet-600"
        headerExtra={
          <a href="#business-docs" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700">See business visa documents →</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.feeDisclaimer} {C.timelineDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="eBusiness Visa or regular business visa?"
              answerLabel="Most short business trips"
              answer="e-Business Visa (if eligible)"
              accent="brand"
              rows={[
                { label: "e-Business Visa (all-in)", value: "~$95", note: "3–5 business days, applied online.", highlight: true },
                { label: "Regular Business Visa (all-in)", value: "~$216", note: "5–10 business days, via VFS." },
                { label: "Invitation letter", value: "Required", note: "From the Indian company / host." },
                { label: "Includes", value: "Photo + courier", note: "$12 photo, $25 courier (regular)." },
              ]}
              badges={["Not for employment", "All-in estimates", "No approval guaranteed"]}
              lastVerified={INDIA_VISA_UPDATED}
              disclaimer={C.approvalNote}
              ctaText="See business visa documents"
              ctaHref="#business-docs"
            />
          </Container>
        </section>

        {/* Use cases */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Typical business-visa purposes</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {USE_CASES.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-indigo-600">✓</span>{u}</li>
                ))}
              </ul>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800"><strong>Note:</strong> A business visa does not permit employment in India. This page is a practical checklist, not legal advice.</p>
            </div>
          </Container>
        </section>

        {/* Documents */}
        <section id="business-docs" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Documents Required for India Business Visa</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {businessDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-indigo-600">✓</span>{d}</li>
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
              <p className="text-sm text-ink-600">Compare all options on the <Link href="/india-visa-from-usa" className="text-indigo-700 underline">India visa hub</Link>, or check <Link href="/india-visa-processing-time-usa" className="text-indigo-700 underline">processing times</Link> before a fixed-date event.</p>
            </div>
          </Container>
        </section>

        {/* Common mistakes */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Common Business Visa Mistakes</h2>
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

        <IndiaVisaPageFooter currentPath={PATH} faqs={businessFaqs} />
      </ToolFirstLayout>
    </>
  );
}
