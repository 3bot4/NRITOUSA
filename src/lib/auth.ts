import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

/** Current authenticated user (or null). Never throws. */
export async function getUser() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

/** Current user's profile row (or null). Never throws. */
export async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    return (data as Profile) ?? null;
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin";
}

export async function isModeratorOrAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin" || profile?.role === "moderator";
}

/**
 * Result type for admin route guards so pages can render the right state
 * without throwing during server rendering.
 */
export type AdminGuard =
  | { state: "ok"; profile: Profile }
  | { state: "unauthenticated" }
  | { state: "forbidden" };

export async function adminGuard(): Promise<AdminGuard> {
  const profile = await getProfile();
  if (!profile) return { state: "unauthenticated" };
  if (profile.role !== "admin") return { state: "forbidden" };
  return { state: "ok", profile };
}
