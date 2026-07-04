import Link from "next/link";
import ToolFaq from "@/components/tools/ToolFaq";
import type { EducationContent } from "@/lib/educationContent";

/**
 * Static SEO context that wraps the interactive education tools
 * (college rankings, GPA, tuition). `EduIntro` renders above the tool
 * (quick answer, who it's for, key inputs, why it matters for immigrant/NRI
 * families); `EduDeepDive` renders below (how to use the result, explainer,
 * optional comparison table, step-by-step, common mistakes, worked example,
 * internal links, FAQ). Content comes from lib/educationContent so the pages
 * stay data-driven and consistent. Wording avoids admissions/financial
 * guarantees.
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

export function EduIntro({ content }: { content: EducationContent }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Quick answer */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 shadow-card sm:p-6">
        <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-brand-700">
          Quick answer
        </span>
        <p className="mt-3 text-sm leading-relaxed text-ink-800">{content.quickAnswer}</p>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Who this page is for
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-700">{content.audience}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Why it matters for immigrant &amp; NRI families
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-700">{content.whyMatters}</dd>
          </div>
        </dl>
      </div>

      {/* Key inputs */}
      <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">
          What you&apos;ll need for the tool
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
    </div>
  );
}

export function EduDeepDive({ content }: { content: EducationContent }) {
  return (
    <div className="space-y-12 sm:space-y-14">
      {/* How to use the result */}
      <SectionCard eyebrow="After the tool" title="How to use your result">
        <p>{content.resultMeaning}</p>
      </SectionCard>

      {/* Explainer */}
      {content.explain && (
        <SectionCard title={content.explain.heading}>
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

      {/* Step-by-step */}
      <SectionCard title="Step-by-step">
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

      {/* FAQ */}
      <ToolFaq items={content.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
    </div>
  );
}
