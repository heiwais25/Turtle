import React from "react";
import Navigation from "./Navigation";
import { connect } from "react-redux";
import { StoreState } from "store/modules";
import * as projectActions from "actions/project";
import { bindActionCreators } from "redux";
import { ProjectListItemData } from "store/modules/project";

type State = {};

type ReduxStateProps = {
  projectList: ProjectListItemData[];
  currentProject: ProjectListItemData;
};

type ReduxDispatchProps = {
  ProjectActions: typeof projectActions;
};

type Props = {} & ReduxStateProps & ReduxDispatchProps;

class NavigationContainer extends React.Component<Props, State> {
  handleProjectUpdate = (
    projectName: string,
    editingProject?: ProjectListItemData
  ) => {
    const { ProjectActions } = this.props;
    if (editingProject) {
      ProjectActions.updateProject({ editingProject, projectName });
    } else {
      ProjectActions.createProject({ projectName });
    }
  };

  // For the shuffling
  handleSetProjectList = (projectList: ProjectListItemData[]) => {
    const { ProjectActions } = this.props;
    ProjectActions.setProjectList({ projectList });
  };

  handleProjectDelete = (editingProject: ProjectListItemData) => {
    const { ProjectActions } = this.props;
    ProjectActions.deleteProject({ editingProject });
  };

  handleCurrentProjectChange = (project: ProjectListItemData) => {
    const { ProjectActions } = this.props;
    ProjectActions.setCurrentProject({ currentProject: project });
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
          handleSetProjectList={handleSetProjectList}
          handleProjectUpdate={handleProjectUpdate}
          handleProjectDelete={handleProjectDelete}
          handleCurrentProjectChange={handleCurrentProjectChange}
          projectList={projectList}
          currentProject={currentProject}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  (state: StoreState) => ({
    projectList: state.project.projectList,
    currentProject: state.project.currentProject
  }),
  dispatch => ({
    ProjectActions: bindActionCreators(projectActions, dispatch)
  })
)(NavigationContainer);
