import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  PostView,
  ReplyView,
  CommunityReport,
  Profile,
} from "@/lib/supabase/types";

/**
 * Admin-only data reads using the service-role client (bypasses RLS so admins
 * can see hidden/all content). Callers MUST verify admin via adminGuard() first.
 */

const POST_SELECT =
  "*, category:community_categories(name,slug,icon), starter:community_starter_profiles(name,label,avatar_initials)";

export interface DashboardStats {
  totalPosts: number;
  totalReplies: number;
  totalMembers: number;
  totalCategories: number;
  openReports: number;
  postsThisWeek: number;
  repliesThisWeek: number;
  topCategories: { name: string; count: number }[];
}

function weekAgoIso() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalPosts: 0,
    totalReplies: 0,
    totalMembers: 0,
    totalCategories: 0,
    openReports: 0,
    postsThisWeek: 0,
    repliesThisWeek: 0,
    topCategories: [],
  };
  try {
    const db = createAdminClient();
    const since = weekAgoIso();
    const count = (q: any) => q.then((r: any) => r.count ?? 0);

    const [
      totalPosts,
      totalReplies,
      totalMembers,
      totalCategories,
      openReports,
      postsThisWeek,
      repliesThisWeek,
      catRows,
    ] = await Promise.all([
      count(db.from("community_posts").select("id", { count: "exact", head: true })),
      count(db.from("community_replies").select("id", { count: "exact", head: true })),
      count(db.from("profiles").select("id", { count: "exact", head: true })),
      count(db.from("community_categories").select("id", { count: "exact", head: true })),
      count(db.from("community_reports").select("id", { count: "exact", head: true }).eq("status", "open")),
      count(db.from("community_posts").select("id", { count: "exact", head: true }).gte("created_at", since)),
      count(db.from("community_replies").select("id", { count: "exact", head: true }).gte("created_at", since)),
      db.from("community_posts").select("category:community_categories(name)"),
    ]);

    const tally = new Map<string, number>();
    for (const row of (catRows.data ?? []) as any[]) {
      const name = row.category?.name ?? "Uncategorized";
      tally.set(name, (tally.get(name) ?? 0) + 1);
    }
    const topCategories = Array.from(tally.entries())
      .map(([name, c]) => ({ name, count: c }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPosts,
      totalReplies,
      totalMembers,
      totalCategories,
      openReports,
      postsThisWeek,
      repliesThisWeek,
      topCategories,
    };
  } catch {
    return empty;
  }
}

export async function adminListPosts(limit = 100): Promise<PostView[]> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("community_posts")
      .select(POST_SELECT)
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as PostView[]) ?? [];
  } catch {
    return [];
  }
}

export async function adminListReplies(limit = 100): Promise<(ReplyView & { post_slug?: string; post_title?: string })[]> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("community_replies")
      .select("*, starter:community_starter_profiles(name,label,avatar_initials), post:community_posts(slug,title)")
      .order("created_at", { ascending: false })
      .limit(limit);
    return ((data as any[]) ?? []).map((r) => ({
      ...r,
      post_slug: r.post?.slug,
      post_title: r.post?.title,
    }));
  } catch {
    return [];
  }
}

export async function adminListReports(): Promise<
  (CommunityReport & { post?: { slug: string; title: string } | null; reply?: { content: string } | null })[]
> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("community_reports")
      .select("*, post:community_posts(slug,title), reply:community_replies(content)")
      .order("created_at", { ascending: false });
    return (data as any[]) ?? [];
  } catch {
    return [];
  }
}

export async function adminListMembers(limit = 200): Promise<Profile[]> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as Profile[]) ?? [];
  } catch {
    return [];
  }
}
