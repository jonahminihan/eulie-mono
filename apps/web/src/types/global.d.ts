import { SessionInfo } from "@mariozechner/pi-coding-agent";
import { BaseAgentSessionInfo } from "shared-types";

// global.d.ts
export {}; // Required if the file has no other imports/exports to make it a module

declare global {
  interface Window {
    electronAPI: {
      selectFile: () => Promise<string>;
      selectDir: () => Promise<string>;
      createPiSession: (cwd: string) => Promise<BaseAgentSessionInfo | null>;
      getPiSessions: () => Promise<SessionInfo[]>;
      loadPiSession: (
        sessionId: string,
      ) => Promise<BaseAgentSessionInfo | null>;
      onNewSessionEvent: (callback: (event: AgentSessionEvent) => void) => void;
      promptSession: (sessionId: string, message: string) => Promise<void>;
    };
  }
}
