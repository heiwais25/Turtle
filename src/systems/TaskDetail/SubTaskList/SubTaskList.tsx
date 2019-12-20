import React from "react";
import { Grid, Box, Button, LinearProgress } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { SubTaskFormBox } from "systems/TaskDetail";
import { ISubTaskFormProps } from "../index";
import { ITaskRecord, ISubTaskRecord } from "interfaces/task";
import _ from "lodash";
import SubTaskListItem from "../SubTaskListItem/SubTaskListItem";
import {
  Draggable,
  Droppable,
  DragDropContext,
  DropResult
} from "react-beautiful-dnd";
import * as TaskDetailService from "services/TaskDetail/TaskDetailService";
import { List } from "immutable";
import { CautionDialog } from "components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progressContainer: {
      padding: theme.spacing(1, 0, 1, 1)
    },
    progressGrid: {
      paddingLeft: theme.spacing(1.5)
    },
    progress: {
      borderRadius: 15
    },
    progressRoot: {
      height: 8
    },
    progressBar: {
      borderRadius: 15
    },
    subTaskListOptions: {
      marginLeft: "auto",
      "& button": {
        marginLeft: theme.spacing(1)
      }
    },
    subTaskAddButton: {
      // padding: theme.spacing(0, 0, 0, 4)
    },
    subTaskAddForm: {
      // padding: theme.spacing(0, 0, 0, 4),
      width: "100%"
    },
    subTaskListGrid: {
      // padding: theme.spacing(0, 0, 0, 4)
    },
    subTaskListItem: {
      paddingBottom: theme.spacing(1)
    },
    textBox: {
      backgroundColor: "white",
      padding: theme.spacing(0),
      marginBottom: theme.spacing(1),
      fontSize: "14px",
      borderRadius: "3px",
      minHeight: "32px",
      boxShadow: "0 1px 0 rgba(9,30,66,.25)",
      display: "relative",
      "&:hover": {
        "& .editButton": {
          display: "block"
        }
      },
      "& input": {
        padding: theme.spacing(1)
      },
      "& p::before": {
        content: "⚠ "
      }
    },
    form: {
      width: "100%",
      height: "100%"
    },
    formTextBox: {
      backgroundColor: "white",
      padding: theme.spacing(0),
      marginBottom: theme.spacing(1),
      fontSize: "14px",
      borderRadius: "3px",
      minHeight: "40px",
      boxShadow: "0 1px 0 rgba(9,30,66,.25)",
      display: "relative",
      "&:hover": {
        "& .editButton": {
          display: "block"
        }
      },
      "& input": {
        padding: theme.spacing(1.5)
      },
      "& p::before": {
        content: "⚠ "
      }
    },
    errorMessage: {
      position: "absolute",
      right: 10,
      top: -4
    },
    editButton: {
      position: "absolute",
      right: 5,
      display: "none",
      padding: theme.spacing(1),
      "& svg": {
        width: "18px",
        height: "18px"
      }
    },
    finishedTask: {
      textDecoration: "line-through !important",
      color: "grey"
    },
    drawerMenu: {
      "& li": {
        minHeight: "36px"
      }
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
    subTaskListContainer: {
      width: "100%"
    }
  })
);

type Props = {
  task: ITaskRecord;
  handleSubTaskCreate: (
    partialFormData: ISubTaskFormProps,
    cb?: Function
  ) => void;
  handleSubTaskUpdate: (newSubTask: ISubTaskRecord, cb?: Function) => void;
  handleSubTaskDelete: (subTask: ISubTaskRecord, cb?: Function) => void;
  handleSubTaskListUpdate: (
    subTaskList: List<ISubTaskRecord>,
    cb?: Function
  ) => void;
};

