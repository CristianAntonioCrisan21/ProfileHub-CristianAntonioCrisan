// electron/preload.ts
import { contextBridge, ipcRenderer } from "electron";

export type NativeAPI = {
  openUrl: (url: string) => Promise<boolean>;
  openApp: (pathOrId: string, args?: string[]) => Promise<boolean>;
  openFile: (path: string) => Promise<boolean>;
  selectApp: () => Promise<string | null>;
};

const api: NativeAPI = {
  openUrl: (url) => ipcRenderer.invoke("open:url", url),
  openApp: (pathOrId, args = []) => ipcRenderer.invoke("open:app", pathOrId, args),
  openFile: (path) => ipcRenderer.invoke("open:file", path),
  selectApp: () => ipcRenderer.invoke("dialog:openApp"),
};

contextBridge.exposeInMainWorld("native", {
  openUrl: (url: string) => ipcRenderer.invoke("open:url", url),
  openApp: (pathOrId: string, args: string[] = []) => ipcRenderer.invoke("open:app", pathOrId, args),
  openFile: (path: string) => ipcRenderer.invoke("open:file", path),
  selectApp: () => ipcRenderer.invoke("dialog:openApp"),
});