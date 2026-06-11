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
 * shown. These are PLACEHOLDER seed authors — replace with real, accepted
 * contributors (do not present them as having published articles they haven't).
 */
export const authors: Author[] = [
  {
    slug: "asha-rao",
    name: "Asha Rao",
    role: "Senior Software Engineer · H-1B",
    bio: "Asha moved from Bengaluru to Seattle on an L-1 and transferred to an H-1B two years later. She writes about internal transfers and negotiating tech offers as a new immigrant.",
    linkedin: "https://www.linkedin.com/in/example-asha-rao/",
    // headshot: "/contributors/asha-rao.jpg",
  },
  {
    slug: "vikram-nair",
    name: "Vikram Nair",
    role: "Engineering Manager · Green Card holder",
    bio: "Vikram navigated a layoff during his H-1B window and landed a new role in 41 days. He shares practical, calendar-by-calendar playbooks for staying in status under pressure.",
    linkedin: "https://www.linkedin.com/in/example-vikram-nair/",
    // headshot: "/contributors/vikram-nair.jpg",
  },
  {
    slug: "meera-iyer",
    name: "Meera Iyer",
    role: "Product Manager · Former F-1/OPT",
    bio: "Meera went from international student to PM at a Bay Area startup. She writes about the first 90 days in the US and turning campus internships into full-time offers.",
    linkedin: "https://www.linkedin.com/in/example-meera-iyer/",
    // headshot: "/contributors/meera-iyer.jpg",
  },
];

export const authorPath = (slug: string) => `/author/${slug}`;

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
