import type {
  PromptOptions,
  SessionInfo,
} from "@earendil-works/pi-coding-agent";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { BaseAgentSessionInfo } from "shared-types";
import { useAgentsDock } from "./AgentsDockContext";

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
  const initRef = useRef(false);
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
        firstMessage: "",
        allMessagesText: "",
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

  const fetchPiSessions = async () => {
    const sessions = await window.electronAPI.getPiSessions();
    console.log("sessions", sessions);
    const newProjectMap = sessions.reduce(
      (acc, session) => {
        if (!acc[session.cwd]) {
          acc[session.cwd] = {
            name: session.cwd.split("/").pop() || "",
            path: session.cwd,
            sessions: [],
          };
        }
        acc[session.cwd].sessions.push(session);
        return acc;
      },
      {} as Record<string, Project>,
    );
    setProjectMap(newProjectMap);
    setProjects(Object.values(newProjectMap));
  };

  const loadPiSession = async (sessionId: string) => {
    const session = await window.electronAPI.loadPiSession(sessionId);
    if (session) {
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
    }
  }, []);

  return (
    <AgentsContext.Provider
      value={{
        projects,
        addProject,
        selectAndAddProject,
        createSession,
        loadPiSession,
        promptSession,
      }}
    >
      {children}
    </AgentsContext.Provider>
  );
};
