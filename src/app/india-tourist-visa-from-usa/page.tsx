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
  regularVisaDocuments,
  commonMistakes,
  touristFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-tourist-visa-from-usa";
const TITLE = "India Tourist Visa from USA: eVisa vs Regular Tourist Visa, Fees & Timeline";
const DESC =
  "Compare India eTourist Visa and regular tourist visa from USA. See estimated fees, processing time, required documents, multiple-entry options and common mistakes.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const COMPARE = [
  { feature: "Best for", evisa: "Short, eligible trips", regular: "Longer stays / not eVisa-eligible" },
  { feature: "Where to apply", evisa: "Online portal", regular: "VFS Global / consulate" },
  { feature: "Processing", evisa: "Often a few business days", regular: "Min. 3 working days after receipt; often longer" },
  { feature: "Entry ports", evisa: "Designated airports/seaports", regular: "Standard ports" },
  { feature: "Fee (U.S. nationals)", evisa: "~$54 all-in (1 year)", regular: "~$216 all-in (up to 10 years)" },
  { feature: "Multiple entry", evisa: "Depends on type/rules", regular: "Multiple-entry options for some types" },
];

const USE_CASES = [
  "Visiting parents or family in India",
  "Tourism and sightseeing",
  "Attending weddings and events",
  "Short family trips",
  "Multiple-entry travel across a region",
];

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "Who Should Use India Tourist Visa (Visitor Visa)?", body: "The India tourist visa — often called a visitor visa for India — suits travelers going for sightseeing, weddings, or short family visits. There is no separate 'visitor visa' category; the tourist visa (or e-Tourist Visa) is what most visitors use. Indian-origin travelers who visit often, or plan to live with family long-term, may find the OCI card or an Entry Visa more suitable." },
  { h: "India Tourist Visa Fees from USA", body: `eTourist fees vary by validity and rules. A regular tourist visa for U.S. nationals valid up to 10 years is commonly around a $160 government fee, and a VFS service fee may apply. ${C.feeDisclaimer}` },
  { h: "India Tourist Visa Processing Time", body: `eTourist visas are often approved within a few business days; regular tourist visas require a minimum of 3 working days after receipt and are frequently longer. ${C.timelineDisclaimer}` },
  { h: "India Tourist Visa Multiple Entry Explained", body: "A multiple-entry tourist visa lets you enter India more than once while it's valid — useful if you'll leave and return during a trip. The 1-year e-Tourist Visa (~$54) and the 10-year regular tourist visa (~$216) are both multiple entry." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    faqJsonLd(touristFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: "/india-visa-from-usa" },
      { name: "India Tourist Visa from USA", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="india-tourist-visa-from-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Visa from USA", href: "/india-visa-from-usa" },
          { label: "Tourist Visa" },
        ]}
        icon="🧳"
        category="India Travel & Visas"
        title="India Tourist Visa from USA: eVisa vs Regular Tourist Visa, Fees & Timeline"
        hook="Sightseeing, a wedding, or visiting family? The India tourist visa (also searched as the India visitor visa) covers short leisure and family trips. See whether the e-Tourist Visa or a regular tourist visa fits — with estimated fees, timelines, multiple-entry rules, and documents."
        accent="from-emerald-500 to-teal-600"
        headerExtra={
          <a href="#tourist-docs" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">See tourist visa documents →</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.feeDisclaimer} {C.timelineDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Which India tourist visa should you choose?"
              answerLabel="Most short trips"
              answer="e-Tourist Visa (if eligible)"
              accent="emerald"
              rows={[
                { label: "e-Tourist Visa (all-in)", value: "~$54", note: "3–5 business days, applied online.", highlight: true },
                { label: "Regular Tourist Visa (all-in)", value: "~$216", note: "5–10 business days, via VFS." },
                { label: "Includes", value: "Photo + courier", note: "$12 photo, $25 courier (regular)." },
                { label: "Passport validity", value: "6+ months", note: "Plus blank pages." },
              ]}
              badges={["All-in estimates", "Photo + shipping included", "No approval guaranteed"]}
              lastVerified={INDIA_VISA_UPDATED}
              disclaimer={C.approvalNote}
              ctaText="See tourist visa documents"
              ctaHref="#tourist-docs"
            />
          </Container>
        </section>

        {/* Comparison table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">India eTourist Visa vs Regular Tourist Visa</h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold"> </th>
                      <th className="p-3 font-semibold">e-Tourist Visa</th>
                      <th className="p-3 font-semibold">Regular Tourist Visa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {COMPARE.map((r) => (
                      <tr key={r.feature} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.feature}</td>
                        <td className="p-3 text-ink-600">{r.evisa}</td>
                        <td className="p-3 text-ink-600">{r.regular}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Use cases */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Great for these trips</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {USE_CASES.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-emerald-600">✓</span>{u}</li>
                ))}
              </ul>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800"><strong>Passport validity warning:</strong> India generally expects at least 6 months of validity plus blank pages. Renew your passport before applying if you're close to expiry.</p>
            </div>
          </Container>
        </section>

        {/* Documents */}
        <section id="tourist-docs" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Documents Required</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {regularVisaDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-emerald-600">✓</span>{d}</li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* How to apply */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How to Apply for Indian Travel Visa</h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <li><strong className="text-ink-900">1. Decide eVisa or regular.</strong> Eligible short trip → e-Tourist Visa. Longer/complex → regular via VFS.</li>
                <li><strong className="text-ink-900">2. Check passport validity.</strong> 6+ months and blank pages; renew first if needed.</li>
                <li><strong className="text-ink-900">3. Apply on the right channel.</strong> The e-Tourist Visa is applied for online; a regular tourist visa goes through VFS Global. Official links are at the bottom of this page.</li>
                <li><strong className="text-ink-900">4. Upload documents, pay, and track.</strong> Follow photo/scan specs; keep your application ID.</li>
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
              <p className="text-sm text-ink-600">Indian-origin travelers should also compare <Link href="/oci-vs-india-visa" className="text-emerald-700 underline">OCI vs India visa</Link> and the <Link href="/entry-visa-india-from-usa" className="text-emerald-700 underline">Entry Visa guide</Link> — for frequent visits, the <Link href="/oci" className="text-emerald-700 underline">OCI card</Link> is often the better long-term choice. Passport close to expiring? Sort out <Link href="/indian-passport-renewal-usa" className="text-emerald-700 underline">Indian passport renewal in the USA</Link> first.</p>
            </div>
          </Container>
        </section>

        {/* Common mistakes */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Common Tourist Visa Mistakes</h2>
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

        <IndiaVisaPageFooter currentPath={PATH} faqs={touristFaqs} />
      </ToolFirstLayout>
    </>
  );
}
