"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { uniqueSlug } from "@/lib/community-utils";

const MAX_TITLE = 160;
const MAX_CONTENT = 20000;

export interface ActionResult {
  error?: string;
  ok?: boolean;
}

/** Real user creates a post as themselves. */
export async function createPost(formData: FormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "You must be logged in to post." };

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();

  if (title.length < 5) return { error: "Title must be at least 5 characters." };
  if (title.length > MAX_TITLE)
    return { error: `Title must be under ${MAX_TITLE} characters.` };
  if (content.length < 10)
    return { error: "Please write at least a sentence or two." };
  if (content.length > MAX_CONTENT)
    return { error: "Content is too long." };
  if (!categoryId) return { error: "Please choose a category." };

  const slug = uniqueSlug(title);
  const supabase = createClient();
  const { error } = await supabase.from("community_posts").insert({
    title,
    slug,
    content,
    category_id: categoryId,
    author_id: user.id,
    posted_by_type: "user",
    status: "published",
  });

  if (error) return { error: error.message };

  revalidatePath("/community");
  redirect(`/community/post/${slug}`);
}

/** Real user replies to a post as themselves. */
export async function createReply(formData: FormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "You must be logged in to reply." };

  const postId = String(formData.get("post_id") ?? "").trim();
  const slug = String(formData.get("post_slug") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const parentId = String(formData.get("parent_reply_id") ?? "").trim();

  if (!postId) return { error: "Missing post." };
  if (content.length < 1) return { error: "Reply cannot be empty." };
  if (content.length > 10000) return { error: "Reply is too long." };

  const supabase = createClient();
  const { error } = await supabase.from("community_replies").insert({
    post_id: postId,
    content,
    author_id: user.id,
    posted_by_type: "user",
    status: "published",
    parent_reply_id: parentId || null,
  });

  if (error) return { error: error.message };
  if (slug) revalidatePath(`/community/post/${slug}`);
  return { ok: true };
}

/** Toggle save/unsave for the current user. */
export async function toggleSave(formData: FormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "Please log in to save discussions." };
  const postId = String(formData.get("post_id") ?? "").trim();
  const slug = String(formData.get("post_slug") ?? "").trim();
  if (!postId) return { error: "Missing post." };

  const supabase = createClient();
  const { data: existing } = await supabase
    .from("saved_posts")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_posts").delete().eq("id", (existing as any).id);
  } else {
    await supabase
      .from("saved_posts")
      .insert({ user_id: user.id, post_id: postId });
  }
  if (slug) revalidatePath(`/community/post/${slug}`);
  revalidatePath("/community/saved");
  return { ok: true };
}

/** Report a post or reply for moderator review. */
export async function reportContent(formData: FormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "Please log in to report content." };
  const postId = String(formData.get("post_id") ?? "").trim();
  const replyId = String(formData.get("reply_id") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 500);

  if (!postId && !replyId) return { error: "Nothing to report." };

  const supabase = createClient();
  const { error } = await supabase.from("community_reports").insert({
    post_id: postId || null,
    reply_id: replyId || null,
    reporter_id: user.id,
    reason: reason || "No reason provided",
    status: "open",
  });
  if (error) return { error: error.message };
  return { ok: true };
}

/** Delete one of the current user's own posts (if not locked). */
export async function deleteMyPost(formData: FormData): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { error: "Not logged in." };
  const id = String(formData.get("post_id") ?? "").trim();
  const supabase = createClient();
  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/community/my-posts");
  return { ok: true };
}
