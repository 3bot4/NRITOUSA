/** Honest "what an LCA count does and doesn't mean" microcopy. Shared by the
   interactive finder and the programmatic SEO pages. No directive — renders on
   the server. */
export default function SponsorCaveat() {
  return (
    <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-50/70 px-4 py-3 text-xs leading-relaxed text-ink-700 sm:px-5 sm:py-4">
      <p className="font-semibold text-ink-900">How to read these numbers</p>
      <p className="mt-1">
        An <strong>LCA (Labor Condition Application)</strong> is an attestation an
        employer files with the Department of Labor <em>before</em> the USCIS
        petition. A certified LCA is <strong>not</strong> a petition approval, a
        visa, or a hire — counts are a <strong>sponsorship signal</strong>, not a
        guarantee that this employer will sponsor you. One LCA can also cover
        multiple worker positions. This data is sourced from DOL quarterly
        disclosures and lags real filings by about a quarter. Always verify a
        specific employer&apos;s current sponsorship with them directly.
      </p>
    </div>
  );
}
