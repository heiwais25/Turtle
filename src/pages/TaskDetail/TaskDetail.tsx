import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Grid, Box, Paper, Container } from "@material-ui/core";
import { ITaskRecord } from "../../interfaces/task";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      flexGrow: 1,
      padding: theme.spacing(3),
      backgroundColor: "rgba(243, 243, 243, 0.4);"
    },
    toolbar: theme.mixins.toolbar,

    taskListContainer: {
      backgroundColor: "#e5f5f3",
      padding: theme.spacing(0.5),
      paddingBottom: 0,
      marginTop: theme.spacing(1),
      borderRadius: "5px"
    },
    taskListTitle: {
      "&:hover": {}
    },
    taskList: {
      padding: 0,
      "& > div": {
        paddingBottom: theme.spacing(0.5)
      }
    },
    textBox: {
      padding: theme.spacing(0),
      fontSize: "1rem",
      height: "56px"
    },
    moreIcon: {
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
};

const TaskDetail: React.FC<Props> = ({ task }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Container className={classes.root}>
        <div className={classes.toolbar} />
        <Grid>
          <Box fontSize={"1.2rem"}>{task.name}</Box>
        </Grid>
        <Paper>
          <Grid>description</Grid>
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export default TaskDetail;
