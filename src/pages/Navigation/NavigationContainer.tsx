import React from "react";
import Navigation from "./Navigation";
import { connect } from "react-redux";
import { StoreState } from "store/modules";
import * as projectActions from "actions/project";
import * as taskActions from "actions/task";
import { bindActionCreators } from "redux";
import {
  IProjectRecord,
  IProjectCreateForm,
  IProjectCreatePartialForm
} from "interfaces/project";
import { List } from "immutable";
import { DropResult } from "react-beautiful-dnd";
import * as NavigationService from "services/Navigation/NavigationService";
import { withRouter, RouteComponentProps } from "react-router-dom";

type State = {};

type ReduxStateProps = {
  projectList: List<IProjectRecord>;
  currentProject?: IProjectRecord;
};

type ReduxDispatchProps = {
  ProjectActions: typeof projectActions;
  TaskActions: typeof taskActions;
};

type Props = {} & ReduxStateProps & ReduxDispatchProps & RouteComponentProps;

class NavigationContainer extends React.Component<Props, State> {
  handleProjectCreate = (
    partialFormData: IProjectCreatePartialForm,
    cb?: Function
  ) => {
    const { ProjectActions, projectList } = this.props;
    const formData: IProjectCreateForm = {
      ...partialFormData,
      isDeleted: false,
      order: projectList.size
    };
    ProjectActions.createProject(formData, cb);
  };

  handleProjectUpdate = (newProject: IProjectRecord, cb?: Function) => {
    const { ProjectActions } = this.props;
    ProjectActions.updateProject(newProject.toJS(), cb);
  };

  // For the shuffling
  handleSetProjectList = (projectList: List<IProjectRecord>) => {
    const { ProjectActions, projectList: previousProjectlist } = this.props;

    // Changed project list
    const changedProjectList = NavigationService.getChangedProjectList(
      projectList,
      previousProjectlist
    );

    ProjectActions.setProjectList({ projectList });
    ProjectActions.updateProjectList(changedProjectList.toJS());
  };

  handleProjectDelete = (editingProject: IProjectRecord) => {
    const { ProjectActions } = this.props;
    const cb = () => {
      this.handleCurrentProjectChange();
    };

    ProjectActions.deleteProject(editingProject.toJS(), cb);
  };

  handleCurrentProjectChange = (project?: IProjectRecord) => {
    const { ProjectActions, TaskActions, history, location } = this.props;
    if (location.pathname !== "/") {
      history.push("/");
    }
    ProjectActions.setCurrentProject({ currentProject: project });
    TaskActions.getTaskListOfProject({
      projectId: project ? project._id : undefined
    });
  };

  handleProjectDragEnd = (result: DropResult) => {
    const { projectList } = this.props;

    if (!result.destination) {
      return;
    }

    const items = NavigationService.reorderProject(
      projectList,
      result.source.index,
      result.destination.index
    );
    this.handleSetProjectList(items);
  };

  render() {
    const {
      handleProjectCreate,
      handleProjectUpdate,
      handleProjectDelete,
      handleCurrentProjectChange,
      handleProjectDragEnd
    } = this;
    const { projectList, currentProject } = this.props;
    return (
      <React.Fragment>
        <Navigation
          projectList={projectList}
          currentProject={currentProject}
          handleProjectCreate={handleProjectCreate}
          handleProjectUpdate={handleProjectUpdate}
          handleProjectDelete={handleProjectDelete}
          handleCurrentProjectChange={handleCurrentProjectChange}
          handleProjectDragEnd={handleProjectDragEnd}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  (state: StoreState) => ({
    projectList: state.project.projectList,
    currentProject: state.project.currentProject
    // groupedTaskList: state.task.groupedTaskList
  }),
  dispatch => ({
    ProjectActions: bindActionCreators(projectActions, dispatch),
    TaskActions: bindActionCreators(taskActions, dispatch)
  })
)(withRouter(NavigationContainer));
