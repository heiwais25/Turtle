import { handleActions, Action } from "redux-actions";
import * as ActionTypes from "constants/projectActionTypes";
import produce from "immer";

export type ProjectListItemData = {
  name: string;
  isDefault: boolean;
};

export type ProjectState = {
  projectList: ProjectListItemData[];
  currentProject: ProjectListItemData;
};

export type ProjectDispatchData = {
  projectName: string;
  editingProject?: ProjectListItemData;
};

type State = ProjectState & ProjectDispatchData;

const defaultCurrentProject: ProjectListItemData = {
  name: "All Project",
  isDefault: true
};

const defaultBoardData: State = {
  projectList: [defaultCurrentProject],
  currentProject: { name: "All Project", isDefault: true },
  projectName: ""
};

const initialState: State = defaultBoardData;

export default handleActions<State>(
  {
    [ActionTypes.SET_CURRENT_PROJECT_INDEX]: (state, action) => {
      const { currentProject } = action.payload;
      return produce(state, draft => {
        draft.currentProject = currentProject;
      });
    },
    [ActionTypes.SET_PROJECT_LIST]: (state, action) => {
      const { projectList } = action.payload;
      return produce(state, draft => {
        draft.projectList = projectList;
      });
    },
    [ActionTypes.CREATE_PROJECT]: (state, action) => {
      const { projectName } = action.payload;
      return produce(state, draft => {
        draft.projectList.push({
          name: projectName,
          isDefault: false
        });
      });
    },
    [ActionTypes.UPDATE_PROJECT]: (state, action) => {
      const { editingProject, projectName } = action.payload;
      return produce(state, draft => {
        if (editingProject) {
          draft.projectList.forEach(project => {
            if (project.name === editingProject.name) {
              project.name = projectName;
            }
          });
          if (draft.currentProject.name === editingProject.name) {
            draft.currentProject.name = projectName;
          }
        }
      });
    },
    [ActionTypes.DELETE_PROJECT]: (state, action) => {
      const { editingProject } = action.payload;
      return produce(state, draft => {
        if (editingProject) {
          const index = draft.projectList.findIndex(
            item => item.name === editingProject.name
          );
          if (index !== -1) {
            draft.projectList.splice(index, 1);
          }
        }
      });
    }
  },
  initialState
);
