import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StoreState } from "store/modules";
import { TaskDBCreateFormData } from "electronMain/interfaces/task";
import * as taskActions from "actions/task";
import * as TaskActionTypes from "constants/taskActionTypes";
import Main from "./Main";
import { IProject } from "../../interfaces/project";
import { ITaskRecord, ITaskListGroupRecord } from "interfaces/task";
import { DropResult } from "react-beautiful-dnd";
import { RouteComponentProps } from "react-router-dom";
import { ITaskFormProps } from "systems/Main";
import * as MainService from "services/Main/MainService";

type State = {};

type ReduxStateProps = {
  taskListGroup: ITaskListGroupRecord;
  currentTask?: ITaskRecord;
  currentProject?: IProject;
  loading: { [key: string]: boolean | undefined };
};

type ReduxDispatchProps = {
  TaskActions: typeof taskActions;
};

type Props = {} & ReduxStateProps & ReduxDispatchProps & RouteComponentProps;

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

  handleTaskUpdate = (newTask: ITaskRecord, cb?: Function) => {
    const { TaskActions, taskListGroup } = this.props;

    const index = taskListGroup[newTask.process].findIndex(
      item => item._id === newTask._id
    );

    if (index < 0) {
      return;
    }

    TaskActions.updateTask(newTask.toJS(), cb);
  };

  handleTaskDelete = (task: ITaskRecord, cb?: Function) => {
    const { TaskActions } = this.props;
    TaskActions.deleteTask(task.toJS(), cb);
  };

  /**
   * Process when the item of task list has changed.
   * The main action inducing this function is like these.
   * 1. Reorder item (within same process)
   * 2. Move item (between two processes)
   * 3. Toggle the checkbox (finish/unfinish task)
   *
   * @memberof MainContainer
   */
  handleGroupedTaskListChange = (taskListGroup: ITaskListGroupRecord) => {
    const { TaskActions, taskListGroup: previousGroupedTasklist } = this.props;
    const changedTaskList = MainService.getChangedTaskList(
      taskListGroup,
      previousGroupedTasklist
    );
    TaskActions.updateTaskListGroup({ taskListGroup });
    TaskActions.updateTaskList(changedTaskList.toJS());
  };

  handleTaskDragEnd = (result: DropResult) => {
    const { taskListGroup } = this.props;

    if (!result.destination) {
      return;
    }
    const newGroupedTaskList = MainService.processDragEnd(
      result.source,
      result.destination,
      taskListGroup
    );
    this.handleGroupedTaskListChange(newGroupedTaskList);
  };

  handleTaskToggle = (updatedTask: ITaskRecord) => {
    const { taskListGroup } = this.props;

    const newGroupedTaskList = MainService.processToggle(
      updatedTask,
      taskListGroup
    );
    this.handleGroupedTaskListChange(newGroupedTaskList);
  };

  handleTaskDetailLinkClick = (task: ITaskRecord) => {
    const { history, TaskActions } = this.props;
    TaskActions.setCurrentTask({ currentTask: task });
    history.push(`/detail/${task._id}`);
  };

  render() {
    const {
      handleTaskCreate,
      handleTaskUpdate,
      handleTaskDelete,
      handleTaskDragEnd,
      handleTaskToggle,
      handleTaskDetailLinkClick
    } = this;
    const { taskListGroup, loading } = this.props;

    const fetchTaskLoading =
      loading[TaskActionTypes.GET_TASK_LIST_LOCAL] || false;

    return (
      <React.Fragment>
        <Main
          handleTaskCreate={handleTaskCreate}
          handleTaskUpdate={handleTaskUpdate}
          handleTaskDelete={handleTaskDelete}
          handleTaskDragEnd={handleTaskDragEnd}
          handleTaskToggle={handleTaskToggle}
          handleTaskDetailLinkClick={handleTaskDetailLinkClick}
          taskListGroup={taskListGroup}
          fetchTaskLoading={fetchTaskLoading}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  (state: StoreState) => ({
    taskListGroup: state.task.taskListGroup,
    currentTask: state.task.currentTask,
    currentProject: state.project.currentProject,
    loading: state.pender.pending
  }),
  dispatch => ({
    TaskActions: bindActionCreators(taskActions, dispatch)
  })
)(MainContainer);
