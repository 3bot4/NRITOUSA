import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import SectionHeading from "@/components/SectionHeading";
import { author as owner } from "@/lib/author";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import { OCI_BASE, OCI_TOOLS, VERIFY_SOURCES } from "@/lib/oci/config";
import { ociGuidePath } from "@/lib/ociGuides";

/* ------------------------------------------------------------------ *
 * e-OCI Card guide — a supporting page inside the OCI cluster.
 * Focus: how existing OCI holders download, use and troubleshoot the
 * digital (electronic) OCI card. First-time application, apostille and
 * passport-renewal details are kept short and cross-linked to the
 * dedicated pillar guides so this page never duplicates them.
 * ------------------------------------------------------------------ */

const PATH = "/oci/e-oci-card";
const PUBLISHED = "2026-07-07";
const MODIFIED = "2026-07-07";

const TITLE =
  "e-OCI Card Guide: How OCI Holders in the USA Can Download and Use Digital OCI";
const META_TITLE =
  "e-OCI Card Guide for Indians in USA: How to Download, Use & Fix Issues";
const META_DESCRIPTION =
  "Learn how to download your e-OCI card, whether it replaces your physical OCI booklet, how to use it for travel, what to do after passport renewal, and how to fix email/login issues.";

/** Official OCI Services Portal — where e-OCI and Miscellaneous Services live. */
const OCI_PORTAL = VERIFY_SOURCES.ociPortal.href;
const VFS_OCI = VERIFY_SOURCES.ociServices.href;

