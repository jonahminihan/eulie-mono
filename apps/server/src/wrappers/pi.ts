import {
  AgentSession,
  AuthStorage,
  createAgentSession,
  type CreateAgentSessionOptions,
  ModelRegistry,
  type PromptOptions,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import {
  addSession,
  getActiveSessionById,
  getExtensionToolUIs,
  getSessionById,
  setExtensions,
} from "../stores/piStore.ts";
import { getPiCandidatePaths } from "../utils/piPaths.ts";
import { getExtensions } from "../utils/extensions.ts";
import type { Socket } from "socket.io";

// Set up credential storage and model registry
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);

export const createPiSession = async (
  socket: Socket,
  createAgentSessionOptions: CreateAgentSessionOptions = {},
) => {
  const { session } = await createAgentSession({
    ...createAgentSessionOptions,
    authStorage,
    modelRegistry,
  });

  const extensionPaths = session.extensionRunner.getExtensionPaths();
  console.log("extensionPaths", extensionPaths);
  const candidatePaths = await getPiCandidatePaths();
  console.log("candidatePaths", candidatePaths);
  const extensions = await getExtensions();
  console.log("extensions", extensions);

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

export const loadPiExtensions = async () => {
  const extensions = await getExtensions();
  setExtensions(extensions);
};

export const getPiExtensionToolUIs = async () => {
  return await getExtensionToolUIs();
};

export const getPiExtensionUIData = async () => {
  console.log("getPiExtensionUIData", {
    toolUIs: (await getExtensionToolUIs()).map((t: any) => ({
      toolName: t.toolName,
      component: t.component,
    })),
  });
  console.log("getPiExtensionUIData with stringified component", {
    toolUIs: (await getExtensionToolUIs()).map((t: any) => ({
      toolName: t.toolName,
      component: t.component.toString(),
    })),
  });
  return {
    toolUIs: (await getExtensionToolUIs()).map((t: any) => ({
      toolName: t.toolName,
      component: t.component.toString(),
    })),
  };
};
