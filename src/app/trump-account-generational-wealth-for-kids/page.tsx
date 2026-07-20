import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import TrumpAccountMillionaireCalculator from "@/components/tools/TrumpAccountMillionaireCalculator";
import {
  QuickAnswer,
  JumpNav,
  WhichPageBlock,
  EEATBox,
  TrumpClusterNav,
  ProseSections,
  WarnBox,
  DataTable,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  trumpAccountWebAppJsonLd,
  trumpAccountArticleJsonLd,
  trumpAccountAuthorJsonLd,
  TRUMP_ACCOUNT_PUBLISHED,
} from "@/lib/trumpAccountCluster";
import {
  wealthAccountCols,
  wealthAccountRows,
  generationalWealthRisks,
  generationalWealthFaqs,
  trumpAccountSourceLinks,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
} from "@/data/trumpAccountData";
import { projectedValueAtAge, type ProjectionInput } from "@/lib/trumpAccountProjection";
import { formatUsd } from "@/lib/format";

const PATH = "/trump-account-generational-wealth-for-kids";
const TITLE = "Trump Account Generational Wealth: How $5,000 a Year Could Grow for Your Child";
const DESC =
  "Learn how a Trump Account could help families build generational wealth for children through early investing, tax-deferred growth, the $1,000 federal contribution, and yearly contributions up to $5,000.";
const UPDATED_ISO = "2026-07-07";
const UPDATED_HUMAN = "July 7, 2026";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Why it matters", href: "#why" },
  { label: "Growth table", href: "#growth" },
  { label: "Millionaire?", href: "#millionaire" },
  { label: "Immigrant families", href: "#immigrant" },
  { label: "vs 529 & others", href: "#compare" },
  { label: "Move back to India", href: "#move-back" },
  { label: "Grandparents", href: "#grandparents" },
  { label: "Risks", href: "#risks" },
  { label: "Calculator", href: "#calculator" },
  { label: "FAQ", href: "#faq" },
];

/* ---- Static projection table (built from the shared projection math so it
   never drifts from the calculator). $5,000/year for 18 years, newborn, no
   seed. Illustrative only. ---- */
const RETURN_RATES = [6, 7, 8, 10];
const baseProj = (rate: number): ProjectionInput => ({
  childCurrentAge: 0,
  startingBalance: 0,
  includeSeed: false,
  annualContribution: 5000,
  contributionYears: 18,
  annualReturnPct: rate,
});
const fmt = (v: number | null) => (v === null ? "—" : formatUsd(v));

const projectionCols = [
  { key: "rate", label: "Assumed annual return" },
  { key: "a18", label: "At age 18", highlight: true },
  { key: "a30", label: "At age 30" },
  { key: "a40", label: "At age 40" },
  { key: "a50", label: "At age 50", highlight: true },
];
const projectionRows = RETURN_RATES.map((rate) => {
  const p = baseProj(rate);
  return {
    rate: `${rate}%`,
    a18: fmt(projectedValueAtAge(p, 18)),
    a30: fmt(projectedValueAtAge(p, 30)),
    a40: fmt(projectedValueAtAge(p, 40)),
    a50: fmt(projectedValueAtAge(p, 50)),
  };
});
// Effect of adding the $1,000 federal seed at birth, at 7%, by age 50.
const seedAt50 =
  (projectedValueAtAge({ ...baseProj(7), includeSeed: true }, 50) ?? 0) -
  (projectedValueAtAge(baseProj(7), 50) ?? 0);

