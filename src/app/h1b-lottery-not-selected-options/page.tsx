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

const PAGE_PATH = "/h1b-lottery-not-selected-options";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Not Selected: Your Options (2026/2027 Guide for Indians)",
    description:
      "Not selected in the H1B lottery? Practical, realistic options for Indian applicants: stay on F-1 OPT/STEM OPT, cap-exempt H-1B employers, L-1, O-1, H-4/H-4 EAD, avoiding risky shortcuts, and building a financial emergency plan.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Not Selected: Options", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "I wasn't selected in the H1B lottery. Did I do something wrong?",
    answer:
      "No. Selection is random among eligible registrations. In recent years the odds for a single registration have often been well below 50%, so many strong, well-qualified candidates are not selected each cycle. It is not a judgment of your skills or your employer.",
  },
  {
    question: "Can I still work if my H1B registration was not selected?",
    answer:
      "Yes, if you already hold work authorization such as F-1 OPT or STEM OPT — being not selected does not cancel your current status. You simply cannot start cap-subject H-1B employment this year. Keep your existing status valid, and use the time to line up STEM OPT, a cap-exempt role, or another pathway before your current authorization ends.",
  },
  {
    question: "What is a cap-exempt H-1B employer?",
    answer:
      "Certain employers can file H-1B petitions at any time without going through the lottery: institutions of higher education, related or affiliated nonprofit entities, and nonprofit or governmental research organizations. If you can find a role at a cap-exempt employer, you may obtain H-1B status outside the annual cap — a genuinely underused option for Indians in academia, research, and healthcare.",
  },
  {
    question: "Is O-1 a realistic backup if I'm not selected?",
    answer:
      "For most people, no. The O-1 visa is for individuals with extraordinary ability demonstrated by sustained national or international acclaim — awards, publications, judging, press, and similar evidence. It is a high bar. It can be the right path for researchers, senior specialists, and exceptional talent, but it is not a general substitute for H-1B.",
  },
  {
    question: "Can I just re-enter the lottery next year?",
    answer:
      "Yes. Many people are not selected one year and selected the next. The key is to stay in valid status in the meantime — usually via STEM OPT, a cap-exempt role, or another visa — and have your employer re-register you in the next cycle. Maintain your documents and a financial cushion so a second miss doesn't force a rushed decision.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check status, meaning, and next steps" },
  { href: "/h1b-lottery-results-for-f1-opt-students", label: "For F-1 OPT Students", desc: "STEM OPT extension and staying in status" },
  { href: "/h1b-lottery-chances", label: "H1B Lottery Chances", desc: "Understand the odds before you re-register" },
  { href: "/h1b-lottery-chance-calculator", label: "H-1B Lottery Chance Calculator", desc: "Estimate your FY 2027 odds by wage level" },
  { href: "/tools/h1b-sponsor-finder", label: "H-1B Sponsor Finder", desc: "Find employers that file H-1B petitions" },
  { href: "/h1b-layoff", label: "H-1B Layoff Checklist", desc: "If a job ends too: status, family, and money" },
  { href: "/immigration-attorney-lawyer-cost", label: "Immigration Attorney Cost Guide", desc: "When paid legal help is worth it as you weigh O-1, cap-exempt, and other options" },
  { href: "/free-immigrant-wealth-guide", label: "Free Immigrant Wealth Guide", desc: "Build your financial backup plan" },
  { href: "/nri-wealth-checkup", label: "NRI Wealth Checkup", desc: "US–India money and reporting checklist" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="H1B Not Selected"
      h1="H1B Not Selected: Your Realistic Options"
      readingTime="~10 min read"
      intro={
        <>
          A non-selection is common and reversible — but the worst thing you can do is panic or fall out of status.
          This guide lays out the <strong>real, legal options</strong> for Indian applicants who were not selected:
          staying on F-1 OPT/STEM OPT, cap-exempt H-1B employers, L-1, O-1, H-4/H-4 EAD, and a financial backup plan —
          plus the shortcuts to avoid.
        </>
      }
      quickAnswer={{
        question: "I wasn't selected — what should I do first?",
        answer: (
          <>
            Protect your current status. If you are on OPT, confirm your exact end date and check{" "}
            <strong>STEM OPT eligibility</strong> right away — that 24-month extension is the most common bridge to
            next year&rsquo;s lottery. Then explore cap-exempt employers, L-1, O-1, or H-4 in parallel, and build a
            cash cushion so you are never forced into a rushed decision.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Not Selected: Options"
      faqs={faqs}
      articleHeadline="H1B Not Selected: Your Realistic Options"
      articleDescription="Realistic options after an H-1B non-selection for Indians: F-1 OPT/STEM OPT, cap-exempt employers, L-1, O-1, H-4/H-4 EAD, avoiding risky shortcuts, and a financial emergency plan."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-ink-700">
              Being not selected does not change the status you already hold. If you are on F-1 OPT or STEM OPT, you can
              keep working under that authorization; you simply cannot begin cap-subject H-1B employment this fiscal
              year. The goal now is to <strong>stay in valid status</strong>, line up a bridge to next year&rsquo;s
              lottery (or an alternative visa), and protect your family financially while you decide. Below are the
              paths that actually work, ranked roughly by how common and practical they are for Indian applicants.
            </p>

            <SectionHeading kicker="Option 1" id="opt">
              Stay on F-1 OPT / STEM OPT if eligible
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              This is the single most common bridge. If you are on standard 12-month OPT and hold a STEM degree, and
              your employer is enrolled in E-Verify, you may qualify for the <strong>24-month STEM OPT extension</strong>
              — giving you up to three years total and, importantly, more than one additional shot at the lottery.
              Confirm your OPT end date, start the STEM OPT application well before it expires (there are deadlines), and
              keep your I-20 current with your DSO. See the{" "}
              <Link href="/h1b-lottery-results-for-f1-opt-students" className="font-semibold text-orange-600 underline">
                F-1 OPT guide
              </Link>{" "}
              for timing detail.
            </p>

            <SectionHeading kicker="Option 2" id="cap-exempt">
              Cap-exempt H-1B employers
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Universities, affiliated nonprofits, and nonprofit or governmental research organizations can file H-1B{" "}
              <strong>outside the lottery, year-round</strong>. This is one of the most underused options for Indians in
              research, healthcare, and academia. Some people move to a cap-exempt employer, then later transition to a
              cap-subject role once the market improves — or hold a concurrent cap-exempt H-1B while they wait.
            </p>

            <SectionHeading kicker="Options 3–5" id="other-visas">
              L-1, O-1, and H-4 / H-4 EAD
            </SectionHeading>
            <CompareTable
              columns={["Option", "Who it fits", "Key requirement"]}
              rows={[
                ["L-1 (intra-company)", "Work for a multinational that has an office abroad.", "Typically one continuous year abroad with the same company group in a qualifying role, then transfer to the US."],
                ["O-1 (extraordinary ability)", "Researchers, senior specialists, and exceptional talent.", "Sustained national/international acclaim: awards, publications, judging, press, high salary — a demanding evidentiary bar."],
                ["H-4 / H-4 EAD", "Married to an H-1B principal or a green-card holder.", "H-4 EAD generally needs the H-1B spouse to have an approved I-140; H-4 dependent status needs the spouse in valid H-1B."],
              ]}
            />

            <SectionHeading kicker="Caution" id="avoid">
              Avoid risky immigration shortcuts
            </SectionHeading>
            <Callout tone="bad" title="Red flags to walk away from">
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>&ldquo;Guaranteed selection&rdquo; or paid schemes to boost lottery odds — the lottery is random; these are scams.</li>
                <li>Day-1 CPT &ldquo;universities&rdquo; used only to keep working — these draw serious USCIS scrutiny and can wreck future petitions.</li>
                <li>Working while out of status, or starting a new job before a petition is properly filed.</li>
                <li>Fake experience letters or inflated job duties — misrepresentation can lead to bars on future immigration benefits.</li>
              </ul>
            </Callout>

            <SectionHeading kicker="Money" id="emergency">
              Build a financial emergency plan
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              A non-selection is a good moment to strengthen your runway so you are never forced into a bad immigration
              decision by money pressure. For Indian immigrants, that means looking at both sides of the ocean.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChecklistCard
                title="US side"
                items={[
                  "Emergency fund covering 6+ months of expenses and legal fees.",
                  "Continuous health insurance through any status change.",
                  "Know your OPT/status end date and every downstream deadline.",
                  "Keep documents (I-20, EAD, I-94, transcripts) organized and current.",
                ]}
              />
              <ChecklistCard
                title="India side"
                items={[
                  "Know your NRE/NRO balances and India-side liquidity if you need it.",
                  "Stay on top of FBAR/FATCA reporting for Indian accounts and funds.",
                  "If a move back is possible, learn RNOR status and 401(k) handling early.",
                  "Plan currency timing rather than converting in a rush.",
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tools/fbar-fatca-checker" className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-800 hover:border-orange-400">
                FBAR / FATCA Checker →
              </Link>
              <Link href="/free-immigrant-wealth-guide" className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400">
                Free Immigrant Wealth Guide →
              </Link>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Back to the hub</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>{" "}
                for status meanings, second-lottery odds, and the full NRI checklist.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
