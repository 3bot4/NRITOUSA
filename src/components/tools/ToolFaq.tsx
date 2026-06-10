import type { FaqItem } from "@/lib/seo";

/**
 * Visible FAQ section for tool pages. Pages that render this should also emit
 * faqJsonLd(items) so the FAQPage schema matches on-page content.
 */
export default function ToolFaq({ items }: { items: FaqItem[] }) {
  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight text-ink-900">
        Frequently asked questions
      </h2>
      <div className="mt-6 space-y-3">
        {items.map((f) => (
          <details
            key={f.question}
            className="group rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card open:shadow-card-hover"
          >
            <summary className="cursor-pointer list-none text-base font-semibold text-ink-900 marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {f.question}
                <span
                  aria-hidden
                  className="text-ink-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
