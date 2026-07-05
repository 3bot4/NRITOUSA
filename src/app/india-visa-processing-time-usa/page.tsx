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
  processingCards,
  processingFaqs,
  INDIA_VISA_PUBLISHED,
  INDIA_VISA_UPDATED,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

const PATH = "/india-visa-processing-time-usa";
const TITLE = "India Visa Processing Time from USA: eVisa, Regular Visa, VFS & Consulate Timeline";
const DESC =
  "How long does an India visa take from the USA? See estimated eVisa, tourist, business, and Entry visa processing times, VFS courier timing, and when to apply.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

/* eVisa processing timelines (online) */
const EVISA_ROWS: { type: string; timeline: string; bestFor: string; notes: string }[] = [
  { type: "e-Tourist Visa", timeline: "3–5 business days", bestFor: "Tourism, weddings, short family visits", notes: "1-year multiple entry; approval is not guaranteed by a set date." },
  { type: "e-Business Visa", timeline: "3–5 business days", bestFor: "Meetings, conferences, trade shows", notes: "Some profiles trigger manual review, which adds time." },
  { type: "e-Medical Visa", timeline: "3–5 business days", bestFor: "Treatment at a recognized hospital", notes: "Keep hospital documents ready to avoid queries." },
];

/* Regular / paper visa processing timelines (via VFS Global) */
const REGULAR_ROWS: { type: string; timeline: string; why: string; buffer: string }[] = [
  { type: "Regular Tourist Visa", timeline: "5–10 business days", why: "VFS intake + consular review + return courier", buffer: "~2 weeks" },
  { type: "Regular Business Visa", timeline: "5–10 business days", why: "Invitation and company documents may be verified", buffer: "~2 weeks" },
  { type: "Entry Visa (X)", timeline: "2–3 weeks", why: "Indian-origin and family documents reviewed", buffer: "~3 weeks or more" },
  { type: "Student Visa", timeline: "2–4 weeks", why: "Admission and supporting documents reviewed", buffer: "~3–4 weeks" },
  { type: "Employment Visa", timeline: "3–6 weeks", why: "Contract and eligibility checks", buffer: "~4–6 weeks" },
  { type: "OCI Card (for comparison)", timeline: "8–12 weeks", why: "Two-stage consulate + MHA clearance", buffer: "Months — not for urgent travel" },
];

/* When-to-apply planning buffers */
const BUFFER_ROWS: { situation: string; buffer: string }[] = [
  { situation: "Simple eVisa trip", buffer: "At least 1 week before travel" },
  { situation: "Regular tourist / business visa", buffer: "About 2–3 weeks before travel" },
  { situation: "Entry Visa / Indian-origin family case", buffer: "About 3–4 weeks before travel" },
  { situation: "Minor child application", buffer: "3–4 weeks or more" },
  { situation: "Name mismatch / passport renewal / old Indian passport issue", buffer: "Start as early as possible" },
  { situation: "OCI", buffer: "8–12 weeks or more; not for urgent travel" },
];

