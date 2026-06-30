import Link from "next/link";

/* Cross-sell CTA block: money + status content that an H-1B job-seeker
   researching sponsors most often needs next. Links resolve to existing site
   content. No directive — renders on the server. */

interface CrossSellItem {
  href: string;
  emoji: string;
  title: string;
  blurb: string;
}

const ITEMS: CrossSellItem[] = [
  {
    href: "/articles/nre-nro-accounts-explained",
    emoji: "🏦",
    title: "NRE, NRO & FCNR accounts",
    blurb:
      "Once you're sponsored and earning USD, where should it sit? The NRI account setup — including FCNR deposits — that keeps your money tax-clean across both countries.",
  },
  {
    href: "/h1b-layoff",
    emoji: "🪂",
    title: "Parking a severance check",
    blurb:
      "If a sponsorship doesn't last, your severance is a runway. The H-1B layoff money checklist: what to do with the cash and how long it really buys you.",
  },
  {
    href: "/h1b/layoff-60-day-grace-period",
    emoji: "⏳",
    title: "The 60-day grace period",
    blurb:
      "Lost your H-1B job? You may have up to 60 days — or less — to find a new sponsor or change status. Exactly how the grace-period clock works.",
  },
];

export default function H1bCrossSell() {
  return (
    <div>
      <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
        While you&apos;re weighing sponsors
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        The money and status questions that come right after &ldquo;who
        sponsors my role?&rdquo;
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <span aria-hidden className="text-2xl">
              {item.emoji}
            </span>
            <span className="mt-2 text-sm font-bold text-ink-900 group-hover:text-brand-700">
              {item.title}
            </span>
            <span className="mt-1 text-xs leading-relaxed text-ink-500">
              {item.blurb}
            </span>
            <span className="mt-3 text-xs font-semibold text-brand-600">
              Read more →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
