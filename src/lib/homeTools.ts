/**
 * Unified home-page tool catalog.
 *
 * The home grid is rendered from this single array. It is built dynamically by
 * merging the two existing data sources:
 *   - live interactive tools  → src/lib/tools.ts        (route: /tools/<slug>)
 *   - cross-border calculators → src/lib/calculators.ts (route: /calculators/<slug>)
 *
 * TO ADD A NEW TOOL TO THE HOME GRID: add it to whichever source it belongs to
 * (tools.ts for a /tools page, calculators.ts for a /calculators page). It will
 * appear on the home page automatically — no changes needed here or in the grid.
 */

import { liveTools, type ToolGroup } from "@/lib/tools";
import { calculators } from "@/lib/calculators";
import type { CategoryKey } from "@/lib/accents";

export interface HomeTool {
  label: string;
  description: string;
  href: string;
  /** Emoji icon, reused from the source catalog. */
  icon: string;
  /** Accent category for the icon tile. */
  cat: CategoryKey;
}

const groupToCat: Record<ToolGroup, CategoryKey> = {
  "Visa & Green Card": "visa",
  "Money & Finance": "money",
  "Travel & Documents": "travel",
};

export const homeTools: HomeTool[] = [
  ...liveTools.map((t) => ({
    label: t.label,
    description: t.description,
    href: `/tools/${t.slug}`,
    icon: t.icon,
    cat: groupToCat[t.group],
  })),
  // Calculators are all money / tax / housing topics → money accent.
  ...calculators.map((c) => ({
    label: c.label,
    description: c.description,
    href: `/calculators/${c.slug}`,
    icon: c.icon,
    cat: "money" as CategoryKey,
  })),
];
