"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
// Configuración de desarrollo se puede agregar aquí si es necesario
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1100,
        height: 740,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.loadURL("http://localhost:3000");
}
electron_1.app.whenReady().then(() => {
    // Ocultar el icono del dock en macOS
    if (process.platform === "darwin") {
        electron_1.app.dock?.hide();
    }
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
// IPC Handlers
electron_1.ipcMain.handle("open:url", async (_e, url) => {
    await electron_1.shell.openExternal(url);
    return true;
});
electron_1.ipcMain.handle("open:app", async (_e, appPathOrId, args = []) => {
    const child = (0, child_process_1.spawn)(appPathOrId, args, {
        detached: true,
        shell: process.platform === "win32",
    });
    child.on("error", (err) => console.error("spawn error:", err));
    return true;
});
