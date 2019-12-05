import electron, { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import path from "path";
import DatabaseService from "./db";
import installExtensions, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer";
import "electron-reload";

log.transports.file.level = "info";
autoUpdater.logger = log;

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

app.on("ready", () => {
  createWindow();
});
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

// ================================================================================
// Manage auto update related functions
function sendStatusToWindow(text: string) {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send("message", text);
  }
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", info => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", info => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", err => {
  sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", progressObj => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow("Update downloaded");
});

app.on("ready", function() {
  autoUpdater.checkForUpdatesAndNotify();
});
