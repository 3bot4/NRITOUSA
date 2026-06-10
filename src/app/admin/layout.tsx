import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import AccessDenied from "@/components/admin/AccessDenied";
import { adminGuard } from "@/lib/auth";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/community", label: "Create post" },
  { href: "/admin/community/posts", label: "Posts" },
  { href: "/admin/community/replies", label: "Replies" },
  { href: "/admin/community/starter-profiles", label: "Starter profiles" },
  { href: "/admin/community/categories", label: "Categories" },
  { href: "/admin/community/reports", label: "Reports" },
  { href: "/admin/community/seed", label: "Seed data" },
  { href: "/admin/community/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const guard = await adminGuard();
  if (guard.state === "unauthenticated") redirect("/login?next=/admin");
  if (guard.state === "forbidden") return <AccessDenied />;

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:flex-none">
          <div className="rounded-2xl border border-ink-900/5 bg-white p-3 shadow-card lg:sticky lg:top-20">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-400">
              Admin
            </p>
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-900/[0.04] hover:text-ink-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 border-t border-ink-900/5 px-3 py-2">
              <Link href="/community" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                ← View community
              </Link>
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}
