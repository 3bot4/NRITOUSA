import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OciGuidePage from "@/components/OciGuidePage";
import { pageMetadata } from "@/lib/seo";
import { ociGuides, ociGuidePath, getOciGuide } from "@/lib/ociGuides";

export function generateStaticParams() {
  return ociGuides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = getOciGuide(params.slug);
  if (!guide) return { title: "Page not found" };
  return pageMetadata({
    title: guide.seoTitle ?? guide.title,
    description: guide.metaDescription ?? guide.excerpt,
    path: ociGuidePath(guide.slug),
    type: "article",
    openGraph: {
      publishedTime: guide.date,
      modifiedTime: guide.updated ?? guide.date,
    },
  });
}

export default function OciGuideRoute({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getOciGuide(params.slug);
  if (!guide) notFound();
  return <OciGuidePage guide={guide} />;
}
