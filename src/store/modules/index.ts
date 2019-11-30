import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import project from "./project";
import task from "./task";
import { ITaskStateRecord } from "interfaces/task";
import { IProjectStateRecord } from "interfaces/project";
import { penderReducer, PenderState } from "redux-pender";

const rootReducer = combineReducers({
  task,
  project,
  pender: penderReducer,
  form: formReducer
});

export interface StoreState {
  task: ITaskStateRecord;
  project: IProjectStateRecord;
  pender: PenderState;
}

export default rootReducer;
