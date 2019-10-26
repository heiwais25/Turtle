import { handleActions, Action } from "redux-actions";

type TaskListItemData = {
    name:string;
}

export type TaskState = {
  taskList: TaskListItemData[];
};

const defaultTaskData: TaskState = {
    taskList: [],
};

const initialState: TaskState = defaultTaskData;

export default handleActions<TaskState>(
  {
  },
  initialState
);
