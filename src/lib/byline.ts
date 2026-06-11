import type { Article } from "@/types";
import { author as owner, authorInitials as ownerInitials } from "@/lib/author";
import { getAuthor, authorPath } from "@/lib/authors";
import { initials } from "@/lib/format";

/**
 * Resolved author for an article. Guest contributors (articles with an
 * `authorSlug`) are attributed to themselves and link to their /author/<slug>
 * profile; everything else is attributed to the site owner/editor (Deepak
 * Middha) and links to /about-deepak. This is the single source of truth for
 * bylines so cards, headers, and JSON-LD never drift.
 */
export interface ResolvedByline {
  name: string;
  /** Credential / professional title shown under the name. */
  role: string;
  /** Profile URL the byline links to. */
  url: string;
  initials: string;
  isContributor: boolean;
  /** LinkedIn URL (contributors only) — used for Person sameAs in schema. */
  linkedin?: string;
}

export function resolveByline(article: Article): ResolvedByline {
  if (article.authorSlug) {
    const contributor = getAuthor(article.authorSlug);
    if (contributor) {
      return {
        name: contributor.name,
        role: contributor.role,
        url: authorPath(contributor.slug),
        initials: initials(contributor.name),
        isContributor: true,
        linkedin: contributor.linkedin,
      };
    }
  }
  return {
    name: owner.name,
    role: owner.credentials,
    url: owner.url,
    initials: ownerInitials,
    isContributor: false,
    linkedin: owner.linkedin,
  };
}
