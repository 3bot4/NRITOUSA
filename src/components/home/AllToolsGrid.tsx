import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard";
import CalculatorCard from "@/components/CalculatorCard";
import IulComparisonCard from "@/components/IulComparisonCard";
import { liveTools, type ToolGroup } from "@/lib/tools";
import { calculators, getCalculator } from "@/lib/calculators";

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
        </div>
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
