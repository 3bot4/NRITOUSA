import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("new-jersey");

export default function Page() {
  return <StatePopulationPage slug="new-jersey" />;
}
