import Link from "next/link";
import { site } from "@/lib/site";

export type AffiliateDisclosureVariant =
  | "compact"
  | "standard"
  | "comparison-table";

const DEFAULT_TEXT: Record<AffiliateDisclosureVariant, string> = {
  compact: `Disclosure: ${site.name} may earn compensation when you use certain links on this page, at no additional cost to you. Compensation does not determine our educational analysis or conclusions.`,
  standard:
    "Affiliate disclosure: We may receive compensation if you click or sign up through partner links. This content is educational only and is not personalized legal, tax, immigration, investment, or financial advice.",
  "comparison-table": `Affiliate disclosure: Some providers listed below may compensate ${site.name} if you apply or purchase through our links. We evaluate providers based on their relevance, features, costs, limitations, and suitability for Indian and immigrant families in the United States.`,
};

interface AffiliateDisclosureNoticeProps {
  /**
   * `compact` — next to a single affiliate CTA button or partner card.
   * `standard` — above a block of affiliate recommendations in body copy.
   * `comparison-table` — directly above a provider-comparison table.
   */
  variant?: AffiliateDisclosureVariant;
  /** Overrides the variant's default copy. */
  text?: string;
  /** Links "Affiliate disclosure" to the full /affiliate-disclosure page. Default true. */
  withLink?: boolean;
  className?: string;
}

/**
 * Reusable affiliate disclosure notice.
 *
 * Place this before, or immediately next to, the first compensated
 * recommendation on a page — never rely on the footer disclosure alone,
 * never hide it inside an accordion, and never place it only after all
 * affiliate links have already appeared. See MONETIZATION_SETUP.md for
 * placement guidance per variant.
 */
export default function AffiliateDisclosureNotice({
  variant = "compact",
  text,
  withLink = true,
  className = "",
}: AffiliateDisclosureNoticeProps) {
  const body = text ?? DEFAULT_TEXT[variant];
  const sizeClass = variant === "compact" ? "text-xs" : "text-sm";

  return (
    <p
      className={`${sizeClass} leading-relaxed text-ink-500 ${className}`}
      data-affiliate-disclosure
      data-variant={variant}
    >
      {body}
      {withLink ? (
        <>
          {" "}
          <Link
            href="/affiliate-disclosure"
            className="text-brand-600 underline hover:text-brand-700"
          >
            Affiliate disclosure
          </Link>
          .
        </>
      ) : null}
    </p>
  );
}
