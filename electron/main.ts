import { app, BrowserWindow, ipcMain, shell, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";

// Interface for dialog result to handle type issues
interface DialogResult {
  canceled: boolean;
  filePaths: string[];
}

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 740,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle("open:url", async (_e, url: string) => {
  await shell.openExternal(url);
  return true;
});

ipcMain.handle(
  "open:app",
  async (_e, appPathOrId: string, args: string[] = []) => {
    try {
      if (process.platform === "darwin" && appPathOrId.endsWith(".app")) {
        // On macOS, use 'open' command for .app bundles
        const child = spawn("open", [appPathOrId, ...args], {
          detached: true,
          stdio: "ignore", // Ignore stdio to avoid keeping the parent process alive
        });
        
        // Unreference the child process so it doesn't keep the parent alive
        child.unref();
        child.on("error", (err) => console.error("spawn error:", err));
      } else {
        // For other platforms or direct executable paths
        const child = spawn(appPathOrId, args, {
          detached: true,
          stdio: "ignore", // Ignore stdio to avoid keeping the parent process alive
          shell: process.platform === "win32",
        });
        
        // Unreference the child process so it doesn't keep the parent alive
        child.unref();
        child.on("error", (err) => console.error("spawn error:", err));
      }
      return true;
    } catch (error) {
      console.error("Failed to open app:", error);
      return false;
    }
  }
);

ipcMain.handle("select:app", async () => {
  try {
    const result = await dialog.showOpenDialog({
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
    } else {
      // New API: returns OpenDialogReturnValue object
      const dialogResult = result as DialogResult;
      if (!dialogResult.canceled && dialogResult.filePaths && dialogResult.filePaths.length > 0) {
        return dialogResult.filePaths[0];
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to select app:", error);
    return null;
  }
});