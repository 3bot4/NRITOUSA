import type { Metadata } from "next";
import OrganizerReport from "@/components/nri-tax/OrganizerReport";

export const metadata: Metadata = {
  title: "Educational Report — NRI Wealth Checkup",
  robots: { index: false, follow: false },
};

export default function ReportPage() {
  return <OrganizerReport />;
}
