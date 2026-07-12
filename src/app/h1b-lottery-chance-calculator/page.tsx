import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import H1bLotteryChanceCalculator from "@/components/tools/H1bLotteryChanceCalculator";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  webAppJsonLd,
  clusterArticleJsonLd,
} from "@/lib/permCluster";

const PATH = "/h1b-lottery-chance-calculator";
const H1 = "H-1B Lottery Chance Calculator 2027";
const TITLE = "H-1B Lottery Chance Calculator 2027 | Wage Level Odds Estimator";
const DESC =
  "Estimate your FY 2027 H-1B lottery selection odds using wage level, U.S. master's cap status, registration volume, and future attempts. Educational calculator for Indian, F-1 OPT, and STEM OPT applicants.";

const PUBLISHED = "2026-07-08";
const UPDATED = "2026-07-08";
const UPDATED_HUMAN = "July 8, 2026";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: PATH,
  socialTitle: `${H1}: Estimate Your Selection Odds by Wage Level`,
});

const faq: FaqItem[] = [
  {
    question: "What are my H-1B lottery chances for FY 2027?",
    answer:
      "Your odds depend mainly on total registration volume, your OEWS wage level, whether you qualify for the U.S. master's cap, and how many future attempts you have. Under the FY 2027 wage-weighted process, higher wage levels get more weighted entries, so a Level IV applicant has better estimated odds than a Level I applicant in the same pool. This calculator gives an educational range, not an exact number — actual odds depend on final USCIS registration counts.",
  },
  {
    question: "Does salary affect H-1B lottery odds now?",
    answer:
      "Yes — this is the key change. In older H-1B lotteries, salary did not change selection odds. Starting with the FY 2027 cap season, the wage-weighted selection process gives higher OEWS wage levels more entries in the selection pool: Level I = 1 entry, Level II = 2, Level III = 3, Level IV = 4. So a genuinely higher wage level improves your weighted odds, though it never guarantees selection.",
  },
  {
    question: "What is the H-1B wage-weighted lottery?",
    answer:
      "It is the FY 2027 selection method in which each registration is weighted by the job's OEWS prevailing wage level. Instead of every registration having one equal ticket, Level I gets 1 weighted entry and Level IV gets 4. USCIS still selects beneficiaries (one person, not each duplicate registration), but higher wage levels carry proportionally more weight in the draw.",
  },
  {
    question: "What is Wage Level I, II, III, and IV?",
    answer:
      "These are the four OEWS prevailing wage levels for a given SOC occupation code and area of employment. Level I is entry-level (lower prevailing wage), Level II is qualified/mid-level, Level III is experienced, and Level IV is fully competent/senior (highest prevailing wage). The level is based on the job's requirements versus the local wage distribution — not on your résumé strength.",
  },
  {
    question: "Does a U.S. master's degree still improve my H-1B chances?",
    answer:
      "Yes. A qualifying U.S. master's degree or higher still helps because of the 20,000-visa advanced-degree exemption, which gives you a second consideration if you are not selected in the regular 65,000 draw. But wage level now also matters — a U.S. master's applicant at Level I may not have the same practical odds as a Level III or IV applicant.",
  },
  {
    question: "Do multiple employers increase my H-1B lottery odds?",
    answer:
      "No. Under beneficiary-centric selection, the person is selected, not each duplicate registration, so multiple employers do not multiply your chances the old way. If multiple genuine registrations have different wage levels, USCIS integrity rules may use the lowest applicable wage level. Multiple genuine offers only help by giving more than one employer able to file if you are selected — confirm details with your attorney and employers.",
  },
  {
    question: "Are H-1B lottery odds different for Indian applicants?",
    answer:
      "No — H-1B lottery selection is not nationality-based. Indian applicants are affected by the same wage-level and degree rules as everyone else. Country of birth matters later, in the EB-2/EB-3 green card backlog and visa bulletin, not in the lottery selection itself.",
  },
  {
    question: "How do I know my wage level?",
    answer:
      "Your OEWS prevailing wage level (I–IV) is determined by the SOC occupation code and the area of intended employment. Ask your employer or immigration attorney, or look up the wage for your role and location using DOL FLAG / OEWS wage data. It reflects the job's requirements against the local wage distribution.",
  },
  {
    question: "Can my employer choose a higher wage level to improve my odds?",
    answer:
      "The wage level must genuinely reflect the job's requirements and the actual offered wage; it is not a dial to turn for lottery advantage. Inflating a wage level without real support can create compliance and integrity problems. A legitimately higher-paying, more senior role can carry a higher wage level — but that must be real. Always work within the law and confirm with your attorney.",
  },
  {
    question: "Is this calculator legal advice?",
    answer:
      "No. This is an educational estimate only and is not legal advice. Actual USCIS odds depend on final registration volume, the real wage-level distribution, petition withdrawals, denials, and USCIS selection behavior. Verify with USCIS, DOL wage data, your employer, and a qualified immigration attorney before relying on any figure.",
  },
  {
    question: "What should I do if my chance is low?",
    answer:
      "Confirm your wage level is accurate, make sure your employer's registration is correct, and build a concrete backup plan — for example additional OPT/STEM OPT attempts, a cap-exempt employer, another status, or studying further for the master's cap. Low odds in one year do not mean the door is closed; more valid attempts raise your cumulative chance.",
  },
  {
    question: "How do multiple attempts affect my odds?",
    answer:
      "Each independent attempt compounds your cumulative chance using the approximation: chance over multiple attempts = 1 − (1 − one-year chance)^number of attempts. So even a modest single-year chance grows meaningfully over two, three, or four attempts. STEM OPT can help by giving you more valid years to re-enter the lottery.",
  },
];

