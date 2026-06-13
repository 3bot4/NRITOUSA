import type { Article, Author, Topic } from "@/types";
import { site } from "@/lib/site";
import { resolveByline } from "@/lib/byline";
import { getTopicTitle } from "@/lib/topics";

/* ------------------------------------------------------------------ *
 * URL helpers
 * ------------------------------------------------------------------ */

/** Turn a root-relative path into an absolute URL using the site domain. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const articlePath = (slug: string) => `/articles/${slug}`;
export const topicPath = (slug: string) => `/topics/${slug}`;
export const articleUrl = (slug: string) => absoluteUrl(articlePath(slug));
export const topicUrl = (slug: string) => absoluteUrl(topicPath(slug));

/* ------------------------------------------------------------------ *
 * Light-markdown helpers (for clean schema text)
 * ------------------------------------------------------------------ */

/** Strip inline markdown (**bold**, [text](url)) to plain text for schema. */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Extract the visible FAQ from an article body. The convention in
 * lib/articles is an H2 like "## Frequently asked questions" followed by
 * H3 questions ("### …?") each with a paragraph answer. Only returns items
 * that are genuinely present in the rendered article (required for FAQPage
 * schema to be compliant).
 */
export function extractFaq(content: string): FaqItem[] {
  const lines = content.split("\n");
  const items: FaqItem[] = [];

  let inFaq = false;
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    if (question && answer.length) {
      items.push({
        question: stripInlineMarkdown(question),
        answer: stripInlineMarkdown(answer.join(" ")),
      });
    }
    question = null;
    answer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith("## ")) {
      // Entering or leaving the FAQ section.
      if (inFaq) flush();
      inFaq = /frequently asked|faq/i.test(line);
      continue;
    }
    if (!inFaq) continue;

    if (line.startsWith("### ")) {
      flush();
      question = line.replace(/^###\s+/, "");
    } else if (line && question) {
      answer.push(line);
    }
  }
  flush();

  return items;
}

/* ------------------------------------------------------------------ *
 * Structured data (JSON-LD) builders
 * ------------------------------------------------------------------ */

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.owner,
  url: site.url,
  email: site.email,
  foundingDate: String(site.foundingYear),
  parentOrganization: { "@type": "Organization", name: site.owner },
  description: site.description,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl(site.ogImage),
    width: 1200,
    height: 630,
  },
  // Only real, resolving profiles — populated from site.social, which is empty
  // until accounts exist (so this is currently []).
  sameAs: Object.values(site.social).filter(Boolean),
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: "en-US",
  publisher: { "@id": `${site.url}/#organization` },
};

/** BreadcrumbList from an ordered list of { name, url } crumbs. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/** FAQPage schema — only call when FAQ items are visible on the page. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Article schema for a single guide. */
export function articleJsonLd(article: Article) {
  const url = articleUrl(article.slug);
  const by = resolveByline(article);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: {
      "@type": "Person",
      name: by.name,
      ...(by.role ? { jobTitle: by.role } : {}),
      url: absoluteUrl(by.url),
      ...(by.linkedin ? { sameAs: [by.linkedin] } : {}),
    },
    ...(by.isContributor
      ? { editor: { "@type": "Person", name: site.publisher } }
      : {}),
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: absoluteUrl(articlePath(article.slug) + "/opengraph-image"),
    articleSection: getTopicTitle(article.topic),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };
}

/** CollectionPage + ItemList schema for a category/topic page. */
export function topicCollectionJsonLd(topic: Topic, articles: Article[]) {
  return {
    "@type": "CollectionPage",
    "@id": `${topicUrl(topic.slug)}#collection`,
    name: topic.seoTitle ?? topic.title,
    description: topic.seoDescription ?? topic.description,
    url: topicUrl(topic.slug),
    inLanguage: "en-US",
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: articleUrl(a.slug),
        name: a.title,
      })),
    },
  };
}

/** ProfilePage + Person schema for a contributor's author page (E-E-A-T). */
export function authorProfileJsonLd(author: Author, authored: Article[]) {
  const url = absoluteUrl(`/author/${author.slug}`);
  return {
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: {
      "@type": "Person",
      "@id": `${url}#person`,
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      url,
      sameAs: [author.linkedin],
      ...(author.headshot ? { image: absoluteUrl(author.headshot) } : {}),
    },
    ...(authored.length
      ? {
          hasPart: authored.map((a) => ({
            "@type": "Article",
            headline: a.title,
            url: articleUrl(a.slug),
          })),
        }
      : {}),
  };
}

/** Wrap one or more schema nodes into a single @graph document. */
export function jsonLdGraph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
