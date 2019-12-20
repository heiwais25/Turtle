import React from "react";
import AddIcon from "@material-ui/icons/Add";
import { ListItem, ListItemIcon, ListItemText, Box } from "@material-ui/core";

type ITaskAddBoxProps = {
  classes: { [key: string]: string };
  handleEditButtonClick: () => void;
};

// In the case of addition of task
const TaskAddBox: React.FC<ITaskAddBoxProps> = ({
  classes,
  handleEditButtonClick
}) => {
  return (
    <ListItem
      button
      onClick={handleEditButtonClick}
      className={classes.textBox}
      dense
    >
      <ListItemIcon className={classes.addIcon}>
        <AddIcon />
      </ListItemIcon>
      <ListItemText>
        <Box display="inline" fontSize="1rem">
          Add New Task
        </Box>
      </ListItemText>
    </ListItem>
  );
};

export default React.memo(TaskAddBox);
