import type {
  AgentSessionEvent,
  PromptOptions,
  SessionInfo,
} from "@earendil-works/pi-coding-agent";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { BaseAgentSessionInfo } from "shared-types";
import { useAgentsDock } from "./AgentsDockContext";
import type { ImageContent } from "@earendil-works/pi-ai";

export type Project = {
  name: string;
  path: string;
  sessions: SessionInfo[];
};

export type Session = {
  id: string;
};

type AgentsContextType = {
  projects: Project[];
  activeSession: BaseAgentSessionInfo | null;
  setActiveSession: (session: BaseAgentSessionInfo | null) => void;
  addProject: (project: Project) => void;
  selectAndAddProject: () => Promise<void>;
  createSession: (project: Project) => void;
  loadPiSession: (sessionId: string) => Promise<BaseAgentSessionInfo | null>;
  promptSession: (
    sessionId: string,
    message: string,
    options?: PromptOptions,
  ) => Promise<void>;
};

const AgentsContext = createContext<AgentsContextType>({
  projects: [],
  activeSession: null,
  setActiveSession: () => {},
  addProject: () => {},
  selectAndAddProject: () => Promise.resolve(),
  createSession: () => {},
  loadPiSession: () => Promise.resolve(null),
  promptSession: () => Promise.resolve(),
});

export const useAgentsContext = () => {
  const context = useContext(AgentsContext);
  if (!context) {
    throw new Error("useAgents must be used within an AgentsProvider");
  }
  return context;
};

export const AgentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [projectMap, setProjectMap] = useState<Record<string, Project>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeSession, setActiveSession] =
    useState<BaseAgentSessionInfo | null>(null);
  const initRef = useRef(false);
  const activeSessionRef = useRef<BaseAgentSessionInfo | null>(null);
  const { addTab } = useAgentsDock();

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const selectProjectDir = async () => {
    return await window.electronAPI.selectDir();
  };

  const selectAndAddProject = async () => {
    const path = await selectProjectDir();
    if (path) {
      addProject({ name: path.split("/").pop() || "", path, sessions: [] });
    }
  };

  const createSession = async (project: Project) => {
    const session = await window.electronAPI.createPiSession(project.path);
    if (session) {
      const newSession: SessionInfo = {
        ...session,
        path: project.path,
        id: session.sessionId,
        cwd: project.path,
        created: new Date(),
        modified: new Date(),
        messageCount: 0,
        firstMessage: undefined,
        allMessagesText: undefined,
      };
      const newProjectMap = {
        ...projectMap,
        [project.path]: {
          ...project,
          sessions: [...project.sessions, newSession],
        },
      };
      setProjectMap(newProjectMap);
      setProjects(Object.values(newProjectMap));
      setActiveSession(session);
    }
    return session;
  };

  const fetchPiSessions = async () => {
    const sessions = await window.electronAPI.getPiSessions();
    console.log("sessions", sessions);
    const newProjectMap = sessions.reduce((acc, session) => {
      //@ts-ignore
      if (!acc[session.cwd]) {
        //@ts-ignore
        acc[session.cwd] = {
          //@ts-ignore
          name: session.cwd.split("/").pop() || "",
          //@ts-ignore
          path: session.cwd,
          sessions: [],
        };
      }
      //@ts-ignore
      acc[session.cwd].sessions.push(session);
      return acc;
    }, {});
    setProjectMap(newProjectMap);
    setProjects(Object.values(newProjectMap));
  };

  const loadPiSession = async (sessionId: string) => {
    const session = await window.electronAPI.loadPiSession(sessionId);
    if (session) {
      setActiveSession(session);
      addTab({
        id: session.sessionId,
        component: "default",
        title: (session.name || session.firstMessage || "New Session").slice(
          0,
          7,
        ),
        renderer: "always",
      });
    }
    return session;
  };

  // const handleNewSessionEvent = (
  //   event: AgentSessionEvent & { sessionId: string },
  // ) => {
  //   console.log("event", event);
  //   const activeSession = activeSessionRef.current;
  //   if (event.sessionId !== activeSession?.sessionId) {
  //     console.log("not the active session - activeSession", activeSession);
  //     return;
  //   }
  //   if (event.type === "message_start") {
  //     activeSession?.messages.push(event.message);
  //   } else if (event.type === "message_update") {
  //     activeSession.messages[activeSession.messages.length - 1] = event.message;
  //   } else if (event.type === "message_end") {
  //     activeSession.messages[activeSession.messages.length - 1] = event.message;
  //   }
  //   console.log("new activeSession", activeSession);
  //   setActiveSession({ ...activeSession });
  // };

  const promptSession = async (
    sessionId: string,
    message: string,
    options?: PromptOptions,
  ) => {
    return await window.electronAPI.promptSession(sessionId, message, options);
  };

  useLayoutEffect(() => {
    if (!initRef.current) {
      console.log("fetchPiSessions");
      initRef.current = true;
      fetchPiSessions();
      // window.electronAPI.onNewSessionEvent(handleNewSessionEvent);
    }
  }, []);

  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  return (
    <AgentsContext.Provider
      value={{
        projects,
        addProject,
        selectAndAddProject,
        createSession,
        activeSession,
        setActiveSession,
        loadPiSession,
        promptSession,
      }}
    >
      {children}
    </AgentsContext.Provider>
  );
};
