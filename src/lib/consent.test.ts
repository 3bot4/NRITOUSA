import { describe, it, expect } from "vitest";
import { cmpActive, cmpProvider, openPrivacyChoices } from "./consent";

describe("consent config", () => {
  it("has no CMP configured by default", () => {
    expect(cmpProvider).toBeNull();
    expect(cmpActive).toBe(false);
  });

  it("openPrivacyChoices is a safe no-op while inactive", () => {
    expect(() => openPrivacyChoices()).not.toThrow();
  });
});
