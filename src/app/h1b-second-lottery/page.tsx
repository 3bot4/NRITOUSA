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

const PAGE_PATH = "/h1b-second-lottery";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Will There Be a Second H1B Lottery? (2026/2027 Explained)",
    description:
      "Will USCIS run a second H1B lottery this year? How additional selection rounds work, why they happen, whether you need to re-register, and what Indian applicants should watch for while a second round remains possible.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Second Lottery", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Will there be a second H1B lottery this year?",
    answer:
      "Maybe. USCIS can run additional selection rounds if it does not receive enough petitions from earlier rounds to reach the annual cap. It has done this in several past years, but it is never guaranteed and is not announced in advance. Watch official USCIS updates and your employer/attorney communication rather than relying on rumors.",
  },
  {
    question: "Do I need to register again for a second H1B lottery?",
    answer:
      "No. Additional selection rounds pull from the same pool of registrations that were already submitted for that fiscal year. If your registration status is still \"Submitted,\" it remains eligible for a later round automatically — you and your employer do not submit a new registration.",
  },
  {
    question: "Why does USCIS run a second lottery?",
    answer:
      "The lottery selects more registrations than the cap because not every selected registration turns into a filed petition — some employers don't file, some withdraw, and some petitions are denied. If the number of actual petitions falls short of the 85,000-visa cap, USCIS runs another selection round from the remaining pool to use the full allocation.",
  },
  {
    question: "My status says \"Submitted,\" not \"Not Selected.\" What does that mean?",
    answer:
      "A \"Submitted\" status means your registration is still in the pool and was not chosen in the round(s) run so far — but it stays eligible for any additional selection round in the same fiscal year. It only becomes effectively final for the year once USCIS closes the door on further selections.",
  },
  {
    question: "How will I find out if I'm selected in a later round?",
    answer:
      "The same way as the first round: your status changes to \"Selected\" inside the employer's USCIS organizational account, and your employer or its immigration attorney informs you. USCIS also posts an official update on its website when it runs an additional round.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check status, meaning, and next steps" },
  { href: "/h1b-registration-status-meaning", label: "Registration Status Meaning", desc: "Why Submitted is not the same as Not Selected" },
  { href: "/h1b-lottery-not-selected-options", label: "Not Selected: Options", desc: "Backup plans if no second round selects you" },
  { href: "/h1b-lottery-results-date", label: "Results Date & Timeline", desc: "When first and later rounds are announced" },
  { href: "/h1b-lottery-chances", label: "H1B Lottery Chances", desc: "How selection odds work across rounds" },
  { href: "/nri-wealth-checkup", label: "NRI Wealth Checkup", desc: "Keep your finances ready either way" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="Second H1B Lottery"
      h1="Will There Be a Second H1B Lottery?"
      readingTime="~7 min read"
      intro={
        <>
          After the main selection runs, many Indian applicants ask the same question: <em>is there a second lottery,
          and am I still in the running?</em> The short answer is that additional selection rounds are{" "}
          <strong>possible but never guaranteed</strong>. This guide explains how they work, why they happen, and what
          to watch for while a second round is still on the table.
        </>
      }
      quickAnswer={{
        question: "Is a second H1B lottery guaranteed?",
        answer: (
          <>
            No. USCIS runs additional rounds <strong>only if</strong> it doesn&rsquo;t receive enough petitions to
            reach the annual cap, and it does not announce them in advance. If your status is still{" "}
            <strong>&ldquo;Submitted&rdquo;</strong> (not &ldquo;Not Selected&rdquo;), you remain eligible for a later
            round automatically — no re-registration needed. Keep a backup plan ready in case no second round happens.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Second Lottery"
      faqs={faqs}
      articleHeadline="Will There Be a Second H1B Lottery?"
      articleDescription="How additional H-1B selection rounds work, why USCIS runs them, whether you need to re-register, and what Indian applicants should watch for."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-ink-700">
              The H-1B cap is 65,000 regular visas plus 20,000 reserved for holders of a U.S. master&rsquo;s degree or
              higher — 85,000 in total. USCIS deliberately selects <strong>more registrations than that</strong> in the
              first round, because it knows not every selected registration becomes a filed, approvable petition. Some
              employers decide not to file, some petitions are withdrawn, and some are denied. When the number of actual
              petitions falls short of the cap, USCIS can reopen the pool and run another selection round to use the
              full allocation. That is what people mean by a &ldquo;second lottery.&rdquo;
            </p>

            <SectionHeading kicker="How it works" id="how">
              How additional selection rounds work
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChecklistCard
                tone="sky"
                title="The mechanics"
                items={[
                  "Later rounds draw from the same registration pool already submitted for that fiscal year.",
                  "You do not submit a new registration — eligibility carries over automatically.",
                  "A newly selected registration flips from “Submitted” to “Selected” in the employer's account.",
                  "The employer then gets a fresh filing window to file the petition.",
                ]}
              />
              <ChecklistCard
                tone="sky"
                title="The uncertainty"
                items={[
                  "USCIS decides whether a round is needed based on petition volume — you can't force it.",
                  "There is no fixed date; rounds have historically come months after the first selection.",
                  "Some years have multiple additional rounds; some years have none.",
                ]}
              />
            </div>

            <SectionHeading kicker="Status" id="status">
              &ldquo;Submitted&rdquo; vs &ldquo;Not Selected&rdquo;
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              This distinction matters. A registration that was not chosen in a round stays{" "}
              <strong>&ldquo;Submitted&rdquo;</strong> — meaning it is still in the pool and can be picked in a later
              round — rather than immediately becoming &ldquo;Not Selected.&rdquo; So if your employer tells you your
              status is Submitted, do not treat the year as over. For a full breakdown of every status, see the{" "}
              <Link href="/h1b-registration-status-meaning" className="font-semibold text-orange-600 underline">
                registration status meaning guide
              </Link>
              .
            </p>
            <CompareTable
              columns={["Status", "Still in the running?", "What to do"]}
              rows={[
                ["Submitted", "Yes — eligible for later rounds.", "Keep your registration and details current; watch for USCIS updates."],
                ["Selected", "You've been chosen.", "Move to the selected next-steps checklist and prepare to file."],
                ["Not Selected", "No — the year is effectively closed for you.", "Shift to backup options: STEM OPT, cap-exempt, L-1, re-register next year."],
              ]}
            />

            <SectionHeading kicker="What to do" id="watch">
              What Indian applicants should do
            </SectionHeading>
            <Callout tone="tip" title="Monitor the right sources">
              Rely on <strong>official USCIS updates</strong> and your employer/attorney — not WhatsApp forwards or
              social-media claims about exact second-round dates. USCIS posts a notice on its website when it runs
              another round.
            </Callout>
            <ChecklistCard
              title="Stay ready either way"
              items={[
                "Keep your employer registration active and your personal details current with the attorney.",
                "Maintain valid status (OPT/STEM OPT or other) so you're eligible if a later round selects you.",
                "Keep your documents organized so your employer can file quickly if you're picked.",
                "Have a backup plan (STEM OPT, cap-exempt, next year) ready in case no second round happens.",
                "Keep a financial cushion so waiting doesn't force a rushed decision.",
              ]}
            />

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Back to the hub</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>{" "}
                for how to check results, what each status means, and the NRI money checklist.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
