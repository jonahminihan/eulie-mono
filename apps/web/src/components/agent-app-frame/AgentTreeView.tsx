import { TypographyLarge } from "../ui/typography/TypographyLarge";
import AgentTreeViewProject from "./AgentTreeViewProject";
import { Button } from "../ui/button";
import { FolderPlus } from "lucide-react";
import { useAgentsWSContext } from "@/contexts/AgentsContextWS";

const AgentTreeView = () => {
  const { projects, selectAndAddProject } = useAgentsWSContext();

  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-between w-full">
        <TypographyLarge text="Projects" className="flex items-center" />
        <Button
          variant="ghost"
          className="flex justify-start"
          onClick={selectAndAddProject}
        >
          <FolderPlus />
        </Button>
      </div>
      <div className="">
        {projects.map((project) => (
          <AgentTreeViewProject key={project.path} project={project} />
        ))}
      </div>
    </div>
  );
};

export default AgentTreeView;
