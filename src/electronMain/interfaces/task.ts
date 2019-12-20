export type ProcessTypes = "toDo" | "doing" | "done";

export type ITaskDB = {
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
  subTaskList: ISubTaskDB[];
};

export type ISubTaskDB = {
  _id: string;
  name: string;
  order: number;
  isFinished: boolean;
};

export type TaskDBCreateFormData = {
  name: ITaskDB["name"];
  order: ITaskDB["order"];
  projectId?: ITaskDB["projectId"];
  process: ITaskDB["process"];
};

export type TaskDBCreateQueryData = {
  name: ITaskDB["name"];
  order: ITaskDB["order"];
  projectId?: ITaskDB["projectId"];
  process: ITaskDB["process"];
  isDeleted: ITaskDB["isDeleted"];
};

export type TaskDBUpdateQueryData = {
  _id: ITaskDB["_id"];
  name?: ITaskDB["name"];
  order?: ITaskDB["order"];
  projectId?: ITaskDB["projectId"];
  description?: ITaskDB["description"];
  process?: ITaskDB["process"];
  dueAt?: ITaskDB["dueAt"];
};

export type SubTaskDBCreateFormData = {
  name: ITaskDB["name"];
  order: ITaskDB["order"];
};

export type SubTaskDBCreateQueryData = {
  _id: ISubTaskDB["_id"];
  name: ISubTaskDB["name"];
  order: ISubTaskDB["order"];
  isFinished: ISubTaskDB["isFinished"];
};

export type SubTaskDBUpdateQueryData = {
  _id: ISubTaskDB["_id"];
  name?: ISubTaskDB["name"];
  order?: ISubTaskDB["order"];
  isFinished?: ISubTaskDB["isFinished"];
};

export type FindTaskQueryData = {
  isDeleted: ITaskDB["isDeleted"];
  projectId?: ITaskDB["projectId"];
};
