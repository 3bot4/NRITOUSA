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
  /** SEO <title> override (falls back to `title`). Keep under ~60 chars. */
  seoTitle?: string;
  /** SEO meta description override (falls back to `excerpt`). ~140–160 chars. */
  seoDescription?: string;
  excerpt: string;
  topic: string; // Topic slug
  /**
   * Slug of a guest contributor (see lib/authors). When omitted, the article
   * is attributed to the site's owner/editor (Deepak Middha) — the default for
   * all in-house finance/tax content.
   */
  authorSlug?: string;
  /** ISO date string */
  date: string;
  readingTime: number; // minutes
  featured?: boolean;
  /** ISO date of last meaningful update (falls back to `date` for schema). */
  updated?: string;
  /** Markdown-ish body rendered as paragraphs/headings */
  content: string;
}

/**
 * A guest contributor. Drives the /contributors directory and /author/[slug]
 * profile pages. Add a new author here and the layout/pages pick it up — no
 * component changes needed.
 */
export interface Author {
  /** URL slug, e.g. "asha-rao" → /author/asha-rao */
  slug: string;
  name: string;
  /** Professional title shown under the name, e.g. "Senior SDE at a FAANG". */
  role: string;
  /** Two-sentence bio. */
  bio: string;
  /** Public LinkedIn profile URL. */
  linkedin: string;
  /**
   * Optional headshot served from /public, e.g. "/contributors/asha-rao.jpg".
   * When omitted, an initials avatar is rendered instead.
   */
  headshot?: string;
}
