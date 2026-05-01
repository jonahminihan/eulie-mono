import { Button } from "../ui/button";
import AgentTreeView from "./AgentTreeView";
import { Folder } from "lucide-react";

const AgentSidePanel = () => {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full flex flex-col gap-2">
        <Button variant="ghost" className="flex justify-start">
          <Folder /> Add Project
        </Button>
      </div>
      <AgentTreeView />
    </div>
  );
};

export default AgentSidePanel;
