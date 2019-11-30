import React from "react";
import {
  ListItem,
  Box,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { IProjectRecord } from "interfaces/project";

type DrawlerListItemProps = {
  classes: { [key: string]: string };
  project: IProjectRecord;
  selected: boolean;
  handleEditingProjectChange: (project: IProjectRecord) => void;
  handleDeleteDialogOpen: (project: IProjectRecord) => void;
  handleCurrentProjectChange: (project: IProjectRecord) => void;
};

const initialState = {
  mouseX: null,
  mouseY: null
};

const DrawlerListItem: React.FC<DrawlerListItemProps> = ({
  classes,
  project,
  selected,
  handleEditingProjectChange,
  handleDeleteDialogOpen,
  handleCurrentProjectChange
}) => {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!state.mouseY) {
      handleCurrentProjectChange(project);
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

  const handleEditButtonClick = () => {
    handleEditingProjectChange(project);
    handleClose();
  };

  const handleDeleteButtonClick = () => {
    handleDeleteDialogOpen(project);
    handleClose();
  };

  const handleListItemClick = () => {
    handleCurrentProjectChange(project);
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
      <MenuItem onClick={handleDeleteButtonClick}>
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
        dense
        className={classes.drawerListItem}
        key={project.name}
        onClick={handleListItemClick}
        selected={selected}
      >
        <ListItemText>
          <Box paddingLeft={2} fontSize="0.9rem">
            {project.name}
          </Box>
        </ListItemText>
      </ListItem>
      {menu}
    </Grid>
  );
};

const isPropsEqual = (
  prevProps: Readonly<React.PropsWithChildren<DrawlerListItemProps>>,
  nextProps: Readonly<React.PropsWithChildren<DrawlerListItemProps>>
) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.project === nextProps.project
  );
};

export default React.memo(DrawlerListItem, isPropsEqual);
