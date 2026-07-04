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
import { nvcStages, nvcLinks, NVC_DATA_NOTE } from "@/data/nvcData";

const PATH = "/nvc-case-status";
const TITLE = "NVC Case Status, Timeline & Next Steps After USCIS Approval";
const DESC =
  "Understand your NVC case status after USCIS approval — welcome letter, case number, fees, DS-260, documents, documentarily qualified, and interview. Find your NVC stage and next step.";

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
  { question: "What is NVC?", answer: "NVC is the National Visa Center, part of the U.S. Department of State. After USCIS approves an immigrant petition (such as I-130 or I-140) for someone who will interview at a U.S. embassy or consulate abroad, USCIS forwards the case to NVC. NVC handles pre-processing — collecting fees, the DS-260 application, the Affidavit of Support, and civil documents — before the case is ready for a consular interview." },
  { question: "What happens after USCIS sends my case to NVC?", answer: "NVC creates a case and issues a welcome letter or email with your NVC case number and invoice ID. You then log in to CEAC, pay the required fees, complete the DS-260 for each applicant, and upload civil and financial documents. NVC reviews the package and, when it is complete, marks the case documentarily qualified and places it in line for an interview." },
  { question: "How do I check my NVC case status?", answer: "Log in to the CEAC immigrant visa portal at ceac.state.gov using your NVC case number and invoice ID. CEAC shows which steps are complete, whether documents were accepted, and any items NVC still needs. NRItoUSA is not NVC and cannot look up your case — CEAC is the official place to check." },
  { question: "Is NVC the same as USCIS?", answer: "No. USCIS (Department of Homeland Security) adjudicates the petition. NVC (Department of State) handles the stage after petition approval for consular processing — fees, DS-260, and documents — before the embassy interview. They are separate agencies with separate systems and case numbers." },
  { question: "What is an NVC case number?", answer: "It is the identifier NVC assigns to your case after USCIS forwards the approved petition. It usually starts with a three-letter post code followed by digits. You use it, together with your invoice ID, to log in to CEAC. It is different from your USCIS receipt number." },
  { question: "What is an invoice ID number?", answer: "The invoice ID is a separate number NVC issues alongside your case number. You need both the case number and the invoice ID to log in to CEAC and to pay fees. Keep them private — do not share them publicly." },
  { question: "What does documentarily qualified mean?", answer: "Documentarily qualified (DQ) means NVC has reviewed and accepted your DS-260 and all required documents, so the case is complete and ready for a consular interview. After DQ, the case waits in line for an interview appointment based on embassy availability and, for preference categories, visa number availability." },
  { question: "What happens after NVC accepts my documents?", answer: "Once your documents are accepted and the case is documentarily qualified, NVC works with your embassy or consulate to schedule an interview when an appointment is available. You will receive an interview appointment letter, complete a medical exam, and gather original documents for the interview." },
  { question: "When should I contact NVC?", answer: "Contact NVC through a public inquiry mainly when your case is outside the official NVC timeframes, when there is a specific error, or when CEAC is stuck. Submitting inquiries too early — or submitting duplicates — does not speed things up. Check the official NVC timeframes first." },
  { question: "How long does NVC take?", answer: "There is no single guaranteed number. Case creation after USCIS approval, document review, and the wait from documentarily qualified to interview all vary and change constantly. Treat any range as a rough planning estimate and always verify the official NVC timeframes and your CEAC status." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
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
        title="NVC Case Status & Timeline"
        hook="After USCIS approves your immigrant petition, your case moves to the National Visa Center. See exactly where you are — welcome letter, case number, fees, DS-260, documents, documentarily qualified, interview — and what to do next."
        accent="from-blue-600 to-indigo-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
              Find My NVC Stage →
            </a>
            <a href={nvcLinks.ceac} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
              Check status on CEAC ↗
            </a>
          </div>
        }
        sourceNote={<>Last updated: {NVC_UPDATED_HUMAN}. {NVC_DATA_NOTE}</>}
        disclaimerExtra={<p>This is an educational tool and not legal advice. Always verify with official USCIS, Department of State, CEAC, and embassy/consulate instructions.</p>}
      >
        {/* Quick answer table */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">NVC quick answers</h2>
              <p className="mt-1.5 text-sm text-ink-500">The fast version before you scroll — general guidance only, not case-specific advice.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
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
              <p className="mt-3 text-xs text-ink-500">
                NVC is the Department of State stage for consular processing (interview abroad). If you are adjusting status inside the U.S., see{" "}
                <Link href="/i485-processing-time" className="text-brand-600 underline">I-485 processing time</Link> instead.
              </p>
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

        {/* Tool */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 pb-12 pt-10 sm:pb-16 sm:pt-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">NVC Timeline & Next Step Checker</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Answer a few yes/no questions to see your current NVC stage, your next step, which documents to prepare, and whether you should check the official timeframes or consider a public inquiry.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <NvcTimelineChecker />
            </div>
            <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-ink-700">
              Not sure where you are? Use the checker above, then open the{" "}
              <Link href="/nvc-processing-time" className="font-semibold text-brand-600 underline">NVC processing time</Link> guide to compare against typical ranges.
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

        {/* SEO content */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
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
              <Link href="#calculator" className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
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
