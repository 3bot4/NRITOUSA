import Link from "next/link";

/**
 * Lightweight, server-rendered "soft" conversion band for the foot of major
 * cluster hubs, guides, and tool pages. Two low-pressure asks — download the
 * free Immigrant Wealth Guide (lead magnet) and an optional related
 * calculator/checklist — styled to match the site's card system. No client JS.
 *
 * Keep this genuinely helpful: only pass a `related` link that a reader on this
 * page would actually want next. The guide card is always shown.
 */
export default function SoftCta({
  related,
  heading = "Keep planning your move",
}: {
  /** Optional "use this next" link — a related calculator, checklist, or tool. */
  related?: { href: string; label: string; description: string };
  heading?: string;
}) {
  return (
    <section
      aria-labelledby="soft-cta-h"
      className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8"
    >
      <h2
        id="soft-cta-h"
        className="text-lg font-bold tracking-tight text-ink-900"
      >
        {heading}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Lead magnet — always present. */}
        <Link
          href="/free-immigrant-wealth-guide"
          className="group flex flex-col justify-between rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
        >
          <div>
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl shadow-sm"
              aria-hidden
            >
              📘
            </span>
            <span className="mt-3 block text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-500">
              Free download
            </span>
            <h3 className="mt-1 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
              The Immigrant Wealth Guide
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              A free playbook on taxes, money, and building wealth in the US —
              plus occasional NRItoUSA updates. Unsubscribe anytime.
            </p>
          </div>
          <span className="mt-3 text-xs font-semibold text-brand-600">
            Get the guide{" "}
            <span className="inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </Link>

        {/* Related tool / checklist — optional. */}
        {related && (
          <Link
            href={related.href}
            className="group flex flex-col justify-between rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-xl shadow-sm"
                aria-hidden
              >
                🧭
              </span>
              <span className="mt-3 block text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-500">
                Do this next
              </span>
              <h3 className="mt-1 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
                {related.label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                {related.description}
              </p>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600">
              Open{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
