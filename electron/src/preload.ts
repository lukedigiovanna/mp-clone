import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    startHost: () => ipcRenderer.invoke("host-start"),
    stopHost: () => ipcRenderer.invoke("host-stop"),
    quitApp: () => ipcRenderer.invoke("quit-app"),
});
