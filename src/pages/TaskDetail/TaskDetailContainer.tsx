import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import TaskDetail from "./TaskDetail";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StoreState } from "store/modules";
import * as taskActions from "actions/task";
import { ITaskRecord } from "interfaces/task";
import { ITaskListGroupRecord } from "../../interfaces/task";
import { List } from "immutable";

type State = {};

type ReduxStateProps = {
  currentTask?: ITaskRecord;
  fullTaskList: List<ITaskRecord>;
  loading: { [key: string]: boolean | undefined };
};

type ReduxDispatchProps = {
  TaskActions: typeof taskActions;
};

type Props = ReduxStateProps &
  ReduxDispatchProps &
  RouteComponentProps<{ id: string }>;

class TaskDetailContainer extends Component<Props, State> {
  componentDidUpdate() {
    const { match, currentTask, fullTaskList, TaskActions } = this.props;
    if (!currentTask && fullTaskList.size > 0) {
      const taskId = match.params.id;
      TaskActions.setCurrentTaskById({ id: taskId });
    }
  }

  handleGoToTaskList = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { currentTask } = this.props;
    if (!currentTask) {
      return (
        <React.Fragment>
          <div>Error in loading task detail</div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <TaskDetail task={currentTask} />
      </React.Fragment>
    );
  }
}

export default connect(
  (state: StoreState) => ({
    currentTask: state.task.currentTask,
    fullTaskList: state.task.fullTaskList,
    currentProject: state.project.currentProject,
    loading: state.pender.pending
  }),
  dispatch => ({
    TaskActions: bindActionCreators(taskActions, dispatch)
  })
)(TaskDetailContainer);
