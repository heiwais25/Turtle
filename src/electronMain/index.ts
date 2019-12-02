import electron, { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import DatabaseService from "./db";
import installExtensions, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer";
import "electron-reload";

let mainWindow: electron.BrowserWindow | null;
function createWindow() {
  const isDev = process.env.NODE_ENV === "development";
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
    isDev ? "." : `${app.getPath("userData")}/data`
  );
  (global as any).db = dbService;
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
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
