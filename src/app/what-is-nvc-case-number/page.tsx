import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
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
  nvcArticleJsonLd,
  NVC_PUBLISHED,
  NVC_UPDATED,
  NVC_UPDATED_HUMAN,
} from "@/lib/nvcCluster";
import { nvcLinks, NVC_DATA_NOTE, nvcFeeRows, nvcFees as F } from "@/data/nvcData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const PATH = "/what-is-nvc-case-number";
const TITLE = "What Is an NVC Case Number? Format, Example & Where to Find It";
const DESC =
  "An NVC case number is assigned after USCIS sends your approved petition to the National Visa Center. Learn its format, see an example, and find where to locate it for CEAC.";

export const metadata: Metadata = pageMetadata({
  title: "What Is an NVC Case Number?",
  description: DESC,
  path: PATH,
});

const COMPARE: { field: string; nvc: string; uscis: string }[] = [
  { field: "Issued by", nvc: "National Visa Center (Dept. of State)", uscis: "USCIS (Dept. of Homeland Security)" },
  { field: "When", nvc: "After petition approval, for consular processing", uscis: "When your petition is first receipted" },
  { field: "Looks like", nvc: "3-letter post code + digits (e.g. a New Delhi post prefix)", uscis: "3-letter service center code + 10 digits" },
  { field: "Used for", nvc: "Logging in to CEAC, fees, DS-260", uscis: "Tracking the petition on the USCIS case status site" },
];

