// electron/preload.ts
import { contextBridge, ipcRenderer } from "electron";

export type NativeAPI = {
  openUrl: (url: string) => Promise<boolean>;
  openApp: (pathOrId: string, args?: string[]) => Promise<boolean>;
  selectApp: () => Promise<string | null>;
};

const api: NativeAPI = {
  openUrl: (url) => ipcRenderer.invoke("open:url", url),
  openApp: (pathOrId, args = []) => ipcRenderer.invoke("open:app", pathOrId, args),
  selectApp: () => ipcRenderer.invoke("select:app"),
};

// Exponer la API al contexto principal usando la variable api
contextBridge.exposeInMainWorld("native", api);