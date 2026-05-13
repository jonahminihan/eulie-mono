import { readdir } from "node:fs/promises";
import { getPiCandidatePaths } from "./piPaths";
import { createJiti } from "jiti";

const combineExtensions = (extensions: any[]) => {
  const toolUIs = [];
  for (const extension of extensions) {
    toolUIs.push(...extension.toolUIs);
  }
  return { toolUIs };
};

const runExtension = async (extension: any) => {
  const toolUIs: { toolName: string; component: React.ReactNode }[] = [];
  const registerToolUI = (toolName: string, component: React.ReactNode) => {
    toolUIs.push({ toolName, component });
  };
  await extension({ registerToolUI });
  return { toolUIs };
};

export const getExtensions = async () => {
  const extensionPaths = (await getPiCandidatePaths()).extensions;
  let extensions = [];
  for (const path of extensionPaths) {
    try {
      const files = await readdir(path, { withFileTypes: true });
      extensions.push(
        ...files
          .filter((file) => file.isDirectory())
          .map(async (file) => {
            const jiti = createJiti(`${file.parentPath}/${file.name}`);
            const extension = jiti.import(`${file.parentPath}/${file.name}`);
            console.log("extension", extension);
            return extension;
          }),
      );
    } catch (error) {}
  }
  extensions = (await Promise.all(extensions))
    .map(
      // @ts-ignore
      (extension) => extension.setupEulie,
    )
    .filter((extension) => extension !== undefined)
    .map((extension) => runExtension(extension));
  extensions = await Promise.all(extensions);
  console.log("extensions", extensions);
  return combineExtensions(extensions);
};
