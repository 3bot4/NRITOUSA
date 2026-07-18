"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Internal link that fires a GA4 event on click. Only the event name, tool
 * slug, and destination path are sent — never user data.
 */
export default function TrackedLink({
  href,
  eventName,
  toolSlug,
  className,
  children,
}: {
  href: string;
  eventName: string;
  toolSlug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent(eventName, { tool_slug: toolSlug, destination: href })}
    >
      {children}
    </Link>
  );
}
