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
  indiaVisaItemListJsonLd,
} from "@/lib/indiaVisaCluster";
import {
  indiaVisaConfig as C,
  indiaVisaSources as SRC,
  eVisaDocuments,
  commonMistakes,
  eVisaFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-evisa-for-us-citizens";
const TITLE = "India eVisa for U.S. Citizens: Eligibility, Fees, Processing Time & Documents";
const DESC =
  "Learn who can apply for India eVisa from the USA, including eTourist, eBusiness and eMedical visa options. See estimated processing time, documents, fees and mistakes to avoid.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const STEPS = [
  { name: "Go to the official portal", description: "Start only at Indianvisaonline.gov.in — avoid look-alike third-party sites." },
  { name: "Choose the eVisa type", description: "Select e-Tourist, e-Business, or e-Medical based on your purpose." },
  { name: "Fill the application", description: "Enter passport and travel details exactly as they appear on your documents." },
  { name: "Upload photo & passport scan", description: "Follow the exact photo and bio-page scan specifications." },
  { name: "Pay the fee & submit", description: "Pay online, then save the application ID to track status." },
  { name: "Get the eVisa & print it", description: "Carry the printed authorization and enter through a designated port." },
];

const TYPE_CARDS = [
  { title: "India e-Tourist Visa", body: "Sightseeing, family visits, short leisure trips for eligible U.S. citizens." },
  { title: "India e-Business Visa", body: "Meetings, conferences, trade shows, and other permitted business activities." },
  { title: "India e-Medical Visa", body: "Treatment at recognized hospitals, with e-Medical Attendant options for companions." },
];

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "What Is India eVisa?", body: "The eVisa is an electronically-issued travel authorization applied for online at the official portal — no consulate visit needed. It covers e-Tourist, e-Business, and e-Medical categories for eligible nationalities, including U.S. citizens in most cases." },
  { h: "India eVisa Processing Time", body: `${C.eVisaProcessingNote} Plan a buffer around holidays, and never book non-refundable travel before you're authorized.` },
  { h: "India eVisa Fees", body: `${C.eVisaFeeEstimate} There are no VFS or courier costs because the eVisa is applied for online. ${C.feeDisclaimer}` },
  { h: "eVisa vs Regular India Visa", body: "For eligible short trips the eVisa is usually faster and simpler. A regular visa (via VFS/consulate) can be better for longer stays, more entries, or cases not eligible for the eVisa." },
  { h: "eVisa vs OCI", body: "An eVisa is a short-term permit; OCI is a lifelong multiple-entry facility for people of Indian origin. If you're eligible and travel often, OCI is usually more convenient, but it takes longer to obtain." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaItemListJsonLd({ path: PATH, name: "How to apply for India eVisa online", items: STEPS }),
    faqJsonLd(eVisaFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: "/india-visa-from-usa" },
      { name: "India eVisa for U.S. Citizens", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="india-evisa-for-us-citizens"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Visa from USA", href: "/india-visa-from-usa" },
          { label: "India eVisa" },
        ]}
        icon="💻"
        category="India Travel & Visas"
        title="India eVisa for U.S. Citizens: Eligibility, Fees, Processing Time & Documents"
        hook="Who can use the India online visa, how long it takes, what it costs, and the documents you need — plus the mistakes that get eVisas rejected."
        accent="from-sky-500 to-indigo-600"
        headerExtra={
          <a href={SRC.eVisaPortal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700">Apply on official portal ↗</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.feeDisclaimer} {C.timelineDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Is India eVisa right for you?"
              answerLabel="Best for"
              answer="Eligible U.S. citizens, short trips"
              accent="sky"
              rows={[
                { label: "e-Tourist Visa (all-in)", value: "~$54", note: "$40 gov + $2 charge + $12 photo.", highlight: true },
                { label: "e-Business / e-Medical", value: "~$95", note: "$80 gov + charge + $12 photo." },
                { label: "Estimated timeline", value: "3–5 business days", note: "Apply about a week before travel." },
                { label: "Where to apply", value: "Indianvisaonline.gov.in", note: "Official government portal only." },
              ]}
              badges={["All-in estimates", "Photo included", "No approval guaranteed"]}
              lastVerified={INDIA_VISA_UPDATED}
              sources={[{ label: "India eVisa portal", href: SRC.eVisaPortal }]}
              disclaimer={C.feeDisclaimer}
              ctaText="See eVisa documents"
              ctaHref="#evisa-docs"
            />
          </Container>
        </section>

        {/* eVisa types */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">India eVisa Types</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {TYPE_CARDS.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{c.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Documents */}
        <section id="evisa-docs" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Documents Required for India eVisa</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {eVisaDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-sky-600">✓</span>{d}</li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Step-by-step */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Step-by-Step India Online Visa Application</h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                {STEPS.map((s, i) => (
                  <li key={s.name}><strong className="text-ink-900">{i + 1}. {s.name}.</strong> {s.description}</li>
                ))}
              </ol>
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
              <p className="text-sm text-ink-600">Not sure the eVisa fits? Compare all options on the <Link href="/india-visa-from-usa" className="text-sky-700 underline">India visa from USA hub</Link>, or see <Link href="/oci-vs-india-visa" className="text-sky-700 underline">OCI vs India visa</Link> if you're Indian-origin.</p>
            </div>
          </Container>
        </section>

        {/* Common mistakes */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Common eVisa Mistakes</h2>
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

        <IndiaVisaPageFooter currentPath={PATH} faqs={eVisaFaqs} />
      </ToolFirstLayout>
    </>
  );
}
