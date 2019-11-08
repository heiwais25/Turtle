import React from "react";
import Router from "./Router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StoreState } from "store/modules";
import * as projectActions from "actions/project";
import db from "store/db";

type State = {};

type ReduxStateProps = {};

type ReduxDispatchProps = {
  ProjectActions: typeof projectActions;
};

type Props = {} & ReduxStateProps & ReduxDispatchProps;

class RouterContainer extends React.Component<Props, State> {
  componentDidMount() {
    // Handle initial loading Redux
    this.initStore();
  }

  initStore() {
    const { ProjectActions } = this.props;
    db.getProjectAllList().then(projectList => {
      ProjectActions.setProjectList({ projectList });
    });
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
    ProjectActions: bindActionCreators(projectActions, dispatch)
  })
)(RouterContainer);
