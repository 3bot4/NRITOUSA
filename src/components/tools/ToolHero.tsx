import Link from "next/link";
import Container from "@/components/Container";
import type { ToolMeta } from "@/lib/tools";

/** Gradient hero for tool pages — mirrors the /calculators/[slug] hero. */
export default function ToolHero({
  tool,
  children,
}: {
  tool: ToolMeta;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br ${tool.accent}`}
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
          <Link href="/tools" className="hover:text-white">
            Tools
          </Link>
          <span aria-hidden>/</span>
          <span className="text-white">{tool.label}</span>
        </nav>
        <div className="mt-5 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
            {tool.icon}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {tool.group}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {tool.title}
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
          {tool.description}
        </p>
        {children}
      </Container>
    </section>
  );
}
