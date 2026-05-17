import { createContext, useContext, useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

type AgentsAppFrameContextType = {
  isSidePanelOpen: boolean;
  handleSidePanelToggle: () => void;
  sidePanelRef: React.RefObject<PanelImperativeHandle | null>;
};

export const AgentsAppFrameContext = createContext<AgentsAppFrameContextType>({
  isSidePanelOpen: false,
  handleSidePanelToggle: () => {},
  sidePanelRef: {
    current: null,
  } as unknown as React.RefObject<PanelImperativeHandle>,
});

export const useAgentsAppFrameContext = () => {
  const context = useContext(AgentsAppFrameContext);
  if (!context) {
    throw new Error(
      "useAgentsAppFrameContext must be used within an AgentsAppFrameProvider",
    );
  }
  return context;
};

export const AgentsAppFrameProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const sidePanelRef = useRef<PanelImperativeHandle | null>(null);

  const handleSidePanelToggle = () => {
    setIsSidePanelOpen((prev) => !prev);
    if (sidePanelRef.current) {
      sidePanelRef.current.isCollapsed()
        ? sidePanelRef.current.expand()
        : sidePanelRef.current.collapse();
    }
  };

  return (
    <AgentsAppFrameContext.Provider
      value={{
        isSidePanelOpen,
        handleSidePanelToggle,
        sidePanelRef,
      }}
    >
      {children}
    </AgentsAppFrameContext.Provider>
  );
};
