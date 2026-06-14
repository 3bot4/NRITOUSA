import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Icon, { type IconName } from "@/components/Icon";
import ContributeForm from "@/components/contributors/ContributeForm";

const title = "Write for Us — Share Your NRI Story";
const description =
  "Are you an immigrant IT professional in the US? Share your H-1B, layoff, salary-negotiation, or relocation story — and get a byline and author page.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: "/contribute",
});

const benefits: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "user",
    title: "Your name, your credit",
    body: "Every story is published under your byline, with your photo and a short bio. The work is yours.",
  },
  {
    icon: "pen",
    title: "Your own author page",
    body: "A dedicated profile listing all your articles, linked to your LinkedIn — your home on the site.",
  },
  {
    icon: "users",
    title: "Reach the community",
    body: "NRIs are actively searching for the exact answers you lived. Your experience meets them at the right moment.",
  },
  {
    icon: "star",
    title: "Build your personal brand",
    body: "A polished, published portfolio piece you can proudly share on LinkedIn and beyond.",
  },
];

const topics = [
  "How I navigated an H-1B transfer",
  "Negotiating tech salaries in Silicon Valley",
  "Surviving a layoff on a 60-day window",
  "L1 to H-1B internal transfer",
  "First 90 days in the US",
  "Green card journey lessons",
];

const guidelines = [
  "Write in the first person about your real, lived experience.",
  "Plain English — clear and conversational, no corporate jargon.",
  "Original content only, written by you and not published elsewhere.",
  "Be specific and practical: timelines, exact steps, and the mistakes you'd warn others about.",
  "Aim for roughly 800+ words so there's room for real detail.",
  "Light editing may be applied for clarity, flow, and house style.",
  "Self-promotional links live in your author bio, not the article body.",
  "All external links are vetted before publishing.",
];

export default function ContributePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_-5%,rgba(53,99,255,0.10),transparent)]" />
        <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Icon name="megaphone" className="h-4 w-4" />
              Write for NRI to USA
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
              Share Your Journey. Help Thousands of NRIs Who Are{" "}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                One Step Behind You.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
              The H-1B transfer you pulled off. The layoff you survived inside a
              60-day window. The offer you negotiated. Right now, someone is
              searching for exactly that at midnight — and your real experience
              is the answer they can&apos;t find anywhere else.
            </p>
            <a
              href="#form"
              className="mt-8 inline-block rounded-xl bg-brand-600 px-8 py-4 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
            >
              Share your story
            </a>
          </div>
        </Container>
      </section>

      {/* WHY WRITE WITH US */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">
              Why write with us
            </h2>
            <p className="mt-3 text-ink-500">
              This is an invitation, not an application. Here&apos;s what you get
              for sharing what you learned the hard way.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex flex-col rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={b.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink-900">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TOPICS WE'RE LOOKING FOR */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">
              Topics we&apos;re looking for
            </h2>
            <p className="mt-3 text-ink-500">
              Career, IT, and visa-journey stories — the lived experience only
              you can tell.
            </p>
          </div>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {topics.map((t) => (
              <li
                key={t}
                className="rounded-full border border-brand-200 bg-brand-50 px-5 py-2.5 text-sm font-medium text-brand-700"
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-accent-400/10 px-5 py-4 text-center text-sm text-ink-600">
            <strong className="font-semibold text-ink-800">
              One thing we keep in-house:
            </strong>{" "}
            finance, tax, and investment guidance is written by our team. We&apos;d
            love your career, visa, and relocation experiences instead.
          </p>
        </Container>
      </section>

      {/* GUIDELINES */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">
              A few simple guidelines
            </h2>
            <ul className="mt-8 space-y-4">
              {guidelines.map((g) => (
                <li key={g} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="leading-relaxed text-ink-700">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* SUBMISSION FORM */}
      <section id="form" className="scroll-mt-20 bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">
                Tell us your story
              </h2>
              <p className="mt-3 text-ink-500">
                Fill this in and we&apos;ll be in touch. No headshot needed yet —
                we&apos;ll ask once your piece is accepted.
              </p>
            </div>
            <div className="mt-10 rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
              <ContributeForm />
            </div>
          </div>
        </Container>
      </section>

      {/* CLOSING */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl bg-ink-900 px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Published contributors get a home here
            </h2>
            <p className="mt-3 text-ink-400">
              Accepted writers appear in our Contributor Directory with their
              photo, bio, and links — and a personal author page collecting all
              their work.
            </p>
            <Link
              href="/contributors"
              className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-ink-900 transition-transform hover:-translate-y-0.5"
            >
              Meet our contributors
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
