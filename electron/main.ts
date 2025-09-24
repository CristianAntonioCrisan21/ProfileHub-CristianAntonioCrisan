import { app, BrowserWindow, ipcMain, shell } from "electron";
import { spawn } from "child_process";
import path from "path";

// Configuración de desarrollo se puede agregar aquí si es necesario

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 740,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  // Ocultar el icono del dock en macOS
  if (process.platform === "darwin") {
    app.dock?.hide();
  }
  
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC Handlers
ipcMain.handle("open:url", async (_e, url: string) => {
  await shell.openExternal(url);
  return true;
});

ipcMain.handle(
  "open:app",
  async (_e, appPathOrId: string, args: string[] = []) => {
    const child = spawn(appPathOrId, args, {
      detached: true,
      shell: process.platform === "win32",
    });
    child.on("error", (err) => console.error("spawn error:", err));
    return true;
  }
);