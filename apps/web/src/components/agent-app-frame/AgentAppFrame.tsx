import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AgentSidePanel from "./AgentSidePanel";
import AgentAppFrameHeader from "./AgentAppFrameHeader";
import { useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

const AgentAppFrame = ({ children }: { children: React.ReactNode }) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const sidePanelRef = useRef<PanelImperativeHandle | null>(null);

  const handleSidePanelToggle = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
    if (sidePanelRef.current) {
      sidePanelRef.current.isCollapsed()
        ? sidePanelRef.current.expand()
        : sidePanelRef.current.collapse();
    }
  };

  return (
    <div className="flex flex-col h-dvh w-dvw">
      <AgentAppFrameHeader
        onSidePanelToggle={handleSidePanelToggle}
        isSidePanelOpen={isSidePanelOpen}
      />
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full w-full grow-1"
      >
        <ResizablePanel
          panelRef={sidePanelRef}
          defaultSize={300}
          collapsible={true}
          groupResizeBehavior="preserve-pixel-size"
        >
          <AgentSidePanel />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AgentAppFrame;
