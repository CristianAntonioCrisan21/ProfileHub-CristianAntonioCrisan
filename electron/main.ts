import { app, BrowserWindow, ipcMain, shell } from "electron";
import { spawn } from "child_process";
import path from "path";

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 740,
    webPreferences: {
      // Apunta al preload compilado en dist
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:3000");

  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(createWindow);

ipcMain.handle("open:url", async (_e, url: string) => {
  await shell.openExternal(url);
  return true;
});

ipcMain.handle("open:app", async (_e, appPathOrId: string, args: string[] = []) => {
  if (process.platform === "darwin") {
    let child;
    if (appPathOrId.startsWith("id:")) {
      // Bundle ID (ej: "id:com.apple.calculator")
      child = spawn("open", ["-b", appPathOrId.slice(3), ...args], { detached: true });
    } else if (appPathOrId.endsWith(".app")) {
      // Ruta completa a .app
      child = spawn("open", ["-a", appPathOrId, ...args], { detached: true });
    } else {
      // Nombre de la app (ej: "Calculator" o "Calculadora")
      child = spawn("open", ["-a", appPathOrId, ...args], { detached: true });
    }
    child.on("error", (err) => console.error("open:app error:", err));
    return true;
  }

  // Windows / Linux
  const child = spawn(appPathOrId, args, { detached: true });
  child.on("error", (err) => console.error("spawn error:", err));
  return true;
});

ipcMain.handle("open:file", async (_e, filePath: string) => {
  await shell.openPath(filePath);
  return true;
});
