import React from "react";
import {
  Grid,
  List,
  Box,
  Paper,
  ListItem,
  ListItemText,
  CircularProgress
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TaskListItem, { ITaskFormProps } from "./TaskListItem";
import { StoreState } from "store/modules";
import { TaskDBData } from "interfaces/task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import { processDragEnd, getListStyle, getItemStyle } from "./Main.controller";
import { ProcessTypes } from "../../interfaces/task";

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
      backgroundColor: "#5eb7af29",
      padding: theme.spacing(0, 0.5),
      marginTop: theme.spacing(1),
      borderRadius: "5px"
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
    }
  })
);

type IMainProps = {
  groupedTaskList: StoreState["task"]["groupedTaskList"];
  fetchTaskLoading: boolean;
  handleTaskCreate: (formData: ITaskFormProps, cb?: Function) => void;
  handleTaskUpdate: (newTask: TaskDBData, cb?: Function) => void;
  handleTaskDelete: (task: TaskDBData, cb?: Function) => void;
  handleSetGroupedTaskList: (
    groupedTaskList: StoreState["task"]["groupedTaskList"]
  ) => void;
};

const Main: React.FC<IMainProps> = ({
  groupedTaskList,
  fetchTaskLoading,
  handleTaskCreate,
  handleTaskUpdate,
  handleTaskDelete,
  handleSetGroupedTaskList
}) => {
  const classes = useStyles();
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newGroupedTaskList = processDragEnd(
      result.source,
      result.destination,
      groupedTaskList
    );
    handleSetGroupedTaskList(newGroupedTaskList);
  };

  const listInfoList: { label: string; value: ProcessTypes }[] = [
    { label: "Doing", value: "doing" },
    { label: "ToDo", value: "toDo" }
  ];
  return (
    <React.Fragment>
      <main className={classes.root}>
        <div className={classes.toolbar} />
        <Grid>
          <TaskListItem handleTaskCreate={handleTaskCreate} />
        </Grid>

        <DragDropContext onDragEnd={handleDragEnd}>
          {listInfoList.map(listInfo => {
            return (
              <Paper
                key={listInfo.value}
                elevation={2}
                className={classes.taskListContainer}
              >
                <Box fontSize="1rem">{listInfo.label}</Box>
                <Droppable droppableId={listInfo.value}>
                  {(provided, snapshot) => {
                    const taskList = groupedTaskList[listInfo.value];
                    return (
                      <List
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={classes.taskList}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {taskList.length === 0 ? (
                          <div>
                            <ListItem className={classes.textBox} dense>
                              {fetchTaskLoading ? (
                                <Grid container justify="center">
                                  <CircularProgress />
                                </Grid>
                              ) : (
                                <ListItemText>
                                  <Box textAlign="center" fontSize="1rem">
                                    {`No ${listInfo.label} Task `}
                                    <FontAwesomeIcon icon={faSmile} />
                                  </Box>
                                </ListItemText>
                              )}
                            </ListItem>
                          </div>
                        ) : (
                          <React.Fragment>
                            {taskList.map((task, index) => {
                              return (
                                <Draggable
                                  key={task._id}
                                  draggableId={task._id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                      )}
                                    >
                                      <TaskListItem
                                        task={task}
                                        key={task._id}
                                        handleTaskUpdate={handleTaskUpdate}
                                        handleTaskDelete={handleTaskDelete}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </React.Fragment>
                        )}
                      </List>
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
