"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function SignupForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!isSupabaseConfigured) {
      setError("Authentication isn't configured yet. Add your Supabase keys to .env.local.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName.trim() || email.split("@")[0] } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // If email confirmation is required, there is no active session yet.
    if (data.session) {
      router.push("/community");
      router.refresh();
    } else {
      setMessage(
        "Account created. Please check your email to confirm your address, then log in."
      );
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink-800">
          Display name
        </label>
        <input
          id="name"
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How you'll appear in the community"
          className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-800">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink-800">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-xl border border-ink-900/10 px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Sign up"}
      </button>
      <p className="text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-600 underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
