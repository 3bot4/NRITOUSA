import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import { ToolIntro, ToolDeepDive } from "@/components/tools/ToolHub";
import UscisNoticeDecoder from "@/components/tools/UscisNoticeDecoder";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  noticeDeadlineRules,
  noExtensionRule,
  mailingRule,
  rfeReality,
  i797Variants,
  uscisNoticeSources,
  USCIS_NOTICE_VERIFIED,
  USCIS_NOTICE_DISCLAIMER,
} from "@/data/uscisNoticeData";
import { getTool } from "@/lib/tools";
import { getToolHubContent } from "@/lib/toolHubContent";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";

const tool = getTool("uscis-notice-decoder")!;
const content = getToolHubContent("uscis-notice-decoder")!;

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: "/tools/uscis-notice-decoder",
});

export default function UscisNoticeDecoderPage() {
  const url = absoluteUrl("/tools/uscis-notice-decoder");
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: tool.title,
      description: content.description,
      url,
      applicationCategory: content.appCategory,
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(content.faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: tool.label, url: "/tools/uscis-notice-decoder" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="uscis-notice-decoder"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.label },
        ]}
        icon={tool.icon}
        category={tool.group}
        title={tool.title}
        hook="Got a USCIS notice and not sure what it means? Select the notice type for a plain-English explanation, deadline warnings, and what to check."
        accent={tool.accent}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/uscis/myuscis-account"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              myUSCIS account guide →
            </Link>
            <Link
              href="/uscis/i-797-notice"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-900/20"
            >
              I-797 notice types explained
            </Link>
          </div>
        }
        disclaimerExtra={
          <p>
            No personal data collected. Always verify at{" "}
            <a
              href="https://www.uscis.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              uscis.gov
            </a>{" "}
            and consult a licensed immigration attorney.
          </p>
        }
      >
      {/* Tool */}
      <section className="pb-12 pt-6 sm:pb-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <UscisNoticeDecoder />
          </div>

          {/* Verified facts — render BELOW the tool for the same
              reason ToolIntro does: the decoder itself must clear the
              fold on a phone. Every number here comes from
              src/data/uscisNoticeData.ts, never inline. */}
          <div className="mx-auto mt-10 max-w-3xl space-y-6 sm:mt-12">
            <FastAnswerSnapshot
              title="The deadlines USCIS cannot exceed"
              accent="amber"
              rows={noticeDeadlineRules.map((r) => ({
                label: r.label,
                value: r.cap,
                note: `${r.capDays} days · ≈${r.withMailingDays} with mailing · ${r.cite}`,
              }))}
              badges={["Set by federal regulation", "Your printed date controls"]}
              lastVerified={USCIS_NOTICE_VERIFIED}
              sources={uscisNoticeSources}
              disclaimer={USCIS_NOTICE_DISCLAIMER}
            />

            {/* The two rules people get wrong most often. */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                  No extensions — ever
                </p>
                <p className="mt-2 text-sm leading-relaxed text-rose-900">
                  &ldquo;{noExtensionRule.text}&rdquo;
                </p>
                <p className="mt-2 text-[11px] font-medium text-rose-700/80">
                  {noExtensionRule.cite}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  The clock starts before you read it
                </p>
                <p className="mt-2 text-sm leading-relaxed text-amber-900">
                  {mailingRule.text}
                </p>
                <p className="mt-2 text-[11px] font-medium text-amber-700/80">
                  {mailingRule.cite}
                </p>
              </div>
            </div>

            {/* Context for the most anxiety-producing notice. */}
            <div className="rounded-2xl border border-ink-900/10 bg-ink-50/50 p-5 sm:p-6">
              <h2 className="text-base font-bold tracking-tight text-ink-900">
                How common is an RFE, really?
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { v: rfeReality.overallRatePct, l: `of completed H-1B petitions drew an RFE in ${rfeReality.fiscalYear}` },
                  { v: rfeReality.rfesIssued, l: `RFEs issued, out of ${rfeReality.petitionsCompleted} petitions completed` },
                  { v: rfeReality.initialEmploymentRatePct, l: "for petitions for initial employment — higher than continuing employment" },
                ].map((c) => (
                  <div key={c.l} className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <p className="text-2xl font-extrabold tracking-tight text-ink-900">{c.v}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{c.l}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-600">
                An RFE is a request for more evidence — not a denial, and not a
                sign the officer has decided against you. {rfeReality.note}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-500">
                H-1B adjudications only — this is not an all-forms RFE rate.
                Source:{" "}
                <a
                  href={rfeReality.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {rfeReality.sourceName}
                </a>
                .
              </p>
            </div>

            {/* The decode key: one form number, many meanings. */}
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5 sm:p-6">
              <h2 className="text-base font-bold tracking-tight text-ink-900">
                The I-797 decode key
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                USCIS sends many unrelated messages under one form number. The
                letter after &ldquo;I-797&rdquo; is what carries the meaning —
                which is exactly why these notices are hard to read.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-900/10">
                      <th scope="col" className="py-2 pr-3 text-xs font-bold uppercase tracking-wide text-ink-500">Code</th>
                      <th scope="col" className="py-2 pr-3 text-xs font-bold uppercase tracking-wide text-ink-500">What it is</th>
                      <th scope="col" className="py-2 text-xs font-bold uppercase tracking-wide text-ink-500">What it means</th>
                    </tr>
                  </thead>
                  <tbody>
                    {i797Variants.map((v) => (
                      <tr key={v.code} className="border-b border-ink-900/5 align-top">
                        <td className="py-3 pr-3 font-mono text-xs font-bold text-brand-700">{v.code}</td>
                        <td className="py-3 pr-3 text-xs font-semibold text-ink-900">{v.name}</td>
                        <td className="py-3 text-xs leading-relaxed text-ink-600">
                          {v.meaning}
                          {v.gotcha ? (
                            <span className="mt-1 block font-medium text-amber-700">
                              ⚠ {v.gotcha}
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-ink-500">
                Source:{" "}
                <a
                  href="https://www.uscis.gov/forms/filing-guidance/form-i-797-types-and-functions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  USCIS — Form I-797: Types and Functions
                </a>
                . For the full walkthrough see{" "}
                <Link href="/uscis/i-797-notice" className="font-semibold text-brand-700 underline">
                  I-797 notice types explained
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Static SEO context — renders BELOW the tool so the
              first interactive element clears the fold on a phone. */}
          <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
            <ToolIntro content={content} />
          </div>
        </Container>
      </section>

      {/* Related guides */}
      <section className="border-t border-ink-900/5 bg-ink-50/50 py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-bold text-ink-900 mb-4">
              Related USCIS guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/uscis/myuscis-account",
                  label: "myUSCIS Account Guide",
                  desc: "Online account number, access code, adding paper cases, privacy tips",
                },
                {
                  href: "/uscis/i-797-notice",
                  label: "I-797 Notice Types Explained",
                  desc: "I-797A, I-797B, I-797C, I-797D — what each means for H1B and green card",
                },
                {
                  href: "/uscis/rfe-notice",
                  label: "RFE Notice Guide",
                  desc: "What to do when USCIS sends a Request for Evidence — decode the notice & its deadline",
                },
                {
                  href: "/uscis/biometrics-notice",
                  label: "Biometrics Appointment Guide",
                  desc: "What to bring, rescheduling, and what happens at the ASC",
                },
                {
                  href: "/uscis/approval-notice",
                  label: "Approval Notice Guide",
                  desc: "I-140 priority date, H1B I-94, EAD — what to check after approval",
                },
                {
                  href: "/tools/uscis-case-status-meaning",
                  label: "USCIS Case Status Decoder",
                  desc: "Plain-English meaning of every USCIS online status message",
                },
                {
                  href: "/tools/uscis-processing-delay-checker",
                  label: "Processing Delay Checker",
                  desc: "Is your H1B, I-485, or EAD case outside normal processing time?",
                },
                {
                  href: "/uscis",
                  label: "USCIS Hub",
                  desc: "Case status, receipt numbers, H1B, green card, and more",
                },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-brand-400 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                    {g.label}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Full SEO hub content: notice types, process, mistakes,
          related links, and FAQ */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <ToolDeepDive content={content} />
        </Container>
      </section>
      </ToolFirstLayout>
    </>
  );
}
