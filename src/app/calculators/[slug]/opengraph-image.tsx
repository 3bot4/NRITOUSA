import { ImageResponse } from "next/og";
import { getCalculator } from "@/lib/calculators";
import { getCalculatorOgCard } from "@/lib/calculatorOgCards";

export const alt = "NRI to USA calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card for /calculators/[slug].
 *
 * Rendered on-demand — deliberately NO generateStaticParams, matching
 * articles/[slug]/opengraph-image.tsx. Pre-rendering ImageResponse routes has
 * previously stalled this repo's build while collecting page data (see
 * CLAUDE.md); on-demand rendering keeps the build fast and Next caches the
 * result after the first request.
 *
 * A calculator can supply a headline figure via calculatorOgCards; anything
 * without one falls back to its title alone.
 */
export default function Image({ params }: { params: { slug: string } }) {
  const calc = getCalculator(params.slug);
  const card = getCalculatorOgCard(params.slug);

  const headline = card?.headline ?? calc?.label ?? "NRI to USA";
  const subline = card?.subline ?? calc?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0b1120 0%, #1b298f 55%, #1e40f5 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "56px",
              width: "56px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.15)",
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700 }}>NRI to USA</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: headline.length > 44 ? "50px" : "58px",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "1010px",
            }}
          >
            {headline}
          </div>

          {card?.figure && (
            <div style={{ display: "flex", alignItems: "baseline", gap: "18px" }}>
              <div
                style={{
                  fontSize: "116px",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-2px",
                }}
              >
                {card.figure}
              </div>
              {card.figureNote && (
                <div
                  style={{
                    fontSize: "24px",
                    color: "rgba(255,255,255,0.75)",
                    paddingBottom: "10px",
                  }}
                >
                  {card.figureNote}
                </div>
              )}
            </div>
          )}

          {subline && (
            <div
              style={{
                fontSize: "30px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.88)",
                maxWidth: "1010px",
              }}
            >
              {subline}
            </div>
          )}
        </div>

        <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.8)" }}>
          www.nritousa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
