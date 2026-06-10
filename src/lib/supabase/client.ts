"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SAFE_URL, SAFE_ANON_KEY } from "./config";

/**
 * Browser Supabase client (uses the public anon key only).
 * Safe to import in client components. Never uses the service role key.
 */
export function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<any>(SAFE_URL, SAFE_ANON_KEY);
}
