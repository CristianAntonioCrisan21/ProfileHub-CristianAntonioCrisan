"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// electron/preload.ts
const electron_1 = require("electron");
const api = {
    openUrl: (url) => electron_1.ipcRenderer.invoke("open:url", url),
    openApp: (pathOrId, args = []) => electron_1.ipcRenderer.invoke("open:app", pathOrId, args),
    openFile: (path) => electron_1.ipcRenderer.invoke("open:file", path),
    selectApp: () => electron_1.ipcRenderer.invoke("dialog:openApp"),
};
electron_1.contextBridge.exposeInMainWorld("native", {
    openUrl: (url) => electron_1.ipcRenderer.invoke("open:url", url),
    openApp: (pathOrId, args = []) => electron_1.ipcRenderer.invoke("open:app", pathOrId, args),
    openFile: (path) => electron_1.ipcRenderer.invoke("open:file", path),
    selectApp: () => electron_1.ipcRenderer.invoke("dialog:openApp"),
});
