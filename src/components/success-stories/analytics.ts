/**
 * Success Stories analytics event names + typed helpers.
 *
 * These wrap the shared GA4 `trackEvent`. As with the rest of the site, only
 * broad, non-identifying labels are ever sent — a story slug, a subject name
 * (already public on the page), a coarse card position, a CTA location, and a
 * resource name. Never pass an email, entered value, or anything personal.
 *
 * Event catalog (documented for the implementation report):
 *   success_story_card_click          — a story card on the hub was clicked
 *   success_story_filter_used         — a category filter was selected
 *   success_story_guide_cta_click     — a lead-magnet CTA was clicked
 *   success_story_linkedin_click      — the subject's LinkedIn link was clicked
 *   success_story_related_resource_click — a "keep exploring" resource clicked
 *   success_story_share_click         — a share action was used
 */
import { trackEvent } from "@/lib/analytics";

export interface StoryEventProps {
  story_slug?: string;
  subject_name?: string;
  card_position?: number;
  cta_location?: string;
  resource_name?: string;
  category?: string;
}

export const trackStoryCardClick = (p: StoryEventProps) =>
  trackEvent("success_story_card_click", { ...p });

export const trackStoryFilterUsed = (category: string) =>
  trackEvent("success_story_filter_used", { category });

export const trackStoryGuideCtaClick = (p: StoryEventProps) =>
  trackEvent("success_story_guide_cta_click", { ...p });

export const trackStoryLinkedinClick = (p: StoryEventProps) =>
  trackEvent("success_story_linkedin_click", { ...p });

export const trackStoryRelatedResourceClick = (p: StoryEventProps) =>
  trackEvent("success_story_related_resource_click", { ...p });

export const trackStoryShareClick = (p: StoryEventProps) =>
  trackEvent("success_story_share_click", { ...p });
