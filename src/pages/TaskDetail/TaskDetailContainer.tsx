import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import TaskDetail from "./TaskDetail";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StoreState } from "store/modules";
import * as taskActions from "actions/task";
import * as projectActions from "actions/project";
import { ITaskRecord } from "interfaces/task";
import { List } from "immutable";
import { ISubTaskFormProps } from "../../systems/TaskDetail/index";
import { SubTaskDBCreateFormData } from "../../electronMain/interfaces/task";
import { SubTaskRecord } from "records/task";
import { ISubTaskRecord } from "../../interfaces/task";

type State = {};

type ReduxStateProps = {
  currentTask?: ITaskRecord;
  fullTaskList: List<ITaskRecord>;
  loading: { [key: string]: boolean | undefined };
};

type ReduxDispatchProps = {
  TaskActions: typeof taskActions;
  ProjectActions: typeof projectActions;
};

type Props = ReduxStateProps &
  ReduxDispatchProps &
  RouteComponentProps<{ taskId: string; projectId?: string }>;

class TaskDetailContainer extends Component<Props, State> {
  componentDidUpdate() {
    const {
      match,
      currentTask,
      fullTaskList,
      TaskActions,
      ProjectActions
    } = this.props;
    const { taskId, projectId } = match.params;
    if (!currentTask && fullTaskList.size > 0) {
      // Set task from the url

      TaskActions.setCurrentTaskById({ id: taskId });

      // Set project from the url
      if (projectId) {
        ProjectActions.setCurrentProjectById({ id: projectId });
      }
    }
  }

  handleGoToTaskList = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleUpdateDescription = (description: string, cb?: Function) => {
    const { currentTask, TaskActions } = this.props;
    if (currentTask) {
      TaskActions.updateTask(
        currentTask.set("description", description).toJS(),
        cb
      );
    }
  };

  handleUpdateName = (name: string, cb?: Function) => {
    const { currentTask, TaskActions } = this.props;
    if (!currentTask) {
      if (cb) cb();
      return;
    }

    TaskActions.updateTask(currentTask.set("name", name).toJS(), cb);
  };

  handleUpadteDueDate = (dueDate?: Date, cb?: Function) => {
    const { currentTask, TaskActions } = this.props;
    if (currentTask) {
      TaskActions.updateTask(currentTask.set("dueAt", dueDate).toJS(), cb);
    }
  };

  handleSubTaskCreate = (partialFormData: ISubTaskFormProps, cb?: Function) => {
    const { TaskActions, currentTask } = this.props;

    if (!currentTask) {
      return;
    }

    const formData: SubTaskDBCreateFormData = {
      ...partialFormData,
      order: currentTask.subTaskList.size
    };

    TaskActions.createSubTask(currentTask._id, formData, cb);
  };

  handleSubTaskUpdate = (newSubTask: ISubTaskRecord, cb?: Function) => {
    const { currentTask, TaskActions } = this.props;
    if (!currentTask) {
      if (cb) {
        cb();
      }
      return;
    }

    const subTaskIndex = currentTask.subTaskList.findIndex(
      subTask => subTask._id === newSubTask._id
    );

    if (subTaskIndex === -1) {
      if (cb) {
        cb();
      }
      return;
    }

    // Update sub task in the current task
    TaskActions.updateTask(
      currentTask.setIn(["subTaskList", subTaskIndex], newSubTask).toJS(),
      cb
    );
  };

  handleSubTaskDelete = (deletedSubTask: ISubTaskRecord, cb?: Function) => {
    const { currentTask, TaskActions } = this.props;
    if (!currentTask) {
      if (cb) cb();
      return;
    }

    // Delete
    TaskActions.updateTask(
      currentTask
        .update("subTaskList", subTaskList =>
          subTaskList.filter(subTask => subTask._id !== deletedSubTask._id)
        )
        .toJS(),
      cb
    );
  };

  handleSubTaskListUpdate = (
    newSubTaskList: List<ISubTaskRecord>,
    cb?: Function
  ) => {
    const { currentTask, TaskActions } = this.props;

    if (!currentTask) {
      if (cb) cb();
      return;
    }

    const newTask = currentTask.set("subTaskList", newSubTaskList);

    TaskActions.setCurrentTask({ currentTask: newTask });

    TaskActions.updateTask(newTask.toJS(), cb);
  };

  render() {
    const {
      handleUpdateDescription,
      handleUpadteDueDate,
      handleSubTaskCreate,
      handleSubTaskUpdate,
      handleSubTaskDelete,
      handleSubTaskListUpdate,
      handleUpdateName
    } = this;
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
        <TaskDetail
          task={currentTask}
          handleUpdateName={handleUpdateName}
          handleUpdateDescription={handleUpdateDescription}
          handleUpadteDueDate={handleUpadteDueDate}
          handleSubTaskCreate={handleSubTaskCreate}
          handleSubTaskUpdate={handleSubTaskUpdate}
          handleSubTaskDelete={handleSubTaskDelete}
          handleSubTaskListUpdate={handleSubTaskListUpdate}
        />
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
    TaskActions: bindActionCreators(taskActions, dispatch),
    ProjectActions: bindActionCreators(projectActions, dispatch)
  })
)(TaskDetailContainer);
