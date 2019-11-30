import { Record, List } from "immutable";
import moment from "moment";
import { ISubTask, ITask, ITaskListGroup, ITaskState } from "interfaces/task";

export class SubTaskRecord extends Record<ISubTask>({
  _id: "",
  isFinished: false,
  name: "",
  order: 0
}) {}

export class TaskRecord extends Record<ITask>({
  _id: "",
  name: "",
  process: "toDo",
  projectId: undefined,
  isDeleted: false,
  createdAt: moment().toDate(),
  updatedAt: moment().toDate(),
  subTaskList: List<ISubTask>([]),
  order: 0
}) {
  constructor(task: ITask) {
    super({
      ...task,
      subTaskList: !task.subTaskList
        ? List([])
        : task.subTaskList.map(item => new SubTaskRecord(item))
    });
  }
}

export class TaskListGroupRecord extends Record<ITaskListGroup>({
  toDo: List([]),
  doing: List([]),
  done: List([])
}) {
  constructor(taskListGroup?: ITaskListGroup) {
    if (!taskListGroup) {
      super();
    } else {
      super({
        ...taskListGroup,
        ...(Object.keys(taskListGroup) as ITask["process"][]).reduce<
          ITaskListGroup
        >(
          (acc, cur) => {
            console.log(cur);
            acc[cur] = List(
              taskListGroup[cur].map(item => new TaskRecord(item))
            );
            return acc;
          },
          { toDo: List([]), doing: List([]), done: List([]) }
        )
      });
    }
  }
}

export const TaskStateRecord = Record<ITaskState>({
  taskListGroup: new TaskListGroupRecord(),
  currentTask: undefined
});