const WHY_SECTIONS = [
  {
    h: "Starting early is the biggest advantage",
    id: "why-early",
    body: (
      <p>
        The single most powerful input in long-term investing is time. Money invested for a newborn has nearly two
        decades of growth before the child is even an adult — and potentially five decades before retirement age. That
        head start is hard to replicate later.
      </p>
    ),
  },
  {
    h: "Compounding has more time to work",
    body: (
      <p>
        Compounding means earnings start earning their own returns. Over a few years the effect is small; over 30–50
        years it can dominate. Most of a long-term account&apos;s final value often comes from growth in the later
        decades, not the contributions themselves.
      </p>
    ),
  },
  {
    h: "The $1,000 pilot can act as a seed",
    body: (
      <p>
        For eligible U.S.-citizen children born after December 31, 2024 and before January 1, 2029, a one-time $1,000
        federal contribution can start the account. It is a seed, not a plan — its value is that it begins compounding
        early.
      </p>
    ),
  },
  {
    h: "Consistent yearly contributions build the base",
    body: (
      <p>
        Adding up to $5,000 per year during childhood turns a small seed into a meaningful base. Consistency matters
        more than any single large deposit — steady contributions through market ups and downs are what compound.
      </p>
    ),
  },
  {
    h: "It can teach financial ownership",
    body: (
      <p>
        Because the child is the account owner, a Trump Account can become a real-world lesson in investing discipline,
        patience, and long-term thinking as the child grows up watching it.
      </p>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({
      path: PATH,
      name: "Trump Account Millionaire Calculator",
      description:
        "Estimate how a Trump Account could grow over decades with early contributions and compounding — an educational projection for families.",
    }),
    trumpAccountArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: TRUMP_ACCOUNT_PUBLISHED,
      dateModified: UPDATED_ISO,
    }),
    trumpAccountAuthorJsonLd(),
    faqJsonLd(generationalWealthFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "Generational Wealth for Kids", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-generational-wealth-for-kids"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "Generational Wealth" },
        ]}
        icon="📈"
        category="Child Wealth Building"
        title="Trump Account Generational Wealth: Can $5,000 a Year Make Your Child a Millionaire?"
        hook="A Trump Account's biggest gift to a child is time. See how early, consistent investing could compound over decades — and what H-1B, NRI, and move-back-to-India families should weigh."
        accent="from-emerald-600 to-brand-600"
        sourceNote={<>Last updated: {UPDATED_HUMAN}. Verified against IRS / Treasury / TrumpAccounts.gov guidance.</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <JumpNav items={JUMP} />
          </div>
        </Container>

        {/* Quick answer */}
        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Can a Trump Account build generational wealth for a child?"
              answer={
                <>
                  <p>
                    A Trump Account could become a powerful generational-wealth tool because it lets money start
                    compounding while a child is very young. If a family contributes up to $5,000 per year during
                    childhood and leaves the money invested for decades, the account could potentially grow into hundreds
                    of thousands — or even millions — by the child&apos;s 40s or 50s.
                  </p>
                  <p>
                    But returns are not guaranteed, taxes still matter, and immigrant families should also weigh SSN,
                    citizenship, move-back-to-India, and cross-border tax issues before relying on any projection.
                  </p>
                </>
              }
              ctaText="Jump to the millionaire calculator"
              ctaHref="#calculator"
            />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <WhichPageBlock currentHref={PATH} />
              <EEATBox lastUpdated={UPDATED_HUMAN} />
            </div>
          </Container>
        </section>

        {/* What is a Trump Account */}
        <section id="what-is" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What is a Trump Account?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  A Trump Account is a child investment account created under current U.S. tax law — structured as a type
                  of traditional IRA established for the exclusive benefit of an eligible child. The child owns it; a
                  parent or responsible party manages it while the child is a minor.
                </p>
                <p>
                  It&apos;s generally for eligible children under 18 with a valid Social Security number. A narrower,
                  one-time $1,000 federal pilot contribution applies to U.S.-citizen children born after December 31,
                  2024 and before January 1, 2029, with a valid SSN. Contributions cannot be made before July 4, 2026,
                  and during the growth period investments are restricted to eligible low-cost index funds/ETFs.
                </p>
                <p>
                  New here? Start with the{" "}
                  <Link
                    href="/trump-account-h1b-immigrant-families"
                    className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    main Trump Account guide for immigrant families
                  </Link>
                  , then come back to plan for long-term wealth.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Why generational wealth */}
        <section id="why" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections
              heading="Why Trump Accounts could become a generational wealth opportunity"
              sections={WHY_SECTIONS}
            />
          </Container>
        </section>

        {/* Growth table */}
        <section id="growth" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How $5,000 per year could grow by age 18, 30, 40, and 50</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                These scenarios assume $5,000 contributed at the end of each year for 18 years starting at birth — a
                total of {formatUsd(90000)} in family contributions — then left invested with no further deposits. Values
                use annual compounding at four different assumed return rates. The $1,000 federal seed is shown
                separately below.
              </p>
              <div className="mt-4">
                <DataTable columns={projectionCols} rows={projectionRows} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Adding the one-time $1,000 federal seed at birth (for an eligible child) would add roughly{" "}
                <strong>{formatUsd(seedAt50)}</strong> more by age 50 at a 7% return — a small illustration of how early
                a dollar starts working.
              </p>
              <div className="mx-auto mt-5 max-w-3xl">
                <WarnBox title="These are projections, not guarantees">
                  <p>
                    Actual results depend on market performance, investment fees, taxes, contribution timing, withdrawal
                    timing, and future rule changes. No return rate is promised or typical — markets can and do lose
                    value.
                  </p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        {/* Millionaire? */}
        <section id="millionaire" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Could a Trump Account make a child a millionaire?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>Possibly — with a long enough time horizon and consistent contributions. On these illustrative assumptions:</p>
                <ul className="space-y-1.5">
                  <li className="flex gap-2">
                    <span className="mt-0.5 flex-none text-brand-500">•</span>
                    At a 6% return, the account may approach $1M around age 50.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 flex-none text-brand-500">•</span>
                    At 7%–8%, it may cross $1M before or around age 50.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 flex-none text-brand-500">•</span>
                    At higher returns the account could grow much larger — but higher expected returns usually mean
                    higher risk and bigger swings along the way.
                  </li>
                </ul>
                <p>
                  No specific result is promised. Whether the account ever reaches $1,000,000 depends on real returns,
                  fees, taxes, and how long the money stays invested. Use the{" "}
                  <a href="#calculator" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                    calculator below
                  </a>{" "}
                  to test your own numbers.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Immigrant families */}
        <section id="immigrant" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Why this matters for H-1B and Indian immigrant families</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  Many immigrant families arrive in the U.S. later in life and spend years catching up financially —
                  building credit, buying a home, and saving for college all at once. A U.S.-born child, by contrast, may
                  have the chance to begin U.S. investing from birth.
                </p>
                <p>
                  H-1B parents often focus on visa status, home buying, college, and green-card planning. Long-term child
                  wealth planning deserves a place on that list too. A Trump Account can be one part of a broader child
                  wealth plan — not the entire plan — alongside a 529, emergency savings, and cross-border tax planning.
                </p>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <Link href="/can-h1b-parents-open-trump-account-for-child" className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700">
                  Can H-1B parents open one? →
                </Link>
                <Link href="/trump-account-ssn-itin-child" className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700">
                  SSN vs ITIN rules →
                </Link>
                <Link href="/trump-account-moving-back-to-india" className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700">
                  Moving back to India →
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Compare */}
        <section id="compare" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Trump Account vs 529 vs custodial brokerage for building wealth</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                A 529 is education-focused. A Trump Account is long-term, retirement-style wealth. A custodial brokerage
                is flexible but taxable. A Roth IRA for a child can be powerful but generally requires the child&apos;s
                earned income. A Trump Account should not automatically replace a 529 plan — match the account to your
                goal.
              </p>
              <div className="mt-4">
                <DataTable columns={wealthAccountCols} rows={wealthAccountRows} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                For a deeper head-to-head built for immigrant families, read{" "}
                <Link href="/trump-account-vs-529-for-h1b-families" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  Trump Account vs 529 for H-1B families
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* Move back to India */}
        <section id="move-back" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What if the family moves back to India?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  The account belongs to the child. Leaving the U.S. does not automatically remove the child&apos;s U.S.
                  citizenship or the child&apos;s ownership of the account. The practical issues are access and tax:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex gap-2">
                    <span className="mt-0.5 flex-none text-brand-500">•</span>
                    Provider access matters: a foreign address, an Indian phone number, 2-factor authentication, a U.S.
                    bank link, and app login can all affect whether you can manage the account from India.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 flex-none text-brand-500">•</span>
                    A U.S.-citizen child may still have U.S. tax and reporting responsibilities later, regardless of where
                    they live.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 flex-none text-brand-500">•</span>
                    Indian tax residency may affect how the account&apos;s income is treated in India once you return.
                  </li>
                </ul>
                <p>
                  Read the full checklist in{" "}
                  <Link href="/trump-account-moving-back-to-india" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                    what happens to a Trump Account if you move back to India
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Grandparents */}
        <section id="grandparents" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Should grandparents contribute?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  Grandparents often want to help build wealth for a grandchild early, and others may contribute up to
                  the aggregate annual limit, subject to current rules. A grandparent&apos;s contribution is generally
                  treated as a gift to the child.
                </p>
                <p>
                  For Indian families, cross-border gifts from India should be reviewed carefully. U.S. gift-tax
                  reporting, Indian remittance rules, FEMA/LRS limits, and documentation may all matter. This is general
                  education, not personalized legal or tax advice — talk to a qualified cross-border advisor before
                  sending funds across borders.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Risks */}
        <section id="risks" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Risks and mistakes to avoid</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {generationalWealthRisks.map((r) => (
                  <div key={r.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Calculator */}
        <section id="calculator" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <TrumpAccountMillionaireCalculator />
            </div>
          </Container>
        </section>

        {/* Bottom line */}
        <section id="bottom-line" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Bottom line</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                A Trump Account is not magic, and it does not guarantee wealth. But if used carefully, it can give a child
                one of the biggest advantages in investing: time. For immigrant families — especially H-1B and NRI parents
                with U.S.-born children — the account may become a useful part of a broader child wealth plan alongside
                college savings, emergency funds, tax planning, and move-back-to-India planning.
              </p>
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox
              title="Official IRS and Treasury sources"
              intro="Trump Account rules, amounts, and investment options are set by the IRS and Treasury and can change. Verify current guidance with the official sources:"
              links={trumpAccountSourceLinks}
            />
          </Container>
        </section>

        {/* Cluster nav */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={generationalWealthFaqs} />
          </Container>
        </section>

        {/* Next steps */}
        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Trump Account vs 529", href: "/trump-account-vs-529-for-h1b-families", primary: true },
                { label: "$1,000 eligibility", href: "/trump-account-1000-eligibility" },
                { label: "Tax rules for immigrants", href: "/trump-account-tax-rules-immigrants" },
                { label: "Main H-1B guide", href: "/trump-account-h1b-immigrant-families" },
              ]}
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-ink-400">{TRUMP_ACCOUNT_SHORT_DISCLAIMER}</p>
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
