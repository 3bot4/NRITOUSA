/**
 * Lightweight GA4 event helpers for client components.
 *
 * `gtag` is only defined when GoogleAnalytics has loaded (production builds),
 * so every call here safely no-ops during SSR, local dev, and for users who
 * block analytics.
 *
 * Privacy rule for tools: only ever send broad, non-identifying labels
 * (tool name, coarse result tier). Never send entered amounts, balances,
 * routes typed by the user, or anything personally identifying.
 */

type GtagFn = (...args: unknown[]) => void;

export interface ToolUsedEvent {
  tool_name: string;
  result_type: string;
  category: string;
  page_slug: string;
}

export function trackToolUsed(params: ToolUsedEvent): void {
  trackEvent("tool_used", { ...params });
}

/** Generic GA4 event. Same SSR/dev/blocked-analytics safety as above. */
export function trackEvent(
  event: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", event, params);
}
