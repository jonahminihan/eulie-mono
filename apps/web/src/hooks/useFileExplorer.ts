import { useCallback, useEffect, useState } from "react";
import type { FileSystemNode } from "shared-types";
import { useAgentsWSContext } from "@/contexts/AgentsContextWS";

type DirectoryState = {
  entries: FileSystemNode[];
  loading: boolean;
  error?: string;
};

export function useFileExplorer(rootPath = "/") {
  const { listDirectory } = useAgentsWSContext();
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [directoryCache, setDirectoryCache] = useState<
    Record<string, DirectoryState>
  >({});

  const loadDirectory = useCallback(
    async (path: string, force = false) => {
      const existingState = directoryCache[path];
      if (!force && existingState && !existingState.error) {
        return;
      }

      setDirectoryCache((currentCache) => ({
        ...currentCache,
        [path]: {
          entries: currentCache[path]?.entries ?? [],
          loading: true,
        },
      }));

      const response = await listDirectory(path);

      setDirectoryCache((currentCache) => {
        if ("error" in response) {
          return {
            ...currentCache,
            [path]: {
              entries: [],
              loading: false,
              error: response.error,
            },
          };
        }

        return {
          ...currentCache,
          [path]: {
            entries: response.entries,
            loading: false,
          },
        };
      });
    },
    [directoryCache, listDirectory],
  );

  const toggleDirectory = useCallback(
    async (path: string) => {
      const shouldOpen = !expandedPaths.has(path);

      setExpandedPaths((currentExpandedPaths) => {
        const nextExpandedPaths = new Set(currentExpandedPaths);
        if (nextExpandedPaths.has(path)) {
          nextExpandedPaths.delete(path);
        } else {
          nextExpandedPaths.add(path);
        }
        return nextExpandedPaths;
      });

      if (shouldOpen) {
        await loadDirectory(path);
      }
    },
    [expandedPaths, loadDirectory],
  );

  const isExpanded = useCallback(
    (path: string) => expandedPaths.has(path),
    [expandedPaths],
  );

  useEffect(() => {
    loadDirectory(rootPath);
  }, [loadDirectory, rootPath]);

  return {
    directoryCache,
    expandedPaths,
    isExpanded,
    loadDirectory,
    toggleDirectory,
  };
}
