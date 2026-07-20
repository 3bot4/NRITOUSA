import Link from "next/link";
import EstimatedTimelineTable from "@/components/EstimatedTimelineTable";
import ToolFaq from "@/components/tools/ToolFaq";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import type { ToolHubContent, ToolTable } from "@/lib/toolHubContent";

/**
 * Static SEO context that turns a thin immigration tool into a mini-hub.
 * `ToolIntro` renders above the tool (quick answer, short description, who
 * it's for, key inputs/documents, timeline/fee note, and the standard
 * "verify with official sources" banner). `ToolDeepDive` renders below
 * (explainer, step-by-step, timeline, fees, document checklist, common
 * mistakes, worked example, internal links, FAQ). Content comes from
 * lib/toolHubContent. All numbers are estimates with a verify pointer.
 */

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl">
      {eyebrow && (
        <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-brand-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-ink-700">{children}</div>
    </section>
  );
}

export function ToolIntro({
  content,
  verifyNote,
}: {
  content: ToolHubContent;
  /**
   * Override the default "verify with official sources" banner. Pass this for
   * non-immigration tools (e.g. the tax checker) so the banner does not
   * reference USCIS / State Department / DOL.
   */
  verifyNote?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Byline row — wired to the content's verified/updated date */}
      {content.updated && <ReviewedByline date={content.updated} />}

      {/* Quick answer — the answer-first tint is reserved for rebuilt hubs
          (those declaring `updated`); every other tool keeps its existing look. */}
      <div
        className={`rounded-2xl border p-5 shadow-card sm:p-6 ${
          content.updated
            ? "border-emerald-300 bg-emerald-50/70"
            : "border-brand-200 bg-brand-50/50"
        }`}
      >
        <span
          className={`inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide ${
            content.updated ? "text-emerald-700" : "text-brand-700"
          }`}
        >
          {content.updated ? "Quick Answer" : "Quick answer"}
        </span>
        <p className="mt-3 text-sm leading-relaxed text-ink-800">{content.quickAnswer}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{content.shortDescription}</p>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Who this tool is for
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-700">{content.audience}</dd>
          </div>
          {content.timelineFeeNote && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Estimated timeline / fees
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-700">
                {content.timelineFeeNote}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Key takeaways — numeric, standalone facts */}
      {content.takeaways && content.takeaways.length > 0 && (
        <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
            Key takeaways
          </p>
          <ul className="space-y-2.5">
            {content.takeaways.map((t) => (
              <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                <span aria-hidden className="mt-0.5 text-brand-500">
                  ▸
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key inputs / documents */}
      <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">
          Key inputs &amp; documents you&apos;ll need
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {content.keyInputs.map((input) => (
            <li key={input} className="flex gap-2 text-sm text-ink-700">
              <span aria-hidden className="mt-0.5 text-brand-500">
                ▸
              </span>
              <span>{input}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Important verify banner. Defaults to the agency boilerplate that matches
          the tool's category, and is fully overridable via `verifyNote`. */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs leading-relaxed text-amber-900">
        {verifyNote ?? (
          content.appCategory === "FinanceApplication" ? (
            <>
              <strong className="font-bold">Important:</strong> tax rules,
              thresholds, and filing deadlines change. Use this as an estimate and
              verify with official sources (irs.gov, fincen.gov, treasury.gov, and
              the BSA E-Filing System at bsaefiling.fincen.treas.gov) before filing
              or making decisions. This is not tax or legal advice.
            </>
          ) : (
            <>
              <strong className="font-bold">Important:</strong> immigration rules,
              fees, and processing times change. Use this as an estimate and verify
              with official sources (uscis.gov, travel.state.gov, dol.gov) before
              filing or making decisions. This is not legal advice.
            </>
          )
        )}
      </div>
    </div>
  );
}

/** One reference/comparison table rendered as clean semantic <table> markup. */
export function ReferenceTable({ table }: { table: ToolTable }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
        {table.caption ?? "Reference table"}
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
              {table.headers.map((h) => (
                <th key={h} className="p-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5 bg-white">
            {table.rows.map((row) => (
              <tr key={row[0]} className="align-top">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={
                      i === 0 ? "p-3 font-semibold text-ink-900" : "p-3 text-ink-600"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ToolDeepDive({
  content,
  hideFaq = false,
}: {
  content: ToolHubContent;
  /** Skip the built-in FAQ when the page already renders its own (e.g. a live, data-driven FAQ). */
  hideFaq?: boolean;
}) {
  return (
    <div className="space-y-12 sm:space-y-14">
      {/* How this calculation works — formula, inputs, assumptions */}
      {content.howItWorks && (
        <SectionCard eyebrow="Behind the tool" title={content.howItWorks.heading}>
          <p>{content.howItWorks.body}</p>
        </SectionCard>
      )}

      {/* What your result means */}
      {content.resultMeaning && (
        <SectionCard eyebrow="After the tool" title="What your result means">
          <p>{content.resultMeaning}</p>
        </SectionCard>
      )}

      {/* Reference / comparison tables */}
      {[...(content.table ? [content.table] : []), ...(content.tables ?? [])].map(
        (tbl) => (
          <ReferenceTable key={tbl.caption ?? tbl.headers.join("|")} table={tbl} />
        )
      )}

      {/* Explainer */}
      {content.explain && (
        <SectionCard
          eyebrow={content.resultMeaning || content.table ? undefined : "After the tool"}
          title={content.explain.heading}
        >
          <div className="space-y-3">
            {content.explain.items.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-card"
              >
                <p className="text-sm font-bold text-ink-900">{item.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Step-by-step process. The <ol> conveys order to assistive tech; the
          visual number badge is aria-hidden so a screen reader announces the
          position once, not twice. */}
      {content.steps.length > 0 && (
        <SectionCard title="Step-by-step process">
          <ol className="space-y-3">
            {content.steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-ink-700">{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {/* Timeline */}
      {content.timeline && (
        <EstimatedTimelineTable
          title={content.timeline.title}
          intro={content.timeline.intro}
          rows={content.timeline.rows.map((r) => ({
            stage: r.stage,
            estimatedTime: r.estimate,
            notes: r.notes,
          }))}
        />
      )}

      {/* Fees / costs */}
      {content.fees && (
        <SectionCard title={content.fees.heading}>
          <div className="space-y-3">
            {content.fees.items.map((item) => (
              <div key={item.label} className="rounded-xl border border-ink-900/10 bg-white p-4">
                <p className="text-sm font-bold text-ink-900">{item.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.body}</p>
              </div>
            ))}
          </div>
          {content.fees.note && (
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              {content.fees.note}
              {content.fees.sourceUrl && content.fees.sourceName && (
                <>
                  {" "}
                  <a
                    href={content.fees.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 underline underline-offset-2"
                  >
                    {content.fees.sourceName} →
                  </a>
                </>
              )}
            </p>
          )}
        </SectionCard>
      )}

      {/* Document checklist */}
      {content.documents && (
        <SectionCard title={content.documents.heading}>
          <ul className="space-y-2">
            {content.documents.items.map((doc) => (
              <li key={doc} className="flex gap-2 text-sm leading-relaxed text-ink-700">
                <span aria-hidden className="mt-0.5 text-emerald-500">
                  ✓
                </span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Common mistakes */}
      {content.mistakes.length > 0 && (
        <SectionCard title="Common mistakes to avoid">
          <ul className="space-y-2">
            {content.mistakes.map((m) => (
              <li key={m} className="flex gap-2 text-sm leading-relaxed text-ink-700">
                <span aria-hidden className="mt-0.5 text-rose-500">
                  ✕
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Example scenario */}
      {content.example && (
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card sm:p-6">
            <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-amber-700">
              Example scenario
            </p>
            <h2 className="mt-1 text-lg font-bold text-ink-900">{content.example.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{content.example.body}</p>
          </div>
        </div>
      )}

      {/* How this connects to adjacent processes */}
      {content.connects && (
        <SectionCard eyebrow="In context" title={content.connects.heading}>
          <p>{content.connects.body}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {content.connects.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
                >
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Related links */}
      <SectionCard title="Related NRITOUSA tools">
        <ul className="grid gap-2 sm:grid-cols-2">
          {content.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white p-3 text-sm font-semibold text-ink-800 shadow-card transition hover:border-brand-300 hover:text-brand-700"
              >
                <span className="flex-1">{link.label}</span>
                <span
                  aria-hidden
                  className="text-brand-500 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* FAQ */}
      {!hideFaq && (
        <ToolFaq items={content.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      )}

      {/* Author bio + editorial disclosure — only on hubs that opt in by
          declaring expertise tags, so untouched tool pages are unchanged. */}
      {content.expertiseTags && content.expertiseTags.length > 0 && (
        <AuthorBioBox className="max-w-3xl" tags={content.expertiseTags} />
      )}
    </div>
  );
}
