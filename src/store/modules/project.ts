import { handleActions, Action } from "redux-actions";

type ProjectListItemData = {
    name:string;
}

export type ProjectState = {
  projectList: ProjectListItemData[];
};

const defaultBoardData: ProjectState = {
    projectList: [],
};

const initialState: ProjectState = defaultBoardData;

export default handleActions<ProjectState>(
  {
  },
  initialState
);
