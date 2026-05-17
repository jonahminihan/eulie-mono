import { Plus } from "lucide-react";
import AgentTreeView from "./AgentTreeView";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import AgentSelectServer from "./AgentSelectServer";
import { useState } from "react";
import { usePref } from "@/contexts/PrefContext";
import { ExtendedButton } from "../ui/extended-button";

const AgentSidePanel = () => {
  const [isSelectServerOpen, setIsSelectServerOpen] = useState(false);
  const { servers } = usePref();
  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex justify-between w-full">
        <TypographyMuted text="Servers" className="flex items-center" />
        <ExtendedButton
          variant="ghost"
          className="flex justify-start"
          onClick={() => setIsSelectServerOpen(true)}
          disabled={servers.length > 0}
          disabledText="Only one server currently supported"
        >
          <Plus />
        </ExtendedButton>
      </div>
      {servers.map((server) => (
        <AgentTreeView key={`${server.ip}:${server.port}`} server={server} />
      ))}
      <AgentSelectServer
        open={isSelectServerOpen}
        onOpenChange={setIsSelectServerOpen}
      />
    </div>
  );
};

export default AgentSidePanel;
