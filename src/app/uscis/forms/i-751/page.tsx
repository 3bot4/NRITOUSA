import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import Newsletter from "@/components/Newsletter";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import ToolFaq from "@/components/tools/ToolFaq";
import I751WindowCalculator from "@/components/tools/I751WindowCalculator";
import { I751TimelineDiagram } from "@/components/tools/i751/timeline";
import {
  ExtensionCoverageChart,
  WaiverGroundDiagram,
} from "@/components/tools/i751/I751Visuals";
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
  I751_FACTS,
  I751_SOURCES,
  I751_BASES,
  I751_WAIVER_GROUNDS,
  I751_EVIDENCE,
} from "@/data/i751Data";

const PAGE_PATH = "/uscis/forms/i-751";
const PUBLISHED = "2026-09-16";
const UPDATED = "2026-09-16";

export const metadata: Metadata = pageMetadata({
  title: "Remove Conditions on a Green Card: Form I-751 Window, Fee & Timeline",
  description: `File Form I-751 in the ${I751_FACTS.windowDays} days before your conditional green card expires. Fee ${I751_FACTS.onlineFee} online or ${I751_FACTS.paperFee} on paper, and the receipt notice extends your status ${I751_FACTS.extensionMonths} months. Free filing-window calculator with a calendar reminder.`,
  path: PAGE_PATH,
  type: "article",
  openGraph: { publishedTime: PUBLISHED, modifiedTime: UPDATED },
});

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Hub", url: "/uscis" },
  { name: "USCIS Forms", url: "/uscis/forms" },
  { name: "Form I-751", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "How do I remove the conditions on my green card?",
    answer: `You file Form I-751, Petition to Remove Conditions on Residence, in the ${I751_FACTS.windowDays} days immediately before your conditional card expires. If you are still married to the person who petitioned for you, you and your spouse file it jointly and submit evidence that the marriage is real. If the marriage has ended, you file the same form alone and request a waiver of the joint filing requirement. Approval replaces the two-year card with a ten-year one.`,
  },
  {
    question: "What is the fee to remove conditions on a green card?",
    answer: `${I751_FACTS.onlineFee} filed online, ${I751_FACTS.paperFee} on paper — filing online saves $50. There is no separate biometrics fee; it is included. A conditional resident, spouse or child filing a waiver based on battery or extreme cruelty pays nothing. Figures are from the USCIS fee schedule, ${I751_FACTS.feeEdition}; verify on the fee schedule before you pay, because a wrong fee gets the whole petition rejected.`,
  },
  {
    question: "What is the timeline for removal of green card conditions?",
    answer: `Conditional residence lasts ${I751_FACTS.conditionalYears} years. The filing window is the last ${I751_FACTS.windowDays} days of it. Once USCIS accepts the petition, the receipt notice extends your conditional resident status and your work authorisation for ${I751_FACTS.extensionMonths} months beyond the card's expiry date — that extension exists precisely because adjudication routinely outlasts the card. Biometrics follows, an interview only if USCIS asks for one, then a decision.`,
  },
  {
    question: "How long does the I-751 receipt notice extend my status?",
    answer: `${I751_FACTS.extensionMonths} months beyond the expiration date printed on your conditional card. USCIS moved to ${I751_FACTS.extensionMonths} months on ${formatDate(I751_FACTS.extensionSince)}; before that it was shorter, which is why older guides — and several law-firm pages still online in 2026 — say 24 months. Your Form I-797C receipt notice presented with the expired card is the evidence of status and work authorisation during that period.`,
  },
  {
    question: "What happens if I miss the I-751 deadline?",
    answer:
      "Your conditional permanent residence terminates automatically when the card expires, and USCIS can issue a Notice to Appear starting removal proceedings. That is the bad news. The better news is that USCIS will still accept a late petition if you include a written explanation of why it is late and the delay was beyond your control — an illness, a natural disaster, a lawyer who failed to file. Good cause is decided case by case. File as soon as you realise, and get a lawyer involved.",
  },
  {
    question: "Can I travel to India while my I-751 is pending?",
    answer: `Yes, as a conditional permanent resident you may travel, but carry the right paper. Take your expired conditional card together with the Form I-797C receipt notice showing the ${I751_FACTS.extensionMonths}-month extension — the receipt alone is not enough, and the expired card alone is not enough. Airline check-in staff in India are the more common problem, not the officer at the US border, so allow time at the counter and be ready to point at the extension language on the notice. Long absences still risk an abandonment argument, so keep trips to a normal length.`,
  },
  {
    question: "Do I have to attend an interview for the I-751?",
    answer:
      "Not necessarily. USCIS may waive the interview where the evidence of a genuine marriage is strong and there is nothing in the file that needs explaining. An interview becomes much more likely when the evidence is thin, when you are filing a waiver after a divorce, when the couple's addresses do not match across the documents, or when something in the record contradicts something else. If USCIS wants one, it mails an appointment notice.",
  },
  {
    question: "Can I apply for citizenship while my I-751 is pending?",
    answer:
      "Yes — Form N-400 can be filed while the I-751 is pending, and many people reach N-400 eligibility long before the I-751 is decided. In practice USCIS usually has to decide the I-751 first, and often handles both at a single interview. If you are approaching the three-year mark as the spouse of a US citizen, file the N-400 rather than waiting for the I-751 to clear.",
  },
  {
    question: "Is Form I-751 the same as Form I-90?",
    answer:
      "No, and filing the wrong one wastes months and a fee. I-751 removes the conditions from a two-year card. I-90 replaces or renews a ten-year card that is expiring, lost or damaged. If your card says it is valid for two years, I-751 is your form.",
  },
  {
    question: "Can I apply for citizenship while my I-751 is pending?",
    answer:
      "You can file the N-400, but it cannot be approved while the I-751 is pending — in most cases USCIS must have approved the petition to remove conditions before it may naturalise a conditional resident. What USCIS does instead of making you wait and then start is adjudicate the I-751 before, or at the same time as, the N-400, and the two are often combined into a single interview. A conditional resident married to and living with the same US citizen reaches N-400 eligibility three years after admission as a permanent resident, so the overlap is normal rather than a sign anything has gone wrong. Narrow exceptions exist for certain military applicants under INA 329 and certain spouses of US citizens employed abroad under INA 319(b). Source: USCIS Policy Manual, Vol. 12, Pt. G, Ch. 5.",
  },
  {
    question: "How much does it cost to remove conditions on a green card?",
    answer: `${I751_FACTS.onlineFee} filing online, or ${I751_FACTS.paperFee} by mail — the $50 difference buys nothing except the paper. Biometrics is included in both; there is no separate biometrics fee, so any page still quoting "plus $85" is out of date. A conditional resident filing a waiver based on battery or extreme cruelty pays nothing, and does not need to request a fee waiver for it. Source: USCIS fee schedule, ${I751_FACTS.feeEdition}.`,
  },
  {
    question:
      "My conditional green card expired while the I-751 is pending. What do I do?",
    answer: `Nothing — that is the expected state, and it is what the receipt notice is for. When you file, USCIS issues a receipt notice that extends your conditional permanent resident status and your employment authorisation for ${I751_FACTS.extensionMonths} months beyond the expiry date printed on the card, a length in force since ${I751_FACTS.extensionSince}. Carry the receipt notice together with the expired card: that pair is your evidence of status for an employer, for the DMV and for re-entry to the United States. Keep a scan, because replacing a lost receipt notice usually means an appointment at a field office for an I-551 stamp.`,
  },
  {
    question: "What are the most common I-751 mistakes?",
    answer: `Filing before the window opens, which gets the petition rejected outright; assuming a missed window has shut you out when you are actually on a waiver ground, where the window never applied; submitting a thick file of evidence that all dates from one short period rather than spanning the whole two years; throwing away the receipt notice that is now your status document; and not filing AR-11 after a move, so the biometrics appointment notice goes to the old address and the missed appointment can be treated as abandonment.`,
  },
];