const internalLinks: { href: string; label: string; desc: string }[] = [
  { href: "/h1b-lottery-chances", label: "H-1B Lottery Chances (full explainer)", desc: "How selection odds really work, in depth" },
  { href: "/h1b-lottery-results", label: "H-1B Lottery Results Hub", desc: "Check results, status meaning, next steps" },
  { href: "/h1b-lottery-multiple-registrations", label: "Multiple Registrations", desc: "Multiple job offers & beneficiary-centric rules" },
  { href: "/h1b-lottery-not-selected-options", label: "Not Selected: Options", desc: "Backup paths if the odds don't fall your way" },
  { href: "/h1b-prevailing-wage", label: "H-1B Prevailing Wage", desc: "How OEWS wage levels are set" },
  { href: "/prevailing-wage-calculator", label: "Prevailing Wage Calculator", desc: "Explore DOL wage levels by SOC & area" },
  { href: "/visa-bulletin", label: "Visa Bulletin Tracker", desc: "Where country of birth actually matters" },
  { href: "/green-card", label: "Green Card Process", desc: "The EB-2/EB-3 path after H-1B" },
  { href: "/uscis/processing-times", label: "USCIS Processing Times", desc: "Current case processing estimates" },
  { href: "/h1b-layoff", label: "H-1B Layoff Checklist", desc: "Grace period and options after a layoff" },
  { href: "/tools", label: "All Tools & Calculators", desc: "The full NRItoUSA tool hub" },
];

function SectionH2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
      {children}
    </h2>
  );
}