const faq: FaqItem[] = [
  { question: "What is an NVC case number?", answer: "An NVC case number is the identifier the National Visa Center assigns to your immigrant visa case after USCIS approves your petition and forwards it to NVC for consular processing. It usually begins with a three-letter code for the embassy or consulate (the 'post') followed by digits. You use it, together with your invoice ID, to log in to the CEAC immigrant visa portal." },
  { question: "Where do I find my NVC case number?", answer: "It appears on your NVC welcome letter or welcome email — the notice NVC sends after creating your case. If you have already logged in to CEAC, it is shown on your case summary. If you used an attorney, they typically receive the welcome notice and can share the number. Keep it private." },
  { question: "Is my USCIS receipt number the same as my NVC case number?", answer: "No. They are different numbers from different agencies. The USCIS receipt number (three letters plus ten digits, e.g. starting with a service center code) tracks your petition at USCIS. The NVC case number is issued later by the Department of State for consular processing. You cannot use one in place of the other." },
  { question: "What is the NVC invoice ID?", answer: "The invoice ID is a separate number NVC issues along with your case number. You need both the case number and the invoice ID to log in to CEAC and to pay the required fees. If you have the case number but not the invoice ID, check your welcome notice or contact NVC." },
  { question: "Do I need my NVC case number for CEAC?", answer: "Yes. To access the CEAC immigrant visa portal you enter your NVC case number and your invoice ID. Without both, you cannot pay fees, complete the DS-260, or upload documents. If you have lost them, they are on your welcome notice, or you can request them through an NVC public inquiry." },
  { question: "Can I check NVC status without a case number?", answer: "Generally no. CEAC requires your NVC case number and invoice ID to show your case. If you do not yet have them, your case may not have been created at NVC yet — USCIS may still be forwarding it. If enough time has passed, you can submit an NVC public inquiry to ask about your case." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: NVC_PUBLISHED, dateModified: NVC_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "What Is an NVC Case Number", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="what-is-nvc-case-number"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "What Is an NVC Case Number" },
        ]}
        icon="🔢"
        category="Visa & Green Card"
        title="What Is an NVC Case Number?"
        hook="Your NVC case number is assigned after USCIS sends your approved petition to the National Visa Center. Here's its format, an example of where it comes from, and how it differs from your USCIS receipt number."
        accent="from-blue-600 to-indigo-600"
        badges={["Format & example", "Where to find it", "No personal data"]}
        headerExtra={
          <Link href="/nvc-case-status" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
            Check your NVC case status →
          </Link>
        }
        sourceNote={<>Last updated: {NVC_UPDATED_HUMAN}. {NVC_DATA_NOTE}</>}
        disclaimerExtra={<p>This is an educational tool and not legal advice. Always verify with official USCIS, Department of State, CEAC, and embassy/consulate instructions.</p>}
      >
        {/* Fast Answer: NVC fees */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="NVC fees & timing"
              accent="sky"
              rows={nvcFeeRows}
              badges={["AOS $120", "IV $325 / $345"]}
              lastVerified={F.lastVerified}
              sources={[{ label: "NVC Fees", href: nvcLinks.fees }, { label: "NVC Timeframes", href: nvcLinks.nvcTimeframes }, { label: "CEAC", href: nvcLinks.ceac }]}
              disclaimer={NVC_DATA_NOTE}
            />
          </Container>
        </section>

        {/* Quick answer */}
        <section className="pt-10">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick answer</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                An <strong>NVC case number</strong> is the identifier the National Visa Center assigns to your immigrant visa case after USCIS approves your petition and forwards it for consular processing. It typically starts with a <strong>three-letter code for your embassy/consulate ("post")</strong> followed by digits. You use it — with your <strong>invoice ID</strong> — to log in to CEAC, pay fees, and complete the DS-260. It is <strong>not</strong> the same as your USCIS receipt number.
              </p>
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <p className="text-xs leading-relaxed text-ink-700">
                  <span className="font-bold text-ink-900">Privacy note:</span> keep your case number and invoice ID private. No legitimate tool needs your full case number, invoice ID, passport number, or date of birth to help you.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* NVC vs USCIS number table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">NVC case number vs. USCIS receipt number</h2>
              <p className="mt-1.5 text-sm text-ink-500">Two different numbers from two different agencies — a common point of confusion.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold"> </th>
                      <th className="p-3 font-semibold">NVC case number</th>
                      <th className="p-3 font-semibold">USCIS receipt number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {COMPARE.map((r) => (
                      <tr key={r.field} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.field}</td>
                        <td className="p-3 text-ink-600">{r.nvc}</td>
                        <td className="p-3 text-ink-600">{r.uscis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* SEO content */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-bold text-ink-900">The format of an NVC case number</h2>
                <p className="mt-2">
                  An NVC case number is built from a <strong>three-letter post code</strong> — the abbreviation for the U.S. embassy or consulate that will handle your interview — followed by a string of numbers that encodes the year and a sequence. For applicants interviewing in India, the post code corresponds to the consular post assigned to the case. You do not need to decode it; what matters is that you enter it exactly as shown on your welcome notice when you log in to CEAC.
                </p>
                <p className="mt-2">
                  Because the format looks similar to other government identifiers, families often mix it up with the USCIS receipt number or the DS-260 confirmation number. They are all different. The safest habit is to label each number clearly when you write it down (privately) and only ever enter it on the official CEAC site.
                </p>
                <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Example (fictional — for format illustration only)</p>
                  <p className="mt-2 font-mono text-sm text-ink-800">NVC Case Number: <strong>BEO2026123456</strong></p>
                  <p className="mt-1 font-mono text-sm text-ink-800">Invoice ID: <strong>AON2026098765</strong></p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-600">
                    These are made-up values, not a real case. The pattern is illustrative: a three-letter post code, then a string of digits. Your real case number and invoice ID are on your own NVC welcome notice — never on a third-party site.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Where to find your NVC case number</h2>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex gap-2"><span className="text-blue-500">→</span> On your <strong>NVC welcome letter or welcome email</strong>, sent after NVC creates your case.</li>
                  <li className="flex gap-2"><span className="text-blue-500">→</span> On your <strong>CEAC case summary</strong>, once you have logged in.</li>
                  <li className="flex gap-2"><span className="text-blue-500">→</span> From your <strong>attorney or petitioner</strong>, if they received the welcome notice on your behalf.</li>
                </ul>
                <p className="mt-2">
                  If you never received a welcome notice and enough time has passed since your petition was approved, your case may still be in transit from USCIS to NVC — or the notice may have gone to a different address or email. In that situation, an{" "}
                  <Link href="/nvc-public-inquiry" className="text-brand-600 underline">NVC public inquiry</Link> is the right way to ask for your case number and invoice ID.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Case number, invoice ID, and DS-260 confirmation — how they fit together</h2>
                <p className="mt-2">
                  Three identifiers show up during NVC processing. The <strong>case number</strong> and <strong>invoice ID</strong> are issued by NVC and are what you use to log in to CEAC and pay fees. The <strong>DS-260 confirmation number</strong> is generated when each applicant submits the online immigrant visa application. You keep all three, but only the case number and invoice ID unlock your CEAC account. If you have one but not the other, check your welcome notice or contact NVC.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">What to do once you have your case number</h2>
                <p className="mt-2">
                  With your case number and invoice ID in hand, log in to CEAC and work through the steps: pay the fees, complete the DS-260, and upload civil and financial documents. To see exactly which stage you are in and what comes next, use the{" "}
                  <Link href="/nvc-case-status" className="text-brand-600 underline">NVC case status</Link> checker. To plan how long each step may take, see{" "}
                  <Link href="/nvc-processing-time" className="text-brand-600 underline">NVC processing time</Link>.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-sm text-ink-700 shadow-card">
              Have your case number? Use the{" "}
              <Link href="/nvc-case-status" className="font-semibold text-brand-600 underline">NVC Timeline Checker</Link> to find your stage and next step.
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-8">
          <Container>
            <div className="mx-auto max-w-3xl flex flex-wrap gap-2">
              <a href={nvcLinks.ceac} target="_blank" rel="nofollow noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-semibold text-brand-600 transition hover:border-brand-300">CEAC Immigrant Visa Login ↗</a>
              <a href={nvcLinks.nvcHome} target="_blank" rel="nofollow noopener noreferrer" className="rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-semibold text-brand-600 transition hover:border-brand-300">Department of State — NVC ↗</a>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="More NVC guides" links={[...nvcClusterLinks.filter((l) => l.href !== PATH), ...nvcRelatedLinks]} />
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
