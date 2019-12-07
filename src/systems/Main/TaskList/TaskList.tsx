import React from "react";
import {
  List,
  ListItem,
  Grid,
  CircularProgress,
  ListItemText,
  Box
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import {
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { List as ImmutableList } from "immutable";
import * as MainService from "services/Main/MainService";
import { ITaskRecord } from "interfaces/task";
import { ProcessTypes } from "electronMain/interfaces/task";
import TaskListItem from "../TaskListItem";
import classNames from "classnames";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    taskList: {
      width: "100%",
      transition: "opacity 1s ease-out",
      padding: 0,
      "& > div > div": {
        paddingBottom: theme.spacing(0.5)
      }
    },
    textBox: {
      padding: theme.spacing(0),
      fontSize: "1rem",
      height: "56px"
    },
    taskCount: {
      paddingBottom: theme.spacing(0.5)
    },
    visibleItem: {
      display: "block"
    },
    invisibleItem: {
      display: "none"
    }
  })
);

interface IProps {
  provided: DroppableProvided;
  fetchTaskLoading: boolean;
  taskList: ImmutableList<ITaskRecord>;
  snapshot: DroppableStateSnapshot;
  isExpanded: boolean;
  handleTaskToggle: (task: ITaskRecord) => void;
  handleTaskUpdate: (newTask: ITaskRecord, cb?: Function) => void;
  handleTaskDelete: (task: ITaskRecord, cb?: Function) => void;
  handleTaskDetailLinkClick: (task: ITaskRecord) => void;
  listInfo: { label: string; value: ProcessTypes };
}

const TaskList: React.FC<IProps> = ({
  snapshot,
  provided,
  taskList,
  listInfo,
  isExpanded,
  fetchTaskLoading,
  handleTaskToggle,
  handleTaskUpdate,
  handleTaskDelete,
  handleTaskDetailLinkClick
}) => {
  const classes = useStyles();

  const emptyList = (
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
  );

  const contractedList = (
    <ListItem className={classes.textBox} dense>
      {fetchTaskLoading ? (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      ) : (
        <ListItemText>
          <Box textAlign="center" fontSize="1rem">
            {`${taskList.size} Tasks `}
            <FontAwesomeIcon icon={faSmile} />
          </Box>
        </ListItemText>
      )}
    </ListItem>
  );

  return (
    <List
      {...provided.droppableProps}
      ref={provided.innerRef}
      className={classes.taskList}
      style={MainService.getListStyle(snapshot.isDraggingOver)}
    >
      {taskList.size === 0 ? (
        <div>{emptyList}</div>
      ) : !isExpanded ? (
        <div className={classNames(classes.taskCount)}>{contractedList}</div>
      ) : (
        <React.Fragment>
          {taskList.map((task, index) => {
            return (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={MainService.getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <TaskListItem
                      task={task}
                      key={task._id}
                      handleToggle={handleTaskToggle}
                      handleTaskUpdate={handleTaskUpdate}
                      handleTaskDelete={handleTaskDelete}
                      handleTaskDetailLinkClick={handleTaskDetailLinkClick}
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
};

const isPropsEqual = (
  prevProps: Readonly<IProps>,
  nextProps: Readonly<IProps>
) => {
  return (
    prevProps.fetchTaskLoading === nextProps.fetchTaskLoading &&
    prevProps.taskList === nextProps.taskList &&
    prevProps.snapshot === nextProps.snapshot &&
    prevProps.provided === nextProps.provided
  );
};

export default React.memo(TaskList, isPropsEqual);
