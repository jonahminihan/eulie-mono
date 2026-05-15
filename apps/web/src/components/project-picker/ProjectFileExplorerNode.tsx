import type { FileSystemNode } from "shared-types";
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type DirectoryState = {
  entries: FileSystemNode[];
  loading: boolean;
  error?: string;
};

type ProjectFileExplorerNodeProps = {
  node: FileSystemNode;
  depth: number;
  directoryCache: Record<string, DirectoryState>;
  isExpanded: (path: string) => boolean;
  onToggleDirectory: (path: string) => void;
  onSelectDirectory: (path: string) => void;
};

export function ProjectFileExplorerNode({
  node,
  depth,
  directoryCache,
  isExpanded,
  onToggleDirectory,
  onSelectDirectory,
}: ProjectFileExplorerNodeProps) {
  const isDirectory = node.type === "directory";
  const expanded = isDirectory && isExpanded(node.path);
  const directoryState = directoryCache[node.path];

  const handleClick = () => {
    if (isDirectory) {
      onToggleDirectory(node.path);
    }
  };

  const handleDoubleClick = () => {
    if (isDirectory) {
      onSelectDirectory(node.path);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex h-7 cursor-default items-center gap-1 rounded-md px-2 text-sm hover:bg-muted",
          !isDirectory && "text-muted-foreground",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        title={isDirectory ? "Double-click to add this folder as a project" : node.path}
      >
        {isDirectory ? (
          expanded ? (
            <ChevronDown className="size-4 shrink-0" />
          ) : (
            <ChevronRight className="size-4 shrink-0" />
          )
        ) : (
          <span className="size-4 shrink-0" />
        )}
        {isDirectory ? (
          expanded ? (
            <FolderOpen className="size-4 shrink-0" />
          ) : (
            <Folder className="size-4 shrink-0" />
          )
        ) : (
          <File className="size-4 shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {expanded && directoryState?.loading && (
        <div
          className="flex h-7 items-center gap-2 px-2 text-sm text-muted-foreground"
          style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
        >
          <Spinner />
          Loading…
        </div>
      )}

      {expanded && directoryState?.error && (
        <div
          className="px-2 py-1 text-sm text-destructive"
          style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
        >
          {directoryState.error}
        </div>
      )}

      {expanded &&
        !directoryState?.loading &&
        !directoryState?.error &&
        directoryState?.entries.length === 0 && (
          <div
            className="px-2 py-1 text-sm text-muted-foreground"
            style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
          >
            Empty directory
          </div>
        )}

      {expanded &&
        directoryState?.entries.map((childNode) => (
          <ProjectFileExplorerNode
            key={childNode.path}
            node={childNode}
            depth={depth + 1}
            directoryCache={directoryCache}
            isExpanded={isExpanded}
            onToggleDirectory={onToggleDirectory}
            onSelectDirectory={onSelectDirectory}
          />
        ))}
    </div>
  );
}
