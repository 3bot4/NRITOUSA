import Link from "next/link";
import Container from "@/components/Container";
import type { EduCalc } from "@/lib/education";

/** Gradient hero for /education calculator pages — mirrors ToolHero. */
export default function EduHero({
  calc,
  children,
}: {
  calc: EduCalc;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${calc.accent}`}
    >
      <div className="absolute inset-0 bg-ink-900/40" />
      <Container className="relative py-14 sm:py-16">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-white/80"
        >
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/education" className="hover:text-white">
            Education
          </Link>
          <span aria-hidden>/</span>
          <span className="text-white">{calc.label}</span>
        </nav>
        <div className="mt-5 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
            {calc.icon}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              US Education Hub
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {calc.title}
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
          {calc.description}
        </p>
        {children}
      </Container>
    </section>
  );
}
