import Link from "next/link";

/**
 * A single link (or plain note) inside a hub group. When `href` is present the
 * item renders as a crawlable <a> (via next/link); otherwise it renders as a
 * static note — used for timeline/deadline facts that aren't their own page.
 */
export interface HubLink {
  label: string;
  href?: string;
  desc?: string;
}

export interface HubLinkGroup {
  title: string;
  /** Optional one-line description under the group title. */
  description?: string;
  links: HubLink[];
}

/**
 * Grouped internal-link sections for hub pages. Renders each group as a card
 * with a heading and a list of links/notes. Every navigable item is a real
 * <a href> so it is crawlable without JavaScript. Intentionally plain so it can
 * be dropped into any hub (FBAR/FATCA center, Immigration, Tax, Wealth).
 */
export default function HubLinkGroups({
  groups,
  columns = 3,
}: {
  groups: HubLinkGroup[];
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-5 ${cols}`}>
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900">
            {group.title}
          </h3>
          {group.description && (
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              {group.description}
            </p>
          )}
          <ul className="mt-3 space-y-2.5">
            {group.links.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <Link
                    href={link.href}
                    className="group block font-medium text-brand-600 transition hover:text-brand-700"
                  >
                    <span className="text-sm">
                      {link.label}{" "}
                      <span
                        aria-hidden
                        className="inline-block transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </span>
                    {link.desc && (
                      <span className="mt-0.5 block text-xs font-normal leading-relaxed text-ink-500">
                        {link.desc}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div>
                    <span className="text-sm font-semibold text-ink-800">
                      {link.label}
                    </span>
                    {link.desc && (
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                        {link.desc}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
