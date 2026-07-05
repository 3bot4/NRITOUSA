import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import NvcTimelineChecker from "@/components/tools/NvcTimelineChecker";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import SoftCta from "@/components/SoftCta";
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
import { nvcStages, nvcLinks, NVC_DATA_NOTE } from "@/data/nvcData";
import ImmigrationTimelineTable from "@/components/tools/ImmigrationTimelineTable";
import {
  nvcTimelineRows,
  nvcTimelineBadges,
  nvcPlanningSummary,
  nvcSourceNote,
  nvcSourceLinks,
  nvcStatusMeanings,
  TIMELINE_DISCLAIMER,
} from "@/data/immigrationTimelineData";

const PATH = "/nvc-case-status";
const TITLE = "NVC Case Status and Timeline 2026";
const WEBAPP_NAME = "NVC Case Status and Timeline Checker";
const DESC =
  "Check what your NVC case status means, how long each stage may take, and what to do after USCIS approval, fee payment, document submission, DQ, interview scheduling, and embassy transfer.";

export const metadata: Metadata = pageMetadata({
  title: "NVC Case Status & Timeline",
  description: DESC,
  path: PATH,
});

/* -------------------------------------------------------------------------- */
/* Static, editable content.                                                  */
/* -------------------------------------------------------------------------- */

const QUICK: { q: string; a: string }[] = [
  { q: "What is NVC?", a: "The National Visa Center handles immigrant visa pre-processing after USCIS approves an immigrant petition." },
  { q: "What happens at NVC?", a: "NVC collects fees, the DS-260, the Affidavit of Support, financial documents, and civil documents." },
  { q: "Where do I check NVC status?", a: "The CEAC immigrant visa portal." },
  { q: "What is an NVC case number?", a: "A case number assigned after USCIS sends the approved petition to NVC." },
  { q: "What happens after documents are accepted?", a: "The case may become documentarily qualified and then wait for interview scheduling." },
  { q: "When should I contact NVC?", a: "When the case is outside official NVC timeframes or there is a specific issue." },
];

