import Link from "next/link";
import Container from "@/components/Container";

export default function AccessDenied() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <h1 className="text-2xl font-extrabold text-rose-700">Access denied</h1>
        <p className="mt-2 text-rose-900/80">
          You don&apos;t have permission to view the admin area. This section is
          restricted to administrators.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700">
          Back to home
        </Link>
      </div>
    </Container>
  );
}
