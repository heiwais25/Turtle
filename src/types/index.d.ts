import { IpcRenderer } from "electron";

declare global {
  namespace NodeJS {
    interface Global {
      test: string;
    }
  }

  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

export const { ipcRenderer } = window;
