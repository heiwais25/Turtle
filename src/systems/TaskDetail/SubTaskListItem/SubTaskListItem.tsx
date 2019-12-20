import * as React from "react";
import { Grid } from "@material-ui/core";
import { ISubTaskRecord } from "../../../interfaces/task";
import { SubTaskFormBox, SubTaskBox } from "systems/TaskDetail";
import { ISubTaskFormProps } from "../index";

export interface IProps {
  classes: { [key: string]: string };
  subTask: ISubTaskRecord;
  handleSubTaskUpdate: (newSubTask: ISubTaskRecord, cb?: Function) => void;
  handleSubTaskDelete: (subTask: ISubTaskRecord, cb?: Function) => void;
}

const SubTaskListItem: React.FC<IProps> = ({
  classes,
  subTask,
  handleSubTaskUpdate,
  handleSubTaskDelete
}) => {
  const [editMode, setEditMode] = React.useState(false);

  const handleEditButtonClick = () => {
    setEditMode(true);
  };

  const handleEditTextfieldBlur = () => {
    setEditMode(false);
  };

  const handleDeleteButtonClick = (cb?: Function) => {
    handleSubTaskDelete(subTask, cb);
  };

  const handleCheckboxToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // Set checkbox to
    handleSubTaskUpdate(
      subTask.update("isFinished", isFinished => !isFinished)
    );
    event.stopPropagation();
  };

  const handleSubmit = (data: unknown, createCallback?: Function) => {
    const formData: ISubTaskFormProps = data as ISubTaskFormProps;
    handleSubTaskUpdate(subTask.set("name", formData.name), () =>
      handleEditTextfieldBlur()
    );
  };

  if (editMode) {
    return (
      <Grid container alignItems="center">
        <SubTaskFormBox
          classes={classes}
          onSubmit={handleSubmit}
          onBlur={handleEditTextfieldBlur}
          subTask={subTask}
        />
      </Grid>
    );
  }

  return (
    <Grid container alignItems="center">
      <SubTaskBox
        classes={classes}
        handleCheckboxToggle={handleCheckboxToggle}
        handleEditButtonClick={handleEditButtonClick}
        handleDeleteButtonClick={handleDeleteButtonClick}
        subTask={subTask}
      />
    </Grid>
  );
};

const isPropsEqual = (
  prevProps: Readonly<IProps>,
  nextProps: Readonly<IProps>
) => {
  return prevProps.subTask === nextProps.subTask;
};

export default React.memo(SubTaskListItem, isPropsEqual);
