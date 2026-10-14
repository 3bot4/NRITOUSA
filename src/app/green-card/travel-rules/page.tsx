import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import TripRiskChecker from "@/components/tools/TripRiskChecker";
import {
  IceDetentionChart,
  IceMonthlyChart,
  AbsenceTierChart,
  SeekingAdmissionFlow,
  InstrumentComparisonChart,
} from "@/components/tools/gc-travel/GcTravelVisuals";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";
import {
  ABANDONMENT_FACTORS,
  ABSENCE_TIERS,
  AIRPORT_SCENARIOS,
  DOCUMENT_SITUATIONS,
  FIND_A_LAWYER,
  GC_TRAVEL_FEES,
  GC_TRAVEL_FEE_SOURCE,
  GC_TRAVEL_PUBLISHED,
  GC_TRAVEL_SOURCES as SRC,
  GC_TRAVEL_UPDATED,
  GC_TRAVEL_VERIFIED,
  I407,
  ICE_ADP_BY_FY,
  ICE_ADP_READING,
  ICE_ADP_SOURCE,
  INSTRUMENTS,
  LAWYER_TIMING,
  N470_ELIGIBILITY,
  ONE_YEAR_MECHANIC,
  RIGHTS,
  SB1_REQUIREMENTS,
  SEEKING_ADMISSION,
} from "@/data/greenCardTravelData";
import {
  KIND_LABELS,
  KIND_NOTES,
  trackerEntries,
  trackerLastUpdated,
} from "@/lib/iceDetentionTracker";

