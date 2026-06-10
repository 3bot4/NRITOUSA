"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminSaveCategory } from "@/lib/actions/admin";

export default function AdminCategoryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const res = await adminSaveCategory(fd);
      if (res?.error) setError(res.error);
      else {
        form.reset();
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        + New category
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-ink-900/10 bg-white p-5 sm:grid-cols-2">
      <input name="name" required placeholder="Name" className="rounded-lg border border-ink-900/10 px-3 py-2" />
      <input name="slug" placeholder="slug (optional)" className="rounded-lg border border-ink-900/10 px-3 py-2" />
      <input name="icon" placeholder="Icon emoji" className="rounded-lg border border-ink-900/10 px-3 py-2" />
      <input name="sort_order" type="number" defaultValue={0} placeholder="Sort order" className="rounded-lg border border-ink-900/10 px-3 py-2" />
      <textarea name="description" placeholder="Description" rows={2} className="rounded-lg border border-ink-900/10 px-3 py-2 sm:col-span-2" />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="is_active" defaultChecked /> Active
      </label>
      {error && <p className="text-sm text-rose-600 sm:col-span-2">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" disabled={pending} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {pending ? "Saving…" : "Create category"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-500">Cancel</button>
      </div>
    </form>
  );
}
