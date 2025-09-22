// main.ts (Electron main)
import { app, BrowserWindow, ipcMain } from "electron";
import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import path from "path";

console.log(__dirname)

let serverProc: ChildProcessWithoutNullStreams | null = null;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
    createWindow();
});

function spawnServer(port = 3000) {
    if (serverProc) return;
    const exeName = "test";
    const exePath = path.join(process.resourcesPath, "server", exeName);
    serverProc = spawn(exePath, [`--port=${port}`], { stdio: "pipe" });

    serverProc.stdout.on("data", d => console.log("[server stdout]", d.toString()));
    serverProc.stderr.on("data", d => console.error("[server stderr]", d.toString()));
    serverProc.on("close", code => {
        console.log("[server] closed", code);
        serverProc = null;
    });
}

function stopServer() {
  if (!serverProc) return;
  serverProc.kill();
  serverProc = null;
}

ipcMain.handle("host-start", async (_e, { port }) => {
    console.log("starting server");
    spawnServer(port);
    return { success: true };
});
ipcMain.handle("host-stop", async () => {
    console.log("stopping server");
    stopServer();
    return { success: true };
});

ipcMain.handle("quit-app", () => {
    app.quit();
})
