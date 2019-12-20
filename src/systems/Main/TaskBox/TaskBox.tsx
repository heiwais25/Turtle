import * as React from "react";
import {
  ListItem,
  Grid,
  Box,
  Checkbox,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import classNames from "classnames";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import { ITaskRecord } from "../../../interfaces/task";

type ITaskBoxProps = {
  classes: { [key: string]: string };
  handleCheckboxToggle: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleEditButtonClick: () => void;
  handleDeleteButtonClick: (cb?: Function) => void;
  handleDoubleClick: () => void;
  task: ITaskRecord;
};

const initialState = {
  mouseX: null,
  mouseY: null
};

// Just visualize the information of task
const TaskBox: React.FC<ITaskBoxProps> = ({
  classes,
  task,
  handleCheckboxToggle,
  handleDeleteButtonClick,
  handleEditButtonClick,
  handleDoubleClick
}) => {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!state.mouseY) {
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4
      });
    } else {
      setState(initialState);
    }
    event.stopPropagation();
    event.preventDefault();
  };
  const handleClose = () => {
    setState(initialState);
  };

  const handleDeleteButtonClickWithCallback = () => {
    handleDeleteButtonClick(handleClose);
  };

  const isChecked = task.process === "done";
  const hasExtra = !!task.description || !!task.dueAt;
  const overDate = task.dueAt
    ? moment().isAfter(moment(task.dueAt), "day")
    : false;

  const menu = (
    <Menu
      id="simple-menu"
      keepMounted
      anchorReference="anchorPosition"
      open={state.mouseY !== null}
      onClose={handleClose}
      classes={{
        paper: classes.anchorMenuPaper
      }}
      className={classes.drawerMenu}
      anchorPosition={
        state.mouseY !== null && state.mouseX !== null
          ? { top: state.mouseY, left: state.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={handleDoubleClick}>
        <ListItemIcon>
          <MoreIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Detail" />
      </MenuItem>
      <MenuItem onClick={handleEditButtonClick}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleDeleteButtonClickWithCallback}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </MenuItem>
    </Menu>
  );

  return (
    <Grid container onContextMenu={handleContextMenu}>
      <ListItem
        onDoubleClick={handleDoubleClick}
        button
        className={classNames(classes.textBox, {
          [classes.canceledText]: isChecked
        })}
        dense
      >
        <Grid container alignItems="center">
          <Grid container item xs={12} alignItems="center">
            <ListItemIcon className={classes.checkbox}>
              <Checkbox onClick={handleCheckboxToggle} checked={isChecked} />
            </ListItemIcon>

            <Box display="inline">{task.name}</Box>
            <IconButton
              className={classNames(classes.editButton, "editButton")}
              onClick={handleEditButtonClick}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Grid>
          {hasExtra && (
            <Grid
              container
              item
              spacing={1}
              xs={12}
              className={classes.subInfoGrid}
            >
              {task.description && (
                <Grid item>
                  <Box fontSize="inherit">
                    <FontAwesomeIcon icon={faAlignJustify} />
                  </Box>
                  {/* <NotesIcon fontSize="inherit" /> */}
                </Grid>
              )}
              {task.dueAt && (
                <Grid
                  item
                  className={overDate ? classes.overDueDate : classes.dueDate}
                >
                  <Box fontSize="inherit">
                    <FontAwesomeIcon icon={faClock} />
                    {` ${moment(task.dueAt).format("MMM Do")}`}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </ListItem>
      {menu}
    </Grid>
  );
};

export default React.memo(TaskBox);
