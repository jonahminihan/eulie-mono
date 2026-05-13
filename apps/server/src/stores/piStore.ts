import {
  AgentSession,
  type SessionInfo,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { createStore } from "@tanstack/store";
import type { EuExtensionPath } from "shared-types";
import { getExtensionsPaths } from "../utils/extensions.ts";

type PiStoreType = {
  activeSessions: AgentSession[];
  historicalSessions: SessionInfo[];
  extensions: EuExtensionPath[];
};

export const piStore = createStore<PiStoreType>({
  activeSessions: [],
  historicalSessions: [],
  extensions: [],
});

export const initPiStore = async () => {
  const sessions = await SessionManager.listAll();
  const extensions = await getExtensionsPaths();
  piStore.setState((prev) => ({
    ...prev,
    historicalSessions: sessions,
    extensions: extensions,
  }));
};

initPiStore();

export const addSession = (session: AgentSession) => {
  piStore.setState((prev) => ({
    ...prev,
    activeSessions: [...prev.activeSessions, session],
  }));
};

export const setExtensions = (extensions: EuExtensionPath[]) => {
  piStore.setState((prev) => ({
    ...prev,
    extensions: extensions,
  }));
};

export const getExtensions = () => {
  return piStore.state.extensions;
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
