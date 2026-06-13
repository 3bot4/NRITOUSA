import Link from "next/link";
import { homeTools } from "@/lib/homeTools";
import { accent } from "@/lib/accents";

/**
 * All tools, rendered as compact cards directly under the hero CTA. The list is
 * driven entirely by src/lib/homeTools.ts (a merge of tools.ts + calculators.ts),
 * so adding a new tool to either source surfaces it here automatically.
 */
export default function AllToolsGrid() {
  return (
    <section aria-labelledby="all-tools-h">
      <h2
        id="all-tools-h"
        className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500"
      >
        All tools
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {homeTools.map((t) => {
          const a = accent(t.cat);
          return (
            <Link
              key={t.href}
              href={t.href}
              className="group flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${a.softBg}`}
                aria-hidden
              >
                {t.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                  {t.label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-ink-500">
                  {t.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
