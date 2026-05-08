import type {
  AddPanelOptions,
  DockviewApi,
  IDockviewPanel,
} from "dockview-react";
import { createContext, useContext, useState } from "react";

type AgentsDockContextType = {
  tabs: IDockviewPanel[];
  setDockApi: (api: DockviewApi) => void;
  addTab: (tab: AddPanelOptions<Parameters<any>>) => void;
};

const AgentsDockContext = createContext<AgentsDockContextType>({
  tabs: [],
  setDockApi: () => {},
  addTab: () => {},
});

export const useAgentsDock = () => {
  const context = useContext(AgentsDockContext);
  if (!context) {
    throw new Error("useAgentsDock must be used within an AgentsDockProvider");
  }
  return context;
};

export const AgentsDockProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dockApi, setDockApi] = useState<DockviewApi | null>(null);
  const [tabs, setTabs] = useState<IDockviewPanel[]>([]);

  const addTab = (tab: AddPanelOptions<Parameters<any>>) => {
    const existingPanel = dockApi?.getPanel(tab.id);
    if (existingPanel) {
      existingPanel.focus();
      return;
    }
    const newPanel = dockApi?.addPanel(tab);
    if (newPanel) {
      setTabs([...tabs, newPanel]);
    }
  };

  return (
    <AgentsDockContext.Provider value={{ tabs, setDockApi, addTab }}>
      {children}
    </AgentsDockContext.Provider>
  );
};
