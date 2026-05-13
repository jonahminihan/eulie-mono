import type {
  AgentSessionEvent,
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
import type { BaseAgentSessionInfo, EuExtensionPath } from "shared-types";
import { useAgentsDock } from "./AgentsDockContext";
import { io, Socket } from "socket.io-client";

export type Project = {
  name: string;
  path: string;
  sessions: SessionInfo[];
};

type AgentsContextType = {
  projects: Project[];
  addProject: (project: Project) => void;
  selectAndAddProject: () => Promise<void>;
  createSession: (project: Project) => void;
  loadPiSession: (
    sessionId: string,
    callback?: (session: BaseAgentSessionInfo | null) => void,
  ) => Promise<void>;
  promptSession: (
    sessionId: string,
    message: string,
    options?: PromptOptions,
  ) => Promise<void>;
  subscribeToNewSessionEvent: (
    callback: (event: AgentSessionEvent & { sessionId: string }) => void,
  ) => void;
};

const AgentsContextWS = createContext<AgentsContextType>({
  projects: [],
  addProject: () => {},
  selectAndAddProject: () => Promise.resolve(),
  createSession: () => {},
  loadPiSession: () => Promise.resolve(),
  promptSession: () => Promise.resolve(),
  subscribeToNewSessionEvent: () => {},
});

export const useAgentsWSContext = () => {
  const context = useContext(AgentsContextWS);
  if (!context) {
    throw new Error(
      "useAgentsWSContext must be used within an AgentsWSProvider",
    );
  }
  return context;
};

export const AgentsWSProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //   const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [projectMap, setProjectMap] = useState<Record<string, Project>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [serverURL] = useState<string>("http://localhost:3030");
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
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit(
      "pi:createSession",
      { cwd: project.path },
      async (session: BaseAgentSessionInfo | null) => {
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
            title: (
              session.name ||
              session.firstMessage ||
              "New Session"
            ).slice(0, 7),
            renderer: "always",
          });
        }
        return session;
      },
    );
  };

  const fetchPiSessions = async () => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("pi:getSessions", async (sessions: SessionInfo[]) => {
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
    });
  };

  const loadPiSession = async (
    sessionId: string,
    callback?: (session: BaseAgentSessionInfo | null) => void,
  ) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit(
      "pi:loadSession",
      { sessionId },
      async (session: BaseAgentSessionInfo | null) => {
        if (session) {
          addTab({
            id: session.sessionId,
            component: "default",
            title: (
              session.name ||
              session.firstMessage ||
              "New Session"
            ).slice(0, 7),
            renderer: "always",
          });
        }
        if (callback) {
          callback(session);
        }
        return session;
      },
    );
  };

  const promptSession = async (
    sessionId: string,
    message: string,
    options?: PromptOptions,
  ) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("pi:promptSession", { sessionId, message, options }, () => {});
  };

  const connectToSocketServer = () => {
    const newSocket = io(serverURL);
    newSocket.on("connect", () => {
      console.log("connected to socket server");
      fetchPiSessions();
    });
    newSocket.on("disconnect", () => {
      console.log("disconnected from socket server");
    });
    newSocket.on("error", (error) => {
      console.error("socket error", error);
    });
    // setSocket(newSocket);
    socketRef.current = newSocket;
    return newSocket;
  };

  const subscribeToNewSessionEvent = (
    callback: (event: AgentSessionEvent & { sessionId: string }) => void,
  ) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on("pi:onNewSessionEvent", callback);
  };

  const loadExtensions = async (extensionPaths: EuExtensionPath[]) => {
    const toolUIs: { toolName: string; component: React.ReactNode }[] = [];
    const registerToolUI = (toolName: string, component: React.ReactNode) => {
      toolUIs.push({ toolName, component });
    };
    for (const extensionPath of extensionPaths) {
      (
        await import(
          `${serverURL}/extension${extensionPath.parentPath}/${extensionPath.name}`
        )
      ).setupEulie({ registerToolUI });
    }
  };

  const fetchExtensionData = async () => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit(
      "pi:getExtensionsPaths",
      async (extensionData: EuExtensionPath[]) => {
        loadExtensions(extensionData);
      },
    );
  };

  useLayoutEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      connectToSocketServer();
      fetchExtensionData();
    }
  }, []);

  return (
    <AgentsContextWS.Provider
      value={{
        projects,
        addProject,
        selectAndAddProject,
        createSession,
        loadPiSession,
        promptSession,
        subscribeToNewSessionEvent,
      }}
    >
      {children}
    </AgentsContextWS.Provider>
  );
};
