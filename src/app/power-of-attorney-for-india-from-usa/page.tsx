import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import TrackedSourceBox from "@/components/tools/TrackedSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import PoaRouteBuilder from "@/components/tools/PoaRouteBuilder";
import PoaDraftGenerator from "@/components/tools/PoaDraftGenerator";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  essentialsArticleJsonLd,
  essentialsSoftwareAppJsonLd,
} from "@/lib/nriEssentialsCluster";
import {
  POA_PUBLISHED,
  POA_UPDATED,
  POA_UPDATED_HUMAN,
  POA_DISCLAIMER,
  poaConfig,
  poaFastAnswer,
  poaTypes,
  consularRoute,
  apostilleRoute,
  indiaSteps,
  whenYouNeedPoa,
  whenYouDontNeedPoa,
  sellPropertyActs,
  registrationRules,
  essentialClauses,
  poaCostRows,
  stampDutyRule,
  bankingPoaLimits,
  poaRedFlags,
  revocationSteps,
  poaTimeline,
  poaKeywordClusters,
  poaFaqs,
  poaSourceLinks,
} from "@/data/nriPowerOfAttorneyData";

const PATH = "/power-of-attorney-for-india-from-usa";
const TITLE =
  "Power of Attorney for India From USA: Sell Property, Notary & Apostille";
const DESC =
  "How to make a power of attorney for India from USA: the notary vs apostille vs consulate routes, a power of attorney to sell property in India, whether it must be registered, stamp duty, validity, revocation and specimen formats.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: PATH,
  type: "article",
  openGraph: { publishedTime: POA_PUBLISHED, modifiedTime: POA_UPDATED },
});

const inline = "font-semibold text-brand-600 underline underline-offset-2";

/* ── Long-form sections ──────────────────────────────────────────────────
 * Kept as data so the prose stays scannable and the JSX stays flat.        */

interface Block {
  h3?: string;
  paras: React.ReactNode[];
}
interface Section {
  id: string;
  h2: string;
  blocks: Block[];
}

