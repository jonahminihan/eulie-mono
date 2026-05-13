import type React from "react";

export interface EulieExtensionAPI {
  registerToolUI: (toolName: string, component: React.ReactNode) => void;
}
