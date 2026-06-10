import type { PostView, ReplyView } from "@/lib/supabase/types";

/** Lowercase, URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Add a short random suffix to keep slugs unique. */
export function uniqueSlug(input: string): string {
  const base = slugify(input) || "discussion";
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

/** Plain-text excerpt for meta descriptions / cards. */
export function excerpt(content: string, max = 160): string {
  const text = content.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

export type AuthorBadgeTone = "official" | "starter" | "admin" | "mod" | "none";

export interface AuthorDisplay {
  name: string;
  initials: string;
  /** Short label shown next to the name, e.g. "Community Starter". */
  badge: string | null;
  tone: AuthorBadgeTone;
}

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Resolve how a post/reply author should be displayed publicly.
 * Community Starter and Official labels are ALWAYS shown so visitors are never
 * misled into thinking a starter persona is an independent real member.
 */
export function authorDisplay(item: PostView | ReplyView): AuthorDisplay {
  if (item.posted_by_type === "official_admin") {
    return {
      name: "NRI to USA Team",
      initials: "NT",
      badge: "Official",
      tone: "official",
    };
  }
  if (item.posted_by_type === "community_starter") {
    const name = item.starter?.name ?? "Community Starter";
    return {
      name,
      initials: item.starter?.avatar_initials ?? toInitials(name),
      badge: item.starter?.label ?? "Community Starter",
      tone: "starter",
    };
  }
  // Real user
  const name = item.author?.display_name ?? "Member";
  const role = item.author?.role;
  return {
    name,
    initials: toInitials(name),
    badge:
      role === "admin" ? "Admin" : role === "moderator" ? "Moderator" : null,
    tone: role === "admin" ? "admin" : role === "moderator" ? "mod" : "none",
  };
}

export const COMMUNITY_DISCLAIMER =
  "NRI to USA community discussions are for general educational and experience-sharing purposes only. Posts and replies are not financial, tax, legal, immigration, or investment advice.";

export const COMMUNITY_RULES: { title: string; body: string }[] = [
  { title: "Be respectful", body: "Treat every member with courtesy. We're all figuring out life across two countries." },
  { title: "No harassment or personal attacks", body: "Disagree with ideas, never attack people. Harassment leads to removal." },
  { title: "No spam or self-promotion", body: "Don't post referral links, ads, or repetitive promotional content." },
  { title: "Protect private information", body: "Never share private financial, tax, legal, immigration, or personal documents — yours or anyone else's." },
  { title: "No direct professional advice", body: "Don't give direct financial, tax, legal, immigration, or investment advice. Share your experience instead." },
  { title: "Share experiences, not guarantees", body: "What worked for you may not work for others. Frame things as your experience." },
  { title: "Verify with professionals", body: "Always verify important decisions with a qualified CPA, attorney, or advisor." },
  { title: "Moderators may remove content", body: "Moderators may edit, hide, lock, or remove content that breaks these rules." },
];
