import Link from "next/link";
import Container from "@/components/Container";
import ToolAnalytics from "@/components/tools/ToolAnalytics";
import RecommendedToolsAd from "@/components/RecommendedToolsAd";
import { categoryForToolSlug } from "@/lib/recommendedToolsConfig";
import BottomDisclaimer, {
  FULL_DISCLAIMER_ID,
} from "@/components/tools/BottomDisclaimer";

export interface Crumb {
  label: string;
  href?: string;
}

export const DEFAULT_BADGES = [
  "60-second check",
  "No signup",
  "No personal data",
  "Instant result",
];

/**
 * Mobile-first layout for every tool / calculator / tracker page.
 *
 * Mobile order (above the fold): compact breadcrumb → small icon + H1 →
 * pain-point hook → promise badges → one-line top disclaimer (links to the
 * full disclaimer below) → the tool itself. Long SEO copy, FAQs, related
 * guides and the full disclaimer live below the tool, never above it.
 *
 * The header is deliberately short (no tall gradient hero) so the first input
 * is visible at 390px with little or no scrolling.
 */
export default function ToolFirstLayout({
  toolSlug,
  breadcrumb,
  icon,
  category,
  title,
  hook,
  badges = DEFAULT_BADGES,
  accent = "from-brand-600 to-indigo-600",
  sourceNote,
  headerExtra,
  topDisclaimer,
  disclaimerIntro,
  disclaimerPoints,
  disclaimerExtra,
  disclaimerDefaultOpen,
  density = "compact",
  hideSourceNoteOnMobile = false,
  children,
}: {
  toolSlug: string;
  breadcrumb: Crumb[];
  icon: string;
  category: string;
  title: string;
  hook?: string;
  badges?: string[];
  accent?: string;
  /** Compact "last updated / verify" note shown under the header. */
  sourceNote?: React.ReactNode;
  /** Optional small links/CTAs under the badges (kept compact). */
  headerExtra?: React.ReactNode;
  /**
   * Override the one-line header disclaimer text (before the "Full disclaimer
   * below" link). Use for non-immigration tools so it does not say
   * "immigration". Defaults to the generic estimate line.
   */
  topDisclaimer?: React.ReactNode;
  disclaimerIntro?: React.ReactNode;
  /** Override the disclaimer bullet list (e.g. tax-only tools). */
  disclaimerPoints?: string[];
  disclaimerExtra?: React.ReactNode;
  disclaimerDefaultOpen?: boolean;
  /**
   * "compact" (the default since the 2026-08 fold rebuild) trims the mobile
   * header so a tool's first input clears the fold on a 375x667 phone: the
   * hook clamps to two lines, the vertical padding tightens, and the promise
   * badges are hidden below `sm` — but ONLY the generic marketing set. 85
   * pages override `badges` with verified facts ("FBAR $10,000", "Fee
   * $2,965", "Govt fee $275"); those are content, not chrome, and are always
   * shown. Desktop is unchanged either way.
   *
   * Pass "default" to restore the taller header on a page that needs it.
   */
  density?: "default" | "compact";
  /**
   * Hide the source note below `sm`. Only safe where the same provenance line
   * is repeated beneath the tool — /calculators/[slug] does this, most pages
   * do not, so it is opt-in rather than part of `compact`.
   */
  hideSourceNoteOnMobile?: boolean;
  children: React.ReactNode;
}) {
  const compact = density === "compact";
  // Identity check against the module constant: true only when the caller did
  // not supply its own badges, i.e. they are the generic marketing set.
  const badgesAreGeneric = badges === DEFAULT_BADGES;
  return (
    <>
      <ToolAnalytics toolSlug={toolSlug} />

      {/* Compact mobile-first header */}
      <header className="border-b border-ink-900/5 bg-white">
        <Container
          className={`sm:pt-6 sm:pb-6 ${compact ? "pt-3 pb-3" : "pt-4 pb-5"}`}
        >
          <nav
            aria-label="Breadcrumb"
            className="flex flex-nowrap items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-ink-400 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {breadcrumb.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink-600">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink-600">{c.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="mt-3 flex items-start gap-3">
            <span
              aria-hidden
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-xl text-white shadow-sm`}
            >
              {icon}
            </span>
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-600">
                {category}
              </p>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl">
                {title}
              </h1>
            </div>
          </div>

          {hook && (
            <p
              className={`mt-3 max-w-2xl text-base font-medium leading-snug text-ink-700 ${
                compact ? "line-clamp-2 sm:line-clamp-none" : ""
              }`}
            >
              {hook}
            </p>
          )}

          {badges.length > 0 && (
            <ul
              className={`mt-3 flex-wrap gap-1.5 sm:flex ${
                compact && badgesAreGeneric ? "hidden" : "flex"
              }`}
            >
              {badges.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center rounded-full border border-ink-900/10 bg-slate-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-600"
                >
                  {b}
                </li>
              ))}
            </ul>
          )}

          {headerExtra && <div className="mt-3">{headerExtra}</div>}

          <p
            className={`text-xs leading-relaxed text-ink-400 ${
              compact ? "mt-3" : "mt-4"
            }`}
          >
            {topDisclaimer ?? (
              <>Educational estimate only. Not legal, tax, immigration, or financial advice.</>
            )}{" "}
            <a
              href={`#${FULL_DISCLAIMER_ID}`}
              className="font-medium text-brand-600 underline underline-offset-2"
            >
              Full disclaimer below
            </a>
            .
          </p>

          {sourceNote && (
            <p
              className={`mt-2 text-xs text-ink-400 sm:block ${
                hideSourceNoteOnMobile ? "hidden" : ""
              }`}
            >
              {sourceNote}
            </p>
          )}
        </Container>
      </header>

      {/* Tool + below-the-fold content */}
      {children}

      {/* Contextual partner tools — renders nothing on immigration-only /
          generic tools with no finance context. */}
      <RecommendedToolsAd
        category={categoryForToolSlug(toolSlug, title)}
        text={`${toolSlug} ${title} ${category}`}
        sourcePage={toolSlug}
      />

      {/* Full disclaimer, after everything else */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <BottomDisclaimer
            intro={disclaimerIntro}
            points={disclaimerPoints}
            defaultOpen={disclaimerDefaultOpen}
          >
            {disclaimerExtra}
          </BottomDisclaimer>
        </Container>
      </section>
    </>
  );
}