const SECTIONS_TOP: Section[] = [
  {
    id: "what-it-is",
    h2: "What a Power of Attorney Actually Does — and the One Thing It Never Does",
    blocks: [
      {
        paras: [
          <>
            A power of attorney is an authority to <em>act</em>. It lets a person you name — your
            attorney, or attorney-in-fact — sign documents, appear at counters and perform specific
            acts in your name, because you are 8,000 miles away and the Sub-Registrar&apos;s office
            requires a body in a chair. That is the whole of it. Under the{" "}
            {poaConfig.sections.poaAct}, the instrument confers authority; it does not confer
            ownership, and it does not move anything from your name into anyone else&apos;s.
          </>,
          <>
            The thing it never does is transfer title. In{" "}
            <strong>{poaConfig.surajLamp.name}</strong>, decided {poaConfig.surajLamp.decided}, the
            Supreme Court held that SA/GPA/WILL transactions do not convey title and are not a valid
            mode of transfer of immovable property. Immovable property passes only under a{" "}
            <em>registered conveyance</em> — {poaConfig.sections.transferOfProperty} read with{" "}
            {poaConfig.sections.registrationCompulsory}. This matters to NRIs specifically, because
            the &quot;GPA sale&quot; is still quietly offered in several Indian markets as a cheaper,
            faster way to buy: no registration, no stamp duty, just a general power of attorney and a
            handshake. The discount on offer is the litigation risk, priced in.
          </>,
          <>
            Hold both ideas at once and the rest of this page follows logically. The POA is the
            mechanism that lets a sale, purchase or registration <em>happen</em> without you flying
            back. The registered deed is what actually changes ownership. Confusing the two is the
            single most expensive mistake in NRI property — and if the plan is to sell, the POA is
            only half the problem: read{" "}
            <Link href="/nri-selling-property-in-india-tds" className={inline}>
              how TDS on an NRI property sale is withheld on the full sale price
            </Link>{" "}
            before you agree a timeline with a buyer.
          </>,
        ],
      },
    ],
  },
  {
    id: "execute-from-usa",
    h2: "How to Make a Power of Attorney for India From USA: the Route That Decides Everything",
    blocks: [
      {
        paras: [
          <>
            Indian law does not require you to be in India to grant a valid power of attorney. What
            it requires is that the deed be <strong>authenticated</strong> by an authority it
            recognises. {poaConfig.sections.registrationAuth} is the provision that matters: where
            the principal does not reside in India, a power of attorney executed before and
            authenticated by a <strong>Notary Public</strong>, or any Court, Judge, Magistrate,{" "}
            <strong>Indian Consul or Vice-Consul</strong>, or representative of the Central
            Government, is recognised for the purposes of {poaConfig.sections.registrationPresent} —
            which is the section that lets your attorney present a document for registration at all.
          </>,
          <>
            Read that list again, because the two names in it are the two routes open to you from the
            USA, and they sit side by side in the statute as equals. Route A takes the deed to the
            Indian Consulate for attestation. Route B notarises it before a US Notary Public and then
            has that notary&apos;s authority certified by an apostille from your state&apos;s
            Secretary of State. India has been a party to the Hague Apostille Convention since{" "}
            <strong>{poaConfig.apostilleInForce}</strong>, so an apostille from a member state is, by
            treaty, the complete authentication — no consular stamp is legally required on top of it.
            Our{" "}
            <Link href="/oci/apostille" className={inline}>
              apostille and attestation checker
            </Link>{" "}
            walks through which US authority certifies which document.
          </>,
          <>
            Where families go wrong is choosing the route by convenience rather than by destination.
            Statute and practice are not the same thing. Some Sub-Registrars, particularly outside the
            metros, still ask for a consular attestation out of long habit, and an office that wants a
            consular stamp will not be argued out of it by a citation. Before you choose,{" "}
            <strong>
              ask the advocate handling the matter in the property&apos;s own state which route that
              specific office actually accepts
            </strong>
            . One email saves a repeat of the entire six-week cycle.
          </>,
        ],
      },
      {
        h3: "Draft in India, sign in the USA — in that order",
        paras: [
          <>
            Whichever route you take, the drafting belongs in India. The acceptable operative wording,
            the format of the schedule of property, the stamp article the deed will be charged under
            and even where your photograph goes are matters of <em>state</em> law and local registry
            practice. A template pulled from a US website has none of that, and it is the most common
            reason a POA is rejected at the counter — after the consular fee is paid and the courier
            has already crossed an ocean. Get the draft as an editable file, print it on plain paper
            in the USA, and leave the signature blocks blank until you are standing in front of the
            notary or the consular officer.
          </>,
        ],
      },
    ],
  },
];

