import Link from "next/link";

/**
 * Default FTC-compliant affiliate disclosure line. Kept short so it can sit
 * directly next to an affiliate CTA button/card without dominating the layout.
 */
export const AFFILIATE_DISCLOSURE_TEXT =
  "Affiliate disclosure: We may receive compensation if you click or sign up through partner links. This content is educational only and is not personalized legal, tax, immigration, investment, or financial advice.";

/**
 * Small, reusable affiliate disclosure note.
 *
 * Drop this near any affiliate CTA button or partner card so the disclosure
 * appears right where the user acts (FTC "clear and conspicuous" guidance and
 * affiliate-network requirements such as CJ Affiliate).
 *
 * - `text` overrides the default disclosure copy.
 * - `withLink` (default true) links to the full /affiliate-disclosure page.
 * - `className` lets callers tune spacing for their card/CTA layout.
 */
export default function AffiliateDisclosureNote({
  text = AFFILIATE_DISCLOSURE_TEXT,
  withLink = true,
  className = "",
}: {
  text?: string;
  withLink?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-xs leading-relaxed text-ink-400 ${className}`}
      data-affiliate-disclosure
    >
      {text}
      {withLink ? (
        <>
          {" "}
          <Link
            href="/affiliate-disclosure"
            className="text-brand-600 underline hover:text-brand-700"
          >
            Learn more
          </Link>
          .
        </>
      ) : null}
    </p>
  );
}
