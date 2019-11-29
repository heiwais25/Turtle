import { handleActions, Action } from "redux-actions";
import { ITaskDB } from "electronMain/interfaces/task";
import { pender } from "redux-pender/lib/utils";
import * as ActionTypes from "constants/taskActionTypes";
import _ from "lodash";
import { ITask, ITaskStateRecord } from "interfaces/task";
import { TaskRecord, TaskStateRecord, TaskListGroupRecord } from "records/task";
import { ITaskListGroup } from "../../interfaces/task";

export default handleActions<ITaskStateRecord>(
  {
    [ActionTypes.UPDATE_TASK_LIST_GROUP]: (state, action) => {
      const { taskListGroup } = action.payload;
      return state.set("taskListGroup", taskListGroup);
    },
    ...pender({
      type: ActionTypes.CREATE_TASK,
      onSuccess: (state, action: Action<ITask>) => {
        const newTask = action.payload;
        return state.update("taskListGroup", taskListGroup =>
          taskListGroup.set(
            newTask.process,
            taskListGroup[newTask.process].unshift(new TaskRecord(newTask))
          )
        );
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_TASK,
      onSuccess: (state, action: Action<ITask>) => {
        const updatedTask = action.payload;
        const { taskListGroup } = state;

        // Find in the current task
        const taskIdx = taskListGroup[updatedTask.process].findIndex(
          task => task._id === updatedTask._id
        );

        if (taskIdx < 0) {
          return state;
        }

        return state.setIn(
          ["taskListGroup", updatedTask.process, taskIdx],
          new TaskRecord(updatedTask)
        );
      }
    }),
    ...pender({
      type: ActionTypes.GET_TASK_LIST_LOCAL,
      // It will group by it's process the raw list which was just list of task
      onSuccess: (state, action: Action<ITask[]>) => {
        const rawTaskList = action.payload;
        return state.set(
          "taskListGroup",
          new TaskListGroupRecord(
            (_.groupBy(rawTaskList, "process") as unknown) as ITaskListGroup
          )
        );
      }
    }),
    ...pender({
      type: ActionTypes.DELETE_TASK,
      // It will group by it's process the raw list which was just list of task
      onSuccess: (state, action: Action<ITaskDB>) => {
        const deletedTask = action.payload;
        // Get current idx
        const deletedIdx = state.taskListGroup[deletedTask.process].findIndex(
          item => item._id === deletedTask._id
        );

        if (deletedIdx < 0) {
          return state;
        }

        return state.update("taskListGroup", taskListGroup =>
          taskListGroup.set(
            deletedTask.process,
            taskListGroup[deletedTask.process].splice(deletedIdx, 1)
          )
        );
      }
    })
  },
  new TaskStateRecord()
);
