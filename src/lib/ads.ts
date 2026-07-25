/**
 * AdSense / ad-placement config — single source of truth for whether ads are
 * enabled and where they must never appear.
 *
 * Mirrors the gaEnabled/clarityEnabled pattern in src/lib/gtag.ts and
 * src/lib/clarity.ts: dormant unless a client id is configured, and never
 * loaded outside production. Setting NEXT_PUBLIC_ADSENSE_CLIENT is the one
 * switch that turns AdSense on everywhere (AdSenseScript, AdSlot, and the
 * AdSense CSP domains in next.config.mjs all key off it); leaving it unset
 * keeps every ad component a no-op. See MONETIZATION_SETUP.md.
 */
declare global {
  interface Window {
    /** Queue the AdSense loader script (adsbygoogle.js) reads from. */
    adsbygoogle?: unknown[];
  }
}

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

export const adsEnabled =
  process.env.NODE_ENV === "production" && Boolean(ADSENSE_CLIENT);

/**
 * Routes where an ad must never appear — layoffs, visa/case deadlines, USCIS
 * case-action pages, and FBAR/FATCA/tax-penalty compliance determinations,
 * per the ad-placement policy in MONETIZATION_SETUP.md. This is a seed list
 * from the current route inventory, not an exhaustive one — review and
 * extend it as new high-sensitivity pages are added. Matches the route
 * itself and any of its sub-paths.
 */
export const NO_AD_ROUTES: readonly string[] = [
  // H-1B layoffs / job-loss urgency
  "/h1b-layoff",
  "/tools/h1b-transfer-risk-checklist",
  // Visa deadlines, priority dates, visa bulletin cutoffs
  "/visa-bulletin",
  "/eb2-eb3-priority-date-india",
  "/tools/priority-date-checker",
  // USCIS case-status / urgent-action pages
  "/uscis/case-status",
  "/uscis/receipt-number",
  "/uscis/life-planning",
  "/tools/uscis-case-status-meaning",
  "/tools/uscis-life-decision-checklist",
  "/nvc-case-status",
  "/nvc-document-checklist-india",
  "/immigration-tracker",
  "/tools/green-card-tracker",
  "/i485-documents-checklist",
  // FBAR/FATCA and tax-penalty compliance determinations
  "/tools/fbar-fatca-checker",
  "/tools/form-15ca-15cb-checklist",
  "/tools/nri-tds-refund-checklist",
  // Emergency / return-to-India checklist
  "/return-to-india-checklist",
];

/** True if `pathname` matches a no-ad route or one of its sub-paths. Pure — independent of `adsEnabled`, so it stays testable regardless of environment. */
export function isExcludedRoute(pathname: string): boolean {
  return NO_AD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/** True if `pathname` may show ads: AdSense is configured AND the route isn't excluded. */
export function isAdEligibleRoute(pathname: string): boolean {
  return adsEnabled && !isExcludedRoute(pathname);
}
