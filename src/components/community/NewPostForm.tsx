"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/lib/actions/community";
import type { CommunityCategory } from "@/lib/supabase/types";

export default function NewPostForm({
  categories,
  defaultCategory,
}: {
  categories: CommunityCategory[];
  defaultCategory?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await createPost(fd);
      if (res?.error) setError(res.error);
      // success path redirects from the server action
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-ink-800">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={5}
          maxLength={160}
          placeholder="Ask a clear, specific question"
          className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div>
        <label htmlFor="category_id" className="mb-1.5 block text-sm font-semibold text-ink-800">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={defaultCategory ?? ""}
          className="w-full rounded-xl border border-ink-900/10 bg-white px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        >
          <option value="" disabled>
            Choose a category…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-semibold text-ink-800">
          Your question or topic
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          maxLength={20000}
          rows={10}
          placeholder="Share context and what you're trying to figure out. Please keep it experience-based and avoid sharing private documents or giving direct professional advice."
          className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "Publishing…" : "Publish discussion"}
      </button>
    </form>
  );
}
