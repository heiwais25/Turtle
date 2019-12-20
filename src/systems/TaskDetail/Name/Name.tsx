import React from "react";
import { Box } from "@material-ui/core";
import { NameFormBox } from "systems/TaskDetail";
import { ITaskRecord } from "../../../interfaces/task";
import { INameFormProps } from "../NameFormBox/NameFormBox";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleContainer: {
      marginBottom: theme.spacing(1)
    },
    title: {
      fontSize: "20px",
      padding: theme.spacing(0.5, 0, 0.5, 1),
      letterSpacing: "0px"
    },
    titleForm: {
      position: "relative",
      fontSize: "20px",
      "& input": {
        padding: theme.spacing(0.5, 0, 0.5, 1),
        fontSize: "20px",
        minHeight: "28px",
        backgroundColor: "white"
      }
    },
    errorMessage: {
      position: "absolute",
      fontSize: "16px",
      right: 10,
      top: -8
    }
  })
);

type NameProps = {
  task: ITaskRecord;
  handleUpdateName: (name: string, cb?: Function) => void;
};
const Name: React.FC<NameProps> = ({ task, handleUpdateName }) => {
  const classes = useStyles();
  const [isEditMode, setEditMode] = React.useState(false);

  function handleNameClick() {
    setEditMode(true);
  }

  function hanldeNameFormBlur() {
    setEditMode(false);
  }

  function handleSubmit(data: unknown) {
    const formData = data as INameFormProps;

    handleUpdateName(formData.name, hanldeNameFormBlur);
  }

  if (isEditMode) {
    return (
      <NameFormBox
        task={task}
        onBlur={hanldeNameFormBlur}
        classes={classes}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <Box className={classes.title} onClick={handleNameClick}>
      {task.name}
    </Box>
  );
};

export default Name;
