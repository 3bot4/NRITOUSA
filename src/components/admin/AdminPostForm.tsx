"use client";

import { useState, useTransition } from "react";
import { adminCreatePost } from "@/lib/actions/admin";
import type {
  CommunityCategory,
  CommunityStarterProfile,
} from "@/lib/supabase/types";

export default function AdminPostForm({
  categories,
  starters,
}: {
  categories: CommunityCategory[];
  starters: CommunityStarterProfile[];
}) {
  const [postedAs, setPostedAs] = useState<"official" | "starter">("official");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await adminCreatePost(fd);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset className="rounded-xl border border-ink-900/10 p-4">
        <legend className="px-1 text-sm font-semibold text-ink-800">Post as</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="posted_as"
              value="official"
              checked={postedAs === "official"}
              onChange={() => setPostedAs("official")}
            />
            NRI to USA Team / Official Admin
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="posted_as"
              value="starter"
              checked={postedAs === "starter"}
              onChange={() => setPostedAs("starter")}
            />
            Community Starter profile
          </label>
        </div>

        {postedAs === "starter" && (
          <div className="mt-3">
            <label htmlFor="starter_profile_id" className="mb-1 block text-xs font-semibold text-ink-600">
              Choose a Community Starter ({starters.length} active) — shown publicly as “Name · Community Starter”
            </label>
            <select
              id="starter_profile_id"
              name="starter_profile_id"
              className="w-full rounded-xl border border-ink-900/10 bg-white px-4 py-2.5 outline-none focus:border-brand-400"
            >
              <option value="">Select a starter profile…</option>
              {starters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </fieldset>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-ink-800">Title</label>
        <input id="title" name="title" required minLength={5} maxLength={160}
          className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category_id" className="mb-1.5 block text-sm font-semibold text-ink-800">Category</label>
          <select id="category_id" name="category_id" required
            className="w-full rounded-xl border border-ink-900/10 bg-white px-4 py-3 outline-none focus:border-brand-400">
            <option value="">Choose…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="created_at" className="mb-1.5 block text-sm font-semibold text-ink-800">
            Backdate (optional)
          </label>
          <input id="created_at" name="created_at" type="datetime-local"
            className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400" />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-semibold text-ink-800">Content</label>
        <textarea id="content" name="content" required minLength={10} rows={10}
          className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200" />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input type="checkbox" name="is_pinned" /> Pin this discussion
      </label>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" disabled={pending}
        className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
        {pending ? "Publishing…" : "Publish post"}
      </button>
    </form>
  );
}
