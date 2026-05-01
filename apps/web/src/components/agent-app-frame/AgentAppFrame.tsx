import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AgentSidePanel from "./AgentSidePanel";

const AgentAppFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={300}>
          <AgentSidePanel />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AgentAppFrame;
