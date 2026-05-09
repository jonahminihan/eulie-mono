import {
  AgentSession,
  AuthStorage,
  createAgentSession,
  CreateAgentSessionOptions,
  ModelRegistry,
  PromptOptions,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { BrowserWindow } from "electron";
import {
  addSession,
  getActiveSessionById,
  getSessionById,
} from "../../stores/piStore";

// Set up credential storage and model registry
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);

export const createPiSession = async (
  mainWindow: BrowserWindow,
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
      mainWindow.webContents.send(
        "pi:messageDelta",
        event.assistantMessageEvent.delta,
      );
    }
    mainWindow.webContents.send("pi:onNewSessionEvent", {
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

export const loadPiSession = async (
  mainWindow: BrowserWindow,
  sessionId: string,
) => {
  const session = getActiveSessionById(sessionId);
  if (session) {
    return convertSessionToBaseAgentSessionInfo(session);
  }
  const sessionInfo = getSessionById(sessionId);
  if (sessionInfo) {
    return await createPiSession(mainWindow, {
      sessionManager: SessionManager.open(sessionInfo.path),
    });
  }
  return null;
};

export const getPiSessions = async () => {
  return await SessionManager.listAll();
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
