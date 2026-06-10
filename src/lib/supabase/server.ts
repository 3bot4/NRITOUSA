import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SAFE_URL, SAFE_ANON_KEY } from "./config";

/**
 * Server Supabase client bound to the request cookies (uses the anon key).
 * Use this in Server Components, Route Handlers, and Server Actions to read the
 * current auth session and to perform reads/writes under RLS as the user.
 *
 * Note: in a pure Server Component the cookie store is read-only, so cookie
 * writes are wrapped in try/catch (session refresh happens in middleware).
 */
export function createClient() {
  const cookieStore = cookies();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createServerClient<any>(SAFE_URL, SAFE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component without a writable cookie store —
          // safe to ignore; middleware refreshes the session.
        }
      },
    },
  });
}
