import { ImageResponse } from "next/og";

export const alt = "NRI to USA — The Complete USA Guide for NRIs & Immigrants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #1b298f 0%, #1e40f5 55%, #10b981 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "72px",
              width: "72px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.15)",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ fontSize: "34px", fontWeight: 700 }}>NRI to USA</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1.1 }}>
            The Complete USA Guide for NRIs &amp; Immigrants
          </div>
          <div style={{ fontSize: "30px", color: "rgba(255,255,255,0.85)" }}>
            Money, housing, cars, taxes, investing, retirement &amp; India-USA life
          </div>
        </div>

        <div style={{ fontSize: "26px", color: "rgba(255,255,255,0.8)" }}>
          www.nritousa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
