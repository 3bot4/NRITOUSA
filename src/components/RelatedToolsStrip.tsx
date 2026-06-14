import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import {
  relatedClusterTools,
  TAX_COMPLIANCE_PATH,
  TAX_COMPLIANCE_TITLE,
} from "@/lib/taxCompliance";

/**
 * "Related tax & compliance tools" strip for the foot of every calculator and
 * finance tool page. Shows up to four sibling calculators/tools from the
 * tax-compliance cluster (excluding the current page) plus a card linking to
 * the India Tax & Compliance hub — always five anchors, none of which can 404
 * (every item is generated from the live tools/calculators registries).
 */
export default function RelatedToolsStrip({
  currentHref,
}: {
  currentHref: string;
}) {
  const siblings = relatedClusterTools(currentHref).slice(0, 4);
  if (siblings.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-h">
      <SectionHeading
        eyebrow="Plan the whole picture"
        title="Related tax & compliance tools"
        action={{ label: "See the full hub", href: TAX_COMPLIANCE_PATH }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {siblings.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${t.accent} text-xl shadow-sm`}
              aria-hidden
            >
              {t.icon}
            </span>
            <span className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
              {t.kind === "calculator" ? "Calculator" : "Tool"}
            </span>
            <h3 className="mt-1 text-sm font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
              {t.label}
            </h3>
            <span className="mt-3 text-xs font-semibold text-brand-600">
              Open{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}

        {/* Hub anchor — the fifth card, always present. */}
        <Link
          href={TAX_COMPLIANCE_PATH}
          className="group flex flex-col justify-between rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
        >
          <div>
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-xl shadow-sm"
              aria-hidden
            >
              🧾
            </span>
            <span className="mt-3 block text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-500">
              Hub
            </span>
            <h3 className="mt-1 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
              {TAX_COMPLIANCE_TITLE}
            </h3>
          </div>
          <span className="mt-3 text-xs font-semibold text-brand-600">
            All calculators, tools & tax topics{" "}
            <span className="inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