const SECTIONS_MIDDLE: Section[] = [
  {
    id: "stamp-register",
    h2: "A Power of Attorney Executed Outside India: Three Months to Stamp It, and the Clock Starts on Arrival",
    blocks: [
      {
        paras: [
          <>
            This is the rule that catches more NRIs than any other on this page, and it has nothing to
            do with the consulate. {poaConfig.sections.stampOutsideIndia} provides that an instrument
            chargeable with duty and executed <em>only out of India</em> — which is exactly what your
            deed is — may be stamped within <strong>{poaConfig.stampWindowMonths} months after it has
            been first received in India</strong>. The clock starts when the courier lands, not when
            you signed in Fremont or Edison.
          </>,
          <>
            Miss it and the instrument is not automatically void, but it becomes an unstamped
            instrument: liable to be impounded and charged penalty duty, and unusable in the meantime
            for the very transaction you executed it for. Indian High Courts have applied exactly that
            outcome to a power of attorney executed abroad. The failure pattern is depressingly
            ordinary — the deed arrives, a relative puts it safely in a drawer &quot;until the buyer
            is ready&quot;, and eleven months later it surfaces as a problem rather than a solution.
            Tell whoever receives it in India that the date of arrival starts a clock.
          </>,
          <>
            Where the correct duty is not obvious — a POA to someone outside your immediate family, or
            one carrying consideration or development rights — take it to the Collector of Stamps for
            adjudication under {poaConfig.sections.stampAdjudication} and pay what is determined.
            Adjudication is cheap insurance. Guessing the article and under-paying is how a modest fee
            becomes a penalty assessment years later, usually at the worst possible moment: when a
            buyer&apos;s counsel is reading your chain of title.
          </>,
        ],
      },
      {
        h3: "And then registration, which is not optional for a property POA",
        paras: [
          <>
            {poaConfig.sections.registrationCompulsory}, together with amendments adopted in states
            including Maharashtra, Tamil Nadu and Odisha, makes a power of attorney that authorises
            the sale or transfer of immovable property <strong>compulsorily registrable</strong>.
            Treat registration as the default for any property POA rather than the exception, and
            budget for it from the start. Registration is also the practical gate:{" "}
            {poaConfig.sections.registrationPresent} is what allows your attorney to present the sale
            deed and admit execution, and a Sub-Registrar will check the POA&apos;s own registration
            before accepting the attorney&apos;s signature on anything.
          </>,
          <>
            A POA that never touches immovable property — operating a bank account, running a case,
            collecting rent with an express bar on transfer — is usually not compulsorily registrable.
            It still has to be properly stamped, and your bank or the court will apply its own
            acceptance rules on top. When in doubt, register: the fee is small next to the cost of a
            transaction stalling at the counter. Where this sits in the wider decision — whether to
            sell at all, what the gain looks like, how the money comes home — is mapped in the{" "}
            <Link href="/india-property" className={inline}>
              India property planning hub
            </Link>
            .
          </>,
        ],
      },
    ],
  },
  {
    id: "banking-poa",
    h2: "Banking POA: What FEMA Lets Your Attorney Do With Your NRE/NRO Account",
    blocks: [
      {
        paras: [
          <>
            A banking power of attorney is the one place where your drafting is not the binding
            constraint. However broadly you word it, RBI&apos;s rules for non-resident deposits cap
            what a <em>resident</em> attorney may do with your money — and the caps are narrower than
            most families assume when they hand a parent signing authority &quot;just in case&quot;.
            The table below is the actual boundary. Note in particular that no amount of drafting lets
            your attorney wire funds abroad to anyone other than you, or make a gift to a resident on
            your behalf.
          </>,
          <>
            One practical point that surprises people: your deed is rarely enough on its own. Banks in
            India almost always insist on their own POA form or account mandate, executed and attested
            to <em>their</em> specification, in addition to the general deed you had drafted. Ask your
            branch for the form before you execute anything, so both can be attested in the same trip
            to the consulate rather than two trips a month apart. For moving the money itself once it
            is in your NRO account, see{" "}
            <Link href="/send-money-to-india" className={inline}>
              the cross-border transfer hub
            </Link>{" "}
            and{" "}
            <Link href="/articles/repatriate-india-property-sale-usa" className={inline}>
              repatriating India property sale proceeds
            </Link>
            .
          </>,
        ],
      },
    ],
  },
];

const renderSection = (s: Section) => (
  <section key={s.id} id={s.id} className="scroll-mt-24">
    <h2 className="text-xl font-bold text-ink-900">{s.h2}</h2>
    {s.blocks.map((b, bi) => (
      <div key={bi} className="mt-3 space-y-3">
        {b.h3 && <h3 className="pt-1 text-base font-bold text-ink-900">{b.h3}</h3>}
        {b.paras.map((p, pi) => (
          <p key={pi} className="text-sm leading-relaxed text-ink-600">
            {p}
          </p>
        ))}
      </div>
    ))}
  </section>
);

