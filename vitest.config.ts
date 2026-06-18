import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * Vitest config for the rules-engine unit tests (src/lib/nri-tax/*.test.ts).
 * Run: npm test
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
