/**
 * Category accent system for the SaaS-style product surfaces.
 *
 * Four disciplined categories, each a flat accent color (saffron / emerald /
 * violet / slate) — deliberately NOT indigo→purple gradients. Classes are
 * written as full literal strings so Tailwind's content scanner keeps them.
 * Tokens are also defined in tailwind.config.ts under `colors.cat`.
 */

export type CategoryKey = "visa" | "money" | "travel" | "docs";

export interface Accent {
  key: CategoryKey;
  label: string;
  /** Solid text color (icons, links). */
  text: string;
  /** Soft tinted background (icon tiles, badges). */
  softBg: string;
  /** Thin top-border accent for cards. */
  topBorder: string;
  /** Badge (soft bg + text). */
  badge: string;
  /** Small dot / bullet. */
  dot: string;
  /** Ring used on hover borders. */
  hoverBorder: string;
}

export const ACCENTS: Record<CategoryKey, Accent> = {
  visa: {
    key: "visa",
    label: "Visa & Green Card",
    text: "text-cat-visa",
    softBg: "bg-cat-visa-soft",
    topBorder: "border-t-cat-visa",
    badge: "bg-cat-visa-soft text-cat-visa",
    dot: "bg-cat-visa",
    hoverBorder: "hover:border-cat-visa/40",
  },
  money: {
    key: "money",
    label: "Money & Tax",
    text: "text-cat-money",
    softBg: "bg-cat-money-soft",
    topBorder: "border-t-cat-money",
    badge: "bg-cat-money-soft text-cat-money",
    dot: "bg-cat-money",
    hoverBorder: "hover:border-cat-money/40",
  },
  travel: {
    key: "travel",
    label: "Travel & Passport",
    text: "text-cat-travel",
    softBg: "bg-cat-travel-soft",
    topBorder: "border-t-cat-travel",
    badge: "bg-cat-travel-soft text-cat-travel",
    dot: "bg-cat-travel",
    hoverBorder: "hover:border-cat-travel/40",
  },
  docs: {
    key: "docs",
    label: "Documents & Process",
    text: "text-cat-docs",
    softBg: "bg-cat-docs-soft",
    topBorder: "border-t-cat-docs",
    badge: "bg-cat-docs-soft text-cat-docs",
    dot: "bg-cat-docs",
    hoverBorder: "hover:border-cat-docs/40",
  },
};

export const accent = (k: CategoryKey): Accent => ACCENTS[k];
