import type { Metadata } from "next";
import { Suspense } from "react";
import OrganizerReport from "@/components/nri-tax/OrganizerReport";

export const metadata: Metadata = {
  title: "Educational Report — NRI Wealth Checkup",
  robots: { index: false, follow: true },
};

export default function ReportPage() {
  return (
    <Suspense fallback={null}>
      <OrganizerReport />
    </Suspense>
  );
}
