import { ImageResponse } from "next/og";

// Apple touch icon (home-screen bookmark). Same solid blue "N" logo,
// scaled up for the 180×180 Apple format.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
          background: "#1e40f5",
          color: "white",
          fontSize: "120px",
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        N
      </div>
    ),
    { ...size }
  );
}
