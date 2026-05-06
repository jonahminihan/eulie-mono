import type {
  AgentMessage,
  AgentTool,
  ThinkingLevel,
} from "@mariozechner/pi-agent-core";
import type { Model } from "@mariozechner/pi-ai";

export interface BaseAgentSessionInfo {
  model: Model<any>;
  thinkingLevel: ThinkingLevel;
  tools: AgentTool<any>[];
  messages: AgentMessage[];
  sessionId: string;
}
