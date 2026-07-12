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

const PAGE_PATH = "/h1b-lottery-chances";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Lottery Chances 2026/2027: How Selection Odds Really Work",
    description:
      "How H1B lottery odds actually work: the 85,000 cap, registrations vs selections, the U.S. master's advantage, beneficiary-centric selection, and what Indian applicants can (and can't) do to improve their chances.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Lottery Chances", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "What are the odds of being selected in the H1B lottery?",
    answer:
      "Odds vary each year based on how many registrations are submitted for the fixed 85,000-visa cap. In recent years, when registrations far exceeded the cap, a single registration's chance of selection has often been well below 50%. The more registrations submitted overall, the lower each individual's odds. USCIS publishes registration and selection numbers after each cycle.",
  },
  {
    question: "Does a U.S. master's degree improve my H1B lottery chances?",
    answer:
      "Yes. Holders of a U.S. master's degree or higher get two chances: they are first considered in the combined selection for all 85,000 slots, and those not selected there are considered again for the 20,000 slots reserved for advanced-degree holders. This 'master's cap' generally gives U.S.-advanced-degree candidates meaningfully better odds than bachelor's-only candidates.",
  },
  {
    question: "Can I improve my H1B lottery odds by having multiple employers register me?",
    answer:
      "No. Under the beneficiary-centric rules, each person gets one entry in the selection regardless of how many employers register them. Having several genuine job offers does not multiply your chances. What it can do is give you more than one employer able to file if you are selected. Submitting duplicate or fraudulent registrations is prohibited and can lead to denials or bans.",
  },
  {
    question: "Are H1B lottery odds the same for Indians as everyone else?",
    answer:
      "The selection itself is random and not based on nationality, so the raw selection odds are the same for an Indian applicant as anyone else with the same degree level. Where country matters is later — after an H-1B leads to the green-card process, per-country limits create long EB-2/EB-3 backlogs for Indians. But that affects the green card timeline, not the lottery selection odds.",
  },
  {
    question: "Is there any legitimate way to increase my chances?",
    answer:
      "Under the FY 2027 wage-weighted selection, a genuinely higher OEWS wage level gives you more weighted entries (Level I = 1 up to Level IV = 4). Beyond that, the legitimate levers are earning a qualifying U.S. master's degree (to access the advanced-degree cap) and giving yourself more attempts over time by staying in valid status (for example via STEM OPT). Wage level must reflect a real role and salary — avoid anyone promising 'guaranteed' selection, which is a scam. You can estimate your odds with our H-1B lottery chance calculator.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-chance-calculator", label: "H-1B Lottery Chance Calculator", desc: "Estimate your FY 2027 selection odds by wage level" },
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check results, status meaning, and next steps" },
  { href: "/h1b-lottery-multiple-registrations", label: "Multiple Registrations", desc: "Multiple job offers and beneficiary-centric rules" },
  { href: "/h1b-lottery-not-selected-options", label: "Not Selected: Options", desc: "Backup paths if the odds don't fall your way" },
  { href: "/h1b-lottery-results-for-f1-opt-students", label: "For F-1 OPT Students", desc: "Use STEM OPT for more lottery attempts" },
  { href: "/h1b-lottery-results-date", label: "Results Date", desc: "When selections are announced" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="Lottery Chances"
      h1="H1B Lottery Chances: How the Odds Really Work"
      readingTime="~8 min read"
      intro={
        <>
          The H-1B lottery is a draw against a <strong>fixed 85,000-visa cap</strong>. For older cap seasons the draw
          was essentially random, but starting with <strong>FY 2027</strong> the new <strong>wage-weighted selection</strong>{" "}
          gives higher OEWS wage levels more entries — so wage level, your degree level, and how many times you can
          enter now all matter. This guide explains, clearly and honestly, how the odds work for Indian applicants and
          what you can legitimately do about them.
        </>
      }
      quickAnswer={{
        question: "What actually affects my H1B lottery chances?",
        answer: (
          <>
            Three things now: your <strong>OEWS wage level</strong> (under FY 2027 wage-weighting, Level I = 1 entry up
            to Level IV = 4 entries), a qualifying <strong>U.S. master&rsquo;s degree</strong> (a second draw under the
            20,000 advanced-degree cap), and the <strong>number of attempts</strong> you get by staying in valid status.{" "}
            <Link href="/h1b-lottery-chance-calculator" className="font-semibold text-orange-600 underline">
              Estimate your selection odds with our H-1B lottery chance calculator →
            </Link>
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Lottery Chances"
      faqs={faqs}
      articleHeadline="H1B Lottery Chances: How the Odds Really Work"
      articleDescription="How H-1B lottery odds work: the 85,000 cap, registrations vs selections, the U.S. master's advantage, beneficiary-centric selection, and what Indians can legitimately do."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-6">
              <p className="text-sm font-bold text-orange-900">Want a personalized estimate?</p>
              <p className="mt-1 text-sm text-orange-800/90">
                Use our{" "}
                <Link href="/h1b-lottery-chance-calculator" className="font-semibold underline">
                  H-1B Lottery Chance Calculator
                </Link>{" "}
                to estimate your FY 2027 selection odds by wage level, master&rsquo;s cap status, registration volume,
                and number of attempts.
              </p>
              <Link
                href="/h1b-lottery-chance-calculator"
                className="mt-3 inline-flex items-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Estimate my H-1B odds →
              </Link>
            </div>

            <p className="text-sm leading-relaxed text-ink-700">
              Every spring, applicants look for an edge in the lottery. Starting with the FY 2027 cap season, the new
              wage-weighted selection means your OEWS wage level genuinely affects your odds — but most other
              &ldquo;tips&rdquo; you&rsquo;ll read online still don&rsquo;t change your chances, and some are outright
              scams. Understanding how the math actually works helps you focus your energy on the few levers that are
              real, and on building a solid backup plan.
            </p>

            <Callout tone="tip" title="What changed for FY 2027">
              For older H-1B lotteries, salary did not change selection odds. Starting with the FY 2027 cap season, the
              wage-weighted selection process gives higher OEWS wage levels more entries in the selection pool — Level I
              = 1 entry, Level II = 2, Level III = 3, and Level IV = 4. Higher wage levels get more weighted entries, but
              selection is still never guaranteed.
            </Callout>

            <SectionHeading kicker="The math" id="cap">
              The cap and why odds move each year
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              The annual H-1B cap is fixed: <strong>65,000</strong> regular visas plus <strong>20,000</strong>{" "}
              reserved for holders of a U.S. master&rsquo;s degree or higher — 85,000 total. The number of registrations
              submitted, however, changes every year, and starting FY 2027 those registrations are{" "}
              <strong>weighted by wage level</strong>. When far more weighted entries compete than there are visas, each
              individual&rsquo;s selection probability drops. That is why odds &ldquo;feel&rdquo; worse in some years:
              the cap didn&rsquo;t shrink, the weighted pool of applicants grew. USCIS publishes the registration and
              selection counts after each cycle, so you can see the ratio for any given year.
            </p>

            <SectionHeading kicker="The advantage" id="masters">
              The U.S. master&rsquo;s degree advantage
            </SectionHeading>
            <Callout tone="good" title="Two draws instead of one">
              A qualifying U.S. master&rsquo;s degree (or higher) gives you two shots: you&rsquo;re considered in the
              main selection for all 85,000 slots, and if not chosen there, you&rsquo;re considered again for the 20,000
              advanced-degree slots. This generally gives U.S.-advanced-degree candidates better odds than
              bachelor&rsquo;s-only candidates — one of the few real, legitimate advantages.
            </Callout>
            <CompareTable
              columns={["Candidate type", "How many draws", "Practical effect"]}
              rows={[
                ["Bachelor's degree", "One (regular cap only)", "Single chance in the combined selection."],
                ["U.S. master's or higher", "Two (regular + advanced-degree cap)", "Second chance improves overall selection odds."],
                ["Foreign master's (not U.S.)", "One (regular cap only)", "A non-U.S. advanced degree does not access the 20,000 master's cap."],
              ]}
            />

            <SectionHeading kicker="Myth vs fact" id="myths">
              What does <em>not</em> improve your odds
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChecklistCard
                tone="sky"
                title="Doesn't change the draw"
                items={[
                  "Resume strength, seniority, or how impressive your employer is on its own.",
                  "Inflating a wage level without a genuine, matching role and salary.",
                  "Having multiple employers register you — you still get one entry.",
                  "Paying anyone for 'guaranteed' or 'priority' selection (this is a scam).",
                ]}
              />
              <ChecklistCard
                tone="emerald"
                title="Legitimately helps"
                items={[
                  "A genuinely higher OEWS wage level (more weighted entries under FY 2027).",
                  "Earning a qualifying U.S. master's degree for the second draw.",
                  "Staying in valid status (e.g., STEM OPT) to get more attempts over years.",
                  "Keeping clean, accurate registrations and a willing employer ready to file.",
                ]}
              />
            </div>

            <SectionHeading kicker="Beneficiary-centric" id="beneficiary">
              One person, one entry
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Under the beneficiary-centric selection, the lottery picks <strong>people, not registrations</strong>. So
              even if several different employers legitimately register you, you get a single entry in the draw — it
              doesn&rsquo;t multiply your chances. What multiple genuine offers <em>can</em> do is give you more than one
              employer able to file a petition if you&rsquo;re selected. For how multiple job offers work, see{" "}
              <Link href="/h1b-lottery-multiple-registrations" className="font-semibold text-orange-600 underline">
                multiple registrations explained
              </Link>
              .
            </p>

            <SectionHeading kicker="India note" id="india">
              A note for Indian applicants
            </SectionHeading>
            <Callout tone="info" title="Selection odds are nationality-blind">
              The lottery draw itself is random and not tied to your country — an Indian applicant&rsquo;s selection
              odds are the same as anyone else&rsquo;s at the same degree level. Country matters later: after H-1B, the
              green-card process has long per-country <strong>EB-2/EB-3 backlogs</strong> for India. That affects your
              green card timeline, not your lottery chances. See the{" "}
              <Link href="/green-card" className="font-semibold underline">
                green card process for Indians
              </Link>
              .
            </Callout>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Plan for both outcomes</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Because odds are what they are, build a backup before results:{" "}
                <Link href="/h1b-lottery-not-selected-options" className="font-semibold underline">
                  not selected: options
                </Link>
                . Or return to the{" "}
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
