"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const isDev = !electron_1.app.isPackaged;
// Configurar nombre de la app antes de que esté ready
electron_1.app.setName("ProfileHub");
/**
 * Resuelve rutas al asset tanto en desarrollo (carpeta del proyecto)
 * como cuando la app está empaquetada (process.resourcesPath).
 */
function getPublicAssetPath(...p) {
    const devPath = path_1.default.join(__dirname, "..", "public", ...p);
    if (!electron_1.app.isPackaged && (0, fs_1.existsSync)(devPath))
        return devPath;
    // En build: los assets deben copiarse a resources (ej. con electron-builder "extraResources")
    return path_1.default.join(process.resourcesPath, ...p);
}
function createWindow() {
    // Ruta al icono para Win/Linux (en macOS el Dock se maneja con app.dock.setIcon)
    const winLinuxIconPath = getPublicAssetPath("icono.png");
    const win = new electron_1.BrowserWindow({
        width: 1100,
        height: 740,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: (0, fs_1.existsSync)(winLinuxIconPath) ? winLinuxIconPath : undefined,
    });
    win.loadURL("http://localhost:3000");
    if (isDev) {
        win.webContents.openDevTools({ mode: "detach" });
    }
}
electron_1.app.whenReady().then(() => {
    // --- Configurar nombre de la app ---
    electron_1.app.setName("ProfileHub");
    // // --- Icono del Dock (macOS) ---
    // if (process.platform === "darwin" && app.dock) {
    //   // Usar el archivo .icns redondeado si existe, sino el PNG redondeado
    //   const icnsPath = isDev 
    //     ? path.join(__dirname, "..", "..", "public", "icono.icns")
    //     : getPublicAssetPath("icono.icns");
    //   const roundedPngPath = isDev 
    //     ? path.join(__dirname, "..", "..", "public", "icono-rounded.png")
    //     : getPublicAssetPath("icono-rounded.png");
    //   const dockPngPath = existsSync(roundedPngPath) ? roundedPngPath :
    //                      isDev ? path.join(__dirname, "..", "..", "public", "icono.png")
    //                            : getPublicAssetPath("icono.png");
    //   console.log("[ProfileHub] Intentando cargar icono desde:", dockPngPath);
    //   console.log("[ProfileHub] Archivo existe:", existsSync(dockPngPath));
    //   const img = nativeImage.createFromPath(dockPngPath);
    //   console.log("[ProfileHub] Icono cargado, isEmpty():", img.isEmpty());
    //   if (!img.isEmpty()) {
    //     // Redimensionar el icono al tamaño exacto del Dock (54px)
    //     const dockSize = 54;
    //     const resizedImg = img.resize({ width: dockSize, height: dockSize });
    //     app.dock.setIcon(resizedImg);
    //     console.log("[ProfileHub] Icono redimensionado a", dockSize, "px y aplicado al dock desde:", dockPngPath);
    //   } else {
    //     console.warn("[ProfileHub] Icono Dock vacío o no encontrado:", dockPngPath);
    //   }
    // }
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
electron_1.ipcMain.handle("open:url", async (_e, url) => {
    await electron_1.shell.openExternal(url);
    return true;
});
electron_1.ipcMain.handle("open:app", async (_e, appPathOrId, args = []) => {
    if (process.platform === "darwin") {
        let child;
        if (appPathOrId.startsWith("id:")) {
            child = (0, child_process_1.spawn)("open", ["-b", appPathOrId.slice(3), ...args], { detached: true });
        }
        else if (appPathOrId.endsWith(".app")) {
            child = (0, child_process_1.spawn)("open", ["-a", appPathOrId, ...args], { detached: true });
        }
        else {
            child = (0, child_process_1.spawn)("open", ["-a", appPathOrId, ...args], { detached: true });
        }
        child.on("error", (err) => console.error("open:app error:", err));
        return true;
    }
    const child = (0, child_process_1.spawn)(appPathOrId, args, { detached: true, shell: process.platform === "win32" });
    child.on("error", (err) => console.error("spawn error:", err));
    return true;
});
electron_1.ipcMain.handle("open:file", async (_e, filePath) => {
    await electron_1.shell.openPath(filePath);
    return true;
});
/**
 * Selector de aplicaciones (Finder/Explorer) usando la API síncrona.
 * Devuelve la ruta elegida o null si se cancela.
 */
electron_1.ipcMain.handle("dialog:openApp", async (e) => {
    const win = electron_1.BrowserWindow.fromWebContents(e.sender) ?? null;
    let filters;
    let defaultPath;
    if (process.platform === "darwin") {
        filters = [{ name: "Aplicaciones", extensions: ["app"] }];
        const candidates = ["/Applications", "/System/Applications"];
        defaultPath = candidates.find((p) => {
            try {
                return (0, fs_1.existsSync)(p);
            }
            catch {
                return false;
            }
        });
    }
    else if (process.platform === "win32") {
        filters = [{ name: "Aplicaciones", extensions: ["exe", "lnk", "bat", "cmd"] }];
    }
    else {
        // Linux: lanzadores .desktop o binarios (orientativo)
        filters = [{ name: "Aplicaciones", extensions: ["desktop"] }];
    }
    const options = {
        title: "Selecciona una aplicación",
        properties: ["openFile"],
        filters,
        defaultPath,
    };
    const files = win
        ? electron_1.dialog.showOpenDialogSync(win, options)
        : electron_1.dialog.showOpenDialogSync(options);
    if (!files || files.length === 0)
        return null;
    return files[0];
});
