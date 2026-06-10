/**
 * Hand-maintained database types for the community system.
 * Mirror of supabase/schema.sql. Kept intentionally pragmatic.
 */

export type Role = "member" | "moderator" | "admin";
export type PostedByType = "user" | "community_starter" | "official_admin";
export type PostStatus = "published" | "hidden" | "draft";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface Profile {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CommunityStarterProfile {
  id: string;
  name: string;
  gender: string | null;
  label: string;
  short_bio: string | null;
  avatar_initials: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string | null;
  author_id: string | null;
  starter_profile_id: string | null;
  posted_by_type: PostedByType;
  status: PostStatus;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  replies_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityReply {
  id: string;
  post_id: string;
  content: string;
  author_id: string | null;
  starter_profile_id: string | null;
  posted_by_type: PostedByType;
  parent_reply_id: string | null;
  status: PostStatus;
  is_best_answer: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityReport {
  id: string;
  post_id: string | null;
  reply_id: string | null;
  reporter_id: string | null;
  reason: string | null;
  status: ReportStatus;
  created_at: string;
}

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Tbl<Row> = {
  Row: Row;
  // Supabase's internal generics require loose Insert/Update shapes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Insert: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Update: any;
  Relationships: never[];
};

export interface Database {
  public: {
    Tables: {
      profiles: Tbl<Profile>;
      community_categories: Tbl<CommunityCategory>;
      community_starter_profiles: Tbl<CommunityStarterProfile>;
      community_posts: Tbl<CommunityPost>;
      community_replies: Tbl<CommunityReply>;
      community_reports: Tbl<CommunityReport>;
      saved_posts: Tbl<SavedPost>;
    };
    Views: {
      public_profiles: {
        Row: Pick<Profile, "id" | "display_name" | "role" | "avatar_url">;
      };
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_moderator_or_admin: { Args: Record<string, never>; Returns: boolean };
      increment_post_views: { Args: { p_slug: string }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/* ---- View-model helpers used across the UI ---- */

/** A post enriched with its category + resolved author display info. */
export interface PostView extends CommunityPost {
  category?: Pick<CommunityCategory, "name" | "slug" | "icon"> | null;
  author?: Pick<Profile, "display_name" | "role"> | null;
  starter?: Pick<CommunityStarterProfile, "name" | "label" | "avatar_initials"> | null;
}

export interface ReplyView extends CommunityReply {
  author?: Pick<Profile, "display_name" | "role"> | null;
  starter?: Pick<CommunityStarterProfile, "name" | "label" | "avatar_initials"> | null;
}
