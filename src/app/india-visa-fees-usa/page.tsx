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
  feeByCategory,
  usd,
  feesFaqs,
  INDIA_VISA_ESTIMATE_DISCLAIMER,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-visa-fees-usa";
const TITLE = "India Visa Fees for U.S. Citizens: Tourist, Business, Entry & eVisa Costs";
const DESC =
  "Compare estimated India visa fees for U.S. citizens, including tourist visa, business visa, entry visa, eVisa, VFS service fees, shipping and optional costs.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const OPTIONAL = [
  { item: "Passport-style photo", cost: "~$12", note: "Free if you print to spec at home" },
  { item: "Courier / return shipping", cost: "~$25", note: "Regular visas via VFS (both ways)" },
  { item: "SMS status updates", cost: "~$3", note: "Optional VFS add-on" },
  { item: "Premium lounge / assisted", cost: "~$25–$45", note: "Optional VFS add-on" },
  { item: "Document translation", cost: "~$20–$40", note: "Only if documents aren't in English" },
];

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  { h: "eVisa Fee", body: `${C.eVisaFeeEstimate} The e-Tourist Visa runs about $54 all-in and the e-Business/e-Medical Visa about $95, applied online with no courier cost.` },
  { h: "Tourist Visa Fee", body: C.touristVisaUSFeeEstimate },
  { h: "Business Visa Fee", body: C.businessVisaUSFeeEstimate },
  { h: "Entry Visa Fee", body: "An Entry (X) Visa is about $176 all-in: a ~$120 government fee + ~$19 VFS/ICWF service + ~$12 photo + ~$25 courier." },
  { h: "OCI Fee", body: "The OCI card is about $334 all-in: a $275 government fee + ~$22 VFS/ICWF + ~$12 photo + ~$25 courier — a one-time, lifelong facility rather than a per-trip cost." },
  { h: "Photo, Shipping and Optional Costs", body: "Budget about $12 for a compliant photo and, for regular visas, about $25 for prepaid courier both ways. SMS updates (~$3) and premium/lounge services are optional add-ons." },
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
        hook="How much does an India visa cost from the USA? See estimated all-in totals — government fee + VFS service + photo + shipping — for every visa category, plus estimated processing times."
        accent="from-emerald-600 to-green-600"
        headerExtra={
          <a href="#fee-table" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">See the fee breakdown →</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. {C.officialSourcesNote}</>}
        disclaimerExtra={<p>{C.feeDisclaimer} {C.approvalNote}</p>}
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="How much does an India visa cost from USA?"
              answerLabel="e-Tourist Visa (all-in)"
              answer="About $54"
              accent="emerald"
              rows={[
                { label: "e-Tourist Visa", value: "~$54", note: "$40 gov + $2 charge + $12 photo.", highlight: true },
                { label: "e-Business / e-Medical", value: "~$95", note: "$80 gov + charge + $12 photo." },
                { label: "Regular tourist/business (10 yr)", value: "~$216", note: "$160 gov + $19 VFS + $12 photo + $25 courier." },
                { label: "Entry Visa / OCI", value: "~$176 / ~$334", note: "Entry Visa vs lifelong OCI card." },
              ]}
              badges={["All-in estimates", "Photo + shipping included", "Non-refundable"]}
              lastVerified={INDIA_VISA_UPDATED}
              disclaimer={INDIA_VISA_ESTIMATE_DISCLAIMER}
              ctaText="See the full fee breakdown"
              ctaHref="#fee-table"
            />
          </Container>
        </section>

        {/* Summary: total cost + total time by category */}
        <section className="py-10 sm:py-12">
          <Container>
            <h2 className="mx-auto max-w-4xl text-xl font-bold text-ink-900">Total India visa cost &amp; time by category</h2>
            <p className="mx-auto mt-1.5 max-w-4xl text-sm leading-relaxed text-ink-600">Estimated all-in totals (government fee + service + photo + shipping) and processing times for each visa category.</p>
            <div className="mt-4">
              <IndiaVisaSummaryTables accent="emerald" />
            </div>
          </Container>
        </section>

        {/* Detailed fee breakdown */}
        <section id="fee-table" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-xl font-bold text-ink-900">India Visa Fee Breakdown</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">Estimated cost line by line — government fee, VFS/service fee, photo, and shipping — plus the estimated processing time.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {feeByCategory.map((r) => (
                  <div key={r.type} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-bold text-ink-900">{r.type}</p>
                      <p className="text-sm font-bold text-emerald-700">{usd(r.total)}</p>
                    </div>
                    <p className="mt-1 text-xs text-ink-600">Gov {usd(r.govFee)} · Service {usd(r.serviceFee)} · Photo {usd(r.photoFee)} · Shipping {r.shipping ? usd(r.shipping) : "$0"}</p>
                    <p className="mt-1 text-xs text-ink-500">Time: {r.time} · {r.validity}</p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Visa type</th>
                      <th className="p-3 font-semibold">Gov fee</th>
                      <th className="p-3 font-semibold">Service</th>
                      <th className="p-3 font-semibold">Photo</th>
                      <th className="p-3 font-semibold">Shipping</th>
                      <th className="p-3 font-semibold">Total (est.)</th>
                      <th className="p-3 font-semibold">Time (est.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {feeByCategory.map((r) => (
                      <tr key={r.type} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.type}</td>
                        <td className="p-3 text-ink-600">{usd(r.govFee)}</td>
                        <td className="p-3 text-ink-600">{usd(r.serviceFee)}</td>
                        <td className="p-3 text-ink-600">{usd(r.photoFee)}</td>
                        <td className="p-3 text-ink-600">{r.shipping ? usd(r.shipping) : "$0"}</td>
                        <td className="p-3 font-bold text-emerald-700">{usd(r.total)}</td>
                        <td className="p-3 text-ink-600">{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-400">{INDIA_VISA_ESTIMATE_DISCLAIMER}</p>
            </div>
          </Container>
        </section>

        {/* Optional costs */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Photo, Shipping, SMS &amp; Optional Costs</h2>
              <div className="mt-3 divide-y divide-ink-900/5">
                {OPTIONAL.map((o) => (
                  <div key={o.item} className="flex items-baseline justify-between gap-4 py-2">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{o.item}</p>
                      <p className="text-xs text-ink-500">{o.note}</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-bold text-emerald-700">{o.cost}</p>
                  </div>
                ))}
              </div>
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
