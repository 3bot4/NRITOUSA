"use client";

import Container from "@/components/Container";
import { trackRecommendedToolClick } from "@/lib/analytics";
import {
  RECOMMENDED_TOOLS,
  buildToolUrl,
  resolveRecommendedTools,
  type PageCategory,
  type RecommendedTool,
  type ToolKey,
} from "@/lib/recommendedToolsConfig";

/**
 * Contextual "Recommended Tool" cards shown near the bottom of relevant pages
 * (after the main content, before the footer).
 *
 * These are clearly-labelled house-style cards for NRItoUSA's sibling
 * financial-tool sites — not banner ads, never popups. Which card shows where
 * is decided in lib/recommendedToolsConfig; this component only renders and
 * tracks. Renders nothing when no tool is relevant to the page.
 *
 * Outbound links open in a new tab with rel="noopener noreferrer sponsored"
 * and UTM tracking. Clicks fire a GA4 `recommended_tool_click` event that
 * safely no-ops when analytics is unavailable.
 */
export interface RecommendedToolsAdProps {
  /** Explicit page category; omit to auto-detect from `text`. */
  category?: PageCategory;
  /** Pre-resolved tool keys (overrides category/text resolution). */
  tools?: ToolKey[];
  /** Free text (slug + title + excerpt) used for auto-detection. */
  text?: string;
  /** Coarse, non-identifying source slug/path for UTM + tracking. */
  sourcePage?: string;
  variant?: "single" | "grid" | "compact";
  /** Optional heading override. Defaults to a topic heading when >1 card. */
  heading?: string;
  className?: string;
}

function Card({
  tool,
  sourcePage,
  sourceCategory,
  compact,
}: {
  tool: RecommendedTool;
  sourcePage: string;
  sourceCategory: string;
  compact: boolean;
}) {
  const href = buildToolUrl(tool.key, sourcePage);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() =>
        trackRecommendedToolClick({
          tool_name: tool.name,
          source_page: sourcePage,
          source_category: sourceCategory,
          destination_url: href,
        })
      }
      className={`group flex flex-col rounded-2xl border ${tool.theme.card} p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${tool.theme.iconTile} text-lg text-white shadow-sm`}
        >
          {tool.icon}
        </span>
        <span
          className={`text-[0.625rem] font-semibold uppercase tracking-wider ${tool.theme.label}`}
        >
          {tool.label}
        </span>
      </div>

      <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-ink-900">
        {tool.title}
      </h3>
      {!compact && (
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-600">
          {tool.description}
        </p>
      )}

      <span
        className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${tool.theme.button}`}
      >
        {tool.cta}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </a>
  );
}

export default function RecommendedToolsAd({
  category,
  tools,
  text,
  sourcePage = "site",
  variant,
  heading,
  className,
}: RecommendedToolsAdProps) {
  const keys = tools ?? resolveRecommendedTools({ category, text });
  if (keys.length === 0) return null;

  const sourceCategory = category ?? "auto";
  const multiple = keys.length > 1;
  const resolvedVariant = variant ?? (multiple ? "grid" : "single");
  const compact = resolvedVariant === "compact";
  const showHeading = heading ?? (multiple ? "Helpful tools for this topic" : null);

  return (
    <section
      className={`border-t border-ink-900/5 bg-slate-50/60 py-10 sm:py-12 ${className ?? ""}`}
      aria-label="Recommended NRI tools"
    >
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
            Recommended NRI tool{multiple ? "s" : ""}
          </p>
          {showHeading && (
            <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              {showHeading}
            </h2>
          )}

          <div
            className={`mt-4 grid gap-4 ${
              multiple && !compact ? "sm:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {keys.map((key) => (
              <Card
                key={key}
                tool={RECOMMENDED_TOOLS[key]}
                sourcePage={sourcePage}
                sourceCategory={sourceCategory}
                compact={compact}
              />
            ))}
          </div>

          <p className="mt-3 text-[0.6875rem] leading-relaxed text-ink-400">
            Built by our related financial-tools network. External educational
            tools — not affiliated advice. Verify details on each site.
          </p>
        </div>
      </Container>
    </section>
  );
}
