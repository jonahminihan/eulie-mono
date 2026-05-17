import { TypographyLarge } from "../ui/typography/TypographyLarge";
import AgentTreeViewProject from "./AgentTreeViewProject";
import { Button } from "../ui/button";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { useAgentsWSContext } from "@/contexts/AgentsContextWS";
import { ProjectPickerDialog } from "@/components/project-picker/ProjectPickerDialog";
import type { Server } from "@/contexts/PrefContext";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const AgentTreeView = ({ server }: { server: Server }) => {
  const { projects, addProjectByPath } = useAgentsWSContext();
  const [projectPickerOpen, setProjectPickerOpen] = useState(false);

  const handleSelectDirectory = (path: string) => {
    addProjectByPath(path);
    setProjectPickerOpen(false);
  };

  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-between w-full">
        <TypographyMuted
          text={`${server.ip}:${server.port}`}
          className="flex items-center text-xs"
        />
        <Button
          variant="ghost"
          className="flex justify-start"
          onClick={() => setProjectPickerOpen(true)}
        >
          <FolderPlus />
        </Button>
      </div>
      <div className="">
        {projects.map((project) => (
          <AgentTreeViewProject key={project.path} project={project} />
        ))}
      </div>
      <ProjectPickerDialog
        open={projectPickerOpen}
        onOpenChange={setProjectPickerOpen}
        onSelectDirectory={handleSelectDirectory}
      />
    </div>
  );
};

export default AgentTreeView;
