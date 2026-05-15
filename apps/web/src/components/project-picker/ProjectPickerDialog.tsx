import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectFileExplorer } from "./ProjectFileExplorer";

type ProjectPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDirectory: (path: string) => void;
};

export function ProjectPickerDialog({
  open,
  onOpenChange,
  onSelectDirectory,
}: ProjectPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Open Project Folder</DialogTitle>
          <DialogDescription>
            Browse from / and double-click a folder to add it as a project.
          </DialogDescription>
        </DialogHeader>
        <ProjectFileExplorer onSelectDirectory={onSelectDirectory} />
      </DialogContent>
    </Dialog>
  );
}
