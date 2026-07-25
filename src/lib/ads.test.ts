import { describe, it, expect } from "vitest";
import {
  ADSENSE_CLIENT,
  adsEnabled,
  isAdEligibleRoute,
  isExcludedRoute,
  NO_AD_ROUTES,
} from "./ads";

describe("ads config", () => {
  it("is disabled without a configured client id / outside production", () => {
    expect(adsEnabled).toBe(false);
  });

  it("never ships a placeholder publisher id as the configured client", () => {
    expect(ADSENSE_CLIENT).not.toMatch(/^ca-pub-0+$/);
  });

  it("is never eligible while disabled, regardless of route", () => {
    expect(isAdEligibleRoute("/")).toBe(false);
    expect(isAdEligibleRoute("/some-random-guide")).toBe(false);
    expect(isAdEligibleRoute(NO_AD_ROUTES[0])).toBe(false);
  });
});

// isExcludedRoute is pure (independent of adsEnabled/NODE_ENV), so these
// exercise the real route-matching logic rather than being trivially true
// because ads are disabled in the test environment.
describe("isExcludedRoute", () => {
  it("excludes every seeded sensitive route and its sub-paths", () => {
    for (const route of NO_AD_ROUTES) {
      expect(isExcludedRoute(route)).toBe(true);
      expect(isExcludedRoute(`${route}/sub-page`)).toBe(true);
    }
  });

  it("does not exclude an unrelated route that merely shares a prefix", () => {
    expect(NO_AD_ROUTES).toContain("/h1b-layoff");
    // "/h1b-layoffs-explained" is a different slug, not a sub-path of
    // "/h1b-layoff" — a naive substring match would wrongly exclude it.
    expect(isExcludedRoute("/h1b-layoffs-explained")).toBe(false);
  });

  it("does not exclude ordinary content routes", () => {
    expect(isExcludedRoute("/")).toBe(false);
    expect(isExcludedRoute("/calculators/rent-vs-buy-immigrant")).toBe(false);
  });
});
