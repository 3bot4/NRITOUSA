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

const PATH = "/nvc-public-inquiry";
const TITLE = "NVC Public Inquiry: When and How to Contact NVC";
const DESC =
  "When to submit an NVC public inquiry, how to contact the National Visa Center, what to include, and why duplicate inquiries hurt. Educational guidance, not legal advice.";

export const metadata: Metadata = pageMetadata({
  title: "NVC Public Inquiry",
  description: DESC,
  path: PATH,
});

const WHEN: { do: string; wait: string }[] = [
  { do: "Your case is past the official NVC timeframe with no update", wait: "Before you are outside the published timeframe" },
  { do: "There is a clear error in your case data or documents", wait: "For a normal document review still in progress" },
  { do: "A CEAC fee payment is stuck or won't post", wait: "Right after paying (allow a business day or two to clear)" },
  { do: "You never received a case number long after approval", wait: "In the first few weeks after USCIS approval" },
  { do: "You need to report urgent info (medical, expedite basis)", wait: "To ask 'any update?' with no specific issue" },
];

const faq: FaqItem[] = [
  { question: "When should I submit an NVC public inquiry?", answer: "Submit an inquiry when your case is genuinely outside the official NVC timeframes, when there is a clear error, when a CEAC payment is stuck, or when you never received a case number long after USCIS approval. Check the official NVC timeframes first — inquiring before you are outside them rarely helps and adds to the queue." },
  { question: "How do I contact NVC?", answer: "Use the official NVC contact channels on the Department of State website — primarily the online public inquiry form, and the published phone number for urgent matters. Provide your NVC case number and invoice ID so they can locate your case. NRItoUSA is not NVC and cannot contact them on your behalf; always use the official channel." },
  { question: "What should I include in an NVC inquiry?", answer: "Include your NVC case number, the principal applicant's name and date of birth as on the case, a short, specific description of the issue, and any relevant dates (approval date, submission date). Be concise and factual. Attach or reference only what is asked. A clear, specific inquiry gets a more useful response than a vague 'any update?'." },
  { question: "Should I submit duplicate NVC inquiries?", answer: "No. Sending duplicate or repeated inquiries does not speed up your case and can slow the queue for everyone, including you. Submit one clear inquiry and allow the stated response time before following up. If you must follow up, reference your earlier inquiry rather than starting over." },
  { question: "What should I do if CEAC payment is stuck?", answer: "First allow a business day or two — fee payments can take time to post in CEAC. Confirm the payment cleared with your bank. If it is genuinely stuck after that, submit an NVC public inquiry describing the payment issue with your case number and invoice ID. Do not attempt the same payment repeatedly, which can cause duplicate charges." },
  { question: "How long does NVC take to respond to inquiries?", answer: "Response times vary with NVC's workload and are not guaranteed. The Department of State publishes expected response windows alongside the inquiry channels. Submit once, wait the stated period, and only then follow up. Urgent matters (like a documented medical emergency) may have a separate expedite path." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: NVC_PUBLISHED, dateModified: NVC_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "NVC Public Inquiry", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="nvc-public-inquiry"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "NVC Public Inquiry" },
        ]}
        icon="✉️"
        category="Visa & Green Card"
        title="NVC Public Inquiry"
        hook="When your NVC case is genuinely stuck, a public inquiry is how you reach the National Visa Center. Here's when it's worth doing, what to include, and why duplicate inquiries backfire."
        accent="from-rose-600 to-orange-600"
        badges={["When to inquire", "What to include", "Avoid duplicates"]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link href="/nvc-case-status" className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700">
              Check my NVC stage first →
            </Link>
            <a href={nvcLinks.publicInquiry} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50">
              Official NVC Public Inquiry ↗
            </a>
          </div>
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
            <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick answer</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Submit an <strong>NVC public inquiry</strong> mainly when your case is <strong>outside the official NVC timeframes</strong>, when there is a clear error, when a CEAC payment is stuck, or when you never got a case number long after approval. Check the{" "}
                <a href={nvcLinks.nvcTimeframes} target="_blank" rel="noopener noreferrer" className="font-semibold underline">official timeframes</a> first — inquiring too early, or sending duplicates, does not help and adds to the queue.
              </p>
            </div>
          </Container>
        </section>

        {/* When to inquire table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">When to inquire — and when to wait</h2>
              <p className="mt-1.5 text-sm text-ink-500">General guidance only. Always compare against the official NVC timeframes for your case.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">✅ Reasonable to inquire</th>
                      <th className="p-3 font-semibold">⏳ Better to wait</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {WHEN.map((r) => (
                      <tr key={r.do} className="align-top">
                        <td className="p-3 text-ink-700">{r.do}</td>
                        <td className="p-3 text-ink-600">{r.wait}</td>
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
                <h2 className="text-xl font-bold text-ink-900">How to contact NVC</h2>
                <p className="mt-2">
                  The National Visa Center's primary contact method is the <strong>online public inquiry form</strong> on the Department of State website, with a published phone line for urgent matters. Always use the official channel and have your{" "}
                  <Link href="/what-is-nvc-case-number" className="text-brand-600 underline">NVC case number</Link> and invoice ID ready so NVC can find your case. NRItoUSA is not affiliated with NVC and cannot contact them for you — this page is educational guidance only.
                </p>
                <div className="mt-3">
                  <a href={nvcLinks.publicInquiry} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700">
                    Open the official NVC public inquiry page ↗
                  </a>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">What to include in your inquiry</h2>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex gap-2"><span className="text-rose-500">→</span> Your <strong>NVC case number</strong> and <strong>invoice ID</strong>.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> The <strong>principal applicant's name and date of birth</strong> exactly as on the case.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> A <strong>short, specific description</strong> of the issue — not just "any update?".</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> <strong>Relevant dates</strong> — USCIS approval date, document submission date, or when the problem started.</li>
                </ul>
                <p className="mt-2">
                  A concise, factual inquiry that names a specific problem gets a more useful reply than a vague status request. Keep a copy of what you submitted and the date.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Step-by-step: how to submit an inquiry</h2>
                <ol className="mt-2 space-y-2">
                  <li className="flex gap-2"><span className="font-bold text-rose-600">1.</span> Open the official NVC Public Inquiry Form on the Department of State website (link above) — never a third-party site.</li>
                  <li className="flex gap-2"><span className="font-bold text-rose-600">2.</span> Select the inquiry category that matches your issue (for example, case status, document submission, or fee payment) so it routes to the right queue.</li>
                  <li className="flex gap-2"><span className="font-bold text-rose-600">3.</span> Enter the petitioner&apos;s full name, the applicant&apos;s date of birth, and the email address associated with your case — these confirm your identity to NVC.</li>
                  <li className="flex gap-2"><span className="font-bold text-rose-600">4.</span> Write a short, specific description of the issue, with your case number, invoice ID, and relevant dates.</li>
                  <li className="flex gap-2"><span className="font-bold text-rose-600">5.</span> Submit the form and save any confirmation you receive.</li>
                  <li className="flex gap-2"><span className="font-bold text-rose-600">6.</span> Wait for a reply by email — NVC states that inquiries are reviewed and answered in the order received, so a second inquiry does not move you up the queue.</li>
                </ol>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Why duplicate inquiries backfire</h2>
                <p className="mt-2">
                  It is tempting to send several inquiries hoping for a faster answer. It has the opposite effect: duplicates add to the same queue an officer must work through, slowing responses for everyone — including you. Submit <strong>one</strong> clear inquiry, wait the stated response window, and only follow up by referencing your earlier inquiry rather than starting fresh.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">If a CEAC payment is stuck</h2>
                <p className="mt-2">
                  Payments can take a business day or two to post in CEAC, so wait before assuming a problem, and confirm with your bank that the charge went through. Do not repeat the same payment — that risks duplicate charges. If it is genuinely stuck after a couple of days, submit a public inquiry describing the payment issue with your case number and invoice ID.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Before you inquire: confirm you're actually delayed</h2>
                <p className="mt-2">
                  Most "delays" turn out to be normal processing. Use the{" "}
                  <Link href="/nvc-case-status" className="text-brand-600 underline">NVC case status checker</Link> to confirm your stage, compare against{" "}
                  <Link href="/nvc-processing-time" className="text-brand-600 underline">NVC processing time</Link> ranges and the official timeframes, and check CEAC for any item NVC is waiting on from you. If you are truly past the timeframe with nothing pending on your side, that is when an inquiry makes sense.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Common mistakes to avoid</h2>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex gap-2"><span className="text-rose-500">→</span> Inquiring before you're actually outside the published timeframe.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> Sending several inquiries hoping one gets a faster reply — it doesn't, and it adds to the queue.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> Writing a vague "any update?" instead of naming the specific issue, case number, and invoice ID.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> Repeating a stuck CEAC payment instead of waiting a day or two and confirming with your bank first.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> Using a third-party or paid "expediting" site instead of the free, official NVC form.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">If you're still stuck: escalation options</h2>
                <p className="mt-2">
                  If you've submitted one clear inquiry, waited the stated response window, and your case is still genuinely outside the official timeframe with no explanation, a few further options exist:
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex gap-2"><span className="text-rose-500">→</span> <strong>Follow up on your existing inquiry</strong> by referencing it directly rather than filing a new one from scratch.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> <strong>Contact your U.S. Senator or Representative's office</strong> for constituent/congressional casework assistance. Most congressional offices have a caseworker who can request a status update from the Department of State on your behalf, once you sign a privacy waiver. This does not guarantee a faster outcome, and it generally cannot move up an interview date once your case is scheduled at the embassy — interview slots are set by embassy capacity, not by NVC.</li>
                  <li className="flex gap-2"><span className="text-rose-500">→</span> <strong>Ask your immigration attorney</strong> to inquire on your behalf if you are represented — they may have a more direct channel for case-specific issues.</li>
                </ul>
                <p className="mt-2 text-xs text-ink-500">
                  This is general information, not a guarantee any of these options will speed up your case — NRItoUSA is not affiliated with NVC, the Department of State, or any member of Congress.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
              <Link href="/nvc-case-status" className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Not sure where you are?</p>
                <p className="mt-1 text-xs text-ink-600">Use the NVC Timeline Checker →</p>
              </Link>
              <Link href="/nvc-processing-time" className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Comparing to normal ranges?</p>
                <p className="mt-1 text-xs text-ink-600">See NVC processing time →</p>
              </Link>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
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
