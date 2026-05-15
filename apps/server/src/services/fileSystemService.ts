import { readdir, lstat } from "node:fs/promises";
import path from "node:path";
import type { FileSystemNode, ListDirectoryResponse } from "shared-types";

const IGNORED_NAMES = new Set([
  "node_modules",
  ".git",
  ".turbo",
  ".next",
  "dist",
]);

export async function listDirectory(
  requestedPath: string,
): Promise<ListDirectoryResponse> {
  const dirPath = path.resolve(requestedPath || "/");
  const entries = await readdir(dirPath, { withFileTypes: true });
  const nodes: FileSystemNode[] = [];

  for (const entry of entries) {
    if (IGNORED_NAMES.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(dirPath, entry.name);

    try {
      const stats = await lstat(entryPath);

      if (stats.isSymbolicLink()) {
        continue;
      }

      const type = stats.isDirectory() ? "directory" : "file";

      nodes.push({
        name: entry.name,
        path: entryPath,
        type,
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
      });
    } catch {
      // Skip entries that cannot be read due to permissions or races.
    }
  }

  nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return {
    path: dirPath,
    entries: nodes,
  };
}
