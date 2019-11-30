import {
  ProjectDBData,
  ProjectDBCreateQueryData,
  ProjectDBUpdateQueryData
} from "electronMain/interfaces/project";
import { Record, List } from "immutable";

export interface IProject extends ProjectDBData {}

export type IProjectCreateForm = ProjectDBCreateQueryData;

export interface IProjectCreatePartialForm {
  name: IProjectCreateForm["name"];
}

export type IProjectUpdateForm = ProjectDBUpdateQueryData;

export interface IProjectUpdatePartialForm {
  _id: IProject["_id"];
  name: IProject["name"];
}

export type IProjectRecord = Record<IProject> & Readonly<IProject>;

export type IProjectState = {
  projectList: List<IProjectRecord>;
  currentProject?: IProjectRecord;
};

export type IProjectStateRecord = Record<IProjectState> &
  Readonly<IProjectState>;
