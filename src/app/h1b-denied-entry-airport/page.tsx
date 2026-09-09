import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PortOfEntryRiskScorecard from "@/components/tools/PortOfEntryRiskScorecard";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  POE_UPDATED,
  POE_UPDATED_HUMAN,
  POE_PUBLISHED,
  otherPoeLinks,
  poeArticleJsonLd,
  poeRelatedLinks,
  poeWebAppJsonLd,
} from "@/lib/portOfEntryCluster";
import {
  POE_VERIFIED,
  deferredInspection,
  gracePeriods,
  i94Notes,
  poeOutcomes,
  poeSources,
  referralCauses,
  swornStatement,
} from "@/data/portOfEntryData";

const PATH = "/h1b-denied-entry-airport";
const TITLE =
  "Denied Entry at the Airport on an Approved H-1B: What Happens, and What It Costs You";
const DESC =
  "An approved H-1B can still be refused admission. What happens in secondary inspection, the difference between withdrawal, expedited removal and deferred inspection, the sworn statement you are asked to sign, and what it means for your H-4 family and your green card.";

export const metadata: Metadata = pageMetadata({
  title: "H-1B Denied Entry at the Airport",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Can an approved H-1B be denied entry at the airport?",
    answer:
      "Yes. An approved petition and a valid visa let you travel to a port of entry and ask to be admitted; they do not admit you. Every arrival makes you an applicant for admission, and the CBP officer decides admissibility afresh each time under INA 235. The overwhelming majority of H-1B travellers are admitted in seconds, but refusal is legally available at every arrival, and neither USCIS approval nor a valid stamp forecloses it.",
  },
  {
    question:
      "What is the difference between withdrawing my application for admission and being removed?",
    answer:
      "Withdrawal under INA 235(a)(4) means you ask to take back your request to enter and leave immediately, and no removal order is issued — so no five-year bar under INA 212(a)(9)(A)(i) attaches. Expedited removal under INA 235(b)(1) is a formal removal order issued by the officer without a hearing, and it carries a five-year bar, twenty years for a second removal. The difference between these two outcomes is the single most consequential thing that can happen in a secondary inspection room. Withdrawal is discretionary — 8 CFR 235.4 says nothing in it gives you a right to withdraw — so it is something you ask for, politely and early.",
  },
  {
    question: "Can I refuse to sign the sworn statement?",
    answer:
      "You are not required to sign a statement you believe is inaccurate, and 8 CFR 235.3(b)(2)(i) contemplates corrections: the regulation says you shall sign and initial each page of the statement and each correction. That wording exists because you are meant to read it — or have it read to you — and correct what is wrong before signing. The statement becomes the permanent record of what you said, and it will be read back to you at every future visa interview. Read it. Ask for corrections. Refusing to sign at all does not stop the process and generally does not help you.",
  },
  {
    question: "What happens to my H-4 spouse and children if I am refused entry?",
    answer:
      "H-4 status is derivative of your H-1B, so if you are refused admission your dependants generally cannot be admitted in H-4 either — their eligibility depends on your admission. In practice a family referred to secondary is usually held together and the outcome applies to all of them. Children who are US citizens cannot be refused admission, which creates a real practical problem if both parents are refused. Carry each family member's own documents, and make sure more than one adult can make arrangements.",
  },
  {
    question:
      "Does being refused entry affect my pending I-140 or I-485 and my priority date?",
    answer:
      "A refusal of admission does not by itself revoke an approved I-140 or erase a priority date — the petition and the date belong to the petition, not to your presence. But the practical damage can be severe: a pending I-485 is generally abandoned if you leave the United States without advance parole, an expedited removal order creates an inadmissibility ground that must be waived before any future admission, and a misrepresentation finding under INA 212(a)(6)(C)(i) is a permanent ground. Get advice specific to your case — this is exactly the situation where an immigration attorney is not optional.",
  },
  {
    question: "What is deferred inspection, and is it a refusal?",
    answer:
      "It is not a refusal. Under 8 CFR 235.2 a CBP officer who cannot finish your inspection at the port can defer it: you are paroled in under INA 212(d)(5) and given Form I-546, an Order to Appear, telling you to report to a deferred inspection site with specified documents. There are more than 70 such sites. They also exist to correct I-94 errors. Reporting as ordered is not optional — failing to appear turns a solvable documentation question into a status problem.",
  },
  {
    question: "My I-94 shows a date earlier than my petition validity. Is that an error?",
    answer:
      "Usually not. CBP routinely admits a traveller only until the expiry of their passport, so an I-94 that ends on your passport expiry date rather than your petition end date is the system working as designed, not a mistake. The remedy is a new passport followed by an extension or a fresh admission. A genuine error — the wrong visa class, a misspelled name, a wrong date of birth, or a date unrelated to your passport — is what deferred inspection sites correct.",
  },
  {
    question:
      "Will I have to declare this on the DS-160 for the rest of my life?",
    answer:
      "Yes. The DS-160 asks whether you have ever been refused admission to the United States, and a withdrawal of your application for admission is a refusal of admission for that purpose even though no removal order was issued. Answer it truthfully every time. A false answer creates a misrepresentation problem under INA 212(a)(6)(C)(i) that is far worse and far more permanent than the original refusal.",
  },
  {
    question: "Can CBP search my phone and laptop at the border?",
    answer:
      "Yes. Electronic device searches at the border are conducted without the warrant that would be required inside the country, and refusing to unlock a device can lead to the device being detained. What matters practically for H-1B travellers is what is found: a LinkedIn profile naming a different employer than your petition, messages about being on the bench, or a resume with a job title that does not match the I-129 are direct contradictions of the document the officer is holding. Make your public record consistent with your petition before you fly, not at the border.",
  },
  {
    question: "Should I have an attorney's number with me when I travel?",
    answer:
      "Yes, memorised or on paper, not only in a phone that may be taken. You do not have a right to counsel in the inspection process itself — a Form G-28 does not give an attorney a seat in secondary inspection — but your employer and your attorney can act quickly on the outside, and the first hour matters. Tell your employer you have been referred as soon as you are able.",
  },
];

