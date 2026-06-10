"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/community?q=${encodeURIComponent(term)}` : "/community");
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-xl">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search discussions…"
        aria-label="Search discussions"
        className="w-full rounded-xl border border-ink-900/10 bg-white px-4 py-3 pr-24 text-ink-900 shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Search
      </button>
    </form>
  );
}
