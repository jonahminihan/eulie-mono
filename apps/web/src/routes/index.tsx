import AgentsPage from "@/pages/agents-page/AgentsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <AgentsPage />;
}
