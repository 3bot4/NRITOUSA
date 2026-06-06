// Google Analytics 4 measurement ID.
// Reads from the env var so it can be changed without a code edit, with the
// production ID as a safe fallback.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-R85V0V6Y7R";

// Only load analytics in production with a configured ID.
export const gaEnabled = process.env.NODE_ENV === "production" && Boolean(GA_ID);
