"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await createClient().auth.signOut();
    } catch {
      /* ignore */
    }
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={
        className ??
        "rounded-xl border border-ink-900/10 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-900/[0.04] disabled:opacity-50"
      }
    >
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
