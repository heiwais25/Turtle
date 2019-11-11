import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StoreState } from "store/modules";
import { TaskDBData, TaskDBCreateFormData } from "interfaces/task";
import * as taskActions from "actions/task";
import * as TaskActionTypes from "constants/taskActionTypes";
import Main from "./Main";
import { ITaskFormProps } from "./TaskListItem";
import { getChangedTaskList } from "./Main.controller";

type State = {};

type ReduxStateProps = {
  groupedTaskList: StoreState["task"]["groupedTaskList"];
  currentTask?: StoreState["task"]["currentTask"];
  currentProject?: StoreState["project"]["currentProject"];
  loading: { [key: string]: boolean | undefined };
};

type ReduxDispatchProps = {
  TaskActions: typeof taskActions;
};

type Props = {} & ReduxStateProps & ReduxDispatchProps;

class MainContainer extends React.Component<Props, State> {
  handleTaskCreate = (partialFormData: ITaskFormProps, cb?: Function) => {
    const { TaskActions, currentProject } = this.props;

    const formData: TaskDBCreateFormData = {
      ...partialFormData,
      order: 0,
      process: "toDo"
    };
    if (currentProject) {
      formData.projectId = currentProject._id;
    }

    TaskActions.createTask(formData, cb);
  };

  handleTaskUpdate = (newTask: TaskDBData, cb?: Function) => {
    const { TaskActions } = this.props;
    TaskActions.updateTask(newTask, cb);
  };

  handleTaskDelete = (task: TaskDBData, cb?: Function) => {
    const { TaskActions } = this.props;
    TaskActions.deleteTask(task, cb);
  };

  handleSetGroupedTaskList = (
    groupedTaskList: StoreState["task"]["groupedTaskList"]
  ) => {
    const {
      TaskActions,
      groupedTaskList: previousGroupedTasklist
    } = this.props;
    const changedTaskList = getChangedTaskList(
      groupedTaskList,
      previousGroupedTasklist
    );

    TaskActions.setGroupedTaskList({ groupedTaskList });
    TaskActions.updateTaskList(changedTaskList);
  };

  render() {
    const {
      handleTaskCreate,
      handleTaskUpdate,
      handleTaskDelete,
      handleSetGroupedTaskList
    } = this;
    const { groupedTaskList, loading } = this.props;

    const fetchTaskLoading =
      loading[TaskActionTypes.GET_TASK_LIST_LOCAL] || false;

    return (
      <React.Fragment>
        <Main
          handleTaskCreate={handleTaskCreate}
          handleTaskUpdate={handleTaskUpdate}
          handleTaskDelete={handleTaskDelete}
          handleSetGroupedTaskList={handleSetGroupedTaskList}
          groupedTaskList={groupedTaskList}
          fetchTaskLoading={fetchTaskLoading}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  (state: StoreState) => ({
    groupedTaskList: state.task.groupedTaskList,
    currentTask: state.task.currentTask,
    currentProject: state.project.currentProject,
    loading: state.pender.pending
  }),
  dispatch => ({
    TaskActions: bindActionCreators(taskActions, dispatch)
  })
)(MainContainer);
