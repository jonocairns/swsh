import { contextBridge, ipcRenderer } from "electron";
import type { TScreenShareSelection } from "../main/types";

const desktopBridge = {
  getServerUrl: (): Promise<string> =>
    ipcRenderer.invoke("desktop:get-server-url"),
  setServerUrl: (serverUrl: string): Promise<void> =>
    ipcRenderer.invoke("desktop:set-server-url", serverUrl),
  getCapabilities: () => ipcRenderer.invoke("desktop:get-capabilities"),
  listShareSources: () => ipcRenderer.invoke("desktop:list-share-sources"),
  prepareScreenShare: (selection: TScreenShareSelection) =>
    ipcRenderer.invoke("desktop:prepare-screen-share", selection),
};

contextBridge.exposeInMainWorld("sharkordDesktop", desktopBridge);
