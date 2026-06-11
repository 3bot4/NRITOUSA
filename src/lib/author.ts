/**
 * The single, real author behind all editorial content on the site.
 *
 * Every article inherits this byline automatically — it is never hardcoded
 * per article — so a future guide can't accidentally introduce a fake
 * persona. Update the byline here and it changes everywhere.
 */
export const author = {
  name: "Deepak Middha",
  credentials: "CA, Series 65",
  /** Full byline shown under article titles and in author lines. */
  byline: "Deepak Middha, CA, Series 65",
  /** Short credential used in the "Reviewed by" credibility line. */
  reviewerByline: "Deepak Middha, CA",
  jobTitle: "Founder & Author",
  /** Canonical bio page every byline links to. */
  url: "/about-deepak",
  linkedin: "https://www.linkedin.com/in/deepak-middha-2bb06638/",
  /** Books, surfaced on the bio page. */
  books: [
    {
      title: "Why Immigrants Failed to Build Wealth",
      description:
        "Why so many immigrants under-build wealth in America — and the mindset and money habits that change the outcome.",
      url: "https://www.amazon.com/dp/B0DGWM3CVG",
    },
    {
      title:
        "Build Wealth and Income with 2 Option Strategies: Cash Flow in 7 Days",
      description:
        "A practical playbook for generating income and building wealth with two straightforward options strategies.",
      url: "https://www.amazon.com/dp/B0FD4YLZ2J",
    },
  ],
} as const;

/** Deterministic initials for the author avatar (no external image). */
export const authorInitials = author.name
  .split(" ")
  .map((p) => p[0])
  .slice(0, 2)
  .join("")
  .toUpperCase();
