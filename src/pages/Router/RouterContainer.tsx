import React from "react";
import Router from "./Router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StoreState } from "store/modules";
import * as projectActions from "actions/project";
import * as taskActions from "actions/task";

type State = {};

type ReduxStateProps = {};

type ReduxDispatchProps = {
  ProjectActions: typeof projectActions;
  TaskActions: typeof taskActions;
};

type Props = {} & ReduxStateProps & ReduxDispatchProps;

class RouterContainer extends React.Component<Props, State> {
  componentDidMount() {
    // Handle initial loading Redux
    this.initStore();
  }

  initStore() {
    const { ProjectActions, TaskActions } = this.props;
    ProjectActions.getProjectList();
    TaskActions.getTaskList(undefined);
  }

  render() {
    return <Router />;
  }
}

export default connect(
  (state: StoreState) => ({
    projectList: state.project.projectList,
    currentProject: state.project.currentProject
  }),
  dispatch => ({
    ProjectActions: bindActionCreators(projectActions, dispatch),
    TaskActions: bindActionCreators(taskActions, dispatch)
  })
)(RouterContainer);
