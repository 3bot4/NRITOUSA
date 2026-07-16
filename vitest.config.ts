import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * Vitest config for the unit tests under src/ (rules engine, cluster data, SEO
 * invariants) and the SEO audit suite under scripts/seo.
 *
 * Run: npm test
 *
 * scripts/seo/*.test.ts reads the production build output and skips itself when
 * .next/server/app is absent, so `npm test` stays fast on a clean checkout —
 * see the note at the top of scripts/seo/seo-audit.test.ts.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/seo/**/*.test.ts"],
  },
});
