import { contextBridge, ipcRenderer } from "electron";

export type NativeAPI = {
  openUrl: (url: string) => Promise<boolean>;
  openApp: (pathOrId: string, args?: string[]) => Promise<boolean>;
  openFile: (path: string) => Promise<boolean>;
};

const api: NativeAPI = {
  openUrl: (url) => ipcRenderer.invoke("open:url", url) as Promise<boolean>,
  openApp: (pathOrId, args = []) =>
    ipcRenderer.invoke("open:app", pathOrId, args) as Promise<boolean>,
  openFile: (path) => ipcRenderer.invoke("open:file", path) as Promise<boolean>,
};

// Exponemos una API segura en el contexto del renderer
contextBridge.exposeInMainWorld("native", api);
