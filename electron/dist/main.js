"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const isDev = !electron_1.app.isPackaged;
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1100,
        height: 740,
        webPreferences: {
            // Apunta al preload compilado en dist
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.loadURL("http://localhost:3000");
    if (isDev) {
        win.webContents.openDevTools({ mode: "detach" });
    }
}
electron_1.app.whenReady().then(createWindow);
electron_1.ipcMain.handle("open:url", async (_e, url) => {
    await electron_1.shell.openExternal(url);
    return true;
});
electron_1.ipcMain.handle("open:app", async (_e, appPathOrId, args = []) => {
    if (process.platform === "darwin") {
        let child;
        if (appPathOrId.startsWith("id:")) {
            // Bundle ID (ej: "id:com.apple.calculator")
            child = (0, child_process_1.spawn)("open", ["-b", appPathOrId.slice(3), ...args], { detached: true });
        }
        else if (appPathOrId.endsWith(".app")) {
            // Ruta completa a .app
            child = (0, child_process_1.spawn)("open", ["-a", appPathOrId, ...args], { detached: true });
        }
        else {
            // Nombre de la app (ej: "Calculator" o "Calculadora")
            child = (0, child_process_1.spawn)("open", ["-a", appPathOrId, ...args], { detached: true });
        }
        child.on("error", (err) => console.error("open:app error:", err));
        return true;
    }
    // Windows / Linux
    const child = (0, child_process_1.spawn)(appPathOrId, args, { detached: true });
    child.on("error", (err) => console.error("spawn error:", err));
    return true;
});
electron_1.ipcMain.handle("open:file", async (_e, filePath) => {
    await electron_1.shell.openPath(filePath);
    return true;
});
