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
  feeTableRows,
  feesFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-visa-fees-usa";
const TITLE = "India Visa Fees for U.S. Citizens: Tourist, Business, Entry & eVisa Costs";
const DESC =
  "Compare estimated India visa fees for U.S. citizens, including tourist visa, business visa, entry visa, eVisa, VFS service fees, shipping and optional costs.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const OPTIONAL = ["Courier / return shipping", "SMS status updates", "Passport-style photos", "Printing", "Document preparation or translations"];

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "eVisa Fee Notes", body: `${C.eVisaFeeNote} A bank or payment-gateway charge may also apply. Pay only on the official portal, not on look-alike third-party sites.` },
  { h: "Tourist Visa Fee", body: `${C.touristVisaUSFeeEstimate} A VFS service fee may apply if you use a regular (non-eVisa) tourist visa.` },
  { h: "Business Visa Fee", body: `${C.businessVisaUSFeeEstimate} eBusiness fees are paid on the portal and vary by validity and rules.` },
  { h: "Entry Visa Fee", body: "Entry (X) Visa fees vary by case and validity. Because origin/family documents are involved, confirm the current fee and any service charges with the consulate or VFS for your category." },
  { h: "VFS Service Fee and Optional Costs", body: `${C.vfsServiceFeeEstimate} On top of the government fee, budget for optional services like courier, SMS, photos, and printing.` },
  { h: "Why Your Final Cost May Be Different", body: C.feeDisclaimer },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaVisaWebPageJsonLd({ path: PATH, name: TITLE, description: DESC, dateModified: INDIA_VISA_UPDATED }),
    indiaVisaArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: INDIA_VISA_PUBLISHED, dateModified: INDIA_VISA_UPDATED }),
    faqJsonLd(feesFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "India Visa from USA", url: "/india-visa-from-usa" },
      { name: "India Visa Fees for U.S. Citizens", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="india-visa-fees-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Visa from USA", href: "/india-visa-from-usa" },
          { label: "Visa Fees" },
        ]}
        icon="💵"
        category="India Travel & Visas"
        title="India Visa Fees for U.S. Citizens: Tourist, Business, Entry & eVisa Costs"
        hook="How much does an India visa cost from the USA? See estimated government fees, VFS service fees, and the optional costs — with clear notes on why your final total can differ."
        accent="from-emerald-600 to-green-600"
        headerExtra={
          <a href={SRC.vfsUsa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check current fees on VFS ↗</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.feeDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="How much does an India visa cost from USA?"
              answerLabel="Regular tourist/business (U.S., up to 10y)"
              answer="~$160 government fee"
              accent="emerald"
              rows={[
                { label: "Regular tourist/business", value: "~$160", note: "Up to 10 years, U.S. nationals — verify.", highlight: true },
                { label: "VFS service fee", value: "~$15.90", note: "May apply on regular visas / OCI." },
                { label: "eVisa fee", value: "Varies", note: "By type/validity — verify on portal." },
                { label: "Optional costs", value: "Courier, SMS, photo", note: "Add these to your budget." },
              ]}
              badges={["Estimates only", "Verify latest official fee", "Generally non-refundable"]}
              lastVerified={INDIA_VISA_UPDATED}
              sources={[
                { label: "VFS Global USA", href: SRC.vfsUsa },
                { label: "India eVisa portal", href: SRC.eVisaPortal },
              ]}
              disclaimer={C.feeDisclaimer}
              ctaText="See the full fee table"
              ctaHref="#fee-table"
            />
          </Container>
        </section>

        {/* Fee table */}
        <section id="fee-table" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-xl font-bold text-ink-900">India Visa Fee Table</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">Estimated costs by visa type. All figures are for planning only — verify the latest official fee before paying.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {feeTableRows.map((r) => (
                  <div key={r.type} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.type}</p>
                    <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Gov fee:</span> {r.govFee}</p>
                    <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Service:</span> {r.serviceFee}</p>
                    <p className="mt-1 text-xs text-ink-600"><span className="font-semibold text-ink-500">Optional:</span> {r.optional}</p>
                    <p className="mt-1 text-xs text-ink-500">{r.notes}</p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Visa type</th>
                      <th className="p-3 font-semibold">Government fee estimate</th>
                      <th className="p-3 font-semibold">VFS / service fee</th>
                      <th className="p-3 font-semibold">Optional costs</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {feeTableRows.map((r) => (
                      <tr key={r.type} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.type}</td>
                        <td className="p-3 font-medium text-emerald-700">{r.govFee}</td>
                        <td className="p-3 text-ink-600">{r.serviceFee}</td>
                        <td className="p-3 text-ink-600">{r.optional}</td>
                        <td className="p-3 text-ink-500">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Optional costs */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Shipping, Courier, Photo, Printing and SMS Costs</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {OPTIONAL.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-0.5 text-emerald-600">•</span>{o}</li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Sections */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              {SECTIONS.map((s) => (
                <div key={s.h}>
                  <h2 className="text-lg font-bold text-ink-900">{s.h}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{s.body}</p>
                </div>
              ))}
              <p className="text-sm text-ink-600">Also compare <Link href="/india-visa-processing-time-usa" className="text-emerald-700 underline">processing times</Link> and, for Indian-origin travelers, <Link href="/oci-vs-india-visa" className="text-emerald-700 underline">OCI vs India visa costs</Link>.</p>
            </div>
          </Container>
        </section>

        <IndiaVisaPageFooter currentPath={PATH} faqs={feesFaqs} />
      </ToolFirstLayout>
    </>
  );
}
