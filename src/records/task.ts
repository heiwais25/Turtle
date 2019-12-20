import { Record, List } from "immutable";
import moment from "moment";
import { ISubTask, ITask, ITaskListGroup, ITaskState } from "interfaces/task";
import {
  ITaskRecord,
  ITaskWithSubTaskListRecord,
  ISubTaskRecord
} from "../interfaces/task";

export const SubTaskRecord = Record<ISubTask>({
  _id: "",
  isFinished: false,
  name: "",
  order: 0
});

export class TaskRecord extends Record<ITaskWithSubTaskListRecord>({
  _id: "",
  name: "",
  process: "toDo",
  projectId: undefined,
  description: "",
  isDeleted: false,
  dueAt: undefined,
  createdAt: moment().toDate(),
  updatedAt: moment().toDate(),
  subTaskList: List<ISubTaskRecord>([]),
  order: 0
}) {
  constructor(task: ITask) {
    super({
      ...task,
      subTaskList:
        task.subTaskList && task.subTaskList.length
          ? List(task.subTaskList.map(item => new SubTaskRecord(item)))
          : List([])
    });
  }
}

export const TaskListGroupRecord = Record<ITaskListGroup>({
  toDo: List([]),
  doing: List([]),
  done: List([])
});

export const TaskStateRecord = Record<ITaskState>({
  fullTaskList: List<ITaskRecord>([]),
  taskListGroup: new TaskListGroupRecord(),
  currentTask: undefined
});
