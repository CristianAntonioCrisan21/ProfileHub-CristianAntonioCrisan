// electron/preload.ts
import { contextBridge, ipcRenderer } from "electron";

export type NativeAPI = {
  openUrl: (url: string) => Promise<boolean>;
  openApp: (pathOrId: string, args?: string[]) => Promise<boolean>;
};

const api: NativeAPI = {
  openUrl: (url) => ipcRenderer.invoke("open:url", url),
  openApp: (pathOrId, args = []) => ipcRenderer.invoke("open:app", pathOrId, args),
};

// Exponer la API al contexto principal usando la variable api
contextBridge.exposeInMainWorld("native", api);