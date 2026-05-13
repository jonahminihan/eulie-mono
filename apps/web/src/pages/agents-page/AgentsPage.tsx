import AgentAppFrame from "../../components/agent-app-frame/AgentAppFrame";
import AgentDock from "@/components/agent-dock/AgentDock";
import { AgentsDockProvider } from "@/contexts/AgentsDockContext";
import { AgentsWSProvider } from "@/contexts/AgentsContextWS";

const AgentsPage = () => {
  return (
    <AgentsDockProvider>
      <AgentsWSProvider>
        <AgentAppFrame>
          <AgentDock />
        </AgentAppFrame>
      </AgentsWSProvider>
    </AgentsDockProvider>
  );
};

export default AgentsPage;
