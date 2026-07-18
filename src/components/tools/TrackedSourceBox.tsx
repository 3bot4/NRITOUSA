"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * Client variant of OfficialSourceBox that fires a GA4 event when an official
 * source link is clicked (e.g. customs_source_clicked / official_tax_source_clicked).
 *
 * PRIVACY: only the event name, the link label, its destination host, and the
 * tool slug are sent — never any user-entered value.
 */
export default function TrackedSourceBox({
  title = "Official sources",
  intro = "Always verify current rules directly with the official sources:",
  links,
  eventName,
  toolSlug,
}: {
  title?: string;
  intro?: string;
  links: { label: string; href: string }[];
  /** GA4 event fired on any source-link click. */
  eventName: string;
  toolSlug: string;
}) {
  const onClick = (label: string, href: string) => {
    let host = "";
    try {
      host = new URL(href).hostname;
    } catch {
      /* relative link */
    }
    trackEvent(eventName, { tool_slug: toolSlug, source_label: label, source_host: host });
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-card">
      <h2 className="text-base font-bold text-ink-900">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-600">{intro}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onClick(l.label, l.href)}
              className="flex items-center gap-1.5 rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            >
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
