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

const PAGE_PATH = "/h1b-lottery-results-for-h4-families";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Lottery Results for H-4 Families (2026/2027 Guide)",
    description:
      "What H1B lottery results mean for H-4 spouses and immigrant families: spouse planning, H-4 EAD considerations, children's school continuity, health insurance and emergency fund, and moving-back-to-India considerations.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "For H-4 Families", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Does an H1B lottery selection let my spouse get H-4 EAD?",
    answer:
      "Not by itself. H-4 dependent status follows the H-1B principal's valid status, but H-4 EAD (work authorization) generally requires the H-1B principal to have an approved Form I-140 (or to be in H-1B status beyond the sixth year under specific extension provisions). A lottery win only starts the H-1B petition — it does not create I-140 approval or H-4 EAD eligibility on its own.",
  },
  {
    question: "Can my spouse move to H-4 if I'm selected and approved?",
    answer:
      "Once the H-1B principal is in valid H-1B status, a spouse and unmarried children under 21 can generally hold H-4 dependent status. The timing depends on when the H-1B is approved and how the change of status is filed. Plan the dependents' filings alongside the principal's petition so the whole family's status lines up.",
  },
  {
    question: "How does a non-selection affect my children's school?",
    answer:
      "If you're not selected but remain in valid status (for example, the principal stays on OPT/STEM OPT or another visa), your children generally continue in school as before. Problems arise only if the family falls out of status. Plan any moves around the actual immigration timeline — not around rumors — so children's schooling stays stable.",
  },
  {
    question: "Should we keep an emergency fund tied to the lottery outcome?",
    answer:
      "Yes. A family should hold enough liquid savings to absorb a petition that slips, an RFE, or a denial without a crisis — commonly 6+ months of expenses. Keep health insurance continuous through any status change, and know your India-side liquidity in case you need it. Financial stability keeps immigration decisions calm and unforced.",
  },
  {
    question: "What if we decide to move back to India?",
    answer:
      "If plans don't work out, think through it deliberately: RNOR tax status on return, what to do with 401(k) and US investments, children's schooling and curriculum, currency timing, and FBAR/FATCA for the final US year. These decisions have long tails, so start learning early rather than deciding in a rush.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check results and what to do next" },
  { href: "/h1b-lottery-not-selected-options", label: "Not Selected: Options", desc: "Family-aware backup paths" },
  { href: "/h1b-visa-stamping-after-selection", label: "Visa Stamping After Selection", desc: "Family stamping and travel timing in India" },
  { href: "/trump-account-h1b-immigrant-families", label: "Trump Account for H-1B Families", desc: "Child savings account rules for immigrant families" },
  { href: "/trump-account-moving-back-to-india", label: "Moving Back to India", desc: "What happens to accounts if you return" },
  { href: "/nri-wealth-checkup", label: "NRI Wealth Checkup", desc: "US–India money and reporting checklist" },
  { href: "/india-tax-compliance", label: "India Tax & Compliance", desc: "FBAR, FATCA, DTAA, ITR, and repatriation" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="H-4 Families"
      h1="H1B Lottery Results for H-4 Families"
      readingTime="~9 min read"
      intro={
        <>
          A lottery result affects the whole family, not just the primary applicant. If you are planning around a
          spouse&rsquo;s H-1B or your own H-4 status, the result touches <strong>work authorization, children&rsquo;s
          schooling, health insurance, and long-term plans</strong> — including a possible move back to India. This
          guide helps H-4 families map the impact and stay financially steady, whatever the outcome.
        </>
      }
      quickAnswer={{
        question: "How does an H1B lottery result affect my H-4 family?",
        answer: (
          <>
            A <strong>selection</strong> starts the principal&rsquo;s H-1B petition, which can later let a spouse and
            children hold H-4 status — but <strong>H-4 EAD</strong> generally needs an approved I-140, not just a
            lottery win. A <strong>non-selection</strong> means the family relies on its current status. Either way,
            keep insurance continuous and hold an emergency fund so a slip or denial doesn&rsquo;t become a crisis.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="For H-4 Families"
      faqs={faqs}
      articleHeadline="H1B Lottery Results for H-4 Families"
      articleDescription="What H-1B lottery results mean for H-4 spouses and families: spouse planning, H-4 EAD, school continuity, insurance and emergency fund, and moving-back-to-India considerations."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-ink-700">
              For families, the lottery is rarely just about one person&rsquo;s visa. It shapes whether a spouse can
              work, where children go to school, how you carry health insurance, and whether you stay in the US or plan
              a return to India. The key is to separate what a result actually changes from what it doesn&rsquo;t — and
              to keep the family financially resilient so no single outcome forces a rushed decision.
            </p>

            <SectionHeading kicker="1" id="spouse">Impact on spouse planning</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              If the principal is <strong>selected</strong> and the petition is approved, a spouse and unmarried
              children under 21 can generally hold H-4 dependent status tied to the principal&rsquo;s H-1B. If the
              principal is <strong>not selected</strong>, the family continues on its current plan — for example, both
              partners staying on their existing OPT/STEM OPT or other status. Map the dependents&rsquo; filings
              alongside the principal&rsquo;s so the whole family&rsquo;s status stays aligned.
            </p>

            <SectionHeading kicker="2" id="h4ead">H-4 EAD considerations</SectionHeading>
            <Callout tone="warn" title="A lottery win alone does not create H-4 EAD">
              H-4 <em>dependent status</em> follows the principal&rsquo;s valid H-1B. But H-4 <em>EAD</em> (work
              authorization) generally requires the H-1B principal to have an <strong>approved I-140</strong> — which
              comes much later in the green-card process, not from the lottery. Families counting on a spouse&rsquo;s
              income should plan around the I-140 timeline, not the lottery result.
            </Callout>
            <CompareTable
              columns={["Milestone", "What it enables for the H-4 spouse"]}
              rows={[
                ["Principal selected in lottery", "Nothing yet for H-4 — it only starts the H-1B petition."],
                ["Principal in valid H-1B status", "Spouse/children can generally hold H-4 dependent status."],
                ["Principal has approved I-140", "Spouse may become eligible to apply for H-4 EAD (work authorization)."],
              ]}
            />

            <SectionHeading kicker="3" id="school">Child school continuity</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Children in H-4 status attend US schools normally as long as the family stays in valid status. Avoid
              disrupting the school year around uncertain immigration timing — plan any move around the{" "}
              <strong>actual petition and start-date timeline</strong>, not around rumors. If a return to India is
              possible, research curriculum differences (CBSE/ICSE vs US) and admission cycles well ahead of time.
            </p>

            <SectionHeading kicker="4" id="insurance">Health insurance and emergency fund</SectionHeading>
            <ChecklistCard
              title="Family financial resilience checklist"
              items={[
                "Keep health insurance continuous through any status change or job move — no gaps for kids.",
                "Hold an emergency fund covering 6+ months of family expenses and legal fees.",
                "Know which family member's status anchors coverage and work authorization.",
                "Keep all family documents (passports, I-94s, I-797s, EADs, birth/marriage certificates) current and copied.",
              ]}
            />

            <SectionHeading kicker="5" id="india">Moving back to India considerations</SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              If the family decides a return to India makes sense, treat it as a deliberate project. The big items are
              your <strong>RNOR tax status</strong> on return, what to do with 401(k)/US investments, children&rsquo;s
              schooling, currency timing, and closing out US reporting (including a final-year FBAR/FATCA). Children&rsquo;s
              long-term savings accounts opened in the US also need a plan — see{" "}
              <Link href="/trump-account-moving-back-to-india" className="font-semibold text-orange-600 underline">
                what happens to a Trump Account if you move back to India
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/nri-wealth-checkup" className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-800 hover:border-orange-400">
                NRI Wealth Checkup →
              </Link>
              <Link href="/india-tax-compliance" className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400">
                India Tax & Compliance →
              </Link>
              <Link href="/trump-account-h1b-immigrant-families" className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400">
                Trump Account for H-1B Families →
              </Link>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Back to the hub</p>
              <p className="mt-1 text-sm text-orange-800/80">
                Return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>{" "}
                for status meanings, second-lottery odds, and the full NRI money checklist.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
