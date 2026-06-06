import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/articles";
import { getTopicTitle } from "@/lib/topics";

export const alt = "NRI to USA guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered on-demand (no generateStaticParams) so the production build stays
// fast even with dozens of articles; Next caches the image after first request.
export default function Image({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  const title = article?.title ?? "NRI to USA";
  const category = article ? getTopicTitle(article.topic) : "Guides";

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
          background: "linear-gradient(135deg, #1b298f 0%, #1e40f5 60%, #10b981 100%)",
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

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.18)",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: title.length > 70 ? "52px" : "60px",
              fontWeight: 800,
              lineHeight: 1.12,
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.8)" }}>
          www.nritousa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
