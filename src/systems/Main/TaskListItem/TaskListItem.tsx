import * as React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ITaskRecord } from "interfaces/task";
import { TaskBox, TaskFormBox, TaskAddBox } from "systems/Main";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    textBox: {
      backgroundColor: "white",
      padding: theme.spacing(0.5, 0),
      fontSize: "14px",
      borderRadius: "3px",
      // minHeight: "48px",
      boxShadow: "0 1px 0 rgba(9,30,66,.25)",
      display: "relative",
      "&:hover": {
        "& .editButton": {
          display: "block"
        }
      },
      "& p::before": {
        content: "⚠ "
      }
    },
    subInfoGrid: {
      padding: theme.spacing(0.5, 0, 0.5, 5),
      fontSize: "0.8rem",
      "& > div": {
        marginRight: theme.spacing(0.5)
      }
    },
    icon: {
      marginRight: theme.spacing(1)
    },
    editButton: {
      position: "absolute",
      right: 5,
      display: "none",
      padding: theme.spacing(0.5),
      "& svg": {
        width: "18px",
        height: "18px"
      }
    },
    form: {
      width: "100%",
      "& input": {
        padding: theme.spacing(1)
      }
    },
    checkbox: {
      paddingLeft: theme.spacing(0.5),
      "& > span": {
        padding: theme.spacing(0.5)
      },
      "& svg": {
        width: "20px",
        height: "20px"
      }
    },
    addIcon: {
      padding: "0 11px"
    },
    errorMessage: {
      position: "absolute",
      right: 10,
      top: 0
    },
    anchorMenuPaper: {
      width: "120px",
      "& ul": {
        padding: theme.spacing(1, 0)
      },
      "& li": {
        height: "30px",
        fontSize: "0.8rem"
      }
    },
    drawerMenu: {
      "& li": {
        minHeight: "36px"
      }
    },
    canceledText: {
      textDecoration: "line-through !important",
      color: "grey"
    },
    dueDate: {
      color: "#5e6c84",
      borderRadius: "3px",
      fontSize: "12px"
    },
    overDueDate: {
      backgroundColor: "#fb7563",
      borderRadius: "3px",
      color: "white",
      fontSize: "12px"
    }
  })
);

export type ITaskFormProps = {
  _id?: string;
  name: string;
};

export interface IProps {
  task?: ITaskRecord;
  handleToggle?: (updatedTask: ITaskRecord) => void;
  handleTaskCreate?: (formData: ITaskFormProps, cb?: Function) => void;
  handleTaskUpdate?: (newTask: ITaskRecord, cb?: Function) => void;
  handleTaskDelete?: (task: ITaskRecord, cb?: Function) => void;
  handleTaskDetailLinkClick?: (task: ITaskRecord) => void;
}

function TaskListItem(props: IProps) {
  const {
    task,
    handleToggle,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
    handleTaskDetailLinkClick
  } = props;
  const classes = useStyles();
  const [isEditMode, setEditMode] = React.useState(false);

  const handleEditButtonClick = () => {
    setEditMode(true);
  };
  const handleEditTextfieldBlur = () => {
    setEditMode(false);
  };
  const handleDeleteButtonClick = (cb?: Function) => {
    if (handleTaskDelete && task) {
      handleTaskDelete(task, cb);
    }
  };

  const handleCheckboxToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (task && handleToggle) {
      const prevProcess = task.process;
      let newTask = task;
      if (prevProcess === "done") {
        newTask = task.set("process", "toDo");
      } else {
        newTask = task.set("process", "done");
      }
      handleToggle(newTask);
    }
    event.stopPropagation();
  };

  const handleSubmit = (data: unknown, createCallback?: Function) => {
    const formData: ITaskFormProps = data as ITaskFormProps;
    if (handleTaskCreate) {
      // Create
      handleTaskCreate(formData, () => {
        if (createCallback) createCallback();
      });
    } else if (task && handleTaskUpdate) {
      // Update
      const newTask = task.set("name", formData.name);
      handleTaskUpdate(newTask, () => handleEditTextfieldBlur());
    }
  };

  const handleDoubleClick = () => {
    if (handleTaskDetailLinkClick && task) {
      handleTaskDetailLinkClick(task);
    }
  };

  if (isEditMode) {
    return (
      <Grid container alignItems="center">
        <TaskFormBox
          classes={classes}
          onSubmit={handleSubmit}
          onBlur={handleEditTextfieldBlur}
          task={task}
        />
      </Grid>
    );
  }

  return (
    <Grid container alignItems="center">
      {task ? (
        <TaskBox
          classes={classes}
          handleCheckboxToggle={handleCheckboxToggle}
          handleEditButtonClick={handleEditButtonClick}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleDoubleClick={handleDoubleClick}
          task={task}
        />
      ) : (
        <TaskAddBox
          classes={classes}
          handleEditButtonClick={handleEditButtonClick}
        />
      )}
    </Grid>
  );
}

const isPropsEqual = (
  prevProps: Readonly<IProps>,
  nextProps: Readonly<IProps>
) => {
  return prevProps.task === nextProps.task;
};

export default React.memo(TaskListItem, isPropsEqual);