/**
 * /green-card/travel-rules — the LPR travel pillar, plus the ICE detention
 * tracker.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE PAGE IS WRITTEN FROM THE STATUTE DOWN.
 *
 * INA 101(a)(13)(C) first, day counts second. A returning permanent resident
 * is NOT an applicant for admission unless one of six conditions applies, and
 * everything else here is downstream of which side of that line a trip falls
 * on. Every competitor page starts from "how long can I be away". Do not
 * reorder this.
 *
 * TWO REGIMES, NEVER MERGED:
 *   (a) card as an entry document — 8 CFR 211.1(a)(2), 211.3 — one year
 *   (b) continuous residence for N-400 — 8 CFR 316.5(c)(1) — six months, one year
 * A seven-month trip breaks nothing in (a) and raises a presumption in (b).
 *
 * TONE. The three biggest keywords are detention queries, so the readers are
 * frightened. Calm, factual, sourced. No prediction about any individual. The
 * detention chart says in its own caption that ICE does not publish the
 * population by immigration status.
 *
 * Does NOT own, and only summarises with a link:
 *   Expired card travel, ADIT stamps   → /green-card-renewal, /replace-green-card
 *   Secondary inspection, devices      → /h1b-denied-entry-airport
 *   Pending I-485 and advance parole    → /uscis/travel-to-india-while-i485-pending
 *   Keep vs give up the card, exit tax  → /return-to-india
 *   Form I-131 as a form                → /uscis/forms/i-131
 *   H-1B family travel                  → /h1b/travel-to-india
 * See docs/seo/oct-2026-cluster/overlap-report.md §3.5.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const PAGE_PATH = "/green-card/travel-rules";
const TRACKER = trackerEntries();
const TRACKER_UPDATED = trackerLastUpdated();
const LATEST_ADP = ICE_ADP_BY_FY[ICE_ADP_BY_FY.length - 1];
const FY21_ADP = ICE_ADP_BY_FY.filter((d) => d.fy === 2021)[0];

export const metadata: Metadata = pageMetadata({
  title: "Green Card Travel Rules: 180 Days, 1 Year, and the I-407 You Need Not Sign",
  description:
    "A returning permanent resident is not an applicant for admission unless one of six conditions in INA 101(a)(13)(C) applies. The absence thresholds, the reentry permit and the N-470 nobody writes about, what to do if asked to sign Form I-407, and a dated tracker of ICE detention policy with ICE's own figures.",
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: GC_TRAVEL_PUBLISHED, modifiedTime: GC_TRAVEL_UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Green Card Guide", url: "/green-card" },
  { name: "Travel Rules", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Can you travel with a green card?",
    answer:
      "Yes. For a temporary absence of less than one year your green card is itself a valid entry document under 8 CFR 211.1(a)(2), and you need your passport alongside it. The useful framing is the statute rather than the day count: INA 101(a)(13)(C) says a returning lawful permanent resident is not regarded as seeking admission unless one of six conditions applies. For an ordinary trip, none does — you are a resident coming home, and the grounds of inadmissibility in INA 212(a) are not applied to you.",
  },
  {
    question: "How long can a green card holder stay outside the US?",
    answer:
      "Three different answers, because three different rules apply. Your card works as an entry document for an absence of less than one year. Continuous residence for naturalisation is disrupted by a single absence of more than six months unless you rebut the presumption, and broken by one of a year or more. And past 180 continuous days you are treated as seeking admission under INA 101(a)(13)(C)(ii), which changes the character of the inspection. A trip of seven months therefore leaves your card perfectly valid while putting your naturalisation clock in question.",
  },
  {
    question: "What happens if a green card holder stays out of the US for more than a year?",
    answer:
      "The card stops being the document that gets you back in. 8 CFR 211.1(a)(2) covers an absence of less than one year; past that you need a reentry permit (Form I-327), which has to be applied for while you are still inside the United States, or an SB-1 returning resident visa at a consulate, or a discretionary waiver of the document requirement at the port of entry. 8 CFR 211.3 measures the year to the moment you board, not the moment you land, so boarding on day 364 is inside the rule.",
  },
  {
    question: "Do I have to sign Form I-407 at the airport?",
    answer:
      "No. Form I-407 records a voluntary abandonment of permanent resident status, and there is no obligation to sign it at a port of entry. If CBP believes you have abandoned the status and you do not agree, the route is removal proceedings before an immigration judge, where you can be represented and where the government has to prove its case. Signing the form gives up that process, and there is no practical way to undo it. You may say that you do not wish to abandon your status and that you would like an immigration judge to decide.",
  },
  {
    question: "What is a reentry permit and when do I need one?",
    answer:
      "A reentry permit, applied for on Form I-131, produces Form I-327 and serves as your entry document in place of the green card for an extended absence. The fee is $630, paper filing only. The sequencing is what catches people: you must be physically present in the United States to file it, and biometrics are taken here, so it cannot be arranged from India once you have already left. It is also generally valid for up to two years, and — the part most guides omit — it does nothing at all for your naturalisation clock.",
  },
  {
    question: "What is Form N-470 and why does nobody mention it?",
    answer: `Form N-470 preserves continuous residence for naturalisation through an absence of a year or more, under INA 316(b). The fee is $420, and it is the only instrument that protects the naturalisation clock — a reentry permit does not. But it is narrower than most summaries suggest, and that is the main thing to know: it requires a year of unbroken US presence first, and it requires qualifying employment with one of four specific kinds of employer — the US Government, an American institution of research, an American firm engaged in developing US foreign trade and commerce (or a majority-owned subsidiary), or a public international organisation the US belongs to — plus certain religious work. A transfer to your employer's Indian entity, a job with an Indian company, a spouse's posting or family care are not qualifying employment, however long the absence. Two further limits: it does not replace a reentry permit, and it does not waive the separate physical-presence requirement unless the employment is by or under contract with the US Government.`,
  },
  {
    question: "Are green card holders being detained at the airport?",
    answer: `Practitioners and national news outlets have reported cases of long-settled permanent residents being held on return, most often where there is a criminal conviction in their history, including convictions many years old. The legal mechanism is not new: INA 101(a)(13)(C)(v) brings a returning resident who has committed an offence identified in INA 212(a)(2) inside the definition of seeking admission, and that subsection carries no time limit. Separately, ICE's own published statistics show the average daily detention population rising from ${FY21_ADP.adp.toLocaleString(
      "en-US",
    )} in FY2021 to ${LATEST_ADP.adp.toLocaleString(
      "en-US",
    )} across the first ten months of FY2026. ICE does not publish that population by immigration status, so it cannot be read as a risk figure for a returning green card holder. The practical response is unchanged: know which side of 101(a)(13)(C) your trip falls on, carry the evidence, and get advice before travelling if any of the six conditions could be in play.`,
  },
  {
    question: "Can ICE detain a green card applicant with a pending I-485?",
    answer:
      "Someone with a pending I-485 is not yet a permanent resident, so INA 101(a)(13)(C) does not protect them at all — they are an applicant for admission, or a parolee returning on advance parole. The travel rules are completely different and the downside is different too: departing without an approved advance parole in hand is generally treated as abandoning the application. Our guide to travelling to India with a pending I-485 covers it, and this page is not built for that situation.",
  },
  {
    question: "What documents should a green card holder carry when travelling?",
    answer:
      "For an ordinary trip, the card and a valid passport. For an absence over six months, add the evidence 8 CFR 316.5(c)(1)(i) itself names: that you did not end your US employment, that your immediate family stayed, that you kept full access to your US home, and that you did not take employment abroad — plus your most recent US tax return filed as a resident. For an absence over a year, the reentry permit. Keep all of it in hand luggage, and carry an immigration attorney's number on paper rather than only in your phone.",
  },
  {
    question: "Does filing taxes as a nonresident affect my green card?",
    answer: `Yes, and more than people expect. 8 CFR 316.5(c)(2) says that a permanent resident who voluntarily claims nonresident alien status to qualify for special tax exemptions, or who fails to file federal or state returns because they consider themselves a nonresident alien, raises a rebuttable presumption that they have relinquished the privileges of permanent resident status. For an NRI family spending years in India it is the single most consequential tax decision there is — an immigration decision disguised as a tax one.`,
  },
  {
    question: "What is an SB-1 returning resident visa?",
    answer:
      "An immigrant visa for a permanent resident who has been outside the United States beyond the reach of their documents, applied for on Form DS-117 at a consulate. You generally have to establish that you were a permanent resident when you left, that you departed intending to return and have not abandoned that intention, and that you are returning from a temporary visit abroad — and if the stay was protracted, that it was caused by reasons beyond your control and for which you were not responsible. That last condition does the work, and it is why the SB-1 is the hardest of the three routes.",
  },
  {
    question: "Does a reentry permit protect my citizenship application?",
    answer:
      "No, and conflating the two is the costliest mistake in this area. A reentry permit answers the document question: it gets you back in. Continuous residence for naturalisation is a separate regime under 8 CFR 316.5(c), with its own six-month and one-year thresholds, and an absence of a year or more breaks it whether or not you held a permit. The only instrument that protects the naturalisation clock is Form N-470 — and because N-470 is limited to specific qualifying employment, many people in this position have no instrument at all and are looking at filing four years and one day after they return.",
  },
];

const jsonLd = jsonLdGraph(
  {
    "@type": "Article",
    "@id": `${absoluteUrl(PAGE_PATH)}#article`,
    headline:
      "Green card travel rules: the statute, the thresholds, and a dated ICE detention tracker",
    description:
      "INA 101(a)(13)(C) decides whether a returning permanent resident is an applicant for admission at all. The absence tiers across both regimes, the reentry permit, N-470 and SB-1 compared, Form I-407 at the airport, know-your-rights sourced to statute, and ICE's own detention figures.",
    datePublished: GC_TRAVEL_PUBLISHED,
    dateModified: GC_TRAVEL_UPDATED,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PAGE_PATH) },
    url: absoluteUrl(PAGE_PATH),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  },
  faqJsonLd(faqs),
  breadcrumbJsonLd(crumbs),
);

const TIER_STYLE: Record<string, string> = {
  routine: "border-emerald-200 bg-emerald-50/50",
  attention: "border-amber-200 bg-amber-50/50",
  serious: "border-orange-200 bg-orange-50/50",
  critical: "border-rose-200 bg-rose-50/50",
};

const KIND_STYLE: Record<string, string> = {
  official: "bg-emerald-50 text-emerald-700 border-emerald-200",
  statistic: "bg-sky-50 text-sky-700 border-sky-200",
  "reported-pattern": "bg-amber-50 text-amber-800 border-amber-200",
};

export default function GreenCardTravelRulesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="border-b border-ink-900/5 bg-white pt-6 pb-7 sm:pt-9">
          <Container>
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400">
              {crumbs.map((c, i) => (
                <span key={c.url} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.url} className="hover:text-brand-600">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="text-ink-500">{c.name}</span>
                  )}
                </span>
              ))}
            </nav>

            <h1 className="max-w-3xl text-2xl font-black tracking-tight text-ink-900 sm:text-4xl">
              Green card travel rules, and what the detention headlines actually
              mean
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Start with the statute, not the day count. A returning permanent
              resident is <strong>not</strong> an applicant for admission unless
              one of <strong>six conditions</strong> in INA 101(a)(13)(C)
              applies &mdash; and two of those six are an absence over{" "}
              <strong>180 days</strong> and a criminal history with{" "}
              <strong>no time limit</strong> attached. Your card works as an
              entry document under a year. Your naturalisation clock is a
              separate regime with separate thresholds. And you do not have to
              sign Form I-407 at an airport.
            </p>

            <p className="mt-3 max-w-3xl text-sm text-ink-500">
              Last verified {formatDate(GC_TRAVEL_VERIFIED)} against INA
              101(a)(13)(C), 8 CFR 211 and 316.5, the USCIS travel page, Form
              G-1055, and ICE&rsquo;s published detention statistics.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                "Under 1 year: the card is your entry document (8 CFR 211.1(a)(2))",
                "6–12 months: continuous residence disrupted unless you rebut it",
                "The 1-year line is measured at BOARDING, not landing (8 CFR 211.3)",
                "A reentry permit does nothing for naturalisation — N-470 does",
                "N-470 must be filed BEFORE the absence hits 12 months",
                "Form I-407 is voluntary. An immigration judge decides abandonment",
              ].map((f) => (
                <li
                  key={f}
                  className="flex gap-2 rounded-xl border border-ink-900/5 bg-ink-900/[0.02] px-3.5 py-2.5 text-sm leading-relaxed text-ink-700"
                >
                  <span aria-hidden className="text-brand-600">
                    ▸
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <ReviewedByline date={GC_TRAVEL_UPDATED} path={PAGE_PATH} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        {/* ══════════ The tool ══════════ */}
        <section id="trip-checker" className="scroll-mt-24 bg-ink-900/[0.02] py-10 sm:py-14">
          <Container>
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                Check the trip you are planning
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                The output is not a score. It is which of the three regimes your
                trip touches &mdash; your entry document, your naturalisation
                clock, and whether the statute treats you as seeking admission
                &mdash; because they have different thresholds and people merge
                them. Nothing is stored or sent, and the criminal-history
                question is yes or no with nowhere to type detail.
              </p>
            </div>
            <TripRiskChecker />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[760px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              {/* ── 1. The statute ── */}
              <div id="seeking-admission" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The one subsection everything else follows from
                </h2>
                <p className="mt-3">
                  Nearly every page about green card travel starts with how long
                  you can be away. The statute starts somewhere else, and the
                  difference matters, because the question it asks is not{" "}
                  <em>how long</em> but <em>what kind of inspection you
                  face</em>.
                </p>
                <p className="mt-3 italic text-ink-600">
                  &ldquo;{SEEKING_ADMISSION.lead}&rdquo;{" "}
                  <span className="not-italic text-xs text-ink-400">
                    {SEEKING_ADMISSION.cite}
                  </span>
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      The six conditions in INA 101(a)(13)(C) under which a
                      returning permanent resident is treated as seeking
                      admission
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          #
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          The condition
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What it means in practice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {SEEKING_ADMISSION.conditions.map((c) => (
                        <tr key={c.n} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-bold text-ink-800">
                            {c.n}
                          </th>
                          <td className="py-3 pr-3 italic">{c.text}</td>
                          <td className="py-3 text-ink-500">{c.plain}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">Why this is the frame</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {SEEKING_ADMISSION.whyItMatters}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    {SEEKING_ADMISSION.burden}
                  </p>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <div className="min-w-[560px]">
                    <SeekingAdmissionFlow />
                  </div>
                </div>
              </div>

              {/* ── 2. Two regimes ── */}
              <div id="thresholds" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Two regimes, three thresholds, one trip
                </h2>
                <p className="mt-3">
                  The commonest error in this whole topic is treating these as
                  one rule. They are two separate regimes with different
                  thresholds, and a single trip can be fine under one and a
                  problem under the other.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <AbsenceTierChart />
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {ABSENCE_TIERS.map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-2xl border p-5 ${TIER_STYLE[t.tier]}`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-base font-bold text-ink-900">{t.label}</p>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[0.7rem] font-semibold text-ink-600">
                          {t.days}
                        </span>
                      </div>
                      <dl className="mt-3 space-y-2.5 text-sm">
                        <div>
                          <dt className="font-semibold text-ink-800">
                            Is the card still your entry document?
                          </dt>
                          <dd className="text-ink-600">{t.cardValid}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-ink-800">
                            Continuous residence for naturalisation?
                          </dt>
                          <dd className="text-ink-600">{t.continuousResidence}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-ink-800">
                            Treated as seeking admission?
                          </dt>
                          <dd className="text-ink-600">{t.seekingAdmission}</dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-500">
                        What to do
                      </p>
                      <ul className="mt-1.5 space-y-1 text-sm text-ink-700">
                        {t.whatToDo.map((w) => (
                          <li key={w.slice(0, 30)} className="flex gap-2">
                            <span aria-hidden className="text-ink-400">
                              ▸
                            </span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                  <p className="text-sm font-bold text-ink-900">
                    The one-year line is measured at boarding
                  </p>
                  <p className="mt-2 text-sm italic leading-relaxed text-ink-600">
                    &ldquo;{ONE_YEAR_MECHANIC.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-ink-400">{ONE_YEAR_MECHANIC.cite}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    {ONE_YEAR_MECHANIC.plain}
                  </p>
                </div>
              </div>

              {/* ── 3. Abandonment ── */}
              <div id="abandonment" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Abandonment is about intent, and the regulation lists the
                  evidence
                </h2>
                <p className="mt-3">{ABANDONMENT_FACTORS.lead}</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm italic text-ink-600">
                  {ABANDONMENT_FACTORS.factors.map((f) => (
                    <li key={f.slice(0, 30)}>{f}</li>
                  ))}
                </ol>
                <p className="mt-2 text-xs text-ink-400">{ABANDONMENT_FACTORS.cite}</p>
                <p className="mt-4">
                  Those four are a checklist you can prepare before you travel
                  rather than remember under pressure at a counter. Keep the
                  employment letter, the lease or mortgage statement, the school
                  enrolment for children who stayed, and the tax return.
                </p>
                <p className="mt-3">
                  <strong>And one thing the regulation goes out of its way to
                  say. </strong>
                  {ABANDONMENT_FACTORS.notJustDays}
                </p>

                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">
                    The tax decision that is actually an immigration decision
                  </p>
                  <p className="mt-2 text-sm italic leading-relaxed text-ink-600">
                    &ldquo;{ABANDONMENT_FACTORS.taxTrap.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    {ABANDONMENT_FACTORS.taxTrap.cite}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    {ABANDONMENT_FACTORS.taxTrap.plain}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
                    If you are weighing that decision as part of a move back,{" "}
                    <Link href="/return-to-india" className="text-brand-600 underline">
                      the return-to-India guide
                    </Link>{" "}
                    covers keeping the card versus ending it deliberately, the
                    long-term-resident expatriation test, and what happens to a
                    401(k), an IRA and Social Security. It is the page for the
                    permanent-move version of this question; this page is for the
                    trip.
                  </p>
                </div>
              </div>

              {/* ── 4. The three instruments ── */}
              <div id="instruments" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Three instruments, and only one protects your citizenship clock
                </h2>
                <div className="overflow-x-auto">
                  <div className="min-w-[560px]">
                    <InstrumentComparisonChart />
                  </div>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[800px] border-collapse text-sm">
                    <caption className="sr-only">
                      The reentry permit, Form N-470 and the SB-1 returning
                      resident visa compared
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Instrument
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Protects
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Does not protect
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Deadline
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Fee
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {INSTRUMENTS.map((i) => (
                        <tr
                          key={i.id}
                          className={`border-b border-ink-900/5 align-top ${
                            i.id === "n470" ? "bg-emerald-50/40" : ""
                          }`}
                        >
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {i.name}
                            <span className="mt-0.5 block text-[0.7rem] font-normal text-ink-400">
                              {i.form}
                            </span>
                          </th>
                          <td className="py-3 pr-3">{i.protects}</td>
                          <td className="py-3 pr-3 text-ink-500">{i.doesNotProtect}</td>
                          <td className="py-3 pr-3 font-medium text-ink-700">{i.deadline}</td>
                          <td className="py-3 whitespace-nowrap font-bold text-ink-900">
                            {i.fee}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 space-y-4">
                  {INSTRUMENTS.map((i) => (
                    <div key={i.id} className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                      <p className="text-sm font-bold text-ink-900">
                        {i.name} &mdash; {i.form}
                      </p>
                      <p className="mt-1.5 text-sm text-ink-600">{i.what}</p>
                      <dl className="mt-2.5 space-y-1.5 text-xs">
                        <div className="flex gap-2">
                          <dt className="w-32 shrink-0 font-semibold text-ink-700">
                            Where you file
                          </dt>
                          <dd className="text-ink-600">{i.mustFileFrom}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-32 shrink-0 font-semibold text-ink-700">Validity</dt>
                          <dd className="text-ink-600">{i.validity}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-32 shrink-0 font-semibold text-ink-700">Authority</dt>
                          <dd className="text-ink-400">{i.cite}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
                <p className="mt-4">
                  <Link href="/uscis/forms/i-131" className="text-brand-600 underline">
                    Form I-131 explained
                  </Link>{" "}
                  owns the form itself, including its other uses &mdash; advance
                  parole for a pending I-485 is the same form with a different
                  box ticked, and the two get confused.
                </p>

                <div id="n470" className="mt-7 scroll-mt-24 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-5">
                  <h3 className="text-base font-bold text-ink-900">
                    Who Form N-470 is actually for
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    This is the part most summaries of N-470 leave out, including
                    an earlier version of this page. It is{" "}
                    <strong>not</strong> a form every permanent resident facing a
                    long absence can file. {N470_ELIGIBILITY.lead}
                  </p>
                  <ol className="mt-3 space-y-2.5">
                    {N470_ELIGIBILITY.requirements.map((r) => (
                      <li key={r.n} className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[0.65rem] font-bold text-white">
                          {r.n}
                        </span>
                        <span className="text-sm leading-relaxed">
                          <strong className="text-ink-900">{r.label}. </strong>
                          <span className="text-ink-600">{r.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <p className="mt-4 text-sm font-bold text-ink-900">
                    The qualifying employers, which is where most cases are decided
                  </p>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-sm">
                      <caption className="sr-only">
                        The categories of qualifying employment for Form N-470
                        under INA 316(b)
                      </caption>
                      <thead>
                        <tr className="border-b border-emerald-300 text-left">
                          <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                            Employer
                          </th>
                          <th scope="col" className="py-2 font-bold text-ink-900">
                            What the category actually requires
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-ink-600">
                        {N470_ELIGIBILITY.qualifyingEmployers.map((q) => (
                          <tr key={q.who} className="border-b border-emerald-200/60 align-top">
                            <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                              {q.who}
                            </th>
                            <td className="py-3">{q.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/70 p-4">
                    <p className="text-sm font-bold text-ink-900">
                      What does NOT qualify
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                      {N470_ELIGIBILITY.doesNotQualify}
                    </p>
                  </div>

                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div>
                      <dt className="font-semibold text-ink-800">
                        It does not replace a reentry permit
                      </dt>
                      <dd className="text-ink-600">
                        {N470_ELIGIBILITY.stillNeedReentryPermit}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-800">
                        It does not waive physical presence
                      </dt>
                      <dd className="text-ink-600">
                        {N470_ELIGIBILITY.physicalPresenceNote}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-800">Your family</dt>
                      <dd className="text-ink-600">{N470_ELIGIBILITY.family}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-800">
                        If you are the spouse of a US citizen
                      </dt>
                      <dd className="text-ink-600">
                        {N470_ELIGIBILITY.spouseOfCitizenException}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs text-ink-400">{N470_ELIGIBILITY.cite}</p>
                </div>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  The SB-1, and the condition that decides it
                </h3>
                <p className="mt-2">{SB1_REQUIREMENTS.lead}</p>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink-600">
                  {SB1_REQUIREMENTS.items.map((i) => (
                    <li key={i.slice(0, 30)}>{i}</li>
                  ))}
                </ol>
                <p className="mt-3">{SB1_REQUIREMENTS.reality}</p>
                <p className="mt-3">{SB1_REQUIREMENTS.alsoNeeded}</p>
              </div>

              {/* ── 5. Documents ── */}
              <div id="documents" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What to carry, by situation
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      Documents to carry for each travel situation, with the
                      regulation behind each
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Situation
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Carry
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Authority / note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {DOCUMENT_SITUATIONS.map((s) => (
                        <tr key={s.situation} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {s.situation}
                          </th>
                          <td className="py-3 pr-3">
                            <ul className="space-y-1">
                              {s.carry.map((c) => (
                                <li key={c} className="flex gap-1.5">
                                  <span aria-hidden className="text-emerald-600">
                                    ✓
                                  </span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-3 text-[0.78rem] text-ink-500">{s.cite}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  On the expired-card rows:{" "}
                  <Link href="/green-card-renewal" className="text-brand-600 underline">
                    green card renewal
                  </Link>{" "}
                  owns the work, travel, DMV and proof-of-status questions that
                  come with an expired card, including the ADIT stamp
                  appointment, and{" "}
                  <Link href="/replace-green-card" className="text-brand-600 underline">
                    replacing a green card
                  </Link>{" "}
                  covers the lost, stolen and damaged cases. The one mechanic
                  worth repeating here is 8 CFR 211.1(a)(5), because it has a
                  date limit people miss: an expired card plus an I-751 or I-829
                  filing receipt <strong>issued within the previous six
                  months</strong> works as an entry document for an absence of
                  less than one year. A receipt older than that does not fit the
                  provision, which is why long-pending I-751 holders travel on an
                  extension letter or a stamp instead.
                </p>
              </div>

              {/* ── 6. The airport ── */}
              <div id="airport" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  At the airport
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <caption className="sr-only">
                      What to do and what not to do at each stage of an
                      inspection
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Moment
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Do
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Do not
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {AIRPORT_SCENARIOS.map((r) => (
                        <tr key={r.moment} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.moment}
                          </th>
                          <td className="py-3 pr-3">{r.doDo}</td>
                          <td className="py-3 text-ink-500">{r.dont}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Secondary inspection itself &mdash; what it is, what officers
                  may do, the sworn statement, device searches, and the
                  difference between withdrawing an application for admission
                  and an expedited removal &mdash; is documented with citations
                  on{" "}
                  <Link href="/h1b-denied-entry-airport" className="text-brand-600 underline">
                    denied entry at the airport
                  </Link>
                  . It was written for H-1B travellers and the inspection
                  mechanics are the same.
                </p>
              </div>

              {/* ── 7. I-407 ── */}
              <div id="i-407" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Form I-407: the most consequential document anyone will hand you
                </h2>
                <div className="mt-4 space-y-4">
                  {I407.facts.map((f) => (
                    <div key={f.q} className="rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                      <p className="text-sm font-bold text-ink-900">{f.q}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{f.a}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-ink-500">{I407.ownerNote}</p>
              </div>

              {/* ── 8. Know your rights ── */}
              <div id="rights" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Know your rights &mdash; every line from a statute or a
                  regulation
                </h2>
                <p className="mt-3">
                  Nothing in this section is sourced to advocacy material. These
                  are rules, which is the point: they are not positions anyone
                  takes, they are what the law says.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <caption className="sr-only">
                      Rights and procedural facts for a returning permanent
                      resident, each with its source
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          The point
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Detail
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Source
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {RIGHTS.map((r) => (
                        <tr key={r.right} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.right}
                          </th>
                          <td className="py-3 pr-3">{r.detail}</td>
                          <td className="py-3 text-[0.78rem] text-ink-400">{r.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-7 text-base font-bold text-ink-900">
                  Finding a lawyer, and when
                </h3>
                <p className="mt-2">{LAWYER_TIMING}</p>
                <ul className="mt-3 space-y-2.5">
                  {FIND_A_LAWYER.map((l) => (
                    <li key={l.href} className="rounded-xl border border-ink-900/10 p-3.5">
                      <a
                        href={l.href}
                        target="_blank"
                        rel="nofollow noopener"
                        className="text-sm font-semibold text-brand-600 underline"
                      >
                        {l.label}
                      </a>
                      <p className="mt-0.5 text-xs text-ink-500">{l.note}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">
                  For what representation typically costs and when it is worth
                  paying for,{" "}
                  <Link href="/immigration-attorney-lawyer-cost" className="text-brand-600 underline">
                    the attorney cost guide
                  </Link>{" "}
                  has the numbers.
                </p>
              </div>

              {/* ── 9. Fees ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What each instrument costs
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-sm">
                    <caption className="sr-only">
                      Current filing fees for the forms on this page
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Form
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Fee
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {GC_TRAVEL_FEES.map((f) => (
                        <tr key={f.item} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {f.item}
                          </th>
                          <td className="py-3 pr-3 whitespace-nowrap font-bold text-ink-900">
                            {f.fee}
                          </td>
                          <td className="py-3 text-ink-500">{f.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-ink-400">{GC_TRAVEL_FEE_SOURCE}</p>
              </div>

              {/* ── 10. ICE data ── */}
              <div id="ice-data" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What ICE&rsquo;s own numbers show
                </h2>
                <p className="mt-3">
                  Three of the largest search terms that bring people to this
                  page are about detention rather than about travel rules, so
                  here is the primary source rather than a characterisation of
                  it. These figures come from ICE&rsquo;s own published detention
                  statistics workbooks, which it releases per fiscal year.
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <IceDetentionChart />
                  </div>
                </div>
                <div className="mt-6 overflow-x-auto">
                  <div className="min-w-[520px]">
                    <IceMonthlyChart />
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-ink-900/5 bg-ink-900/[0.02] p-5">
                  <p className="text-sm font-bold text-ink-900">
                    How to read it, and how not to
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {ICE_ADP_READING}
                  </p>
                </div>
                <p className="mt-4 text-xs text-ink-400">
                  Source: {ICE_ADP_SOURCE.label}. {ICE_ADP_SOURCE.asOf}. Verified{" "}
                  {formatDate(GC_TRAVEL_VERIFIED)}.
                </p>
              </div>

              {/* ── 11. Tracker ── */}
              <div id="tracker" className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                    Detention and policy tracker
                  </h2>
                  <span className="rounded-full border border-ink-900/10 bg-white px-3 py-1 text-xs font-semibold text-ink-600">
                    Last updated {formatDate(TRACKER_UPDATED)}
                  </span>
                </div>
                <p className="mt-3">
                  A dated log of policy changes and reported case patterns
                  affecting permanent residents and green card applicants at
                  ports of entry and in ICE custody. Three rules govern what goes
                  in it, and the labels on each entry are the point:
                </p>
                <ul className="mt-3 space-y-2">
                  {(Object.keys(KIND_LABELS) as (keyof typeof KIND_LABELS)[]).map((k) => (
                    <li key={k} className="flex flex-wrap items-baseline gap-2 text-sm">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[0.7rem] font-bold ${KIND_STYLE[k]}`}
                      >
                        {KIND_LABELS[k]}
                      </span>
                      <span className="text-ink-600">{KIND_NOTES[k]}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-ink-500">
                  No private individual is named anywhere in the log, and nothing
                  in it is speculation or prediction.
                </p>

                <div className="mt-5 space-y-4">
                  {TRACKER.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-ink-900">
                          {formatDate(e.date)}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${KIND_STYLE[e.kind]}`}
                        >
                          {KIND_LABELS[e.kind]}
                        </span>
                        <span className="rounded-full bg-ink-900/5 px-2.5 py-0.5 text-[0.65rem] font-semibold text-ink-600">
                          {e.category}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-ink-900">{e.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{e.summary}</p>
                      {e.affects && (
                        <p className="mt-2 text-sm">
                          <strong className="text-ink-800">Who it affects: </strong>
                          <span className="text-ink-600">{e.affects}</span>
                        </p>
                      )}
                      {e.whatToDo && (
                        <p className="mt-2 rounded-lg bg-ink-900/[0.03] p-3 text-sm text-ink-700">
                          <strong>What to do: </strong>
                          {e.whatToDo}
                        </p>
                      )}
                      <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                        {e.sources.map((s) => (
                          <li key={s.href}>
                            <a
                              href={s.href}
                              target="_blank"
                              rel="nofollow noopener"
                              className="text-xs font-semibold text-brand-600 underline"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 12. India angle ── */}
              <div id="india" className="scroll-mt-24">
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The long India trip
                </h2>
                <p className="mt-3">
                  Almost every version of this question that reaches us is the
                  same shape, and it is not a holiday. A parent needs care. A
                  wedding takes three months of family obligation on top of the
                  event. A death in the family turns a two-week trip into four
                  months of probate, property and paperwork. A spouse&rsquo;s
                  posting runs two years. None of these is a plan to abandon
                  permanent residence, and all of them can cross a threshold.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-sm">
                    <caption className="sr-only">
                      Four common long-trip scenarios and what each one requires
                    </caption>
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Scenario
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Where it lands
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What to do before you go
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        {
                          s: "Parent's surgery and recovery — four months",
                          l: "Under 180 days. Both regimes intact, no condition triggered.",
                          d: "Travel on the card and passport. Keep a dated note of the reason and the medical documentation, in case the next trip extends it.",
                        },
                        {
                          s: "Parent's care that extends to eight months",
                          l: "Card still valid. Continuous residence disrupted unless rebutted, and you are now seeking admission on length.",
                          d: "Assemble the four 8 CFR 316.5(c)(1)(i) facts before you leave: employment continuing, family here, home access kept, no employment taken abroad. Keep filing US taxes as a resident.",
                        },
                        {
                          s: "A spouse posted to India for two years, family goes too",
                          l: "Past a year. Card is not the entry document, and continuous residence breaks.",
                          d: "File Form I-131 for a reentry permit while still in the US — that is the part that gets you back. On the naturalisation clock, check the N-470 gate above before counting on it: a posting to your employer's Indian entity, or to an Indian company, is not qualifying employment under INA 316(b), so for most families in this scenario N-470 is simply not available and the realistic plan is the four-years-and-one-day reset after you return.",
                        },
                        {
                          s: "Already in India, eleven months gone, no permit",
                          l: "Days from the one-year line.",
                          d: "8 CFR 211.3 measures to the boarding. Getting on a plane before the first anniversary of your departure keeps you inside the rule. Take legal advice the same week, not after.",
                        },
                      ].map((r) => (
                        <tr key={r.s} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {r.s}
                          </th>
                          <td className="py-3 pr-3">{r.l}</td>
                          <td className="py-3 text-ink-600">{r.d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Three related pages.{" "}
                  <Link href="/return-to-india" className="text-brand-600 underline">
                    Retirement and return to India
                  </Link>{" "}
                  is for the version where the move is permanent and the question
                  is whether to keep the card at all.{" "}
                  <Link href="/h1b/travel-to-india" className="text-brand-600 underline">
                    H-1B travel to India
                  </Link>{" "}
                  covers family members who are not permanent residents, whose
                  rules are completely different. And{" "}
                  <Link href="/uscis/i-94" className="text-brand-600 underline">
                    the I-94 guide
                  </Link>{" "}
                  explains why, as a permanent resident, you cannot pull your own
                  travel history from the CBP site and have to file a FOIA request
                  instead &mdash; which is worth starting long before an N-400.
                </p>
              </div>

              {/* ── 13. Pending applications ── */}
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  If you are not a permanent resident yet
                </h2>
                <p className="mt-3">
                  Nothing on this page applies to someone with a pending I-485,
                  and the difference is not a detail. INA 101(a)(13)(C) protects
                  a lawful permanent resident; an adjustment applicant is not
                  one. The general rule at 8 CFR 245.2(a)(4)(ii)(A) is that
                  departing without advance parole is deemed to abandon the
                  application, and the consequence is losing your place in the
                  queue rather than a difficult inspection.
                </p>
                <p className="mt-3">
                  There is a narrow exception for applicants in lawful H-1 or L-1
                  status under 8 CFR 245.2(a)(4)(ii)(C), and it depends on every
                  listed condition holding at the moment you return.{" "}
                  <Link href="/h1b-denied-entry-airport" className="text-brand-600 underline">
                    The denied-entry guide
                  </Link>{" "}
                  sets those conditions out verbatim, and{" "}
                  <Link href="/uscis/travel-to-india-while-i485-pending" className="text-brand-600 underline">
                    travel to India while I-485 is pending
                  </Link>{" "}
                  is the practical guide. For where you are in the process
                  overall,{" "}
                  <Link href="/tools/green-card-tracker" className="text-brand-600 underline">
                    the green card tracker
                  </Link>{" "}
                  estimates the queue and{" "}
                  <Link href="/green-card" className="text-brand-600 underline">
                    the green card guide
                  </Link>{" "}
                  covers the five stages.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-ink-900/[0.02] py-12 sm:py-16">
          <Container>
            <ToolFaq items={faqs} />
          </Container>
        </section>

        <section className="py-12">
          <Container>
            <OfficialSourceBox
              title="Sources and last verified"
              intro={`Statute and regulations read on ${formatDate(
                GC_TRAVEL_VERIFIED,
              )}. Fees from Form G-1055, edition 10/07/26. Detention figures from ICE's own fiscal-year workbooks, the FY2026 file dated 20 July 2026. The tracker was last updated ${formatDate(
                TRACKER_UPDATED,
              )}.`}
              links={[
                { label: "INA 101(a)(13)(C) — 8 U.S.C. 1101", href: SRC.ina101 },
                { label: "8 CFR part 211 — documentary requirements for immigrants", href: SRC.cfr211 },
                { label: "8 CFR 316.5 — residence in the United States", href: SRC.cfr3165 },
                { label: "USCIS — international travel as a permanent resident", href: SRC.uscisTravel },
                { label: "USCIS — Form I-131, travel documents", href: SRC.i131 },
                { label: "USCIS — Form N-470, preservation of residence", href: SRC.n470 },
                { label: "USCIS — Form I-407, record of abandonment", href: SRC.i407 },
                { label: "USCIS — Form N-400, naturalisation", href: SRC.n400 },
                { label: "Department of State — returning resident visas (SB-1)", href: SRC.sb1 },
                { label: "ICE — detention management statistics", href: SRC.iceDetention },
                { label: "CBP — deferred inspection sites", href: SRC.cbpDeferred },
                { label: "Form G-1055 — USCIS fee schedule", href: SRC.feeSchedule },
                { label: "EOIR — list of pro bono legal service providers", href: SRC.eoirFind },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/green-card-renewal", label: "Green card renewal and an expired card" },
                  { href: "/replace-green-card", label: "Replacing a lost or stolen card" },
                  { href: "/uscis/forms/i-131", label: "Form I-131 explained" },
                  { href: "/return-to-india", label: "Retirement and return to India" },
                  { href: "/h1b-denied-entry-airport", label: "Denied entry at the airport" },
                  { href: "/uscis/i-94", label: "Your I-94 and travel history" },
                  { href: "/tools/citizenship-checklist", label: "Citizenship eligibility checklist" },
                  { href: "/uscis/travel-to-india-while-i485-pending", label: "Travel with a pending I-485" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-1.5 rounded-xl border border-ink-900/10 px-3.5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300"
                    >
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              <AuthorBioBox
                tags={[
                  "Permanent residence",
                  "Travel and port of entry",
                  "Naturalisation",
                ]}
              />
            </div>
          </Container>
        </section>

        <Newsletter />
      </article>
    </>
  );
}
