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

const PAGE_PATH = "/h1b-lottery-results-date";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Lottery Results Date 2026/2027: When Are Results Announced?",
    description:
      "When are H1B lottery results announced? The typical registration and selection timeline, when Indian applicants usually hear back, how to tell if results are out, and what happens after each stage.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Results Date", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "When are H1B lottery results usually announced?",
    answer:
      "USCIS typically runs the initial registration selection in March and notifies registrants by the end of March, once the registration window (usually a couple of weeks in March) closes. Exact dates change every year and USCIS confirms them on its website, so treat March as the general window rather than a fixed date. Additional selection rounds, if any, can come later in the year.",
  },
  {
    question: "How do I know if H1B lottery results are out?",
    answer:
      "The most reliable signal is your status changing inside your employer's USCIS organizational account, and your employer or its attorney telling you. USCIS also announces on its website when it has completed the initial selection. Because you can't check a public page for your own name, ask your employer or attorney in writing rather than relying on social-media chatter about exact dates.",
  },
  {
    question: "Why haven't I heard my result even though others have?",
    answer:
      "Employers and law firms notify candidates on different schedules — some email the same day, others take a few days to process large batches. A delay in hearing back doesn't mean anything about your result. If it's been several days after USCIS announced selections, ask your employer/attorney directly for your exact registration status.",
  },
  {
    question: "When does the H1B registration window open?",
    answer:
      "USCIS usually opens the electronic registration window for a limited period in March, during which employers register beneficiaries and pay the registration fee. The exact opening and closing dates are announced by USCIS each year. Registration is a prerequisite to being in the lottery — no registration means no chance of selection.",
  },
  {
    question: "What date does H1B employment start after selection?",
    answer:
      "For cap-subject petitions, the requested start date is normally October 1 of the fiscal year. So the typical cycle is: register in March, learn selection by late March, employer files the petition inside the filing window (spring/summer), and approved beneficiaries begin H-1B employment on or after October 1.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check results, status meaning, and next steps" },
  { href: "/h1b-registration-status-meaning", label: "Registration Status Meaning", desc: "What Submitted / Selected / Not Selected mean" },
  { href: "/h1b-second-lottery", label: "Second Lottery", desc: "Whether later selection rounds may happen" },
  { href: "/h1b-lottery-chances", label: "H1B Lottery Chances", desc: "How selection odds actually work" },
  { href: "/h1b-lottery-selected-next-steps", label: "Selected: Next Steps", desc: "The petition process after selection" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="Results Date"
      h1="H1B Lottery Results Date: When Are Results Announced?"
      readingTime="~7 min read"
      intro={
        <>
          &ldquo;When will results come out?&rdquo; is the most searched H-1B question every spring. The honest answer:
          USCIS runs the initial selection on its own schedule — <strong>typically in March</strong> — and confirms
          exact dates on its website each year. This guide lays out the usual timeline so Indian applicants know what
          to expect and how to tell, reliably, when results are actually out.
        </>
      }
      quickAnswer={{
        question: "Are H1B lottery results out yet?",
        answer: (
          <>
            USCIS usually completes the initial selection <strong>by the end of March</strong> and announces it on its
            website; your employer or attorney then relays your status. This page is maintained for the current cap
            season and reviewed yearly. Since exact dates shift annually, confirm through your employer&rsquo;s USCIS
            account rather than social-media rumors.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Results Date"
      faqs={faqs}
      articleHeadline="H1B Lottery Results Date: When Are Results Announced?"
      articleDescription="The typical H-1B registration and selection timeline, when Indian applicants usually hear back, and how to tell reliably if results are out."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-ink-700">
              The H-1B cap season follows a broadly predictable rhythm each year, even though the precise dates move.
              Knowing the sequence helps you separate real milestones from the anxiety-driven rumors that fill social
              media every March. Below is the typical cycle, followed by how to know — reliably — when your own result
              is available.
            </p>

            <SectionHeading kicker="Timeline" id="timeline">
              The typical H1B cap season timeline
            </SectionHeading>
            <CompareTable
              columns={["Stage", "Typical timing", "What happens"]}
              rows={[
                ["Registration window opens", "Early–mid March", "Employers register beneficiaries in the USCIS organizational account and pay the registration fee."],
                ["Registration window closes", "Mid–late March", "No new registrations accepted after this; the pool is set."],
                ["Initial selection announced", "By late March", "USCIS runs the lottery and marks registrations Selected; it posts a website notice."],
                ["Employer notifies you", "Late March–early April", "HR or the attorney relays your status (Selected / Submitted / Not Selected)."],
                ["Filing window", "Roughly April onward (90+ days)", "Employer files Form I-129 with a certified LCA for selected registrations."],
                ["Possible additional rounds", "Spring–summer or later", "If the cap isn't reached, USCIS may run more selections from the same pool."],
                ["H-1B employment start", "October 1", "Approved cap-subject beneficiaries can begin H-1B employment."],
              ]}
            />
            <Callout tone="warn" title="Dates change every year">
              Treat March as the general window, not a guarantee. USCIS confirms the exact registration and selection
              dates on its website each cap season, and this page is reviewed yearly to match the current cycle.
            </Callout>

            <SectionHeading kicker="How to tell" id="how-to-tell">
              How to know when your result is actually out
            </SectionHeading>
            <ChecklistCard
              title="Reliable signals (in order)"
              items={[
                "Your registration status changes inside your employer's USCIS organizational account.",
                "Your employer or its immigration attorney emails you your exact status.",
                "USCIS posts an official notice on its website that the initial selection is complete.",
                "There is no beneficiary view: organizational accounts have no employee role, and USCIS offers no public name-based result lookup.",
              ]}
            />
            <Callout tone="bad" title="Ignore these 'signals'">
              WhatsApp forwards, Reddit threads claiming exact dates, and &ldquo;my friend heard&rdquo; rumors are not
              reliable. Do not make travel or job decisions based on unconfirmed dates.
            </Callout>

            <SectionHeading kicker="Waiting" id="waiting">
              Haven&rsquo;t heard yet? What it means
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Employers and law firms notify candidates on different schedules — a delay of a few days is normal and
              says nothing about your outcome. If it&rsquo;s been several days since USCIS announced the initial
              selection and you still don&rsquo;t know, ask your employer or attorney in writing: <em>&ldquo;What is my
              exact H-1B registration status for this fiscal year?&rdquo;</em> Remember that a{" "}
              <Link href="/h1b-registration-status-meaning" className="font-semibold text-orange-600 underline">
                &ldquo;Submitted&rdquo; status
              </Link>{" "}
              is not the same as &ldquo;Not Selected&rdquo; — you may still be in the running for a{" "}
              <Link href="/h1b-second-lottery" className="font-semibold text-orange-600 underline">
                later selection round
              </Link>
              .
            </p>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Once you know your result</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Head to{" "}
                <Link href="/h1b-lottery-selected-next-steps" className="font-semibold underline">
                  selected: next steps
                </Link>{" "}
                or{" "}
                <Link href="/h1b-lottery-not-selected-options" className="font-semibold underline">
                  not selected: options
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
