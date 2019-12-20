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
  MenuItem
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import classNames from "classnames";
import { ISubTaskRecord } from "../../../interfaces/task";

type ISubTaskBoxProps = {
  classes: { [key: string]: string };
  handleCheckboxToggle: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleEditButtonClick: () => void;
  handleDeleteButtonClick: (cb?: Function) => void;
  subTask: ISubTaskRecord;
};

const initialState = {
  mouseX: null,
  mouseY: null
};

// Just visualize the information of task
const SubTaskBox: React.FC<ISubTaskBoxProps> = ({
  classes,
  subTask,
  handleCheckboxToggle,
  handleDeleteButtonClick,
  handleEditButtonClick
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
      <MenuItem onClick={handleEditButtonClick}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit" />
      </MenuItem>
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
        button
        className={classNames(classes.textBox, {
          [classes.finishedTask]: subTask.isFinished
        })}
        dense
      >
        <Grid container alignItems="center">
          <Grid container item xs={12} alignItems="center">
            <ListItemIcon className={classes.checkbox}>
              <Checkbox
                onClick={handleCheckboxToggle}
                checked={subTask.isFinished}
              />
            </ListItemIcon>

            <Box display="inline">{subTask.name}</Box>
            <IconButton
              className={classNames(classes.editButton, "editButton")}
              onClick={handleEditButtonClick}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </ListItem>
      {menu}
    </Grid>
  );
};

export default React.memo(SubTaskBox);
