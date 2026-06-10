/**
 * Central place to read Supabase env vars.
 *
 * The site must still build and render (with empty community states) even when
 * Supabase is not configured yet — so we never throw at import time. Use
 * `isSupabaseConfigured` to decide whether to attempt live data fetches.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True only when both public Supabase values are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * A harmless placeholder URL so client constructors don't throw when env is
 * missing. Any network call made with it will simply fail and be caught by the
 * data layer, which falls back to empty results.
 */
export const SAFE_URL = SUPABASE_URL || "https://placeholder.supabase.co";
export const SAFE_ANON_KEY = SUPABASE_ANON_KEY || "public-anon-key-placeholder";
