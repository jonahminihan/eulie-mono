import { AgentsProvider } from "@/contexts/AgentsContext";
import AgentAppFrame from "../../components/agent-app-frame/AgentAppFrame";
import AgentChat from "../../components/agent-chat/AgentChat";
import AgentDock from "@/components/agent-dock/AgentDock";
// import SubAgentChatMessage from "/Users/jonah/.pi/agent/extensions/eu-subagents/src/components/SubAgentChatMessage";

const AgentsPage = () => {
  return (
    <AgentsProvider>
      <AgentAppFrame>
        <AgentChat />
        {/* <AgentDock /> */}
      </AgentAppFrame>
    </AgentsProvider>
  );
};

export default AgentsPage;
