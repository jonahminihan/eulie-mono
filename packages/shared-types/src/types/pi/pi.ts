import type {
  AgentMessage,
  AgentTool,
  ThinkingLevel,
} from "@earendil-works/pi-agent-core";
import type { Model } from "@earendil-works/pi-ai";

export interface BaseAgentSessionInfo {
  model: Model<any>;
  thinkingLevel: ThinkingLevel;
  tools: AgentTool<any>[];
  messages: AgentMessage[];
  sessionId: string;
  name: string | undefined;
  firstMessage: string | undefined;
}
