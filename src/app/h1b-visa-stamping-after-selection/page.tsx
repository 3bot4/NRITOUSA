import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { pageMetadata, type FaqItem } from "@/lib/seo";
import {
  H1bLotteryShell,
  SectionHeading,
  Callout,
  ChecklistCard,
  CompareTable,
  LOTTERY_UPDATED,
} from "@/components/H1bLotteryLayout";

const PAGE_PATH = "/h1b-visa-stamping-after-selection";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Visa Stamping After Selection: India Guide (2026/27)",
    description:
      "H1B visa stamping in India: $205 MRV fee, DS-160 to interview, dropbox eligibility, documents checklist, and when you don't need a stamp.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Visa Stamping After Selection", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Do I need H1B visa stamping if I'm already in the U.S.?",
    answer:
      "If your petition was approved as a change of status while you're inside the U.S., you can begin H-1B employment without leaving — you don't need a visa stamp just to work. You only need H-1B visa stamping when you travel internationally and want to re-enter the U.S. in H-1B status. Many people work for months or years on an approved change of status before ever getting stamped.",
  },
  {
    question: "What's the difference between change of status and consular processing?",
    answer:
      "Change of status means USCIS changes your status to H-1B while you remain in the U.S., so you don't need consular stamping to start working. Consular processing (or consular notification) applies when you're abroad or plan to get your visa outside the U.S.: after approval, you attend a visa interview at a U.S. consulate (for Indians, typically in India) to get the H-1B visa stamp before entering.",
  },
  {
    question: "How does H1B visa stamping work in India?",
    answer:
      "You complete the online DS-160, pay the visa fee, book an appointment at a U.S. consulate or embassy in India (such as Mumbai, Delhi, Hyderabad, Chennai, or Kolkata), and attend the interview with your approval notice, passport, and supporting documents. If approved, your passport is returned with the H-1B visa stamp. Availability, wait times, and any dropbox (interview waiver) eligibility vary by location and year.",
  },
  {
    question: "What is 221(g) administrative processing?",
    answer:
      "A 221(g) is a temporary refusal at the visa interview when the consular officer needs more documents or additional review before deciding. It doesn't mean denial, but it can delay your visa for weeks or months. It's more common after a recent job change, for certain consulting/third-party placements, or when documentation is incomplete. Carry thorough, consistent paperwork to reduce the risk.",
  },
  {
    question: "Should I travel to India for stamping right after approval?",
    answer:
      "Only after weighing the risk. If you're already working on an approved change of status, leaving the U.S. means you'll need a valid visa stamp to return, which exposes you to interview wait times and possible 221(g) delays. Don't book non-refundable travel until you've confirmed appointment availability and discussed timing with your employer's immigration attorney.",
  },
  {
    question: "Am I eligible for dropbox for H1B stamping?",
    answer:
      "Generally only if you're renewing a visa in the same class with no prior refusals — under 2025 Department of State guidance the window tightened to roughly 12 months after the prior visa's expiry, and first-time H-1B applicants need an interview. Rules change and consulates apply them individually, so confirm on the official visa appointment portal before booking.",
  },
  {
    question: "What documents are needed for H1B visa stamping in India?",
    answer:
      "The core set: passport valid 6+ months, DS-160 confirmation, appointment letter, MRV fee receipt ($205), one 2x2 photo, the I-797 approval notice, the I-129 petition copy with certified LCA, an employment letter, and 2–3 months of pay stubs. Third-party placements should add a client letter or statement of work. Carry originals plus copies.",
  },
  {
    question: "How much does H1B visa stamping cost?",
    answer:
      "The nonimmigrant visa application (MRV) fee is $205 per applicant — including each H-4 family member — paid before booking the appointment, per the Department of State. Photos, document printing, and travel are extra; there is no separate issuance fee for Indian nationals.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check results, status meaning, and next steps" },
  { href: "/h1b-lottery-selected-next-steps", label: "Selected: Next Steps", desc: "The petition process before stamping" },
  { href: "/h1b", label: "H-1B Guide for Indians", desc: "Transfer, extension, RFE, and travel" },
  { href: "/h1b-lottery-results-for-h4-families", label: "For H-4 Families", desc: "Dependent stamping and family travel" },
  { href: "/india-visa-from-usa", label: "India Visa & Travel", desc: "Travel documents for your India trip" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="Visa Stamping"
      h1="H1B Visa Stamping After Selection: The India Guide"
      readingTime="~9 min read"
      intro={
        <>
          Selection and approval are only part of the journey — for many Indian applicants the next question is{" "}
          <strong>visa stamping</strong>. Whether you need it at all depends on how your petition was filed. This guide
          explains the difference between change of status and consular processing, how stamping works at U.S.
          consulates in India, 221(g) administrative processing, and how to think about travel timing.
        </>
      }
      quickAnswer={{
        question: "Do I need visa stamping after my H1B is approved?",
        answer: (
          <>
            Not necessarily. If your H-1B was approved as a <strong>change of status</strong> inside the U.S., you can
            start working <em>without</em> a stamp — you only need stamping to <strong>re-enter</strong> after
            international travel. If you&rsquo;re abroad or chose consular processing, you&rsquo;ll attend a visa
            interview (for Indians, usually in India) to get the H-1B stamp before entering.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Visa Stamping After Selection"
      faqs={faqs}
      articleHeadline="H1B Visa Stamping After Selection: The India Guide"
      articleDescription="Change of status vs consular processing, H-1B visa stamping steps in India, 221(g) administrative processing, and travel timing after an H-1B selection and approval."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Key takeaways */}
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Key takeaways</p>
              <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
                <li>• Skip the trip if you were approved as a <strong>change of status</strong> — you can work without a stamp and only need one to re-enter after travel.</li>
                <li>• Budget the <strong>$205 DS-160 (MRV) fee</strong> per applicant and complete the DS-160 before booking any appointment, per the Department of State.</li>
                <li>• Check <strong>dropbox (interview waiver)</strong> eligibility before assuming an interview — a prior visa in the same class within the qualifying window can save weeks.</li>
                <li>• Carry the full document set — passport (6+ months validity), I-797, DS-160 confirmation, LCA, pay records — missing paperwork is the top 221(g) trigger.</li>
                <li>• Expect consulate wait times to vary widely by city and season; confirm current slots at Mumbai, Delhi, Hyderabad, Chennai, or Kolkata before booking travel.</li>
              </ul>
            </div>

            <p className="text-sm leading-relaxed text-ink-700">
              H1B visa stamping in the USA context actually happens outside the USA — at a US consulate, for Indian
              applicants usually in India — and it is the step that converts an approved petition into a visa you can
              travel on. This guide is for workers handling H1B visa stamping after lottery selection and petition
              approval: whether you need h1b stamping in India at all, the DS-160-to-interview process step by step,
              h1b dropbox eligibility, the h1b stamping documents checklist, common h1b visa interview questions, and
              221(g) risk. The single most important fact: an approved <strong>change of status</strong> means you can
              start working without any stamp — you only need stamping to re-enter the US after international travel.
              Get this distinction right and you avoid an unnecessary, risky trip.
            </p>

            <SectionHeading kicker="First question" id="need">
              Do you even need stamping?
            </SectionHeading>
            <CompareTable
              columns={["Your situation", "Do you need a stamp?", "Why"]}
              rows={[
                ["Approved as change of status, staying in the U.S.", "Not to work", "You're already in H-1B status; you can begin employment without a stamp."],
                ["Approved as change of status, then travel abroad", "Yes, to re-enter", "You need a valid H-1B visa stamp to be admitted back into the U.S."],
                ["Abroad / consular processing chosen", "Yes", "You must be stamped at a U.S. consulate before entering in H-1B status."],
                ["Existing valid H-1B stamp from before", "Maybe not", "An unexpired H-1B stamp is not limited to the employer named on it. It can generally be used to re-enter to work for a new employer, provided you carry that employer's original approved I-797 approval notice and the visa itself is still valid. The stamp alone is not enough — the approval notice is what evidences the current petition. Confirm with your attorney."],
              ]}
            />
            <Callout tone="info" title="The key distinction">
              <strong>Change of status</strong> = USCIS switches you to H-1B while you&rsquo;re in the U.S. (no stamp
              needed to work). <strong>Consular processing</strong> = you get the visa stamp at a consulate abroad
              before entering. Your petition specifies which one applies to you.
            </Callout>

            <SectionHeading kicker="Steps" id="india-steps">
              How H1B stamping works in India
            </SectionHeading>
            <ChecklistCard
              tone="emerald"
              title="Typical stamping steps"
              items={[
                "Complete the online DS-160 nonimmigrant visa application.",
                "Pay the visa application fee and create your applicant profile.",
                "Book an interview appointment at a U.S. consulate/embassy in India (or check dropbox/interview-waiver eligibility).",
                "Attend the interview with your I-797 approval, passport, DS-160 confirmation, photo, and supporting documents.",
                "If approved, your passport is returned with the H-1B visa stamp; then you can travel and enter.",
              ]}
            />
            <p className="text-xs text-ink-500">
              Consulate locations for Indians commonly include Mumbai, New Delhi, Hyderabad, Chennai, and Kolkata.
              Appointment availability, wait times, and interview-waiver (dropbox) rules vary by location and year —
              always check current requirements before booking.
            </p>

            <SectionHeading kicker="Interview waiver" id="dropbox">
              Who is eligible for the H1B dropbox (interview waiver)?
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              The interview waiver — universally called <strong>dropbox</strong> — lets qualifying applicants submit
              documents without an in-person interview. Eligibility rules are set by the Department of State and
              applied per consulate, and they have changed repeatedly — as of 2025 guidance the window generally
              tightened to renewals in the <strong>same visa class within 12 months</strong> of the prior visa&rsquo;s
              expiry. Treat the table below as the checklist of what officers look at, and confirm the current rules
              on the official appointment portal before assuming dropbox.
            </p>
            <CompareTable
              columns={["Factor", "Typically helps dropbox", "Typically forces an interview"]}
              rows={[
                ["Prior US visa", "Prior visa in the same class (H-1B renewing H-1B)", "First-ever H-1B stamp"],
                ["Time since prior visa expired", "Within the current qualifying window (recently 12 months)", "Expired outside the window"],
                ["Prior refusals / 221(g)", "None", "Any prior refusal usually requires an interview"],
                ["Biometrics on file", "Ten-prints previously captured", "No prior fingerprints"],
                ["Age", "Under 14 or over 79 (separate waiver track)", "—"],
              ]}
            />

            <SectionHeading kicker="Checklist" id="documents">
              H1B stamping documents checklist
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Carry originals plus copies, organized — the officer may ask for none of it, but a 221(g) slip for a
              missing document costs weeks. Employers and attorneys typically prepare the petition set; you assemble
              the personal set.
            </p>
            <CompareTable
              columns={["Category", "Documents"]}
              rows={[
                ["Identity & application", "Passport valid 6+ months with old passports; DS-160 confirmation; appointment letter; MRV fee receipt ($205); one 2x2 photo per specs"],
                ["Petition", "Original/copy of I-797 approval notice; full I-129 petition copy; certified LCA"],
                ["Employment proof", "Offer/employment-verification letter; recent pay stubs (2–3 months); latest W-2 or tax transcript if renewing"],
                ["Third-party placement", "Client letter, statement of work, or vendor letters showing the work location and control"],
                ["Education", "Degree certificates and transcripts; evaluation if the degree is non-US"],
              ]}
            />

            <SectionHeading kicker="Prepare" id="interview-questions">
              Common H1B visa interview questions
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Most interviews last under five minutes and stick to a familiar script: <em>Who is your employer and
              what do they do? What is your role and daily work? What is your salary? Where will you work — client
              site or employer office? What is your highest degree and how does it relate? Have you been to the US
              before, and on what status?</em> Answer briefly and consistently with the DS-160 and petition — the
              officer is checking that the person, the paperwork, and the job line up, not testing technical skill.
              Inconsistent answers about client placement are the most common trigger for extra scrutiny.
            </p>

            <SectionHeading kicker="Risk" id="221g">
              221(g) administrative processing
            </SectionHeading>
            <Callout tone="warn" title="Not a denial — but a delay">
              A <strong>221(g)</strong> is a temporary refusal when the officer needs more documents or extra review.
              It can hold up your visa for weeks or months. It&rsquo;s more common after a recent job change, for
              third-party/consulting placements, or with incomplete paperwork. Carry consistent, thorough documentation
              — client letters, itinerary, pay records, and the full petition packet — to reduce the risk.
            </Callout>

            <SectionHeading kicker="Timing" id="travel">
              Travel timing: don&rsquo;t rush the trip
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              If you&rsquo;re already working on an approved change of status, think carefully before traveling to India
              purely to get stamped. The moment you leave, you need a valid stamp to return — and that exposes you to
              interview wait times and possible 221(g) delays that could keep you out of the U.S. longer than planned.
              Coordinate any trip with your employer and its immigration attorney, and don&rsquo;t book non-refundable
              travel until appointment availability is confirmed. Families traveling together should also plan
              dependent (H-4) stamping — see{" "}
              <Link href="/h1b-lottery-results-for-h4-families" className="font-semibold text-orange-600 underline">
                H-1B lottery results for H-4 families
              </Link>
              .
            </p>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Before you reach stamping</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Make sure the earlier steps are done — see{" "}
                <Link href="/h1b-lottery-selected-next-steps" className="font-semibold underline">
                  selected: next steps
                </Link>
                , or return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
