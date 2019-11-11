import { handleActions, Action } from "redux-actions";
import * as ActionTypes from "constants/projectActionTypes";
import produce from "immer";
import { pender } from "redux-pender/lib/utils";
import { ProjectDBData } from "interfaces/project";

export type ProjectListItemData = ProjectDBData;

export type ProjectState = {
  projectList: ProjectListItemData[];
  currentProject?: ProjectListItemData;
};

export type ProjectDispatchData = {
  projectName: string;
  editingProject?: ProjectListItemData;
};

type State = ProjectState & ProjectDispatchData;

const defaultBoardData: State = {
  projectList: [],
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
    ...pender({
      type: ActionTypes.CREATE_PROJECT,
      onSuccess: (state, action: Action<ProjectDBData>) => {
        const project = action.payload;
        return produce(state, draft => {
          draft.projectList.push(project);
        });
      }
    }),
    ...pender({
      type: ActionTypes.GET_PROJECT_LIST_LOCAL,
      onSuccess: (state, action: Action<ProjectDBData[]>) => {
        const projectList = action.payload;
        return produce(state, draft => {
          draft.projectList = projectList;
        });
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_PROJECT,
      onSuccess: (state, action: Action<ProjectDBData>) => {
        const updatedProject = action.payload;
        return produce(state, draft => {
          draft.projectList.forEach((project, idx, arr) => {
            if (project._id === updatedProject._id) {
              arr[idx] = updatedProject;
            }
            if (
              draft.currentProject &&
              draft.currentProject._id === updatedProject._id
            ) {
              draft.currentProject = updatedProject;
            }
          });
        });
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_PROJECT_LIST,
      onSuccess: (state, action: Action<ProjectDBData[]>) => {
        const updatedProjectList = action.payload;
        return produce(state, draft => {
          updatedProjectList.forEach(updatedProject => {
            draft.projectList.forEach((project, idx, arr) => {
              if (updatedProject._id === project._id) {
                arr[idx] = updatedProject;
              }
            });
          });
          // Resort project list
          draft.projectList.sort((a, b) => a.order - b.order);
        });
      }
    }),
    ...pender({
      type: ActionTypes.DELETE_PROJECT,
      onSuccess: (state, action: Action<ProjectDBData>) => {
        const deletedProject = action.payload;
        const projectList = state.projectList.slice();
        const deletedIndex = state.projectList.findIndex(
          item => item._id === deletedProject._id
        );

        if (deletedIndex >= 0) {
          projectList.splice(deletedIndex, 1);
          projectList.forEach((item, idx) => (item.order = idx));
        }

        return produce(state, draft => {
          draft.projectList = projectList;
        });
      }
    })
  },
  initialState
);
