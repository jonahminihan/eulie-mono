import { FolderOpen } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useFileExplorer } from "@/hooks/useFileExplorer";
import { ProjectFileExplorerNode } from "./ProjectFileExplorerNode";

type ProjectFileExplorerProps = {
  rootPath?: string;
  onSelectDirectory: (path: string) => void;
};

export function ProjectFileExplorer({
  rootPath = "/",
  onSelectDirectory,
}: ProjectFileExplorerProps) {
  const { directoryCache, isExpanded, toggleDirectory } =
    useFileExplorer(rootPath);
  const rootState = directoryCache[rootPath];

  return (
    <div className="min-h-0 rounded-lg border bg-background">
      <div
        className="flex h-8 cursor-default items-center gap-2 border-b px-2 text-sm font-medium hover:bg-muted"
        onDoubleClick={() => onSelectDirectory(rootPath)}
        title="Double-click to add this folder as a project"
      >
        <FolderOpen className="size-4" />
        <span>{rootPath}</span>
      </div>

      <div className="max-h-[60vh] overflow-auto py-1">
        {rootState?.loading && (
          <div className="flex h-8 items-center gap-2 px-3 text-sm text-muted-foreground">
            <Spinner />
            Loading…
          </div>
        )}

        {rootState?.error && (
          <div className="px-3 py-2 text-sm text-destructive">
            {rootState.error}
          </div>
        )}

        {!rootState?.loading &&
          !rootState?.error &&
          rootState?.entries.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Empty directory
            </div>
          )}

        {rootState?.entries.map((node) => (
          <ProjectFileExplorerNode
            key={node.path}
            node={node}
            depth={0}
            directoryCache={directoryCache}
            isExpanded={isExpanded}
            onToggleDirectory={toggleDirectory}
            onSelectDirectory={onSelectDirectory}
          />
        ))}
      </div>
    </div>
  );
}
