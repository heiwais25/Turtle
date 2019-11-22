import React from "react";
import { Grid, Box, Paper, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TaskListItem, { ITaskFormProps } from "./TaskListItem";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { ProcessTypes } from "../../electronMain/interfaces/task";
import { ITaskListGroupRecord } from "interfaces/task";
import { ITaskRecord } from "../../interfaces/task";
import TaskList from "./TaskList";

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

type IMainProps = {
  taskListGroup: ITaskListGroupRecord;
  fetchTaskLoading: boolean;
  handleTaskCreate: (formData: ITaskFormProps, cb?: Function) => void;
  handleTaskUpdate: (newTask: ITaskRecord, cb?: Function) => void;
  handleTaskDelete: (task: ITaskRecord, cb?: Function) => void;
  handleTaskToggle: (task: ITaskRecord) => void;
  handleTaskDragEnd: (result: DropResult) => void;
};

const Main: React.FC<IMainProps> = ({
  taskListGroup,
  fetchTaskLoading,
  handleTaskCreate,
  handleTaskUpdate,
  handleTaskDelete,
  handleTaskDragEnd,
  handleTaskToggle
}) => {
  const classes = useStyles();

  const listInfoList: { label: string; value: ProcessTypes }[] = [
    { label: "Doing", value: "doing" },
    { label: "ToDo", value: "toDo" },
    { label: "Done", value: "done" }
  ];

  const [isExpandedList, setExpandedList] = React.useState<boolean[]>([
    true,
    true,
    false
  ]);
  const handleExpandButtonToggle = (index: number) => {
    const newIsExpandedList = isExpandedList.slice();
    newIsExpandedList[index] = !newIsExpandedList[index];
    setExpandedList(newIsExpandedList);
  };

  return (
    <React.Fragment>
      <main className={classes.root}>
        <div className={classes.toolbar} />
        <Grid>
          <TaskListItem handleTaskCreate={handleTaskCreate} />
        </Grid>

        <DragDropContext onDragEnd={handleTaskDragEnd}>
          {listInfoList.map((listInfo, index) => {
            return (
              <Paper
                key={listInfo.value}
                elevation={2}
                className={classes.taskListContainer}
              >
                <Grid
                  container
                  justify="space-between"
                  alignItems="center"
                  className={classes.taskListTitle}
                >
                  <Box fontSize="1rem" p={1}>
                    {listInfo.label}
                  </Box>
                  <IconButton
                    className={classes.moreIcon}
                    onClick={() => handleExpandButtonToggle(index)}
                  >
                    {isExpandedList[index] ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </IconButton>
                </Grid>
                <Droppable droppableId={listInfo.value}>
                  {(provided, snapshot) => {
                    const taskList = taskListGroup[listInfo.value];
                    return (
                      <TaskList
                        provided={provided}
                        snapshot={snapshot}
                        isExpanded={isExpandedList[index]}
                        fetchTaskLoading={fetchTaskLoading}
                        taskList={taskList}
                        handleTaskToggle={handleTaskToggle}
                        handleTaskUpdate={handleTaskUpdate}
                        handleTaskDelete={handleTaskDelete}
                        listInfo={listInfo}
                      />
                    );
                  }}
                </Droppable>
              </Paper>
            );
          })}
        </DragDropContext>
      </main>
    </React.Fragment>
  );
};

export default Main;
