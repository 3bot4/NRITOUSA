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
  /** Markdown-ish body rendered as paragraphs/headings */
  content: string;
}
