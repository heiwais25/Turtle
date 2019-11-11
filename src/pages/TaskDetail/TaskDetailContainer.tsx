import React, { Component } from "react";
import TaskDetail from "./TaskDetail";

interface Props {}
interface State {}

export default class TaskDetailContainer extends Component<Props, State> {
  state = {};

  render() {
    return (
      <React.Fragment>
        <TaskDetail />
      </React.Fragment>
    );
  }
}
