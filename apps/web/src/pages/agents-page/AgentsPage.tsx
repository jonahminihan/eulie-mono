import { AgentsProvider } from "@/contexts/AgentsContext";
import AgentAppFrame from "../../components/agent-app-frame/AgentAppFrame";
import AgentChat from "../../components/agent-chat/AgentChat";

const AgentsPage = () => {
  return (
    <AgentsProvider>
      <AgentAppFrame>
        <AgentChat />
      </AgentAppFrame>
    </AgentsProvider>
  );
};

export default AgentsPage;
