import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import UscisStatusTool from "@/components/tools/UscisStatusTool";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  absoluteUrl,
  type FaqItem,
} from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { uscisChildPages } from "@/lib/uscisCluster";

const PAGE_PATH = "/uscis/case-status";
const UPDATED = "2026-06-16";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title:
      "USCIS Case Status Meaning for Indians | H1B, I-140, I-485, EAD",
    description:
      "Understand common USCIS case status messages in simple language for H1B, I-140, I-485, EAD, Advance Parole, green card and Indian applicants.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: UPDATED, modifiedTime: UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "USCIS Guide", url: "/uscis" },
  { name: "Case Status Explained", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "How do I check my USCIS case status?",
    answer:
      "Go to egov.uscis.gov/casestatus and enter your receipt number — the 13-character code on your I-797 Notice of Action. You can also sign up for case status email notifications in myUSCIS.",
  },
  {
    question: "What does \"Case Is Being Actively Reviewed\" mean?",
    answer:
      "An adjudicator has opened your case file and is evaluating it. This is normal adjudication. The next update could be an approval, Request for Evidence (RFE), biometrics notice, or interview scheduling.",
  },
  {
    question: "How long can a case stay in \"Actively Reviewed\" status?",
    answer:
      "There is no fixed time. It can last days, weeks, or months depending on the form, service center workload, and case complexity. Compare your wait to the published processing times at uscis.gov for your form and center.",
  },
  {
    question: "Is an RFE bad? Does it mean my case will be denied?",
    answer:
      "An RFE is not a denial. It means USCIS needs more documentation. Many cases with RFEs are approved after a complete, timely response. The key risk is missing the deadline (usually 87 days from the notice date) or submitting an incomplete response.",
  },
  {
    question: "What does USCIS case approval mean for I-140?",
    answer:
      "I-140 approval establishes your priority date. For Indians in EB-2 and EB-3, you then wait — sometimes many years — for the priority date to become current in the visa bulletin before filing I-485. The I-140 approval also allows H1B extensions beyond 6 years.",
  },
  {
    question: "Can I travel internationally while my I-485 is pending?",
    answer:
      "Only if you have a valid Advance Parole (Form I-131 approval) document. Leaving the US while your I-485 is pending without Advance Parole is generally treated as abandonment of the adjustment application. Always confirm with your attorney before any international travel.",
  },
  {
    question: "What is the difference between \"Card Is Being Produced\" and \"Card Was Mailed\"?",
    answer:
      "\"Card Is Being Produced\" means the physical card (green card or EAD) is being printed. \"Card Was Mailed\" means USCIS has sent it via USPS. Delivery typically takes 7–10 business days after the mailed status appears. Do not start working on an EAD until you physically hold the card.",
  },
  {
    question: "My case was transferred — does that reset my processing time?",
    answer:
      "Functionally yes — your case joins the new service center's queue. Your receipt number stays the same. Check the published processing time for the new center to reset your wait expectation.",
  },
];

const statusRows = [
  {
    status: "Case Was Received",
    meaning: "Filing accepted, receipt number assigned",
    next: "Case Is Being Actively Reviewed",
    worry: "No NOA1 after 6 weeks",
    forms: "All",
    slug: "case-was-received",
  },
  {
    status: "Case Is Being Actively Reviewed",
    meaning: "Adjudicator is actively working on your file",
    next: "Approval, RFE, biometrics, or interview notice",
    worry: "Past published processing time window",
    forms: "All",
    slug: "case-is-being-actively-reviewed",
  },
  {
    status: "Request for Evidence Was Sent",
    meaning: "USCIS needs more documentation",
    next: "Respond before the deadline (usually 87 days)",
    worry: "Immediately — hard deadline",
    forms: "All",
    slug: "request-for-evidence-rfe",
  },
  {
    status: "Case Was Approved",
    meaning: "Petition/application approved",
    next: "Card production (EAD/green card) or I-797 mailed",
    worry: "No approval notice after 6 weeks",
    forms: "All",
    slug: "case-approved-what-next",
  },
  {
    status: "Card Is Being Produced",
    meaning: "Physical card printing in progress",
    next: "Card Was Mailed → delivery 7–10 business days",
    worry: "No card after 30 days of 'Card Was Mailed'",
    forms: "I-485, I-765, I-131",
    slug: "card-is-being-produced",
  },
  {
    status: "Case Was Transferred",
    meaning: "Case moved to a different service center",
    next: "Case Is Being Actively Reviewed (at new center)",
    worry: "Only if no update for 3+ months after transfer",
    forms: "All",
    slug: "case-transferred",
  },
  {
    status: "Biometrics Appointment Was Scheduled",
    meaning: "Fingerprint/photo appointment booked at ASC",
    next: "Attend appointment → back to adjudication",
    worry: "Missing appointment without rescheduling",
    forms: "I-485, I-765, N-400, I-539",
    slug: "biometrics-notice",
  },
  {
    status: "Interview Was Scheduled",
    meaning: "In-person interview at local USCIS field office",
    next: "Attend interview → approval, continuance, or more evidence",
    worry: "Any specific issues flagged in notice",
    forms: "I-485, N-400",
    slug: "interview-scheduled",
  },
  {
    status: "Case Was Denied",
    meaning: "Application not approved — grounds in denial notice",
    next: "MTR/MTC (33 days), AAO appeal, refile, or federal court",
    worry: "Immediately — deadlines are 30–33 days",
    forms: "All",
    slug: "case-denied",
  },
];

