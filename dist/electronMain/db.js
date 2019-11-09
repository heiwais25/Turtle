"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nedb_1 = __importDefault(require("nedb"));
var path_1 = __importDefault(require("path"));
var DatabaseService = /** @class */ (function () {
    /**
     * Initialize DB
     * @param path Directory to store Data Base
     */
    function DatabaseService(filePath) {
        var _this = this;
        this.deleteById = function (dbName, id) {
            return new Promise(function (resolve, reject) {
                _this._db[dbName].remove({ _id: id }, function (err, _numRemoved) {
                    if (err) {
                        reject(err);
                    }
                    resolve(id);
                });
            });
        };
        this._db = {
            tasks: new nedb_1.default({
                filename: path_1.default.join(filePath, "tasks.db"),
                timestampData: true,
                autoload: true
            }),
            projects: new nedb_1.default({
                filename: filePath + "/projects.db",
                timestampData: true,
                autoload: true
            })
        };
    }
    DatabaseService.prototype.getProjectById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById("projects", id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.getProjectAllList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllUndeletedList("projects")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.createProject = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = __assign(__assign({}, formData), { isDeleted: false });
                        return [4 /*yield*/, this.createItem("projects", query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.updateProject = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateItem("projects", formData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.updateProjectList = function (projectList) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(projectList.map(function (project) {
                            var updatedAt = project.updatedAt, extra = __rest(project, ["updatedAt"]);
                            return _this.updateItem("projects", extra);
                        }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Change the order of two project which will be used as a input
     */
    DatabaseService.prototype.changeProjectOrder = function (projectA, projectB) {
        return __awaiter(this, void 0, void 0, function () {
            var largeIdxProject, smallIdxProject, smallOrder, largeOrder, updatedAt, extra;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        largeIdxProject = projectA.order < projectB.order ? projectB : projectA;
                        smallIdxProject = largeIdxProject.order === projectA.order ? projectB : projectA;
                        smallOrder = smallIdxProject.order;
                        largeOrder = largeIdxProject.order;
                        // It will swap order
                        // 넣기 전, 작은 order <= order < 큰 order 사이의 order를 증가
                        return [4 /*yield*/, this.findAndUpdate("projects", { order: { $gte: smallOrder, $lt: largeOrder } }, { $inc: { order: 1 } })];
                    case 1:
                        // It will swap order
                        // 넣기 전, 작은 order <= order < 큰 order 사이의 order를 증가
                        _a.sent();
                        // 작은 order를 큰 order의 데이터에 넣는다.
                        largeIdxProject.order = smallOrder;
                        updatedAt = largeIdxProject.updatedAt, extra = __rest(largeIdxProject, ["updatedAt"]);
                        return [4 /*yield*/, this.updateItem("projects", extra)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, [smallOrder, largeOrder]];
                }
            });
        });
    };
    DatabaseService.prototype.deleteProject = function (project) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 1. 삭제
                    return [4 /*yield*/, this.deleteById("projects", project._id)];
                    case 1:
                        // 1. 삭제
                        _a.sent();
                        // 2. 현재 id 보다 낮은 모든 항들에 대해 order - 1
                        return [4 /*yield*/, this.findAndUpdate("projects", { order: { $gt: project.order } }, { $inc: { order: -1 } })];
                    case 2:
                        // 2. 현재 id 보다 낮은 모든 항들에 대해 order - 1
                        _a.sent();
                        return [2 /*return*/, project._id];
                }
            });
        });
    };
    DatabaseService.prototype.getTaskById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findById("tasks", id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.getTaskList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllUndeletedList("tasks")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.createTask = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = __assign(__assign({}, formData), { isDeleted: false });
                        return [4 /*yield*/, this.createItem("tasks", query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.updateTask = function (formData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateItem("tasks", formData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.deleteTaskById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteById("tasks", id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.createSubTask = function (taskId, formData) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = __assign(__assign({}, formData), { isFinished: false });
                        return [4 /*yield*/, this.findOneAndUpdate("tasks", { _id: taskId }, { $push: { subTaskList: query } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.updateSubTask = function (taskId, formData) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {};
                        if (formData.name) {
                            query.$set = {
                                "subTaskList.$.name": formData.name
                            };
                        }
                        if (formData.order) {
                            query.$set = {
                                "subTaskList.$.order": formData.order
                            };
                        }
                        if (formData.isFinished) {
                            query.$set = {
                                "subTaskList.$.isFinished": formData.isFinished
                            };
                        }
                        return [4 /*yield*/, this.findOneAndUpdate("tasks", { _id: taskId, "subTaskList._id": formData._id }, query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseService.prototype.deleteSubTask = function (taskId, subTaskId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._db.tasks.update({ _id: taskId }, { $pull: { "subTaskList._id": subTaskId } }, {}, function (err, _numRemoved) {
                            if (err) {
                                reject(err);
                            }
                            resolve(taskId);
                        });
                    }).then(this.getTaskById)];
            });
        });
    };
    // ================================================================
    // Operations
    DatabaseService.prototype.findById = function (dbName, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._db[dbName].findOne({ _id: id }, function (err, doc) {
                if (err) {
                    reject(err);
                }
                resolve(doc);
            });
        });
    };
    DatabaseService.prototype.findOne = function (dbName, findQuery) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._db[dbName].findOne(findQuery, function (err, doc) {
                if (err) {
                    reject(err);
                }
                resolve(doc);
            });
        });
    };
    DatabaseService.prototype.find = function (dbName, findQuery) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._db[dbName].find(findQuery, function (err, docs) {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
    };
    DatabaseService.prototype.getAllUndeletedList = function (dbName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var query = {
                isDeleted: false
            };
            _this._db[dbName]
                .find(query)
                .sort({ order: 1 })
                .exec(function (err, docs) {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
    };
    DatabaseService.prototype.createItem = function (dbName, query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._db[dbName].insert(query, function (err, newDoc) {
                if (err) {
                    reject(err);
                }
                resolve(newDoc);
            });
        });
    };
    DatabaseService.prototype.updateItem = function (dbName, formData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._db[dbName].update({ _id: formData._id }, formData, {}, function (err, _numReplaced) {
                if (err) {
                    reject(err);
                }
                _this.findById(dbName, formData._id).then(function (item) {
                    resolve(item);
                });
            });
        });
    };
    DatabaseService.prototype.findOneAndUpdate = function (dbName, findQuery, updateQuery) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._db[dbName].update(findQuery, updateQuery, {}, function (err, _numRemoved) {
                if (err) {
                    reject(err);
                }
                _this.findOne(dbName, findQuery).then(function (item) {
                    resolve(item);
                });
            });
        });
    };
    DatabaseService.prototype.findAndUpdate = function (dbName, findQuery, updateQuery) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._db[dbName].update(findQuery, updateQuery, { multi: true }, function (err, numChanged) {
                if (err) {
                    reject(err);
                }
                resolve(numChanged);
            });
        });
    };
    return DatabaseService;
}());
exports.default = DatabaseService;
//# sourceMappingURL=db.js.map