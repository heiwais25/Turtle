import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import project, { ProjectState } from "./project";
import task, { TaskState } from "./task";
import { penderReducer, PenderState } from "redux-pender";

const rootReducer = combineReducers({
  task,
  project,
  pender: penderReducer,
  form: formReducer
});

export interface StoreState {
  task: TaskState;
  project: ProjectState;
  pender: PenderState;
}

export default rootReducer;
