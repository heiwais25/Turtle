import React from "react";
import Navigation from "./Navigation";
import { connect } from "react-redux";
import { StoreState } from "store/modules";
import * as projectActions from "actions/project";
import { bindActionCreators } from "redux";
import { ProjectListItemData } from "store/modules/project";
import { ProjectDBUpdateQueryData } from "interfaces/project";
import { ProjectDBData } from "../../interfaces/project";

type State = {};

type ReduxStateProps = {
  projectList: ProjectListItemData[];
  currentProject?: ProjectListItemData;
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
  handleSetProjectList = (projectList: ProjectListItemData[]) => {
    const { ProjectActions } = this.props;
    ProjectActions.setProjectList({ projectList });
  };

  handleProjectOrderChange = (
    projectA: ProjectDBData,
    projectB: ProjectDBData
  ) => {
    const { ProjectActions } = this.props;
    ProjectActions.changeProjectOrder(projectA, projectB);
  };

  handleProjectDelete = (editingProject: ProjectListItemData) => {
    const { ProjectActions } = this.props;
    ProjectActions.deleteProject(editingProject);
  };

  handleCurrentProjectChange = (project: ProjectListItemData) => {
    const { ProjectActions } = this.props;
    ProjectActions.setCurrentProject({ currentProject: project });
  };

  handleCurrentProjectClear = () => {
    const { ProjectActions } = this.props;
    ProjectActions.setCurrentProject({});
  };

  render() {
    const {
      handleSetProjectList,
      handleProjectUpdate,
      handleProjectDelete,
      handleCurrentProjectChange,
      handleCurrentProjectClear,
      handleProjectOrderChange
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
          handleProjectOrderChange={handleProjectOrderChange}
          handleCurrentProjectClear={handleCurrentProjectClear}
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