export default function Page() {
  const jsonLd = jsonLdGraph(
    webAppJsonLd({ path: PATH, name: H1, description: DESC }),
    clusterArticleJsonLd({
      path: PATH,
      headline: `${H1}: Estimate Your Selection Odds by Wage Level`,
      description: DESC,
      datePublished: PUBLISHED,
      dateModified: UPDATED,
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "H-1B Lottery Results", url: "/h1b-lottery-results" },
      { name: "Lottery Chance Calculator", url: PATH },
    ])
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="h1b-lottery-chance-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "H-1B Lottery Results", href: "/h1b-lottery-results" },
          { label: "Lottery Chance Calculator" },
        ]}
        icon="🎯"
        category="Visa & Green Card"
        title={H1}
        hook="Estimate your H-1B lottery selection odds based on wage level, U.S. master's cap eligibility, expected registration volume, and number of attempts."
        badges={["Updated for FY 2027 wage-weighted selection", "No signup", "No personal data", "Instant range"]}
        accent="from-orange-600 to-amber-500"
        disclaimerExtra={
          <p>
            This is an educational estimate, not legal advice. Actual USCIS odds depend on final registration volume,
            wage-level distribution, petition withdrawals, denials, and USCIS selection behavior. Verify with USCIS, DOL
            wage data, your employer, and an immigration attorney.
          </p>
        }
      >
        {/* Calculator (above the fold) */}
        <section className="pb-10 pt-6 sm:pb-14">
          <Container>
            <H1bLotteryChanceCalculator />
          </Container>
        </section>

        {/* Methodology */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4">
              <SectionH2 id="methodology">How this calculator estimates your odds</SectionH2>
              <p className="text-sm leading-relaxed text-ink-600">
                The estimate uses transparent, editable assumptions — not fake certainty. The statutory cap is fixed at{" "}
                <strong>65,000 regular + 20,000 U.S. advanced-degree = 85,000 total</strong>. Under FY 2027
                wage-weighting, each registration carries weighted entries by OEWS wage level: <strong>Level I = 1</strong>,
                Level II = 2, Level III = 3, <strong>Level IV = 4</strong>.
              </p>
              <div className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm leading-relaxed text-ink-700">
                <p className="font-semibold text-ink-900">Total weighted ticket pool</p>
                <p className="mt-1">
                  Total weighted tickets = Level I registrations × 1 + Level II × 2 + Level III × 3 + Level IV × 4.
                </p>
                <p className="mt-3 font-semibold text-ink-900">Individual chance</p>
                <p className="mt-1">
                  weightedChance = 1 − (1 − baseTicketProbability)<sup>wageWeight</sup>. A higher wage level gives more
                  weighted entries — it does <em>not</em> guarantee selection.
                </p>
                <p className="mt-3 font-semibold text-ink-900">Multiple attempts</p>
                <p className="mt-1">
                  Chance over multiple attempts = 1 − (1 − oneYearChance)<sup>numberOfAttempts</sup>.
                </p>
              </div>
              <p className="text-sm leading-relaxed text-ink-600">
                For U.S. master&rsquo;s candidates, we use a two-step approximation: the regular 65,000 draw first, then
                the 20,000 advanced-degree draw if not selected. Because final USCIS counts change every year, you can
                adjust the total registration assumption (high, baseline, lower, or a custom number). We assume an
                editable wage-level mix of Level I 40%, Level II 42%, Level III 11%, Level IV 7%. All numbers are ranges,
                never exact odds.
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-900">
                <strong className="font-bold">On multiple registrations:</strong> multiple employers do not multiply your
                chance the old way. Under beneficiary-centric selection, the person is selected, not each duplicate
                registration. If your registrations carry different wage levels, USCIS integrity rules may use the{" "}
                <em>lowest</em> applicable wage level — so confirm with your attorney and employers.
              </div>
            </div>
          </Container>
        </section>

        {/* Quick answer */}
        <section className="bg-white py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4">
              <SectionH2 id="quick-answer">Quick answer: what are my H-1B lottery chances in 2027?</SectionH2>
              <p className="text-sm leading-relaxed text-ink-700">
                Your odds depend mainly on <strong>total registrations</strong>, your <strong>wage level</strong>,{" "}
                <strong>U.S. master&rsquo;s eligibility</strong>, and your number of <strong>future attempts</strong>.
                Level IV is stronger than Level I because of the 4× weighting — but even a high wage level is not a
                guarantee. A U.S. master&rsquo;s degree can still help thanks to the 20,000 advanced-degree allocation.
              </p>
            </div>
          </Container>
        </section>

        {/* How FY 2027 works */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4">
              <SectionH2 id="how-it-works">How the FY 2027 wage-weighted H-1B lottery works</SectionH2>
              <p className="text-sm leading-relaxed text-ink-700">
                Before FY 2027, selection was essentially random once beneficiary-centric rules applied — salary did not
                change your odds. Starting with the FY 2027 cap season, <strong>wage level changes odds</strong>:
              </p>
              <ul className="space-y-1.5 text-sm text-ink-700">
                <li>• Level I = 1 entry</li>
                <li>• Level II = 2 entries</li>
                <li>• Level III = 3 entries</li>
                <li>• Level IV = 4 entries</li>
              </ul>
              <p className="text-sm leading-relaxed text-ink-700">
                Wage level is based on the <strong>OEWS prevailing wage level</strong> for the SOC code and area of
                intended employment — see our{" "}
                <Link href="/h1b-prevailing-wage" className="font-semibold text-orange-600 underline">
                  H-1B prevailing wage
                </Link>{" "}
                guide and{" "}
                <Link href="/prevailing-wage-calculator" className="font-semibold text-orange-600 underline">
                  prevailing wage calculator
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* Wage levels table */}
        <section className="bg-white py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4">
              <SectionH2 id="wage-levels">H-1B wage levels explained</SectionH2>
              <div className="overflow-x-auto rounded-2xl border border-ink-900/10">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50">
                      {["Wage Level", "Typical meaning", "Lottery weight", "Practical effect"].map((c) => (
                        <th key={c} className="px-4 py-3 font-bold text-ink-800">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Level I", "Entry-level / lower prevailing wage", "1×", "Lowest weighted odds"],
                      ["Level II", "Qualified / mid-level", "2×", "Better than Level I"],
                      ["Level III", "Experienced / high skill", "3×", "Stronger odds"],
                      ["Level IV", "Fully competent / senior / highest prevailing wage", "4×", "Highest weighted odds, still not guaranteed"],
                    ].map((row) => (
                      <tr key={row[0]} className="border-t border-ink-900/5 align-top">
                        {row.map((cell, j) => (
                          <td key={j} className={`px-4 py-3 text-ink-700 ${j === 0 ? "font-semibold text-ink-900" : ""}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>

        {/* Master's */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4">
              <SectionH2 id="masters">Does a U.S. master&rsquo;s degree still help?</SectionH2>
              <p className="text-sm leading-relaxed text-ink-700">
                Yes — a qualifying U.S. master&rsquo;s degree or higher can still help because of the advanced-degree
                exemption: if you aren&rsquo;t selected in the regular 65,000 draw, you get a second consideration for the
                20,000 reserved slots. But wage level now matters too. A U.S. master&rsquo;s applicant at Level I may not
                have the same practical odds as a Level III or IV applicant. The two levers compound — degree access{" "}
                <em>and</em> weighted entries.
              </p>
            </div>
          </Container>
        </section>

        {/* Indian applicants */}
        <section className="bg-white py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4">
              <SectionH2 id="indian-applicants">For Indian applicants</SectionH2>
              <p className="text-sm leading-relaxed text-ink-700">
                H-1B lottery selection is <strong>not nationality-based</strong>. Indian applicants face the same
                wage-level and degree rules as everyone else. Country of birth matters more later — in the{" "}
                <strong>EB-2 / EB-3 green card backlog</strong>, not in the lottery selection itself. Track where it
                counts with the{" "}
                <Link href="/visa-bulletin" className="font-semibold text-orange-600 underline">
                  visa bulletin tracker
                </Link>{" "}
                and the{" "}
                <Link href="/green-card" className="font-semibold text-orange-600 underline">
                  green card process
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* F-1 OPT / STEM OPT */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4">
              <SectionH2 id="opt-students">For F-1 OPT and STEM OPT students</SectionH2>
              <p className="text-sm leading-relaxed text-ink-700">
                Many students early in their careers fall into <strong>Level I or Level II</strong>. The big advantage
                of STEM OPT is <strong>more attempts over multiple years</strong>, and attempts compound:
              </p>
              <div className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm text-ink-700">
                Chance over multiple attempts = 1 − (1 − oneYearChance)<sup>numberOfAttempts</sup>
              </div>
              <p className="text-sm leading-relaxed text-ink-700">
                So even a modest single-year chance grows meaningfully across two to four cap seasons. See{" "}
                <Link href="/h1b-lottery-results-for-f1-opt-students" className="font-semibold text-orange-600 underline">
                  H-1B lottery for F-1 OPT students
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* What does / doesn't help */}
        <section className="bg-white py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <SectionH2 id="what-doesnt-help">What does <em>not</em> improve your odds</SectionH2>
                  <ul className="mt-3 space-y-2 text-sm text-ink-700">
                    {[
                      "Fake job offers",
                      "Duplicate registrations",
                      "Paying anyone for 'guaranteed' selection",
                      "Inflating wage level without real support",
                      "Multiple employers unless each offer is genuine",
                      "Résumé strength alone",
                    ].map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-0.5 flex-none text-rose-500">✕</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <SectionH2>What can legitimately improve your chances</SectionH2>
                  <ul className="mt-3 space-y-2 text-sm text-ink-700">
                    {[
                      "A higher genuine wage level",
                      "A qualifying U.S. master's degree",
                      "More valid attempts via OPT/STEM OPT or another status",
                      "A cap-exempt employer strategy",
                      "A strong backup plan if not selected",
                      "Accurate employer filing and documentation",
                    ].map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-0.5 flex-none text-emerald-600">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-base font-bold text-ink-900">Related guides and tools</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {internalLinks.map((g) => (
                  <Link
                    key={g.href}
                    href={g.href}
                    className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-orange-400 hover:shadow-sm"
                  >
                    <p className="text-sm font-semibold text-ink-900 group-hover:text-orange-700">{g.label}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
