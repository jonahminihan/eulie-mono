import {
  AgentSession,
  type SessionInfo,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { createStore } from "@tanstack/store";

type PiStoreType = {
  activeSessions: AgentSession[];
  historicalSessions: SessionInfo[];
  extensions: {};
};

export const piStore = createStore<PiStoreType>({
  activeSessions: [],
  historicalSessions: [],
  extensions: {},
});

export const initPiStore = async () => {
  const sessions = await SessionManager.listAll();
  piStore.setState((prev) => ({
    ...prev,
    historicalSessions: sessions,
  }));
};

initPiStore();

export const addSession = (session: AgentSession) => {
  piStore.setState((prev) => ({
    ...prev,
    activeSessions: [...prev.activeSessions, session],
  }));
};

export const setExtensions = (extensions: { toolUIs: any[] }) => {
  piStore.setState((prev) => ({
    ...prev,
    extensions: extensions,
  }));
};

export const getExtensions = () => {
  return piStore.state.extensions;
};

export const getExtensionToolUIs = () => {
  return (piStore.state.extensions as { toolUIs: any[] }).toolUIs;
};

export const getActiveSessions = () => {
  return piStore.state.activeSessions;
};

export const getSessions = () => {
  return piStore.state.historicalSessions;
};

export const getSessionById = (sessionId: string) => {
  return piStore.state.historicalSessions.find(
    (session) => session.id === sessionId,
  );
};

export const getActiveSessionById = (sessionId: string) => {
  return piStore.state.activeSessions.find(
    (session) => session.sessionId === sessionId,
  );
};
