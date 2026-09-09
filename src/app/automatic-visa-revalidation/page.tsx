import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AvrEligibilityChecker from "@/components/tools/AvrEligibilityChecker";
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
  POE_PUBLISHED,
  POE_UPDATED,
  POE_UPDATED_HUMAN,
  otherPoeLinks,
  poeArticleJsonLd,
  poeRelatedLinks,
  poeWebAppJsonLd,
} from "@/lib/portOfEntryCluster";
import {
  AVR_MISCITATION_NOTE,
  AVR_NATIONALITY_EXCLUSION,
  POE_VERIFIED,
  avrConditions,
  poeSources,
} from "@/data/portOfEntryData";

const PATH = "/automatic-visa-revalidation";
const TITLE =
  "Automatic Visa Revalidation: Returning from Canada or Mexico on an Expired Visa";
const DESC =
  "Automatic revalidation under 22 CFR 41.112(d) lets some nonimmigrants re-enter the US on an expired visa after a trip of 30 days or less to Canada or Mexico. The seven conditions, the nationality exclusion, and the one step that destroys it.";

export const metadata: Metadata = pageMetadata({
  title: "Automatic Visa Revalidation",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "What is automatic visa revalidation?",
    answer:
      "It is a provision at 22 CFR 41.112(d) under which the validity of an expired nonimmigrant visa may be treated as automatically extended to the date you apply for readmission, if you are returning from a short trip to contiguous territory and meet every condition in the regulation. In plain terms: an H-1B holder whose visa stamp expired can drive to Canada for a week and be readmitted on the expired stamp, provided nothing on the list is broken.",
  },
  {
    question: "Does automatic revalidation apply to a trip to India?",
    answer:
      "No. The regulation requires an absence not exceeding 30 days solely in contiguous territory — Canada and Mexico. India is not contiguous territory, and neither is a connecting airport in Europe or the Gulf. If you travel to India on an expired stamp, you will need a new visa before you can return.",
  },
  {
    question:
      "I applied for a visa in Canada and it was approved. Can I still use automatic revalidation?",
    answer:
      "You do not need to, and you cannot. The regulation at 22 CFR 41.112(d)(2)(vii) requires that you have not applied for a new visa while abroad — applying is what ends automatic revalidation, not being refused. If your application was approved you will return on the new visa. If it is still pending, you wait abroad until it is issued. Automatic revalidation is not a fallback once you have applied.",
  },
  {
    question:
      "I applied for a visa in Mexico and was refused. What happens now?",
    answer:
      "This is the worst case the provision produces, and it is why the rule deserves to be understood before you travel rather than after. You cannot fall back on automatic revalidation, because you applied. You cannot return on the new visa, because it was not issued. You are outside the United States until the refusal is resolved, which for a 221(g) can mean weeks or months with no guaranteed timeline. Get legal advice before, not after, applying in a third country.",
  },
  {
    question: "How long can the trip be?",
    answer:
      "Thirty days or fewer. The regulation says an absence not exceeding 30 days, and there is no discretion in the figure and no rounding. Count from the day you depart to the day you apply for readmission, and leave yourself margin — a cancelled flight that pushes you to day 31 removes the benefit entirely.",
  },
  {
    question: "Can I use automatic revalidation for a Caribbean cruise?",
    answer:
      "Generally not, unless you are an F or J nonimmigrant. The adjacent-islands extension in the regulation is written only for students, exchange visitors and their accompanying spouse and children, and it never includes Cuba. In H-1B, H-4, L-1 or L-2 status the trip must be solely to contiguous territory — Canada or Mexico.",
  },
  {
    question: "Does my H-4 spouse get automatic revalidation too?",
    answer:
      "Each traveller is assessed against the conditions in their own right, and the conditions are the same ones. In practice a family travelling together on the same short trip either all qualify or all do not, because the destination and trip length are shared. The individual conditions — a valid passport, an unexpired I-94, no visa application made abroad — still have to hold for each person separately.",
  },
  {
    question: "Is automatic revalidation the same as being admitted?",
    answer:
      "No, and this is the most important limit on it. Automatic revalidation extends the validity of the visa document. It does not make you admissible and it does not oblige anyone to admit you. You are still an applicant for admission, the officer still decides, and every ordinary reason for a referral to secondary inspection still applies.",
  },
  {
    question: "What do I show the officer?",
    answer:
      "Your passport with the expired visa, your unexpired I-94, and your current I-797 approval notice showing that your status continues. Carry recent pay stubs and an employer letter as well. Officers see automatic revalidation far less often than a normal admission, so being able to explain it calmly, and having the I-94 in hand rather than describing it, makes the difference.",
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    poeWebAppJsonLd({
      path: PATH,
      name: "Automatic Visa Revalidation Eligibility Checker",
      description:
        "Check every condition in 22 CFR 41.112(d) and see exactly which one fails, with the citation.",
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
      { name: "Immigration", url: "/immigration" },
      { name: "Automatic Visa Revalidation", url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="automatic-visa-revalidation"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Automatic Visa Revalidation" },
        ]}
        icon="🔁"
        category="Visa & Green Card"
        title="Automatic Visa Revalidation"
        hook="Your visa stamp expired, but your status has not. For a short trip to Canada or Mexico, 22 CFR 41.112(d) may let you back in on the expired stamp — unless you do one specific thing."
        accent="from-sky-600 to-blue-700"
        badges={[
          "Every condition cited",
          "22 CFR 41.112(d)",
          "Verified Sep 2026",
          "Not legal advice",
        ]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#tool"
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              Check My Eligibility →
            </a>
            <a
              href="#forfeit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-50"
            >
              The condition people miss ↓
            </a>
          </div>
        }
        sourceNote={
          <>
            Conditions quoted from 22 CFR 41.112(d), read in full on {POE_VERIFIED}.
            Verify the current regulation before travelling.
          </>
        }
        disclaimerExtra={
          <p>
            Educational only, and not legal advice. Automatic revalidation
            extends a visa&rsquo;s validity; it does not guarantee admission, and
            the CBP officer decides. Speak to an immigration attorney about your
            own facts before relying on it.
          </p>
        }
      >
        {/* ── Fast answer ─────────────────────────────────────────────── */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Automatic visa revalidation at a glance"
              accent="sky"
              rows={[
                {
                  label: "Where you can go",
                  value: "Canada or Mexico",
                  note: "Contiguous territory only. Adjacent islands are F and J only.",
                  highlight: true,
                },
                {
                  label: "How long",
                  value: "30 days or less",
                  note: "No discretion, no rounding.",
                },
                {
                  label: "What you must hold",
                  value: "Unexpired I-94",
                  note: "Plus a valid passport and maintained status.",
                },
                {
                  label: "What destroys it",
                  value: "Applying for a visa",
                  note: "Applying ends it — not merely being refused.",
                },
              ]}
              badges={["22 CFR 41.112(d)", "Seven conditions, all must hold"]}
              lastVerified={POE_VERIFIED}
              sources={[
                { label: poeSources[0].label, href: poeSources[0].href },
                { label: poeSources[8].label, href: poeSources[8].href },
              ]}
              disclaimer="Extends visa validity only. It does not make you admissible, and the officer at the port still decides."
              ctaText="Check every condition against my trip"
              ctaHref="#tool"
            />
          </Container>
        </section>

        {/* ── What it is ──────────────────────────────────────────────── */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                What it actually does
              </h2>
              <p>
                Two documents govern your presence in the United States and
                people routinely confuse them. Your <strong>status</strong> is
                what lets you be here and work — it lives on your I-797 approval
                and your I-94. Your <strong>visa</strong> is a travel document
                that lets you ask to be let in at a port of entry, and nothing
                more. A visa expiring does not end your status; it ends your
                ability to board a flight to the United States and present
                yourself for admission.
              </p>
              <p>
                Automatic revalidation is the narrow exception. Under 22 CFR
                41.112(d)(1), where the conditions are met, the validity of an
                expired nonimmigrant visa &ldquo;may be considered to be
                automatically extended to the date of application for
                readmission&rdquo;. It also covers the case where DHS has changed
                your classification — the visa may be treated as extended{" "}
                <em>and converted</em> to the new classification, which is how
                someone who changed status from F-1 to H-1B inside the country
                can re-enter from Canada without ever having held an H-1B stamp.
              </p>
              <p>
                The practical effect: an H-1B holder whose stamp expired two
                years ago, who has been working continuously on valid extensions,
                can spend a long weekend in Toronto or Tijuana and come home on
                the expired stamp. No consulate, no appointment, no 221(g) risk.
                That is a genuinely valuable provision, and it is barely written
                about.
              </p>
            </div>
          </Container>
        </section>

        {/* ── The forfeiture trap ─────────────────────────────────────── */}
        <section
          id="forfeit"
          className="scroll-mt-20 border-t border-ink-900/5 bg-white py-10 sm:py-14"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                The condition almost everyone gets wrong
              </h2>
              <div className="mt-4 rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  22 CFR 41.112(d)(2)(vii), in full
                </p>
                <p className="mt-2 text-xl font-bold leading-snug text-ink-900">
                  &ldquo;Has not applied for a new visa while abroad.&rdquo;
                </p>
              </div>
              <p className="mt-4">
                That is the entire condition. Read it again, because the popular
                version of this rule is different and softer: you will commonly
                see it written as &ldquo;you lose automatic revalidation if you
                apply for a visa in Canada or Mexico <em>and are refused</em>
                &rdquo;. The regulation does not say that. It says{" "}
                <strong>applied</strong>. The outcome is irrelevant.
              </p>
              <p className="mt-3">
                CBP describes the same rule operationally: you cannot apply for a
                new visa and use automatic revalidation at the same time. Once
                you have applied, the provision is unavailable to you for that
                trip — approved, pending or refused.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    t: "Approved",
                    d: "You return on the new visa. Automatic revalidation is irrelevant — but only because you got lucky on timing.",
                    tone: "border-emerald-200 bg-emerald-50/50",
                  },
                  {
                    t: "Pending",
                    d: "You wait abroad. You cannot re-enter on the expired stamp, because you applied. Administrative processing has no guaranteed timeline.",
                    tone: "border-amber-200 bg-amber-50/50",
                  },
                  {
                    t: "Refused",
                    d: "You are stuck outside the United States with no fallback. This is the scenario that costs people their jobs.",
                    tone: "border-rose-200 bg-rose-50/50",
                  },
                ].map((c) => (
                  <div key={c.t} className={`rounded-2xl border p-4 ${c.tone}`}>
                    <p className="text-sm font-bold text-ink-900">{c.t}</p>
                    <p className="mt-1.5 text-sm">{c.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5">
                The decision this forces is a real one, and it should be made
                before you book. If your stamp is expired and you want to visit
                Canada, you can either <em>rely on automatic revalidation</em>{" "}
                and not apply for anything, or you can{" "}
                <em>apply for a new visa</em> and accept that you are committed
                to waiting for it. What you cannot do is treat the application as
                a free option with the expired stamp as a safety net. There is no
                net.
              </p>
              <p className="mt-3">
                Third-country stamping in Canada or Mexico carries its own,
                separate problem for Indian nationals: since September 2025 the
                Department of State has directed nonimmigrant applicants to apply
                in their country of nationality or usual residence, and warns
                that applying elsewhere makes it harder to qualify and that fees
                are not refundable or transferable. That policy and the
                interview-waiver rules are covered on{" "}
                <Link href="/visa-interview-waiver" className="text-brand-600 underline">
                  the visa interview waiver page
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* ── Checker ─────────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Eligibility checker
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                Every condition in the regulation, in the regulation&rsquo;s own
                order. The result names the exact subsection that fails, so you
                can check it yourself.
              </p>
              <div className="mt-5">
                <AvrEligibilityChecker />
              </div>
            </div>
          </Container>
        </section>

        {/* ── The conditions ──────────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                The seven conditions, with citations
              </h2>
              <p className="mt-2">
                All of them must hold at once. There is no balancing and no
                discretion — a single failure means the expired visa is simply an
                expired visa.
              </p>
              <ol className="mt-5 space-y-3">
                {avrConditions.map((c, i) => (
                  <li
                    key={c.id}
                    className={`rounded-2xl border p-4 ${
                      c.id === "no-application"
                        ? "border-rose-300 bg-rose-50/60"
                        : "border-ink-900/10 bg-white shadow-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink-900">
                          {c.label}
                        </p>
                        <p className="mt-0.5 font-mono text-[0.7rem] text-ink-500">
                          {c.cite}
                        </p>
                        <p className="mt-1.5 text-sm">{c.detail}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                <p className="text-sm font-bold text-ink-900">
                  Plus one exclusion that overrides all seven
                </p>
                <p className="mt-2 text-sm">{AVR_NATIONALITY_EXCLUSION.text}</p>
                <p className="mt-2 font-mono text-[0.7rem] text-ink-500">
                  {AVR_NATIONALITY_EXCLUSION.cite}
                </p>
                <a
                  href={AVR_NATIONALITY_EXCLUSION.listHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-brand-600 underline"
                >
                  Current State Sponsors of Terrorism list ↗
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* ── The mis-citation ────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                A citation correction worth knowing
              </h2>
              <p className="mt-2">{AVR_MISCITATION_NOTE.text}</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink-900/10 text-left">
                      <th className="py-2 pr-3 font-bold text-ink-900">
                        Your classification
                      </th>
                      <th className="py-2 pr-3 font-bold text-ink-900">
                        Governing authority
                      </th>
                      <th className="py-2 font-bold text-ink-900">
                        Adjacent islands?
                      </th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {[
                      ["H-1B, H-4", "22 CFR 41.112(d) only", "No — Canada and Mexico only"],
                      ["L-1, L-2", "22 CFR 41.112(d) only", "No — Canada and Mexico only"],
                      [
                        "F-1, F-2",
                        "22 CFR 41.112(d) + 8 CFR 214.1(b)(1)",
                        "Yes — but never Cuba; needs a current endorsed I-20",
                      ],
                      [
                        "J-1, J-2",
                        "22 CFR 41.112(d) + 8 CFR 214.1(b)(2)",
                        "Yes — but never Cuba; needs a current DS-2019",
                      ],
                      [
                        "M-1, M-2",
                        "22 CFR 41.112(d) + 8 CFR 214.1(b)(3)",
                        "No — contiguous territory only",
                      ],
                    ].map((r) => (
                      <tr key={r[0]} className="border-b border-ink-900/5">
                        <td className="py-2.5 pr-3 font-semibold text-ink-800">
                          {r[0]}
                        </td>
                        <td className="py-2.5 pr-3 font-mono text-[0.72rem]">
                          {r[1]}
                        </td>
                        <td className="py-2.5">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm">
                This is not pedantry. If you are an H-1B holder relying on a
                write-up that cites 8 CFR 214.1(b), that write-up is quoting a
                paragraph that does not apply to you — and it is also the
                paragraph that grants the adjacent-islands extension, which is
                why the &ldquo;Caribbean cruise is fine&rdquo; advice keeps
                circulating for categories it was never available to.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Practical ───────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-600">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Using it in practice
              </h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                  <p className="text-sm font-bold text-ink-900">
                    Carry the paperwork, and expect to explain it
                  </p>
                  <p className="mt-1.5 text-sm">
                    Passport with the expired stamp, unexpired I-94 printout,
                    current I-797, recent pay stubs, employer letter. Automatic
                    revalidation is used far less often than an ordinary
                    admission, and a calm, document-in-hand explanation is worth
                    more than an argument about the regulation.
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                  <p className="text-sm font-bold text-ink-900">
                    Airlines are a separate obstacle
                  </p>
                  <p className="mt-1.5 text-sm">
                    Carriers are penalised for boarding improperly documented
                    passengers, and check-in staff frequently do not know this
                    provision. Land crossings avoid the issue entirely, which is
                    one reason driving to Canada is the classic version of this
                    trip. If you fly, allow time and carry printed documents.
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                  <p className="text-sm font-bold text-ink-900">
                    A pending extension changes the picture
                  </p>
                  <p className="mt-1.5 text-sm">
                    Automatic revalidation requires you to be applying for
                    readmission within your authorized period of stay. If your
                    I-94 has expired and you are relying on a pending extension,
                    you are outside the condition at 22 CFR 41.112(d)(2)(iv), and
                    departing may also affect the pending application. Take
                    advice first —{" "}
                    <Link href="/h1b/extension" className="text-brand-600 underline">
                      the H-1B extension guide
                    </Link>{" "}
                    covers the filing side.
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                  <p className="text-sm font-bold text-ink-900">
                    It does not protect you from anything else
                  </p>
                  <p className="mt-1.5 text-sm">
                    You remain an applicant for admission and every ordinary
                    referral trigger still applies — a client-site placement, a
                    recent employer change, a thin payroll record. If any of
                    those describe you, read{" "}
                    <Link
                      href="/h1b-denied-entry-airport"
                      className="text-brand-600 underline"
                    >
                      what happens in secondary inspection
                    </Link>{" "}
                    before you go.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Sources ─────────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Sources</h2>
              <p className="mt-1 text-sm text-ink-500">
                Read {POE_VERIFIED}. Verify the current text before travelling.
              </p>
              <ul className="mt-4 space-y-3">
                {poeSources.slice(0, 3).concat(poeSources.slice(8)).map((s) => (
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

        <section className="py-10 sm:py-12">
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
