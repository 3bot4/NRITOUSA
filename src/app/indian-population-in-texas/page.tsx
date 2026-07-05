import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("texas");

export default function Page() {
  return <StatePopulationPage slug="texas" />;
}
