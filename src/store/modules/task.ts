import { handleActions, Action } from "redux-actions";
import { ITaskDB } from "electronMain/interfaces/task";
import { pender } from "redux-pender/lib/utils";
import * as ActionTypes from "constants/taskActionTypes";
import { ITask, ITaskStateRecord } from "interfaces/task";
import { TaskRecord, TaskStateRecord, TaskListGroupRecord } from "records/task";
import { ITaskStatePayload } from "../../interfaces/task";
import { List } from "immutable";

export default handleActions<ITaskStateRecord, ITaskStatePayload>(
  {
    [ActionTypes.UPDATE_TASK_LIST_GROUP]: (state, action) => {
      const { taskListGroup } = action.payload;
      return state.set("taskListGroup", taskListGroup);
    },
    [ActionTypes.GET_TASK_LIST_OF_PROJECT]: (state, action) => {
      const { projectId } = action.payload;
      if (!projectId) {
        return state.set(
          "taskListGroup",
          new TaskListGroupRecord(
            state.fullTaskList
              .sort((a, b) => {
                return (
                  a.order - b.order ||
                  b.updatedAt.getTime() - a.updatedAt.getTime()
                );
              })
              .groupBy(task => task.process)
          )
        );
      }

      return state.set(
        "taskListGroup",
        new TaskListGroupRecord(
          state.fullTaskList
            .sort((a, b) => {
              return (
                a.order - b.order ||
                b.updatedAt.getTime() - a.updatedAt.getTime()
              );
            })
            .filter(item => item.projectId === projectId)
            .groupBy(task => task.process)
        )
      );
    },
    ...pender({
      type: ActionTypes.CREATE_TASK,
      onSuccess: (state, action: Action<ITask>) => {
        const newTask = action.payload;
        const newTaskRecord = new TaskRecord(newTask);

        return state
          .update("taskListGroup", taskListGroup =>
            taskListGroup.set(
              newTask.process,
              taskListGroup[newTask.process].unshift(newTaskRecord)
            )
          )
          .update("fullTaskList", fullTaskList =>
            fullTaskList.unshift(newTaskRecord)
          );
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_TASK,
      onSuccess: (state, action: Action<ITask>) => {
        const updatedTask = action.payload;
        const { taskListGroup, fullTaskList } = state;

        // Find in the current task
        const taskIdx = taskListGroup[updatedTask.process].findIndex(
          task => task._id === updatedTask._id
        );

        const taskIdxInFullList = fullTaskList.findIndex(
          task => task._id === updatedTask._id
        );

        if (taskIdx < 0 || taskIdxInFullList < 0) {
          return state;
        }

        const updatedTaskRecord = new TaskRecord(updatedTask);

        return state
          .setIn(
            ["taskListGroup", updatedTask.process, taskIdx],
            updatedTaskRecord
          )
          .setIn(["fullTaskList", taskIdxInFullList], updatedTaskRecord);
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_TASK_LIST,
      onSuccess: (state, action: Action<ITask[]>) => {
        const updatedTaskList = action.payload;
        // 해당되는 항목들을 전부 fullTaskList에서 update

        const fullTaskIdList = state.fullTaskList.map(item => item._id);

        return state.update("fullTaskList", fullTaskList => {
          return fullTaskList.withMutations(taskList => {
            updatedTaskList.forEach(updatedTask => {
              const index = fullTaskIdList.findIndex(
                item => item === updatedTask._id
              );
              if (index >= 0) {
                taskList.set(index, new TaskRecord(updatedTask));
              }
            });
          });
        });
      }
    }),
    ...pender({
      type: ActionTypes.GET_TASK_LIST_LOCAL,
      // It invokes at the first time
      // It will group by it's process the raw list which was just list of task
      onSuccess: (state, action: Action<ITask[]>) => {
        const rawTaskList = action.payload;

        const fullTaskList = List(
          rawTaskList.map(task => new TaskRecord(task))
        );

        return state
          .set("fullTaskList", fullTaskList)
          .set(
            "taskListGroup",
            new TaskListGroupRecord(fullTaskList.groupBy(x => x.process))
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

        const deletedIdxInFullList = state.fullTaskList.findIndex(
          item => item._id === deletedTask._id
        );

        if (deletedIdx < 0 || deletedIdxInFullList < 0) {
          return state;
        }

        return state
          .update("taskListGroup", taskListGroup =>
            taskListGroup.set(
              deletedTask.process,
              taskListGroup[deletedTask.process].splice(deletedIdx, 1)
            )
          )
          .update("fullTaskList", fullTaskList =>
            fullTaskList.splice(deletedIdxInFullList, 1)
          );
      }
    })
  },
  new TaskStateRecord()
);
