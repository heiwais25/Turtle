import { createAction } from "redux-actions";
import * as ActionTypes from "constants/taskActionTypes";
import {
  TaskDBCreateFormData,
  ITaskDB,
  TaskDBUpdateQueryData
} from "electronMain/interfaces/task";
import db from "store/db";
import { ITaskListGroup, ITaskRecord } from "../interfaces/task";
import { SubTaskDBCreateFormData } from "../electronMain/interfaces/task";

const createTaskAPI = (formData: TaskDBCreateFormData, cb?: Function) => {
  return db.createTask(formData).then(res => {
    if (cb) cb();
    return res;
  });
};

const getTaskListAPI = (projectId?: ITaskDB["projectId"]) => {
  return db.getTaskList(projectId);
};

const updateTaskAPI = (formData: TaskDBUpdateQueryData, cb?: Function) => {
  return db.updateTask(formData).then(res => {
    if (cb) cb();
    return res;
  });
};

const updateTaskListAPI = (taskList: ITaskDB[]) => {
  return db.updateTaskList(taskList);
};

const deleteTaskAPI = (task: ITaskDB, cb?: Function) => {
  return db.deleteTask(task).then(res => {
    if (cb) cb();
    return res;
  });
};

const createSubTaskAPI = (
  taskId: string,
  formData: SubTaskDBCreateFormData,
  cb?: Function
) => {
  return db.createSubTask(taskId, formData).then(res => {
    if (cb) cb();
    return res;
  });
};

export const setCurrentTask = createAction(
  ActionTypes.SET_CURRENT_TASK,
  ({ currentTask }: { currentTask?: ITaskRecord }) => ({
    currentTask
  })
);

export const setCurrentTaskById = createAction(
  ActionTypes.SET_CURRENT_TASK_BY_ID,
  ({ id }: { id: string }) => ({ id })
);

export const createTask = createAction(ActionTypes.CREATE_TASK, createTaskAPI);

export const getTaskListOfProject = createAction(
  ActionTypes.GET_TASK_LIST_OF_PROJECT,
  ({ projectId }: { projectId?: string }) => ({
    projectId
  })
);

export const getTaskList = createAction(
  ActionTypes.GET_TASK_LIST_LOCAL,
  getTaskListAPI
);

export const updateTask = createAction(ActionTypes.UPDATE_TASK, updateTaskAPI);

export const deleteTask = createAction(ActionTypes.DELETE_TASK, deleteTaskAPI);

export const updateTaskListGroup = createAction(
  ActionTypes.UPDATE_TASK_LIST_GROUP,
  ({ taskListGroup }: { taskListGroup: ITaskListGroup }) => ({
    taskListGroup
  })
);

export const updateTaskList = createAction(
  ActionTypes.UPDATE_TASK_LIST,
  updateTaskListAPI
);

export const createSubTask = createAction(
  ActionTypes.CREATE_SUB_TASK,
  createSubTaskAPI
);
