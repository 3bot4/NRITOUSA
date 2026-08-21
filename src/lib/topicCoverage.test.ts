/**
 * Guard against a live topic hub with nothing on it.
 *
 * /topics/immigration shipped this way: every immigration guide had migrated
 * into a dedicated top-level cluster (/h1b/*, /green-card/*, /uscis/*, PERM,
 * I-140, EAD, I-485), leaving the taxonomy page with zero articles. It rendered
 * "Guides coming soon" — on the site's deepest subject area — while still
 * sitting in the sitemap and, later, the homepage search. Nothing failed,
 * because an empty list is a valid list.
 *
 * The rule: a topic that is live (not `retiredTo`) must have articles. When the
 * last article leaves a topic, retire it to whatever page owns the intent now.
 */
import { describe, expect, it } from "vitest";
import { articles } from "./articles";
import { liveTopics, topics, topicHubPath } from "./topics";

const countByTopic = articles.reduce<Record<string, number>>((acc, a) => {
  acc[a.topic] = (acc[a.topic] ?? 0) + 1;
  return acc;
}, {});

describe("live topic hubs have content", () => {
  it.each(liveTopics.map((t) => [t.slug, t.slug] as const))(
    "/topics/%s lists at least one guide",
    (_name, slug) => {
      expect(countByTopic[slug] ?? 0).toBeGreaterThan(0);
    },
  );

  it("names the empty ones explicitly if any slip through", () => {
    const empty = liveTopics
      .filter((t) => !countByTopic[t.slug])
      .map((t) => t.slug);
    expect(empty).toEqual([]);
  });
});

describe("retired topics stay usable as taxonomy", () => {
  const retired = topics.filter((t) => t.retiredTo);

  it("has at least one, so the assertions below are not vacuous", () => {
    expect(retired.length).toBeGreaterThan(0);
  });

  it.each(retired.map((t) => [t.slug, t] as const))(
    "%s points its links at the page that absorbed it",
    (_slug, topic) => {
      expect(topic.retiredTo).toMatch(/^\//);
      // Links, breadcrumbs and JSON-LD must target the destination, never the
      // retired route — otherwise every internal link lands on a 301.
      expect(topicHubPath(topic.slug)).toBe(topic.retiredTo);
      expect(topicHubPath(topic.slug)).not.toBe(`/topics/${topic.slug}`);
    },
  );

  it("keeps retired topics out of the live list", () => {
    expect(liveTopics.some((t) => t.retiredTo)).toBe(false);
  });

  it("still resolves articles that use a retired topic slug", () => {
    // Retiring a topic must not orphan the articles tagged with it — they keep
    // the slug for their category chip and breadcrumb.
    for (const topic of retired) {
      const tagged = articles.filter((a) => a.topic === topic.slug);
      for (const a of tagged) {
        expect(topicHubPath(a.topic)).toBe(topic.retiredTo);
      }
    }
  });
});
