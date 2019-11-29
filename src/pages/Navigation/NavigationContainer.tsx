import React from "react";
import Navigation from "./Navigation";
import { connect } from "react-redux";
import { StoreState } from "store/modules";
import * as projectActions from "actions/project";
import * as taskActions from "actions/task";
import { bindActionCreators } from "redux";
import { ProjectListItemData } from "store/modules/project";
import { ProjectDBUpdateQueryData } from "electronMain/interfaces/project";
import { ProjectDBData } from "../../electronMain/interfaces/project";

type State = {};

type ReduxStateProps = {
  projectList: ProjectListItemData[];
  // groupedTaskList: StoreState["task"]["groupedTaskList"];
  currentProject?: ProjectListItemData;
};

type ReduxDispatchProps = {
  ProjectActions: typeof projectActions;
  TaskActions: typeof taskActions;
};

type Props = {} & ReduxStateProps & ReduxDispatchProps;

class NavigationContainer extends React.Component<Props, State> {
  handleProjectUpdate = (
    projectName: string,
    editingProject?: ProjectListItemData
  ) => {
    const { ProjectActions, projectList } = this.props;
    if (editingProject) {
      const { createdAt, updatedAt, ...extra } = editingProject;
      const formData: ProjectDBUpdateQueryData = {
        ...extra,
        name: projectName
      };
      ProjectActions.updateProject(formData);
    } else {
      const nextIdx = projectList.length;
      ProjectActions.createProject(projectName, nextIdx);
    }
  };

  // For the shuffling
  handleSetProjectList = (projectList: ProjectDBData[]) => {
    const { ProjectActions, projectList: previousProjectlist } = this.props;
    // Changed project list
    const changedProjectList = projectList.filter(
      (project, idx) => project.order !== previousProjectlist[idx].order
    );

    ProjectActions.setProjectList({ projectList });
    ProjectActions.updateProjectList(changedProjectList);
  };

  handleProjectDelete = (editingProject: ProjectListItemData) => {
    const { ProjectActions } = this.props;
    const cb = () => {
      this.handleCurrentProjectChange();
    };

    ProjectActions.deleteProject(editingProject, cb);
  };

  handleCurrentProjectChange = (project?: ProjectListItemData) => {
    const { ProjectActions, TaskActions } = this.props;
    ProjectActions.setCurrentProject({ currentProject: project });
    TaskActions.getTaskList(project ? project._id : undefined);
  };

  render() {
    const {
      handleSetProjectList,
      handleProjectUpdate,
      handleProjectDelete,
      handleCurrentProjectChange
    } = this;
    const { projectList, currentProject } = this.props;
    return (
      <React.Fragment>
        <Navigation
          projectList={projectList}
          currentProject={currentProject}
          handleSetProjectList={handleSetProjectList}
          handleProjectUpdate={handleProjectUpdate}
          handleProjectDelete={handleProjectDelete}
          handleCurrentProjectChange={handleCurrentProjectChange}
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
)(NavigationContainer);
