import { createAction } from "redux-actions";
import * as ActionTypes from "constants/projectActionTypes";
import {
  ProjectDBData,
  ProjectDBUpdateQueryData,
  ProjectDBCreateQueryData
} from "electronMain/interfaces/project";
import db from "store/db";
import { IProjectRecord } from "interfaces/project";
import { List } from "immutable";

const createProjectAPI = (
  formData: ProjectDBCreateQueryData,
  cb?: Function
) => {
  return db.createProject(formData).then(res => {
    if (cb) cb();
    return res;
  });
};

const updateProjectAPI = (
  formData: ProjectDBUpdateQueryData,
  cb?: Function
) => {
  return db.updateProject(formData).then(res => {
    if (cb) cb();
    return res;
  });
};

const getProjectListAPI = () => {
  return db.getProjectAllList();
};

const updateProjectListAPI = (projectList: ProjectDBData[]) => {
  return db.updateProjectList(projectList);
};

const deleteProjectAPI = (project: ProjectDBData, cb?: Function) => {
  return db.deleteProject(project).then(res => {
    if (cb) cb();
    return res;
  });
};

export const setCurrentProject = createAction(
  ActionTypes.SET_CURRENT_PROJECT,
  ({ currentProject }: { currentProject?: IProjectRecord }) => ({
    currentProject
  })
);

export const setCurrentProjectById = createAction(
  ActionTypes.SET_CURRENT_PROJECT_BY_ID,
  ({ id }: { id: string }) => ({
    id
  })
);

export const createProject = createAction(
  ActionTypes.CREATE_PROJECT,
  createProjectAPI
);

export const getProjectList = createAction(
  ActionTypes.GET_PROJECT_LIST_LOCAL,
  getProjectListAPI
);

export const updateProject = createAction(
  ActionTypes.UPDATE_PROJECT,
  updateProjectAPI
);

export const deleteProject = createAction(
  ActionTypes.DELETE_PROJECT,
  deleteProjectAPI
);

export const setProjectList = createAction(
  ActionTypes.SET_ROJECT_LIST,
  ({ projectList }: { projectList: List<IProjectRecord> }) => ({ projectList })
);

export const updateProjectList = createAction(
  ActionTypes.UPDATE_PROJECT_LIST,
  updateProjectListAPI
);
