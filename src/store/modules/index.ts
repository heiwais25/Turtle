import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import project, { ProjectState } from "./project";
import task, { TaskState } from "./task";

const rootReducer = combineReducers({
    task,
  project,
  form: formReducer
});

export interface StoreState {
  task: TaskState;
  project:ProjectState;
}

export default rootReducer;
