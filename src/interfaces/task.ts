import { ITaskDB, ISubTaskDB } from "electronMain/interfaces/task";
import { List, Record } from "immutable";

// The type will assume we are using the immutable record

export interface ISubTask extends ISubTaskDB {}

export type ISubTaskRecord = Record<ISubTask> & Readonly<ISubTask>;

export interface ITaskWithRawSub extends Omit<ITaskDB, "subTaskList"> {
  subTaskList: List<ISubTask>;
}

export interface ITask extends Omit<ITaskDB, "subTaskList"> {
  subTaskList: ISubTask[];
}

export interface ITaskWithSubTaskListRecord
  extends Omit<ITaskDB, "subTaskList"> {
  subTaskList: List<ISubTaskRecord>;
}

export type ITaskRecord = Record<ITaskWithSubTaskListRecord> &
  Readonly<ITaskWithSubTaskListRecord>;

export type ITaskListGroup = {
  toDo: List<ITaskRecord>;
  doing: List<ITaskRecord>;
  done: List<ITaskRecord>;
};

export type ITaskListGroupRecord = Record<ITaskListGroup> &
  Readonly<ITaskListGroup>;

export type ITaskState = {
  fullTaskList: List<ITaskRecord>;
  taskListGroup: ITaskListGroupRecord;
  currentTask?: ITaskRecord;
};

export type ITaskStateRecord = Record<ITaskState> & Readonly<ITaskState>;

export type ITaskStatePayload = ITaskStateRecord & {
  projectId?: string;
  id: string;
};
