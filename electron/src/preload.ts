import { contextBridge, ipcRenderer } from "electron";
console.log('preload')
contextBridge.exposeInMainWorld("electronAPI", {
    startHost: (port) => ipcRenderer.invoke("host-start", { port }),
    stopHost: () => ipcRenderer.invoke("host-stop"),
    quitApp: () => ipcRenderer.invoke("quit-app"),
});
