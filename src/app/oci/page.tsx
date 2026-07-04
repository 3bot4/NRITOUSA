import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";
import ToolFaq from "@/components/tools/ToolFaq";
import { getTool } from "@/lib/tools";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  OCI_BASE,
  OCI_TOOLS,
  OCI_DATA_AS_OF,
  VERIFY_SOURCES,
  totalWeeksLabel,
  freshOciAllInLabel,
  ociSnapshotRows,
  OCI_SNAPSHOT_SOURCES,
  OCI_SNAPSHOT_DISCLAIMER,
} from "@/lib/oci/config";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import { ociGuides, ociGuidePath } from "@/lib/ociGuides";

const TITLE = "OCI Card USA Guide (2026)";
const SUBTITLE =
  "Everything you need to apply, renew, transfer and manage your OCI card.";

export const metadata: Metadata = pageMetadata({
  title: `OCI Card USA 2026: Fee $275, ${totalWeeksLabel()} Processing, Eligibility & Renewal`,
  description: `OCI card in the USA: fresh registration costs $275 government fee (all-in ${freshOciAllInLabel()}) and takes about ${totalWeeksLabel()}. Free eligibility, cost & timeline calculators, document checklist, apostille & state guides, and FAQs.`,
  path: OCI_BASE,
});

/** Live, built tools (link out). */
const liveTools = [
  getTool("oci-eligibility-checker")!,
  getTool("oci-cost-calculator")!,
  getTool("oci-timeline-calculator")!,
];

/** Tools on the roadmap — shown but not linked (avoid 404s) until built. */
const upcomingTools = [
  {
    icon: "📋",
    label: OCI_TOOLS.checklist.label,
    desc: "Generate a printable, situation-specific document checklist with a progress tracker and PDF download.",
  },
  {
    icon: "📸",
    label: OCI_TOOLS.photo.label,
    desc: "Check your OCI photo against the dimensions, background, face-size, and file-size rules before you upload.",
  },
];

const faq: FaqItem[] = [
  {
    question: "What is an OCI card?",
    answer:
      "Overseas Citizenship of India (OCI) is a lifelong visa and status for foreign nationals of Indian origin. It lets you live and work in India indefinitely, enter without a separate visa, and enjoy most rights of residents — though it is not dual citizenship and does not grant voting rights, government jobs, or the purchase of agricultural land.",
  },
  {
    question: "Who can apply for OCI from the USA?",
    answer:
      "Foreign nationals (for example US citizens) who were Indian citizens, or whose parent, grandparent, or great-grandparent was an Indian citizen, plus the long-term foreign spouses of Indian citizens / OCI holders. Use the OCI Eligibility Checker to confirm your path in about a minute.",
  },
  {
    question: "How long does OCI take and what does it cost in the USA?",
    answer: `Typical end-to-end processing runs about ${totalWeeksLabel()}, because OCI needs a two-stage clearance — the consulate plus the Ministry of Home Affairs in India. Costs are the government service fee plus VFS service charge, ICWF, and optional courier/SMS/lounge add-ons. The Cost and Timeline calculators give you exact, up-to-date estimates.`,
  },
  {
    question: "Does OCI require apostille of my documents?",
    answer:
      "US-issued civil documents — birth certificates, marriage certificates, name-change orders — generally need to be apostilled by the relevant US Secretary of State before they're accepted. A dedicated Apostille Center with state-by-state guides is on the way; until then, confirm requirements with your consulate and VFS.",
  },
  {
    question: "Is this an official government site?",
    answer:
      "No. NRItoUSA is an independent, free educational resource. Always complete and pay for your application on the official VFS Global and Government of India OCI portals, which are linked throughout this center.",
  },
];

