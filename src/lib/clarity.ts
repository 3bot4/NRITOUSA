// Microsoft Clarity project ID.
// Reads from the env var so it can be changed without a code edit, with the
// production project ID as a safe fallback.
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "xd8k6ddckc";

// Only load Clarity in production with a configured ID.
export const clarityEnabled =
  process.env.NODE_ENV === "production" && Boolean(CLARITY_ID);
