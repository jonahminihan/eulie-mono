import {
  AgentSession,
  SessionInfo,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { createStore } from "@tanstack/store";

type PiStoreType = {
  activeSessions: AgentSession[];
  historicalSessions: SessionInfo[];
};

export const piStore = createStore<PiStoreType>({
  activeSessions: [],
  historicalSessions: [],
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
