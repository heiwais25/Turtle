import { createAction } from "redux-actions";
import * as ActionTypes from "constants/taskActionTypes";
import {
  TaskDBCreateFormData,
  TaskDBData,
  TaskDBUpdateQueryData
} from "interfaces/task";
import db from "store/db";
import { StoreState } from "../store/modules/index";

const createTaskAPI = (formData: TaskDBCreateFormData, cb?: Function) => {
  return db.createTask(formData).then(res => {
    if (cb) cb();
    return res;
  });
};

const getTaskListAPI = (projectId?: TaskDBData["projectId"]) => {
  return db.getTaskList(projectId);
};

const updateTaskAPI = (formData: TaskDBUpdateQueryData, cb?: Function) => {
  return db.updateTask(formData).then(res => {
    if (cb) cb();
    return res;
  });
};

const updateTaskListAPI = (taskList: TaskDBData[]) => {
  return db.updateTaskList(taskList);
};

const deleteTaskAPI = (task: TaskDBData, cb?: Function) => {
  return db.deleteTask(task).then(res => {
    if (cb) cb();
    return res;
  });
};

export const setCurrentTask = createAction(
  ActionTypes.SET_CURRENT_TASK_INDEX,
  ({ currentTask }: { currentTask?: TaskDBData }) => ({
    currentTask
  })
);

export const createTask = createAction(ActionTypes.CREATE_TASK, createTaskAPI);

export const getTaskList = createAction(
  ActionTypes.GET_TASK_LIST_LOCAL,
  getTaskListAPI
);

export const updateTask = createAction(ActionTypes.UPDATE_TASK, updateTaskAPI);

export const deleteTask = createAction(ActionTypes.DELETE_TASK, deleteTaskAPI);

export const setGroupedTaskList = createAction(
  ActionTypes.SET_GROUPED_TASK_LIST,
  ({
    groupedTaskList
  }: {
    groupedTaskList: StoreState["task"]["groupedTaskList"];
  }) => ({ groupedTaskList })
);

export const updateTaskList = createAction(
  ActionTypes.UPDATE_TASK_LIST,
  updateTaskListAPI
);
