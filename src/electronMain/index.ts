import electron, { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import DatabaseService from "./db";
import installExtensions, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer";
import "electron-reload";

let mainWindow: electron.BrowserWindow | null;
function createWindow() {
  console.log(path.join(__dirname, "./preload.js"));
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Setup dev tools
  if (isDev) {
    installExtensions([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
  }

  // Prepare DB
  const dbService = new DatabaseService(
    isDev ? "." : `${app.getAppPath()}/data`
  );
  (global as any).db = dbService;

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../public/index.html")}`
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("will-quit", () => {
  (global as any).db = null;
});

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
