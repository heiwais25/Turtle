import { handleActions, Action } from "redux-actions";
import { TaskDBData } from "interfaces/task";
import { pender } from "redux-pender/lib/utils";
import produce from "immer";
import * as ActionTypes from "constants/taskActionTypes";
import _ from "lodash";

export type TaskState = {
  groupedTaskList: {
    toDo: TaskDBData[];
    doing: TaskDBData[];
    done: TaskDBData[];
  };
  currentTask?: TaskDBData;
};

const defaultTaskData: TaskState = {
  groupedTaskList: {
    toDo: [],
    doing: [],
    done: []
  }
};

const initialState: TaskState = defaultTaskData;

export default handleActions<TaskState>(
  {
    [ActionTypes.SET_GROUPED_TASK_LIST]: (state, action) => {
      const { groupedTaskList } = action.payload;
      return produce(state, draft => {
        draft.groupedTaskList = groupedTaskList;
      });
    },
    ...pender({
      type: ActionTypes.CREATE_TASK,
      onSuccess: (state, action: Action<TaskDBData>) => {
        const newTask = action.payload;
        return produce(state, draft => {
          draft.groupedTaskList[newTask.process].unshift(newTask);
        });
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_TASK,
      onSuccess: (state, action: Action<TaskDBData>) => {
        const updatedTask = action.payload;
        const taskIdx = state.groupedTaskList[updatedTask.process].findIndex(
          task => task._id === updatedTask._id
        );
        return produce(state, draft => {
          if (taskIdx >= 0) {
            draft.groupedTaskList[updatedTask.process][taskIdx] = updatedTask;
          }
        });
      }
    }),
    ...pender({
      type: ActionTypes.GET_TASK_LIST_LOCAL,
      // It will group by it's process the raw list which was just list of task
      onSuccess: (state, action: Action<TaskDBData[]>) => {
        const rawTaskList = action.payload;
        const groupedTaskList = {
          ...defaultTaskData.groupedTaskList,
          ...(_.groupBy(rawTaskList, "process") as TaskState["groupedTaskList"])
        };

        return produce(state, draft => {
          draft.groupedTaskList = groupedTaskList;
        });
      }
    }),
    ...pender({
      type: ActionTypes.DELETE_TASK,
      // It will group by it's process the raw list which was just list of task
      onSuccess: (state, action: Action<TaskDBData>) => {
        const deletedTask = action.payload;
        const taskList = state.groupedTaskList[deletedTask.process].slice();
        // Get current idx
        const deletedIdx = taskList.findIndex(
          item => item._id === deletedTask._id
        );

        if (deletedIdx >= 0) {
          // delete from the list
          taskList.splice(deletedIdx, 1);
          taskList.forEach((task, idx) => {
            task.order = idx;
          });
        }

        return {
          ...state,
          groupedTaskList: produce(state.groupedTaskList, draft => {
            draft[deletedTask.process] = taskList;
          })
        };
      }
    })
  },
  initialState
);
