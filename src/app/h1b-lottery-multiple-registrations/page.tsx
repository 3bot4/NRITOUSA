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

const PAGE_PATH = "/h1b-lottery-multiple-registrations";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H-1B Multiple Registrations 2027: One Person, One Entry",
    description:
      "Can multiple employers register you for the H-1B lottery? Yes — but you still get one entry. The beneficiary-centric rule, duplicates, and Denied status.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Multiple Registrations", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Can multiple employers register me in the H1B lottery?",
    answer:
      "Yes, if each has a genuine job offer for you. Different, unrelated employers with legitimate positions can each register you. Under the beneficiary-centric selection, though, you still get only one entry in the draw — multiple registrations by different genuine employers do not increase your odds. What they do provide is more than one employer able to file a petition if you're selected.",
  },
  {
    question: "Does having multiple registrations improve my odds?",
    answer:
      "No. Since the beneficiary-centric rules, the lottery selects people rather than registrations, so each individual gets a single entry regardless of how many employers register them. The rule was specifically designed to stop the practice of stacking registrations to game the odds. Multiple genuine offers help with filing flexibility, not selection probability.",
  },
  {
    question: "What counts as a prohibited duplicate registration?",
    answer:
      "The same employer submitting more than one registration for the same beneficiary in the same fiscal year is a prohibited duplicate — those registrations are invalidated. Arrangements where companies register the same person without a bona fide job offer, purely to increase chances, are considered gaming the system and can lead to denials, revocations, and referrals for fraud.",
  },
  {
    question: "Why does my registration show 'Denied'?",
    answer:
      "A 'Denied' registration status usually means a duplicate was detected — the same employer registered you more than once. Only one registration per beneficiary per employer is valid. It generally isn't about your qualifications. Ask your employer or attorney to explain how registrations were submitted, and confirm there was a genuine, single registration per employer.",
  },
  {
    question: "Is it legal to have several job offers going into the lottery?",
    answer:
      "Having multiple genuine job offers is legal, and each real employer can register you. What's illegal is fabricating offers, colluding among related entities, or submitting duplicate registrations to boost odds. Keep everything bona fide: real roles, real intent to employ, and one clean registration per employer. When in doubt, ask an immigration attorney.",
  },
  {
    question: "Can multiple employers register me for the H1B lottery?",
    answer:
      "Yes, and it is entirely legal when each offer is genuine. But under beneficiary-centric selection you still receive only one entry in the draw regardless of how many employers register you, so your odds do not change. The real benefit is optionality: if you are selected, each registering employer may file a petition, giving you a choice of offers.",
  },
  {
    question: "What does a Denied H1B registration status mean?",
    answer:
      "Denied usually means the same employer submitted more than one registration for the same beneficiary in the same cap season — a prohibited duplicate. USCIS invalidates the duplicate registrations rather than penalising you automatically, but the underlying conduct matters, so ask your employer or attorney to explain what happened.",
  },
  {
    question: "Did the beneficiary-centric rule change H-1B odds?",
    answer:
      "Substantially. Eliminating duplicate registrations cut the eligible pool from roughly 759,000 in FY 2024 to about 470,000 in FY 2025 and around 344,000 in FY 2026, which raised the published selection rate from roughly 25% to about 35% even though the 85,000 cap never changed.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check results, status meaning, and next steps" },
  { href: "/h1b-registration-status-meaning", label: "Registration Status Meaning", desc: "What Denied and Invalidated mean" },
  { href: "/h1b-lottery-chances", label: "H1B Lottery Chances", desc: "Why multiple registrations don't raise odds" },
  { href: "/h1b-lottery-chance-calculator", label: "H-1B Lottery Chance Calculator", desc: "Estimate your FY 2027 odds by wage level" },
  { href: "/h1b-sponsors", label: "H-1B Sponsor Finder", desc: "Research employers that file H-1B petitions" },
  { href: "/h1b-lottery-selected-next-steps", label: "Selected: Next Steps", desc: "Choosing which offer to proceed with" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="Multiple Registrations"
      h1="H1B Multiple Registrations: Multiple Job Offers and the Rules"
      readingTime="~8 min read"
      intro={
        <>
          A frequent question from Indian job-seekers: <em>&ldquo;If two or three employers register me, do my chances
          go up?&rdquo;</em> The answer is <strong>no</strong> — the beneficiary-centric selection gives every person a
          single entry. This guide explains what multiple genuine offers actually mean, the strict ban on duplicate and
          fraudulent registrations, and what a &ldquo;Denied&rdquo; status is telling you.
        </>
      }
      quickAnswer={{
        question: "Do multiple employers registering me increase my H1B chances?",
        answer: (
          <>
            No. Under <strong>beneficiary-centric selection</strong>, the lottery picks people, not registrations — so
            you get <strong>one entry</strong> no matter how many employers register you. Multiple <em>genuine</em>{" "}
            offers only give you more than one employer able to file if you&rsquo;re selected. Duplicate registrations
            by the <em>same</em> employer are prohibited and get invalidated.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Multiple Registrations"
      faqs={faqs}
      articleHeadline="H1B Multiple Registrations: Multiple Job Offers and the Rules"
      articleDescription="How beneficiary-centric H-1B selection works, what multiple genuine job offers mean, the ban on duplicate and fraudulent registrations, and what a Denied status signals."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Key takeaways */}
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Key takeaways</p>
              <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
                <li>• Expect <strong>one entry per person</strong> no matter how many employers register you — beneficiary-centric selection has applied since FY 2025.</li>
                <li>• Accept multiple genuine offers freely: several real employers may register you, and each can file if you are selected.</li>
                <li>• Never allow a <strong>duplicate</strong> registration by the same employer — USCIS invalidates it and the status shows <strong>Denied</strong>.</li>
                <li>• Understand what changed: eliminating duplicates cut eligible registrations from about <strong>759,000</strong> in FY 2024 to roughly <strong>344,000</strong> by FY 2026.</li>
                <li>• Treat "guaranteed selection" schemes as fraud — they risk denials, revocations, and long-term bars.</li>
              </ul>
            </div>

            <p className="text-sm leading-relaxed text-ink-700">
              A common question during cap season is whether lining up several job offers improves your H-1B lottery
              chances. It does not — and understanding exactly why protects you from bad advice and from arrangements
              that could damage your immigration record. This guide covers the beneficiary-centric rule that governs
              multiple registrations, the difference between legitimate multiple offers and prohibited duplicates, what
              a <strong>Denied</strong> registration status actually means, and how to choose between employers if you
              are selected. For years, some applicants tried to improve their odds by having many employers register
              them — a practice that distorted the lottery until USCIS closed that door.
            </p>

            <SectionHeading kicker="The rule" id="beneficiary">
              Can Multiple Employers Register You for the H-1B Lottery?
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              When USCIS runs the lottery, it de-duplicates by person first, then selects among unique beneficiaries. So
              whether one employer or three genuine employers register you, your <strong>probability of selection is the
              same</strong>. If you&rsquo;re selected, each employer that registered you can then file a petition —
              giving you a choice of which offer to pursue — but the odds themselves never multiplied.
            </p>
            <CompareTable
              columns={["Scenario", "Entries in the draw", "What it gives you"]}
              rows={[
                ["One genuine employer registers you", "One", "A single chance; one employer able to file if selected."],
                ["Three unrelated genuine employers register you", "Still one", "Same odds; but up to three employers able to file if selected — more choice."],
                ["Same employer registers you twice", "Invalidated (Denied)", "Duplicate — prohibited; the registrations are thrown out."],
                ["Fake/colluding registrations to boost odds", "Fraud risk", "Denials, revocations, and possible bans — never do this."],
              ]}
            />

            <SectionHeading kicker="Legit vs not" id="legit">
              Legitimate Multiple Offers vs Prohibited Duplicates
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChecklistCard
                tone="emerald"
                title="Legitimate"
                items={[
                  "Several unrelated employers each with a real, bona fide job offer for you.",
                  "One clean registration per employer, each with genuine intent to employ.",
                  "You choosing which offer to proceed with if you're selected.",
                ]}
              />
              <ChecklistCard
                tone="sky"
                title="Prohibited / risky"
                items={[
                  "The same employer submitting duplicate registrations for you.",
                  "Related or colluding entities registering you to stack odds.",
                  "Registrations without a genuine job offer or intent to employ.",
                  "Any 'arrangement' or payment to boost your selection chances.",
                ]}
              />
            </div>

            <SectionHeading kicker="The numbers" id="impact">
              How Much Did the Duplicate Ban Change the Odds?
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Removing duplicate registrations shrank the pool without touching the 85,000 cap — which is
              exactly why per-person odds improved.
            </p>
            <CompareTable
              columns={["Cap season", "Eligible registrations", "Approx. selection rate"]}
              rows={[
                ["FY 2024 (before beneficiary-centric)", "~759,000", "~25%"],
                ["FY 2025 (first beneficiary-centric year)", "~470,000", "~29%"],
                ["FY 2026", "~344,000", "~35%"],
                ["FY 2027", "Per USCIS announcement", "First wage-weighted year"],
              ]}
            />

            <SectionHeading kicker="Status" id="denied">
              What a &ldquo;Denied&rdquo; status means
            </SectionHeading>
            <Callout tone="warn" title="Usually a duplicate flag">
              If your registration shows <strong>Denied</strong>, it typically means the same employer registered you
              more than once — a prohibited duplicate — and the entries were invalidated. It generally isn&rsquo;t about
              your qualifications. Ask your employer/attorney to confirm exactly how registrations were submitted. For a
              full breakdown, see the{" "}
              <Link href="/h1b-registration-status-meaning" className="font-semibold underline">
                registration status meaning guide
              </Link>
              .
            </Callout>

            <SectionHeading kicker="If selected" id="choosing">
              Selected with more than one offer? Choosing wisely
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              If you had multiple genuine registrations and you&rsquo;re selected, you can decide which employer files
              your petition. Weigh the role, salary and LCA wage, worksite, the employer&rsquo;s H-1B track record, and
              whether they&rsquo;ll support your future green-card process. Research an employer&rsquo;s filing history
              with the{" "}
              <Link href="/h1b-sponsors" className="font-semibold text-orange-600 underline">
                H-1B Sponsor Finder
              </Link>
              , then move to{" "}
              <Link href="/h1b-lottery-selected-next-steps" className="font-semibold text-orange-600 underline">
                selected: next steps
              </Link>
              .
            </p>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Back to the hub</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>{" "}
                for status meanings, odds, and next steps.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
