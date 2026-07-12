import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import {
  QuickAnswer,
  QuickAnswers,
  JumpNav,
  EEATBox,
  TrumpClusterNav,
  ChecklistBox,
  WarnBox,
  DataTable,
  ExpertCallout,
  DecisionFlow,
  TrustBox,
  HorizontalTimeline,
  Callout,
  AuthorBio,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  trumpAccountArticleJsonLd,
  trumpAccountAuthorJsonLd,
  trumpAccountHowToJsonLd,
  TRUMP_ACCOUNT_PUBLISHED,
} from "@/lib/trumpAccountCluster";
import {
  age18SpokeFaqs,
  trumpAccountSourceLinks,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  rothScenarioCols,
  rothScenarioRows,
  rothPros,
  rothCons,
  rothChecklist,
  rothTimeline,
  rothMistakes,
  spokeQuickAnswers,
  lifeStageStops,
  governmentResourceLinks,
  type DataCol,
  type DataRow,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-age-18-withdrawal-roth-conversion";
const TITLE =
  "Trump Account at Age 18: Withdrawal Rules & Roth IRA Conversion (Immigrant-Family Guide)";
const META_TITLE = "Trump Account at 18: Withdrawal Rules & Roth Conversion";
const DESC =
  "What happens to a Trump Account at 18: the exact calendar-year withdrawal trigger, how it becomes a traditional IRA, withdrawal tax and the 10% penalty, penalty exceptions, and the Roth conversion window — with the immigrant/cross-border angle.";
const UPDATED_ISO = "2026-07-11";
const UPDATED_HUMAN = "July 11, 2026";

export const metadata: Metadata = pageMetadata({ title: META_TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "The age-18 trigger", href: "#trigger" },
  { label: "Changes vs stays", href: "#changes" },
  { label: "Withdrawal tax", href: "#tax" },
  { label: "Penalty exceptions", href: "#exceptions" },
  { label: "Roth conversion", href: "#roth" },
  { label: "Roth strategies", href: "#roth-strategies" },
  { label: "Roth timeline", href: "#roth-timeline" },
  { label: "Immigrant angle", href: "#immigrant" },
  { label: "FAQ", href: "#faq" },
];

const HOWTO_STEPS = [
  { name: "Pause before withdrawing", text: "At 18, do not cash out on impulse. Confirm custodian access and download contribution, basis, and statement records first." },
  { name: "Confirm the timing", text: "Withdrawals generally cannot start before January 1 of the calendar year the child turns 18 — verify the exact rule with current IRS guidance." },
  { name: "Model the after-tax cost", text: "Add ordinary income tax on the taxable portion, a possible 10% penalty before 59½, state tax, and lost future growth before taking any money out." },
  { name: "Check for a Roth conversion window", text: "In a low-income year, review whether converting part of the balance to a Roth IRA makes sense, subject to current rules." },
  { name: "Handle cross-border facts", text: "For immigrant families, plan U.S. account access and U.S.–India treaty/reporting before any move abroad." },
];

const exceptionsCols: DataCol[] = [
  { key: "exception", label: "Situation" },
  { key: "penalty", label: "10% penalty", highlight: true },
  { key: "tax", label: "Income tax on taxable portion" },
];
const exceptionsRows: DataRow[] = [
  { exception: "Disability", penalty: "Generally waived", tax: "Generally still applies" },
  { exception: "Qualifying medical expenses", penalty: "May be waived", tax: "Generally still applies" },
  { exception: "First-home purchase (limited amount)", penalty: "May be waived on a limited amount", tax: "Generally still applies" },
  { exception: "Birth or adoption costs (limited)", penalty: "May be waived", tax: "Generally still applies" },
  { exception: "Ordinary early withdrawal (no exception)", penalty: "~10% before age 59½", tax: "Applies" },
  { exception: "After age 59½", penalty: "No early-withdrawal penalty", tax: "Applies" },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: TRUMP_ACCOUNT_PUBLISHED,
      dateModified: UPDATED_ISO,
    }),
    trumpAccountAuthorJsonLd(),
    trumpAccountHowToJsonLd({
      path: PATH,
      name: "How to handle a Trump Account when the child turns 18",
      description:
        "A five-step framework for the age-18 decision: pause, confirm timing, model the after-tax cost, check the Roth conversion window, and handle cross-border facts.",
      steps: HOWTO_STEPS,
    }),
    faqJsonLd(age18SpokeFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "Tax Planning", url: "/trump-account-tax-planning-immigrant-families" },
      { name: "Age 18: Withdrawals & Roth Conversion", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-age-18-withdrawal-roth-conversion"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "Age 18 & Roth" },
        ]}
        icon="🎂"
        category="Trump Account · Age 18"
        title="Trump Account at 18: Withdrawal Rules & Roth Conversion"
        hook="What actually happens when the child turns 18 — the exact calendar-year trigger, how the account becomes a traditional IRA, the tax and penalty on withdrawals, the exceptions, and the low-income-year Roth conversion window. With the immigrant angle most guides skip."
        accent="from-indigo-600 to-brand-600"
        sourceNote={<>Last updated: {UPDATED_HUMAN}. Educational overview — verify current IRS / Treasury guidance.</>}
        disclaimerExtra={
          <p>
            Educational only, not personalized tax, legal, or immigration advice. Figures are illustrations, not official
            amounts. Trump Account rules are new and evolving — verify current IRS guidance and consult a professional.
          </p>
        }
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <JumpNav items={JUMP} />
          </div>
        </Container>

        {/* P1 — Updated-for-2026 trust box */}
        <section className="pt-6">
          <Container>
            <TrustBox updated={UPDATED_HUMAN} />
          </Container>
        </section>

        {/* Quick answer */}
        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Quick Answer: what happens to a Trump Account at 18?"
              answer={
                <p>
                  Based on current IRS guidance, withdrawals generally cannot start before <strong>January 1 of the
                  calendar year the child turns 18</strong>, and the account is then generally treated as a{" "}
                  <strong>traditional IRA</strong>. Withdrawals of the taxable portion are ordinary income, a ~10% penalty
                  may apply before 59½, and a Roth conversion generally becomes possible — but nothing forces a withdrawal
                  at 18.
                </p>
              }
              bullets={[
                "The trigger is a calendar year, not the birthday — a December birthday still unlocks on January 1 of that year.",
                "After 18 it follows traditional-IRA rules: ordinary income tax, ~10% penalty before 59½, standard exceptions.",
                "A Roth conversion is generally available starting the year the child turns 18 — best in a low-income year.",
                "Doing nothing (staying invested) is usually the most valuable choice.",
                "Immigrant families must add visa status, SSN, and a possible move to India to the decision.",
              ]}
              ctaText="See the exact age-18 trigger"
              ctaHref="#trigger"
            />
            {/* P8 — Quick answers */}
            <div className="mt-4">
              <QuickAnswers items={spokeQuickAnswers} />
            </div>
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <EEATBox lastUpdated={UPDATED_HUMAN} />
            </div>
          </Container>
        </section>

        {/* P6 — visual life-stage timeline */}
        <section className="pb-4">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card sm:p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">The life of the account</p>
              <HorizontalTimeline stops={lifeStageStops} />
            </div>
          </Container>
        </section>

        {/* Trigger */}
        <section id="trigger" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The exact age-18 trigger: a calendar year, not a birthday</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  This is the detail most families get wrong. Based on current IRS guidance, amounts generally cannot be
                  withdrawn from a Trump Account before <strong>January 1 of the calendar year in which the child turns
                  18</strong>. It is tied to the calendar year, not the exact birthday.
                </p>
                <p>
                  So a child whose 18th birthday falls in December can generally access the account from January 1 of that
                  same year — not twelve months later. After that point the account is generally treated as a traditional
                  IRA and follows the same rules as other traditional IRAs.
                </p>
              </div>
              <div className="mt-5">
                <WarnBox title="Verify before you rely on this">
                  <p>
                    The program is new. Confirm the exact timing and treatment against current IRS guidance (Notice
                    2025-68 and later regulations) before making a decision on a specific date.
                  </p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        {/* Changes vs stays */}
        <section id="changes" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What changes at 18 — and what stays the same</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                The headlines focus on what the child <em>can</em> now do. The more reassuring half is what does not
                change: staying invested and doing nothing is a perfectly valid plan.
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">What changes</p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-700">
                    {[
                      "Control generally shifts to the now-adult child.",
                      "Withdrawals become possible (taxable, with a possible penalty before 59½).",
                      "Growth-period investment restrictions generally ease.",
                      "The adult child handles their own tax reporting.",
                      "A Roth conversion generally becomes possible (confirm current rules).",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <span className="mt-0.5 flex-none text-amber-600" aria-hidden>
                          →
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ChecklistBox
                  title="What stays the same"
                  items={[
                    "Nothing forces a withdrawal at 18 — doing nothing is valid.",
                    "Tax basis and after-tax contribution tracking carry over.",
                    "The full account history and records are retained.",
                    "The money keeps compounding if left invested.",
                    "Same custodian unless the child transfers it.",
                  ]}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Withdrawal tax */}
        <section id="tax" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The withdrawal tax reality</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  Because the account is generally treated as a traditional IRA after 18, the taxable portion of a
                  withdrawal is taxed as <strong>ordinary income</strong> at the child&apos;s marginal rate — not at lower
                  long-term capital-gains rates. Any after-tax basis generally comes back tax-free.
                </p>
                <p>
                  On top of income tax, a <strong>10% early-withdrawal penalty</strong> may apply before age 59½ unless an
                  exception applies. The useful question is never &ldquo;can we withdraw?&rdquo; but &ldquo;what is the
                  after-tax cost — including the growth we give up?&rdquo;
                </p>
                <p>
                  For 25+ worked scenarios with illustrative numbers, see the{" "}
                  <Link
                    href="/trump-account-tax-planning-immigrant-families#scenarios"
                    className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    full tax-planning guide
                  </Link>
                  .
                </p>
              </div>
              <div className="mt-5">
                <Callout kind="reminder" title="Tax reminder">
                  <p>
                    &ldquo;Penalty-free&rdquo; after 59½ is not the same as &ldquo;tax-free.&rdquo; The taxable portion of
                    a withdrawal is ordinary income at any age — only the 10% early-withdrawal penalty goes away at 59½.
                  </p>
                </Callout>
              </div>
            </div>
          </Container>
        </section>

        {/* Exceptions */}
        <section id="exceptions" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">10% penalty exceptions (and what they do NOT waive)</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Because it becomes a traditional IRA, the usual IRA exceptions generally apply. The key nuance: an
                exception typically waives the <strong>penalty</strong>, not the income tax.
              </p>
              <div className="mt-5">
                <DataTable columns={exceptionsCols} rows={exceptionsRows} keyRows={["After age 59½"]} />
              </div>
              <p className="mt-3 rounded-lg border-l-4 border-brand-400 bg-brand-50/50 px-4 py-2 text-sm text-ink-700">
                <strong className="text-ink-900">Key takeaway:</strong> exceptions can remove the 10% penalty, but the
                taxable portion is still ordinary income. Verify which exceptions currently apply to a Trump Account.
              </p>
            </div>
          </Container>
        </section>

        {/* Roth conversion */}
        <section id="roth" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The Roth conversion window</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  Initial guidance indicates a Trump Account can generally be converted to a Roth IRA starting the year the
                  child turns 18. The pre-tax amount converted is taxed as ordinary income that year — so a{" "}
                  <strong>low-income year</strong> (college, a gap year, between jobs), where the standard deduction
                  absorbs much of it, can make the tax very small or near zero.
                </p>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-sm text-ink-700">
                  <p className="font-bold text-emerald-800">Convert in a low-income year</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>Little or no tax now (standard deduction absorbs much of it).</li>
                    <li>Then grows tax-free in a Roth for decades.</li>
                    <li>No RMDs for the original owner; qualified withdrawals are tax-free.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 text-sm text-ink-700">
                  <p className="font-bold text-rose-800">Never convert</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>The grown balance is taxed as ordinary income when withdrawn.</li>
                    <li>In a high-earning year that can be thousands more in tax.</li>
                    <li>RMDs may later force taxable distributions you didn&apos;t need.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-5">
                <WarnBox title="A conversion is not automatically best">
                  <p>
                    A conversion adds to that year&apos;s taxable income and can affect financial aid, brackets, and state
                    tax. Confirm a conversion is permitted under current rules, and review it case by case with a
                    professional. Numbers here are illustrative.
                  </p>
                </WarnBox>
              </div>

              {/* Should I convert immediately at 18? */}
              <h3 className="mt-8 text-base font-bold text-ink-900">Should I convert everything immediately at 18?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Usually not all at once. A single large conversion can spill out of the low brackets and into higher
                ones. Spreading smaller conversions across several low-income years is generally the most tax-efficient
                path. Here is the decision in one flow:
              </p>
              <div className="mx-auto mt-4 max-w-md">
                <DecisionFlow
                  title="Roth conversion decision"
                  nodes={[
                    { text: "Child is 18+ and conversion is permitted", kind: "start" },
                    { text: "Is this a low-income year?", kind: "decision", branch: "No → wait" },
                    { text: "Convert only enough to fill the low bracket", kind: "action", branch: "Yes" },
                    { text: "Check FAFSA + state tax for that year", kind: "decision", branch: "Then" },
                    { text: "Repeat across low-income years as needed", kind: "end" },
                  ]}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Roth strategies */}
        <section id="roth-strategies" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Roth conversion strategies compared</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Seven ways families approach conversion, with illustrative tax outcomes. The low-income, spread-out
                approaches almost always win.
              </p>
              <div className="mt-5">
                <DataTable
                  columns={rothScenarioCols}
                  rows={rothScenarioRows}
                  keyRows={["Convert over 3–5 low-income years", "Convert in a high-income year"]}
                />
              </div>
              <p className="mt-3 rounded-lg border-l-4 border-brand-400 bg-brand-50/50 px-4 py-2 text-sm text-ink-700">
                <strong className="text-ink-900">Key takeaway:</strong> spreading small conversions across low-income
                years is usually cheapest; converting in a high-income year is usually the worst.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ChecklistBox title="Advantages of converting" items={rothPros} />
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Disadvantages / cautions</p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-700">
                    {rothCons.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <span className="mt-0.5 flex-none text-rose-500" aria-hidden>
                          ✕
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                <ExpertCallout scenario="for a gap-year conversion">
                  <p>
                    A gap year with almost no income is one of the cleanest windows. I&apos;d convert an amount that stays
                    within the standard deduction and lower brackets, so the tax is minimal and the money starts growing
                    tax-free for decades.
                  </p>
                </ExpertCallout>
                <ExpertCallout scenario="for a graduate-school year">
                  <p>
                    Grad school often means several low-income years in a row — a good multi-year conversion runway.
                    I&apos;d convert a steady, modest amount each year rather than one lump, keeping every year in a low
                    bracket.
                  </p>
                </ExpertCallout>
              </div>
              <div className="mt-3">
                <ExpertCallout scenario="if the only option is a high-income year">
                  <p>
                    If income is already high, I&apos;d usually wait. Converting into the 24%+ brackets gives back much of
                    the benefit. The exception is a deliberate, small conversion as part of a longer multi-year plan —
                    reviewed with a professional first.
                  </p>
                </ExpertCallout>
              </div>
            </div>
          </Container>
        </section>

        {/* Roth timeline + checklist + mistakes */}
        <section id="roth-timeline" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Conversion timeline, checklist &amp; common mistakes</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                A rough life-stage map of when conversions tend to make sense, what to check first, and the mistakes to
                avoid.
              </p>
              <ol className="mt-5 space-y-3">
                {rothTimeline.map((s, i) => (
                  <li key={s.name} className="flex gap-3 rounded-xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{s.name}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ChecklistBox title="Before you convert: checklist" tone="brand" items={rothChecklist} />
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Common conversion mistakes</p>
                  <ul className="mt-3 space-y-2 text-sm text-amber-900">
                    {rothMistakes.map((m) => (
                      <li key={m} className="flex items-start gap-2">
                        <span className="mt-0.5 flex-none" aria-hidden>
                          ⚠️
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Immigrant angle */}
        <section id="immigrant" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The immigrant &amp; cross-border angle</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  The core rules are the same for everyone, but immigrant families carry extra layers. A U.S.-citizen child
                  keeps lifelong U.S. tax filing duties wherever they live. If the family or child later becomes an Indian
                  resident, India may tax withdrawals, and the U.S.–India treaty may relieve double taxation.
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Confirm the child's SSN and citizenship — an ITIN does not qualify for the account.",
                    "Plan U.S. provider access and 2-factor before any move abroad.",
                    "Time any withdrawal or conversion for a low-income U.S. year.",
                    "Get cross-border advice before a move to India or abandoning a green card.",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-0.5 flex-none text-brand-500">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5">
                <Callout kind="crossborder" title="Cross-border consideration">
                  <p>
                    A U.S.-citizen child keeps lifelong U.S. tax filing duties wherever they live. Once the child is an
                    Indian tax resident, India may also tax a withdrawal — the U.S.–India treaty may relieve double tax,
                    but the outcome depends on residency and current law. Get advice before the first withdrawal abroad.
                  </p>
                </Callout>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Link
                  href="/trump-account-tax-planning-immigrant-families"
                  className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  Full tax-planning guide →
                </Link>
                <Link
                  href="/trump-account-vs-529-for-h1b-families"
                  className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  Trump Account vs 529 →
                </Link>
                <Link
                  href="/trump-account-moving-back-to-india"
                  className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  Moving back to India →
                </Link>
                <Link
                  href="/trump-account-h1b-immigrant-families"
                  className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
                >
                  Main H-1B guide →
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Official sources + P2 government resources */}
        <section className="border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <OfficialSourceBox
                intro="Trump Account rules, timing, and tax treatment are set by the IRS and Treasury and can change. Figures on this page are illustrations — verify current guidance with the official sources:"
                links={trumpAccountSourceLinks}
              />
              <OfficialSourceBox
                title="Official government resources"
                intro="Authoritative federal resources for further reading — distinct from our educational commentary above:"
                links={governmentResourceLinks}
              />
            </div>
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
            <ToolFaq items={age18SpokeFaqs} />
          </Container>
        </section>

        {/* Next steps */}
        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Full tax-planning guide", href: "/trump-account-tax-planning-immigrant-families", primary: true },
                { label: "Trump Account vs 529", href: "/trump-account-vs-529-for-h1b-families" },
                { label: "Moving back to India", href: "/trump-account-moving-back-to-india" },
              ]}
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-ink-400">{TRUMP_ACCOUNT_SHORT_DISCLAIMER}</p>
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-ink-400">{TRUMP_ACCOUNT_DISCLAIMER}</p>
          </Container>
        </section>

        {/* P13 — Author bio */}
        <section className="pb-6">
          <Container>
            <AuthorBio />
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
