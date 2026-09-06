/**
 * Per-calculator social-card content for
 * app/calculators/[slug]/opengraph-image.tsx.
 *
 * Only slugs listed here get a bespoke card with a headline figure; every
 * other calculator falls back to its title and description, so adding a
 * calculator never requires touching this file.
 *
 * Numbers come from the cluster data files, never typed in here — a social
 * card that disagrees with the page it links to is worse than a generic one.
 */

import { FX_USDINR } from "@/data/usdInrForecastData";

export interface CalculatorOgCard {
  headline: string;
  /** Large focal number. Kept short — it renders at 116px. */
  figure?: string;
  /** Small note beside the figure (units, as-of date). */
  figureNote?: string;
  subline?: string;
}

/**
 * The rupee sign renders as "Rs" rather than "₹" here on purpose, and this was
 * checked rather than assumed: rendering the card with a literal ₹ produces an
 * empty tofu box, because Satori rasterises it with the runtime's default sans
 * font, which carries no glyph for U+20B9. Supplying a font that has one would
 * mean shipping a font file with the route for a single character. "Rs" is
 * unambiguous and always renders.
 */
const OG_CARDS: Record<string, CalculatorOgCard> = {
  "usd-inr-projection-send-now-or-wait": {
    headline: "USD to INR forecast 2026–2028",
    figure: `Rs ${FX_USDINR.toFixed(2)}`,
    figureNote: "per US dollar",
    subline: "Send money to India now, or wait?",
  },
};

export function getCalculatorOgCard(
  slug: string
): CalculatorOgCard | undefined {
  return OG_CARDS[slug];
}