const formSections = [
  {
    form: "I-129 H1B / L1",
    icon: "💼",
    points: [
      "\"Case Was Received\" + NOA1 confirms your receipt date and your priority date for AC21 purposes.",
      "\"Actively Reviewed\" for H1B extensions can last several months — check the current Texas or California Service Center times.",
      "H1B RFEs most often challenge specialty occupation (SOC code vs. degree), employer-employee relationship, or third-party worksite issues.",
      "H1B approval means you can work on the start date listed on the I-797. Carry the I-797 when traveling internationally.",
      "H1B denial: contact your attorney same day — you may have other valid status, but the clock starts immediately.",
    ],
  },
  {
    form: "I-140 Employment Green Card",
    icon: "📋",
    points: [
      "I-140 approval establishes your priority date. For Indians in EB-2 or EB-3, this date may be 5–20+ years before a visa number becomes available.",
      "An approved I-140 supports H1B extensions beyond 6 years under INA 106(c) — even if you change employers after 180 days (AC21).",
      "The priority date on your I-140 approval notice is critical. Verify it matches your labor certification date (for EB-3 PERM cases) or I-140 receipt date (for EB-2 NIW).",
      "I-140 RFEs for EB-2 NIW often challenge the three-prong test: substantial merit, national importance, well-positioned.",
    ],
  },
  {
    form: "I-485 Adjustment of Status",
    icon: "🟢",
    points: [
      "I-485 processing is typically the longest and most complex stage for Indians due to priority date backlogs.",
      "Once I-485 is filed (and if your priority date was current at filing), you can file I-765 (EAD) and I-131 (Advance Parole) concurrently.",
      "Do not leave the US while I-485 is pending without a valid Advance Parole document — it abandons your adjustment.",
      "Biometrics are required for almost all I-485 applicants. Attend your appointment or reschedule immediately.",
      "I-485 approval = green card. Watch for \"Card Is Being Produced\" → physical card delivery.",
    ],
  },
  {
    form: "I-765 EAD",
    icon: "💳",
    points: [
      "EAD processing times vary widely — currently often 3–12 months. File as early as USCIS allows (usually 6 months before your current EAD expires).",
      "Do NOT start working until you physically hold the approved EAD card — not when the case shows \"Approved.\"",
      "H4 EAD (category c(26)) requires an approved I-140 OR a pending H1B extension filed at least 365 days ago.",
      "EAD renewals filed on or after October 30, 2025 no longer receive an automatic extension — file early to avoid work gaps.",
    ],
  },
  {
    form: "I-131 Advance Parole",
    icon: "✈️",
    points: [
      "Advance Parole is required to travel internationally while I-485 is pending. Without it, returning to the US abandons your adjustment.",
      "Do not travel until you physically hold the approved AP document — \"Approved\" status is not sufficient.",
      "If your I-485 is also pending: consult your attorney before every international trip, even with valid AP.",
      "AP is often issued as a combo card (EAD + AP on one card) for I-485 applicants who also file I-765.",
    ],
  },
  {
    form: "I-130 Family Petition",
    icon: "👨‍👩‍👧",
    points: [
      "I-130 approval establishes the priority date for the beneficiary (family member).",
      "Immediate relatives of US citizens (spouse, unmarried minor children, parents) have no numerical wait — visa is immediately available.",
      "Preference categories (adult children, siblings, spouses/minor children of permanent residents) have wait times that vary by country and category.",
      "After approval, next step is consular processing (NVC) or I-485 (if the beneficiary is in the US and eligible).",
    ],
  },
  {
    form: "N-400 Citizenship",
    icon: "🦅",
    points: [
      "N-400 processing includes biometrics, an interview, English test, and civics test.",
      "Study the USCIS 100 civics questions — must correctly answer 6 of 10 at the interview.",
      "If you applied on or after April 19, 2025, confirm which civics test version applies to you at uscis.gov.",
      "Bring all passports, tax returns, and travel records (showing continuous residence) to the N-400 interview.",
      "Extended trips abroad (6+ months) can raise continuous residence issues — disclose all trips accurately.",
    ],
  },
];

