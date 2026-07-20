import Link from "next/link";
import EstimatedTimelineTable from "@/components/EstimatedTimelineTable";
import ToolFaq from "@/components/tools/ToolFaq";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import type { CalculatorContent } from "@/lib/calculatorContent";

/**
 * Static SEO context that wraps the interactive calculator on the
 * /calculators/[slug] hub pages. `CalculatorIntro` renders above the tool
 * (quick answer, who it's for, key inputs, decision window, estimate
 * disclaimer); `CalculatorDeepDive` renders below it (options, what the
 * result means, tax consequences, process, mistakes, worked example,
 * optional timeline/table, internal links, FAQ). Content comes from
 * lib/calculatorContent so the shared route stays data-driven.
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

export function CalculatorIntro({
  content,
  quickSummary,
  audience,
}: {
  content: CalculatorContent;
  quickSummary: string;
  audience: string;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Byline row — only on hubs rebuilt to the answer-first template. */}
      {content.updated && <ReviewedByline date={content.updated} />}

      {/* Quick answer */}
      <div
        className={`rounded-2xl border p-5 shadow-card sm:p-6 ${
          content.updated
            ? "border-emerald-300 bg-emerald-50/70"
            : "border-brand-200 bg-brand-50/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide ${
              content.updated ? "text-emerald-700" : "text-brand-700"
            }`}
          >
            {content.updated ? "Quick Answer" : "Quick answer"}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-800">
          {content.quickAnswer ?? quickSummary}
        </p>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Who this is for
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-700">{audience}</dd>
          </div>
          {content.decisionWindow && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Timeline / decision window
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-700">
                {content.decisionWindow}
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
                <span aria-hidden className="mt-0.5 text-brand-500">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key inputs */}
      <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">
          What you&apos;ll need for the calculator
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
        <p className="mt-4 text-xs leading-relaxed text-ink-400">
          Numbers shown are estimates. Tax rates, fees, thresholds, and treaty
          rules change and depend on your visa status, state, and individual
          circumstances — verify with a qualified professional before acting.
        </p>
      </div>
    </div>
  );
}

export function CalculatorDeepDive({ content }: { content: CalculatorContent }) {
  return (
    <div className="space-y-12 sm:space-y-14">
      {/* How this calculation works — formula, inputs, assumptions */}
      {content.howItWorks && (
        <SectionCard eyebrow="Behind the calculator" title={content.howItWorks.heading}>
          <p>{content.howItWorks.body}</p>
        </SectionCard>
      )}

      {/* What the result means */}
      <SectionCard eyebrow="After the calculator" title="What your result means">
        <p>{content.resultMeaning}</p>
      </SectionCard>

      {/* Options / explainer */}
      {content.options && (
        <SectionCard title={content.options.heading}>
          <div className="space-y-3">
            {content.options.items.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-card"
              >
                <p className="text-sm font-bold text-ink-900">{item.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Comparison table */}
      {content.table && (
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
            {content.table.caption ?? "Comparison"}
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                  {content.table.headers.map((h) => (
                    <th key={h} className="p-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 bg-white">
                {content.table.rows.map((row) => (
                  <tr key={row[0]} className="align-top">
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={
                          i === 0
                            ? "p-3 font-semibold text-ink-900"
                            : "p-3 text-ink-600"
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
      )}

      {/* Tax consequences */}
      <SectionCard title="Tax consequences">
        <div className="space-y-3">
          {content.taxConsequences.map((item) => (
            <div key={item.label} className="rounded-xl border border-ink-900/10 bg-white p-4">
              <p className="text-sm font-bold text-ink-900">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Step-by-step process */}
      <SectionCard title="Step-by-step process">
        <ol className="space-y-3">
          {content.steps.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed text-ink-700">{step}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Common mistakes */}
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

      {/* Example scenario */}
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card sm:p-6">
          <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-amber-700">
            Example scenario
          </p>
          <h2 className="mt-1 text-lg font-bold text-ink-900">{content.example.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{content.example.body}</p>
        </div>
      </div>

      {/* Timeline */}
      {content.timeline && (
        <EstimatedTimelineTable
          title={content.timeline.title}
          intro={content.timeline.intro}
          rows={content.timeline.rows}
        />
      )}

      {/* Related links */}
      <SectionCard title="Related tools & guides">
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

      {/* How this connects to adjacent processes */}
      {content.connects && (
        <SectionCard eyebrow="In context" title={content.connects.heading}>
          <p>{content.connects.body}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {content.connects.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:border-brand-300"
                >
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* FAQ */}
      <ToolFaq items={content.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />

      {/* Author bio + editorial disclosure */}
      {content.expertiseTags && content.expertiseTags.length > 0 && (
        <AuthorBioBox className="max-w-3xl" tags={content.expertiseTags} />
      )}
    </div>
  );
}
