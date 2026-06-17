import { ImageResponse } from "next/og";

// Browser-tab / address-bar favicon. Mirrors the navbar logo: a solid blue
// rounded square with a white "N" (brand-600 #1e40f5).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "7px",
          background: "#1e40f5",
          color: "white",
          fontSize: "22px",
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
