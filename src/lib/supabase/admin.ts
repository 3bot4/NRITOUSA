import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SAFE_URL } from "./config";

/**
 * Service-role Supabase client. BYPASSES Row Level Security.
 *
 * SECURITY: This file imports `server-only`, so any attempt to bundle it into
 * client code is a build error. The service role key is read from a non-public
 * env var (SUPABASE_SERVICE_ROLE_KEY) and is NEVER sent to the browser.
 *
 * Only call this AFTER you have verified the current user is an admin
 * (see `requireAdmin()` in lib/auth.ts). It is used for admin-only mutations
 * such as posting as a Community Starter / Official Admin and moderation.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  // Intentionally untyped — admin client bypasses RLS and uses dynamic insert/update shapes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createSupabaseClient<any>(SAFE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const isAdminConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
