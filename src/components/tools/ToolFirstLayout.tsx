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
  disclaimerIntro,
  disclaimerExtra,
  disclaimerDefaultOpen,
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
  disclaimerIntro?: React.ReactNode;
  disclaimerExtra?: React.ReactNode;
  disclaimerDefaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <ToolAnalytics toolSlug={toolSlug} />

      {/* Compact mobile-first header */}
      <header className="border-b border-ink-900/5 bg-white">
        <Container className="pt-4 pb-5 sm:pt-6 sm:pb-6">
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
            <p className="mt-3 max-w-2xl text-base font-medium leading-snug text-ink-700">
              {hook}
            </p>
          )}

          {badges.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
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

          <p className="mt-4 text-xs leading-relaxed text-ink-400">
            Educational estimate only. Not legal, tax, immigration, or financial
            advice.{" "}
            <a
              href={`#${FULL_DISCLAIMER_ID}`}
              className="font-medium text-brand-600 underline underline-offset-2"
            >
              Full disclaimer below
            </a>
            .
          </p>

          {sourceNote && (
            <p className="mt-2 text-xs text-ink-400">{sourceNote}</p>
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
            defaultOpen={disclaimerDefaultOpen}
          >
            {disclaimerExtra}
          </BottomDisclaimer>
        </Container>
      </section>
    </>
  );
}
