import { AgentsProvider } from "@/contexts/AgentsContext";
import AgentAppFrame from "../../components/agent-app-frame/AgentAppFrame";
import AgentChat from "../../components/agent-chat/AgentChat";
import AgentDock from "@/components/agent-dock/AgentDock";
import { AgentsDockProvider } from "@/contexts/AgentsDockContext";
// import SubAgentChatMessage from "/Users/jonah/.pi/agent/extensions/eu-subagents/src/components/SubAgentChatMessage";

const AgentsPage = () => {
  return (
    <AgentsDockProvider>
      <AgentsProvider>
        <AgentAppFrame>
          {/* <AgentChat /> */}
          <AgentDock />
        </AgentAppFrame>
      </AgentsProvider>
    </AgentsDockProvider>
  );
};

export default AgentsPage;
