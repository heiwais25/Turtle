"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = __importDefault(require("./db"));
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var dbService = new db_1.default(electron_is_dev_1.default ? "." : electron_1.app.getAppPath() + "/data");
global.db = dbService;
//# sourceMappingURL=preload.js.map