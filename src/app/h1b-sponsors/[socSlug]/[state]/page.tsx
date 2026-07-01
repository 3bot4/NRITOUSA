import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import SponsorCard from "@/components/tools/h1b/SponsorCard";
import SponsorCaveat from "@/components/tools/h1b/SponsorCaveat";
import H1bCrossSell from "@/components/tools/h1b/H1bCrossSell";
import {
  pageMetadata,
  breadcrumbJsonLd,
  jsonLdGraph,
  absoluteUrl,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { formatUsd } from "@/lib/format";
import { stateName, isValidState } from "@/lib/h1b/states";
import {
  getSponsors,
  roleForSlug,
  topRoleStatePairs,
  type SponsorRow,
} from "@/lib/h1b/sponsors";

type Params = { socSlug: string; state: string };

/* ── static params ──────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const pairs = await topRoleStatePairs(500);
  return pairs.map((p) => ({ socSlug: p.socSlug, state: p.state.toLowerCase() }));
}

/* ── shared resolver ────────────────────────────────────────────────────── */

async function resolve(params: Params): Promise<{
  soc_title: string;
  soc_code: string;
  stateCode: string;
  sponsors: SponsorRow[];
} | null> {
  const stateCode = params.state.toUpperCase();
  if (!isValidState(stateCode)) return null;
  const role = await roleForSlug(params.socSlug);
  if (!role) return null;
  const sponsors = await getSponsors({
    socCodes: [role.soc_code],
    state: stateCode,
  });
  if (!sponsors.length) return null;
  return { ...role, stateCode, sponsors };
}

/* ── metadata ───────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const data = await resolve(params);
  if (!data) return { title: "H-1B sponsors not found", robots: { index: false } };

  const place = stateName(data.stateCode);
  const top = data.sponsors[0];
  return pageMetadata({
    title: `Top H-1B Sponsors for ${data.soc_title} in ${place} (2026)`,
    description: `The companies sponsoring the most H-1Bs for ${data.soc_title} roles in ${place}, ranked by certified LCA volume${
      top ? ` — led by ${top.employer}` : ""
    }. Median wages, wage levels, and filing trends from official DOL data.`,
    path: `/h1b-sponsors/${params.socSlug}/${data.stateCode.toLowerCase()}`,
  });
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default async function H1bSponsorsByRoleState({
  params,
}: {
  params: Params;
}) {
  const data = await resolve(params);
  if (!data) notFound();

  const place = stateName(data.stateCode);
  const { soc_title, sponsors } = data;
  const path = `/h1b-sponsors/${params.socSlug}/${data.stateCode.toLowerCase()}`;

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "H-1B Sponsor Finder", url: "/tools/h1b-sponsor-finder" },
    { name: `${soc_title} · ${data.stateCode}`, url: path },
  ];

  const wages = sponsors
    .map((s) => s.median_wage)
    .filter((w): w is number => w != null)
    .sort((a, b) => a - b);
  const medianWage = wages.length ? wages[Math.floor(wages.length / 2)] : null;

  const jsonLd = jsonLdGraph(
    {
      "@type": "ItemList",
      name: `Top H-1B sponsors for ${soc_title} in ${place}`,
      numberOfItems: sponsors.length,
      itemListElement: sponsors.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.employer,
      })),
    },
    breadcrumbJsonLd(crumbs),
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name: `Top H-1B Sponsors for ${soc_title} in ${place}`,
      isPartOf: { "@id": `${site.url}/#website` },
      inLanguage: "en-US",
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-ink-900/5 bg-white pt-6 pb-7 sm:pt-8">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="flex flex-nowrap items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-ink-400 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {crumbs.map((c, i) => (
              <span key={c.url} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i < crumbs.length - 1 ? (
                  <Link href={c.url} className="hover:text-ink-600">
                    {c.name}
                  </Link>
                ) : (
                  <span className="text-ink-600">{c.name}</span>
                )}
              </span>
            ))}
          </nav>

          <p className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-600">
            H-1B Sponsor Finder
          </p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl">
            Top H-1B sponsors for {soc_title} in {place}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-snug text-ink-600">
            {sponsors.length} employer{sponsors.length === 1 ? "" : "s"} filed
            certified H-1B Labor Condition Applications for {soc_title} roles in{" "}
            {place} over the last 12 months
            {medianWage != null && (
              <>
                , at a median offered wage of{" "}
                <strong className="font-semibold text-ink-900">
                  {formatUsd(medianWage)}
                </strong>
              </>
            )}
            . Ranked by certified LCA volume — the strongest available signal of
            who actually sponsors this role here.
          </p>
        </Container>
      </header>

      {/* Sponsors */}
      <section className="py-8 sm:py-10">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="space-y-3">
              {sponsors.map((s, i) => (
                <SponsorCard key={`${s.employer}-${i}`} sponsor={s} rank={i + 1} />
              ))}
            </div>

            <SponsorCaveat />

            <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5 text-sm">
              <p className="font-semibold text-brand-900">
                Searching for a different role or state?
              </p>
              <p className="mt-1 text-brand-800/80">
                Use the interactive H-1B Sponsor Finder to search any job title
                across all 50 states.
              </p>
              <Link
                href={`/tools/h1b-sponsor-finder?role=${encodeURIComponent(
                  soc_title
                )}&state=${data.stateCode}`}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Open the sponsor finder →
              </Link>
            </div>

            <div className="pt-4">
              <H1bCrossSell />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
