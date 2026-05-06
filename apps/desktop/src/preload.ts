// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: () => ipcRenderer.invoke("dialog:selectFile"),
  selectDir: () => ipcRenderer.invoke("dialog:selectDir"),
  createPiSession: (cwd: string) => ipcRenderer.invoke("pi:createSession", cwd),
  getPiSessions: () => ipcRenderer.invoke("pi:getSessions"),
  loadPiSession: (sessionId: string) =>
    ipcRenderer.invoke("pi:loadSession", sessionId),
  onNewSessionEvent: (callback: (event: any) => void) =>
    ipcRenderer.on("pi:onNewSessionEvent", (_event: any, data: any) =>
      callback(data),
    ),
  clearOnNewSessionEvent: () =>
    ipcRenderer.removeAllListeners("pi:onNewSessionEvent"),
  promptSession: (sessionId: string, message: string) =>
    ipcRenderer.invoke("pi:promptSession", sessionId, message),
  // onMessageDelta: (callback: (delta: string) => void) =>
  //   ipcRenderer.on("pi:messageDelta", callback),
});
