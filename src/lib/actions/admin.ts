"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminGuard } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { uniqueSlug } from "@/lib/community-utils";
import type { ActionResult } from "@/lib/actions/community";

/** Guard helper: returns the admin profile id or an error result. */
async function ensureAdmin(): Promise<
  { ok: true; adminId: string } | { ok: false; result: ActionResult }
> {
  const guard = await adminGuard();
  if (guard.state !== "ok") {
    return {
      ok: false,
      result: { error: "Admin access required." },
    };
  }
  return { ok: true, adminId: guard.profile.id };
}

/**
 * Admin creates a post either as the Official "NRI to USA Team" or as a
 * clearly-labeled Community Starter persona. Uses the service-role client AFTER
 * verifying the caller is an admin.
 */
export async function adminCreatePost(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const postedAs = String(formData.get("posted_as") ?? "").trim(); // 'official' | 'starter'
  const starterId = String(formData.get("starter_profile_id") ?? "").trim();
  const pinned = formData.get("is_pinned") === "on";
  const dateOverride = String(formData.get("created_at") ?? "").trim();

  if (title.length < 5) return { error: "Title must be at least 5 characters." };
  if (content.length < 10) return { error: "Content is too short." };
  if (!categoryId) return { error: "Please choose a category." };

  const supabase = createAdminClient();
  const slug = uniqueSlug(title);

  const base: Record<string, unknown> = {
    title,
    slug,
    content,
    category_id: categoryId,
    status: "published",
    is_pinned: pinned,
  };
  if (dateOverride) {
    base.created_at = dateOverride;
    base.last_activity_at = dateOverride;
  }

  if (postedAs === "starter") {
    if (!starterId) return { error: "Select a Community Starter profile." };
    base.posted_by_type = "community_starter";
    base.starter_profile_id = starterId;
    base.author_id = null;
  } else {
    base.posted_by_type = "official_admin";
    base.author_id = guard.adminId;
    base.starter_profile_id = null;
  }

  const { error } = await supabase.from("community_posts").insert(base as any);
  if (error) return { error: error.message };

  revalidatePath("/community");
  revalidatePath("/admin/community/posts");
  redirect(`/community/post/${slug}`);
}