const mistakes = [
  {
    title: "Wrong photo format",
    body: "OCI photos are square (2x2in) with a white background and a large, centred face. US passport-style photos are often rejected — check before you upload.",
  },
  {
    title: "Mismatched name across documents",
    body: "Your name must match across passport, birth certificate, and parents' documents. A maiden-vs-married mismatch without a marriage certificate stalls applications.",
  },
  {
    title: "Skipping apostille",
    body: "US civil documents usually need a Secretary of State apostille. Submitting plain notarised copies is one of the most common rejections.",
  },
  {
    title: "Applying as a current Indian citizen",
    body: "You must hold a foreign passport first. OCI replaces Indian citizenship — you can't hold both at once.",
  },
  {
    title: "Forgetting the re-issue at 20 / 50",
    body: "OCI must be re-issued when a minor turns 20, and once after age 50, and whenever a new passport is issued for minors. Missing it can cause boarding issues.",
  },
  {
    title: "Booking travel against an estimate",
    body: "MHA clearance is variable. Never book non-refundable India travel assuming a fixed OCI delivery date — start months ahead.",
  },
];

export default function OciHubPage() {
  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(OCI_BASE)}#collection`,
      name: TITLE,
      description: SUBTITLE,
      url: absoluteUrl(OCI_BASE),
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: liveTools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(`/tools/${t.slug}`),
          name: t.title,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "OCI Center", url: OCI_BASE },
    ]),
    faqJsonLd(faq)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-ink-900/5 bg-gradient-to-b from-amber-50/60 to-white">
        <Container className="py-10 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-400"
          >
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink-500">OCI Center</span>
          </nav>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span aria-hidden>🪪</span> Free OCI resource center
          </div>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
            {TITLE}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-600">{SUBTITLE}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href={OCI_TOOLS.eligibility.path}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Check your eligibility →
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-900/10 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
            >
              Browse OCI tools
            </a>
          </div>
        </Container>
      </header>

      {/* Fast Answer: OCI fee & time */}
      <section className="border-b border-ink-900/5 bg-ink-50/40 py-6">
        <Container>
          <FastAnswerSnapshot
            title="OCI card — fee & processing time"
            answerLabel="Fresh OCI (USA)"
            answer={`$275 · ${totalWeeksLabel()}`}
            accent="amber"
            rows={ociSnapshotRows()}
            badges={["Govt fee $275", `Processing ${totalWeeksLabel()}`]}
            lastVerified={OCI_DATA_AS_OF}
            sources={OCI_SNAPSHOT_SOURCES}
            disclaimer={OCI_SNAPSHOT_DISCLAIMER}
            ctaText="Calculate my exact OCI cost"
            ctaHref={OCI_TOOLS.cost.path}
          />
        </Container>
      </section>

      {/* Featured tools */}
      <section id="tools" className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Featured tools"
            title="Interactive OCI tools"
            description="Free, private, and instant — every tool runs in your browser. No signup, no personal data leaves the page."
            action={{ label: "All tools", href: "/tools" }}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveTools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span
                  aria-hidden
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${t.accent} text-xl shadow-sm`}
                >
                  {t.icon}
                </span>
                <h3 className="mt-3 text-base font-bold tracking-tight text-ink-900 group-hover:text-brand-600">
                  {t.label}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
                  {t.description}
                </p>
                <span className="mt-3 text-sm font-semibold text-brand-600">
                  Open tool{" "}
                  <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
            {upcomingTools.map((t) => (
              <div
                key={t.label}
                className="flex flex-col rounded-2xl border border-dashed border-ink-900/15 bg-slate-50/60 p-5"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm"
                  >
                    {t.icon}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-amber-700">
                    Coming soon
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold tracking-tight text-ink-700">
                  {t.label}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Beginner guide + new requirements */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">
                New to OCI? Start here
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                OCI (Overseas Citizenship of India) is a lifelong visa and status
                for foreign nationals of Indian origin — most useful for US
                citizens who were born in India or have Indian parents or
                grandparents. It lets you enter and live in India without a
                separate visa. It is <strong>not</strong> dual citizenship: no
                voting, government jobs, or agricultural land.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink-600">
                {[
                  ["Step 1 — Confirm you qualify", OCI_TOOLS.eligibility.path],
                  ["Step 2 — Estimate your cost", OCI_TOOLS.cost.path],
                  ["Step 3 — Plan your timeline", OCI_TOOLS.timeline.path],
                ].map(([label, href]) => (
                  <li key={href} className="flex gap-2">
                    <span aria-hidden className="text-brand-500">
                      →
                    </span>
                    <Link
                      href={href}
                      className="font-medium text-brand-600 hover:text-brand-700"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-7">
              <h2 className="text-xl font-bold tracking-tight text-ink-900">
                Key OCI requirements
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm text-ink-700">
                <li>
                  <strong>Foreign passport first.</strong> You must hold another
                  citizenship and have surrendered Indian citizenship.
                </li>
                <li>
                  <strong>Documented Indian origin</strong> — your own, a
                  parent&apos;s, grandparent&apos;s, or great-grandparent&apos;s,
                  or a 2+ year marriage to an Indian citizen / OCI holder.
                </li>
                <li>
                  <strong>
                    <Link
                      href={ociGuidePath("apostille")}
                      className="text-brand-700 underline"
                    >
                      Apostilled US civil documents
                    </Link>
                  </strong>{" "}
                  where required (birth / marriage / name-change).
                </li>
                <li>
                  <strong>OCI photo to spec</strong> — square, white background,
                  large centred face.
                </li>
                <li>
                  <strong>Re-issue milestones</strong> — re-issue at 20 and once
                  after 50, and on each new passport for minors.
                </li>
              </ul>
              <p className="mt-4 text-xs text-ink-400">
                Summarised as of{" "}
                <time dateTime={OCI_DATA_AS_OF}>{OCI_DATA_AS_OF}</time>. Always
                verify on the official portals below.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Processing timeline at a glance */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Processing timelines"
            title={`OCI takes roughly ${totalWeeksLabel()}`}
            description="OCI needs a two-stage clearance — the consulate plus the Ministry of Home Affairs in India — which is why it runs longer than a passport renewal."
            action={{ label: "Open the timeline tool", href: OCI_TOOLS.timeline.path }}
          />
          <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-6 text-sm text-ink-600">
            Enter your application date in the{" "}
            <Link href={OCI_TOOLS.timeline.path} className="font-semibold text-brand-700 underline">
              OCI Timeline Calculator
            </Link>{" "}
            to see expected VFS, consulate, MHA, printing, and dispatch dates —
            and an estimated delivery window.
          </div>
        </Container>
      </section>

      {/* Common mistakes */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Watch out"
            title="Common mistakes that delay OCI"
            description="None of these are catastrophic on their own — they're just where applications most often get bounced back."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mistakes.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
              >
                <h3 className="text-sm font-bold text-ink-900">{m.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{m.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Guides */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Read the guides"
            title="Three guides that cover everything"
            description="No fluff, no 100-page maze — each guide is dense, scannable, and links straight to the tools you need."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {ociGuides.map((g) => (
              <Link
                key={g.slug}
                href={ociGuidePath(g.slug)}
                className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span aria-hidden className="text-2xl">
                  {g.icon}
                </span>
                <h3 className="mt-3 text-base font-bold tracking-tight text-ink-900 group-hover:text-brand-600">
                  {g.navLabel}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
                  {g.hook}
                </p>
                <span className="mt-3 text-xs font-medium text-ink-400">
                  {g.readingTime} min read
                </span>
                <span className="mt-1 text-sm font-semibold text-brand-600">
                  Read guide{" "}
                  <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faq} />
        </Container>
      </section>

      {/* Official links */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Official sources"
            title="Apply and verify on the official portals"
            description="NRItoUSA is an independent educational resource. Always complete and pay for your application on the official sites."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.values(VERIFY_SOURCES).map((s) => (
              <a
                key={s.href}
                href={s.href}
                rel="nofollow noopener"
                target="_blank"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
              >
                <span className="font-semibold text-ink-800 group-hover:text-brand-700">
                  {s.label}
                </span>
                <span aria-hidden className="text-ink-400 group-hover:text-brand-600">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
