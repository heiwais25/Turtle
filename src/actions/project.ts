import { createAction } from "redux-actions";
import * as ActionTypes from "constants/projectActionTypes";
import { ProjectListItemData } from "store/modules/project";
import { ProjectDBData, ProjectDBUpdateQueryData } from "interfaces/project";
import db from "store/db";

const createProjectAPI = (
  name: ProjectDBData["name"],
  order: ProjectDBData["order"]
) => {
  return db.createProject({ name, order });
};

const updateProjectAPI = (formData: ProjectDBUpdateQueryData) => {
  return db.updateProject(formData);
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
  ActionTypes.SET_CURRENT_PROJECT_INDEX,
  ({ currentProject }: { currentProject?: ProjectListItemData }) => ({
    currentProject
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
  ActionTypes.SET_PROJECT_LIST,
  ({ projectList }: { projectList: ProjectListItemData[] }) => ({ projectList })
);

export const updateProjectList = createAction(
  ActionTypes.UPDATE_PROJECT_LIST,
  updateProjectListAPI
);
