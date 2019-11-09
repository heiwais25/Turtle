import Datastore from "nedb";
import {
  TaskDBData,
  SubTaskDBData,
  TaskDBCreateQueryData,
  TaskDBUpdateQueryData,
  SubTaskDBCreateQueryData,
  SubTaskDBUpdateQueryData
} from "../interfaces/task";
import {
  ProjectDBData,
  ProjectDBCreateQueryData,
  ProjectDBUpdateQueryData
} from "../interfaces/project";
import path from "path";
import { reject } from "q";

/**
 * DB Wrapper handling task and project
 */

type DBNameData = "tasks" | "projects";
class DatabaseService {
  private _db!: {
    tasks: Nedb;
    projects: Nedb;
  };

  /**
   * Initialize DB
   * @param path Directory to store Data Base
   */
  constructor(filePath: string) {
    this._db = {
      tasks: new Datastore({
        filename: path.join(filePath, "tasks.db"),
        timestampData: true,
        autoload: true
      }),
      projects: new Datastore({
        filename: `${filePath}/projects.db`,
        timestampData: true,
        autoload: true
      })
    };
  }

  public async getProjectById(id: ProjectDBData["_id"]) {
    return await this.findById<ProjectDBData>("projects", id);
  }

  public async getProjectAllList(): Promise<ProjectDBData[]> {
    return await this.getAllUndeletedList<ProjectDBData>("projects");
  }

  public async createProject(formData: {
    name: ProjectDBData["name"];
    order: ProjectDBData["order"];
  }) {
    const query: ProjectDBCreateQueryData = {
      ...formData,
      isDeleted: false
    };
    return await this.createItem<ProjectDBData>("projects", query);
  }

  public async updateProject(formData: ProjectDBUpdateQueryData) {
    return await this.updateItem<ProjectDBData>("projects", formData);
  }

  public async updateProjectList(projectList: ProjectDBData[]) {
    return await Promise.all(
      projectList.map(project => {
        const { updatedAt, ...extra } = project;
        return this.updateItem<ProjectDBData>("projects", extra);
      })
    );
  }

  /**
   * Change the order of two project which will be used as a input
   */
  public async changeProjectOrder(
    projectA: ProjectDBData,
    projectB: ProjectDBData
  ) {
    // 큰 order의 data를 찾는다.
    const largeIdxProject =
      projectA.order < projectB.order ? projectB : projectA;
    const smallIdxProject =
      largeIdxProject.order === projectA.order ? projectB : projectA;

    const smallOrder = smallIdxProject.order;
    const largeOrder = largeIdxProject.order;

    // It will swap order

    // 넣기 전, 작은 order <= order < 큰 order 사이의 order를 증가
    await this.findAndUpdate(
      "projects",
      { order: { $gte: smallOrder, $lt: largeOrder } },
      { $inc: { order: 1 } }
    );

    // 작은 order를 큰 order의 데이터에 넣는다.
    largeIdxProject.order = smallOrder;
    const { updatedAt, ...extra } = largeIdxProject;
    await this.updateItem<ProjectDBData>("projects", extra);
    return [smallOrder, largeOrder];
  }

  public async deleteProject(project: ProjectDBData) {
    // 1. 삭제
    await this.deleteById("projects", project._id);

    // 2. 현재 id 보다 낮은 모든 항들에 대해 order - 1
    await this.findAndUpdate(
      "projects",
      { order: { $gt: project.order } },
      { $inc: { order: -1 } }
    );

    return project._id;
  }

  public async getTaskById(id: TaskDBData["_id"]) {
    return await this.findById<TaskDBData>("tasks", id);
  }

  public async getTaskList() {
    return await this.getAllUndeletedList<TaskDBData>("tasks");
  }

  public async createTask(formData: {
    name: TaskDBData["name"];
    order: TaskDBData["order"];
    projectId: TaskDBData["projectId"];
    process: TaskDBData["process"];
  }) {
    const query: TaskDBCreateQueryData = {
      ...formData,
      isDeleted: false
    };

    return await this.createItem<TaskDBData>("tasks", query);
  }

  public async updateTask(formData: TaskDBUpdateQueryData) {
    return await this.updateItem("tasks", formData);
  }

