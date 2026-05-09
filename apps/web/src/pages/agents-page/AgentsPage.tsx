import { AgentsProvider } from "@/contexts/AgentsContext";
import AgentAppFrame from "../../components/agent-app-frame/AgentAppFrame";
import AgentDock from "@/components/agent-dock/AgentDock";
import { AgentsDockProvider } from "@/contexts/AgentsDockContext";

const AgentsPage = () => {
  return (
    <AgentsDockProvider>
      <AgentsProvider>
        <AgentAppFrame>
          <AgentDock />
        </AgentAppFrame>
      </AgentsProvider>
    </AgentsDockProvider>
  );
};

export default AgentsPage;
