"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var path_1 = __importDefault(require("path"));
var db_1 = __importDefault(require("./db"));
var electron_devtools_installer_1 = __importStar(require("electron-devtools-installer"));
require("electron-reload");
var mainWindow;
function createWindow() {
    console.log(path_1.default.join(__dirname, "./preload.js"));
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Setup dev tools
    if (electron_is_dev_1.default) {
        electron_devtools_installer_1.default([electron_devtools_installer_1.REACT_DEVELOPER_TOOLS, electron_devtools_installer_1.REDUX_DEVTOOLS]);
    }
    // Prepare DB
    var dbService = new db_1.default(electron_is_dev_1.default ? "." : electron_1.app.getAppPath() + "/data");
    global.db = dbService;
    mainWindow.loadURL(electron_is_dev_1.default
        ? "http://localhost:3000"
        : "file://" + path_1.default.join(__dirname, "../public/index.html"));
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}
electron_1.app.on("will-quit", function () {
    global.db = null;
});
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=index.js.map