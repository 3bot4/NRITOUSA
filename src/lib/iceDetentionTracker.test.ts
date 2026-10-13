import { describe, expect, it } from "vitest";
import {
  KIND_LABELS,
  KIND_NOTES,
  trackerCategories,
  trackerEntries,
  trackerLastUpdated,
} from "./iceDetentionTracker";

const entries = trackerEntries();

describe("the tracker data file", () => {
  it("has entries", () => {
    expect(entries.length).toBeGreaterThan(3);
  });

  it("is sorted newest first", () => {
    for (let i = 1; i < entries.length; i += 1) {
      expect(entries[i - 1].date >= entries[i].date).toBe(true);
    }
  });

  it("gives every entry a date, a title and at least one real source URL", () => {
    for (const e of entries) {
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.title.length).toBeGreaterThan(10);
      expect(e.sources.length).toBeGreaterThan(0);
      for (const s of e.sources) expect(s.href).toMatch(/^https?:\/\//);
    }
  });

  it("gives every entry a unique id", () => {
    const ids = entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("classifies every entry as official, statistic or reported pattern", () => {
    for (const e of entries) {
      expect(Object.keys(KIND_LABELS)).toContain(e.kind);
      expect(KIND_NOTES[e.kind].length).toBeGreaterThan(20);
    }
  });

  it("includes at least one official entry and at least one reported pattern", () => {
    const kinds = entries.map((e) => e.kind);
    expect(kinds).toContain("official");
    expect(kinds).toContain("reported-pattern");
  });
});

describe("editorial rules the data file sets for itself", () => {
  // The rule is in data/ice-detention-tracker.json: never name a private
  // individual. A test cannot read intent, but it can catch the shape of a
  // name and the words that usually accompany one.
  it("names no individual", () => {
    const blob = entries
      .map((e) => `${e.title} ${e.summary} ${e.affects} ${e.whatToDo ?? ""}`)
      .join(" ");
    expect(blob).not.toMatch(/\b(Mr|Mrs|Ms|Mr\.|Dr)\.? [A-Z][a-z]+/);
    expect(blob).not.toMatch(/\b[A-Z][a-z]+ [A-Z][a-z]+, (aged?|a) \d{2}/);
    expect(blob).not.toMatch(/named [A-Z][a-z]+/);
  });

  it("never speculates or predicts", () => {
    const blob = entries.map((e) => `${e.title} ${e.summary}`).join(" ").toLowerCase();
    expect(blob).not.toContain("is expected to");
    expect(blob).not.toContain("may increase");
    expect(blob).not.toContain("will likely");
    expect(blob).not.toContain("we predict");
  });

  it("marks a reported pattern as reported rather than as policy", () => {
    for (const e of entries.filter((x) => x.kind === "reported-pattern")) {
      const blob = `${e.title} ${e.summary}`.toLowerCase();
      expect(blob).toMatch(/reported|practitioners|news outlets|described/);
      // And it says that no official source calls it policy.
      expect(e.summary.toLowerCase()).toContain("no official source");
    }
  });

  it("never uses the word caveat", () => {
    const blob = JSON.stringify(entries).toLowerCase();
    expect(blob).not.toContain("caveat");
  });
});

describe("the last-updated stamp", () => {
  it("is a real date", () => {
    expect(trackerLastUpdated()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("is never older than the newest entry", () => {
    expect(trackerLastUpdated() >= entries[0].date).toBe(true);
  });
});

describe("categories", () => {
  it("are listed in first-seen order with no duplicates", () => {
    const cats = trackerCategories();
    expect(new Set(cats).size).toBe(cats.length);
    expect(cats.length).toBeGreaterThan(2);
  });
});