export default function I751Page() {
  const url = absoluteUrl(PAGE_PATH);

  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline:
        "Remove the Conditions on Your Green Card: the Form I-751 Filing Window, Fee and Timeline",
      description:
        "When to file Form I-751, what it costs, how long the receipt notice extends your status, and what happens if you file late.",
      datePublished: PUBLISHED,
      dateModified: UPDATED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: "I-751 Filing Window Calculator",
      description:
        "Work out the first day you may file Form I-751, the last day before your conditional status lapses, and how long a receipt notice would extend your status — with a calendar reminder.",
      url: `${url}#calculator`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faqs),
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="border-b border-ink-900/5 bg-white pt-6 pb-7 sm:pt-9">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400"
            >
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
              How to remove the conditions on your green card: Form I-751
            </h1>

            {/* ANSWER FIRST */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              If your green card is valid for two years, you must file Form I-751
              in the <strong>{I751_FACTS.windowDays} days immediately before it
              expires</strong> — {I751_FACTS.onlineFee} online or{" "}
              {I751_FACTS.paperFee} on paper. The receipt notice then extends your
              status and work permission by{" "}
              <strong>{I751_FACTS.extensionMonths} months</strong>. Miss the
              deadline and your residence terminates automatically.
            </p>

            <ul className="mt-5 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                `Window: the last ${I751_FACTS.windowDays} days of your ${I751_FACTS.conditionalYears}-year card — earlier is rejected, later terminates status`,
                `Fee: ${I751_FACTS.onlineFee} online, ${I751_FACTS.paperFee} paper. No separate biometrics fee`,
                `Receipt notice extends status and work authorisation ${I751_FACTS.extensionMonths} months past the card's expiry`,
                "Divorced, widowed, or filing after abuse? The 90-day window does not apply to you at all",
                "An interview is not automatic — USCIS waives it when the evidence is strong",
                "Filing late is still possible with a written explanation and good cause",
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

            <ReviewedByline date={UPDATED} className="mt-5" />
            <NotLegalAdvice className="mt-4 max-w-3xl" />
          </Container>
        </header>

        <section className="bg-ink-900/[0.02] py-8">
          <Container>
            <FastAnswerSnapshot
              title="Form I-751 at a glance"
              answerLabel="Filing window"
              answer={`${I751_FACTS.windowDays} days`}
              accent="brand"
              badges={[
                `Fee ${I751_FACTS.onlineFee} online`,
                `${I751_FACTS.extensionMonths}-month extension`,
              ]}
              rows={[
                {
                  label: "Filing fee — online",
                  value: I751_FACTS.onlineFee,
                  note: "$50 cheaper than paper",
                  highlight: true,
                },
                { label: "Filing fee — paper", value: I751_FACTS.paperFee },
                {
                  label: "Biometrics fee",
                  value: "Included",
                  note: "No separate charge",
                },
                {
                  label: "Receipt notice extends status",
                  value: `${I751_FACTS.extensionMonths} months`,
                  note: `In force since ${formatDate(I751_FACTS.extensionSince)}`,
                },
                {
                  label: "Conditional card validity",
                  value: `${I751_FACTS.conditionalYears} years`,
                },
                {
                  label: "Waiver filing based on abuse",
                  value: "$0",
                },
              ]}
              lastVerified={I751_FACTS.lastVerified}
              sources={[
                { label: "Form I-751 (USCIS)", href: I751_SOURCES.form },
                { label: `Fee schedule (${I751_FACTS.feeEdition})`, href: I751_SOURCES.feeSchedule },
                { label: `${I751_FACTS.extensionMonths}-month extension alert`, href: I751_SOURCES.extensionAlert },
              ]}
              disclaimer="Fees change with each edition of the USCIS fee schedule, and the extension length has changed before. Verify both before filing — a wrong fee gets the petition rejected outright."
              ctaText="Work out my filing window"
              ctaHref="#calculator"
            />
          </Container>
        </section>

        <section id="calculator" className="scroll-mt-24 py-10 sm:py-14">
          <Container>
            <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
              Filing window calculator
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
              Read one date off the front of your conditional card. You get the
              first day USCIS will accept the petition, the last day before your
              status lapses, a live countdown, and a calendar reminder generated
              on your own device.
            </p>
            <div className="mt-6">
              <I751WindowCalculator />
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-10 text-[0.975rem] leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Why a two-year card exists at all
                </h2>
                <p className="mt-3">
                  If you became a permanent resident through marriage and the
                  marriage was less than two years old on the day you were
                  approved, Congress gives you a card with an expiry date instead
                  of the usual ten-year one. The idea is a checkpoint: two years
                  later, the government looks again and asks whether the marriage
                  was real. Form I-751 is that checkpoint.
                </p>
                <p className="mt-3">
                  The critical thing to understand is what the two-year card is
                  not. It is not a probationary green card that upgrades
                  automatically. Nothing happens on its own. If you do nothing,
                  your permanent residence ends on the expiry date — not
                  &ldquo;lapses pending renewal&rdquo;, ends.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The whole path, start to finish
                </h2>
                <I751TimelineDiagram />

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  The card expires long before the petition is decided
                </h3>
                <p className="mt-2">
                  This is the part that causes real-world trouble — a driver&apos;s
                  licence renewal refused, an employer asking for an unexpired
                  card, a trip to India booked against a card that ran out.
                  Drawn to scale, the answer is obvious: after you file, the
                  receipt notice is your status document, not the card.
                </p>
                <ExtensionCoverageChart />

                <h3 className="mt-8 text-base font-bold text-ink-900">
                  What it costs to file
                </h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          How you file
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Fee
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What is included
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          Online
                        </th>
                        <td className="py-3 pr-3 font-semibold text-emerald-700">
                          {I751_FACTS.onlineFee}
                        </td>
                        <td className="py-3">
                          Biometrics included. Cheapest route, and the receipt
                          notice posts to your account rather than waiting on the
                          post.
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          By mail
                        </th>
                        <td className="py-3 pr-3 font-semibold text-ink-800">
                          {I751_FACTS.paperFee}
                        </td>
                        <td className="py-3">
                          Biometrics included. $50 more than filing online, for
                          the same adjudication.
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          Waiver based on battery or extreme cruelty
                        </th>
                        <td className="py-3 pr-3 font-semibold text-emerald-700">$0</td>
                        <td className="py-3">
                          No fee, and no fee waiver request needed — the
                          exemption is built into the form.
                        </td>
                      </tr>
                      <tr className="border-b border-ink-900/5 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                          A separate biometrics fee
                        </th>
                        <td className="py-3 pr-3 font-semibold text-ink-400">None</td>
                        <td className="py-3">
                          Pages still quoting &ldquo;plus $85 biometrics&rdquo;
                          are out of date. There is no separate charge.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  Source: USCIS fee schedule, {I751_FACTS.feeEdition}. Read{" "}
                  {formatDate(I751_FACTS.lastVerified)}. Fees change by rule — confirm on
                  the official form page before paying.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Joint filing vs a waiver
                </h2>
                <p className="mt-3">
                  These are two routes through the same form, and the timing rule
                  is completely different on each — which is the single most
                  useful thing on this page for anyone whose marriage has ended.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {I751_BASES.map((b) => (
                    <div
                      key={b.id}
                      className={`rounded-2xl border p-5 ${
                        b.windowApplies
                          ? "border-brand-200 bg-brand-50/40"
                          : "border-amber-200 bg-amber-50/40"
                      }`}
                    >
                      <p className="text-sm font-bold text-ink-900">{b.label}</p>
                      <p className="mt-2 text-sm text-ink-600">{b.who}</p>
                      <p className="mt-3 text-sm text-ink-700">
                        <strong className="font-semibold">Timing:</strong> {b.timing}
                      </p>
                    </div>
                  ))}
                </div>
                <WaiverGroundDiagram />

                <h3 className="mt-6 text-base font-bold text-ink-900">
                  The waiver grounds
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {I751_WAIVER_GROUNDS.map((g) => (
                    <li key={g.title} className="rounded-xl border border-ink-900/5 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-ink-900">{g.title}</p>
                      <p className="mt-1 text-sm text-ink-600">{g.detail}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  If a divorce is in progress but not final, the usual approach is
                  to file jointly if your spouse will still sign, and ask USCIS to
                  convert the petition to a waiver once the decree issues.{" "}
                  <Link href="/divorce-immigration-status" className="text-brand-600 underline">
                    Divorce and your immigration status
                  </Link>{" "}
                  covers what changes at each stage, including the point that a
                  divorce does not by itself cost you a green card.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The evidence that actually decides it
                </h2>
                <p className="mt-3">
                  An officer is trying to answer one question: was this marriage
                  entered into in good faith? Not whether it survived — plenty of
                  genuine marriages end. What persuades is a continuous paper
                  trail across the whole conditional period, from two people who
                  were obviously running one life.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900">Category</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">What to include</th>
                        <th className="py-2 font-bold text-ink-900">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {I751_EVIDENCE.map((e) => (
                        <tr key={e.category} className="border-b border-ink-900/5">
                          <td className="py-2.5 pr-3 font-semibold text-ink-800">{e.category}</td>
                          <td className="py-2.5 pr-3">{e.examples}</td>
                          <td className="py-2.5 whitespace-nowrap">{e.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  Two patterns weaken an otherwise good file. The first is a burst
                  of documents around the wedding and around the filing date, with
                  a hollow middle — it reads as evidence assembled for the
                  petition rather than generated by a life. The second is
                  addresses that do not agree: a bank statement at one address and
                  a licence at another, unexplained, invites the officer to ask
                  why.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Travelling to India while the petition is pending
                </h2>
                <p className="mt-3">
                  Adjudication routinely runs longer than the card, which is
                  exactly why the receipt notice carries a{" "}
                  {I751_FACTS.extensionMonths}-month extension. You remain a
                  conditional permanent resident throughout and you may travel,
                  but travel with the full set: the expired conditional card{" "}
                  <em>and</em> the Form I-797C receipt notice. Neither one works
                  on its own.
                </p>
                <p className="mt-3">
                  The friction is usually at the Indian end, not the American one.
                  Airline staff at Delhi or Mumbai are checking whether you can
                  legally board, they read the expiry date on the card, and the
                  extension language on a US government notice is not something
                  they see every day. Get to the counter early, have the notice
                  printed rather than on a phone, and know where the extension
                  sentence appears on it. A supervisor is usually the resolution.
                </p>
                <p className="mt-3">
                  Keep trips to a normal length. An absence of six months or more
                  invites questions about whether you abandoned residence, and a
                  pending I-751 does not protect you from that argument.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  What makes an interview more likely
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Thin financial evidence — no joint account, no joint return, no shared liability.</li>
                  <li>A waiver filing after a divorce, where the good-faith question is squarely in issue.</li>
                  <li>Addresses that disagree across documents, or a period living apart with no explanation.</li>
                  <li>A large age gap, no shared language, or a very short courtship with no documentation of how you met — none of these is disqualifying, and each one is answerable, but they get read together.</li>
                  <li>Anything in the record that contradicts something else, including the original I-130 file.</li>
                </ul>
                <p className="mt-3">
                  If a notice arrives, treat it as a chance to close the gaps
                  rather than a verdict.{" "}
                  <Link href="/uscis/interview-scheduled" className="text-brand-600 underline">
                    What the &ldquo;interview scheduled&rdquo; status means
                  </Link>{" "}
                  covers what the notice itself tells you.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  If the petition is denied
                </h2>
                <p className="mt-3">
                  A denial terminates conditional residence and USCIS generally
                  issues a Notice to Appear in immigration court. That sounds
                  final and is not: an immigration judge reviews the I-751 afresh,
                  and you can present the evidence again there, including evidence
                  that did not exist when you filed. There is no appeal to the
                  Administrative Appeals Office from an I-751 denial — the review
                  happens in the removal proceeding itself.
                </p>
                <p className="mt-3">
                  This is the part of the process where representation genuinely
                  changes outcomes.{" "}
                  <Link href="/immigration-attorney-lawyer-cost" className="text-brand-600 underline">
                    What an immigration attorney costs
                  </Link>{" "}
                  sets expectations before you start calling.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  After approval
                </h2>
                <p className="mt-3">
                  You receive a ten-year card and the conditions are gone for
                  good. From there, the card is renewed on Form I-90 rather than
                  I-751 —{" "}
                  <Link href="/green-card-renewal" className="text-brand-600 underline">
                    the green card renewal guide
                  </Link>{" "}
                  covers that cycle, and{" "}
                  <Link href="/i90-vs-i751" className="text-brand-600 underline">
                    I-90 vs I-751
                  </Link>{" "}
                  exists precisely because people file the wrong one. Time spent
                  as a conditional resident counts toward naturalisation, so the
                  clock for{" "}
                  <Link href="/uscis/forms/n-400" className="text-brand-600 underline">
                    Form N-400
                  </Link>{" "}
                  has been running the whole time.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  Applying for citizenship while the I-751 is pending
                </h2>
                <p className="mt-3">
                  This interaction catches a lot of people, and it catches them
                  precisely because they did everything right. A conditional
                  resident married to a US citizen becomes eligible to apply for
                  naturalisation three years after being admitted as a permanent
                  resident. The I-751 is routinely still pending at that point.
                  So you end up holding two live applications at once, and
                  wondering which one blocks which.
                </p>
                <p className="mt-3">
                  The answer from the USCIS Policy Manual is clear, and it is
                  better news than most people expect. In most cases a
                  conditional resident must have an <em>approved</em> I-751
                  before USCIS may naturalise them — an N-400 cannot be approved
                  while a petition to remove conditions is still pending. But you
                  are not made to wait and then start: where an N-400 is pending,
                  USCIS adjudicates the I-751 before, or at the same time as,
                  the N-400, and the two can be handled in a combined interview.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[580px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          Question
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          What actually happens
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        [
                          "Can I file the N-400 while the I-751 is pending?",
                          "Yes. Filing is not blocked; approval is.",
                        ],
                        [
                          "Which one gets decided first?",
                          "The I-751. Where an N-400 is pending, USCIS adjudicates the I-751 before or at the same time as the N-400.",
                        ],
                        [
                          "Will I have two interviews?",
                          "Often one. The two can be combined into a single interview covering both the marriage evidence and the naturalisation requirements.",
                        ],
                        [
                          "When am I eligible on the 3-year rule?",
                          "Three years after admission as a permanent resident, if you are still married to and living with the same US citizen. The conditional card counts as permanent residence for that clock.",
                        ],
                        [
                          "What if the marriage ended?",
                          "The 3-year spousal rule is no longer available to you and the ordinary 5-year rule applies. The I-751 becomes a waiver filing.",
                        ],
                        [
                          "Are there exceptions to needing the I-751 approved first?",
                          "Narrow ones — certain military applicants under INA 329, and certain spouses of US citizens employed abroad by qualifying organisations under INA 319(b).",
                        ],
                      ].map(([q, a]) => (
                        <tr key={q} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {q}
                          </th>
                          <td className="py-3">{a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-ink-500">
                  Source: USCIS Policy Manual, Vol. 12, Pt. G, Ch. 5 —
                  conditional permanent resident spouses and naturalisation.
                  Read {formatDate(I751_FACTS.lastVerified)}. If you are getting
                  close to the interview,{" "}
                  <Link href="/tools/citizenship-test-practice" className="text-brand-600 underline">
                    the civics test practice tool
                  </Link>{" "}
                  covers the naturalisation half.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  The mistakes that cost the most time
                </h2>
                <p className="mt-3">
                  Ranked by how much they actually cost, not by how often they
                  are listed.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[620px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          The mistake
                        </th>
                        <th scope="col" className="py-2 pr-3 font-bold text-ink-900">
                          What it costs
                        </th>
                        <th scope="col" className="py-2 font-bold text-ink-900">
                          Instead
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        [
                          "Filing before the window opens",
                          "Outright rejection and the fee returned — and by the time it comes back, weeks of the window are gone.",
                          `Use the calculator above. USCIS accepts it only in the ${I751_FACTS.windowDays} days before the card expires.`,
                        ],
                        [
                          "Assuming a missed window has ended it",
                          "Months of doing nothing, on a waiver ground where the window never applied.",
                          "Check which basis you are filing on before you check the date.",
                        ],
                        [
                          "Evidence from one month of one year",
                          "The single most common reason a case draws an interview: a thick file that proves one moment rather than a continuous life.",
                          "Two or three documents from every six-month block across the whole conditional period.",
                        ],
                        [
                          "Throwing away the receipt notice",
                          `It is your status document for ${I751_FACTS.extensionMonths} months. Replacing it means an InfoPass appointment to get an I-551 stamp.`,
                          "Scan it, keep the original with the expired card, and carry both.",
                        ],
                        [
                          "Not filing AR-11 after moving",
                          "The biometrics appointment notice goes to the old address. A missed appointment can be treated as abandonment.",
                          "File the change of address within 10 days, and update it in the online account too.",
                        ],
                        [
                          "Travelling on the expired card alone",
                          "Boarding refused, or secondary inspection on arrival.",
                          "Carry the receipt notice with the card. Together they are the evidence of status.",
                        ],
                      ].map((row) => (
                        <tr key={row[0]} className="border-b border-ink-900/5 align-top">
                          <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink-800">
                            {row[0]}
                          </th>
                          <td className="py-3 pr-3">{row[1]}</td>
                          <td className="py-3 text-ink-500">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-ink-900 sm:text-2xl">
                  A note on processing times
                </h2>
                <p className="mt-3">
                  You will not find an &ldquo;I-751 takes X months&rdquo; figure on
                  this page, and that is deliberate. USCIS publishes processing
                  times per form, per subtype and per office, and they move every
                  month; a single range copied onto a third-party page is wrong
                  for most readers almost immediately. Check{" "}
                  <a
                    href={I751_SOURCES.processingTimes}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    the official processing-times tool
                  </a>{" "}
                  for the office handling your case, and use{" "}
                  <Link
                    href="/tools/uscis-processing-delay-checker"
                    className="text-brand-600 underline"
                  >
                    our delay checker
                  </Link>{" "}
                  to see whether you are outside normal processing time and
                  eligible to submit an inquiry.
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
              intro={`Checked against these official sources on ${formatDate(
                I751_FACTS.lastVerified
              )}. Fees and the extension length have both changed before — verify before filing.`}
              links={[
                { label: "Form I-751 (USCIS)", href: I751_SOURCES.form },
                { label: `USCIS fee schedule — ${I751_FACTS.feeEdition}`, href: I751_SOURCES.feeSchedule },
                { label: "Removing conditions based on marriage", href: I751_SOURCES.removingConditions },
                { label: "USCIS filing-date calculator", href: I751_SOURCES.whenToFile },
                { label: `USCIS alert — ${I751_FACTS.extensionMonths}-month extension`, href: I751_SOURCES.extensionAlert },
                { label: "I-9 Central — the 48-month extension for employers", href: I751_SOURCES.i9Central },
                { label: "Conditional permanent residence", href: I751_SOURCES.conditionalResidence },
                { label: "USCIS processing times", href: I751_SOURCES.processingTimes },
              ]}
            />

            <div className="mx-auto mt-6 max-w-3xl">
              <NotLegalAdvice />
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <h2 className="text-base font-bold text-ink-900">Related guides</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "/i90-vs-i751", label: "I-90 vs I-751 — which form do you need?" },
                  { href: "/divorce-immigration-status", label: "Divorce and your immigration status" },
                  { href: "/green-card-renewal", label: "Green card renewal (Form I-90)" },
                  { href: "/replace-green-card", label: "Replacing a lost or damaged green card" },
                  { href: "/uscis/forms/n-400", label: "Form N-400 — naturalisation" },
                  { href: "/uscis/forms", label: "All USCIS forms explained" },
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
                  "US permanent residence process",
                  "Conditional residence & I-751",
                  "Travel to India on a pending petition",
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
