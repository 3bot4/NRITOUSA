/**
 * A compact box of official USCIS source links. All links open in a new tab
 * with rel="noopener noreferrer nofollow". Used across the Green Card Renewal
 * cluster so users can always reach the authoritative source.
 */
export default function OfficialSourceBox({
  title = "Official USCIS sources",
  intro = "Always verify current rules, fees, forms, and processing times directly with USCIS:",
  links,
}: {
  title?: string;
  intro?: string;
  links: { label: string; href: string }[];
}) {
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
              rel="nofollow noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300"
            >
              {l.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