/** Admin replies as Official, as a Community Starter, or as their own account. */
export async function adminCreateReply(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;

  const postId = String(formData.get("post_id") ?? "").trim();
  const slug = String(formData.get("post_slug") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const postedAs = String(formData.get("posted_as") ?? "").trim(); // official | starter | self
  const starterId = String(formData.get("starter_profile_id") ?? "").trim();
  const dateOverride = String(formData.get("created_at") ?? "").trim();

  if (!postId) return { error: "Missing post." };
  if (content.length < 1) return { error: "Reply cannot be empty." };

  const supabase = createAdminClient();
  const row: Record<string, unknown> = {
    post_id: postId,
    content,
    status: "published",
  };
  if (dateOverride) row.created_at = dateOverride;

  if (postedAs === "starter") {
    if (!starterId) return { error: "Select a Community Starter profile." };
    row.posted_by_type = "community_starter";
    row.starter_profile_id = starterId;
  } else if (postedAs === "official") {
    row.posted_by_type = "official_admin";
    row.author_id = guard.adminId;
  } else {
    row.posted_by_type = "user";
    row.author_id = guard.adminId;
  }

  const { error } = await supabase.from("community_replies").insert(row as any);
  if (error) return { error: error.message };
  if (slug) revalidatePath(`/community/post/${slug}`);
  revalidatePath("/admin/community/replies");
  return { ok: true };
}

/** Pin / lock / hide / unhide / delete a post. */
export async function adminModeratePost(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;
  const id = String(formData.get("post_id") ?? "").trim();
  const op = String(formData.get("op") ?? "").trim();
  const supabase = createAdminClient();

  let error = null;
  if (op === "delete") {
    ({ error } = await supabase.from("community_posts").delete().eq("id", id));
  } else if (op === "pin") {
    ({ error } = await supabase.from("community_posts").update({ is_pinned: true }).eq("id", id));
  } else if (op === "unpin") {
    ({ error } = await supabase.from("community_posts").update({ is_pinned: false }).eq("id", id));
  } else if (op === "lock") {
    ({ error } = await supabase.from("community_posts").update({ is_locked: true }).eq("id", id));
  } else if (op === "unlock") {
    ({ error } = await supabase.from("community_posts").update({ is_locked: false }).eq("id", id));
  } else if (op === "hide") {
    ({ error } = await supabase.from("community_posts").update({ status: "hidden" }).eq("id", id));
  } else if (op === "publish") {
    ({ error } = await supabase.from("community_posts").update({ status: "published" }).eq("id", id));
  }
  if (error) return { error: error.message };
  revalidatePath("/admin/community/posts");
  revalidatePath("/community");
  return { ok: true };
}

/** Hide / unhide / delete a reply, or mark / unmark best answer. */
export async function adminModerateReply(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;
  const id = String(formData.get("reply_id") ?? "").trim();
  const postId = String(formData.get("post_id") ?? "").trim();
  const op = String(formData.get("op") ?? "").trim();
  const supabase = createAdminClient();

  let error = null;
  if (op === "delete") {
    ({ error } = await supabase.from("community_replies").delete().eq("id", id));
  } else if (op === "hide") {
    ({ error } = await supabase.from("community_replies").update({ status: "hidden" }).eq("id", id));
  } else if (op === "publish") {
    ({ error } = await supabase.from("community_replies").update({ status: "published" }).eq("id", id));
  } else if (op === "best") {
    if (postId) {
      await supabase
        .from("community_replies")
        .update({ is_best_answer: false })
        .eq("post_id", postId);
    }
    ({ error } = await supabase
      .from("community_replies")
      .update({ is_best_answer: true })
      .eq("id", id));
  } else if (op === "unbest") {
    ({ error } = await supabase
      .from("community_replies")
      .update({ is_best_answer: false })
      .eq("id", id));
  }
  if (error) return { error: error.message };
  revalidatePath("/admin/community/replies");
  return { ok: true };
}

/** Update a starter profile's editable fields. */
export async function adminUpdateStarter(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim() || "Community Starter";
  const shortBio = String(formData.get("short_bio") ?? "").trim();
  const initials = String(formData.get("avatar_initials") ?? "").trim().slice(0, 3);

  if (!id) return { error: "Missing profile." };
  if (!name) return { error: "Name is required." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("community_starter_profiles")
    .update({ name, label, short_bio: shortBio, avatar_initials: initials })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/community/starter-profiles");
  return { ok: true };
}

export async function adminToggleStarter(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;
  const id = String(formData.get("id") ?? "").trim();
  const active = formData.get("is_active") === "true";
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("community_starter_profiles")
    .update({ is_active: !active })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/community/starter-profiles");
  return { ok: true };
}

/** Create or update a category. */
export async function adminSaveCategory(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || uniqueSlug(name);
  const description = String(formData.get("description") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const sortOrder = parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  const isActive = formData.get("is_active") === "on";

  if (!name) return { error: "Name is required." };
  const supabase = createAdminClient();
  const payload = { name, slug, description, icon, sort_order: sortOrder, is_active: isActive };

  const { error } = id
    ? await supabase.from("community_categories").update(payload).eq("id", id)
    : await supabase.from("community_categories").insert(payload);
  if (error) return { error: error.message };
  revalidatePath("/admin/community/categories");
  revalidatePath("/community");
  return { ok: true };
}

/** Update a report's status. */
export async function adminUpdateReport(formData: FormData): Promise<ActionResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return guard.result;
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!["open", "reviewing", "resolved", "dismissed"].includes(status))
    return { error: "Invalid status." };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("community_reports")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/community/reports");
  return { ok: true };
}
