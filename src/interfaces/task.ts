export type ProcessTypes = "toDo" | "doing" | "done";

export type TaskDBData = {
  _id: string;
  name: string;
  order: number;
  projectId?: string;
  description?: string;
  process: ProcessTypes;
  isDeleted: boolean;
  dueAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  finishedAt?: Date;
  subTaskList: SubTaskDBData[];
};

export type SubTaskDBData = {
  _id: string;
  name: string;
  order: number;
  isFinished: boolean;
};

export type TaskDBCreateFormData = {
  name: TaskDBData["name"];
  order: TaskDBData["order"];
  projectId?: TaskDBData["projectId"];
  process: TaskDBData["process"];
};

export type TaskDBCreateQueryData = {
  name: TaskDBData["name"];
  order: TaskDBData["order"];
  projectId?: TaskDBData["projectId"];
  process: TaskDBData["process"];
  isDeleted: TaskDBData["isDeleted"];
};

export type TaskDBUpdateQueryData = {
  _id: TaskDBData["_id"];
  name?: TaskDBData["name"];
  order?: TaskDBData["order"];
  projectId?: TaskDBData["projectId"];
  description?: TaskDBData["description"];
  process?: TaskDBData["process"];
  dueAt?: TaskDBData["dueAt"];
};

export type SubTaskDBCreateQueryData = {
  name: SubTaskDBData["name"];
  order: SubTaskDBData["order"];
  isFinished: SubTaskDBData["isFinished"];
};

export type SubTaskDBUpdateQueryData = {
  _id: SubTaskDBData["_id"];
  name?: SubTaskDBData["name"];
  order?: SubTaskDBData["order"];
  isFinished?: SubTaskDBData["isFinished"];
};

export type FindTaskQueryData = {
  isDeleted: TaskDBData["isDeleted"];
  projectId?: TaskDBData["projectId"];
};
