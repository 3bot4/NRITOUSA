import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import NvcTimelineChecker from "@/components/tools/NvcTimelineChecker";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  nvcClusterLinks,
  nvcRelatedLinks,
  nvcWebAppJsonLd,
  nvcArticleJsonLd,
  NVC_PUBLISHED,
  NVC_UPDATED,
  NVC_UPDATED_HUMAN,
} from "@/lib/nvcCluster";
import { nvcLinks, nvcProcessingData as D, NVC_DATA_NOTE } from "@/data/nvcData";

const PATH = "/nvc-processing-time";
const TITLE = "NVC Processing Time: Case Creation, Document Review & Interview Wait";
const DESC =
  "How long NVC takes after USCIS approval — case creation, fee and DS-260 steps, document review, and the wait from documentarily qualified to a consular interview. General planning ranges, not guarantees.";

export const metadata: Metadata = pageMetadata({
  title: "NVC Processing Time",
  description: DESC,
  path: PATH,
});

const STAGES: { stage: string; range: string; note: string }[] = [
  { stage: "USCIS approval → NVC case creation", range: `~${D.caseCreationWeeksLow}–${D.caseCreationWeeksHigh} weeks`, note: "Includes the physical handoff from USCIS to NVC and the welcome letter." },
  { stage: "Pay fees + complete DS-260", range: "Depends on you", note: "This step moves as fast as you complete it; fees take a day or two to clear." },
  { stage: "Document review after submission", range: `~${D.docReviewWeeksLow}–${D.docReviewWeeksHigh} weeks`, note: "NVC reviews packages roughly in the order received; missing items reset the clock." },
  { stage: "Documentarily qualified → interview", range: `~${D.dqToInterviewMonthsLow}–${D.dqToInterviewMonthsHigh} months`, note: "Depends on embassy appointment availability and, for preference categories, the priority date." },
];