const jsonLd = jsonLdGraph(
  {
    "@type": "Article",
    "@id": `${absoluteUrl(PAGE_PATH)}#article`,
    headline:
      "USCIS Case Status Explained for Indians: H1B, I-140, I-485, EAD & Green Card",
    description:
      "Understand common USCIS case status messages in simple language for H1B, I-140, I-485, EAD, Advance Parole, green card and Indian applicants.",
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: { "@type": "Organization", name: site.publisher },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(PAGE_PATH) },
    url: absoluteUrl(PAGE_PATH),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  },
  breadcrumbJsonLd(crumbs),
  faqJsonLd(faqs)
);

export default function UscisStatusHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="border-b border-ink-900/5 bg-white pt-8 pb-7 sm:pt-10">
          <Container>
            <div className="mx-auto max-w-[720px]">
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

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-400">
                <Link
                  href="/uscis"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 font-semibold text-white"
                >
                  <span>🛂</span>
                  USCIS
                </Link>
                <span>Updated {formatDate(UPDATED)}</span>
              </div>

              <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2rem]">
                USCIS Case Status Explained for Indians: H1B, I&#8209;140,
                I&#8209;485, EAD &amp; Green Card
              </h1>
              <p className="mt-2.5 text-base italic leading-[1.6] text-ink-500">
                Plain-English guide to every common USCIS case status — what it
                means, what happens next, when to worry, and what to do — for
                H1B workers, green card applicants, EAD holders, and Indian
                immigrants.
              </p>
            </div>
          </Container>
        </header>

        <div className="py-8 sm:py-10">
          <Container>
            <div className="mx-auto max-w-[720px] space-y-12">

              {/* ── Quick Answer ──────────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">Quick answer</h2>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 text-sm leading-relaxed text-ink-800">
                  <p>
                    Your USCIS case status is the current stage of your petition or
                    application in USCIS&apos;s processing queue. Check it at{" "}
                    <a
                      href="https://egov.uscis.gov/casestatus/landing.do"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-600 underline"
                    >
                      egov.uscis.gov
                    </a>{" "}
                    using your receipt number — the 13-character code on your I-797 Notice
                    of Action (e.g., LIN2412345678 or IOE0123456789).
                  </p>
                  <p className="mt-2">
                    Statuses like <strong>"Case Was Received"</strong> and{" "}
                    <strong>"Case Is Being Actively Reviewed"</strong> are normal
                    adjudication stages. <strong>"Request for Evidence Was Sent"</strong>{" "}
                    needs your immediate attention. <strong>"Case Was Approved"</strong>{" "}
                    means different things for different forms — I-140 approval is just
                    the start of a long journey for most Indians, while I-485 approval
                    means your green card is on its way.
                  </p>
                </div>
              </section>

              {/* ── Tool Widget ───────────────────────────────────────────── */}
              <section id="tool">
                <UscisStatusTool />
              </section>

              {/* ── Who this is for ───────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-3">Who this guide is for</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: "💼", label: "H1B workers checking petition status" },
                    { icon: "📋", label: "I-140 filers waiting for approval or priority date" },
                    { icon: "🟢", label: "I-485 applicants tracking adjustment of status" },
                    { icon: "💳", label: "EAD holders checking I-765 / renewal status" },
                    { icon: "✈️", label: "Advance Parole applicants (I-131)" },
                    { icon: "👨‍👩‍👧", label: "Family petition filers (I-130)" },
                    { icon: "🦅", label: "N-400 naturalization applicants" },
                    { icon: "🇮🇳", label: "Indian EB green card waiters with India chargeability" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl border border-ink-900/5 bg-white p-3.5 text-sm text-ink-700"
                    >
                      <span className="text-xl leading-none">{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Status table ──────────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-4">
                  All common USCIS statuses at a glance
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Simple meaning</th>
                        <th className="px-4 py-3 hidden md:table-cell">What&apos;s next</th>
                        <th className="px-4 py-3">When to act</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusRows.map((row, i) => (
                        <tr
                          key={row.slug}
                          className={`border-t border-ink-900/5 ${i % 2 === 0 ? "bg-white" : "bg-ink-50/30"}`}
                        >
                          <td className="px-4 py-3 font-medium text-ink-900">
                            <Link
                              href={`/uscis/${row.slug}`}
                              className="text-brand-600 hover:text-brand-700 hover:underline"
                            >
                              {row.status}
                            </Link>
                          </td>
                          <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">
                            {row.meaning}
                          </td>
                          <td className="hidden px-4 py-3 text-ink-600 md:table-cell">
                            {row.next}
                          </td>
                          <td className="px-4 py-3 text-ink-600">{row.worry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── Status deep-dives ─────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-6">
                  Each status explained
                </h2>
                <div className="space-y-6">
                  {statusRows.map((row) => {
                    const child = uscisChildPages.find((p) => p.slug === row.slug);
                    return (
                      <div
                        key={row.slug}
                        className="rounded-2xl border border-ink-900/10 bg-white p-5"
                      >
                        <h3 className="font-bold text-ink-900">{row.status}</h3>
                        <p className="mt-1.5 text-sm text-ink-600">{row.meaning}.</p>
                        {child && (
                          <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">
                            {child.excerpt}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                          <span>Forms: {row.forms}</span>
                          <span>·</span>
                          <span>Act when: {row.worry}</span>
                        </div>
                        <Link
                          href={`/uscis/${row.slug}`}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                          Full guide →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── Form-specific sections ────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-6">
                  USCIS case status by form type
                </h2>
                <div className="space-y-6">
                  {formSections.map((sec) => (
                    <div
                      key={sec.form}
                      className="rounded-2xl border border-ink-900/10 bg-white p-5"
                    >
                      <h3 className="flex items-center gap-2 font-bold text-ink-900">
                        <span className="text-xl leading-none">{sec.icon}</span>
                        {sec.form}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {sec.points.map((pt) => (
                          <li
                            key={pt}
                            className="flex items-start gap-2 text-sm text-ink-600"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-blue-400" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Receipt number callout ────────────────────────────────── */}
              <section className="rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5">
                <h2 className="font-bold text-ink-900 mb-2">
                  What is a USCIS receipt number?
                </h2>
                <p className="text-sm leading-relaxed text-ink-600 mb-3">
                  Your receipt number is the 13-character code on your I-797 Notice of
                  Action (e.g., <code className="font-mono text-ink-800">LIN2412345678</code>
                  ). The first 3 letters are the service center code: LIN = Nebraska, SRC =
                  Texas, EAC = Vermont, WAC = California, IOE = online filing, MSC = National
                  Benefits Center.
                </p>
                <Link
                  href="/uscis/receipt-number"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Full receipt number guide — IOE, LIN, SRC, EAC, WAC, MSC explained →
                </Link>
              </section>

              {/* ── FAQ ──────────────────────────────────────────────────── */}
              <section>
                <h2 className="text-xl font-bold text-ink-900 mb-6">
                  Frequently asked questions
                </h2>
                <div className="space-y-5">
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-semibold text-ink-900 text-base">
                        {faq.question}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Disclaimer footer ─────────────────────────────────────── */}
              <div className="rounded-2xl border border-ink-900/5 bg-white p-6 text-sm text-ink-500">
                <strong className="font-semibold text-ink-700">A quick note: </strong>
                This guide is educational and reflects general information, not
                personalized legal or immigration advice. USCIS rules, fees, and
                processing times change frequently. Always verify at the official{" "}
                <a
                  href="https://www.uscis.gov"
                  className="text-brand-600 underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  USCIS website
                </a>{" "}
                and consult a licensed immigration attorney for your situation.
              </div>

            </div>
          </Container>
        </div>
      </article>

      {/* ── Cluster navigation ──────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-1">
              Keep reading
            </p>
            <h2 className="text-xl font-bold text-ink-900 mb-6">
              Each USCIS status — full guide
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {uscisChildPages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/uscis/${p.slug}`}
                  className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {p.kind === "reference" ? "Reference" : "Status guide"}
                  </span>
                  <h3 className="mt-1 font-semibold text-ink-900 group-hover:text-brand-700">
                    {p.navLabel}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
