import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * Vitest config for the unit tests under src/ (rules engine, cluster data, SEO
 * invariants) and the SEO audit suite under scripts/seo.
 *
 * Run: npm test
 *
 * `server-only` is aliased to its own no-op entry: the package's default export
 * throws by design ("cannot be imported from a Client Component"), which would
 * make every server-only data module (src/lib/h1b/*) untestable. Next resolves
 * the real thing through the react-server condition, so this only affects tests.
 *
 * scripts/seo/*.test.ts reads the production build output and skips itself when
 * .next/server/app is absent, so `npm test` stays fast on a clean checkout —
 * see the note at the top of scripts/seo/seo-audit.test.ts.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "server-only": resolve(__dirname, "node_modules/server-only/empty.js"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/seo/**/*.test.ts"],
  },
});