const routeList = (steps: typeof consularRoute, tone: "brand" | "emerald") => (
  <ol className="mt-4 space-y-3">
    {steps.map((s, i) => (
      <li key={s.step} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
        <span
          aria-hidden
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            tone === "brand" ? "bg-brand-100 text-brand-700" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {i + 1}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink-900">{s.step}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.detail}</p>
          {s.watchOut && (
            <p className="mt-1.5 text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">Watch out:</span> {s.watchOut}
            </p>
          )}
        </div>
      </li>
    ))}
  </ol>
);

export default function PowerOfAttorneyForNriIndiaPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: "India Property", url: absoluteUrl("/india-property") },
      { name: "Power of Attorney for NRIs", url: absoluteUrl(PATH) },
    ]),
    essentialsArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: POA_PUBLISHED,
      dateModified: POA_UPDATED,
    }),
    essentialsSoftwareAppJsonLd({
      path: PATH,
      name: "NRI Power of Attorney Route Builder",
      description:
        "Free tool that tells an NRI in the USA which power of attorney to grant, whether to use consular attestation or an apostille, whether it must be registered in India, the stamp-duty exposure, and the document checklist.",
      applicationCategory: "BusinessApplication",
    }),
    faqJsonLd(poaFaqs),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="power-of-attorney-for-india-from-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Property", href: "/india-property" },
          { label: "Power of Attorney" },
        ]}
        icon="✍️"
        category="NRI Property & Legal"
        title="Power of Attorney for India From USA"
        hook="You can sell, buy or register property in India without flying back — but only if the deed is authenticated the way Indian law requires, stamped within three months of landing in India, and registered where the state demands it. Here is the whole chain, in order."
        accent="from-amber-600 to-orange-700"
        badges={[
          "Verified " + POA_UPDATED_HUMAN,
          "Notary vs apostille vs consulate",
          "Specimen formats included",
          "No signup",
        ]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#poa-builder"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-700"
            >
              Find your route →
            </a>
            <a
              href="#formats"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-50"
            >
              See specimen formats
            </a>
          </div>
        }
        topDisclaimer={<>Educational information only. Not legal, tax or investment advice.</>}
        sourceNote={
          <>
            Written / reviewed by Deepak Middha, CA · Last verified {POA_UPDATED_HUMAN} against the
            Registration Act, 1908, the Indian Stamp Act, 1899, RBI&apos;s non-resident deposit rules
            and Indian Mission checklists — all linked at the end of this page.
          </>
        }
        disclaimerPoints={[
          "Stamp duty, registration requirements and Sub-Registrar practice are STATE law and vary across India.",
          "Consular documents, fees and checklists are jurisdiction-specific and change without notice.",
          "The specimen wording here is a discussion draft, not a deed — never sign it as-is.",
          "Engage an advocate in the Indian state where the property is situated before executing anything.",
        ]}
        disclaimerExtra={<p>{POA_DISCLAIMER}</p>}
      >
        {/* The tool, first */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <PoaRouteBuilder />
            </div>
          </Container>
        </section>

        {/* Fast answer */}
        <section className="py-10 sm:py-12">
          <Container>
            <FastAnswerSnapshot
              title="Power of attorney for India from USA — the six things that decide everything"
              rows={poaFastAnswer}
              lastVerified={POA_UPDATED_HUMAN}
              badges={["Registration Act, 1908", "Indian Stamp Act, 1899", "Hague Apostille Convention"]}
              disclaimer={POA_DISCLAIMER}
              accent="amber"
              ctaText="Build your route and checklist"
              ctaHref="#poa-builder"
            />
          </Container>
        </section>

        {/* Opening long-form */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">{SECTIONS_TOP.map(renderSection)}</div>
          </Container>
        </section>

        {/* When you need one — and when you don't */}
        <section id="when" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                When You Actually Need a Power of Attorney for India — and When It Is a Liability
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                A POA is a real transfer of capability to another person. Grant one where the counter
                genuinely requires a physical signature, and not simply because it feels convenient.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <p className="text-sm font-bold text-ink-900">Grant one when…</p>
                  <ul className="mt-2.5 space-y-2">
                    {whenYouNeedPoa.map((w) => (
                      <li key={w} className="flex gap-2 text-xs leading-relaxed text-ink-700">
                        <span aria-hidden className="mt-0.5 shrink-0 text-emerald-600">
                          ✓
                        </span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4">
                  <p className="text-sm font-bold text-ink-900">Don&apos;t bother when…</p>
                  <ul className="mt-2.5 space-y-2">
                    {whenYouDontNeedPoa.map((w) => (
                      <li key={w} className="flex gap-2 text-xs leading-relaxed text-ink-700">
                        <span aria-hidden className="mt-0.5 shrink-0 text-rose-500">
                          ✕
                        </span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Sell property — the 50/mo head term */}
        <section id="sell-property" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Power of Attorney to Sell Property in India: the Seven Acts It Must Authorise
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Can a power of attorney sell property in India? Yes — a properly executed, stamped and
                registered special POA lets your attorney complete the sale without you. But the deed
                is accepted or rejected at the counter on one thing: whether it <em>enumerates</em>{" "}
                the acts below. Indian registries read these instruments strictly and literally, so a
                power not written is a power not granted.
              </p>
              <ol className="mt-4 space-y-2.5">
                {sellPropertyActs.map((a, i) => (
                  <li key={a.act} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink-900">{a.act}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{a.why}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <p className="text-xs leading-relaxed text-ink-700">
                  <span className="font-bold text-ink-900">Selling from the USA?</span> The POA is one
                  of three things that have to line up. The other two are the withholding — see{" "}
                  <Link href="/nri-selling-property-in-india-tds" className={inline}>
                    TDS when an NRI sells property in India
                  </Link>{" "}
                  — and getting the money out, covered in{" "}
                  <Link href="/articles/repatriate-india-property-sale-usa" className={inline}>
                    repatriating India property sale proceeds
                  </Link>
                  . Sequence them together or the sale stalls on whichever one you left until last.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Types */}
        <section id="types" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                General Power of Attorney for Property in India vs a Special POA: What to Actually Grant
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The instinct is to grant one broad POA covering everything, so you never have to do
                this again. Resist it. One narrow deed per purpose is cheaper to stamp, faster to
                register, easier to revoke, and far harder to misuse.
              </p>
              <div className="mt-4 space-y-3">
                {poaTypes.map((t) => (
                  <div
                    key={t.id}
                    className={`rounded-2xl border p-4 shadow-card ${
                      t.verdict === "recommended"
                        ? "border-emerald-200 bg-emerald-50/30"
                        : t.verdict === "avoid"
                          ? "border-rose-200 bg-rose-50/30"
                          : "border-ink-900/10 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-ink-900">{t.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${
                          t.verdict === "recommended"
                            ? "bg-emerald-100 text-emerald-700"
                            : t.verdict === "avoid"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-ink-100 text-ink-600"
                        }`}
                      >
                        {t.verdict === "recommended"
                          ? "Recommended"
                          : t.verdict === "avoid"
                            ? "Avoid"
                            : "Situational"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{t.scope}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                      <span className="font-semibold text-ink-600">Best for:</span> {t.bestFor}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      <span className="font-semibold text-ink-600">Risk:</span> {t.risk}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Route A + Route B */}
        <section id="notary-apostille" className="scroll-mt-24 pb-10 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Route A: Attestation at the Indian Consulate in the USA, Step by Step
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The route most Sub-Registrars are comfortable with, and the one to pick if the office
                handling your property has ever asked for a consular stamp. Indian consular services
                in the USA are submitted through the Mission&apos;s outsourced service partner, in
                person or by mail.
              </p>
              {routeList(consularRoute, "brand")}

              <h2 className="mt-10 text-xl font-bold text-ink-900">
                Route B: US Notary Public + Secretary of State Apostille
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Fully by mail, usually faster, and legally complete on its own since India joined the
                Hague Apostille Convention in {poaConfig.apostilleInForce}. It is also the only route
                open to a US passport holder without an OCI card, whose deed generally has to be
                apostilled before a Mission will process it at all.
              </p>
              {routeList(apostilleRoute, "emerald")}

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <p className="text-sm font-bold text-ink-900">Which route should you pick?</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-700">
                  Let the destination decide, not your calendar. Ask the advocate in the
                  property&apos;s state what that Sub-Registrar accepts, then work backwards. If the
                  office is relaxed about it, the apostille route is faster and needs no appointment.
                  If it has ever bounced an apostilled deed, take the consular route and lose the
                  argument cheaply. Doing <em>both</em> — apostille and then consular attestation — is
                  legally unnecessary but is what some families choose when the property is high-value
                  and the office is unpredictable.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Stamp / register + banking long-form */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">
              {renderSection(SECTIONS_MIDDLE[0])}
            </div>
          </Container>
        </section>

        {/* What happens in India */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                After It Lands in India: Stamp, Adjudicate, Register, Act
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Four steps, in this order. Doing them out of order is what stalls transactions at the
                counter.
              </p>
              {routeList(indiaSteps, "brand")}
            </div>
          </Container>
        </section>

        {/* Registration — does a POA need to be registered in India? */}
        <section id="registration" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Does a Power of Attorney Need to Be Registered in India?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The honest answer is &quot;it depends on what the POA does&quot; — and the dividing
                line is whether the instrument touches an interest in immovable property. Find your
                situation below. When you are between two rows, register: the fee is small next to the
                cost of a transaction stopping at the counter.
              </p>
              <div className="mt-4 space-y-3">
                {registrationRules.map((r) => (
                  <div key={r.situation} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.situation}</p>
                    <p className="mt-1 text-xs font-semibold text-brand-700">{r.answer}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{r.basis}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">
                Registration requirements are state law and registry practice varies even between
                districts. Confirm with the advocate handling the matter in the property&apos;s own
                state before you execute.
              </p>
            </div>
          </Container>
        </section>

        {/* Stamp duty rule */}
        <section id="stamp-duty" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Stamp Duty on a Power of Attorney in India: the Close-Relative Rule
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Stamp duty is state law, so no single figure is true across India — but the{" "}
                <strong>principle</strong> is consistent enough to plan around, and it is the largest
                cost variable in the entire exercise. States distinguish between a POA that is really
                just an authority and a POA that is really a transfer wearing a disguise, and they
                stamp the second one like the transaction it actually is.
              </p>
              <div className="mt-4 space-y-3">
                {stampDutyRule.map((r) => (
                  <div key={r.scenario} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.scenario}</p>
                    <p className="mt-1 text-xs font-semibold text-amber-700">{r.treatment}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{r.why}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">
                Directional only. Confirm the article and rate under your own state&apos;s stamp act
                before executing — and where the correct duty is genuinely unclear, have the deed
                adjudicated by the Collector of Stamps rather than guessing.
              </p>
            </div>
          </Container>
        </section>

        {/* Costs */}
        <section id="cost" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                What a Power of Attorney for India Costs, Line by Line
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The US-side costs are small and predictable. The India-side costs are the ones worth
                planning, and stamp duty is the line that can move by orders of magnitude depending on
                who you appoint.
              </p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {poaCostRows.map((r) => (
                  <div key={r.item} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.item}</p>
                    <p className="mt-1 text-xs font-semibold text-amber-700">{r.typical}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{r.note}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Cost</th>
                      <th className="p-3 font-semibold">Typical (directional)</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {poaCostRows.map((r) => (
                      <tr key={r.item} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.item}</td>
                        <td className="p-3 font-medium text-amber-700">{r.typical}</td>
                        <td className="p-3 text-ink-600">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                Directional figures verified {POA_UPDATED_HUMAN}. Consular fees are set per Mission
                and revised without notice; a deed with two executants is generally charged twice.
                Verify against your own consulate before paying.
              </p>
            </div>
          </Container>
        </section>

        {/* Banking / FEMA */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              {renderSection(SECTIONS_MIDDLE[1])}
              <div className="space-y-2.5">
                {bankingPoaLimits.map((b) => (
                  <div
                    key={b.rule}
                    className={`rounded-2xl border p-4 ${
                      b.allowed ? "border-emerald-200 bg-emerald-50/40" : "border-rose-200 bg-rose-50/40"
                    }`}
                  >
                    <p className="flex items-start gap-2 text-sm font-bold text-ink-900">
                      <span aria-hidden className={b.allowed ? "text-emerald-600" : "text-rose-500"}>
                        {b.allowed ? "✓" : "✕"}
                      </span>
                      <span>{b.rule}</span>
                    </p>
                    <p className="mt-1.5 pl-6 text-xs leading-relaxed text-ink-600">{b.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Essential clauses */}
        <section id="clauses" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Ten Clauses Your Power of Attorney for Property in India Must Contain
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                A power not written is a power not granted — Indian registries and buyers&apos;
                counsel read these deeds strictly and literally. Take this list to your advocate and
                check the draft against it line by line before you sign.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {essentialClauses.map((c, i) => (
                  <div key={c.clause} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="flex gap-2 text-sm font-bold text-ink-900">
                      <span aria-hidden className="text-ink-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{c.clause}</span>
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{c.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Specimen formats */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <PoaDraftGenerator />
            </div>
          </Container>
        </section>

        {/* Red flags */}
        <section id="red-flags" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Seven Ways a Power of Attorney for Indian Property Goes Wrong
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Each of these is common enough to have its own body of litigation. None of them is
                hard to avoid at the drafting stage; all of them are expensive to fix afterwards.
              </p>
              <div className="mt-4 space-y-3">
                {poaRedFlags.map((r) => (
                  <div key={r.flag} className="rounded-2xl border border-rose-200 bg-rose-50/30 p-4">
                    <p className="flex gap-2 text-sm font-bold text-ink-900">
                      <span aria-hidden className="shrink-0 text-rose-500">
                        ⚠
                      </span>
                      <span>{r.flag}</span>
                    </p>
                    <p className="mt-1.5 pl-6 text-xs leading-relaxed text-ink-600">{r.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Validity — 20/mo exact term */}
        <section id="validity" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Validity of a Power of Attorney in India: How Long Does It Actually Last?
              </h2>
              <div className="mt-3 space-y-3">
                <p className="text-sm leading-relaxed text-ink-600">
                  There is no fixed statutory life. A power of attorney in India runs until the
                  earliest of four things happens: the expiry date written into the deed, the
                  completion of the purpose it was granted for, your revocation of it, or termination
                  by operation of law. That last one is the part families miss — under{" "}
                  {poaConfig.sections.agencyTermination} an agency ends on the principal&apos;s death,
                  unsoundness of mind or insolvency, unless the agency is coupled with an interest.
                </p>
                <p className="text-sm leading-relaxed text-ink-600">
                  Which is why an expiry date belongs in every deed you sign. Left open, a POA stays
                  capable of being acted on indefinitely — and the practical burden of proving it was
                  no longer in force falls on you, years later, usually while a buyer&apos;s counsel is
                  reading your chain of title. Six to twelve months, renewable by a fresh deed, matches
                  how long an Indian property transaction genuinely takes.
                </p>
                <p className="text-sm leading-relaxed text-ink-600">
                  A separate and frequently confused point: <strong>a POA is not an estate-planning
                  document</strong>. It dies with you. It cannot pass property to your heirs, it does
                  not survive to help your family settle your affairs, and it is no substitute for a
                  will or for coordinated{" "}
                  <Link href="/nri-estate-planning" className={inline}>
                    cross-border estate planning
                  </Link>
                  . Families who grant a parent a broad POA &quot;so everything is taken care of&quot;
                  discover at the worst moment that it stopped working the day it was needed most.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Revocation */}
        <section id="revoke" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                How to Revoke a Power of Attorney in India From the USA
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Revocation is not a phone call. Under {poaConfig.sections.agencyTermination} an agency
                ends on revocation, and also by operation of law on the principal&apos;s death,
                unsoundness of mind or insolvency — but acts done by your attorney{" "}
                <em>before notice reaches them</em> can still bind you. That is why the notice steps
                below matter as much as the deed itself.
              </p>
              {routeList(revocationSteps, "emerald")}
            </div>
          </Container>
        </section>

        {/* Timeline */}
        <section id="timeline" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                The Realistic Timeline: Three to Five Weeks, Plus the India Steps
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Sequence matters more than speed. Build this into the deal calendar rather than around
                it — a buyer waiting on your POA is a buyer looking at other flats.
              </p>
              <ol className="mt-4 space-y-3">
                {poaTimeline.map((t, i) => (
                  <li key={t.phase} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink-900">{t.phase}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* Keyword clusters — real navigation, anchored to the answering section */}
        <section id="what-people-search" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                What People Search For About Powers of Attorney for India — and Where This Page Answers It
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Grouped by the decision behind the question. Every line below is answered somewhere on
                this page — follow the heading link to jump straight to it.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {poaKeywordClusters.map((k) => (
                  <div key={k.theme} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <a href={k.anchor} className={`text-sm ${inline}`}>
                      {k.theme} →
                    </a>
                    <ul className="mt-2 space-y-1.5">
                      {k.queries.map((q) => (
                        <li key={q} className="text-xs leading-relaxed text-ink-600">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16">
          <Container>
            <ToolFaq items={poaFaqs} />
          </Container>
        </section>

        {/* Related pages */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Next steps in the India property chain"
              links={[
                {
                  href: "/nri-selling-property-in-india-tds",
                  label: "NRI Selling Property in India: TDS & Capital Gains",
                  desc: "Plan the withholding before you sign — the POA is only half the problem",
                },
                {
                  href: "/india-property",
                  label: "India Property Planning Hub",
                  desc: "Sell vs hold, inheritance, capital gains and repatriation in one place",
                },
                {
                  href: "/articles/repatriate-india-property-sale-usa",
                  label: "Repatriating India Property Sale Proceeds",
                  desc: "Getting the money to the USA: NRO, Form 15CA/15CB and the USD 1m facility",
                },
                {
                  href: "/articles/inheriting-indian-assets-us-tax",
                  label: "Inheriting Indian Assets: US Tax",
                  desc: "Inherited property, succession formalities and what the IRS wants to see",
                },
                {
                  href: "/nri-estate-planning",
                  label: "NRI Estate Planning",
                  desc: "A POA dies with you — wills, nominations and cross-border coordination do not",
                },
                {
                  href: "/oci/apostille",
                  label: "Apostille & Attestation Checker",
                  desc: "Whether your document needs an apostille, and which state issues it",
                },
                {
                  href: "/calculators/india-property-capital-gains",
                  label: "India Property Capital Gains Calculator",
                  desc: "Estimate the gain and the Indian tax on it before you sell",
                },
                {
                  href: "/india-tax-compliance",
                  label: "India Tax & Compliance Hub",
                  desc: "PAN, ITR, TDS refunds and the NRI compliance calendar",
                },
              ]}
            />
          </Container>
        </section>

        {/* Official sources — external links live here, at the end */}
        <section className="py-10 sm:py-12">
          <Container>
            <TrackedSourceBox
              title="Official legal sources"
              intro="Statutes, treaty records and consular pages behind every rule on this page. Verify current requirements and fees directly — they change without notice:"
              links={poaSourceLinks}
              eventName="poa_source_clicked"
              toolSlug="power-of-attorney-for-india-from-usa"
            />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={POA_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
