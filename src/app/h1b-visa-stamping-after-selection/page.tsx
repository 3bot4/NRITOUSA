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
    title: "H1B Visa Stamping After Selection: India Guide (2026/2027)",
    description:
      "After your H1B is selected and approved, what about visa stamping in India? The difference between change of status and consular processing, the India stamping steps, 221(g) administrative processing, and travel timing for Indian applicants.",
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
            <p className="text-sm leading-relaxed text-ink-700">
              A common point of confusion: being selected, then approved, does not automatically mean you must rush to
              India for a visa stamp. Whether you need stamping — and when — depends entirely on how your petition was
              filed and whether you plan to travel. Get this right and you avoid an unnecessary, risky trip.
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
                ["Existing valid H-1B stamp from before", "Maybe not", "A still-valid stamp for the same employer may allow re-entry — confirm with your attorney."],
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