export const metadata: Metadata = pageMetadata({
  title: META_TITLE,
  description: META_DESCRIPTION,
  path: PATH,
  type: "article",
  socialTitle: TITLE,
  openGraph: {
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
});

/* ------------------------------------------------------------------ *
 * Table of contents (drives the sticky desktop sidebar + section ids)
 * ------------------------------------------------------------------ */

const TOC: { id: string; label: string }[] = [
  { id: "what-is", label: "What is e-OCI?" },
  { id: "who", label: "Who can download e-OCI?" },
  { id: "how-to", label: "How to download e-OCI" },
  { id: "travel", label: "Can I travel with e-OCI?" },
  { id: "vs-physical", label: "e-OCI vs physical OCI" },
  { id: "free", label: "Is e-OCI free?" },
  { id: "passport", label: "If I renewed my passport" },
  { id: "email", label: "If my email doesn't work" },
  { id: "no-email", label: "No email on the OCI record" },
  { id: "record-not-found", label: "Record Not Found fix" },
  { id: "otp", label: "OTP not received fix" },
  { id: "family", label: "One account for the family" },
  { id: "problems", label: "Common problems & fixes" },
  { id: "safety", label: "Safety & privacy tips" },
  { id: "nri-families", label: "For NRI families in the USA" },
  { id: "bottom-line", label: "Bottom line" },
  { id: "faq", label: "FAQ" },
  { id: "sources", label: "Official sources" },
];

/* ------------------------------------------------------------------ *
 * Structured content (rendered once, reused for schema where relevant)
 * ------------------------------------------------------------------ */

/** Who-can-download table. */
const WHO_ROWS: [string, string, string][] = [
  [
    "Existing OCI holder with portal login",
    "Yes",
    "Log in, open the e-OCI tab, generate and download.",
  ],
  [
    "Existing OCI holder without portal login",
    "Yes, after setup",
    "Create an account using the email linked to your OCI record, then download.",
  ],
  [
    "Registered email no longer accessible",
    "Not yet",
    "Update it via Email ID Updation under OCI Miscellaneous Services first, then download once approved.",
  ],
  [
    "Minor child's OCI",
    "Yes",
    "A parent can manage it once the child's OCI record email is updated and approved.",
  ],
  [
    "Elderly parent's OCI",
    "Yes",
    "An adult child can manage it after the parent's OCI record email is individually updated and approved.",
  ],
  [
    "New OCI applicant after approval",
    "If supported",
    "After the OCI is granted, download from the portal where the e-OCI option is available.",
  ],
  [
    "OCI holder with renewed passport",
    "Yes, but update first",
    "If passport particulars must be updated under OCI rules, do that via Miscellaneous Services before relying on e-OCI.",
  ],
  [
    "OCI holder with wrong details / address issue",
    "Fix first",
    "Correct the details through OCI Miscellaneous Services, then generate e-OCI.",
  ],
];

/** Download steps — the SAME array powers the visible table and HowTo schema. */
const DOWNLOAD_STEPS: { name: string; text: string }[] = [
  {
    name: "Open the official OCI Services Portal",
    text: "Go to the official OCI Services Portal. Always confirm you are on the genuine government site before logging in.",
  },
  {
    name: "Log in with your OCI-linked account",
    text: "Log in using the email or user ID linked to your OCI record.",
  },
  {
    name: "Or create an account",
    text: "If you do not have an account, create one using the email connected to the OCI record.",
  },
  {
    name: "Open the e-OCI tab",
    text: "Select the e-OCI tab on the dashboard.",
  },
  {
    name: "Review your OCI details",
    text: "Review the displayed OCI details to make sure they are correct.",
  },
  {
    name: "Generate the e-OCI card",
    text: "Click Generate e-OCI Card.",
  },
  {
    name: "Download and save it",
    text: "Download and save the e-OCI card securely.",
  },
  {
    name: "Keep a backup",
    text: "Keep a copy on your phone and a backup copy in secure cloud or password-protected storage.",
  },
  {
    name: "Print a copy if you want",
    text: "Print a copy for personal reference if desired.",
  },
  {
    name: "Carry your passport and follow travel rules",
    text: "Carry your valid passport and follow current airline and immigration requirements when travelling.",
  },
];

/** e-OCI vs physical comparison. */
const COMPARE_ROWS: [string, string, string][] = [
  ["Format", "Digital PDF you download and store", "Printed booklet / sticker"],
  [
    "Download access",
    "Free, up to five times per day from the portal",
    "Issued once through the application/VFS process",
  ],
  [
    "Travel use",
    "May be presented digitally at Immigration Check Posts and to airlines when required",
    "Traditionally carried and presented at travel",
  ],
  [
    "Replacement for lost card?",
    "Convenient digital access, but not a formal replacement service",
    "Lost/damaged card needs a re-issue service",
  ],
  [
    "Status / rights",
    "Does not change your OCI status or rights",
    "Reflects the same OCI status and rights",
  ],
  [
    "Passport renewal updates",
    "Update passport particulars via Miscellaneous Services when required",
    "Same OCI rules on passport updates apply",
  ],
  [
    "Best use case",
    "Quick digital access while travelling and managing family records",
    "Your official OCI document of record",
  ],
];

/** Troubleshooting table. */
const PROBLEM_ROWS: [string, string, string][] = [
  [
    "Record Not Found",
    "Entered details don't match the OCI record, or the email isn't linked to it",
    "Recheck OCI card number, date of birth, passport number and email/user ID; if it continues, contact the concerned Indian Mission/Post, FRRO, or official helpdesk.",
  ],
  [
    "OTP not received",
    "Wrong registered email/mobile, spam filtering, or portal delay",
    "Verify the registered email/mobile, check spam/junk, wait and try again later, then contact the helpdesk if it continues.",
  ],
  [
    "No email registered on old OCI record",
    "Some older OCI records have no email recorded",
    "Create a new account with your current email, then update the record via Email ID Updation under OCI Miscellaneous Services.",
  ],
  [
    "Email update pending",
    "Email ID Updation request not yet approved",
    "Wait for approval before downloading — don't leave it to the night before travel.",
  ],
  [
    "e-OCI tab missing after login",
    "Record not fully linked or email not updated",
    "Confirm the account email matches your OCI record; update via Miscellaneous Services if needed.",
  ],
  [
    "Login not working",
    "Wrong credentials or an old email on file",
    "Reset credentials, or use Email ID Updation if the registered email is inaccessible.",
  ],
  [
    "Registered email inaccessible",
    "Old, closed or no-longer-used email on the OCI record",
    "Submit Email ID Updation under Miscellaneous Services and wait for approval.",
  ],
  [
    "Generated e-OCI has old passport details",
    "Passport renewed but OCI record not updated",
    "Update passport particulars via the prescribed OCI process before relying on e-OCI.",
  ],
  [
    "e-OCI details do not match current passport",
    "Name, nationality or passport particulars changed",
    "Handle changes through OCI Miscellaneous Services or the official procedure notified by the Government of India.",
  ],
  [
    "Download stuck / backend validation pending",
    "Backend processing and validation take time",
    "Wait and do not interrupt immediately — a delay doesn't always mean the portal crashed.",
  ],
  [
    "Five-download daily limit reached",
    "Each e-OCI card can be downloaded up to five times per day",
    "Try again the next day.",
  ],
  [
    "Minor child's OCI not linked",
    "Child's record email not updated/approved",
    "Update the child's OCI record email individually, then manage it from your account.",
  ],
  [
    "Elderly parent's OCI not visible",
    "Parent's record email not updated/approved",
    "Update the parent's OCI record email individually and wait for approval.",
  ],
];

/** Visible FAQ — the SAME array powers the FAQPage schema (must match exactly). */
const FAQ: FaqItem[] = [
  {
    question: "What is e-OCI?",
    answer:
      "e-OCI is the electronic (digital) version of your OCI card. It gives you convenient digital access to your OCI cardholder details. It does not create a new OCI status, give extra rights, or cancel your physical OCI card.",
  },
  {
    question: "Is e-OCI free?",
    answer:
      "Yes. The official FAQ states that downloading the e-OCI card is free. Separate OCI miscellaneous services, re-issue, lost/damaged card services, or VFS submissions may involve their own rules and fees.",
  },
  {
    question: "How do I download my e-OCI card?",
    answer:
      "Log in to the official OCI Services Portal with the email or user ID linked to your OCI record, open the e-OCI tab, review your details, click Generate e-OCI Card, then download and save it securely.",
  },
  {
    question: "Can I travel to India with e-OCI?",
    answer:
      "Official FAQ language indicates the downloaded e-OCI card may be presented in digital form at Immigration Check Posts and to airlines whenever required. Because checks can vary during rollout, still carry your valid foreign passport and follow the latest official document requirements before travel.",
  },
  {
    question: "Can I travel with only e-OCI and no passport?",
    answer:
      "No. For international travel, your valid foreign passport remains the primary travel document. e-OCI is digital proof of your OCI details, but you must follow current airline, immigration, and official travel-document requirements.",
  },
  {
    question: "Does e-OCI replace the physical OCI booklet?",
    answer:
      "e-OCI is a digital access tool and does not change your OCI rights or status. It makes access easier, but travellers should still follow airline, immigration, and official document requirements.",
  },
  {
    question: "Do existing OCI holders need to apply again for e-OCI?",
    answer:
      "No. Existing OCI holders do not re-apply. Downloading e-OCI does not change the validity or status of existing OCI cardholders — you simply log in to the portal and generate it from the e-OCI tab.",
  },
  {
    question: "What if my registered email is no longer accessible?",
    answer:
      "Update it through Email ID Updation under OCI Miscellaneous Services, submit the request, and wait for approval. Once the new email is linked to your OCI record, log in and download e-OCI.",
  },
  {
    question: "What should I do if e-OCI shows Record Not Found?",
    answer:
      "Recheck the details entered, including OCI card number, date of birth, passport number, and linked email/user ID. If the problem continues, contact the concerned Indian Mission/Post, FRRO, or official helpdesk.",
  },
  {
    question: "What should I do if I do not receive the e-OCI OTP?",
    answer:
      "Verify the registered email or mobile number, check spam/junk folder, wait and try again later, and contact the official helpdesk if the issue continues.",
  },
  {
    question: "What if no email was registered with my OCI card?",
    answer:
      "Create a new user account on the OCI Portal using your current email, then update the OCI record through Email ID Updation under OCI Miscellaneous Services. Keep your OCI card number, date of birth, and passport number linked to the OCI ready.",
  },
  {
    question: "Can I download e-OCI for my child?",
    answer:
      "Yes. Minors' OCI records can be managed through a parent's account, but the child's OCI record email must first be individually updated and approved.",
  },
  {
    question: "Can I manage my parents' OCI cards from one account?",
    answer:
      "A single user account may be used to manage multiple family members' OCI cards, including elderly applicants, only after each OCI record's registered email is individually updated and approved.",
  },
  {
    question: "How many times can I download e-OCI per day?",
    answer:
      "The e-OCI card can be downloaded a maximum of five times per day. If you reach the daily limit, try again the next day.",
  },
  {
    question: "What if I renewed my passport?",
    answer:
      "Passport update rules are separate from simply downloading e-OCI. If passport particulars need to be updated under current OCI guidelines, complete that update through OCI Miscellaneous Services first.",
  },
  {
    question: "Is e-OCI secure?",
    answer:
      "Save it securely, avoid emailing the card casually, do not share your OCI or passport number publicly, use password-protected storage, and only download from the official OCI portal — never on a public computer.",
  },
  {
    question: "Should I print my e-OCI card?",
    answer:
      "You can print a copy for personal reference if you find it convenient. Keep your valid passport with you and follow current airline and immigration requirements when travelling.",
  },
];

/* ------------------------------------------------------------------ *
 * Small presentational helpers (kept local to this page)
 * ------------------------------------------------------------------ */

function Callout({
  tone,
  title,
  children,
}: {
  tone: "amber" | "sky" | "rose" | "emerald";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    amber: "border-amber-200 bg-amber-50/60",
    sky: "border-sky-200 bg-sky-50/50",
    rose: "border-rose-200 bg-rose-50/50",
    emerald: "border-emerald-200 bg-emerald-50/50",
  }[tone];
  return (
    <div className={`my-6 rounded-2xl border ${styles} p-5`}>
      <p className="text-sm font-bold text-ink-900">{title}</p>
      <div className="mt-1.5 text-sm leading-relaxed text-ink-700">{children}</div>
    </div>
  );
}

function Table({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: string[][];
  /** Accessible summary — visually hidden, improves crawlability. */
  caption?: string;
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-ink-900/10">
      <table className="w-full min-w-[540px] border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-slate-50 text-ink-700">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r[0] + i}
              className="border-t border-ink-900/5 align-top text-ink-600"
            >
              {r.map((cell, j) =>
                j === 0 ? (
                  <th
                    key={j}
                    scope="row"
                    className="px-4 py-3 text-left font-medium text-ink-800"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={j} className="px-4 py-3">
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-12 scroll-mt-24 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl"
    >
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function EOciCardPage() {
  const url = absoluteUrl(PATH);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "OCI Center", url: OCI_BASE },
    { name: "e-OCI Card", url: PATH },
  ];

  const articleNode = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: TITLE,
    description: META_DESCRIPTION,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl(owner.url)}#person`,
      name: owner.name,
      jobTitle: owner.jobTitle,
      url: absoluteUrl(owner.url),
      sameAs: [owner.linkedin],
    },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  const howToNode = {
    "@type": "HowTo",
    name: "How to download your e-OCI card",
    description:
      "Steps for existing OCI holders to generate and download the digital e-OCI card from the official OCI Services Portal.",
    totalTime: "PT10M",
    step: DOWNLOAD_STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${url}#how-to`,
    })),
  };

  const jsonLd = jsonLdGraph(
    articleNode,
    howToNode,
    faqJsonLd(FAQ),
    breadcrumbJsonLd(crumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-ink-900/5 bg-gradient-to-b from-amber-50/60 to-white pt-8 pb-8 sm:pt-10">
        <Container>
          <div className="mx-auto max-w-[760px]">
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

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
              <span aria-hidden>🪪</span> OCI Center · e-OCI digital card
            </div>
            <h1 className="mt-2 text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.15rem]">
              {TITLE}
            </h1>
            <p className="mt-3 text-base leading-[1.6] text-ink-500">
              A practical guide for Indians, NRIs and Indian-origin families in
              the USA — how to download your e-OCI card, whether it replaces the
              physical booklet, using it for travel, and fixing email or login
              issues.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-400">
              <span>
                By{" "}
                <Link href={owner.url} className="font-medium text-ink-600 hover:text-brand-600">
                  {owner.name}
                </Link>
                , {owner.credentials}
              </span>
              <span aria-hidden>·</span>
              <span>
                Last updated:{" "}
                <time dateTime={MODIFIED}>July 7, 2026</time>
              </span>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <div className="mx-auto grid max-w-[1040px] gap-10 py-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          {/* Sticky TOC (desktop) */}
          <aside className="hidden lg:block">
            <nav
              aria-label="On this page"
              className="sticky top-24 rounded-2xl border border-ink-900/5 bg-white p-5 text-sm shadow-card"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
                On this page
              </p>
              <ul className="space-y-1.5">
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="block text-ink-500 transition hover:text-brand-600"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Article */}
          <article className="max-w-[720px] text-[1.0625rem] leading-[1.7] text-ink-700">
            {/* Quick answer */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Quick answer
              </p>
              <p className="mt-2 text-[0.975rem] leading-relaxed text-ink-800">
                e-OCI is the digital version of your OCI card. Existing OCI
                holders can generate and download it from the official OCI
                Services Portal using the e-OCI tab. It is free and does not
                change your OCI status. You may be able to present it digitally
                at immigration checkpoints and to airlines when required, but
                you should still follow current travel-document rules and keep
                your passport and OCI records updated.
              </p>
            </div>

            <p className="mt-6">
              This guide is especially useful if you are searching for e-OCI card
              download, digital OCI card, e-OCI login, e-OCI email update, e-OCI
              after passport renewal, e-OCI for a minor child, or whether e-OCI
              can be used for India travel.
            </p>

            {/* Who this guide is for */}
            <div className="my-6 rounded-2xl border border-ink-900/10 bg-slate-50/70 p-5">
              <p className="text-sm font-bold text-ink-900">
                Who should use this guide?
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-700">
                <li>Existing OCI holders in the USA</li>
                <li>Parents managing a child&apos;s OCI record</li>
                <li>Adult children helping elderly parents</li>
                <li>
                  OCI holders who changed or lost access to their registered
                  email
                </li>
                <li>OCI holders who renewed a passport</li>
                <li>
                  Travellers going to India soon who want digital OCI access
                </li>
              </ul>
            </div>

            {/* 1. What is e-OCI */}
            <H2 id="what-is">What is e-OCI?</H2>
            <p className="mt-3">
              e-OCI is a digital (electronic) version of your OCI card. It gives
              you convenient digital access to your OCI cardholder details from
              the official portal. Importantly, it:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>does not create a new OCI status;</li>
              <li>does not give you any extra rights;</li>
              <li>does not cancel or invalidate your physical OCI card.</li>
            </ul>
            <p className="mt-3">
              It is especially useful for NRIs and OCI holders travelling
              between the USA and India who want quick digital access to their
              OCI details. New to OCI itself? Start with our{" "}
              <Link href={ociGuidePath("how-to-apply")} className="text-brand-600 underline">
                how to apply for OCI
              </Link>{" "}
              guide, or the{" "}
              <Link href={OCI_BASE} className="text-brand-600 underline">
                OCI Center
              </Link>
              .
            </p>

            <Callout tone="amber" title="e-OCI does not replace your physical OCI status">
              e-OCI does not replace the physical OCI card, and downloading it
              does not alter the validity or status of existing OCI cardholders.
              It is a digital access tool — nothing more, nothing less.
            </Callout>

            {/* 2. Who can download */}
            <H2 id="who">Who can download e-OCI?</H2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Existing OCI cardholders.</li>
              <li>New OCI applicants after approval, if the portal supports it.</li>
              <li>Adults, minors and senior citizens with OCI records.</li>
              <li>
                Family members managed through a common account — but only after
                each record&apos;s email is updated properly (see{" "}
                <a href="#family" className="text-brand-600 underline">
                  managing the whole family
                </a>
                ).
              </li>
            </ul>
            <Table
              caption="Who can download the e-OCI card by situation, and what to do first"
              head={["Situation", "Can download e-OCI?", "What to do first"]}
              rows={WHO_ROWS}
            />

            {/* 3. How to download */}
            <H2 id="how-to">How to download your e-OCI card</H2>
            <p className="mt-3">
              Existing OCI holders can generate the e-OCI card in a few minutes.
              Follow these steps on the official OCI Services Portal:
            </p>
            <div className="my-6 overflow-x-auto rounded-2xl border border-ink-900/10">
              <table className="w-full min-w-[540px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Step-by-step instructions to download the e-OCI card from the
                  official OCI Services Portal
                </caption>
                <thead>
                  <tr className="bg-slate-50 text-ink-700">
                    <th scope="col" className="w-14 px-4 py-3 font-semibold">
                      Step
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      What to do
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DOWNLOAD_STEPS.map((s, i) => (
                    <tr
                      key={s.name}
                      className="border-t border-ink-900/5 align-top text-ink-600"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 text-left font-bold text-brand-600"
                      >
                        {i + 1}
                      </th>
                      <td className="px-4 py-3">
                        <span className="font-medium text-ink-800">{s.name}.</span>{" "}
                        {s.text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Callout tone="amber" title="Use only the official OCI portal">
              Before logging in, confirm you are on the genuine Government of
              India OCI Services Portal. Never enter your OCI credentials on a
              look-alike site.
            </Callout>

            {/* 4. Travel */}
            <H2 id="travel">
              Can I travel with e-OCI instead of the physical OCI card?
            </H2>
            <p className="mt-3">
              Official FAQ language indicates that the downloaded e-OCI card may
              be presented in digital form at Immigration Check Posts and to
              airlines whenever required. However, because airline and
              immigration checks can vary during rollout, travellers should
              still carry their valid foreign passport and follow the latest
              official document requirements before travel.
            </p>
            <p className="mt-3">
              For international travel, your valid foreign passport remains the
              primary travel document. Treat e-OCI as digital proof of OCI
              details unless the latest official airline, immigration, or
              Government of India guidance says otherwise. Do not assume you can
              travel with e-OCI alone.
            </p>
            <Callout tone="rose" title="Do not travel with e-OCI alone">
              Before your first India trip using e-OCI, verify current
              requirements with the airline, the VFS/OCI portal, and Indian
              mission guidance. Your passport is the primary travel document —
              keep it and your OCI records current. Not sure whether to use OCI
              or a visa for a trip? See{" "}
              <Link href="/oci-vs-india-visa" className="text-brand-700 underline">
                OCI vs India visa
              </Link>
              .
            </Callout>

            {/* 5. vs physical */}
            <H2 id="vs-physical">e-OCI vs physical OCI card</H2>
            <Table
              caption="Comparison of the digital e-OCI card and the physical OCI card or booklet"
              head={["Feature", "e-OCI", "Physical OCI card / booklet"]}
              rows={COMPARE_ROWS}
            />
            <p className="mt-3">
              <strong>Key message:</strong> e-OCI is a digital access tool. It
              does not change your OCI rights or status.
            </p>

            {/* 6. Free */}
            <H2 id="free">Is e-OCI free?</H2>
            <p className="mt-3">
              Yes — the official FAQ states that downloading the e-OCI card is
              free. However, if you need a separate OCI miscellaneous service, a
              re-issue, a lost/damaged card service, or a VFS submission, those
              may involve separate rules and fees. See exact figures with the{" "}
              <Link href={OCI_TOOLS.cost.path} className="text-brand-600 underline">
                OCI Cost Calculator
              </Link>
              .
            </p>

            {/* 7. Passport */}
            <H2 id="passport">What if I renewed my passport?</H2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                Passport update rules are separate from simply downloading
                e-OCI.
              </li>
              <li>
                If passport particulars need to be updated under current OCI
                guidelines, complete that update through OCI Miscellaneous
                Services first.
              </li>
            </ul>
            <p className="mt-3">
              For the full picture on re-issue at 20/50, new passports and
              related updates, see the{" "}
              <Link href={ociGuidePath("renewal")} className="text-brand-600 underline">
                OCI renewal &amp; updates
              </Link>{" "}
              guide.
            </p>
            <Callout tone="amber" title="Update email and passport details early">
              If your registered email or passport details are out of date on
              your OCI record, fix them through Miscellaneous Services well ahead
              of travel. Approval can take time — don&apos;t leave it until the
              night before your flight.
            </Callout>

            {/* 8. Email */}
            <H2 id="email">What if my registered email does not work?</H2>
            <p className="mt-3">
              This applies to any old, closed, inaccessible, or no-longer-used
              email account linked to your OCI record:
            </p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5">
              <li>Use Email ID Updation under OCI Miscellaneous Services.</li>
              <li>Submit the email update request.</li>
              <li>Wait for approval.</li>
              <li>
                Once the new email is linked to the OCI record, log in and
                download e-OCI.
              </li>
            </ol>
            <p className="mt-3 text-sm">
              Approval may take time, so start early — do not wait until the
              night before travel to update your email.
            </p>
            <p className="mt-4 text-sm font-semibold text-ink-700">
              Keep these ready:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li>OCI card number</li>
              <li>Date of birth</li>
              <li>Passport number linked to OCI</li>
              <li>New email address</li>
              <li>Access to the email for verification</li>
              <li>Approval confirmation</li>
            </ul>

            {/* 8b. No email registered */}
            <H2 id="no-email">What if no email was registered with the OCI card?</H2>
            <p className="mt-3">
              Some older OCI records may not have an email recorded at all. In
              that case:
            </p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5">
              <li>
                Create a new user account on the OCI Portal using your current
                email address.
              </li>
              <li>
                After logging in, update the OCI record through Email ID Updation
                under OCI Miscellaneous Services.
              </li>
              <li>
                Keep your OCI card number, date of birth, and passport number
                linked to the OCI card ready.
              </li>
              <li>Once approved, use the updated account to download e-OCI.</li>
            </ol>

            {/* 8c. Record Not Found */}
            <H2 id="record-not-found">e-OCI Record Not Found: what to do</H2>
            <p className="mt-3">
              If the portal shows <strong>&ldquo;Record Not Found,&rdquo;</strong>{" "}
              work through these first:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                Recheck your OCI card number, date of birth, passport number, and
                email/user ID.
              </li>
              <li>Make sure the email is linked to the correct OCI record.</li>
              <li>
                If details are old or changed, use OCI Miscellaneous Services
                where applicable.
              </li>
              <li>
                If the issue continues, contact the concerned Indian Mission/Post,
                FRRO, or the designated helpdesk.
              </li>
            </ul>

            {/* 8d. OTP not received */}
            <H2 id="otp">e-OCI OTP not received: what to do</H2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Verify your registered email address or mobile number.</li>
              <li>Check your spam/junk folder.</li>
              <li>Wait and try again later.</li>
              <li>Avoid repeated rapid attempts if the portal is slow.</li>
              <li>Contact the official helpdesk if the issue continues.</li>
            </ul>

            {/* 9. Family */}
            <H2 id="family">Can one account manage e-OCI for the whole family?</H2>
            <p className="mt-3">
              A common user account may be used to manage multiple family
              members, including elderly applicants — but each OCI record&apos;s
              registered email must first be updated individually and approved.
              This is useful for:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>managing minor children&apos;s OCI records;</li>
              <li>adult children helping elderly parents.</li>
            </ul>
            <p className="mt-3">
              Do not mix records without completing the official email-update
              steps for each person first.
            </p>

            {/* 10. Problems */}
            <H2 id="problems">Common e-OCI problems and fixes</H2>
            <Table
              caption="Common e-OCI problems, their likely reasons, and what to try"
              head={["Problem", "Likely reason", "What to try"]}
              rows={PROBLEM_ROWS}
            />
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>e-OCI can be downloaded a maximum of five times per day.</li>
              <li>If the daily limit is reached, try again the next day.</li>
              <li>
                If a download is slow, wait and do not interrupt immediately —
                backend validation may take time.
              </li>
              <li>If the issue continues, contact the official helpdesk.</li>
            </ul>

            {/* 11. Safety */}
            <H2 id="safety">e-OCI safety and privacy tips</H2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Save the card securely.</li>
              <li>Do not email the card casually.</li>
              <li>Do not share your OCI number or passport number publicly.</li>
              <li>Use password-protected cloud storage.</li>
              <li>Keep a backup copy.</li>
              <li>Avoid downloading on public computers.</li>
              <li>Verify you are on the official OCI portal.</li>
            </ul>

            {/* 12. NRI families */}
            <H2 id="nri-families">e-OCI for NRI and Indian families in the USA</H2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Handy for families travelling from the USA to India.</li>
              <li>Useful for parents managing minor children&apos;s OCI.</li>
              <li>Useful for adult children helping elderly parents.</li>
              <li>Useful when the physical card is not easily accessible.</li>
              <li>
                Still keep passports, OCI details and travel records organised.
              </li>
            </ul>
            <p className="mt-3">
              Not sure you qualify or what OCI costs? Try the{" "}
              <Link href={OCI_TOOLS.eligibility.path} className="text-brand-600 underline">
                OCI Eligibility Checker
              </Link>
              , the{" "}
              <Link href={OCI_TOOLS.cost.path} className="text-brand-600 underline">
                OCI Cost Calculator
              </Link>
              , or the{" "}
              <Link href={OCI_TOOLS.timeline.path} className="text-brand-600 underline">
                OCI Timeline Calculator
              </Link>
              . Documents from the USA often need apostille — see the{" "}
              <Link href={ociGuidePath("apostille")} className="text-brand-600 underline">
                OCI apostille guide
              </Link>
              .
            </p>

            {/* 13. Bottom line */}
            <H2 id="bottom-line">Bottom line</H2>
            <p className="mt-3">
              e-OCI is a helpful digital upgrade for OCI holders, but it should
              be treated as part of your travel-document system — not as an
              excuse to ignore passport updates, OCI miscellaneous updates, or
              airline/immigration document checks.
            </p>
            <Callout tone="sky" title="Carry a valid passport and follow travel requirements">
              e-OCI makes access easier, but always travel with your valid
              foreign passport and follow current airline, immigration and
              official document rules.
            </Callout>

            {/* FAQ */}
            <H2 id="faq">Frequently asked questions</H2>
            <div className="mt-4 divide-y divide-ink-900/5 rounded-2xl border border-ink-900/10 bg-white">
              {FAQ.map((f) => (
                <details key={f.question} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-[0.975rem] font-semibold text-ink-900 marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {f.question}
                      <span
                        aria-hidden
                        className="text-ink-400 transition group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>

            {/* Author / reviewer */}
            <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:flex-row sm:items-center">
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white"
              >
                DM
              </span>
              <div className="text-sm">
                <p className="font-semibold text-ink-900">
                  Written &amp; reviewed by{" "}
                  <Link href={owner.url} className="text-brand-600 hover:text-brand-700">
                    {owner.name}
                  </Link>
                  , {owner.credentials}
                </p>
                <p className="mt-1 text-ink-500">
                  {owner.reviewerBio}{" "}
                  <span className="text-ink-400">
                    Last updated{" "}
                    <time dateTime={MODIFIED}>July 7, 2026</time>.
                  </span>
                </p>
              </div>
            </div>

            {/* Official sources */}
            <H2 id="sources">Official sources used</H2>
            <p className="mt-3 text-sm text-ink-500">
              NRItoUSA is an independent educational resource. Always download,
              update and verify on the official government portals below before
              relying on e-OCI or travelling.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                {
                  label: "Government of India — OCI Services Portal (login & e-OCI tab)",
                  href: OCI_PORTAL,
                },
                {
                  label: "e-OCI FAQ & OCI Miscellaneous Services (OCI Services Portal)",
                  href: OCI_PORTAL,
                },
                {
                  label: "VFS Global — OCI services (USA)",
                  href: VFS_OCI,
                },
                {
                  label: "Ministry of Home Affairs — OCI cardholder",
                  href: VERIFY_SOURCES.mha.href,
                },
                {
                  label: "Indian Consulate — OCI guidance (example: CGI San Francisco)",
                  href: "https://www.cgisf.gov.in/page/oci-overseas-citizenship-of-india-cards/",
                },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="nofollow noopener"
                    target="_blank"
                    className="text-brand-600 underline hover:text-brand-700"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-ink-900/5 bg-white p-5 text-sm text-ink-500">
              <strong className="font-semibold text-ink-700">A quick note:</strong>{" "}
              This guide is educational and reflects general information, not
              legal or immigration advice. e-OCI, OCI rules and portal steps can
              change — always confirm on the official OCI Services Portal and
              your consulate before relying on e-OCI or booking travel.
            </div>

            <div className="mt-6 text-sm">
              <Link
                href={OCI_BASE}
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                ← Back to the OCI Center
              </Link>
            </div>
          </article>
        </div>
      </Container>

      {/* OCI tools */}
      <section className="bg-white py-12 sm:py-14">
        <Container>
          <SectionHeading eyebrow="Do it now" title="OCI tools" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { ...OCI_TOOLS.eligibility, icon: "🪪", desc: "Confirm you qualify in 60 seconds." },
              { ...OCI_TOOLS.cost, icon: "💵", desc: "Line-by-line fee estimate." },
              { ...OCI_TOOLS.timeline, icon: "⏱️", desc: "Stage-by-stage delivery dates." },
            ].map((t) => (
              <Link
                key={t.path}
                href={t.path}
                className="group rounded-2xl border border-ink-900/10 bg-white p-5 transition hover:border-brand-400 hover:shadow-sm"
              >
                <span aria-hidden className="text-2xl">
                  {t.icon}
                </span>
                <h3 className="mt-2 font-semibold text-ink-900 group-hover:text-brand-700">
                  {t.label}
                </h3>
                <p className="mt-1 text-sm text-ink-500">{t.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-sm">
            <Link href="/tools" className="font-medium text-brand-600 hover:text-brand-700">
              Browse all free tools →
            </Link>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
