"use client";

import Link from "next/link";
import {
  trackStoryGuideCtaClick,
  trackStoryLinkedinClick,
  trackStoryRelatedResourceClick,
  type StoryEventProps,
} from "./analytics";

/** Internal resource link (e.g. "keep exploring" grid) that reports a click. */
export function TrackedResourceLink({
  href,
  className,
  children,
  event,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  event: StoryEventProps;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackStoryRelatedResourceClick(event)}
    >
      {children}
    </Link>
  );
}

/** Subject's LinkedIn link — external, tracked, safe rel. */
export function TrackedLinkedinLink({
  href,
  className,
  children,
  event,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  event: StoryEventProps;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackStoryLinkedinClick(event)}
    >
      {children}
    </a>
  );
}

/**
 * Lead-magnet CTA that routes to the existing email-gated Free Immigrant Wealth
 * Guide with campaign tracking. We link to the gated page (never a direct PDF)
 * so the existing Brevo email-capture workflow always runs.
 */
export function StoryGuideCta({
  location,
  storySlug,
  subjectName,
  variant = "block",
  label = "Get the Free Immigrant Wealth Guide",
  sublabel,
}: {
  /** utm_content — "mid-article" | "end-article" | other. */
  location: string;
  storySlug: string;
  subjectName: string;
  variant?: "block" | "inline";
  label?: string;
  sublabel?: string;
}) {
  const href =
    "/free-immigrant-wealth-guide?utm_source=success-stories&utm_medium=article" +
    `&utm_campaign=${encodeURIComponent(storySlug + "-story")}` +
    `&utm_content=${encodeURIComponent(location)}`;

  const onClick = () =>
    trackStoryGuideCtaClick({
      story_slug: storySlug,
      subject_name: subjectName,
      cta_location: location,
    });

  if (variant === "inline") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="inline font-semibold text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-card sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
        Free PDF guide
      </p>
      <h3 className="mt-2 text-lg font-bold text-ink-900">{label}</h3>
      {sublabel && (
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{sublabel}</p>
      )}
      <Link
        href={href}
        onClick={onClick}
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        Download the free guide →
      </Link>
    </div>
  );
}
