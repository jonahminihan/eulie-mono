import {
  AgentSession,
  AuthStorage,
  createAgentSession,
  type CreateAgentSessionOptions,
  ModelRegistry,
  type PromptOptions,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import type { ThinkingLevel } from "@earendil-works/pi-agent-core";
import { getSupportedThinkingLevels } from "@earendil-works/pi-ai";
import type {
  AvailableModelInfo,
  AvailableModelsResponse,
  ModelThinkingState,
} from "shared-types";
import {
  addSession,
  getActiveSessionById,
  getSessionById,
} from "../stores/piStore.ts";
import type { Socket } from "socket.io";

// Set up credential storage and model registry
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);

const modelKey = (provider: string, modelId: string) =>
  `${provider}/${modelId}`;

const toAvailableModelInfo = (
  model: ReturnType<typeof modelRegistry.getAll>[number],
): AvailableModelInfo => ({
  key: modelKey(model.provider, model.id),
  id: model.id,
  name: model.name,
  provider: model.provider,
  input: model.input,
  reasoning: model.reasoning,
  thinkingLevels: getSupportedThinkingLevels(model),
});

const getSessionModelThinkingState = (
  sessionId: string,
  error?: string,
): ModelThinkingState => {
  const session = getActiveSessionById(sessionId);
  return {
    model: session?.model,
    thinkingLevel: session?.thinkingLevel ?? "off",
    ...(error ? { error } : {}),
  };
};

export const createPiSession = async (
  socket: Socket,
  createAgentSessionOptions: CreateAgentSessionOptions = {},
) => {
  const { session } = await createAgentSession({
    ...createAgentSessionOptions,
    authStorage,
    modelRegistry,
  });

  session.subscribe((event) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      console.log(
        "event.assistantMessageEvent.delta",
        event.assistantMessageEvent.delta,
      );
      //   socket.emit("pi:messageDelta", event.assistantMessageEvent.delta);
    }
    socket.emit("pi:onNewSessionEvent", {
      ...event,
      sessionId: session.sessionId,
    });
  });

  addSession(session);
  return convertSessionToBaseAgentSessionInfo(session);
};

export const deletePiSession = async (sessionId: string) => {
  // return await SessionManager.removeSession(sessionId);
};

export const loadPiSession = async (socket: Socket, sessionId: string) => {
  const session = getActiveSessionById(sessionId);
  if (session) {
    return convertSessionToBaseAgentSessionInfo(session);
  }
  const sessionInfo = getSessionById(sessionId);
  if (sessionInfo) {
    return await createPiSession(socket, {
      sessionManager: SessionManager.open(sessionInfo.path),
    });
  }
  return null;
};

export const getPiSessions = async () => {
  return await SessionManager.listAll();
};

export const getAvailableModels = (): AvailableModelsResponse => {
  const availableModels = modelRegistry.getAvailable();
  const models =
    availableModels.length > 0 ? availableModels : modelRegistry.getAll();

  return models.reduce<AvailableModelsResponse>((acc, model) => {
    acc[modelKey(model.provider, model.id)] = toAvailableModelInfo(model);
    return acc;
  }, {});
};

export const setPiSessionModel = async (
  sessionId: string,
  modelKeyValue: string,
): Promise<ModelThinkingState> => {
  const session = getActiveSessionById(sessionId);
  if (!session) {
    return getSessionModelThinkingState(sessionId, "Session not found");
  }

  if (!modelKeyValue) {
    return getSessionModelThinkingState(sessionId, "Model is required");
  }

  const separatorIndex = modelKeyValue.indexOf("/");
  const provider = modelKeyValue.slice(0, separatorIndex);
  const modelId = modelKeyValue.slice(separatorIndex + 1);
  const model =
    separatorIndex > -1 ? modelRegistry.find(provider, modelId) : undefined;

  if (!model) {
    return getSessionModelThinkingState(sessionId, "Model not found");
  }

  try {
    await session.setModel(model);
    return getSessionModelThinkingState(sessionId);
  } catch (error) {
    return getSessionModelThinkingState(
      sessionId,
      error instanceof Error ? error.message : "Failed to set model",
    );
  }
};

export const setPiSessionThinkingLevel = (
  sessionId: string,
  thinkingLevel: ThinkingLevel,
): ModelThinkingState => {
  const session = getActiveSessionById(sessionId);
  if (!session) {
    return getSessionModelThinkingState(sessionId, "Session not found");
  }

  if (!thinkingLevel) {
    return getSessionModelThinkingState(
      sessionId,
      "Thinking level is required",
    );
  }

  try {
    session.setThinkingLevel(thinkingLevel);
    return getSessionModelThinkingState(sessionId);
  } catch (error) {
    return getSessionModelThinkingState(
      sessionId,
      error instanceof Error ? error.message : "Failed to set thinking level",
    );
  }
};

export const getPiSessionById = (sessionId: string) => {
  return getActiveSessionById(sessionId);
};

const convertSessionToBaseAgentSessionInfo = (session: AgentSession) => {
  const sessionInfo = getSessionById(session.sessionId);
  return {
    model: session.model,
    thinkingLevel: session.thinkingLevel,
    tools: session.agent.state.tools.map((tool) => ({
      ...tool,
      // @ts-ignore
      execute: undefined,
      // @ts-ignore
      prepareArguments: undefined,
    })),
    messages: session.messages,
    sessionId: session.sessionId,
    name: sessionInfo?.name,
    firstMessage: sessionInfo?.firstMessage,
  };
};

export const promptSession = async (
  sessionId: string,
  message: string,
  options?: PromptOptions,
) => {
  const session = getActiveSessionById(sessionId);
  if (session) {
    return await session.prompt(message, options);
  }
  return;
};
