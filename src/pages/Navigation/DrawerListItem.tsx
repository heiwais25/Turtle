import React from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
  IconButton,
  ListItem,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { ProjectListItemData } from "store/modules/project";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import isEqual from "react-fast-compare";

type DrawlerListItemProps = {
  classes: { [key: string]: string };
  project: ProjectListItemData;
  selected: boolean;
  handleEditingProjectChange: (project: ProjectListItemData) => void;
  handleDeleteDialogOpen: (project: ProjectListItemData) => void;
  handleCurrentProjectChange: (project: ProjectListItemData) => void;
};

const DrawlerListItem: React.FC<DrawlerListItemProps> = ({
  classes,
  project,
  selected,
  handleEditingProjectChange,
  handleDeleteDialogOpen,
  handleCurrentProjectChange
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return (
    <ListItem
      button
      dense
      className={classes.drawerListItem}
      key={project.name}
      onClick={handleListItemClick}
      selected={selected}
    >
      <Box paddingLeft={2} fontSize={"1rem"}>
        {project.name}
      </Box>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{
          paper: classes.anchorMenuPaper
        }}
        className={classes.drawerMenu}
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
    </ListItem>
  );
};

const isPropsEqual = (
  prevProps: Readonly<React.PropsWithChildren<DrawlerListItemProps>>,
  nextProps: Readonly<React.PropsWithChildren<DrawlerListItemProps>>
) => {
  return (
    prevProps.selected === nextProps.selected &&
    isEqual(prevProps.project, nextProps.project)
  );
};

export default React.memo(DrawlerListItem, isPropsEqual);
