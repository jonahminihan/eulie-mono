import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { getAgentDir, SettingsManager } from "@earendil-works/pi-coding-agent";

function findGitRoot(start: string): string | undefined {
  let dir = resolve(start);
  while (true) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

function ancestorAgentSkillDirs(cwd: string): string[] {
  const dirs: string[] = [];
  const root = findGitRoot(cwd);
  let dir = resolve(cwd);

  while (true) {
    dirs.push(join(dir, ".agents", "skills"));
    if (root && dir === root) break;

    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return dirs;
}

function resolveSettingPath(p: string, baseDir: string) {
  if (p === "~") return homedir();
  if (p.startsWith("~/")) return join(homedir(), p.slice(2));
  if (p.startsWith("~")) return join(homedir(), p.slice(1));
  return resolve(baseDir, p);
}

export async function getPiCandidatePaths(cwd = process.cwd()) {
  const agentDir = getAgentDir();
  const projectPiDir = join(cwd, ".pi");

  const settings = SettingsManager.create(cwd, agentDir);
  await settings.reload();

  const globalSettings = settings.getGlobalSettings();
  const projectSettings = settings.getProjectSettings();

  return {
    extensions: [
      // auto-discovery
      join(projectPiDir, "extensions"),
      join(agentDir, "extensions"),

      // settings.json entries
      ...(projectSettings.extensions ?? []).map((p) =>
        resolveSettingPath(p, projectPiDir),
      ),
      ...(globalSettings.extensions ?? []).map((p) =>
        resolveSettingPath(p, agentDir),
      ),
    ],

    skills: [
      // auto-discovery
      join(projectPiDir, "skills"),
      ...ancestorAgentSkillDirs(cwd),
      join(agentDir, "skills"),
      join(homedir(), ".agents", "skills"),

      // settings.json entries
      ...(projectSettings.skills ?? []).map((p) =>
        resolveSettingPath(p, projectPiDir),
      ),
      ...(globalSettings.skills ?? []).map((p) =>
        resolveSettingPath(p, agentDir),
      ),
    ],

    prompts: [
      // auto-discovery
      join(projectPiDir, "prompts"),
      join(agentDir, "prompts"),

      // settings.json entries
      ...(projectSettings.prompts ?? []).map((p) =>
        resolveSettingPath(p, projectPiDir),
      ),
      ...(globalSettings.prompts ?? []).map((p) =>
        resolveSettingPath(p, agentDir),
      ),
    ],

    packages: [
      ...(projectSettings.packages ?? []),
      ...(globalSettings.packages ?? []),
    ],
  };
}
