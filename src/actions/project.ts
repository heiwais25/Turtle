import { createAction } from "redux-actions";
import * as ActionTypes from "constants/projectActionTypes";
import {
  ProjectDispatchData,
  ProjectListItemData
} from "store/modules/project";

export const setCurrentProject = createAction(
  ActionTypes.SET_CURRENT_PROJECT_INDEX,
  ({ currentProject }: { currentProject: ProjectListItemData }) => ({
    currentProject
  })
);

export const createProject = createAction(
  ActionTypes.CREATE_PROJECT,
  ({ projectName }: { projectName: ProjectDispatchData["projectName"] }) => ({
    projectName
  })
);

export const updateProject = createAction(
  ActionTypes.UPDATE_PROJECT,
  ({
    editingProject,
    projectName
  }: {
    editingProject: ProjectListItemData;
    projectName: string;
  }) => ({
    editingProject,
    projectName
  })
);

export const deleteProject = createAction(
  ActionTypes.DELETE_PROJECT,
  ({ editingProject }: { editingProject: ProjectListItemData }) => ({
    editingProject
  })
);

export const setProjectList = createAction(
  ActionTypes.SET_PROJECT_LIST,
  ({ projectList }: { projectList: ProjectListItemData[] }) => ({ projectList })
);