/* Time-loss delays (processing-focused only, no fees) */
const DELAYS: { title: string; body: string }[] = [
  { title: "Passport expiring too soon", body: "If your passport is close to expiry or does not have enough blank pages, VFS or the visa system may stop the application before it reaches review. Renewing the passport first can add weeks, so check validity before starting the visa application." },
  { title: "Name mismatch", body: "A single spelling difference between your passport, application form, old Indian documents, marriage certificate, or supporting documents can trigger rejection or a resubmission request. That can add 5–10 business days or more while you correct forms, reprint documents, or mail a new packet." },
  { title: "Wrong visa type", body: "Choosing eVisa when your case needs a regular visa, or choosing tourist visa for a business or family-origin case, can restart the timeline. A wrong category may cost you the original wait time plus a second application." },
  { title: "Applying too late", body: "Even a simple eVisa can take longer if there is a holiday, system delay, or manual review. Regular visa and Entry Visa cases should not be started in the final week before travel unless it is a genuine emergency." },
  { title: "Old Indian passport / surrender questions", body: "Former Indian citizens may need to answer surrender or renunciation questions before a visa or OCI application moves forward. Missing old passport or surrender details can add extra back-and-forth with VFS or the consulate." },
  { title: "Photo or document format errors", body: "Wrong photo size, blurry passport scans, cropped images, or incomplete PDFs can pause the application before review. For mailed applications, a document issue may mean waiting for VFS to return the packet and then mailing a corrected version." },
  { title: "Minor child applications", body: "Minor applications often require parent passports, birth certificate, signatures, consent forms, or proof of relationship. Missing one parent's document can delay the application until the file is complete." },
  { title: "Holiday and consulate workload", body: "Indian and U.S. holidays, local consulate workload, and VFS appointment availability can stretch timelines. Add a buffer around major travel seasons, summer travel, winter holidays, and wedding season." },
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
        hook="How long does an India visa take from the USA? See estimated eVisa, tourist, business, and Entry visa processing times, why applications get delayed, and when to apply."
        accent="from-sky-600 to-blue-600"
        headerExtra={
          <a href="#timelines" className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700">See detailed timelines →</a>
        }
        sourceNote={<>Last reviewed: {INDIA_VISA_UPDATED_HUMAN}. Processing times are estimates for planning only and can change.</>}
        disclaimerExtra={<p>Processing times are estimates, not guarantees. Government rules, VFS intake, courier timing, consulate workload, holidays, and document issues can change the final timeline.</p>}
      >
        {/* Hero quick answer */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="How long does an India visa take from USA?"
              answerLabel="eVisa (typical)"
              answer="About 3–5 business days"
              accent="sky"
              rows={processingCards.map((p, i) => ({
                label: p.label,
                value: p.estimate,
                note: p.note,
                highlight: i === 0,
              }))}
              badges={["Estimates only", "Apply early", "No approval guaranteed"]}
              lastVerified={INDIA_VISA_UPDATED}
              disclaimer="Processing times are estimates, not guarantees — apply early and don't book non-refundable travel until you're approved."
              ctaText="See detailed timelines"
              ctaHref="#timelines"
            />
          </Container>
        </section>

        {/* Fees cross-link (this page is processing-time only) */}
        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-4xl rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
              <p className="text-sm leading-relaxed text-ink-700">
                Looking for a complete breakdown of government fees, VFS service charges, photo costs, courier costs, and optional expenses? See our detailed{" "}
                <Link href="/india-visa-fees-usa" className="font-semibold text-sky-700 underline">India Visa Fees Guide</Link>. This page focuses on processing times only.
              </p>
            </div>
          </Container>
        </section>

        {/* NEW H2 #1: eVisa processing timelines */}
        <section id="timelines" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">Processing Timelines for India eVisas: Tourist, Business &amp; Medical</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                India eVisa processing is online and may continue outside normal consulate counter hours, but approval is still not guaranteed by a specific deadline. Weekends, holidays, system issues, document errors, and manual review can still affect timing, so U.S. travelers should apply early instead of waiting until the last few days.
              </p>

              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">eVisa Type</th>
                      <th className="p-3 font-semibold">Typical Timeline</th>
                      <th className="p-3 font-semibold">Best For</th>
                      <th className="p-3 font-semibold">Timing Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {EVISA_ROWS.map((r) => (
                      <tr key={r.type} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.type}</td>
                        <td className="p-3 font-medium text-sky-700">{r.timeline}</td>
                        <td className="p-3 text-ink-600">{r.bestFor}</td>
                        <td className="p-3 text-ink-500">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
                <li className="flex gap-2"><span className="text-sky-600">•</span> Apply at least one week before travel for simple eVisa cases.</li>
                <li className="flex gap-2"><span className="text-sky-600">•</span> Apply earlier if your passport, photo, travel purpose, or prior visa history could trigger review.</li>
                <li className="flex gap-2"><span className="text-sky-600">•</span> Do not book non-refundable travel based only on an estimated approval window.</li>
              </ul>
            </div>
          </Container>
        </section>

        {/* NEW H2 #2: Regular / paper visa processing timelines */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">Processing Timelines for Regular &amp; Paper Visas via VFS Global</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                For regular or paper visa applications, the total turnaround time is more than just consular processing. VFS intake, document review, appointment availability, mailing to the consulate, consular review, and return courier time can all add days.
              </p>

              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Regular Visa Type</th>
                      <th className="p-3 font-semibold">Typical Timeline from USA</th>
                      <th className="p-3 font-semibold">Why It May Take Longer</th>
                      <th className="p-3 font-semibold">Planning Buffer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {REGULAR_ROWS.map((r) => (
                      <tr key={r.type} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.type}</td>
                        <td className="p-3 font-medium text-sky-700">{r.timeline}</td>
                        <td className="p-3 text-ink-600">{r.why}</td>
                        <td className="p-3 text-ink-500">{r.buffer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <p className="text-sm leading-relaxed text-amber-800">
                  <strong>Courier time counts too.</strong> FedEx/UPS or other courier shipping time is counted on top of consular processing days. If your package is delayed, returned for correction, or held because of missing documents, the total timeline can extend by several business days or more.
                </p>
              </div>

              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
                <li className="flex gap-2"><span className="text-sky-600">•</span> Regular tourist/business visa: plan about 2 weeks where possible.</li>
                <li className="flex gap-2"><span className="text-sky-600">•</span> Entry Visa: plan about 3 weeks or more where possible.</li>
                <li className="flex gap-2"><span className="text-sky-600">•</span> OCI: plan months, not days, and do not treat it as an emergency travel solution.</li>
              </ul>
            </div>
          </Container>
        </section>

        {/* Delays (time-focused) */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">Mistakes That Add Days or Weeks to Your India Visa Timeline</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {DELAYS.map((m) => (
                  <div key={m.title} className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <p className="text-sm font-bold text-ink-900">{m.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{m.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* When to apply */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">When to Apply Before Travel</h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Trip Situation</th>
                      <th className="p-3 font-semibold">Suggested Application Buffer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {BUFFER_ROWS.map((r) => (
                      <tr key={r.situation} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.situation}</td>
                        <td className="p-3 font-medium text-sky-700">{r.buffer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-500">These are planning buffers, not official guarantees.</p>
            </div>
          </Container>
        </section>

        {/* Emergency / urgent travel */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Emergency or Urgent Travel</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Genuine emergencies (serious family illness or bereavement) may be reviewed case by case by the relevant Indian Consulate or VFS process, but approval and timing are not guaranteed. Contact the consulate or VFS directly and keep proof of the emergency ready. Do not rely on OCI for urgent travel — it takes about 8–12 weeks.
              </p>
              <p className="mt-4 text-sm text-ink-600">
                Planning cost too? See our <Link href="/india-visa-fees-usa" className="text-sky-700 underline">India Visa Fees Guide</Link>, or start at the <Link href="/india-visa-from-usa" className="text-sky-700 underline">India Visa from USA hub</Link>. You can also compare the <Link href="/india-evisa-for-us-citizens" className="text-sky-700 underline">India eVisa for U.S. citizens</Link>, the <Link href="/entry-visa-india-from-usa" className="text-sky-700 underline">Entry Visa India from USA</Link>, and <Link href="/oci-vs-india-visa" className="text-sky-700 underline">OCI vs India visa</Link>.
              </p>
            </div>
          </Container>
        </section>

        <IndiaVisaPageFooter currentPath={PATH} faqs={processingFaqs} />
      </ToolFirstLayout>
    </>
  );
}
