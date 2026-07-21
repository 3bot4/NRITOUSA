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

const PAGE_PATH = "/h1b-lottery-results-for-f1-opt-students";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Lottery Results for F-1 OPT & STEM OPT Students (2026/2027)",
    description:
      "What H1B lottery results mean for F-1 OPT and STEM OPT students: your OPT end date, STEM OPT eligibility, cap-gap basics, an employer communication checklist, and backup planning if you're not selected.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "For F-1 OPT Students", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What is cap-gap for F-1 OPT students?",
    answer:
      "Cap-gap bridges the gap between when your F-1 status or OPT ends and when H-1B employment can begin. Two different things can be extended, and they are not the same: your F-1 status, and — only if you were in a period of authorized post-completion OPT when the petition was filed — your employment authorization. A student whose OPT had already ended and who was in the 60-day grace period can get the status extension without work authorization. It applies when a timely cap-subject petition requesting a change of status is filed while you are in a valid F-1 period. Under current USCIS rules the extension runs until April 1 of the fiscal year the H-1B is requested for, or the validity start date of the approved petition, whichever comes first — so it is not simply 'up to October 1.'",
  },
  {
    question: "Does cap-gap apply if I'm not selected in the lottery?",
    answer:
      "No. Cap-gap only helps if your registration is selected and your employer files a timely cap-subject petition requesting a change of status while you are in a valid F-1 status or grace period. If you are not selected, there is no cap-gap; you rely on your existing OPT/STEM OPT end date and any other options.",
  },
  {
    question: "Should I apply for STEM OPT before the lottery result?",
    answer:
      "If you're eligible and your standard OPT is ending, it's often wise to plan your STEM OPT extension independently of the lottery. STEM OPT gives you up to 24 more months and more lottery attempts, so it's a strong safety net whether or not you're selected. There are filing deadlines tied to your OPT end date, so speak with your DSO early.",
  },
  {
    question: "What happens to my work authorization if the petition is denied after cap-gap?",
    answer:
      "Cap-gap ends if the petition is denied, rejected, revoked, or withdrawn — in each of those cases the extension of status and any cap-gap work authorization stop, and you do not get to run to April 1. A denial after your original OPT end date means you must stop working immediately. Any remaining time depends on your own circumstances, including whether a grace period applies, and the rules differ between a denial and a withdrawal. Tell your DSO as soon as you hear of any outcome so SEVIS reflects your actual status, and speak to an immigration attorney straight away rather than assuming you have a cushion.",
  },
  {
    question: "Do I get a new I-20 if I'm selected?",
    answer:
      "Yes — if cap-gap applies, you should request an updated cap-gap I-20 from your DSO reflecting the extended status. Keep this with your EAD and other documents. It's your evidence that you remain in valid F-1 status and (if on OPT) authorized to work during the cap-gap period.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check results and what to do next" },
  { href: "/h1b-lottery-selected-next-steps", label: "Selected: Next Steps", desc: "The petition process after selection" },
  { href: "/h1b-lottery-not-selected-options", label: "Not Selected: Options", desc: "STEM OPT, cap-exempt, and more" },
  { href: "/h1b-lottery-chances", label: "H1B Lottery Chances", desc: "Why a U.S. master's and more attempts matter" },
  { href: "/tools/h1b-sponsor-finder", label: "H-1B Sponsor Finder", desc: "Find employers that file H-1B petitions" },
  { href: "/free-immigrant-wealth-guide", label: "Free Immigrant Wealth Guide", desc: "Money basics for new grads on OPT" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="F-1 OPT / STEM OPT"
      h1="H1B Lottery Results for F-1 OPT and STEM OPT Students"
      readingTime="~9 min read"
      intro={
        <>
          If you are an Indian student on F-1 OPT or STEM OPT, the lottery result and your{" "}
          <strong>OPT end date</strong> are tightly linked. Understanding <strong>cap-gap</strong> — the rule that
          bridges you from OPT to an October 1 H-1B start — is the single most important thing to get right. This guide
          covers your OPT end date, STEM OPT eligibility, cap-gap basics, an employer checklist, and backup planning.
        </>
      }
      quickAnswer={{
        question: "I'm on OPT and was selected — will I keep working past my OPT end date?",
        answer: (
          <>
            Generally yes, through <strong>cap-gap</strong> — <em>if</em> your employer files a timely cap-subject
            petition requesting a change of status while you are in valid F-1 status. Cap-gap extends your F-1 status,
            and extends <em>work authorization</em> only if you were in authorized post-completion OPT when the
            petition was filed. It runs until <strong>April 1</strong> of the fiscal year the H-1B is requested for, or
            the approved petition&rsquo;s validity start date, whichever comes first. Confirm your OPT end date and get
            a cap-gap I-20 from your DSO.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="For F-1 OPT Students"
      faqs={faqs}
      articleHeadline="H1B Lottery Results for F-1 OPT and STEM OPT Students"
      articleDescription="What H-1B lottery results mean for F-1 OPT and STEM OPT students: OPT end date, STEM OPT eligibility, cap-gap basics, employer checklist, and backup planning."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-ink-700">
              For most Indian H-1B candidates, the lottery happens while they are working on F-1 OPT or STEM OPT. That
              makes the result a timing question as much as an immigration question: <em>will my work authorization
              carry me to an October 1 H-1B start, or do I have a gap to manage?</em> The answer hinges on your OPT end
              date, whether you were selected, and whether cap-gap applies. Get these three things straight and you can
              plan calmly.
            </p>

            <SectionHeading kicker="Step 1" id="opt-end">Know your OPT end date</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Everything revolves around the end date printed on your EAD card. Write it down. Your cap-gap coverage,
              your STEM OPT filing deadline, and your backup timing all key off this single date. If your OPT ends after
              October 1, timing is easy. If it ends before October 1 — common for spring and summer graduates — cap-gap
              (if you&rsquo;re selected) is what bridges you.
            </p>

            <SectionHeading kicker="Step 2" id="stem">Check STEM OPT eligibility</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              If you hold a qualifying STEM degree and work for an E-Verify employer, the{" "}
              <strong>24-month STEM OPT extension</strong> can add up to two years to your work authorization — and,
              crucially, gives you additional attempts at the lottery. Many Indian students treat STEM OPT as their
              primary safety net: it de-risks a non-selection and buys time for the market and your employer to line up.
              There are deadlines tied to your OPT end date, so start with your DSO early.
            </p>

            <SectionHeading kicker="Step 3" id="capgap">Understand cap-gap basics</SectionHeading>
            <Callout tone="info" title="What cap-gap does">
              When a cap-subject H-1B petition requesting an October 1 start is timely filed while you are in a valid
              F-1 period, cap-gap automatically extends your F-1 status — and your OPT work authorization if you had it —
              from your OPT end date up to the H-1B start date (or until the petition is decided). It is what keeps
              selected students in status and working through the summer.
            </Callout>
            <CompareTable
              columns={["Scenario", "What cap-gap does"]}
              rows={[
                ["Selected + timely petition, OPT ends before Oct 1", "Extends F-1 status and work authorization to the H-1B start date (if petition stays pending/approved)."],
                ["Selected but petition filed as change of status is denied", "Cap-gap authorization generally ends; fall back to your OPT end date and other options."],
                ["Not selected", "No cap-gap — you rely on your existing OPT/STEM OPT end date and backup plans."],
                ["Selected but consular processing (not change of status)", "Cap-gap work rules differ — confirm details with your DSO and attorney."],
              ]}
            />

            <SectionHeading kicker="Step 4" id="employer">Employer communication checklist</SectionHeading>
            <ChecklistCard
              tone="emerald"
              title="Ask your employer and DSO"
              items={[
                "Confirm the employer will file the cap-subject petition on time with an October 1 start.",
                "Ask whether they'll request premium processing if your timing is tight.",
                "Request a cap-gap I-20 from your DSO once the petition is filed.",
                "Keep your I-20, EAD, I-94, and passport current and copied.",
                "Tell your DSO your plans and keep your SEVIS record updated (address, employer).",
              ]}
            />

            <SectionHeading kicker="Step 5" id="backup">Backup planning</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Even with a strong employer, plan for a non-selection so you&rsquo;re never caught flat-footed. The
              cleanest backups for students are STEM OPT (if you haven&rsquo;t used it), a cap-exempt employer, or
              enrolling in a further degree program to maintain status while re-entering the lottery. Avoid day-1 CPT
              &ldquo;universities&rdquo; used only to keep working — they draw serious scrutiny. See the full list in{" "}
              <Link href="/h1b-lottery-not-selected-options" className="font-semibold text-orange-600 underline">
                not selected: options
              </Link>
              .
            </p>
            <Callout tone="tip" title="Money note for new grads">
              Early-career OPT students often carry education loans and thin savings. Build even a small emergency fund,
              keep continuous health insurance, and if you have Indian accounts, remember FBAR/FATCA can still apply once
              you&rsquo;re a US tax resident. The{" "}
              <Link href="/free-immigrant-wealth-guide" className="font-semibold underline">
                Free Immigrant Wealth Guide
              </Link>{" "}
              is a good starting point.
            </Callout>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Back to the hub</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>{" "}
                for status meanings, second-lottery odds, and next steps.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
