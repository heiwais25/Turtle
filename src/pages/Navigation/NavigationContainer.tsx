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
  handleSetProjectList = (projectList: ProjectDBData[]) => {
    const { ProjectActions, projectList: previousProjectlist } = this.props;
    // Changed project list
    const changedProjectList = projectList.filter(
      (project, idx) => project.order !== previousProjectlist[idx].order
    );
    // console.log(changedProjectList);

    ProjectActions.setProjectList({ projectList });
    ProjectActions.updateProjectList(changedProjectList);
  };

  handleProjectDelete = (editingProject: ProjectListItemData) => {
    const { ProjectActions } = this.props;
    ProjectActions.deleteProject(editingProject, () => {
      this.handleCurrentProjectClear();
    });
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
      handleCurrentProjectClear
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
