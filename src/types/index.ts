export interface Topic {
  slug: string;
  title: string;
  /** Short tag shown in nav and chips */
  label: string;
  description: string;
  /** Emoji used as a lightweight icon (no external asset dependency) */
  icon: string;
  /** Tailwind gradient classes for topic accents */
  accent: string;
  /** SEO <title> override (falls back to title). Keep under ~60 chars. */
  seoTitle?: string;
  /** SEO meta description override (falls back to description). ~140–160 chars. */
  seoDescription?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  topic: string; // Topic slug
  author: string;
  /** ISO date string */
  date: string;
  readingTime: number; // minutes
  featured?: boolean;
  /** ISO date of last meaningful update (falls back to `date` for schema). */
  updated?: string;
  /** Markdown-ish body rendered as paragraphs/headings */
  content: string;
}