const SubTaskList: React.FC<Props> = ({
  task,
  handleSubTaskCreate,
  handleSubTaskUpdate,
  handleSubTaskDelete,
  handleSubTaskListUpdate
}) => {
  const classes = useStyles();
  const [listVisible, setListVisible] = React.useState(false);
  const [addFormVisible, setAddFormVisible] = React.useState(false);
  const [finishedTasksHidden, setFinishedTasksHidden] = React.useState(true);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const progressValue = React.useMemo(() => {
    const totalCount = task.subTaskList.size;
    const completedCount = task.subTaskList.filter(item => item.isFinished)
      .size;
    if (totalCount === 0) {
      return 0;
    }

    return _.toInteger((completedCount * 100) / totalCount);
  }, [task]);

  React.useEffect(() => {
    if (task.subTaskList.size > 0) {
      setListVisible(true);
    }
  }, []);

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleSubTaskListClear() {
    const cb = () => {
      handleDialogClose();
    };

    setListVisible(false);
    handleSubTaskListUpdate(task.get("subTaskList").clear(), cb);
  }

  function handleAddListButtonClick() {
    setListVisible(true);
  }

  function handleDeleteListButtonClick() {
    handleDialogOpen();
  }

  function handleAddItemButtonClick() {
    setAddFormVisible(true);
  }

  function handleFilterTaskButtonsToggle() {
    setFinishedTasksHidden(!finishedTasksHidden);
  }

  const handleSubmit = (data: unknown, createCallback?: Function) => {
    const formData: ISubTaskFormProps = data as ISubTaskFormProps;
    const cb = () => {
      if (createCallback) createCallback();
    };
    handleSubTaskCreate(formData, cb);
  };

  function handleCreateFormBlur() {
    setAddFormVisible(false);
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newSubTaskList = TaskDetailService.reorderSubTaskList(
      task.get("subTaskList"),
      source.index,
      destination.index,
      !finishedTasksHidden
    );

    handleSubTaskListUpdate(newSubTaskList, () => {});
  };

  return (
    <React.Fragment>
      <Grid container alignItems="center">
        <Grid item container xs={12} alignItems="center">
          <Box pl={"10px"} fontSize="20px" alignItems="center" display="inline">
            <FontAwesomeIcon icon={faCheckSquare} />
          </Box>
          <Box
            fontSize="1rem"
            fontWeight={600}
            paddingLeft={1.5}
            paddingRight={1}
            alignItems="center"
            display="inline"
          >
            SubTask List
          </Box>
          {!listVisible ? (
            <Grid item>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddListButtonClick}
              >
                Add
              </Button>
            </Grid>
          ) : (
            <Grid item className={classes.subTaskListOptions}>
              <Button
                variant="contained"
                size="small"
                onClick={handleFilterTaskButtonsToggle}
              >
                {finishedTasksHidden ? "Show all tasks" : "Hide finished tasks"}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleDeleteListButtonClick}
              >
                Delete
              </Button>
            </Grid>
          )}
        </Grid>
        {listVisible && (
          <Grid container item xs={12} alignItems="center">
            <Grid
              container
              item
              xs={12}
              className={classes.progressContainer}
              alignItems="center"
            >
              <Grid item>
                <Box
                  width="20px"
                  height="20px"
                  fontSize="11px"
                  textAlign="center"
                  color="text.secondary"
                >
                  {`${progressValue}%`}
                </Box>
              </Grid>
              <Grid item xs className={classes.progressGrid}>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  className={classes.progress}
                  classes={{
                    root: classes.progressRoot,
                    bar: classes.progressBar
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => {
                    return (
                      <div
                        className={classes.subTaskListContainer}
                        ref={provided.innerRef}
                      >
                        {task.subTaskList &&
                          task.subTaskList
                            .filterNot(subTask => {
                              return finishedTasksHidden
                                ? subTask.isFinished
                                : false;
                            })
                            .map((subTask, index) => {
                              return (
                                <Draggable
                                  key={subTask._id}
                                  index={index}
                                  draggableId={subTask._id}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={TaskDetailService.getItemStyle(
                                        provided.draggableProps.style
                                      )}
                                    >
                                      <SubTaskListItem
                                        classes={classes}
                                        subTask={subTask}
                                        handleSubTaskUpdate={
                                          handleSubTaskUpdate
                                        }
                                        handleSubTaskDelete={
                                          handleSubTaskDelete
                                        }
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </DragDropContext>
            </Grid>
            <Grid container item xs={12} className={classes.subTaskListGrid}>
              {addFormVisible ? (
                <div className={classes.subTaskAddForm}>
                  <SubTaskFormBox
                    classes={classes}
                    onSubmit={handleSubmit}
                    onBlur={handleCreateFormBlur}
                  />
                </div>
              ) : (
                <div className={classes.subTaskAddButton}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddItemButtonClick}
                  >
                    Add Item
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
      <CautionDialog
        open={isDialogOpen}
        title={"Delete Subtask list"}
        contentText={"Are you sure to delete the list?"}
        handleAgree={handleSubTaskListClear}
        handleDisagree={handleDialogClose}
      />
    </React.Fragment>
  );
};

export default SubTaskList;
