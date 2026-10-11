import Link from "next/link";
import Container from "@/components/Container";
import {
  getLastSiteWideCheck,
  getLatestUpdates,
  type UpdateLabel,
} from "@/lib/latestUpdates";

/**
 * Split row: the evergreen "popular guides" list on the left, the most recent
 * real activity on the right — new pages, content/rule updates, and weekly
 * numbers checks across articles, guides, tools and calculators (see
 * lib/latestUpdates for the honesty rules behind every date shown). Both are plain divided lists rather than
 * cards — this is the dense, scannable half of the homepage, and a long list
 * of exact-match titles is worth more here than six more boxes.
 *
 * Every href below is a real, existing route; the wider by-topic index lives
 * in <GuideDirectory /> directly beneath this section.
 */
const guides: { title: string; href: string }[] = [
  { title: "India Visa from USA — Tourist, Business & Entry Visa", href: "/india-visa-from-usa" },
  { title: "Indian Passport Renewal in the USA (VFS Global)", href: "/indian-passport-renewal-usa" },
  { title: "Visa Bulletin for India, Explained", href: "/visa-bulletin" },
  { title: "H-1B Lottery Results 2026 / 2027", href: "/h1b-lottery-results" },
  { title: "Green Card Process for Indians, Step by Step", href: "/green-card" },
  { title: "PERM Timeline: How Long Labor Certification Takes", href: "/perm-timeline" },
  { title: "I-485 Timeline & Adjustment of Status", href: "/i485-timeline" },
  { title: "OCI Card: Eligibility, Fees & Timeline", href: "/oci" },
  { title: "FBAR for NRE & NRO Accounts", href: "/articles/fbar-nre-nro-accounts" },
  { title: "Moving to USA from India: Checklist", href: "/articles/moving-to-usa-from-india-checklist" },
  { title: "Send Money to India — Cheapest Ways Compared", href: "/send-money-to-india" },
  { title: "Selling Property in India as an NRI: TDS & Repatriation", href: "/nri-selling-property-in-india-tds" },
  { title: "Return to India Checklist for NRIs", href: "/return-to-india-checklist" },
  { title: "Government Benefits for Immigrants in the USA", href: "/usa-government-benefits-immigrants" },
  { title: "Divorce and Your Immigration Status", href: "/divorce-immigration-status" },
  { title: "Indian Population in the USA — By State & City", href: "/indian-population-in-usa" },
];

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();

const LABEL_STYLE: Record<UpdateLabel, string> = {
  New: "bg-brand-50 text-brand-700",
  Updated: "bg-emerald-50 text-emerald-700",
  "Numbers checked": "bg-slate-100 text-ink-600",
};

export default function GuidesAndUpdates() {
  const items = getLatestUpdates(8);
  const lastCheck = getLastSiteWideCheck();

  return (
    <section aria-labelledby="popular-guides-h" className="py-14 sm:py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-brand-600">
              Popular guides
            </span>
            <h2
              id="popular-guides-h"
              className="mb-5 mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
            >
              The answers everyone needs eventually
            </h2>
            <ul>
              {guides.map((g) => (
                <li key={g.href} className="border-b border-ink-900/10 last:border-0">
                  <Link
                    href={g.href}
                    className="flex items-center justify-between gap-4 py-3.5 text-[15px] font-semibold text-ink-900 transition-all hover:pl-2.5 hover:text-brand-600"
                  >
                    {g.title}
                    <span aria-hidden className="flex-none text-ink-400">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {items.length > 0 && (
            <div>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-brand-600">
                Changelog
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                Latest updates and checks
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                We review rules and re-check every number weekly against
                official sources.
              </p>
              {lastCheck && (
                <p className="mt-1 font-mono text-[11px] tracking-wide text-ink-400">
                  Last site-wide check:{" "}
                  <time dateTime={lastCheck}>{fmtDate(lastCheck)}</time>
                </p>
              )}
              <ul className="mt-4">
                {items.map((a) => (
                  <li key={a.path} className="border-b border-ink-900/10 last:border-0">
                    <Link href={a.path} className="group block py-3.5">
                      <span className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${LABEL_STYLE[a.label]}`}
                        >
                          {a.label}
                        </span>
                        <time
                          dateTime={a.date}
                          className="font-mono text-[11px] tracking-wide text-ink-400"
                        >
                          {fmtDate(a.date)}
                        </time>
                      </span>
                      <span className="mt-1 block text-[15px] font-semibold leading-snug text-ink-900 group-hover:text-brand-600">
                        {a.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/education/articles"
                className="mt-5 inline-block border-b border-transparent pb-0.5 text-sm font-semibold text-brand-600 hover:border-brand-600"
              >
                All guides &amp; articles <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
