import { handleActions, Action } from "redux-actions";
import { pender } from "redux-pender/lib/utils";
import { List } from "immutable";
import { ProjectDBData } from "electronMain/interfaces/project";
import { ProjectRecord, ProjectStateRecord } from "records/project";
import { IProjectStateRecord } from "interfaces/project";
import * as ActionTypes from "constants/projectActionTypes";

export default handleActions<IProjectStateRecord>(
  {
    [ActionTypes.SET_CURRENT_PROJECT]: (state, action) => {
      const { currentProject } = action.payload;
      return state.set("currentProject", currentProject);
    },
    [ActionTypes.SET_ROJECT_LIST]: (state, action) => {
      const { projectList } = action.payload;
      return state.set("projectList", projectList);
    },
    ...pender({
      type: ActionTypes.CREATE_PROJECT,
      onSuccess: (state, action: Action<ProjectDBData>) => {
        const project = action.payload;
        return state.update("projectList", projectList =>
          projectList.push(new ProjectRecord(project))
        );
      }
    }),
    ...pender({
      type: ActionTypes.GET_PROJECT_LIST_LOCAL,
      onSuccess: (state, action: Action<ProjectDBData[]>) => {
        const projectList = action.payload;
        return state.set(
          "projectList",
          List(projectList.map(project => new ProjectRecord(project)))
        );
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_PROJECT,
      onSuccess: (state, action: Action<ProjectDBData>) => {
        const updatedProject = action.payload;
        let newState = state;
        const index = newState.projectList.findIndex(
          project => project._id === updatedProject._id
        );
        if (index <= 0) {
          return newState;
        }
        const projectRecord = new ProjectRecord(updatedProject);

        newState = newState.setIn(["projectList", index], projectRecord);

        if (
          newState.currentProject &&
          newState.currentProject._id === updatedProject._id
        ) {
          newState = newState.set("currentProject", projectRecord);
        }
        return newState;
      }
    }),
    ...pender({
      type: ActionTypes.UPDATE_PROJECT_LIST,
      onSuccess: (state, action: Action<ProjectDBData[]>) => {
        const updatedProjectList = action.payload;
        return state.update("projectList", projectList => {
          return projectList.withMutations(mutatedList => {
            updatedProjectList.forEach(updatedProject => {
              const index = mutatedList.findIndex(
                item => item._id === updatedProject._id
              );
              if (index >= 0) {
                mutatedList.set(index, new ProjectRecord(updatedProject));
              }
            });
          });
        });
      }
    }),
    ...pender({
      type: ActionTypes.DELETE_PROJECT,
      onSuccess: (state, action: Action<ProjectDBData>) => {
        const deletedProject = action.payload;
        const deletedIndex = state.projectList.findIndex(
          item => item._id === deletedProject._id
        );

        if (deletedIndex < 0) {
          return state;
        }

        return state.update("projectList", projectList =>
          projectList.splice(deletedIndex, 1)
        );
      }
    })
  },
  new ProjectStateRecord()
);
