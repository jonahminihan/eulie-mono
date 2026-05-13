import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { TypographyP } from "../ui/typography/TypographyP";
import { type Project } from "@/contexts/AgentsContext";
import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { NonButton } from "../ui/non-button";
import { useAgentsWSContext } from "@/contexts/AgentsContextWS";

const AgentTreeViewProject = ({ project }: { project: Project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { loadPiSession, createSession } = useAgentsWSContext();

  const handleAddSession = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    createSession(project);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn("flex justify-start w-full")}
        nativeButton={false}
        render={
          <NonButton variant="ghost" className="w-full">
            <div className="flex w-full justify-between">
              <div className="flex flex-row justify-center items-center gap-2">
                {isOpen ? <ChevronDown /> : <ChevronRight />}
                <TypographyP text={project.name} className="text-left" />
              </div>
              <Button
                variant="ghost"
                className="flex justify-start"
                onClick={handleAddSession}
              >
                <Plus />
              </Button>
            </div>
          </NonButton>
        }
      ></CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 pl-8 pr-2">
        {project.sessions.length > 0 ? (
          <div>
            {project.sessions.map((session) => (
              <Button
                key={session.id}
                variant="ghost"
                className={`flex justify-start w-full`}
                onClick={() => loadPiSession(session.id)}
              >
                <TypographyP
                  key={session.id}
                  text={session.name ?? session.firstMessage ?? "New Session"}
                  className="text-left truncate"
                />
              </Button>
            ))}
          </div>
        ) : (
          <TypographyMuted
            text={"No sessions have been started yet"}
            className="text-left"
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AgentTreeViewProject;