  public async deleteTaskById(id: TaskDBData["_id"]) {
    return await this.deleteById("tasks", id);
  }

  public async createSubTask(
    taskId: TaskDBData["_id"],
    formData: {
      name: SubTaskDBData["name"];
      order: SubTaskDBData["order"];
    }
  ) {
    const query: SubTaskDBCreateQueryData = {
      ...formData,
      isFinished: false
    };

    return await this.findOneAndUpdate<TaskDBData>(
      "tasks",
      { _id: taskId },
      { $push: { subTaskList: query } }
    );
  }

  public async updateSubTask(
    taskId: TaskDBData["_id"],
    formData: SubTaskDBUpdateQueryData
  ) {
    const query: { $set?: Object } = {};

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

    return await this.findOneAndUpdate<TaskDBData>(
      "tasks",
      { _id: taskId, "subTaskList._id": formData._id },
      query
    );
  }

  public async deleteSubTask(
    taskId: TaskDBData["_id"],
    subTaskId: SubTaskDBData["_id"]
  ) {
    return new Promise<string>((resolve, reject) => {
      this._db.tasks.update(
        { _id: taskId },
        { $pull: { "subTaskList._id": subTaskId } },
        {},
        (err, _numRemoved) => {
          if (err) {
            reject(err);
          }
          resolve(taskId);
        }
      );
    }).then(this.getTaskById);
  }

  // ================================================================
  // Operations

  private findById<T>(dbName: DBNameData, id: string) {
    return new Promise<T>((resolve, reject) => {
      this._db[dbName].findOne({ _id: id }, (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }

  private findOne<T>(dbName: DBNameData, findQuery: unknown) {
    return new Promise<T>((resolve, reject) => {
      this._db[dbName].findOne(findQuery, (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }

  private find<T>(dbName: DBNameData, findQuery: unknown) {
    return new Promise<T[]>((resolve, reject) => {
      this._db[dbName].find(findQuery, (err: Error, docs: T[]) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  }

  private getAllUndeletedList<T>(dbName: DBNameData) {
    return new Promise<T[]>((resolve, reject) => {
      const query: { isDeleted: boolean } = {
        isDeleted: false
      };

      this._db[dbName]
        .find(query)
        .sort({ order: 1 })
        .exec((err: Error, docs: T[]) => {
          if (err) {
            reject(err);
          }
          resolve(docs);
        });
    });
  }

  private createItem<T>(dbName: DBNameData, query: unknown) {
    return new Promise<T>((resolve, reject) => {
      this._db[dbName].insert(query, (err, newDoc) => {
        if (err) {
          reject(err);
        }
        resolve((newDoc as unknown) as T);
      });
    });
  }

  private updateItem<T>(dbName: DBNameData, formData: { _id: string }) {
    return new Promise<T>((resolve, reject) => {
      this._db[dbName].update(
        { _id: formData._id },
        formData,
        {},
        (err, _numReplaced) => {
          if (err) {
            reject(err);
          }
          this.findById<T>(dbName, formData._id).then(item => {
            resolve(item);
          });
        }
      );
    });
  }

  private findOneAndUpdate<T>(
    dbName: DBNameData,
    findQuery: unknown,
    updateQuery: unknown
  ) {
    return new Promise<T>((resolve, reject) => {
      this._db[dbName].update(
        findQuery,
        updateQuery,
        {},
        (err, _numRemoved) => {
          if (err) {
            reject(err);
          }

          this.findOne<T>(dbName, findQuery).then(item => {
            resolve(item);
          });
        }
      );
    });
  }

  private findAndUpdate(
    dbName: DBNameData,
    findQuery: unknown,
    updateQuery: unknown
  ) {
    return new Promise<number>((resolve, reject) => {
      this._db[dbName].update(
        findQuery,
        updateQuery,
        { multi: true },
        (err, numChanged) => {
          if (err) {
            reject(err);
          }
          resolve(numChanged);
        }
      );
    });
  }

  private deleteById = (dbName: DBNameData, id: string) => {
    return new Promise<string>((resolve, reject) => {
      this._db[dbName].remove({ _id: id }, (err, _numRemoved) => {
        if (err) {
          reject(err);
        }
        resolve(id);
      });
    });
  };
}

export default DatabaseService;
