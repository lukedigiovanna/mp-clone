// main.ts (Electron main)
import { app, BrowserWindow, ipcMain } from "electron";
import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== 'production'

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

    if (isDevelopment) {
        win.webContents.openDevTools()
    }

    win.webContents.on('devtools-opened', () => {
        win.focus()
        setImmediate(() => {
            win.focus()
        })
    })
}

app.whenReady().then(() => {
    createWindow();
});

function spawnServer(): Promise<{ip: string, port: number}> {
    return new Promise<{ip: string, port: number}>((resolve, reject) => {
        if (serverProc) {
            reject("Already running a server on this instance");
            return;
        }

        const exePath = path.join(process.resourcesPath, "server");
        serverProc = spawn(exePath, [], { stdio: "pipe" });

        const timeout = setTimeout(() => {
            serverProc?.kill();
            reject("Timed out");
        }, 1000);
    
        serverProc.stdout.on("data", d => {
            console.log(d.toString())
            try {
                const json = JSON.parse(d);
                if ("ip" in json && "port" in json) {
                    clearTimeout(timeout);
                    const ip = json["ip"];
                    const port = json["port"];
                    console.log("started a server on", ip + ":" + port);
                    resolve({ ip, port });
                }
            }
            catch (e) {}
        });
        serverProc.stderr.on("data", d => console.error(d.toString()));
        serverProc.on("close", code => {
            console.log("[server] closed", code);
            serverProc = null;
        });
    })
}

function stopServer() {
  if (!serverProc) return;
  serverProc.kill();
  serverProc = null;
}

ipcMain.handle("host-start", async () => {
    console.log("starting server");
    const address = await spawnServer();
    return { success: true, address };
});
ipcMain.handle("host-stop", async () => {
    console.log("stopping server");
    stopServer();
    return { success: true };
});

ipcMain.handle("quit-app", () => {
    app.quit();
})
