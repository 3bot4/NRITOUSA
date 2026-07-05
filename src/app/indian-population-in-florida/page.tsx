import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("florida");

export default function Page() {
  return <StatePopulationPage slug="florida" />;
}
