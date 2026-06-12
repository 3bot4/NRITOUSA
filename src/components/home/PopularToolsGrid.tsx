import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import { accent, type CategoryKey } from "@/lib/accents";

/**
 * 2×2 grid of the four most-used tools, for the data-dense main column. Ordered
 * by the same traffic/value ranking used in the full Tools hub (see TopTools).
 */
interface Entry {
  name: string;
  benefit: string;
  href: string;
  cat: CategoryKey;
  icon: IconName;
}

const entries: Entry[] = [
  {
    name: "Green Card Tracker",
    benefit: "Your EB priority-date wait, estimated honestly",
    href: "/tools/green-card-tracker",
    cat: "visa",
    icon: "calendar",
  },
  {
    name: "H-1B Salaries",
    benefit: "Real median pay by title, city & wage level",
    href: "/tools/h1b-salaries",
    cat: "money",
    icon: "briefcase",
  },
  {
    name: "Remittance & TCS Cost",
    benefit: "True cost of sending money to India",
    href: "/calculators/remittance-tcs-cost",
    cat: "money",
    icon: "send",
  },
  {
    name: "Citizenship Checklist",
    benefit: "Earliest N-400 date + which civics test applies",
    href: "/tools/citizenship-checklist",
    cat: "visa",
    icon: "flag",
  },
];

export default function PopularToolsGrid() {
  return (
    <section aria-labelledby="popular-tools-h" className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2
          id="popular-tools-h"
          className="text-sm font-bold uppercase tracking-wide text-ink-500"
        >
          Popular tools
        </h2>
        <Link
          href="/tools"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          All tools →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((t) => {
          const a = accent(t.cat);
          return (
            <Link
              key={t.name}
              href={t.href}
              className={`group flex items-start gap-3 rounded-2xl border border-t-2 border-ink-900/5 ${a.topBorder} bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.softBg} ${a.text}`}
              >
                <Icon name={t.icon} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                  {t.name}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                  {t.benefit}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
