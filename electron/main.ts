import { app, BrowserWindow, ipcMain, shell, dialog, nativeImage } from "electron";
import { spawn } from "child_process";
import path from "path";
import type { OpenDialogOptions } from "electron";
import { existsSync } from "fs";

const isDev = !app.isPackaged;

// Configurar nombre de la app antes de que esté ready
app.setName("ProfileHub");

/**
 * Resuelve rutas al asset tanto en desarrollo (carpeta del proyecto)
 * como cuando la app está empaquetada (process.resourcesPath).
 */
function getPublicAssetPath(...p: string[]) {
  const devPath = path.join(__dirname, "..", "public", ...p);
  if (!app.isPackaged && existsSync(devPath)) return devPath;

  // En build: los assets deben copiarse a resources (ej. con electron-builder "extraResources")
  return path.join(process.resourcesPath, ...p);
}

function createWindow() {
  // Ruta al icono para Win/Linux (en macOS el Dock se maneja con app.dock.setIcon)
  const winLinuxIconPath = getPublicAssetPath("icono.png");

  const win = new BrowserWindow({
    width: 1100,
    height: 740,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: existsSync(winLinuxIconPath) ? winLinuxIconPath : undefined,
  });

  win.loadURL("http://localhost:3000");

  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  // --- Configurar nombre de la app ---
  app.setName("ProfileHub");
  
  // --- Icono del Dock (macOS) ---
  if (process.platform === "darwin" && app.dock) {
    // Usar el archivo .icns redondeado si existe, sino el PNG redondeado
    const icnsPath = isDev 
      ? path.join(__dirname, "..", "..", "public", "icono.icns")
      : getPublicAssetPath("icono.icns");
    const roundedPngPath = isDev 
      ? path.join(__dirname, "..", "..", "public", "icono-rounded.png")
      : getPublicAssetPath("icono-rounded.png");
    
    const dockPngPath = existsSync(roundedPngPath) ? roundedPngPath :
                       isDev ? path.join(__dirname, "..", "..", "public", "icono.png")
                             : getPublicAssetPath("icono.png");
    
    console.log("[ProfileHub] Intentando cargar icono desde:", dockPngPath);
    console.log("[ProfileHub] Archivo existe:", existsSync(dockPngPath));
    
    const img = nativeImage.createFromPath(dockPngPath);
    console.log("[ProfileHub] Icono cargado, isEmpty():", img.isEmpty());
    
    if (!img.isEmpty()) {
      // Redimensionar el icono al tamaño exacto del Dock (54px)
      const dockSize = 54;
      const resizedImg = img.resize({ width: dockSize, height: dockSize });
      app.dock.setIcon(resizedImg);
      console.log("[ProfileHub] Icono redimensionado a", dockSize, "px y aplicado al dock desde:", dockPngPath);
    } else {
      console.warn("[ProfileHub] Icono Dock vacío o no encontrado:", dockPngPath);
    }
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("open:url", async (_e, url: string) => {
  await shell.openExternal(url);
  return true;
});

ipcMain.handle("open:app", async (_e, appPathOrId: string, args: string[] = []) => {
  if (process.platform === "darwin") {
    let child;
    if (appPathOrId.startsWith("id:")) {
      child = spawn("open", ["-b", appPathOrId.slice(3), ...args], { detached: true });
    } else if (appPathOrId.endsWith(".app")) {
      child = spawn("open", ["-a", appPathOrId, ...args], { detached: true });
    } else {
      child = spawn("open", ["-a", appPathOrId, ...args], { detached: true });
    }
    child.on("error", (err) => console.error("open:app error:", err));
    return true;
  }

  const child = spawn(appPathOrId, args, { detached: true, shell: process.platform === "win32" });
  child.on("error", (err) => console.error("spawn error:", err));
  return true;
});

ipcMain.handle("open:file", async (_e, filePath: string) => {
  await shell.openPath(filePath);
  return true;
});

/**
 * Selector de aplicaciones (Finder/Explorer) usando la API síncrona.
 * Devuelve la ruta elegida o null si se cancela.
 */
ipcMain.handle("dialog:openApp", async (e) => {
  const win = BrowserWindow.fromWebContents(e.sender) ?? null;

  let filters: OpenDialogOptions["filters"] | undefined;
  let defaultPath: string | undefined;

  if (process.platform === "darwin") {
    filters = [{ name: "Aplicaciones", extensions: ["app"] }];
    const candidates = ["/Applications", "/System/Applications"];
    defaultPath = candidates.find((p) => {
      try {
        return existsSync(p);
      } catch {
        return false;
      }
    });
  } else if (process.platform === "win32") {
    filters = [{ name: "Aplicaciones", extensions: ["exe", "lnk", "bat", "cmd"] }];
  } else {
    // Linux: lanzadores .desktop o binarios (orientativo)
    filters = [{ name: "Aplicaciones", extensions: ["desktop"] }];
  }

  const options: OpenDialogOptions = {
    title: "Selecciona una aplicación",
    properties: ["openFile"],
    filters,
    defaultPath,
  };

  const files = win
    ? dialog.showOpenDialogSync(win, options)
    : dialog.showOpenDialogSync(options);

  if (!files || files.length === 0) return null;
  return files[0];
});
