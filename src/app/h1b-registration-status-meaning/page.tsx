import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { pageMetadata, type FaqItem } from "@/lib/seo";
import {
  H1bLotteryShell,
  SectionHeading,
  Callout,
  CompareTable,
  ChecklistCard,
  LOTTERY_UPDATED,
} from "@/components/H1bLotteryLayout";

const PAGE_PATH = "/h1b-registration-status-meaning";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Registration Status Meaning: Submitted, Selected, Not Selected & More",
    description:
      "What each H1B registration status means in plain language: Submitted, Selected, Not Selected, Denied, and Invalidated-Failed Payment — and exactly what Indian applicants should do for each.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Registration Status Meaning", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What does \"Submitted\" mean in the H1B registration system?",
    answer:
      "\"Submitted\" means your registration was successfully entered and the registration fee was paid, and it is sitting in the pool. It has not been selected. Importantly, if a selection round runs and your registration is not chosen, it stays \"Submitted\" (rather than flipping to \"Not Selected\") because it remains eligible for any additional selection round in the same fiscal year.",
  },
  {
    question: "What does \"Selected\" mean?",
    answer:
      "\"Selected\" means your registration was chosen in the lottery and your employer is now eligible to file a full cap-subject H-1B petition (Form I-129) for you during the filing window. It is permission to file — not an approval, not a visa, and not a guarantee.",
  },
  {
    question: "What does \"Not Selected\" mean?",
    answer:
      "\"Not Selected\" means your registration was not chosen after all selection rounds for that fiscal year are complete. No cap-subject H-1B petition can be filed for you that year. You keep your current status and can be re-registered next cycle.",
  },
  {
    question: "What does \"Denied\" mean on an H1B registration?",
    answer:
      "\"Denied\" generally means a duplicate registration was found — the same employer submitted more than one registration for the same beneficiary in the same fiscal year, which is not allowed. Only one registration per person per employer is valid. It does not usually mean anything about your qualifications.",
  },
  {
    question: "What does \"Invalidated-Failed Payment\" mean?",
    answer:
      "It means the registration fee payment did not go through (for example, a failed or disputed transaction), so USCIS invalidated the registration. An invalidated registration is not eligible for selection. If you see this, your employer or attorney needs to review how the registration and payment were handled.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check results and what to do next" },
  { href: "/h1b-lottery-selected-next-steps", label: "Selected: Next Steps", desc: "What to do once your status is Selected" },
  { href: "/h1b-second-lottery", label: "Second Lottery", desc: "Why Submitted keeps you in the running" },
  { href: "/h1b-lottery-not-selected-options", label: "Not Selected: Options", desc: "Your realistic backup paths" },
  { href: "/h1b-lottery-multiple-registrations", label: "Multiple Registrations", desc: "Why Denied usually means a duplicate" },
  { href: "/h1b", label: "H-1B Guide for Indians", desc: "The wider H-1B process" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="Registration Status"
      h1="H1B Registration Status Meaning, Explained Simply"
      readingTime="~7 min read"
      intro={
        <>
          When your employer checks the USCIS registration system, your entry shows one of a handful of statuses. The
          words are short, but the difference between them is huge — and easy to misread. This guide explains each one
          in <strong>plain language</strong> and tells you exactly what to do for each, written for Indian applicants.
        </>
      }
      quickAnswer={{
        question: "What are the H1B registration statuses?",
        answer: (
          <>
            The main ones are <strong>Submitted</strong>, <strong>Selected</strong>,{" "}
            <strong>Not Selected</strong>, <strong>Denied</strong>, and{" "}
            <strong>Invalidated&nbsp;&ndash;&nbsp;Failed Payment</strong>. The one people most often misread is{" "}
            <em>Submitted</em>: it is <strong>not</strong> the same as Not Selected — a Submitted registration is still
            in the pool and can be picked in a later round the same year.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Registration Status Meaning"
      faqs={faqs}
      articleHeadline="H1B Registration Status Meaning: Submitted, Selected, Not Selected & More"
      articleDescription="Plain-language meaning of every H-1B registration status — Submitted, Selected, Not Selected, Denied, Invalidated-Failed Payment — and what to do for each."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-ink-700">
              The H-1B lottery runs through USCIS electronic registration. Your employer (or its attorney) registers you
              inside a USCIS organizational account, and after selection each registration shows a status. Because you
              usually see this status second-hand — relayed by HR or the attorney — it helps to know precisely what each
              term means so you can ask the right follow-up questions. Here is the full list, from most hopeful to most
              problematic.
            </p>

            <div>
              <p className="mb-2 text-sm font-bold text-ink-900">Every status at a glance</p>
              <CompareTable
                columns={["Status", "Plain meaning", "What to do"]}
                rows={[
                  ["Submitted", "Accepted and paid; in the pool, not yet chosen.", "Wait and stay in valid status. Still eligible for later rounds this year."],
                  ["Selected", "Chosen; employer may now file the petition.", "Confirm your employer is filing; gather documents; plan the LCA + I-129."],
                  ["Not Selected", "Not chosen after all rounds for the year.", "Switch to backup options; re-register next cycle."],
                  ["Denied", "Duplicate registration by the same employer.", "Ask the employer/attorney to correct duplicates; only one counts."],
                  ["Invalidated – Failed Payment", "Fee didn't clear; registration voided.", "Not eligible for selection; employer must review payment handling."],
                ]}
              />
            </div>

            <SectionHeading kicker="1" id="submitted">Submitted</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Your registration is valid and paid, and it is waiting in the pool. This is the status every eligible
              registration starts with. The crucial point: if a selection round runs and does not pick you, your status
              stays <strong>Submitted</strong> — not Not Selected — because you remain eligible for any additional round
              in the same fiscal year. So &ldquo;Submitted&rdquo; is genuinely good news relative to &ldquo;Not
              Selected.&rdquo; See the{" "}
              <Link href="/h1b-second-lottery" className="font-semibold text-orange-600 underline">
                second-lottery guide
              </Link>{" "}
              for why this matters.
            </p>

            <SectionHeading kicker="2" id="selected">Selected</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              You were chosen. Your employer may now file a full cap-subject H-1B petition (Form I-129) for you during
              the filing window. This is the milestone everyone is waiting for — but remember it is{" "}
              <strong>permission to file, not an approval</strong>. USCIS still reviews the petition and can approve it,
              issue an RFE, or deny it. Move to the{" "}
              <Link href="/h1b-lottery-selected-next-steps" className="font-semibold text-orange-600 underline">
                selected next-steps checklist
              </Link>
              .
            </p>

            <SectionHeading kicker="3" id="not-selected">Not Selected</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Your registration was not chosen after all selection rounds for the fiscal year. No cap-subject petition
              can be filed for you this year. This is common and is not a judgment of you or your employer. You keep your
              current status and have real options — see{" "}
              <Link href="/h1b-lottery-not-selected-options" className="font-semibold text-orange-600 underline">
                not selected: options
              </Link>
              .
            </p>

            <SectionHeading kicker="4" id="denied">Denied</SectionHeading>
            <Callout tone="warn" title="Usually a duplicate-registration issue">
              &ldquo;Denied&rdquo; typically appears when the <strong>same employer</strong> submitted more than one
              registration for the same person in the same year, which the rules prohibit. Only one registration per
              beneficiary per employer is valid. If you see this, ask the employer/attorney to explain how registrations
              were submitted. Note: multiple <em>different</em> employers each registering you is allowed — the
              beneficiary-centric selection still gives you a single entry.
            </Callout>

            <SectionHeading kicker="5" id="invalidated">Invalidated &ndash; Failed Payment</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              This means the registration fee payment failed, so USCIS invalidated the registration. An invalidated
              registration cannot be selected. It is an administrative/payment problem, not a comment on your
              eligibility — but it does mean you are out for that cycle unless it is resolved appropriately. The employer
              or attorney should review exactly what happened with the payment and registration.
            </p>

            <ChecklistCard
              title="Before you panic about a status, confirm these"
              items={[
                "Which fiscal year the status refers to (make sure it's the current cap season).",
                "That your employer is reading your specific registration, not another candidate's.",
                "Whether any later selection round is still possible (if status is Submitted).",
                "For Denied/Invalidated, exactly how registrations and payment were handled.",
              ]}
            />

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Back to the hub</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>{" "}
                for how to check results, next steps, and the NRI money checklist.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
