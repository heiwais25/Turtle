import { Record, List } from "immutable";
import moment from "moment";
import { IProject, IProjectState } from "interfaces/project";

export class ProjectRecord extends Record<IProject>({
  _id: "",
  name: "",
  createdAt: moment().toDate(),
  isDeleted: false,
  updatedAt: moment().toDate(),
  order: 0
}) {}

export const ProjectStateRecord = Record<IProjectState>({
  projectList: List<ProjectRecord>([]),
  currentProject: undefined
});
