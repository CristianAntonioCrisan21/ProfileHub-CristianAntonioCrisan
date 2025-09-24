"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1100,
        height: 740,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
// IPC Handlers
electron_1.ipcMain.handle("open:url", async (_e, url) => {
    await electron_1.shell.openExternal(url);
    return true;
});
electron_1.ipcMain.handle("open:app", async (_e, appPathOrId, args = []) => {
    try {
        if (process.platform === "darwin" && appPathOrId.endsWith(".app")) {
            // On macOS, use 'open' command for .app bundles
            const child = (0, child_process_1.spawn)("open", [appPathOrId, ...args], {
                detached: true,
                stdio: "ignore", // Ignore stdio to avoid keeping the parent process alive
            });
            // Unreference the child process so it doesn't keep the parent alive
            child.unref();
            child.on("error", (err) => console.error("spawn error:", err));
        }
        else {
            // For other platforms or direct executable paths
            const child = (0, child_process_1.spawn)(appPathOrId, args, {
                detached: true,
                stdio: "ignore", // Ignore stdio to avoid keeping the parent process alive
                shell: process.platform === "win32",
            });
            // Unreference the child process so it doesn't keep the parent alive
            child.unref();
            child.on("error", (err) => console.error("spawn error:", err));
        }
        return true;
    }
    catch (error) {
        console.error("Failed to open app:", error);
        return false;
    }
});
electron_1.ipcMain.handle("select:app", async () => {
    try {
        const result = await electron_1.dialog.showOpenDialog({
            title: "Select Application",
            properties: ["openFile"],
            filters: process.platform === "darwin"
                ? [{ name: "Applications", extensions: ["app"] }]
                : process.platform === "win32"
                    ? [{ name: "Applications", extensions: ["exe"] }]
                    : [{ name: "All Files", extensions: ["*"] }]
        });
        // Handle both old and new Electron API formats
        if (Array.isArray(result)) {
            // Old API: returns string[] directly
            return result.length > 0 ? result[0] : null;
        }
        else {
            // New API: returns OpenDialogReturnValue object
            const dialogResult = result;
            if (!dialogResult.canceled && dialogResult.filePaths && dialogResult.filePaths.length > 0) {
                return dialogResult.filePaths[0];
            }
        }
        return null;
    }
    catch (error) {
        console.error("Failed to select app:", error);
        return null;
    }
});
