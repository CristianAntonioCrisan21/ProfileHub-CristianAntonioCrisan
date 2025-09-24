"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// electron/preload.ts
const electron_1 = require("electron");
const api = {
    openUrl: (url) => electron_1.ipcRenderer.invoke("open:url", url),
    openApp: (pathOrId, args = []) => electron_1.ipcRenderer.invoke("open:app", pathOrId, args),
};
// Exponer la API al contexto principal usando la variable api
electron_1.contextBridge.exposeInMainWorld("native", api);
