import type {
  AgentMessage,
  AgentTool,
  ThinkingLevel,
} from "@earendil-works/pi-agent-core";
import type { Model, ModelThinkingLevel } from "@earendil-works/pi-ai";

export type AvailableModelInfo = Pick<
  Model<any>,
  "id" | "name" | "provider" | "input" | "reasoning"
> & {
  key: string;
  thinkingLevels: ModelThinkingLevel[];
};

export type AvailableModelsResponse = Record<string, AvailableModelInfo>;

export interface ModelThinkingState {
  model: Model<any> | undefined;
  thinkingLevel: ThinkingLevel;
  error?: string;
}

export interface BaseAgentSessionInfo {
  model: Model<any>;
  thinkingLevel: ThinkingLevel;
  tools: AgentTool<any>[];
  messages: AgentMessage[];
  sessionId: string;
  name: string | undefined;
  firstMessage: string | undefined;
}
