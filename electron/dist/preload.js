"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const api = {
    openUrl: (url) => electron_1.ipcRenderer.invoke("open:url", url),
    openApp: (pathOrId, args = []) => electron_1.ipcRenderer.invoke("open:app", pathOrId, args),
    openFile: (path) => electron_1.ipcRenderer.invoke("open:file", path),
};
// Exponemos una API segura en el contexto del renderer
electron_1.contextBridge.exposeInMainWorld("native", api);
