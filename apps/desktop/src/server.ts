import { spawn, execFile, ChildProcess } from "child_process";
import log from "electron-log/main";

import path from "path";

import fixPath from "fix-path";
fixPath();

const isDev = !!process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL;

export const startServer = () => {
  if (isDev) {
    const serverProcess = spawn("node", ["../server/src/index.ts"]);
    serverProcess.on("error", (error) => {
      log.error("serverProcess error", error);
    });
    return serverProcess;
  } else {
    log.info(
      "Run server in production, path:",
      path.join(process.resourcesPath, "./server/src/index.ts"),
    );
    log.info("Run server in production, $PATH:", process.env.PATH);

    const serverProcess = spawn("node", [
      path.join(process.resourcesPath, "./server/src/index.ts"),
    ]);

    serverProcess.on("error", (error) => {
      log.error("serverProcess error", error);
    });
    return serverProcess;
  }
};

export const stopServer = () => {
  execFile("sh", ["-c", "lsof -ti tcp:3030 | xargs kill"], (err) => {
    if (err) console.error(err); // e.g. nothing on 3030 → xargs may error
  });
  log.info("Server process killed");
};
