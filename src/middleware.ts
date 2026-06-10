import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SAFE_URL, SAFE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase auth session cookie on navigation so Server
 * Components always see a valid session. No-ops when Supabase isn't configured.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SAFE_URL, SAFE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // Ignore network/auth errors — never block navigation.
  }

  return response;
}

export const config = {
  // Run on community/admin/auth + account routes; skip static assets.
  matcher: [
    "/community/:path*",
    "/admin/:path*",
    "/account/:path*",
    "/login",
    "/signup",
  ],
};
