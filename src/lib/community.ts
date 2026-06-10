import { createClient } from "@/lib/supabase/server";
import type {
  CommunityCategory,
  CommunityStarterProfile,
  PostView,
  ReplyView,
  Profile,
} from "@/lib/supabase/types";

/**
 * Read layer for the community. Every function is defensive: if Supabase is
 * unconfigured or a query fails, it returns an empty/safe result so the site
 * still builds and renders graceful empty states.
 */

const POST_SELECT =
  "*, category:community_categories(name,slug,icon), starter:community_starter_profiles(name,label,avatar_initials)";
const REPLY_SELECT =
  "*, starter:community_starter_profiles(name,label,avatar_initials)";

export type SortKey = "recent" | "popular" | "unanswered" | "pinned";

/** Resolve author display names from the public_profiles view and attach them. */
async function attachAuthors<T extends { author_id: string | null }>(
  rows: T[]
): Promise<(T & { author?: Pick<Profile, "display_name" | "role"> | null })[]> {
  const ids = Array.from(
    new Set(rows.map((r) => r.author_id).filter(Boolean))
  ) as string[];
  if (ids.length === 0) return rows.map((r) => ({ ...r, author: null }));
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("public_profiles")
      .select("id, display_name, role")
      .in("id", ids);
    const map = new Map((data ?? []).map((p: any) => [p.id, p]));
    return rows.map((r) => ({
      ...r,
      author: r.author_id ? map.get(r.author_id) ?? null : null,
    }));
  } catch {
    return rows.map((r) => ({ ...r, author: null }));
  }
}

export async function getCategories(
  includeInactive = false
): Promise<CommunityCategory[]> {
  try {
    const supabase = createClient();
    let q = supabase
      .from("community_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!includeInactive) q = q.eq("is_active", true);
    const { data } = await q;
    return (data as CommunityCategory[]) ?? [];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<CommunityCategory | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_categories")
      .select("*")
      .eq("slug", slug)
      .single();
    return (data as CommunityCategory) ?? null;
  } catch {
    return null;
  }
}

export async function getStarterProfiles(
  includeInactive = false
): Promise<CommunityStarterProfile[]> {
  try {
    const supabase = createClient();
    let q = supabase
      .from("community_starter_profiles")
      .select("*")
      .order("name", { ascending: true });
    if (!includeInactive) q = q.eq("is_active", true);
    const { data } = await q;
    return (data as CommunityStarterProfile[]) ?? [];
  } catch {
    return [];
  }
}

interface GetPostsOpts {
  categoryId?: string;
  sort?: SortKey;
  limit?: number;
}

export async function getPosts(opts: GetPostsOpts = {}): Promise<PostView[]> {
  const { categoryId, sort = "recent", limit = 30 } = opts;
  try {
    const supabase = createClient();
    let q = supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("status", "published");

    if (categoryId) q = q.eq("category_id", categoryId);
    if (sort === "unanswered") q = q.eq("replies_count", 0);
    if (sort === "pinned") q = q.eq("is_pinned", true);

    if (sort === "popular") {
      q = q
        .order("views_count", { ascending: false })
        .order("replies_count", { ascending: false });
    } else {
      q = q
        .order("is_pinned", { ascending: false })
        .order("last_activity_at", { ascending: false });
    }

    const { data } = await q.limit(limit);
    return (await attachAuthors((data as PostView[]) ?? [])) as PostView[];
  } catch {
    return [];
  }
}

export async function getPinnedPosts(limit = 5): Promise<PostView[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .eq("is_pinned", true)
      .order("last_activity_at", { ascending: false })
      .limit(limit);
    return (await attachAuthors((data as PostView[]) ?? [])) as PostView[];
  } catch {
    return [];
  }
}

export async function getPopularPosts(limit = 6): Promise<PostView[]> {
  return getPosts({ sort: "popular", limit });
}

export async function getRecentPosts(limit = 8): Promise<PostView[]> {
  return getPosts({ sort: "recent", limit });
}

export async function searchPosts(
  query: string,
  limit = 30
): Promise<PostView[]> {
  const term = query.trim();
  if (!term) return [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
      .order("last_activity_at", { ascending: false })
      .limit(limit);
    return (await attachAuthors((data as PostView[]) ?? [])) as PostView[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostView | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("slug", slug)
      .single();
    if (!data) return null;
    const [withAuthor] = await attachAuthors([data as PostView]);
    return withAuthor as PostView;
  } catch {
    return null;
  }
}

export async function getReplies(postId: string): Promise<ReplyView[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_replies")
      .select(REPLY_SELECT)
      .eq("post_id", postId)
      .eq("status", "published")
      .order("is_best_answer", { ascending: false })
      .order("created_at", { ascending: true });
    return (await attachAuthors((data as ReplyView[]) ?? [])) as ReplyView[];
  } catch {
    return [];
  }
}

export async function getRelatedPosts(
  post: PostView,
  limit = 4
): Promise<PostView[]> {
  try {
    const supabase = createClient();
    let q = supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("status", "published")
      .neq("id", post.id);
    if (post.category_id) q = q.eq("category_id", post.category_id);
    const { data } = await q
      .order("last_activity_at", { ascending: false })
      .limit(limit);
    return (data as PostView[]) ?? [];
  } catch {
    return [];
  }
}

export async function getMyPosts(userId: string): Promise<PostView[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("author_id", userId)
      .order("created_at", { ascending: false });
    return (data as PostView[]) ?? [];
  } catch {
    return [];
  }
}

export async function getSavedPosts(userId: string): Promise<PostView[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("saved_posts")
      .select("post:community_posts(" + POST_SELECT + ")")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    const posts = (data ?? [])
      .map((row: any) => row.post)
      .filter(Boolean) as PostView[];
    return (await attachAuthors(posts)) as PostView[];
  } catch {
    return [];
  }
}

export async function isPostSaved(
  userId: string,
  postId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("saved_posts")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .maybeSingle();
    return Boolean(data);
  } catch {
    return false;
  }
}

/** Counts of how many posts/replies each starter profile authored (admin). */
export async function getStarterUsageCounts(): Promise<
  Record<string, { posts: number; replies: number }>
> {
  const result: Record<string, { posts: number; replies: number }> = {};
  try {
    const supabase = createClient();
    const [{ data: posts }, { data: replies }] = await Promise.all([
      supabase
        .from("community_posts")
        .select("starter_profile_id")
        .not("starter_profile_id", "is", null),
      supabase
        .from("community_replies")
        .select("starter_profile_id")
        .not("starter_profile_id", "is", null),
    ]);
    for (const r of posts ?? []) {
      const id = (r as any).starter_profile_id as string;
      result[id] = result[id] ?? { posts: 0, replies: 0 };
      result[id].posts += 1;
    }
    for (const r of replies ?? []) {
      const id = (r as any).starter_profile_id as string;
      result[id] = result[id] ?? { posts: 0, replies: 0 };
      result[id].replies += 1;
    }
  } catch {
    /* ignore */
  }
  return result;
}
