import { ImageResponse } from "next/og";
import {
  getPublishableStory,
  getContributor,
  contributorInitials,
} from "@/lib/successStories";

export const alt = "NRI Success Story";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GOLD = "#f2b736";
const GREEN = "#34d399";

/**
 * Per-story social card. Uses the subject's initials monogram (never a
 * synthesized face) alongside their name, a short pull-quote, and NRItoUSA
 * branding. Rendered on-demand and cached, so the build stays fast.
 */
export default function Image({ params }: { params: { slug: string } }) {
  const story = getPublishableStory(params.slug);
  const contributor = story ? getContributor(story.subjectSlug) : undefined;

  const name = contributor?.fullName ?? "NRI Success Story";
  const role = contributor?.currentTitle ?? "";
  const initials = contributor ? contributorInitials(contributor) : "NRI";
  const quote =
    story?.pullQuote ?? "Real Indian immigrant journeys from America.";

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
            "linear-gradient(135deg, #0a1638 0%, #122a6b 55%, #0d1f4d 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand + section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "64px",
                width: "64px",
                borderRadius: "18px",
                background: GOLD,
                color: "#0a1638",
                fontSize: "34px",
                fontWeight: 800,
              }}
            >
              N
            </div>
            <div style={{ fontSize: "30px", fontWeight: 700 }}>NRI to USA</div>
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: GREEN,
              letterSpacing: "1px",
            }}
          >
            NRI SUCCESS STORIES
          </div>
        </div>

        {/* Subject + quote */}
        <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "160px",
              width: "160px",
              flexShrink: 0,
              borderRadius: "32px",
              background: "linear-gradient(135deg, #1f2937, #111827)",
              border: `3px solid ${GOLD}`,
              fontSize: "60px",
              fontWeight: 800,
            }}
          >
            {initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.1 }}>
              {name}
            </div>
            {role && (
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {role}
              </div>
            )}
          </div>
        </div>

        {/* Pull quote */}
        <div
          style={{
            fontSize: quote.length > 90 ? "28px" : "32px",
            fontWeight: 600,
            fontStyle: "italic",
            lineHeight: 1.3,
            color: "rgba(255,255,255,0.92)",
            borderLeft: `6px solid ${GOLD}`,
            paddingLeft: "24px",
            maxWidth: "1000px",
          }}
        >
          “{quote}”
        </div>
      </div>
    ),
    { ...size },
  );
}