/* Which outcome an officer records changes everything downstream. */
const WAIVER_ROUTES: {
  route: string;
  whenYouNeedIt: string;
  whatItFixes: string;
  duration: string;
}[] = [
  {
    route: "Neither — no waiver needed",
    whenYouNeedIt:
      "You withdrew your application for admission, or you were paroled for deferred inspection and it resolved.",
    whatItFixes:
      "Nothing to fix. No removal order was issued, so INA 212(a)(9)(A)(i) never attached.",
    duration:
      "Permanent, but you must still disclose the refusal of admission on every future application.",
  },
  {
    route: "Form I-212 — permission to reapply",
    whenYouNeedIt:
      "You were removed, including by expedited removal, and are inadmissible under INA 212(a)(9)(A) or (C).",
    whatItFixes:
      "Consent to reapply for admission after removal. Approval permanently relieves the 212(a)(9)(A) ground for removals occurring before the approval, and covers immigrant and nonimmigrant entries.",
    duration: "Permanent relief from that ground once approved.",
  },
  {
    route: "Form I-192 or an INA 212(d)(3) waiver",
    whenYouNeedIt:
      "A separate inadmissibility ground applies — most often a misrepresentation finding under INA 212(a)(6)(C)(i), or a criminal ground.",
    whatItFixes:
      "Advance permission to enter temporarily as a nonimmigrant despite that ground. When you are applying for a visa abroad, the 212(d)(3) waiver is normally requested through the consular officer rather than by filing I-192 yourself.",
    duration:
      "Temporary — limited to the number of visits and the period specified in the approval, so it must be renewed.",
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    poeWebAppJsonLd({
      path: PATH,
      name: "Port-of-Entry Risk Scorecard",
      description:
        "Score the fact patterns that most often send an H-1B traveller to secondary inspection, and see which document answers each one.",
    }),
    poeArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: POE_PUBLISHED,
      dateModified: POE_UPDATED,
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "H-1B", url: "/h1b" },
      { name: "Denied Entry at the Airport", url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="h1b-denied-entry-airport"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "H-1B", href: "/h1b" },
          { label: "Denied Entry at the Airport" },
        ]}
        icon="🛂"
        category="Visa & Green Card"
        title="Denied Entry at the Airport on an Approved H-1B"
        hook="An approved petition gets you to the border, not through it. What happens in secondary inspection, which outcome carries a five-year bar, and how to keep the one that does not."
        accent="from-rose-600 to-orange-600"
        badges={[
          "Every claim cited",
          "Statute & CFR",
          "Verified Sep 2026",
          "Not legal advice",
        ]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#tool"
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700"
            >
              Score My Travel Risk →
            </a>
            <a
              href="#outcomes"
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
            >
              Withdrawal vs. Removal ↓
            </a>
          </div>
        }
        sourceNote={
          <>
            Every legal statement on this page carries an INA section, a CFR
            citation or a government source, verified {POE_VERIFIED}. Immigration
            law changes — verify before relying on any of it.
          </>
        }
        disclaimerExtra={
          <p>
            This page is educational and is not legal advice. It does not create
            an attorney-client relationship and does not replace an immigration
            attorney. If you have been refused admission or are facing travel
            with any of the risk factors described here, speak to a licensed
            immigration attorney about your specific facts.
          </p>
        }
      >
        {/* ── Verdict ─────────────────────────────────────────────────── */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Can an approved H-1B be refused entry?"
              accent="amber"
              rows={[
                {
                  label: "Short answer",
                  value: "Yes",
                  note: "Every arrival makes you an applicant for admission under INA 235.",
                  highlight: true,
                },
                {
                  label: "Worst outcome",
                  value: "5-year bar",
                  note: "Expedited removal under INA 235(b)(1) → INA 212(a)(9)(A)(i).",
                },
                {
                  label: "The outcome to ask for",
                  value: "Withdrawal",
                  note: "INA 235(a)(4) — no removal order, no five-year bar. Discretionary.",
                },
                {
                  label: "Not a refusal at all",
                  value: "Deferred inspection",
                  note: "8 CFR 235.2 — paroled in, ordered to report on Form I-546.",
                },
              ]}
              badges={[
                "Withdrawal ≠ removal",
                "Discretionary, so you must ask",
              ]}
              lastVerified={POE_VERIFIED}
              sources={poeSources.slice(0, 4).map((s) => ({
                label: s.label,
                href: s.href,
              }))}
              disclaimer="Educational only, not legal advice. Admission decisions are made by CBP officers on the facts in front of them."
              ctaText="Score my travel risk before I fly"
              ctaHref="#tool"
            />
          </Container>
        </section>

        {/* ── Situation router ────────────────────────────────────────── */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">
                Start where you actually are
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                This page is organised by situation, not by keyword. Jump to
                yours.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    href: "#in-secondary",
                    title: "Someone is in secondary right now",
                    desc: "What is happening, and what the employer should do in the next hour",
                    tone: "border-rose-200",
                  },
                  {
                    href: "#refused",
                    title: "I was refused and put on a plane",
                    desc: "Work out which outcome it was — the difference is five years",
                    tone: "border-orange-200",
                  },
                  {
                    href: "#i94-wrong",
                    title: "I was admitted but my I-94 is wrong",
                    desc: "Passport truncation vs. a real CBP error, and which is fixable",
                    tone: "border-amber-200",
                  },
                  {
                    href: "#tool",
                    title: "I am about to travel",
                    desc: "Score the fact patterns that drive referrals before you fly",
                    tone: "border-emerald-200",
                  },
                ].map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    className={`rounded-2xl border bg-white p-4 shadow-card transition hover:shadow-sm ${c.tone}`}
                  >
                    <p className="text-sm font-bold text-ink-900">{c.title}</p>
                    <p className="mt-1 text-xs text-ink-600">{c.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── In secondary right now ──────────────────────────────────── */}
        <section
          id="in-secondary"
          className="scroll-mt-20 border-t border-ink-900/5 bg-white py-10 sm:py-14"
        >
          <Container>
            <div className="mx-auto max-w-3xl space-y-5 text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Someone is in secondary inspection right now
              </h2>
              <p>
                Being sent to secondary is not a refusal and is not rare. It
                means the primary officer had a question they could not resolve
                in the twenty seconds a primary inspection allows. Most secondary
                referrals for H-1B travellers end in admission.
              </p>
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                <p className="font-bold text-ink-900">
                  What the traveller should know
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    <strong>Phones are usually taken.</strong> Expect to be
                    without a device for hours. This is why an attorney&rsquo;s
                    number should be on paper and why documents matter more than
                    email access.
                  </li>
                  <li>
                    <strong>Answer only what is asked, and answer truthfully.</strong>{" "}
                    Under INA 235(a)(5) an applicant for admission may be
                    required to state under oath any information sought about
                    their purposes and intentions. A false statement creates a
                    misrepresentation problem under INA 212(a)(6)(C)(i) that is
                    permanent and far worse than the underlying issue.
                  </li>
                  <li>
                    <strong>Do not guess.</strong> &ldquo;I don&rsquo;t
                    remember&rdquo; or &ldquo;I would need to check&rdquo; is a
                    complete answer. An invented detail that contradicts your
                    petition is what turns a question into a case.
                  </li>
                  <li>
                    <strong>
                      Read anything before signing it, and correct it.
                    </strong>{" "}
                    See the sworn statement section below — this is the single
                    most important thing on this page.
                  </li>
                  <li>
                    <strong>
                      If refusal looks likely, ask to withdraw your application
                      for admission.
                    </strong>{" "}
                    Ask early, ask politely, and ask explicitly. It is
                    discretionary and it will not always be granted, but it is
                    never granted if it is not asked for.
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-ink-900/10 bg-ink-50/60 p-5">
                <p className="font-bold text-ink-900">
                  What the employer or family should do in the next hour
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    Contact the company&rsquo;s immigration counsel immediately.
                    Counsel cannot sit in the inspection, and a Form G-28 does
                    not create a right to representation in the inspection
                    process, but they can reach the port&rsquo;s duty officer and
                    can prepare documents.
                  </li>
                  <li>
                    Assemble, as PDFs, ready to send: the current I-797 approval
                    notice, the certified ETA-9035 LCA covering the actual
                    worksite, the last three to six pay stubs, a dated
                    employment verification letter, and — for a client-site
                    placement — the client letter or statement of work.
                  </li>
                  <li>
                    Find out which port and which terminal. Deferred inspection,
                    if it is offered, is site-specific.
                  </li>
                  <li>
                    Do not have anyone else in the family volunteer explanations
                    to CBP on the traveller&rsquo;s behalf. Inconsistent accounts
                    between spouses are a common way a solvable question becomes
                    a misrepresentation allegation.
                  </li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* ── The sequence ────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl space-y-5 text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                What actually happens, in order
              </h2>
              <p>
                CBP uses specific terms for each stage. Knowing them helps you
                understand what stage you are at, and it is how the paperwork
                will be described later.
              </p>
              <ol className="mt-4 space-y-4">
                {[
                  {
                    n: 1,
                    t: "Primary inspection",
                    d: "The booth. Passport, visa, a question or two about your job and where you are going. You are an applicant for admission from this moment, and the burden of establishing admissibility is on you — INA 291 places the burden of proof on the applicant, not on the government.",
                  },
                  {
                    n: 2,
                    t: "Referral to secondary",
                    d: "The officer cannot resolve something at the booth. You are escorted to a separate area. This is a referral, not a refusal, and it is where most H-1B cases both begin and end.",
                  },
                  {
                    n: 3,
                    t: "Questioning and document review",
                    d: "Your petition is on the officer's screen. Questions focus on the employer-employee relationship, the actual worksite, your duties and your payroll history. Devices may be examined.",
                  },
                  {
                    n: 4,
                    t: "Sworn statement, if it goes that far",
                    d: `Where expedited removal is being contemplated, ${swornStatement.cite} requires a sworn record on ${swornStatement.forms}. This is the point of no return for the written record.`,
                  },
                  {
                    n: 5,
                    t: "The outcome fork",
                    d: "Admission; admission with a corrected or shortened I-94; parole for deferred inspection; permission to withdraw the application for admission; or an expedited removal order. These are not equivalent and the last two differ by five years.",
                  },
                ].map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">
                      {s.n}
                    </span>
                    <div>
                      <p className="font-bold text-ink-900">{s.t}</p>
                      <p className="mt-1 text-sm">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* ── Why H-1B travellers get referred ────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Why H-1B travellers get referred
              </h2>
              <p className="mt-2">
                Referrals are driven by a small number of recurring fact
                patterns. They compound: any one of these alone is ordinary, but
                three together is the shape officers are trained to look at. For
                Indian H-1B holders the first one on this list is the root cause
                far more often than any other, because it describes the operating
                model of most IT staffing firms.
              </p>
              <div className="mt-5 space-y-3">
                {referralCauses.map((c, i) => (
                  <details
                    key={c.id}
                    className="group rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card"
                    open={i === 0}
                  >
                    <summary className="cursor-pointer list-none">
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-sm font-bold text-ink-900">
                          {c.title}
                        </span>
                        <span
                          aria-hidden
                          className="mt-0.5 flex-none text-xs text-ink-400 transition group-open:rotate-180"
                        >
                          ▾
                        </span>
                      </span>
                    </summary>
                    <div className="mt-3 space-y-2 text-sm">
                      <p>{c.why}</p>
                      <p className="rounded-lg bg-ink-50 p-2.5 italic text-ink-700">
                        Likely question: &ldquo;{c.question}&rdquo;
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-700">
                          What closes it:
                        </span>{" "}
                        {c.closer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm">
                <p className="font-bold text-ink-900">
                  What CBP looks at on your devices
                </p>
                <p className="mt-2">
                  Border device searches do not require the warrant that would be
                  needed inland. For an H-1B traveller the risk is rarely privacy
                  in the abstract — it is contradiction. A LinkedIn headline
                  naming a client rather than your petitioner, a resume listing a
                  job title that differs from the I-129, or messages about being
                  &ldquo;on the bench&rdquo; between projects each contradict the
                  petition the officer is reading. None of these is illegal.
                  All of them are hard to explain at 2am in a room with no
                  documents. Reconcile your public record with your petition
                  before you travel.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── The sworn statement ─────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                The sworn statement: {swornStatement.forms}
              </h2>
              <p className="mt-2">
                Almost nothing written for this audience mentions these forms by
                name, and they are the most consequential paper you will ever be
                handed at a border. Under {swornStatement.cite}, in every case
                where expedited removal is to be applied, the officer must create
                a sworn record of the facts and of your statements.
              </p>
              <p className="mt-3">{swornStatement.summary}</p>
              <div className="mt-5 rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  The sentence to remember
                </p>
                <p className="mt-2 text-lg font-bold leading-snug text-ink-900">
                  &ldquo;{swornStatement.correctionRight}&rdquo;
                </p>
                <p className="mt-2 text-sm text-ink-600">
                  {swornStatement.cite}. The regulation contemplates corrections
                  — that is why it requires you to initial each one. You are
                  meant to read the statement, or have it read to you, and fix
                  what is wrong <em>before</em> you sign.
                </p>
              </div>
              <p className="mt-4">
                Why it matters so much: this statement becomes the permanent
                record of what you said. It will be in the system at every future
                visa interview, at every future admission, and in the file of any
                later petition. A rushed, inaccurate sentence written at the end
                of a twenty-hour journey — &ldquo;I work for [client]&rdquo; when
                your petitioner is a vendor, or a guess at a date — can be read
                back to you for the rest of your immigration life. Take the time.
                Ask for the correction. Initial it.
              </p>
              <p className="mt-3">
                Form I-860 is the Notice and Order of Expedited Removal itself.
                If you are served with it, you are being removed, not refused
                informally — and the five-year bar in the next section attaches.
              </p>
            </div>
          </Container>
        </section>

        {/* ── The outcome fork ────────────────────────────────────────── */}
        <section
          id="outcomes"
          className="scroll-mt-20 border-t border-ink-900/5 bg-white py-10 sm:py-14"
        >
          <Container>
            <div className="mx-auto max-w-4xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Withdrawal vs. expedited removal vs. deferred inspection
              </h2>
              <p className="mt-2">
                These three get used interchangeably in forum posts and they are
                not interchangeable. One of them costs you five years.
              </p>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink-900/10 text-left align-bottom">
                      <th className="py-2 pr-3 font-bold text-ink-900"></th>
                      {poeOutcomes.map((o) => (
                        <th key={o.id} className="py-2 pr-3 font-bold text-ink-900">
                          {o.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {(
                      [
                        ["What it is", "whatItIs"],
                        ["Removal order?", "removalOrder"],
                        ["Statutory bar", "bar"],
                        ["Effect on the visa", "visaEffect"],
                        ["What you disclose later", "laterDisclosure"],
                        ["Authority", "authority"],
                      ] as [string, keyof (typeof poeOutcomes)[number]][]
                    ).map(([label, key]) => (
                      <tr key={label} className="border-b border-ink-900/5">
                        <td className="py-2.5 pr-3 font-semibold text-ink-800">
                          {label}
                        </td>
                        {poeOutcomes.map((o) => (
                          <td
                            key={o.id}
                            className={`py-2.5 pr-3 ${
                              key === "bar" && o.id === "expedited"
                                ? "font-semibold text-rose-700"
                                : key === "bar" && o.id === "withdrawal"
                                  ? "font-semibold text-emerald-700"
                                  : key === "authority"
                                    ? "font-mono text-[0.7rem] text-ink-500"
                                    : ""
                            }`}
                          >
                            {String(o[key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5">
                <p className="font-bold text-ink-900">
                  How to ask for withdrawal
                </p>
                <p className="mt-2 text-sm">
                  There is no form and no magic phrase, and no competitor gives
                  the reader anything to say. Plainly and without argument:{" "}
                  <em>
                    &ldquo;Officer, if you are not going to admit me, I would like
                    to request permission to withdraw my application for
                    admission and return home voluntarily.&rdquo;
                  </em>
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  <li>
                    <strong>Ask before a removal order is issued</strong>, not
                    after. Once Form I-860 is served the moment has passed.
                  </li>
                  <li>
                    <strong>It is discretionary.</strong> 8 CFR 235.4 says
                    nothing in it gives you the right to withdraw, and INA
                    235(a)(4) frames it as a matter of discretion. Arguing does
                    not improve your odds.
                  </li>
                  <li>
                    <strong>Be able and willing to depart immediately.</strong>{" "}
                    Permission is normally not granted unless you intend and are
                    able to leave straight away, and you will normally remain in
                    carrier or government custody until you do.
                  </li>
                  <li>
                    <strong>It is still a refusal of admission.</strong> You will
                    disclose it forever. What you avoid is the removal order and
                    the five-year bar — which is a great deal to avoid.
                  </li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Deferred inspection (A3 folded in) ──────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Deferred inspection: the outcome nobody explains
              </h2>
              <p className="mt-2">
                Deferred inspection is the least understood and most benign of
                the three outcomes. Under {deferredInspection.cite}, an officer
                who has reason to believe you can overcome a finding of
                inadmissibility — by producing evidence that simply is not with
                you at the airport — may defer the rest of your inspection rather
                than refuse you. The deferral itself is accomplished as parole
                under INA 212(d)(5), for the time needed to finish the
                inspection.
              </p>
              <p className="mt-3">
                In practice: you are released into the United States, and handed{" "}
                <strong>{deferredInspection.form}</strong> telling you where and
                when to report and what to bring. There are{" "}
                {deferredInspection.siteCount} deferred inspection sites across
                the United States and its territories.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                  <p className="text-sm font-bold text-ink-900">
                    What deferred inspection can fix
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {deferredInspection.corrects.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span aria-hidden className="text-sky-600">
                          ·
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                    <li className="flex gap-2">
                      <span aria-hidden className="text-sky-600">
                        ·
                      </span>
                      <span>
                        A document you could not produce at the port — the
                        certified LCA, a pay stub, a client letter
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
                  <p className="text-sm font-bold text-ink-900">
                    If you do not report
                  </p>
                  <p className="mt-2 text-sm">
                    Reporting is an order, not an invitation. Failing to appear
                    turns a solvable documentation question into an unresolved
                    inspection and a status problem — and it is entirely
                    self-inflicted. If the date is impossible, contact the site
                    before it, not after.
                  </p>
                </div>
              </div>

              <p className="mt-5">
                <strong>What to bring:</strong> everything named on the I-546,
                plus your passport, the I-797 approval, your I-94 printout, the
                certified LCA covering your worksite, recent pay stubs and an
                employment verification letter. Take a lawyer if the underlying
                question is about status rather than a missing piece of paper.
                Find your site on the{" "}
                <a
                  href={deferredInspection.sitesHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  CBP deferred inspection site list
                </a>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* ── I-94 wrong ──────────────────────────────────────────────── */}
        <section
          id="i94-wrong"
          className="scroll-mt-20 border-t border-ink-900/5 bg-white py-10 sm:py-14"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                &ldquo;I was admitted, but my I-94 is wrong&rdquo;
              </h2>
              <p className="mt-2">
                This is a different problem from refusal, and it is far more
                common. Check your I-94 within days of every single arrival at{" "}
                <a
                  href={i94Notes.checkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  i94.cbp.dhs.gov
                </a>
                . The admit-until date on the I-94 — not your visa, and not your
                I-797 — is what controls how long you may stay.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                  <p className="text-sm font-bold text-ink-900">
                    Usually not an error: passport truncation
                  </p>
                  <p className="mt-2 text-sm">{i94Notes.passportTruncation}</p>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                  <p className="text-sm font-bold text-ink-900">
                    A genuine CBP error
                  </p>
                  <p className="mt-2 text-sm">{i94Notes.realErrors}</p>
                  <p className="mt-2 text-sm">
                    Take it to a deferred inspection site. That is precisely what
                    they exist for, and it is far faster than any other route.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-ink-900/10 bg-ink-50/60 p-5 text-sm">
                <p className="font-bold text-ink-900">
                  While you are checking: the two grace periods people misread
                </p>
                <p className="mt-2">
                  <strong>The 10-day windows.</strong> {gracePeriods.tenDay.text}{" "}
                  <span className="font-mono text-[0.7rem] text-ink-500">
                    {gracePeriods.tenDay.cite}
                  </span>
                </p>
                <p className="mt-2">
                  <strong>The 60-day period after employment ends.</strong>{" "}
                  {gracePeriods.sixtyDay.text}{" "}
                  <span className="font-mono text-[0.7rem] text-ink-500">
                    {gracePeriods.sixtyDay.cite}
                  </span>
                </p>
                <p className="mt-2">
                  Note what the regulation actually says: the 60-day period is
                  discretionary, it runs once per authorized validity period, and
                  it is capped by the end of that period. It is routinely
                  described as a guaranteed 60 days. It is not.{" "}
                  <Link href="/h1b-layoff" className="text-brand-600 underline">
                    The layoff page
                  </Link>{" "}
                  covers the options inside it.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── The scorecard ───────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Port-of-Entry Risk Scorecard
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                Answer all fourteen and the scorecard names the specific
                questions an officer is likely to ask you, and the document that
                answers each one. It gives you a band, never a percentage —
                nobody can quantify this honestly.
              </p>
              <div className="mt-5">
                <PortOfEntryRiskScorecard />
              </div>
            </div>
          </Container>
        </section>

        {/* ── H-4 family ──────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                What happens to your H-4 spouse and children
              </h2>
              <p className="mt-2">
                This is the question families ask first and almost nothing on the
                open web answers. The mechanics are straightforward and the
                consequences are not.
              </p>
              <ul className="mt-4 space-y-3">
                <li className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm">
                  <strong className="text-ink-900">
                    H-4 status is derivative.
                  </strong>{" "}
                  It exists because your H-1B exists. If you are not admitted in
                  H-1B, there is generally nothing for the H-4 to attach to, and
                  your dependants cannot be admitted in that classification
                  either.
                </li>
                <li className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm">
                  <strong className="text-ink-900">
                    Each of them is a separate applicant for admission.
                  </strong>{" "}
                  Each is inspected in their own right and each needs their own
                  documents: their own passport, visa, I-797 and I-94, plus the
                  marriage certificate and the children&rsquo;s birth
                  certificates that prove the relationship.
                </li>
                <li className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm">
                  <strong className="text-ink-900">
                    US citizen children cannot be refused admission.
                  </strong>{" "}
                  A US citizen child is admitted regardless of what happens to
                  their parents. If both parents are refused, that produces an
                  immediate and genuinely difficult practical problem. Families
                  travelling in this position should know before they fly who
                  else could care for a child and how they would be reached.
                </li>
                <li className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm">
                  <strong className="text-ink-900">
                    Do not fill each other&rsquo;s silences.
                  </strong>{" "}
                  Spouses questioned separately who give inconsistent accounts of
                  the same job or the same address create a misrepresentation
                  question that neither of them had before. If you do not know
                  the answer to something about your spouse&rsquo;s employment,
                  say so.
                </li>
                <li className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm">
                  <strong className="text-ink-900">
                    An H-4 EAD does not change any of this.
                  </strong>{" "}
                  Employment authorization is a benefit that follows the status;
                  it is not an independent basis for admission. See{" "}
                  <Link href="/tools/h4-ead-navigator" className="text-brand-600 underline">
                    the H-4 EAD navigator
                  </Link>{" "}
                  for how the EAD itself works.
                </li>
              </ul>
            </div>
          </Container>
        </section>

        {/* ── Downstream ──────────────────────────────────────────────── */}
        <section
          id="refused"
          className="scroll-mt-20 border-t border-ink-900/5 bg-white py-10 sm:py-14"
        >
          <Container>
            <div className="mx-auto max-w-4xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                I was refused. What happens now?
              </h2>
              <p className="mt-2">
                First, establish which outcome it actually was. Look at your
                paperwork. If you were served Form I-860, you were removed. If
                you signed a withdrawal, you were not. If you have{" "}
                {deferredInspection.form}, you were not refused at all — you were
                paroled in and you have somewhere to be.
              </p>

              <h3 className="mt-6 text-lg font-bold text-ink-900">
                The visa itself
              </h3>
              <p className="mt-2">
                In most refusals the visa is cancelled. You will often see the
                phrase <em>cancelled without prejudice</em> — that means the
                cancellation itself is not a finding against you and does not
                bar a fresh application, not that nothing happened. You will
                still need a new visa, and the refusal will be visible to the
                consular officer who adjudicates it.
              </p>

              <h3 className="mt-6 text-lg font-bold text-ink-900">
                Your green card case
              </h3>
              <p className="mt-2">
                An approved I-140 is not revoked by a refusal of admission, and
                your priority date belongs to the petition rather than to your
                presence in the country. The real damage is elsewhere: a pending
                I-485 is generally treated as abandoned if you leave the United
                States without advance parole, so if you departed on an
                unapproved trip the adjustment application is the immediate
                casualty — see{" "}
                <Link href="/uscis/forms/i-131" className="text-brand-600 underline">
                  Form I-131 and advance parole
                </Link>
                . And an expedited removal order creates an inadmissibility
                ground that must be waived before <em>any</em> future admission,
                immigrant or nonimmigrant.
              </p>

              <h3 className="mt-6 text-lg font-bold text-ink-900">
                The DS-160 question, forever
              </h3>
              <p className="mt-2">
                The DS-160 asks whether you have ever been refused admission to
                the United States. Withdrawal of an application for admission is
                a refusal of admission for that purpose. Answer yes, every time,
                and be ready to explain it briefly and consistently. The
                temptation to answer no is the single most damaging mistake
                available to you here: a false answer is a misrepresentation
                under INA 212(a)(6)(C)(i), which is permanent, and it is far
                harder to overcome than the refusal you were trying to hide.
              </p>

              <h3 className="mt-6 text-lg font-bold text-ink-900">
                Which waiver, if any, you now need
              </h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink-900/10 text-left align-bottom">
                      <th className="py-2 pr-3 font-bold text-ink-900">Route</th>
                      <th className="py-2 pr-3 font-bold text-ink-900">
                        When you need it
                      </th>
                      <th className="py-2 pr-3 font-bold text-ink-900">
                        What it fixes
                      </th>
                      <th className="py-2 font-bold text-ink-900">How long it lasts</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {WAIVER_ROUTES.map((w) => (
                      <tr key={w.route} className="border-b border-ink-900/5">
                        <td className="py-2.5 pr-3 font-semibold text-ink-800">
                          {w.route}
                        </td>
                        <td className="py-2.5 pr-3">{w.whenYouNeedIt}</td>
                        <td className="py-2.5 pr-3">{w.whatItFixes}</td>
                        <td className="py-2.5">{w.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm">
                If you believe CBP recorded something incorrectly, DHS TRIP is
                the redress channel for traveller records. It is not an appeal of
                an admission decision and it will not undo a removal order — for
                that you need counsel and, usually, Form I-212.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Checklist ───────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                What to carry, every time
              </h2>
              <p className="mt-2">
                On paper, in your hand luggage. Not in checked baggage, and not
                only in an email account you may not be able to open.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  "Passport, valid well beyond your intended stay",
                  "Valid visa stamp — or a documented basis for automatic revalidation",
                  "Current I-797 approval notice",
                  "All prior I-797 notices",
                  "Most recent I-94 printout from i94.cbp.dhs.gov",
                  "Certified ETA-9035 LCA covering your actual worksite",
                  "Pay stubs, last three to six months",
                  "Dated employment verification letter on letterhead",
                  "Client letter or statement of work, for a third-party placement",
                  "Degree certificates and transcripts",
                  "Your immigration attorney's number, on paper",
                  "For families: marriage and birth certificates, and each dependant's own set",
                ].map((d) => (
                  <li
                    key={d}
                    className="flex gap-2 rounded-xl border border-ink-900/5 bg-white p-3 text-sm shadow-card"
                  >
                    <span aria-hidden className="text-emerald-600">
                      &#10003;
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm">
                Returning from a short trip to Canada or Mexico on an expired
                stamp is a separate question with its own rules —{" "}
                <Link
                  href="/automatic-visa-revalidation"
                  className="text-brand-600 underline"
                >
                  automatic visa revalidation
                </Link>{" "}
                covers who qualifies and the one condition that quietly destroys
                it. If you are travelling to India for stamping instead, the
                outbound leg is covered on{" "}
                <Link href="/h1b/travel-to-india" className="text-brand-600 underline">
                  H-1B travel to India
                </Link>{" "}
                and{" "}
                <Link
                  href="/h1b/stamping-india-after-approval"
                  className="text-brand-600 underline"
                >
                  stamping in India after approval
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* ── Sources ─────────────────────────────────────────────────── */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">
                Sources — every claim on this page traces to one of these
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Read {POE_VERIFIED}. Immigration rules change; verify before
                relying on any of this.
              </p>
              <ul className="mt-4 space-y-3">
                {poeSources.map((s) => (
                  <li key={s.href} className="text-sm">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-600 underline"
                    >
                      {s.label} ↗
                    </a>
                    <p className="mt-0.5 text-ink-500">{s.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section className="pb-4">
          <Container>
            <PermClusterLinks
              title="Related H-1B & travel guides"
              links={[...otherPoeLinks(PATH), ...poeRelatedLinks]}
            />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={POE_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
