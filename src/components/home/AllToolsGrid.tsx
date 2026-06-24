import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard";
import CalculatorCard from "@/components/CalculatorCard";
import IulComparisonCard from "@/components/IulComparisonCard";
import OptionLeoCard from "@/components/OptionLeoCard";
import Icon, { type IconName } from "@/components/Icon";
import { liveTools, type ToolGroup } from "@/lib/tools";
import { calculators, getCalculator } from "@/lib/calculators";

/**
 * "Who are you?" persona entry points, surfaced below the US Investing section.
 * Each routes a visitor straight to the hub/tool that matches their situation.
 */
const personas: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  accent: string;
}[] = [
  {
    title: "Just moved to the US?",
    description: "Banking, driving, housing — start here",
    href: "/topics/new-to-usa",
    icon: "plane-arrival",
    accent: "from-sky-500 to-blue-600",
  },
  {
    title: "On H-1B and waiting for your green card?",
    description: "See your wait time, visa bulletin, and salary data",
    href: "/tools/green-card-tracker",
    icon: "id-badge",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    title: "Managing India money from the US?",
    description: "Property sale tax, FBAR, repatriation calculators",
    href: "/india-tax-compliance",
    icon: "chart-arrows",
    accent: "from-rose-500 to-pink-600",
  },
  {
    title: "Moving back to India?",
    description: "401(k) cashout, RNOR status, currency timing",
    href: "/calculators/401k-return-to-india",
    icon: "home-move",
    accent: "from-amber-500 to-orange-600",
  },
];

/**
 * Home-page tool catalog, rendered as the SAME categorized sections used on the
 * /tools hub — Visa & Green Card and Travel & Documents tool groups, Cross-border
 * calculators, and US Investing — reusing the shared ToolCard / CalculatorCard so
 * the two surfaces stay visually identical. A "Browse all tools →" link sends
 * people to the full /tools hub.
 */

const HOME_GROUPS: ToolGroup[] = ["Visa & Green Card", "Travel & Documents"];

/** Backdoor Roth headlines the home "US Investing" teaser; IUL renders beside it. */
const backdoorRoth = getCalculator("backdoor-roth-eligibility");

export default function AllToolsGrid() {
  return (
    <section aria-label="Tools" className="mt-10 space-y-8">
      <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
        Your tools are free. Always.
      </p>
      {HOME_GROUPS.map((group) => {
        const items = liveTools.filter((t) => t.group === group);
        if (!items.length) return null;
        return (
          <div key={group}>
            <h2 className="text-lg font-bold tracking-tight text-ink-900">
              {group}
            </h2>
            <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        );
      })}

      <div>
        <h2 className="text-lg font-bold tracking-tight text-ink-900">
          Cross-border calculators
        </h2>
        <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {calculators
            .filter((c) => c.slug !== "backdoor-roth-eligibility")
            .map((c) => (
              <CalculatorCard key={c.slug} calc={c} />
            ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold tracking-tight text-ink-900">
          US Investing
        </h2>
        <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {backdoorRoth && <CalculatorCard calc={backdoorRoth} />}
          <IulComparisonCard />
          <OptionLeoCard />
        </div>
      </div>

      {/* Persona entry cards — 2×2 grid mirroring the hub sub-tool cards. */}
      <div className="grid items-stretch gap-3 sm:grid-cols-2">
        {personas.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-white shadow-sm`}
              >
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                {p.title}
              </h2>
            </div>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-500">
              {p.description}
            </p>
            <span className="mt-2.5 text-xs font-semibold text-brand-600">
              Start{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div>
        <Link
          href="/tools"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Browse all tools <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