const faq: FaqItem[] = [
  { question: "What is NVC case status?", answer: "NVC case status is where your immigrant visa case stands at the National Visa Center after USCIS approves the petition. It moves through stages — case creation, fee payment, DS-260, document submission, NVC review, documentarily qualified, and interview scheduling — and then embassy statuses like In Transit, Ready, Administrative Processing, and Issued. You check it in the CEAC immigrant visa portal." },
  { question: "How long does NVC take after USCIS approval?", answer: "There is no single guaranteed number. USCIS transferring the approved petition to NVC can take several weeks, then case creation, document review, and the wait to an interview each vary and change constantly. Treat any range as a planning estimate and verify the official NVC timeframes and your CEAC status." },
  { question: "How long does it take to get an NVC welcome letter?", answer: "After USCIS forwards the approved petition, NVC creates the case and issues a welcome letter or email with your case number and invoice ID — often within a few weeks, but this varies. If it has been much longer than the official NVC timeframe, you can submit an NVC public inquiry to ask about your case." },
  { question: "What does “At NVC” mean?", answer: "“At NVC” generally means the National Visa Center has your case or is waiting for action from you or the sponsor — such as paying fees, submitting the DS-260, or uploading documents. Log in to CEAC to see exactly which step is outstanding and any messages from NVC." },
  { question: "What does “Documentarily Qualified” mean?", answer: "Documentarily qualified (DQ) means NVC has reviewed and accepted your DS-260 and all required documents, so the case is complete and ready for a consular interview. After DQ, the case waits in line for an interview appointment based on embassy availability and, for preference categories, visa number availability." },
  { question: "Does DQ mean my interview is scheduled?", answer: "No. Documentarily qualified means your documents are accepted and the case is ready — it does not mean an interview date is set. After DQ, NVC and your embassy schedule the interview when an appointment becomes available, which can vary widely by post, visa category, and priority date." },
  { question: "How long after DQ will I get an interview?", answer: "There is no fixed wait. After documentarily qualified, interview scheduling depends on appointment availability at your embassy or consulate and, for preference categories, on your priority date being current. It can range from about a month to many months. Check your embassy's backlog and the NVC timeframes." },
  { question: "What does “In Transit” mean?", answer: "“In Transit” on CEAC generally means your case is being sent from NVC to the U.S. embassy or consulate that will conduct the interview. Usually no action is needed at this stage — monitor CEAC and follow any instructions from the embassy." },
  { question: "What does “Ready” mean on CEAC?", answer: "“Ready” generally means the embassy or consulate has your case and can proceed according to its own process. Follow the embassy's instructions for scheduling the interview, completing the medical exam, and preparing your document checklist." },
  { question: "What does “Administrative Processing” mean?", answer: "Administrative processing means the case needs additional review after the interview or submission before a final decision. Timelines vary widely and there is usually no guaranteed shortcut. Watch for embassy updates and submit anything they request promptly." },
  { question: "What does “Issued” mean?", answer: "“Issued” means the immigrant visa was approved and is being printed and returned, typically in your passport. Track the passport delivery instructions from your embassy and review the visa details for accuracy when you receive it." },
  { question: "What does “Refused” mean on CEAC?", answer: "“Refused” on CEAC does not always mean a permanent denial. It can indicate a temporary refusal while a case is in administrative processing or missing something, or a final refusal depending on the case. Read the embassy's instructions carefully and consult a licensed immigration attorney if you are unsure." },
  { question: "Can I expedite my NVC case?", answer: "Expedites are limited and granted only in specific urgent situations, typically at the discretion of NVC or the embassy. You can control your own speed by paying fees, completing the DS-260, and uploading correct documents promptly, but interview timing mostly depends on the embassy. This tool is educational and not legal advice." },
  { question: "Does the Visa Bulletin matter for NVC?", answer: "For preference categories (like F1–F4 family and employment-based), yes — a visa number must be available (priority date current) for the case to move to interview and visa issuance. Immediate relatives of U.S. citizens are not subject to that numerical limit. Check the Visa Bulletin for your category and country." },
  { question: "Is this NVC case status tool legal advice?", answer: "No. This tool is for educational planning only and is not legal advice. NVC and embassy timelines vary by case and change constantly. Always verify your case in CEAC, check the official NVC timeframes and your embassy's instructions, and consult a licensed immigration attorney for advice specific to your situation." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcWebAppJsonLd({ path: PATH, name: WEBAPP_NAME, description: DESC }),
    nvcArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: NVC_PUBLISHED, dateModified: NVC_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "NVC Case Status", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="nvc-case-status"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "NVC Case Status" },
        ]}
        icon="🗂️"
        category="Visa & Green Card"
        title="NVC Case Status and Timeline 2026"
        hook="Check what your NVC case status means, how long each stage may take, and what to do after USCIS approval, fee payment, document submission, DQ, interview scheduling, and embassy transfer."
        accent="from-blue-600 to-indigo-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#nvc-case-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
              Check My NVC Case Stage →
            </a>
            <a href={nvcLinks.ceac} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
              Check status on CEAC ↗
            </a>
          </div>
        }
        sourceNote={<>Last updated: {NVC_UPDATED_HUMAN}. {NVC_DATA_NOTE}</>}
        disclaimerExtra={<p>{TIMELINE_DISCLAIMER}</p>}
      >
        {/* Quick answer box */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: How Long Does NVC Take?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                NVC timing depends on when USCIS sends the approved petition, when fees are paid, when the DS-260 and civil/financial documents are submitted, whether NVC accepts the documents, and when the U.S. embassy or consulate has interview availability. After a case becomes <strong>documentarily qualified</strong>, the interview wait can vary widely by country, visa category, and embassy workload.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#nvc-case-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-700">Check my NVC case stage →</a>
                <a href={nvcLinks.nvcTimeframes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-blue-300">Official NVC timeframes ↗</a>
              </div>
              <p className="mt-3 text-xs text-ink-500">
                NVC is the Department of State stage for consular processing (interview abroad). If you are adjusting status inside the U.S., see{" "}
                <Link href="/i485-processing-time" className="text-brand-600 underline">I-485 processing time</Link> instead.
              </p>
            </div>
          </Container>
        </section>

        {/* NEW: static timeline estimate table (before the tool) */}
        <section className="py-10 sm:py-12">
          <Container>
            <ImmigrationTimelineTable
              title="NVC Timeline Estimate by Stage"
              intro="Most users checking NVC case status want to understand what stage they are in and how long the next step may take. This table gives a planning estimate. Use the case status tool below for a more personalized next-step checklist."
              rows={nvcTimelineRows}
              stepHeader="NVC stage"
              badges={nvcTimelineBadges}
              sourceNote={nvcSourceNote}
              sourceLinks={nvcSourceLinks}
              ctaText="Check My NVC Case Stage"
              ctaHref="#nvc-case-tool"
              accentBtn="bg-blue-600 hover:bg-blue-700"
            />

            {/* Quick planning summary box */}
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-card">
              <h3 className="text-base font-bold text-ink-900">NVC Timeline Planning Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{nvcPlanningSummary}</p>
            </div>
          </Container>
        </section>

        {/* NVC Status Meaning table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">NVC Case Status Meaning</h2>
              <p className="mt-1.5 text-sm text-ink-500">What each CEAC status usually means and what to do next. General guidance only — always confirm in CEAC and with your embassy.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {nvcStatusMeanings.map((r) => (
                  <div key={r.status} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.status}</p>
                    <p className="mt-1.5 text-xs text-ink-600"><span className="font-semibold text-ink-500">Means: </span>{r.means}</p>
                    <p className="mt-1 text-xs text-ink-700"><span className="font-semibold text-ink-900">Next: </span>{r.next}</p>
                  </div>
                ))}
              </div>

              {/* sm+ table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">What it usually means</th>
                      <th className="p-3 font-semibold">What to do next</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {nvcStatusMeanings.map((r) => (
                      <tr key={r.status} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.status}</td>
                        <td className="p-3 text-ink-600">{r.means}</td>
                        <td className="p-3 text-ink-600">{r.next}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Quick answers reference table */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">NVC quick answers</h2>
              <p className="mt-1.5 text-sm text-ink-500">The fast version — general guidance only, not case-specific advice.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-white text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Question</th>
                      <th className="p-3 font-semibold">Quick answer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {QUICK.map((r) => (
                      <tr key={r.q} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.q}</td>
                        <td className="p-3 text-ink-600">{r.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Stage cards */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Where are you in the NVC process?</h2>
              <p className="mt-1.5 text-sm text-ink-500">Tap your stage to jump to what it means and what to do next, then use the checker below.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {nvcStages.map((s, i) => (
                  <a key={s.id} href={`#stage-${s.id}`} className="group flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-blue-400 hover:shadow-sm">
                    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                    <span className="text-sm font-semibold text-ink-900 group-hover:text-blue-700">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Stage detail sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The NVC stages, explained</h2>
              <p className="mt-1.5 text-sm text-ink-500">Every stage between USCIS approval and your consular interview, in order.</p>
              <ol className="mt-5 space-y-3">
                {nvcStages.map((s, i) => (
                  <li key={s.id} id={`stage-${s.id}`} className="scroll-mt-24 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-ink-900">{s.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.meaning}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-700"><span className="font-semibold text-ink-900">Next:</span> {s.next}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* Personalized tool */}
        <section id="nvc-case-tool" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 pb-12 pt-10 sm:pb-16 sm:pt-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Check Your NVC Case Stage</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Answer a few yes/no questions to see your current NVC stage, your next step, which documents to prepare, and whether you should check the official timeframes or consider a public inquiry.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <NvcTimelineChecker />
            </div>
            <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-ink-700">
              Want typical ranges? Open the{" "}
              <Link href="/nvc-processing-time" className="font-semibold text-brand-600 underline">NVC processing time</Link> guide to compare against the planning estimates above.
            </div>
          </Container>
        </section>

        {/* SEO content */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-bold text-ink-900">What is NVC and why does your case go there?</h2>
                <p className="mt-2">
                  The National Visa Center (NVC) is a Department of State facility that prepares immigrant visa cases for the consular interview stage. When USCIS approves an immigrant petition — for example an <strong>I-130</strong> filed by a U.S. citizen or permanent resident relative, or an <strong>I-140</strong> employment petition — and the beneficiary will interview at a U.S. embassy or consulate abroad, USCIS forwards the approved petition to NVC. NVC then collects everything the consular officer will need: fees, the DS-260 application, the Affidavit of Support, financial evidence, and civil documents.
                </p>
                <p className="mt-2">
                  This is the difference that confuses most families: NVC is only part of <strong>consular processing</strong> (interview abroad). If you are already in the United States and eligible to adjust status, you file Form I-485 with USCIS instead and your case never goes to NVC. If that describes you, use the{" "}
                  <Link href="/i485-processing-time" className="text-brand-600 underline">I-485 processing time</Link> tool. This page is for people whose case has moved to NVC for an interview overseas.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">The NVC steps in plain language</h2>
                <p className="mt-2">
                  After USCIS approval, the process at NVC is a sequence you move through inside the CEAC portal:
                </p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                  <li><strong>Case creation & welcome letter.</strong> NVC creates your case and sends your <Link href="/what-is-nvc-case-number" className="text-brand-600 underline">NVC case number</Link> and invoice ID.</li>
                  <li><strong>Pay fees.</strong> You pay the Affidavit of Support fee and the immigrant visa application fee in CEAC.</li>
                  <li><strong>Complete DS-260.</strong> Each applicant fills out the online immigrant visa application.</li>
                  <li><strong>Upload documents.</strong> You upload the Affidavit of Support, financial evidence, and civil documents. See the <Link href="/nvc-document-checklist-india" className="text-brand-600 underline">NVC document checklist for Indian applicants</Link>.</li>
                  <li><strong>NVC review.</strong> NVC checks the package and either accepts it or lists what is missing in CEAC.</li>
                  <li><strong>Documentarily qualified.</strong> When everything is accepted, the case is DQ and waits for an interview.</li>
                  <li><strong>Interview scheduling.</strong> NVC and your embassy schedule the interview when an appointment is available.</li>
                </ol>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">How to check your NVC case status</h2>
                <p className="mt-2">
                  The only official place to check your case is the CEAC immigrant visa portal. Log in with your NVC case number and invoice ID to see which steps are complete, whether your documents were accepted, and any outstanding items. Because CEAC does not always email you at every step, it is worth logging in periodically. NRItoUSA is not affiliated with NVC or the Department of State and cannot access or look up your case — always rely on CEAC and official notices.
                </p>
                <div className="mt-3 rounded-xl border border-blue-100 bg-white p-4">
                  <p className="text-xs text-ink-600">
                    <span className="font-bold text-ink-900">Tip:</span> keep your case number and invoice ID private. Legitimate tools — including this one — never need your full case number, invoice ID, passport number, or date of birth.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">How long does NVC take?</h2>
                <p className="mt-2">
                  There is no guaranteed number. Case creation after USCIS approval, document review after you submit, and the wait from documentarily qualified to interview each vary widely and change constantly. NVC publishes official processing timeframes that it updates regularly — always treat any figure you read as a rough planning estimate. For a fuller breakdown, see the{" "}
                  <Link href="/nvc-processing-time" className="text-brand-600 underline">NVC processing time</Link> page, and remember that interview scheduling ultimately depends on appointment availability at your embassy or consulate.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">When should you contact NVC?</h2>
                <p className="mt-2">
                  Most of the time you simply follow the steps and wait. You should consider an{" "}
                  <Link href="/nvc-public-inquiry" className="text-brand-600 underline">NVC public inquiry</Link> mainly when your case is outside the official NVC timeframes, when there is a clear error, or when a CEAC payment or step is stuck. Submitting inquiries early, or sending duplicates, does not speed anything up and can slow the queue. Check the official timeframes first, then inquire only if you are genuinely past them.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA boxes */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
              <Link href="#nvc-case-tool" className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Not sure where you are?</p>
                <p className="mt-1 text-xs text-ink-600">Use the NVC Timeline Checker →</p>
              </Link>
              <Link href="/nvc-document-checklist-india" className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Preparing documents?</p>
                <p className="mt-1 text-xs text-ink-600">Open the NVC India Document Checklist →</p>
              </Link>
              <Link href="/nvc-public-inquiry" className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Outside the official timeframe?</p>
                <p className="mt-1 text-xs text-ink-600">Review when to submit an NVC Public Inquiry →</p>
              </Link>
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-base font-bold text-ink-900">Official NVC & Department of State sources</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: nvcLinks.nvcHome, label: "Department of State — NVC" },
                  { href: nvcLinks.nvcTimeframes, label: "NVC Timeframes" },
                  { href: nvcLinks.ceac, label: "CEAC Immigrant Visa Login" },
                  { href: nvcLinks.publicInquiry, label: "NVC Public Inquiry / Contact" },
                  { href: nvcLinks.fees, label: "NVC Fees" },
                  { href: nvcLinks.ds260, label: "DS-260 / Begin NVC Processing" },
                ].map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="nofollow noopener noreferrer" className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-medium text-brand-600 transition hover:border-brand-300 hover:text-brand-700">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related NVC and Immigration Tools" links={[...nvcClusterLinks.filter((l) => l.href !== PATH), ...nvcRelatedLinks]} />
          </Container>
        </section>

        {/* Soft CTA */}
        <section className="py-4">
          <Container>
            <SoftCta
              related={{
                href: "/nvc-processing-time",
                label: "NVC Processing Time",
                description:
                  "See typical NVC document review and interview-scheduling timelines for India.",
              }}
            />
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
