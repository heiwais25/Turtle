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
    // [ActionTypes.CREATE_PROJECT]: (state, action) => {
    //   const { projectName } = action.payload;
    //   return produce(state, draft => {
    //     draft.projectList.push({
    //       name: projectName,
    //       isDefault: false
    //     });
    //   });
    // },

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
      type: ActionTypes.CHANGE_PROJECT_ORDER,
      onSuccess: (state, action: Action<number[]>) => {
        const [smallIdx, largeIdx] = action.payload;
        console.log(smallIdx, largeIdx);
        // console.log(updatedProjectList);
        return produce(state, draft => {
          console.log(draft.projectList);
          // draft.projectList.forEach(project => {
          //   console.log(project.order);
          //   if (project.order >= smallIdx && project.order < largeIdx) {
          //     // project.order = currentOrder + 1;
          //   } else if (project.order === largeIdx) {
          //     console.log("here");
          //     project.order = smallIdx;
          //   }
          // });

          // Resort project list
          // draft.projectList.sort((a, b) => a.order - b.order);
        });
      }
    }),
    ...pender({
      type: ActionTypes.DELETE_PROJECT,
      onSuccess: (state, action: Action<string>) => {
        const id = action.payload;
        console.log(id);
        return produce(state, draft => {
          const index = draft.projectList.findIndex(item => item._id === id);
          if (index !== -1) {
            draft.projectList.splice(index, 1);
          }
        });
      }
    })
  },
  initialState
);
