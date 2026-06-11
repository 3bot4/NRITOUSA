import type { Author } from "@/types";

/**
 * Guest contributor registry.
 *
 * Add a contributor here and they automatically appear in the /contributors
 * directory and get an /author/<slug> profile page. To attribute an article to
 * a contributor, set `authorSlug: "<slug>"` on the article in lib/articles.
 *
 * Headshots are optional: drop a photo at /public/contributors/<slug>.jpg and
 * set `headshot: "/contributors/<slug>.jpg"`. Until then an initials avatar is
 * shown.
 *
 * Add only real, accepted contributors here — do not seed placeholder/example
 * people, and do not present anyone as having published articles they haven't.
 * The /contributors directory shows an onboarding empty state while this is
 * empty.
 *
 * Example entry:
 *   {
 *     slug: "jane-doe",
 *     name: "Jane Doe",
 *     role: "Senior Software Engineer · H-1B",
 *     bio: "One or two sentences on their journey and what they write about.",
 *     linkedin: "https://www.linkedin.com/in/jane-doe/",
 *     // headshot: "/contributors/jane-doe.jpg",
 *   },
 */
export const authors: Author[] = [];

export const authorPath = (slug: string) => `/author/${slug}`;

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
