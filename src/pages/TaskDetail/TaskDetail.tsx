import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Grid, Container } from "@material-ui/core";
import { ITaskRecord } from "interfaces/task";
import { Name, Description, DueDate, SubTaskList } from "systems/TaskDetail";
import { ISubTaskFormProps } from "../../systems/TaskDetail/index";
import { ISubTaskRecord } from "../../interfaces/task";
import { List } from "immutable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      flexGrow: 1,
      padding: theme.spacing(3)
      // backgroundColor: "rgba(243, 243, 243, 0.4);"
    },
    toolbar: theme.mixins.toolbar,
    titleContainer: {
      marginBottom: theme.spacing(1)
    },
    title: {
      fontSize: "20px",
      padding: theme.spacing(0.5, 0, 0.5, 1),
      letterSpacing: "0px"
    },
    titleForm: {
      fontSize: "20px",
      "& input": {
        padding: theme.spacing(0.5, 0, 0.5, 1),
        fontSize: "20px",
        minHeight: "28px",
        backgroundColor: "white"
      }
    },
    addIcon: {
      padding: theme.spacing(0, 2),
      verticalAlign: "top"
    },
    textField: {
      "& input": {
        fontSize: "14px",
        lineHeight: "20px"
      }
    },
    textBox: {
      width: "100%",
      alignItems: "top",
      backgroundColor: "white",
      padding: theme.spacing(1, 2),
      margin: theme.spacing(1, 0),
      fontSize: "14px",
      borderRadius: "3px",
      minHeight: "48px",
      lineHeight: 1.5,
      boxShadow: "0 1px 0 rgba(9,30,66,.25)",
      display: "relative",
      "&:hover": {
        "& .editButton": {
          display: "block"
        }
      },
      "& textarea": {
        lineHeight: 1.5
      },
      "& p::before": {
        content: "⚠ "
      }
    },
    editButton: {
      position: "absolute",
      right: 5,
      top: 8,
      display: "none",
      padding: theme.spacing(1),
      "& svg": {
        width: "18px",
        height: "18px"
      }
    }
  })
);

type Props = {
  task: ITaskRecord;
  handleUpdateName: (name: string, cb?: Function) => void;
  handleUpdateDescription: (description: string, cb?: Function) => void;
  handleUpadteDueDate: (dueDate?: Date, cb?: Function) => void;
  handleSubTaskCreate: (
    partialFormData: ISubTaskFormProps,
    cb?: Function
  ) => void;
  handleSubTaskUpdate: (newSubTask: ISubTaskRecord, cb?: Function) => void;
  handleSubTaskDelete: (subTask: ISubTaskRecord, cb?: Function) => void;
  handleSubTaskListUpdate: (
    newSubTaskList: List<ISubTaskRecord>,
    cb?: Function
  ) => void;
};

const TaskDetail: React.FC<Props> = ({
  task,
  handleUpdateName,
  handleUpdateDescription,
  handleUpadteDueDate,
  handleSubTaskCreate,
  handleSubTaskUpdate,
  handleSubTaskDelete,
  handleSubTaskListUpdate
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Container className={classes.root}>
        <div className={classes.toolbar} />
        <Grid container spacing={2}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12} className={classes.titleContainer}>
              <Name task={task} handleUpdateName={handleUpdateName} />
            </Grid>
            <Grid item xs={12}>
              <Description
                placeholder={"Add Description"}
                description={task.description}
                handleUpdateDescription={handleUpdateDescription}
              />
            </Grid>
            <Grid item xs={12}>
              <DueDate
                dueDate={task.dueAt}
                handleUpadteDueDate={handleUpadteDueDate}
              />
            </Grid>
            <Grid item xs={12}>
              <SubTaskList
                task={task}
                handleSubTaskCreate={handleSubTaskCreate}
                handleSubTaskUpdate={handleSubTaskUpdate}
                handleSubTaskDelete={handleSubTaskDelete}
                handleSubTaskListUpdate={handleSubTaskListUpdate}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default TaskDetail;
