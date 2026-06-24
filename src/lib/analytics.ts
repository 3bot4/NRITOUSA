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

/**
 * Mobile-first tool layout events.
 *
 * PRIVACY: every payload below is restricted to non-identifying labels —
 * the tool slug, the route path, a generic step name, and a coarse result
 * status (e.g. "shown" / "match" / "no_match"). Never pass a user-entered
 * value (income, balances, visa dates, receipt/SSN/passport numbers, names,
 * or emails) into these helpers.
 */
export interface ToolEventBase {
  /** Stable tool/calculator slug, e.g. "fbar-fatca-checker". */
  tool_slug: string;
  /** Route path only (no query/hash), e.g. "/tools/fbar-fatca-checker". */
  route?: string;
}

export function trackToolView(p: ToolEventBase): void {
  trackEvent("tool_view", { ...p });
}

export function trackToolFirstInteraction(p: ToolEventBase): void {
  trackEvent("tool_first_interaction", { ...p });
}

export function trackToolResultView(
  p: ToolEventBase & { result_status?: string }
): void {
  trackEvent("tool_result_view", { ...p });
}

export function trackToolStepNext(
  p: ToolEventBase & { step?: string }
): void {
  trackEvent("tool_step_next", { ...p });
}

export function trackToolShareClick(
  p: ToolEventBase & { channel?: string }
): void {
  trackEvent("tool_share_click", { ...p });
}

export function trackToolEmailCaptureView(p: ToolEventBase): void {
  trackEvent("tool_email_capture_view", { ...p });
}

export function trackToolEmailCaptureSubmit(p: ToolEventBase): void {
  trackEvent("tool_email_capture_submit", { ...p });
}

/**
 * Click on a bottom-of-page "Recommended Tool" partner card (TaxSaveIQ /
 * StockLeo / OptionLeo). Non-identifying labels only — the tool name, a coarse
 * source page/category, and the outbound URL.
 */
export interface RecommendedToolClickEvent {
  tool_name: string;
  source_page: string;
  source_category: string;
  destination_url: string;
}

export function trackRecommendedToolClick(
  params: RecommendedToolClickEvent
): void {
  trackEvent("recommended_tool_click", { ...params });
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
