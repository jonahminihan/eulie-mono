import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { BaseAgentSessionInfo } from "shared-types";
import { useAgentsContext } from "./AgentsContext";
import type { AgentSessionEvent } from "@earendil-works/pi-coding-agent";

type AgentsSessionContextType = {
  session: BaseAgentSessionInfo | null;
};

const AgentsSessionContext = createContext<AgentsSessionContextType>({
  session: null,
});

export const useAgentsSession = () => {
  const context = useContext(AgentsSessionContext);
  if (!context) {
    throw new Error(
      "useAgentsSession must be used within an AgentsSessionProvider",
    );
  }
  return context;
};

export const AgentsSessionProvider = ({
  sessionId,
  children,
}: {
  sessionId: string;
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<BaseAgentSessionInfo | null>(null);
  const { loadPiSession } = useAgentsContext();
  const sessionRef = useRef<BaseAgentSessionInfo | null>(null);
  const initRef = useRef(false);

  const init = async () => {
    const newSession = await loadPiSession(sessionId);
    if (newSession) {
      setSession(newSession);
    }
    window.electronAPI.onNewSessionEvent(handleNewSessionEvent);
  };

  const handleNewSessionEvent = (
    event: AgentSessionEvent & { sessionId: string },
  ) => {
    // console.log("event", event);
    const activeSession = sessionRef.current;
    if (event.sessionId !== activeSession?.sessionId) {
      console.log("not the active session - activeSession", activeSession);
      return;
    }
    if (event.type === "message_start") {
      activeSession?.messages.push(event.message);
    } else if (event.type === "message_update") {
      activeSession.messages[activeSession.messages.length - 1] = event.message;
    } else if (event.type === "message_end") {
      activeSession.messages[activeSession.messages.length - 1] = event.message;
    }
    setSession({ ...activeSession });
  };

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      init();
    }
  }, [sessionId]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  return (
    <AgentsSessionContext.Provider value={{ session }}>
      {children}
    </AgentsSessionContext.Provider>
  );
};
