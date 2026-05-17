import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { handleDirSelect, handleFileSelect } from "./helpers/dialog";
import {
  createPiSession,
  getPiSessions,
  loadPiSession,
  promptSession,
} from "./wrappers/pi/pi";
import { PromptOptions } from "@earendil-works/pi-coding-agent";
import fixPath from "fix-path";
fixPath();

import { startServer, stopServer } from "./server";
import log from "electron-log/main";

log.initialize();
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const serverProcess = startServer();

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // remove the default titlebar
    titleBarStyle: "hidden",
    // expose window controls in Windows/Linux
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    // trafficLightPosition: { x: 15, y: 15 },
  });
  // and load the index.html of the app.
  if (process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `./index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  ipcMain.handle("dialog:selectFile", handleFileSelect);
  ipcMain.handle("dialog:selectDir", handleDirSelect);
  ipcMain.handle("pi:createSession", (event, cwd: string) => {
    return createPiSession(mainWindow, { cwd });
  });
  ipcMain.handle("pi:getSessions", getPiSessions);
  ipcMain.handle("pi:loadSession", (event, sessionId: string) => {
    return loadPiSession(mainWindow, sessionId);
  });
  ipcMain.handle(
    "pi:promptSession",
    (event, sessionId: string, message: string, options?: PromptOptions) => {
      return promptSession(sessionId, message, options);
    },
  );
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", () => {
  serverProcess.kill();
  stopServer();
  log.info("Server process killed");
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
