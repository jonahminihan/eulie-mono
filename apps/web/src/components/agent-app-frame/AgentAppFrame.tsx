import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AgentSidePanel from "./AgentSidePanel";
import AgentAppFrameHeader from "./AgentAppFrameHeader";
import {
  AgentsAppFrameContext,
  AgentsAppFrameProvider,
} from "@/contexts/AgentsAppFrameContext";

const AgentAppFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <AgentsAppFrameProvider>
      <AgentsAppFrameContext.Consumer>
        {({ sidePanelRef }) => (
          <div className="flex flex-col h-dvh w-dvw overflow-hidden">
            <AgentAppFrameHeader />
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
        )}
      </AgentsAppFrameContext.Consumer>
    </AgentsAppFrameProvider>
  );
};

export default AgentAppFrame;
