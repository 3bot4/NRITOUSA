import { describe, expect, it } from "vitest";
import { hasPrimarySource } from "@/lib/sourceVerification";
import { articles } from "@/lib/articles";

describe("hasPrimarySource", () => {
  it("recognises US federal sources", () => {
    for (const url of [
      "https://www.irs.gov/forms-pubs/about-form-w-8ben",
      "https://www.ssa.gov/international/",
      "https://www.uscis.gov/i-90",
      "https://travel.state.gov/visa-bulletin",
      "https://i94.cbp.dhs.gov/",
      "https://www.federalregister.gov/documents/2026/01/01/x",
      "https://uscode.house.gov/view.xhtml?req=granuleid:USC-x",
    ]) {
      expect(hasPrimarySource(`See [source](${url}) for detail.`), url).toBe(true);
    }
  });

  it("recognises Indian government and central-bank sources", () => {
    for (const url of [
      "https://www.incometax.gov.in/iec/foportal/",
      "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx",
      "https://www.cbic.gov.in/entities/view-sticky-post",
      "https://passport.nic.in/",
    ]) {
      expect(hasPrimarySource(`Per the rules at ${url}.`), url).toBe(true);
    }
  });

  it("does NOT count own-site links, affiliate links, or ordinary domains", () => {
    for (const url of [
      "https://www.nritousa.com/articles/fbar-fatca-nri-guide",
      "https://www.taxsaveiq.com/?utm_source=nritousa",
      "https://optionleo.com",
      "https://www.stockleo.com",
      "https://www.investopedia.com/terms/f/fbar.asp",
      "https://www.governmentjobs.example.com/notgov",
    ]) {
      expect(hasPrimarySource(`Read more at ${url}.`), url).toBe(false);
    }
  });

  it("is false for empty or missing content", () => {
    expect(hasPrimarySource("")).toBe(false);
    expect(hasPrimarySource(undefined)).toBe(false);
    expect(hasPrimarySource(null)).toBe(false);
    expect(hasPrimarySource("No links here at all.")).toBe(false);
  });

  /**
   * The badge is the point of the helper: it must track what the corpus
   * actually cites. If this count moves, a citation was added or removed —
   * which is fine, but it should be a deliberate edit, not a surprise.
   */
  it("gates the Sources-verified badge to articles that genuinely cite one", () => {
    const cited = articles.filter((a) => hasPrimarySource(a.content));
    expect(cited.length).toBeGreaterThan(0);
    expect(cited.length).toBeLessThan(articles.length);
    // Every article that cites nothing must not claim verification.
    for (const a of articles) {
      expect(hasPrimarySource(a.content)).toBe(
        /https?:\/\/[^\s")]*?(\.gov|\.nic\.in|rbi\.org\.in)/i.test(a.content),
      );
    }
  });
});
