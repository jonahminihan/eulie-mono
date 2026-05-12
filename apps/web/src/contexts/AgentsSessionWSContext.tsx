import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { BaseAgentSessionInfo } from "shared-types";
import type { AgentSessionEvent } from "@earendil-works/pi-coding-agent";
import { useAgentsWSContext } from "./AgentsContextWS";

type AgentsSessionWSContextType = {
  session: BaseAgentSessionInfo | null;
};

const AgentsSessionWSContext = createContext<AgentsSessionWSContextType>({
  session: null,
});

export const useAgentsSessionWSContext = () => {
  const context = useContext(AgentsSessionWSContext);
  if (!context) {
    throw new Error(
      "useAgentsSessionWSContext must be used within an AgentsSessionWSProvider",
    );
  }
  return context;
};

export const AgentsSessionWSProvider = ({
  sessionId,
  children,
}: {
  sessionId: string;
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<BaseAgentSessionInfo | null>(null);
  const { loadPiSession, subscribeToNewSessionEvent } = useAgentsWSContext();
  const sessionRef = useRef<BaseAgentSessionInfo | null>(null);
  const initRef = useRef(false);

  const init = async () => {
    loadPiSession(sessionId, (newSession: BaseAgentSessionInfo | null) => {
      if (newSession) {
        setSession(newSession);
      }
    });
    subscribeToNewSessionEvent(handleNewSessionEvent);
  };

  const handleNewSessionEvent = (
    event: AgentSessionEvent & { sessionId: string },
  ) => {
    const activeSession = sessionRef.current;
    if (event.sessionId !== activeSession?.sessionId) {
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
    <AgentsSessionWSContext.Provider value={{ session }}>
      {children}
    </AgentsSessionWSContext.Provider>
  );
};
