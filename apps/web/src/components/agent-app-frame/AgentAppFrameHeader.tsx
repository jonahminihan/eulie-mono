import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "../ui/button";
import styles from "./AgentAppFrameHeader.module.css";
import { cn, isInElectron } from "@/lib/utils";
import { TypographyH4 } from "../ui/typography/TypographyH4";

const AgentAppFrameHeader = ({
  onSidePanelToggle,
  isSidePanelOpen,
}: {
  onSidePanelToggle: () => void;
  isSidePanelOpen: boolean;
}) => {
  return (
    <div className={styles.appFrameHeader}>
      <div
        className={cn(
          styles.appFrameHeaderDragArea,
          "flex justify-between items-center",
        )}
      ></div>
      <div
        className={cn(
          styles.appFrameHeaderContent,
          isInElectron() ? styles.appFrameHeaderElectron : "",
          "flex justify-between items-center",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className={styles.appFrameHeaderContentItem}
          onClick={onSidePanelToggle}
        >
          {isSidePanelOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>
      <TypographyH4 text="Eulie Code" />
    </div>
  );
};

export default AgentAppFrameHeader;