const faq: FaqItem[] = [
  { question: "How long does NVC take after USCIS approval?", answer: "After USCIS approves your petition, it is forwarded to NVC and a case is created, usually within a few weeks — commonly a couple to several weeks, but this varies and is not guaranteed. NVC then issues a welcome letter with your case number and invoice ID. Always check the official NVC timeframes for the current pace." },
  { question: "How long does NVC take to review documents?", answer: "Once you submit your DS-260, Affidavit of Support, and civil documents, NVC reviews the package — often within a few weeks, though it can be longer during busy periods. If documents are missing, NVC lists what is needed in CEAC and the review restarts once you resubmit. Times change, so treat any range as a planning estimate." },
  { question: "How often does NVC update timeframes?", answer: "NVC publishes processing timeframes on the Department of State website and updates them regularly to reflect current workload. Because the numbers move, the official timeframes page — not a fixed figure you read once — is the reliable source before assuming your case is delayed." },
  { question: "What does documentarily qualified mean?", answer: "Documentarily qualified (DQ) means NVC has accepted your DS-260 and all required documents, so the case is complete and ready for a consular interview. After DQ, the case waits in line for an interview appointment based on embassy availability and visa number availability for preference categories." },
  { question: "How long after DQ will I get an interview?", answer: "There is no fixed wait. After documentarily qualified, NVC schedules interviews as appointments become available at your embassy or consulate. For immediate-relative categories this can be relatively quick; for preference categories it also depends on your priority date being current. It can range from about a month to many months." },
  { question: "Why is my NVC case delayed?", answer: "Common reasons include a slow USCIS-to-NVC handoff, missing or unclear documents that need resubmission, high case volume, a priority date that is not yet current for preference categories, and limited interview appointments at your post. Check CEAC for requested items and compare against the official NVC timeframes before submitting an inquiry." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    nvcArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: NVC_PUBLISHED, dateModified: NVC_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "NVC Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="nvc-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "NVC Processing Time" },
        ]}
        icon="⏳"
        category="Visa & Green Card"
        title="NVC Processing Time"
        hook="How long the National Visa Center takes — case creation, document review, and the wait from documentarily qualified to your consular interview. These are general planning ranges, never guarantees."
        accent="from-blue-600 to-indigo-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
              Check My NVC Stage →
            </a>
            <a href={nvcLinks.nvcTimeframes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
              Official NVC Timeframes ↗
            </a>
          </div>
        }
        sourceNote={<>Last updated: {NVC_UPDATED_HUMAN}. {NVC_DATA_NOTE}</>}
        disclaimerExtra={<p>This is an educational tool and not legal advice. Always verify with official USCIS, Department of State, CEAC, and embassy/consulate instructions.</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick answer: how long does NVC take?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                There is no single guaranteed number. NVC processing has several parts — case creation after USCIS approval, the fee/DS-260 steps you control, document review, and the wait from <strong>documentarily qualified</strong> to a consular interview. Each part varies and changes constantly. Interview scheduling ultimately depends on appointment availability at your embassy or consulate.
              </p>
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <p className="text-xs leading-relaxed text-ink-700">
                  <span className="font-bold text-ink-900">Always verify:</span> compare your case against the official{" "}
                  <a href={nvcLinks.nvcTimeframes} target="_blank" rel="noopener noreferrer" className="font-semibold underline">NVC timeframes</a>, which the Department of State updates regularly.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Stage range table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">NVC processing time by stage</h2>
              <p className="mt-1.5 text-sm text-ink-500">General planning ranges only — not guarantees, and not a prediction for your specific case.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Stage</th>
                      <th className="p-3 font-semibold">Rough range</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {STAGES.map((r) => (
                      <tr key={r.stage} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.stage}</td>
                        <td className="p-3 font-semibold text-blue-700">{r.range}</td>
                        <td className="p-3 text-ink-600">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-500">{NVC_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 pb-12 pt-10 sm:pb-16 sm:pt-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Estimate your NVC stage & next step</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The table above gives typical ranges. Use the checker below to find your current NVC stage, your next step, and whether you may be outside the official timeframes.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <NvcTimelineChecker />
            </div>
          </Container>
        </section>

        {/* SEO content */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-bold text-ink-900">Why NVC processing time is hard to pin down</h2>
                <p className="mt-2">
                  NVC processing is not one step but several, and each is affected by different factors. The handoff from USCIS to NVC depends on USCIS. Fee payment and the DS-260 move as fast as you complete them. Document review depends on NVC's workload and whether your package is complete. And the final wait — from <Link href="/nvc-case-status#stage-documentarily-qualified" className="text-brand-600 underline">documentarily qualified</Link> to interview — depends on appointment availability at your embassy and, for preference categories, on your priority date. Because all of these move independently and change month to month, no honest single number exists.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">The parts you control vs. the parts you wait on</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">You control</p>
                    <ul className="mt-1.5 space-y-1 text-xs text-ink-600">
                      <li>How quickly you pay fees once you have the case number</li>
                      <li>How fast you complete DS-260 for each applicant</li>
                      <li>Whether your uploaded documents are complete and clear</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">You wait on</p>
                    <ul className="mt-1.5 space-y-1 text-xs text-ink-600">
                      <li>USCIS forwarding the case to NVC</li>
                      <li>NVC reviewing your document package</li>
                      <li>Embassy interview appointment availability</li>
                      <li>Your priority date (preference categories)</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-3">
                  The single biggest thing you can do to avoid delay is submit a <strong>complete, accurate package the first time</strong>. Missing or unclear documents send the case back for correction and effectively restart the review. The{" "}
                  <Link href="/nvc-document-checklist-india" className="text-brand-600 underline">NVC document checklist for Indian applicants</Link> walks through what to prepare.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">What "documentarily qualified" changes about your wait</h2>
                <p className="mt-2">
                  Reaching DQ is a milestone, but it does not mean an interview is imminent. DQ simply means NVC has accepted everything and the case is ready. From there, the interview wait is governed by your embassy or consulate's appointment capacity and, for family and employment preference categories, by whether your priority date is current in the{" "}
                  <Link href="/visa-bulletin" className="text-brand-600 underline">Visa Bulletin</Link>. Immediate-relative categories (like IR1/CR1 spouses and IR5 parents of U.S. citizens) are not subject to that numerical wait, so they often move to interview faster once DQ.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">When a delay is worth a public inquiry</h2>
                <p className="mt-2">
                  If your case is genuinely past the official NVC timeframes — for example, no case number long after approval, or a document package that has sat far beyond the typical review window — that is when an{" "}
                  <Link href="/nvc-public-inquiry" className="text-brand-600 underline">NVC public inquiry</Link> is appropriate. Inquiring before you are outside the timeframes, or sending duplicate inquiries, does not help and can add to the queue.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA boxes */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
              <Link href="#calculator" className="rounded-2xl border border-blue-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Not sure where you are?</p>
                <p className="mt-1 text-xs text-ink-600">Use the NVC Timeline Checker →</p>
              </Link>
              <Link href="/nvc-document-checklist-india" className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Preparing documents?</p>
                <p className="mt-1 text-xs text-ink-600">Open the NVC India Document Checklist →</p>
              </Link>
              <Link href="/nvc-public-inquiry" className="rounded-2xl border border-rose-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Outside the official timeframe?</p>
                <p className="mt-1 text-xs text-ink-600">Review when to submit an NVC Public Inquiry →</p>
              </Link>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="More NVC & green card guides" links={[...nvcClusterLinks.filter((l) => l.href !== PATH), ...nvcRelatedLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        {/* Author */}
        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={NVC_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
