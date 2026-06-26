import { ImageResponse } from "next/og";

export const alt =
  "NRI to USA — The Complete USA Guide for NRIs & Immigrants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette: professional dark blue background with gold + green accents.
const GOLD = "#f2b736";
const GREEN = "#34d399";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a1638 0%, #122a6b 55%, #0d1f4d 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "72px",
              width: "72px",
              borderRadius: "20px",
              background: GOLD,
              color: "#0a1638",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ fontSize: "34px", fontWeight: 700 }}>NRI to USA</div>
        </div>

        {/* Headline + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              height: "6px",
              width: "120px",
              borderRadius: "999px",
              background: GOLD,
            }}
          />
          <div style={{ fontSize: "66px", fontWeight: 800, lineHeight: 1.08 }}>
            The Complete USA Guide for NRIs &amp; Immigrants
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "30px",
              fontWeight: 600,
              color: GREEN,
            }}
          >
            Immigration • Tax • Wealth • Return to India Planning
          </div>
        </div>

        {/* URL */}
        <div style={{ fontSize: "28px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
          nritousa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
