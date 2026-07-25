/**
 * Consent-management config — single source of truth for whether a real,
 * Google-certified CMP is wired in.
 *
 * Kept `null`/`false` on purpose: this repo does not ship a homemade cookie
 * banner that claims to satisfy Google's personalized-ads consent
 * requirements. Set `cmpProvider` once a certified CMP (via AdSense ->
 * Privacy & messaging -> European regulations, or an equivalent
 * Google-certified vendor) is actually integrated — see
 * MONETIZATION_SETUP.md for the exact steps. Until then, `cmpActive` stays
 * false and the footer's "Privacy choices" link stays hidden (see
 * src/components/PrivacyChoicesLink.tsx) rather than pointing at a dead
 * action.
 */
export const cmpProvider: string | null = null;

export const cmpActive = Boolean(cmpProvider);

/**
 * Reopens the active CMP's preference center. No-op until `cmpProvider` is
 * set — the real integration will call the CMP SDK's preference-center
 * trigger here.
 */
export function openPrivacyChoices(): void {
  if (!cmpActive) return;
}
